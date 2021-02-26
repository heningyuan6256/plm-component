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
            <i
              class="el-icon-search"
              @click="getTableList"
            />
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
          type="primary"
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
      :custom-config="{storage: filter, checkMethod: checkColumnMethod}"
      :edit-config="{trigger: 'dblclick', mode: 'cell'}"
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
      />
    </vxe-table>
  </div>
</template>

<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'xe-utils'
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
    }
  },
  data() {
    return {
      // 表格单选data
      radioFlag: true,
      selectTab: 'tab1',
      searchVal: ''
    }
  },
  methods: {
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
    selectAllEvent({ checked, records }) {
      this.$emit('update:checkGroup', records)
    },
    selectChangeEvent({ checked, records }) {
      this.$emit('update:checkGroup', records)
    },
    // 筛选列
    checkColumnMethod({ column }) {
      const filterColumn = this.tableColumn.filter(item => { return item.fix }).map(item => { return item.field }) || []
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
      const toBuffer = (wbout) => {
        const buf = new ArrayBuffer(wbout.length)
        const view = new Uint8Array(buf)
        for (let index = 0; index !== wbout.length; ++index) view[index] = wbout.charCodeAt(index) & 0xFF
        return buf
      }
      // 转换数据
      const table = this.$refs.xTable.$el.querySelector('.vxe-table--main-wrapper')
      const book = XLSX.utils.book_new()
      const sheet = XLSX.utils.table_to_sheet(table)
      XLSX.utils.book_append_sheet(book, sheet)
      const wbout = XLSX.write(book, { bookType: 'xlsx', bookSST: false, type: 'binary' })
      const blob = new Blob([toBuffer(wbout)], { type: 'application/octet-stream' })
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
.vxe-toolbar{
    border-bottom: 1px solid #eff2f7;
}
.query{
  margin-left: 20px;
}
.pd-10{
  margin-right: 10px;
}
/deep/ .query.vxe-input .vxe-input--suffix {
          // width: 60px;
          // height: 32px;
          width: 35px;
          height: 28px;
          top: 1px;
          bottom: 2px;
          text-align: center;
          border-left: 1px solid #dcdfe6;
          background-color: #f5f7fa;
          cursor: pointer;
        }
        .btn-sty{
          margin-right: 10px;
        }
</style>
