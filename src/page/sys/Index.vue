<!--
 * 文件描述：商城公共头部，底部
 * 创建人：赵志银
 * 创建时间：2019-03-14
-->
<template>
    <div id='wm_index' :class='getClass()'>
        <header v-show='wm_data.hasHeader' id='wm_header'>
            <div class='box'>
                <div class='back' @click="back()" v-show='wm_data.back'>
                    <img :src='require("@/assets/images/common/backbtn.png")'/>
                </div>
                <span>{{wm_data.title}}</span>
                <div class="share tag-share" @click="share()" v-show='wm_data.share'>
                    <img :src='require("@/assets/images/common/home_share.png")'/>
                </div>
            </div>
        </header>
        <div id='wm_contain'>
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive">
                </router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>

        </div>
        <footer v-show='wm_data.setFooter'>
            <div :class='footActive==="mall"?"active":""' @click='jumpMall()'>商城</div>
            <div :class='footActive==="my"?"active":""' @click='jumpMy()'>我的</div>
        </footer>
        <Dialog v-show='dialog.data.show'></Dialog>
    </div>
</template>

<script>
import Dialog from '@/components/Dialog'
import {getAppType, appFun, setWechatRole, getBrowserType, getCookie, setAppToken, getParameter,isEmpty, appShare, getAppVersion} from '@/utils/CommonUtils.js'

export default {
    data() {
        return {
            /** 弹出框 **/
            dialog: this.$wm_dialog,
            /** 全局数据 **/
            wm_data: this.$wm_data,
            /** 身份(user,doctor) **/
            role: '',
            /** 底部激活 **/
            footActive: 'mall',
            /** 商城首页链接参数 **/
            goods_type: getParameter('goods_type'),
            referral_code: getParameter('referral_code'),
            sn: getParameter('sn'),
            browserType: getBrowserType()
        }
    },
    created() {
        if(this.$route.fullPath.indexOf('/my')>-1) {
            this.footActive = 'my'
        } else if(this.$route.fullPath.indexOf('/mall')>-1) {
            this.footActive = 'mall'
        }
    },
    mounted() {
        this.clearDialog()
        this.$wm_data.appType = getAppType()
        this.$wm_data.browserType = getBrowserType()
        //设置app的token
        if (this.$wm_data.browserType == 'app') {
            setAppToken()
        }
        if(!isEmpty(getParameter('goods_type'))) {
            sessionStorage.wm_goods_type = getParameter('goods_type')
        }
        sessionStorage.wm_referral_code = getParameter('referral_code')
        sessionStorage.wm_sn = getParameter('sn')
    },
    methods: {
        /**
            获取主页class
            @param
            @return
        */
        getClass() {
            let s = this.$wm_data.browserType + ' ' + this.role
            if (!this.wm_data.setFooter) {
                s += ' noFooter'
            }
            return s
        },
        /**
            返回
            @param
            @return
        */
        back() {
            const path = this.$route.path
            const closeWindow = ()=> {
                appFun(()=> {
                    window.jsInterface.closeWindow()
                }, ()=> {
                    window.webkit.messageHandlers.closeWindow.postMessage(null)
                })
            }
            //商城根目录：关闭页面
            if (path=='/mall/index') {
                closeWindow()
            } else if ((path=='/mall/details')&&(this.$route.query.is_root=='1' || this.$route.query.type=='LT01')) {
                closeWindow()
            } else if ((path=='/pay/success') || (path=='/pay/cancel') ||(path=='/pay/error')) {
                if(this.$wm_data.browserType == 'browser') {
                    history.go(-3)
                } else if(this.$wm_data.browserType == 'app') {
                    history.go(-2)
                } 
            } else {
                history.back(-1)
            }
        },
        /**
            清空弹出框
            @param
            @return
        */
        clearDialog() {
            this.dialog.show = false
        },
        /**
            获取末路由
            @param
            @return {String} 末路由
        */
        getPath(path) {
            return path.substring(path.indexOf('/index')+7, path.length)
        },
        /**
            跳转-商城
            @param
            @return
        */
        jumpMall() {
            this.footActive = 'mall'
            this.$router.replace({path: '/mall/index'})
        },
        /**
            跳转-我的
            @param
            @return
        */
        jumpMy() {
            this.footActive = 'my'
            this.$router.replace({path: '/my/index'})
        }, 
        /**
            分享
            @param
            @return
        */
        share() {
            if(getAppVersion()) {
                appFun(function() {
                    window.jsInterface.mallShare(JSON.stringify({
                            type: sessionStorage.wm_share_type,
                            code: isEmpty(sessionStorage.wm_share_code)?'':sessionStorage.wm_share_code, 
                            icon: sessionStorage.wm_icon, 
                            link: sessionStorage.wm_link,
                            title: sessionStorage.wm_title,
                            desc: sessionStorage.wm_desc,
                        }))
                    }, function() {
                    window.webkit.messageHandlers.mallShare.postMessage({
                        type: sessionStorage.wm_share_type,
                        code: isEmpty(sessionStorage.wm_share_code)?'':sessionStorage.wm_share_code, 
                        icon: sessionStorage.wm_icon, 
                        link: sessionStorage.wm_link,
                        title: sessionStorage.wm_title,
                        desc: sessionStorage.wm_desc,
                    })
                })
            } else {
                appShare({
                    title: sessionStorage.wm_title,
                    desc: sessionStorage.wm_desc,
                    link: sessionStorage.wm_link,
                    icon: sessionStorage.wm_icon
                })
            }
        }
    },
    watch: {
        /**
            监听路由
            @param {Object}to 新路由
            @param {Object}from 原路由
            @return
        */
        $route(to, from) {
            sessionStorage.route_to = to.path
            sessionStorage.route_from = from.path
            if (to.path.indexOf('/mall')>-1) {
                this.footActive = 'mall'
            } else if (to.path.indexOf('/my')>-1) {
                this.footActive = 'my'
            }
        }
    },
    components: {
        Dialog
    }
}
</script>

<style lang='scss'>
@import '@/assets/css/common/Common.scss';
@import '@/assets/css/common/Index.scss';
</style>
