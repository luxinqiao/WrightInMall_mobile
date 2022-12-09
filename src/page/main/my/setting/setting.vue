<!--
 * 文件描述：我的-设置
 * 创建人：赵志银
 * 创建时间：2020-10-30
-->
<template>
    <div ref='main'>
        <div class='content'>
            <div @click='cleanCache'>
                <span>清理缓存</span>
                <img src='@/assets/images/my/setting/next.png'>
            </div>
            <div @click='goUserAgreement'>
                <span>用户协议</span>
                <img src='@/assets/images/my/setting/next.png'>
            </div>
            <div @click='goAboutUs'>
                <span>关于我们</span>
                <img src='@/assets/images/my/setting/next.png'>
            </div>
        </div>
        <div class='logout wm_bgcolor_main'  @click='logout'>退出登录</div>
    </div>
</template>

<script type='text/javascript'>
    import { fullScreenHeight, setWechatRole, getBrowserType} from '@/utils/CommonUtils.js'

    export default {
        data() {
            return {

            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '设置'})
            this.$wm_data.setFooter = false
            fullScreenHeight(this.$refs.main)
        },
        methods: {
            /**
             * 清理缓存
             * @param
             * @return
             */
            cleanCache() {
                this.$wm_dialog.confirm('确定清理缓存？', '取消', () => {

                }, '确定', () => {
                    if(getBrowserType()=='wechat') {
                        let info = {
                            token: sessionStorage.wm_token,
                            unionid: sessionStorage.wm_wechat_unionid,
                            openid: sessionStorage.wm_wechat_openid,
                            headimgurl: sessionStorage.wm_wechat_headimgurl,
                            status: sessionStorage.wm_wechat_status,
                        }
                        sessionStorage.clear()
                        setWechatRole(info)
                    } else {
                        sessionStorage.clear()
                    }
                    this.$wm_dialog.loading()
                    setTimeout(() => {
                        this.$wm_dialog.tip('清理完成')
                    }, 2000)
                })
            },

            /**
             * 跳转-用户协议
             * @param
             * @return
             */
            goUserAgreement() {
                this.$router.push({path: 'userAgreement'})
            },

            /**
             * 跳转-联系我们
             * @param
             * @return
             */
            goAboutUs() {
                this.$router.push({path: 'aboutUs'})
            },

            /**
             * 退出登录
             * @param
             * @return
             */
            logout() {
                this.$wm_dialog.confirm('确定退出登录吗？', '取消', () => {

                }, '确定', () => {
                    if(getBrowserType()=='wechat') {
                        let info = {
                            unionid: sessionStorage.wm_wechat_unionid,
                            openid: sessionStorage.wm_wechat_openid,
                            headimgurl: sessionStorage.wm_wechat_headimgurl,
                            status: sessionStorage.wm_wechat_status,
                        }
                        sessionStorage.clear()
                        setWechatRole(info)
                    } else {
                        sessionStorage.clear()
                    }
                    localStorage.clear()
                    this.$router.push({path: "../my/index"})
                })
            }
        }
    }
</script>

<style lang='scss' scoped>
    .content {
        position: relative;
        padding: 0 0.16rem;
        border-top: 1px solid #f4f4f4;
        div {
            position: relative;
            height: 0.48rem;
            line-height: 0.48rem;
            background-color: #fff;
            border-bottom: 1rpx solid #f4f4f4;
            span {
                position: absolute;
                top: 0; left: 0;
                height: 0.48rem;
                line-height: 0.48rem;
                font-size: 0.16rem;
            }
            img {
                position: absolute;
                top: 0;  right: 0; bottom: 0;
                margin: auto;
                width: 0.06rem; height: 0.09rem;
            }
            .num {
                position: absolute;
                top: 0; right: 0.22rem; 
                height: 0.48rem;
                line-height: 0.48rem; text-align: right;
                font-size: 0.16rem;
                color:rgba(153,153,153,1);
            }
        }
    }
    .logout {
        margin: 0.4rem auto;
        width: 3.43rem; height: 0.5rem;
        line-height: 0.5rem; text-align: center;
        font-size: 0.16rem; color: white;
        border-radius: 0.25rem;
    }
</style>
