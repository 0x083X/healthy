import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import uView from 'uview-ui'
import store from 'store/index.js'
import { request } from './utils'
import Md5 from 'js-md5'
import "uview-ui/index.scss";
Vue.prototype.$md5 = Md5
Vue.use(uView)
Vue.config.productionTip = false
Vue.prototype.$request = request
Vue.prototype.$domain = 'https://junzean.com.cn/'
App.mpType = 'app'
const app = new Vue({
	store,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif