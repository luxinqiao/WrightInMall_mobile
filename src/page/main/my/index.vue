<!--
    文件描述：我的-主页
    创建人：卢信桥
    创建时间：2020-10-21
 -->
<template>
    <div id='main' ref='main'>
        <div id='head'>
            <span class='title'>我的</span>
            <span class='msg' @click='goMsg()'>
                <img class='img' :src='require("@/assets/images/my/index/head-msg.png")'>
                <span class='unread' v-if='head.isNews'></span>
            </span>
            <img class='avatar' :src='head.avatar' @click='goPersonInfo()'>
            <span class='name' @click='goPersonInfo()'>{{head.name}}</span>
            <span class='desc' v-if='fun.isEmpty(token)' @click='goPersonInfo()'>立即前往登录，感受更多精彩</span>
        </div>
        <div id='menu'>
            <span class='menu-item' @click='goWallet()'>
                <img class='avatar' :src='require("@/assets/images/my/index/menu-wallet.png")'>
                <font>我的钱包</font>
            </span>
            <span class='menu-item ml' @click='goOrder()'>
                <img class='avatar' :src='require("@/assets/images/my/index/menu-order.png")'>
                <font>我的订单</font>
            </span>
            <span class='menu-item ml' @click='goCoupon()'>
                <img class='avatar' :src='require("@/assets/images/my/index/menu-coupon.png")'>
                <font>优惠券</font>
            </span>
            <span class='menu-item ml' @click='goAddress()'>
                <img class='avatar' :src='require("@/assets/images/my/index/menu-address.png")'>
                <font>收货地址</font>
            </span>
            <span class='menu-item mt' @click='goInvoice()'>
                <img class='avatar' :src='require("@/assets/images/my/index/menu-invoice.png")'>
                <font>发票抬头</font>
            </span>
        </div>
        <div id='action'>
            <p class='action-item' @click='goFeedback()'>
                <span>意见反馈</span>
                <img :src='require("@/assets/images/my/index/next.png")'>
            </p>
            <p class='action-item' @click='callCustomer()'>
                <span>客服
                    <font class='gray'> (</font>
                    <font class='red'>400-133-5668</font>
                    <font class='gray'> )</font>
                </span>
                <img :src='require("@/assets/images/my/index/next.png")'>
            </p>
            <p class='action-item' @click='goSetting()'>
                <span>设置</span>
                <img :src='require("@/assets/images/my/index/next.png")'>
            </p>
        </div>
        <div style='display:none;'>
            <loginCheck ref='loginCheck'></loginCheck>
        </div>
    </div>
</template>

<script type='text/javascript'>
    import {isEmpty, getLocalToken} from '@/utils/CommonUtils.js'
    import loginCheck from '@/components/loginCheck'
    
    export default {
        components: {
            loginCheck
        },
        data() {
            return {
                fun: {
                    isEmpty: isEmpty
                },
                token: '',
                head: {
                    isNews: false,
                    avatar: require("@/assets/images/my/index/avatar.png"),
                    name: '请点击登录'
                },
                userInfo: {}
            }
        },
        mounted() {
            console.log(decodeURI('{token: lGKaOd5}'))

            this.$wm_data.setHeader({isShow: false,title: '我的'})
            this.$wm_data.setFooter = true
            this.token = getLocalToken()
            if (!isEmpty(this.token)) {
                this.initUserInfo()
                this.initMsg()
            }
        },
        methods: {
            /**
                初始化用户信息
                @param
                @return
             */
            initUserInfo() {
                this.$axios.post(`${rih_request}API/V1/Login/getUserInfo`, {
                    token: this.token
                }).then(res => {
                    if (res.code == 200) { 
                        let infoData = res.data.UserInfo
                        if (isEmpty(infoData.uiNickName) && !isEmpty(infoData.WeChatIDName)) {
                            this.head.name = infoData.WeChatIDName
                        } else {
                            this.head.name = infoData.uiNickName
                        }
                        if (!isEmpty(infoData.uiHeadImageUrl)) {
                            if (infoData.uiHeadImageUrl.indexOf('http') == -1) {
                                infoData.uiHeadImageUrl = ali_request + infoData.uiHeadImageUrl
                            }
                            this.head.avatar = infoData.uiHeadImageUrl
                        } else if (isEmpty(infoData.uiHeadImageUrl) && !isEmpty(infoData.weChatHeadImageUrl)) {
                            if (infoData.weChatHeadImageUrl.indexOf('http') == -1) {
                                infoData.weChatHeadImageUrl = ali_request + infoData.weChatHeadImageUrl
                            }
                            this.head.avatar = infoData.weChatHeadImageUrl
                        }
                        this.userInfo = infoData
                    } else if (res.code == '3' || res.code == '102' || res.code == '201') {
                        localStorage.wm_token = ''
                        this.token = ''
                    }
                })
            },
            /**
                初始化消息
                @param
                @return
             */
            initMsg() {
                this.$axios.post(common_request + 'v1/note/unread', {
                    token: this.token
                }).then(res => {
                    if (res.data.system_count > 0) {
                        this.head.isNews = true
                    }
                    if (res.code == '3' || res.code == '102' || res.code == '201') {
                        localStorage.wm_token = ''
                        this.token = ''
                    }
                })
            },

            /**
                页面跳转-消息通知
                @param
                @return
             */
            goMsg() {
                this.$refs.loginCheck.checkToken(()=>{
                    this.$router.push('./msgNotice')
                })
            },
            /**
                页面跳转-个人信息
                @param
                @return
             */
            goPersonInfo() {
                this.$refs.loginCheck.checkToken(()=>{
                    this.$router.push('./personalInfo')
                })
            },
            /**
                页面跳转-我的钱包
                @param
                @return
             */
            goWallet() {
                this.$refs.loginCheck.checkToken(()=>{
                    this.$router.push('./wallet')
                })
            },
            /**
                页面跳转-我的订单
                @param
                @return
             */
            goOrder() {
                this.$refs.loginCheck.checkToken(()=>{
                    this.$router.push('./order/list')
                })
            },
            /**
                页面跳转-优惠券
                @param
                @return
             */
            goCoupon() {
                this.$refs.loginCheck.checkToken(()=>{
                    this.$router.push('./coupon/couponUse')
                })
            },
            /**
                页面跳转-收货地址
                @param
                @return
             */
            goAddress() {
                this.$refs.loginCheck.checkToken(()=>{
                    this.$router.push('./appoint/addressList')
                })
            },
            /**
                页面跳转-发票抬头
                @param
                @return
             */
            goInvoice() {
                this.$refs.loginCheck.checkToken(()=>{
                    this.$router.push('./invoiceList')
                })
            },
            /**
                页面跳转-意见反馈
                @param
                @return
             */
            goFeedback() {
                this.$refs.loginCheck.checkToken(()=>{
                    this.$router.push('./feedback')
                })
            },
            /**
                拨打客服电话
                @param
                @return
             */
            callCustomer() {
                window.location.href = 'tel:400-133-5668'
            },
            /**
                页面跳转-设置
                @param
                @return
             */
            goSetting() {
                this.$refs.loginCheck.checkToken(()=>{
                    this.$router.push('./setting')
                })
            },
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        padding-top: 0.7rem;
    }
    #head {
        position: relative;
        height: 1.09rem;
        >.title {
            position: absolute;
            top: 0; left: 0.12rem;
            height: 0.25rem;
            line-height: 0.25rem;
            font-size: 0.18rem; font-weight: bold;
        }
        >.msg {
            position: absolute;
            top: 0; right: 0.12rem;
            width: 0.28rem; height: 0.28rem;
            >.img {
                width: 0.28rem; height: 0.28rem;
            }
            >.unread{
                position: absolute; z-index: 1;
                top: 0.03rem; right: 0.03rem;
                width: 0.06rem; height: 0.06rem;
                border-radius: 0.1rem;
                background-color: #ff2c79;
            }
        }
        >.avatar {
            position: absolute;
            top: 0.49rem; left: 0.12rem;
            width: 0.6rem; height: 0.6rem;
            border-radius: 0.6rem;
        }
        >.name {
            position: absolute;
            top: 0.58rem; left: 0.8rem;
            height: 0.25rem;
            line-height: 0.25rem;
            font-size: 0.18rem;
        }
        >.desc {
            position: absolute;
            top: 0.87rem; left: 0.8rem;
            height: 0.14rem;
            line-height: 0.14rem;
            font-size: 0.1rem;
        }
    }
    #menu {
        float: left;
        margin-top: 0.3rem; padding-left: 0.12rem;
        width: 100%;
        >.menu-item {
            position: relative;
            float: left;
            width: 0.7rem; height: 0.54rem;
            >img {
                position: absolute;
                top: 0; left: 0; right: 0;
                margin: auto;
                width: 0.34rem; height: 0.28rem;
            }
            >font {
                position: absolute;
                bottom: 0; left: 0; right: 0;
                height: 0.18rem;
                text-align: center; line-height: 0.18rem;
                font-size: 0.13rem;
            }
        }
        >.menu-item.ml {
            margin-left: 0.24rem;
        }
        >.menu-item.mt {
            margin-top: 0.24rem;
        }
    }
    #action {
        clear: both;
        padding-top: 0.4rem;
        height: 2rem;
        overflow: hidden;
        >.action-item {
            position: relative;
            margin: 0.16rem 0 0 0.16rem;
            height: 0.35rem;
            border-bottom: 0.01rem solid #efefef;
            >span {
                position: absolute;
                top: 0; left: 0;
                height: 0.2rem;
                line-height: 0.2rem;
                font-size: 0.14rem;
                >.gray {
                    font-size: 0.14rem;
                    color: #888;
                }
                >.red {
                    font-size: 0.14rem;
                    color: #ff2c79;
                }
            }
            >img {
                position: absolute;
                top: 0.06rem; right: 0.16rem;
                width: 0.06rem; height: 0.08rem;
            }
        }
    }
</style>
