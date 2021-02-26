<template>
  <div>
    <vxe-modal
    v-on="$listeners"
    v-bind="$attrs"
    resize
    show-zoom
    :destroy-on-close="true"
    min-width="460"
    min-height="320"
    :show-footer="footer"
    show-title-overflow
    >
    <slot></slot>
    <template v-slot:footer>
      <el-button type="info" @click="cancel">{{ cancelText }}</el-button>
      <el-button type="primary" @click="confirm">{{ confirmText }}</el-button>
    </template>
    </vxe-modal>
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
  name: 'pv-dialog',
  props: {
    footer: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    cancel () {
      this.$emit('update:value', false)
      this.$emit('cancel')
    },
    confirm () {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .vxe-modal--wrapper .vxe-modal--footer{
  border-top: 1px solid #eff2f7;
}
/deep/ .el-button--info{
  padding: 8px 15px;
}
/deep/ .el-button--primary{
  padding: 8px 20px;
}
</style>
