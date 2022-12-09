import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import {routes} from '@/router/staticRoute.js'
import {isEmpty} from '@/utils/CommonUtils.js'

let router = new Router({
    routes
})
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
    if (onResolve || onReject){
        return originalPush.call(this, location, onResolve, onReject)
    }
    return originalPush.call(this, location).catch(err => err)
}

//路由钩子拦截
router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
        router.push({path: '404'})
        return
    }
    if(from.path=='/mall/details') {
        to.meta.isBack = true
    } else {
        to.meta.isBack = false
    }


    let historyArr = isEmpty(localStorage.wm_router_history)?new Array():(localStorage.wm_router_history.split(','))
    if(historyArr[historyArr.length-1] == from.path && historyArr[historyArr.length-2] == to.path) {
        historyArr.pop()
    }else if(historyArr[historyArr.length-1] != to.path || isEmpty(historyArr)) {
        historyArr.push(to.path)
    } 
    localStorage.wm_router_history = historyArr
    if(to.path.indexOf('/my')>-1 || (to.path=='/mall/details'&& sessionStorage.wm_from=='success')) {
        localStorage.wm_router_history = ''
        historyArr = []
        sessionStorage.wm_from = ''
    }
    next()
})

export default router
