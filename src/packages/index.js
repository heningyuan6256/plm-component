import PvTable from './PvTable/index.js'
import PvPage from './PvPage/index.js'
import PvForm from './PvForm/index.js'
import PvDialog from './PvDialog/index.js'

export const components = [
  PvTable, PvPage, PvForm, PvDialog
]

const globalInstallFunction = (Vue) => {
  components.forEach(component => {
    component.install(Vue)
  })
}

const install = (Vue) => {
  if (!install.installed) {
    globalInstallFunction(Vue)
  }
}
// 判断 是否直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  PvTable,
  PvPage,
  PvForm,
  PvDialog
}

