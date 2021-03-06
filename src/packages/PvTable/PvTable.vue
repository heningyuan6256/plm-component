<template>
  <div>
    <vxe-toolbar
      v-if="tool"
      perfect
      :custom="filter"
    >
      <!-- <el-button>导出</el-button> -->
      <template v-slot:buttons>
        <vxe-input
          v-if="search"
          v-model="searchVal"
          class="query"
          size="small"
          placeholder="搜索"
          @keyup.enter.native="getTableList"
        >
          <template v-slot:suffix>
            <span @click="getTableList">
              <i
                class="el-icon-search"
              />
            </span>
          </template>
        </vxe-input>
      </template>
      <template v-slot:tools>
        <span
          v-if="btnFlag"
          class="btn-sty"
        >
          <el-button
            v-for="(item, index) in buttonColumn"
            :key="index"
            :type="item.type"
            size="mini"
            @click="dealEvent(item.name)"
          >{{ item.label }}</el-button>
        </span>
        <el-button
          v-if="exportVisible"
          size="mini"
          @click="exportData"
        >
          导出
        </el-button>
        <el-button
          v-if="printVisible"
          size="mini"
          type="info"
          class="pd-10"
          @click="printEvent"
        >
          打印
        </el-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      id="table"
      ref="xTable"
      class="table"
      keep-source
      v-bind="$attrs"
      :custom-config="{ storage: filter, checkMethod: checkColumnMethod }"
      :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
      :cell-style="cellStyle"
      highlight-current-row
      highlight-hover-row
      show-overflow
      border
      resizable
      round
      v-on="$listeners"
      @checkbox-all="selectAllEvent"
      @checkbox-change="selectChangeEvent"
      @radio-change="radioChangeEvent"
      @edit-closed="editClosedEvent"
    >
      <vxe-table-column
        v-if="radio"
        type="radio"
        width="60"
        align="center"
      >
        <template v-slot:header>
          <vxe-button
            type="text"
            :disabled="radioFlag"
            @click="clearRadioRowEevnt"
          >
            取消
          </vxe-button>
        </template>
      </vxe-table-column>
      <vxe-table-column
        v-if="check"
        type="checkbox"
        width="60"
        align="center"
      />
      <vxe-table-column
        type="seq"
        title="#"
        width="60"
      />
      <vxe-table-column
        v-for="(item, index) in tableColumn"
        :key="index"
        :title="item.title"
        :field="item.field"
        :min-width="item.minWidth"
        :sortable="item.sort"
        :formatter="item.formatter"
        :edit-render="item.editRender"
        :filters="
          item.type
            ? [
              {
                data: { value: '', type: '1', columnName: item.field },
                resetValue: { value: '', type: '1', columnName: item.field }
              }
            ]
            : null
        "
        :filter-method="$event => filterMethod($event, item)"
      >
        <template v-slot:filter="{ $panel, column }">
          <!-- 列表，文本 -->
          <div
            v-for="(option, index1) in column.filters"
            :key="index1"
            class="screening-wrap"
          >
            <el-radio-group
              v-model="option.data.type"
              @change="changeRadioType(option, item)"
            >
              <el-radio
                v-for="(type_item, t_k) in typeObj[item.type]"
                :key="t_k"
                :label="type_item.value"
              >
                {{ type_item.label }}
              </el-radio>
            </el-radio-group>
            <template v-if="item.type === 'input' || item.type === 'select'">
              <el-input
                v-model="option.data.value"
                size="mini"
                class="que-inp"
                @input="
                  $panel.changeOption($event, !!option.data.value, option)
                "
                @keyup.enter.native="$panel.confirmFilter()"
              />
            </template>
            <template v-else-if="item.type === 'number'">
              <el-input
                v-model="option.data.value"
                size="mini"
                class="que-inp"
                @input="
                  $panel.changeOption($event, !!option.data.value, option)
                "
                @keyup.native="
                  numberFilter(column.filters, index1, option.data.value)
                "
                @keyup.enter.native="$panel.confirmFilter()"
              />
            </template>
            <template v-else-if="item.type === 'date'">
              <div v-show="option.data.type === '3'">
                <el-date-picker
                  v-model="option.data.value"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH"
                  size="mini"
                  class="que-inp"
                  @change="
                    $panel.changeOption($event, !!option.data.value, option)
                  "
                />
              </div>
              <div
                v-if="
                  option.data.type !== '3' &&
                    Object.prototype.toString.call(option.data.value) !==
                    '[object Array]'
                "
              >
                <el-date-picker
                  v-model="option.data.value"
                  value-format="yyyy-MM-dd HH"
                  type="datetime"
                  placeholder=""
                  size="mini"
                  class="que-inp"
                  @change="
                    $panel.changeOption($event, !!option.data.value, option)
                  "
                />
              </div>
            </template>
          </div>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import { saveAs } from 'file-saver'
import XLSX from 'xlsx'
Vue.use(ElementUI)
Vue.use(VXETable)
export default {
  name: 'PvTable',
  props: {
    tableColumn: {
      type: Array,
      default: () => []
    },
    radio: {
      type: Boolean,
      default: false
    },
    check: {
      type: Boolean,
      default: false
    },
    radioItem: {
      type: Object,
      default: () => {}
    },
    checkGroup: {
      type: Array,
      default: () => []
    },
    filter: {
      type: Boolean,
      default: false
    },
    buttonColumn: {
      type: Array,
      default: () => []
    },
    tool: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: false
    },
    btnFlag: {
      type: Boolean,
      default: false
    },
    exportVisible: {
      type: Boolean,
      default: false
    },
    printVisible: {
      type: Boolean,
      default: false
    },
    seniorQuery: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表格单选data
      radioFlag: true,
      selectTab: 'tab1',
      searchVal: '',
      typeObj: {}
    }
  },
  created() {
    this.initOperator()
  },
  methods: {
    numberFilter(varArr, k, value) {
      this.$nextTick(() => {
        let val = JSON.parse(JSON.stringify(value))
        val = val.replace(/[^\d.]/g, '') // 先把非数字的都替换掉，除了数字和.
        val = val.replace(/^\./g, '') // 必须保证第一个为数字而不是.
        val = val.replace(/\.{2,}/g, '.') // 保证只有出现一个.而没有多个.
        val = val
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.') // 保证.只出现一次，而不能出现两次以上
        if (val.split('')[0] === '0') {
          if (val.split('')[1] !== '.' && val.split('').length > 1) {
            const arr = val.split('')
            arr.splice(1, 1)
            val = arr.join('')
          }
        }
        varArr[k].data.value = val
      })
    },
    changeRadioType(option, item) {
      if (item.type === 'date') {
        option.data.value = option.data.type === '3' ? [] : ''
      }
    },
    filterMethod({ option, row }, column) {
      switch (option.data.type) {
        case '1':
          // console.log('等于')
          if (column.type === 'input') {
            return row[option.data.columnName] === option.data.value
          } else if (column.type === 'number') {
            return (
              Number(row[option.data.columnName]) === Number(option.data.value)
            )
          } else if (column.type === 'date') {
            return (
              row[option.data.columnName].split(':')[0] === option.data.value
            )
          }
          return row[option.data.columnName] === option.data.value
        case '2':
          // console.log('不等于')
          if (column.type === 'input') {
            return row[option.data.columnName] !== option.data.value
          } else if (column.type === 'number') {
            return (
              Number(row[option.data.columnName]) !== Number(option.data.value)
            )
          } else if (column.type === 'date') {
            return (
              row[option.data.columnName].split(':')[0] !== option.data.value
            )
          }
          return row[option.data.columnName] !== option.data.value
        case '3':
          // console.log('在')
          var curDate = new Date(row[option.data.columnName])
          var beginDate = new Date(option.data.value[0] + ':00:00')
          var endDate = new Date(option.data.value[1] + ':00:00')
          return curDate > beginDate && curDate < endDate
        case '4':
          // console.log('包含')
          return (
            XEUtils.toString(row[option.data.columnName])
              .toLowerCase()
              .indexOf(option.data.value) > -1
          )
        case '5':
          // console.log('不包含')
          return (
            XEUtils.toString(row[option.data.columnName])
              .toLowerCase()
              .indexOf(option.data.value) === -1
          )
        case '6':
          // console.log('大于')
          return (
            Number(row[option.data.columnName]) > Number(option.data.value)
          )
        case '7':
          // console.log('小于')
          return (
            Number(row[option.data.columnName]) < Number(option.data.value)
          )
      }
    },
    initOperator() {
      const List1 = [{ value: '1', label: '等于' }]
      const List2 = [{ value: '2', label: '不等于' }]
      const List3 = [{ value: '3', label: '在' }]
      const List4 = [
        { value: '4', label: '包含' },
        { value: '5', label: '不包含' }
      ]
      const List5 = [
        { value: '6', label: '大于' },
        { value: '7', label: '小于' }
      ]
      this.typeObj = {
        input: [...List1, ...List2, ...List4], // 列表，文本
        select: [...List1, ...List2, ...List4], // 列表，文本
        number: [...List1, ...List5], // 数值
        date: [...List1, ...List2, ...List3] // 日期
      }
    },
    getTableList() {
      this.$emit('getTableList', this.searchVal)
    },
    // 表格单选方法
    radioChangeEvent({ row }) {
      this.radioFlag = false
      this.$emit('update:radioItem', row)
    },
    clearRadioRowEevnt() {
      this.radioFlag = true
      this.$emit('update:radioItem', {})
      this.$refs.xTable.clearRadioRow()
    },
    // 表格多选方法
    selectAllEvent({ records }) {
      this.$emit('update:checkGroup', records)
    },
    selectChangeEvent({ records }) {
      this.$emit('update:checkGroup', records)
    },
    // 筛选列
    checkColumnMethod({ column }) {
      const filterColumn =
        this.tableColumn
          .filter(item => {
            return item.fix
          })
          .map(item => {
            return item.field
          }) || []
      if (filterColumn.includes(column.property)) {
        return false
      } else {
        return true
      }
    },
    // 实时保存
    editClosedEvent({ row, column }) {
      const field = column.property
      setTimeout(() => {
        this.$emit('saving', row, field)
        // this.$message.success(`局部保存成功！ ${field}=${cellValue}`)
        // 局部更新单元格为已保存状态
        // this.$refs.xTable.reloadRow(row, null, field)
      }, 300)
    },
    // 导出
    exportData() {
      const toBuffer = wbout => {
        const buf = new ArrayBuffer(wbout.length)
        const view = new Uint8Array(buf)
        for (let index = 0; index !== wbout.length; ++index) { view[index] = wbout.charCodeAt(index) & 0xff }
        return buf
      }
      // 转换数据
      const table = this.$refs.xTable.$el.querySelector(
        '.vxe-table--main-wrapper'
      )
      const book = XLSX.utils.book_new()
      const sheet = XLSX.utils.table_to_sheet(table)
      XLSX.utils.book_append_sheet(book, sheet)
      const wbout = XLSX.write(book, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
      })
      const blob = new Blob([toBuffer(wbout)], {
        type: 'application/octet-stream'
      })
      // 保存导出
      saveAs(blob, '列表数据.xlsx')
    },
    printEvent() {
      this.$refs.xTable.print({
        sheetName: '打印表格',
        // style: printStyle,
        columns: this.tableColumn
        // beforePrintMethod: ({ content }) => {
        //   // 拦截打印之前，返回自定义的 html 内容
        //   return topHtml + content + bottomHtml
        // }
      })
    },
    dealEvent(val) {
      this.$emit('dealEvent', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.vxe-toolbar {
  border-bottom: 1px solid #eff2f7;
}
.query {
  margin-left: 20px;
}
.pd-10 {
  margin-right: 10px;
}
/deep/ .query.vxe-input .vxe-input--suffix {
  width: 35px;
  height: 28px;
  top: 1px;
  bottom: 2px;
  text-align: center;
  border-left: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  cursor: pointer;
}
.btn-sty {
  margin-right: 10px;
}
.screening-wrap {
  width: 344px;
  padding: 16px;
}
.que-inp {
  margin-top: 10px;
}
</style>
