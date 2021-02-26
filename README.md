# purvar plm 常用项目组件

```
npm install pv-plm
```

# 目前封装的有

```
pv-table,pv-dialog,pv-form,pv-page
```

# 使用方式

```
pv-table
           data: 表格数据
           tableColumn: 表格列 { titel: '', field: '', minWidth: '' }
           boder: 是否有边框
           height: 固定表格高度，表格内容滚动
           radio: 是否有单选列
           check: 是否有复选列
           checkGroup: 子组件反馈给父组件，要加sync
           radioItem: 子组件反馈给父组件，要sync
           filter: 是否展示筛选列
           dealEvent: 自定义按钮事件
           buttonColumn: 按钮组  { name: '', label: '' , type: ''}
           exportVisible: 是否展示导出按钮
           printVisible: 是否展示打印按钮
           tool: 是否展示头部工具栏
           btnFlag: 是否展示按钮组
           search: 是否展示搜索字段
           @cell-click: 单元格单击事件
           @cell-dblclick: 单元格双击事件
           @saving: 实时保存方法
           @dealEvent: 自定义方法
           @getTableList: 获取列表数据方法

pv-page   
           pageNo: 当前的页数，需要加.sync
           pageSize: 每页的大小，需要加.sync
           total: 总数
           @getList: 获取数据方法

pv-dialog    
           value: 弹窗的展示与否
           title: 弹窗标题
           width: 弹窗宽度
           height: 弹窗高度
           footer: 是否展示弹窗底部
           @cancel: 弹窗取消方法
           @confirm: 弹窗确认方法
           @close: 弹窗关闭方法

pv-form   
           forms: 存的对象
           formConfig: 对象配置

```

