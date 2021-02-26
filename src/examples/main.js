import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false
// Vue.use(ElementUi)
// Vue.use(abcjsUi)

if (process.env.NODE_ENV === 'development') {
  const { mockXHR } = require('../../mock')
  mockXHR()
}

new Vue({
  el: '#app',
  render: h => h(App)
})

