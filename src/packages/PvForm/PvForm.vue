<template>
  <div>
    <template v-for="(item, index) in formConfig">
      <slot :item="item">
        <el-form-item
          :key="forms+index"
          :prop="item.name"
          :hidden="item.hidden"
          :width="item.width"
          :style="{'max-width':item.width}"
          :label="item.label"
          :rules="item.validate || item.rules || null"
          class="form-item"
        >
          <template v-if="item.type == 'date'">
            <el-date-picker
              v-model="forms[item.name]"
              :disabled="item.disabled"
              format="yyyy 年 MM 月 dd 日"
              :value-format="item.format || 'yyyy-MM-dd'"
              type="date"
              :picker-options="getDateRange(item.props.dateCondition)"
              :placeholder="placeholder(item.props)"
              :rules="item.rules || null"
            ></el-date-picker>
          </template>
          <template v-else-if="item.type === 'radio'">
            <el-radio
              v-for="opt in item.data"
              :key="'opt1'+opt.val"
              v-model="forms[item.name]"
              :disabled="item.disabled"
              :label="opt.val"
            >{{ opt.label }}</el-radio>
          </template>
          <template v-else-if="item.type === 'cascader'">
            <el-cascader
              v-model="forms[item.name]"
              class="ca-wi"
              :disabled="item.disabled"
              :show-all-levels="false"
              :options="item.data"
              :props="item.props"
              :rules="item.rules || null"
            >
            </el-cascader>
          </template>
          <template v-else-if="item.type === 'select'">
            <!-- v-show="item.hide || true" -->
            <el-select
              v-model="forms[item.name]"
              :multiple="item.props === undefined ? item.multiple === undefined ? false : item.multiple : item.props.selectType === '2'"
              :collapse-tags="item.collapseTags"
              :disabled="item.disabled"
              :placeholder="placeholder(item.props)"
              :rules="item.rules || null"
              clearable
              @change="selectChange(item.name, forms[item.name], item.data)"
            >
              <el-option
                v-for="(opt,sindex) in item.data"
                :key="'opt'+ sindex +opt.val"
                :label="opt.label"
                :value="opt.val"
              />
            </el-select>
          </template>
          <template v-else-if="item.type === 'specialType'">
            <el-input
              v-model="forms[item.name]"
              :disabled="item.disabled"
              :readonly="item.readonly"
              :type="'text'"
              :rows="item.rows"
              resize="none"
              :placeholder="placeholder(item.props)"
              maxlength="100"
              :rules="item.rules || null"
            />
            <template v-if="item.isEdit"><el-button @click="handleSpecial(item, index)">编辑</el-button></template>
          </template>
          <template v-else>
            <el-input
              v-model="forms[item.name]"
              :disabled="item.disabled"
              :readonly="item.readonly"
              :type="item.type || 'text'"
              :rows="item.rows"
              resize="none"
              :placeholder="placeholder(item.props)"
              maxlength="100"
              :rules="item.rules || null"
            />

          </template>
        </el-form-item>
      </slot>
    </template>
  </div>

</template>
<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
Vue.use(ElementUI)
Vue.use(VXETable)
export default {
  name: 'pv-form',
  props: {
    // approval: {
    //   type: Boolean,
    //   default: false
    // },
    formConfig: {
      type: Array,
      default: _ => []
    },
    forms: {
      type: Object,
      default: _ => {}
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
    console.log(this.formConfig)
  },
  methods: {
    // 日期范围处理
    getDateRange (val) {
      if (val === '1') {
        return {
          disabledDate (time) {
            return time.getTime() < Date.now()
          }
        }
      } else if (val === '2') {
        return {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        }
      } else if (val === '3') {
        return {
          disabledDate (time) {
            return time.getTime() > Date.now() - 8.64e7
          }
        }
      } else if (val === '4') {
        return {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        }
      }
    },
    placeholder (props) {
      // eslint-disable-next-line no-mixed-operators
      return props && props.placeholder || ''
    },
    handleSpecial (item, index) {
      this.$emit('handleSpecial', item, index)
    },
    selectChange (name, val, list) {
      if (name === 'flowformAttachFormat') {
        const valArr = []
        list.forEach(item => {
          if (val.includes(item.val)) {
            valArr.push(item.label)
          }
        })
        this.$emit('selectChange', valArr.join())
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.el-scrollbar .el-cascader-menu{
  min-width: 205px;
}

::v-deep .el-form-item__content {
  display: flex;
  div {
    flex: 1;
  }
  button {
    margin-left: 6px !important;
  }
}
</style>
