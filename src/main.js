import Vue from 'vue'
Vue.config.productionTip = false

/** 引入mint-ui **/
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

/** 设置全局qs **/
import qs from 'qs'
Vue.prototype.$qs = qs

/** 全局弹出框 **/
import {wm_dialog} from './utils/DialogUtils.js'
Vue.prototype.$wm_dialog = wm_dialog

/** 设置全局axios **/
import {axios} from '@/axios/index.js'
Vue.prototype.$axios = axios

/** 全局数据 **/
import {wm_data} from '@/common/index.js'
Vue.prototype.$wm_data = wm_data

/** 图片懒加载 **/
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad)

/** 禁止微信内置浏览器调整字体大小方法--and **/
import './utils/refFontSize.js'

/** 初始化Vue **/
import router from './router'
import App from './App.vue'
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})

export {wm_dialog, wm_data}
