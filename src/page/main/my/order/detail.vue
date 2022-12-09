<!--
    文件描述：订单详情
    创建人：卢信桥
    创建时间：2020-10-23
 -->
<template>
    <div id='main' ref='main'>
        <div id='banner' :class='getBannerClass()'>
            <img class='bg' :src='require("@/assets/images/my/order/detail/bg.png")'>
            <p class='status'>{{getStatusText(dataObj.order_status)}}</p>
            <p class='time' v-if='!fun.isEmpty(dataObj.auto_pickup_time_str)'>{{dataObj.auto_pickup_time_str}}</p>
            <span class='rule' @click='goInvoiceRule()'>发票规则</span>
        </div>
        <div id='content'>
            <div class='content-express' v-if='!fun.isEmpty(dataObj.express_no)' @click='goExpress(dataObj.order_code)'>
                <img class='logo' :src='getExpressImg(dataObj.express_status)'>
                <p :class='"status "+getExpressClass(dataObj.express_status)'>{{getExpressStatus(dataObj.express_status, dataObj.express_state)}}</p>
                <p class='desc'>{{!fun.isEmpty(expressText) ? expressText : '暂时还没有物流信息'}}</p>
                <img class='right' :src='require("@/assets/images/my/order/detail/next.png")'>
            </div>
            <div class='content-person'>
                <p class='info'>
                    <img class='logo' :src='require("@/assets/images/my/order/detail/address.png")'>
                    <font class='name'>{{dataObj.recipient_name}}</font>
                    <font class='phone'>{{dataObj.recipient_phone}}</font>
                </p>
                <p class='address'>{{dataObj.recipient_address}}</p>
            </div>
            <div class='content-product'>
                <p class='title'>商品信息</p>
                <div class='info'>
                    <img class='img' :src='dataObj.product_image'>
                    <span class='title text_ellipsis'>{{dataObj.product_name}}</span>
                    <span class='spec'>规格：{{dataObj.product_tag}}</span>
                    <span class='price'>￥{{fun.priceTransitionTwo(dataObj.product_price)}}</span>
                    <span class='count'>x{{dataObj.product_count}}</span>
                </div>
                <div class='give' v-if='!fun.isEmpty(dataObj.gift)'>
                    <img class='img' :src='require("@/assets/images/my/order/list/give.png")'>
                    <span class='text'>{{dataObj.gift}}</span>
                </div>
                <div class='warranty' v-if='!fun.isEmpty(dataObj.service_name)'>
                    <img class='img' :src='require("@/assets/images/my/order/list/warranty.png")'>
                    <span class='text'>{{dataObj.service_name}} ￥{{fun.priceTransitionTwo(dataObj.service_price)}}x1</span>
                </div>
            </div>
            <div class='content-price'>
                <p class='title'>订单总额</p>
                <p class='item'>
                    <span class='left'>商品总价</span>
                    <span class='right'>￥{{fun.priceTransitionTwo(dataObj.product_price_count)}}</span>
                </p>
                <p class='item'>
                    <span class='left'>运费</span>
                    <span class='right'>￥{{fun.priceTransitionTwo(dataObj.express_price)}}</span>
                </p>
                <p class='item' v-if='!fun.isEmpty(this.dataObj.service_price)&&this.dataObj.service_price!=0'>
                    <span class='left'>延保服务</span>
                    <span class='right'>￥{{fun.priceTransitionTwo(dataObj.service_price)}}</span>
                </p>
                <p class='item' v-if='!fun.isEmpty(this.dataObj.coupon_cash)&&this.dataObj.coupon_cash!=0'>
                    <span class='left'>优惠券优惠</span>
                    <span class='right'>-￥{{fun.priceTransitionTwo(dataObj.coupon_cash)}}</span>
                </p>
                <p class='item' v-if='!fun.isEmpty(this.dataObj.remiss_cash)&&this.dataObj.remiss_cash!=0'>
                    <span class='left'>推荐码优惠</span>
                    <span class='right'>-￥{{fun.priceTransitionTwo(dataObj.remiss_cash)}}</span>
                </p>
                <p class='item'>
                    <span class='left'>实付款</span>
                    <span class='right'>
                        <font class='red'>￥{{fun.priceTransitionTwo(dataObj.payment_amount)}}</font>
                        <font class='gray' v-if='dataObj.gold>0'>(含余额{{fun.priceTransitionTwo(dataObj.gold)}}元)</font>
                    </span>
                </p>
            </div>
            <div class='content-info'>
                <p class='title'>订单信息</p>
                <p class='item'>
                    <span class='left'>订单编号</span>
                    <span class='right'>{{dataObj.order_code}}</span>
                </p>
                <p class='item'>
                    <span class='left'>下单时间</span>
                    <span class='right'>{{dataObj.order_time}}</span>
                </p>
                <p class='item'>
                    <span class='left'>支付时间</span>
                    <span class='right'>{{dataObj.payment_time}}</span>
                </p>
                <p class='item'>
                    <span class='left'>支付方式</span>
                    <span class='right'>{{getPaymethod()}}</span>
                </p>
                <p class='item'>
                    <span class='left'>留言</span>
                    <span class='right'>{{!fun.isEmpty(dataObj.remark)?dataObj.remark:'未填写'}}</span>
                </p>
                <p class='item' v-if='dataObj.inv_status==0&&dataObj.express_status==2'>
                    <span class='right red' @click='goInvoiceApply(dataObj.order_code)'>申请开票</span>
                </p>
                <p class='item' v-if='dataObj.inv_status==1'>
                    <span class='right red' @click='goInvoiceDetail(dataObj.inv_code)'>查看发票</span>
                </p>
            </div>
        </div>
        <div id='button'>
            <div class='button-item' v-if='dataObj.order_status==0'>
                <span class='cancel' v-if='dataObj.status==3'>订单取消中...</span>
                <button v-else @click='cancelOrder(dataObj)'>取消订单</button>
            </div>
            <div class='button-item' v-else-if='dataObj.order_status==1'>
                <span class='tip' @click='contact()'>如需退换请联系客服</span>
                <button class='active' @click='confirmOrder(dataObj)'>确认收货</button>
                <button @click='goExpress(dataObj.order_code)'>查看物流</button>
            </div>
            <div class='button-item' v-else-if='dataObj.order_status==2'>
                <span class='tip' @click='contact()'>如需退换请联系客服</span>
                <button @click='deleteOrder(dataObj.order_code)'>删除订单</button>
            </div>
            <div class='button-item' v-else-if='dataObj.order_status==3'>
                <button class='active' @click='buyAgain(dataObj)'>再次购买</button>
                <button @click='deleteOrder(dataObj.order_code)'>删除订单</button>
            </div>
        </div>
        <button id='contact' @click='contact()'>联系客服</button>
    </div>
</template>

<script type='text/javascript'>
    import {isEmpty, priceTransitionTwo, getLocalToken, getBrowserType, appFun, getAppVersion} from '@/utils/CommonUtils.js'

    export default {
        data() {
            return {
                fun: {
                    isEmpty: isEmpty,
                    priceTransitionTwo: priceTransitionTwo
                },
                browserType: getBrowserType(),
                dataObj: {},
                expressText: ''
            }
        },
        mounted() {
            this.$wm_dialog.loading()
            this.$wm_data.setHeader({title: '订单详情'})
            this.$wm_data.setFooter = false
            this.initData()
        },
        methods: {
            /**
                初始化数据
                @param
                @return
             */
            initData() {
                this.$axios.post(rec_request+'rec/order/detail', {
                    token: getLocalToken(),
                    order_code: this.$route.query.code
                }).then(res => {
                    this.$wm_dialog.closeLoading()
                    if (res.code == 200) {
                        this.dataObj = res.data
                        this.expressText = res.data.express_info.context
                    }
                }).catch(res => {
                    this.$wm_dialog.closeLoading()
                })
            },

            /**
                获取banner的class
                @param
                @return {String} class
             */
            getBannerClass() {
                let result = ''
                if (!isEmpty(this.dataObj.auto_pickup_time_str)) {
                    result += 'express '
                }
                if (this.browserType == 'wechat') {
                    result += 'noTop'
                }
                return result
            },
            /**
                获取状态文案
                @param {String} status 状态
                @return {Object} 状态文案
             */
            getStatusText(status) {
                if (status == 0) {
                    return '买家已付款'
                } else if (status == 1) {
                    return '卖家已发货'
                } else if (status == 2) {
                    return '交易成功'
                } else if (status == 3) {
                    return '交易关闭'
                }
                return ''
            },

            /**
                获取物流图标
                @param {String} status 物流状态
                @return {Object} 物流图标
             */
            getExpressImg(status) {
                if (status == 0) {
                    return require("@/assets/images/my/order/detail/express-none.png")
                } else if (status == 1) {
                    return require("@/assets/images/my/order/detail/express-has.png")
                } else if (status == 2) {
                    return require("@/assets/images/my/order/detail/express-complete.png")
                }
                return require("@/assets/images/my/order/detail/express-none.png")
            },
            /**
                获取物流状态文案
                @param {String} status 物流状态
                @param {String} status 物流状态
                @return {Object} 物流状态文案
             */
            getExpressStatus(status, state) {
                if (status == 0) {
                    return '待发货'
                } else if (status == 1) {
                    if (state == 3) {
                        return '已签收'
                    }
                    return '已发货'
                } else if (status == 2) {
                    if (state == 3) {
                        return '已签收'
                    }
                    return '已完成'
                } else if (status == 3) {
                    return '已关闭'
                }
                return ''
            },
            /**
                获取物流class
                @param {String} status 物流状态
                @return {Object} 物流class
             */
            getExpressClass(status) {
                if (status == 0) {
                    return 'none'
                } else if (status == 1) {
                    return 'has'
                } else if (status == 2) {
                    return 'complete'
                }
                return 'none'
            },

            /**
                获取支付方式
                @param
                @return {String} 支付方式描述
             */
            getPaymethod() {
                if (isEmpty(this.dataObj.gold) || this.dataObj.gold == 0) {
                    if (this.dataObj.payment_method == '0') {
                        return '支付宝'
                    } else if (this.dataObj.payment_method == '1') {
                        return '微信'
                    } else if (this.dataObj.payment_method == '4') {
                        return '免费'
                    }
                } else {
                    if (this.dataObj.payment_method == '0') {
                        return '余额+支付宝'
                    } else if (this.dataObj.payment_method == '1') {
                        return '余额+微信'
                    } else if (this.dataObj.payment_method == '5') {
                        return '余额'
                    }
                }
                return ''
            },

            /**
                取消订单
                @param {Object} item 订单
                @return
             */
            cancelOrder(item) {
                this.$wm_dialog.confirm('您确定要取消订单吗？', '取消', ()=>{

                }, '确定', ()=>{
                    this.$axios.post(rec_request+'rec/order/cancel', {
                        token: getLocalToken(),
                        order_code: item.order_code
                    }).then(res => {
                        if (res.code == 200) {
                            this.$wm_dialog.tip('取消成功', ()=> {
                                this.initData()
                            })
                        }
                    })
                })
            },
            /**
                确认收货
                @param {Object} item 订单
                @return
             */
            confirmOrder(item) {
                this.$wm_dialog.confirm('您是否要确认收货吗？', '取消', ()=>{

                }, '确定', ()=>{
                    this.$axios.post(rec_request+'rec/order/get-goods', {
                        token: getLocalToken(),
                        order_code: item.order_code
                    }).then(res => {
                        if (res.code == 200) {
                            this.$wm_dialog.tip('确认成功', ()=> {
                                this.initData()
                                this.$router.push('./receiveSuccess')
                            })
                        }
                    })
                })
            },
            /**
                删除订单
                @param {String} code 订单编码
                @return
             */
            deleteOrder(code) {
                this.$wm_dialog.confirm('您确定要删除订单吗？删除后无法撤销', '取消', ()=>{

                }, '确定', ()=>{
                    this.$axios.post(rec_request+'rec/order/delete', {
                        token: getLocalToken(),
                        order_code: code
                    }).then(res => {
                        if (res.code == 200) {
                            this.$wm_dialog.tip('删除成功', ()=> {
                                this.$router.go(-1)
                            })
                        }
                    })
                })
            },
            /**
                再次购买
                @param {Object} item 订单
                @return
             */
            buyAgain(item) {
                if (this.$route.query.is_again != 1) {
                    this.$wm_dialog.tip('商品已下架')
                    return
                }
                this.$router.push(`../../mall/details?goods_code=${item.product_code}&goods_type=1`)
            },

            /**
                页面跳转-物流详情
                @param {String} code 订单编码
                @return
             */
            goExpress(code) {
                if (isEmpty(this.expressText)) {
                    this.$wm_dialog.tip('暂时还没有物流信息')
                    return
                }
                this.$router.push('../../mall/logistics?code='+code)
            },
            /**
                页面跳转-发票规则
                @param
                @return
             */
            goInvoiceRule() {
                this.$router.push('../../mall/invoiceRules')
            },
            /**
                页面跳转-发票申请
                @param {String} code 订单编码
                @return
             */
            goInvoiceApply(code) {
                this.$router.push(`../../mall/invoiceSee?order_code=${code}`)
            },
            /**
                页面跳转-发票详情
                @param {String} code 发票编码
                @return
             */
            goInvoiceDetail(code) {
                this.$router.push(`../../mall/invoiceDetail?inv_code=${code}`)
            },
            /**
                联系客服
                @param
                @return
             */
            contact() {
                if (this.browserType == 'app' && getAppVersion()) {
                    appFun(()=> {
                        window.jsInterface.jumpToCustomer(JSON.stringify({type:'CSP0008'}))
                    }, ()=> {
                        window.webkit.messageHandlers.jumpToCustomer.postMessage({type:'CSP0008'})
                    })
                } else {
                    window.location.href = 'tel:400-133-5668'
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        padding-top: 0.73rem;
        background-color: #fafafa;
    }
    #banner {
        position: absolute; z-index: 0;
        top: 0.44rem; left: 0; right: 0;
        height: 1.1rem;
        >.bg {
            position: absolute; z-index: -1;
            top: 0; left: 0;
            width: 100%; height: 1.1rem;
        }
        >.status {
            position: absolute;
            top: 0.24rem; left: 0.12rem;
            line-height: 0.25rem;
            color: #fff;
            font-size: 0.18rem;
        }
        >.time {
            position: absolute;
            top: 0.39rem; left: 0.12rem;
            line-height: 0.2rem;
            color: #fff;
            font-size: 0.14rem;
        }
        >.rule {
            position: absolute; z-index: 1;
            top: 0.27rem; right: 0.12rem;
            line-height: 0.21rem;
            font-size: 0.15rem;
            color: #fff;
        }
    }
    #banner.express {
        >.status {
            top: 0.15rem;
        }
    }
    #banner.noTop {
        top: 0;
    }
    #content {
        padding-bottom: 0.67rem;
        >.content-express {
            position: relative;
            padding-top: 0.16rem;
            border-radius: 0.2rem 0.2rem 0 0;
            background-color: #fff;
            >.logo {
                position: absolute;
                top: 0.21rem; left: 0.12rem;
                width: 0.16rem; height: 0.11rem;
            }
            >.status {
                padding: 0 0.36rem;
                line-height: 0.2rem;
                font-size: 0.14rem; font-weight: bold;
            }
            >.status.none {
                color: #333;
            }
            >.status.has {
                color: #F86E21;
            }
            >.status.complete {
                color: #FF2C79;
            }
            >.desc {
                margin-top: 0.02rem; padding: 0 0.36rem;
                line-height: 0.18rem;
                font-size: 0.13rem;
                color: #999;
            }
            >.right {
                position: absolute;
                top: 0.3rem; right: 0.12rem;
                width: 0.07rem; height: 0.12rem;
            }
        }
        >.content-person {
            position: relative;
            padding: 0.16rem 0 0.16rem 0;
            border-radius: 0.2rem 0.2rem 0 0;
            background-color: #fff;
            >.info {
                position: relative;
                height: 0.2rem;
                >.logo {
                    float: left;
                    margin: 0.03rem 0 0 0.13rem;
                    width: 0.11rem; height: 0.14rem;
                }
                >.name {
                    float: left;
                    margin-left: 0.12rem;
                    height: 0.2rem;
                    line-height: 0.2rem;
                    font-size: 0.14rem; font-weight: bold;
                }
                >.phone {
                    float: left;
                    margin-left: 0.12rem;
                    height: 0.2rem;
                    line-height: 0.2rem;
                    font-size: 0.14rem; font-weight: bold;
                }
            }
            >.address {
                margin-top: 0.02rem; padding: 0 0.36rem;
                line-height: 0.18rem;
                font-size: 0.13rem;
                color: #999;
            }
        }
        >.content-product {
            margin-top: 0.1rem; padding-bottom: 0.16rem;
            background-color: #fff;
            overflow: hidden;
            >.title {
                margin: 0.16rem 0 0 0.13rem;
                height: 0.22rem;
                line-height: 0.22rem;
                font-weight: bold;
            }
            >.info {
                position: relative;
                margin: 0.16rem 0.12rem 0 0.12rem;
                height: 0.82rem;
                >.img {
                    position: absolute;
                    top: 0; left: 0;
                    width: 0.82rem; height: 0.82rem;
                    border-radius: 0.04rem;
                }
                >.title {
                    position: absolute;
                    top: 0; left: 0.9rem; right: 0;
                    height: 0.19rem;
                    line-height: 0.19rem;
                    font-size: 0.14rem; font-weight: bold;
                }
                >.spec {
                    position: absolute;
                    top: 0.23rem; left: 0.9rem;
                    height: 0.16rem;
                    line-height: 0.16rem;
                    font-size: 0.11rem;
                    color: #999;
                }
                >.price {
                    position: absolute;
                    bottom: 0; left: 0.9rem;
                    height: 0.2rem;
                    line-height: 0.2rem;
                    font-size: 0.14rem;
                }
                >.count {
                    position: absolute;
                    bottom: 0; right: 0.03rem;
                    height: 0.14rem;
                    line-height: 0.14rem;
                    font-size: 0.1rem; letter-spacing: 0.02rem;
                    color: #999;
                }
            }
            >.give {
                float: left;
                width: 100%;
                margin: 0.18rem 0 0 0.12rem;
                >.img {
                    float: left;
                    margin-top: 0.01rem;
                    width: 0.3rem; height: 0.16rem;
                }
                >.text {
                    float: left;
                    margin-left: 0.08rem;
                    width: 3.13rem;
                    line-height: 0.18rem;
                    font-size: 0.12rem;
                    color: #666;
                }
            }
            >.warranty {
                float: left;
                width: 100%;
                margin: 0.1rem 0 0 0.12rem;
                >.img {
                    float: left;
                    margin-top: 0.01rem;
                    width: 0.5rem; height: 0.16rem;
                }
                >.text {
                    float: left;
                    margin-left: 0.08rem;
                    width: 2.93rem;
                    line-height: 0.18rem;
                    font-size: 0.12rem;
                    color: #666;
                }
            }
        }
        >.content-price {
            margin-top: 0.1rem; padding-bottom: 0.16rem;
            background-color: #fff;
            overflow: hidden;
            >.title {
                margin: 0.16rem 0 0 0.13rem;
                height: 0.22rem;
                line-height: 0.22rem;
                font-weight: bold;
            }
            >.item {
                margin: 0.2rem 0.12rem 0 0.12rem;
                height: 0.2rem;
                >.left {
                    float: left;
                    width: 30%;
                    font-size: 0.14rem;
                }
                >.right {
                    float: right;
                    width: 70%;
                    text-align: right;
                    font-size: 0.14rem;
                    >.red {
                        color: #ff2c79;
                    }
                    >.gray {
                        color: #999;
                    }
                }
            }
        }
        >.content-info {
            margin-top: 0.1rem; padding-bottom: 0.16rem;
            background-color: #fff;
            overflow: hidden;
            >.title {
                margin: 0.16rem 0 0 0.13rem;
                height: 0.22rem;
                line-height: 0.22rem;
                font-weight: bold;
            }
            >.item {
                float: left;
                margin-top: 0.2rem; padding: 0 0.12rem;
                width: 100%; min-height: 0.2rem;
                >.left {
                    float: left;
                    width: 30%;
                    font-size: 0.14rem;
                }
                >.right {
                    float: right;
                    width: 70%;
                    text-align: right; line-height: 0.2rem;
                    font-size: 0.14rem;
                }
                >.red {
                    color: #ff2c79;
                }
            }
        }
    }
    #button {
        position: fixed; z-index: 98;
        bottom: 0; left: 0; right: 0;
        height: 0.5rem;
        border-top: 0.01rem solid #efefef;
        background-color: #fff;
        box-shadow: 0 0 0.02rem #ddd;
        >.button-item {
            height: 0.5rem;
            >.tip {
                float: left;
                margin: 0.18rem 0 0 0.12rem;
                height: 0.14rem;
                line-height: 0.14rem;
                font-size: 0.14rem;
                color: #f86e21;
            }
            >button {
                float: right;
                margin: 0.12rem 0.12rem 0 0;
                width: 0.84rem; height: 0.28rem;
                line-height: 0.28rem;
                border: 0.01rem solid #999; border-radius: 0.13rem;
                font-size: 0.13rem;
                color: #666; background: none;
            }
            >button.active {
                border: none;
                background-color: #ff2c79; color: #fff;
            }
            >.cancel {
                float: right;
                margin: 0.16rem 0.12rem 0 0;
                height: 0.18rem;
                line-height: 0.18rem;
                font-size: 0.13rem;
                color: #666;
            }
        }
    }
    #contact {
        position: fixed; z-index: 98;
        bottom: 1.1rem; right: 0;
        padding-left: 0.05rem;
        width: 0.76rem; height: 0.34rem;
        text-align: center; line-height: 0.34rem;
        border-radius: 0.3rem 0 0 0.3rem;
        font-size: 0.13rem;
        background-color: #fa66a4; color: #fff;
    }
</style>
