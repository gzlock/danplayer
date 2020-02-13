import Vue from 'vue'
// @ts-ignore
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

console.log('my version', process.env)

new Vue({
  render: h => h(App)
}).$mount('#app')
