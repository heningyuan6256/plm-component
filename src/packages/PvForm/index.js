import PvForm from './PvForm.vue';
PvForm.install = Vue => Vue.component(PvForm.name, PvForm);//.name就是开始说的vue文件暴露出来的name名，ldcPagination整个组件
export default PvForm;