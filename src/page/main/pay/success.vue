<!--
 * 文件描述：支付成功页
 * 创建人：赵志银
 * 创建时间：2019-03-14
-->
<template>
    <div id='main' ref='main'>
        <div class='success' v-if='isHas'>
            <img src='@/assets/images/mall/success/success.png'>
            <div class='title'>支付成功</div>
            <div class='price'>￥{{priceTransitionTwo(orderObj.payment_amount)}}</div>
            <div class='style'>
                <span>支付方式</span>
                <span>{{payStyle}}</span>
            </div>
        </div>
        <div class='btn' v-if='isHas'>
            <div @click='goOrder' class='wm_bgcolor_main'>查看订单</div>
            <div @click='goHome' class='wm_color_main'>返回商城首页</div>
        </div>
    </div>
</template>

<script>
    import {getParameter, fullScreenHeight, isEmpty, getBrowserType, getLocalToken, priceTransitionTwo, urlChange, appFun, getAppVersion} from '@/utils/CommonUtils.js'
    import sdk from '@/utils/weichatShareUtils.js'

    export default {
         data() {
            return {
                /** 返回数据 **/
                paramObj: {},
                orderObj: {},
                isHas: false, 
                payStyle: '',
                priceTransitionTwo: priceTransitionTwo,
                isEmpty: isEmpty
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: ''})
            this.$wm_data.setFooter = false
            if (getBrowserType()!='app' && !isEmpty(getParameter('wm_token'))) {
                localStorage.wm_token = getParameter('wm_token')
            }
            this.paramObj = urlChange(window.location.href)
            this.$wm_dialog.loading()
            fullScreenHeight(this.$refs.main)
            this.initData()
            sessionStorage.wm_remark = ''
            sessionStorage.wm_goods_code = ''
            sessionStorage.wm_style_code = ''
        },
        methods: {
            /**
                初始化
                @param
                @return
            */
            initData() {
                this.$axios.post(rec_request+'v1/order/detail', {
                    token: getLocalToken(),
                    order_code: this.paramObj.wm_orderid
                })
                .then(response => {
                    if (response.code == 200) {
                        let data = response.data
                        if (isEmpty(data.gold) || data.gold == 0) {
                            if (data.payment_method == '1') {
                                this.payStyle = '微信'
                            } else if (data.payment_method == '0') {
                                this.payStyle = '支付宝'
                            } else if (data.payment_method == '4') {
                                this.payStyle = '免费'
                            }
                        } else {
                            if (data.payment_method == '0') {
                                this.payStyle = '余额+支付宝'
                            } else if (data.payment_method == '1') {
                                this.payStyle = '余额+微信'
                            } else if (data.payment_method == '5') {
                                this.payStyle = '余额'
                            }
                        }
                        this.$wm_dialog.closeLoading()
                        this.isHas = true
                        this.orderObj = response.data

                        sessionStorage.wm_desc = '这个商品还不错，推荐给您！'
                        sessionStorage.wm_icon = this.dataObj.product_image
                        sessionStorage.wm_title = this.dataObj.product_name
                        sessionStorage.wm_link = window.location.protocol+ '//' + window.location.host + '/#/mall/details?goods_code='+ this.dataObj.product_code +'&goods_type=1&type=LT01'

                        if(this.version) {
                            //app分享-新版分享-新增
                            sessionStorage.wm_share_type = '502'
                            sessionStorage.wm_share_code = this.dataObj.product_code
                        }

                        let obj={
                            title: this.dataObj.product_name,
                            des: '这个商品还不错，推荐给您！',
                            linkurl: window.location.protocol+ '//' + window.location.host + '/#/mall/details?goods_code='+ this.dataObj.product_code +'&goods_type=1&type=LT01',
                            img: this.dataObj.product_image
                        }
                        let url = encodeURIComponent(window.location.href.split('#')[0]);
                        sdk.getJSSDK(url, obj) 
                    }
                })
                .catch(response => {

                })
            },
            /**
                查看订单
                @param 
                @return
            */
            goOrder() {
                if (getBrowserType() =='app' && getAppVersion()) {
                    appFun(()=> {
                        window.jsInterface.goOrderDetail(JSON.stringify({code:this.orderObj.order_code}))
                    }, ()=> {
                        window.webkit.messageHandlers.goOrderDetail.postMessage({code:this.orderObj.order_code})
                    })
                } else {
                    this.$router.push({path: '../../my/order/detail?code='+this.orderObj.order_code})
                }
            },
            /**
                返回首页
                @param
                @return
            */
            goHome() {
                sessionStorage.wm_from = 'success'
                this.$router.push({path: '../../mall/index?goods_type=1'})
            }
        }
    }
</script>
<style lang="scss" scoped>
    #main {
        .success {
            position: relative;
            img {
                display: block;
                margin: 0.24rem 0 0 1.5rem ;
                width: 0.76rem; height: 0.76rem;
            }
            .title {
                text-align: center;
                font-size: 0.16rem;
            }
            .price {
                margin-top: 0.16rem;
                text-align: center;
                font-size: 0.33rem; font-weight: 550;
            }
            .style {
                position: relative;
                height: 0.2rem;
                margin: 0.31rem 0.16rem 0 0.16rem; padding: 0 0 0.08rem 0;
                box-sizing: content-box;
                border-bottom: 1px solid rgba(239,239,239,0.6);
                span:nth-child(1) {
                    position: absolute;
                    top: 0; left: 0;
                    height: 0.2rem;
                    font-size: 0.14rem; color: #999;
                }
                span:nth-child(2) {
                    position: absolute;
                    top: 0; right: 0;
                    height: 0.2rem;
                    font-size: 0.14rem;
                }
            }
        }
        .btn {
            margin-top: 0.39rem;
            div {
                margin: auto;
                width: 3.43rem; height: 0.5rem;
                line-height: 0.5rem; text-align: center;
                font-size: 0.16rem; 
                border-radius: 0.25rem;
                border: 1px solid #FF2C7D;
            }
            div:nth-child(1) {
                color: #fff;
            }
            div:nth-child(2) {
                margin-top: 0.24rem;
                background-color: #fff;
            }
        }
    }
</style>
