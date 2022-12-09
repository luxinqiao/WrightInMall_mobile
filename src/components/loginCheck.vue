<template>
    <div></div>
</template>

<script type='text/javascript'>
import {isEmpty, appFun, getBrowserType, getLocalToken} from '@/utils/CommonUtils.js'

export default {
    data() {
        return {

        }
    },
    mounted() {
        
    },
    methods: {
        /**
            登录校验
            @param {function} callback 回调函数
            @return
        */
        checkToken(callback) {
            const browserType = getBrowserType()
            if (isEmpty(getLocalToken())) {
                if (browserType == 'app') {
                    this.appLogin()
                } else {
                    this.browserLogin()
                }
                return
            }
            this.$wm_data.VERSIONFORAPP = 'noCheckToken'
            this.$axios.post(live_request+'common/token/check', {
                token: getLocalToken()
            })
            .then(res => {
                if (res.code == 200) {
                    typeof (callback) == 'function' ? callback() : ''
                } else {
                    this.$wm_dialog.tip('登录已过期，请重新登录',()=>{
                        localStorage.wm_token = ''
                        if (browserType == 'app') {
                            this.appLogin()
                        } else {
                            this.browserLogin()
                        }
                    })
                }
            })
            .catch(response => {

            })
        },
        /**
            微信登录
            @param
            @return
        */
        wechatLogin() {
            this.$router.push({path: '../login/index'})
        },
        /**
            app登录
            @param
            @return
        */
        appLogin() {
            appFun(function() {
                window.jsInterface.loginMall()
            }, function() {
                window.webkit.messageHandlers.loginMall.postMessage(null)
            })
        },
        /**
            浏览器登录
            @param
            @return
        */
        browserLogin() {
            this.$router.push({path:'../login/index'})
        }
    }
}
</script>

<style lang='scss' scoped>
    
</style>
