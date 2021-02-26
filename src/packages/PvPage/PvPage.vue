<template>
  <div>
      <vxe-pager
      perfect
      :layouts="['PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
      @page-change="getTableList"
      v-on="$listeners"
      v-bind="$attrs"
      >
      </vxe-pager>
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
  name: 'pv-page',
  props: {
    layout: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {

    }
  },
  methods: {
    getTableList (val) {
      console.log('当前页数:', val.currentPage)
      console.log('一页大小:', val.pageSize)
      this.$emit('getList')
    }
  }
}
</script>

<style>

</style>
