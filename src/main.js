import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import App from './App'
import router from './router'
import * as filters from './filters'
import store from './store'
import '@/icons' // icon
import '@/permission' // 权限
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import '@/styles/index.scss' // global css

import _ from 'lodash'
import './styles/element-variables.scss' //自定义颜色
import VueStomp from "vue-stomp"
import echarts from 'echarts'
import Croppa from 'vue-croppa'

import'../static/Ueditor/ueditor.config.js'
import'../static/Ueditor/ueditor.all.min.js'
import'../static/Ueditor/lang/zh-cn/zh-cn.js'
import'../static/Ueditor/ueditor.parse.min.js'

Vue.prototype.$echarts = echarts 
Vue.component('croppa', Croppa.component)

Vue.use(VueStomp)

Vue.use(ElementUI, { locale })

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
