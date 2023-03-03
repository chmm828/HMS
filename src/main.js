// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style
import Print from 'vue-print-nb'
// 表单组件注册
import { FormModel, collapse, slider } from 'ant-design-vue'
Vue.use(FormModel)
Vue.use(collapse)
Vue.use(slider)
Vue.use(Print)

Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

// init reload function
Vue.prototype.$reload = () => { console.warn('Please Set Reload Function On This Page [0]') }
// reset reload function
Vue.prototype.$setPageDataLoader = (func) => {
  const urlWhenSetted = window.location.href || 'unknown'
  Vue.prototype.$reload = () => {
    const url = window.location.href || 'unknown'
    if (url === urlWhenSetted) {
      if (func) {
        func()
        Vue.prototype.$message.success('刷新成功')
      } else {
        console.warn('Warning: Unset Reload Function On Current Page [1]')
      }
    } else {
      console.warn('Warning: Unset Reload Function On Current Page [2]')
    }
  }
}

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex, Logo message
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
