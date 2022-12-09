<!--
    文件描述：订单列表
    创建人：卢信桥
    创建时间：2020-10-22
 -->
<template>
    <div id='main' ref='main'>
        <div id='head' :class='browserType=="wechat"?"noTop":""' v-if='isHead'>
            <p :class='orderType=="all"?"head-item all active":"head-item all"' @click='checkOrderType("all")'>
                <span class='text'>全部</span>
                <span class='line'></span>
            </p>
            <p :class='orderType=="haspay"?"head-item haspay active":"head-item haspay"' @click='checkOrderType("haspay")'>
                <span class='text'>待发货</span>
                <span class='line'></span>
            </p>
            <p :class='orderType=="express"?"head-item express active":"head-item express"' @click='checkOrderType("express")'>
                <span class='text'>已发货</span>
                <span class='line'></span>
            </p>
            <p :class='orderType=="success"?"head-item success active":"head-item success"' @click='checkOrderType("success")'>
                <span class='text'>已完成</span>
                <span class='line'></span>
            </p>
        </div>
        <van-list v-model='page.isLoading' :finished='page.isLast' :immediate-check='false'
            :finished-text='datas.length>0?"-没有更多内容-":""' @load='initData()'>
            <div id='list' :class='isHead ? "gap" : ""'>
                <div class='detail' v-for='(item,i) of datas' :key=i @click='goDetail(item.order_code, item.is_again)'>
                    <div class='detail-title'>
                        <img :class='"status-img "+getStatusClass(item.order_status)' :src='getStatusImg(item.order_status)'>
                        <span class='status-text'>{{getStatusText(item.order_status)}}</span>
                        <span class='time'>{{item.payment_time}}</span>
                    </div>
                    <div class='detail-info'>
                        <img class='img' :src='item.product_image'>
                        <span class='title text_ellipsis'>{{item.product_name}}</span>
                        <span class='spec'>规格：{{item.product_tag}}</span>
                        <span class='price'>￥{{fun.priceTransitionTwo(item.product_price)}}</span>
                        <span class='count'>x{{item.product_count}}</span>
                    </div>
                    <div class='detail-give' v-if='!fun.isEmpty(item.zeng)'>
                        <img class='img' :src='require("@/assets/images/my/order/list/give.png")'>
                        <span class='text text_ellipsis'>{{item.zeng}}</span>
                    </div>
                    <div class='detail-warranty' v-if='!fun.isEmpty(item.warranty_name)'>
                        <img class='img' :src='require("@/assets/images/my/order/list/warranty.png")'>
                        <span class='text text_ellipsis'>{{item.warranty_name}} ￥{{fun.priceTransitionTwo(item.warranty_price)}}x1</span>
                    </div>
                    <div class='detail-price'>
                        <span class='count'>共{{item.product_count}}件商品，</span>
                        <span class='coupon' v-if='item.coupon_cash>0'>优惠券-￥{{fun.priceTransitionTwo(item.coupon_cash)}}</span>
                        <span class='remiss' v-if='item.remiss_cash>0'>推荐码-￥{{fun.priceTransitionTwo(item.remiss_cash)}}</span>
                        <span class='amount'>实付款：￥{{fun.priceTransitionTwo(item.payment_amount)}}</span>
                    </div>
                    <div class='detail-button'>
                        <div class='detail-button-item' v-if='item.order_status==0'>
                            <span v-if='item.payment_status==3'>订单取消中...</span>
                            <button v-else @click.stop='cancelOrder(item)'>取消订单</button>
                        </div>
                        <div class='detail-button-item' v-else-if='item.order_status==1'>
                            <button class='active' @click.stop='confirmOrder(item)'>确认收货</button>
                            <button @click.stop='goExpress(item.order_code)'>查看物流</button>
                        </div>
                        <div class='detail-button-item' v-else-if='item.order_status==2'>
                            <button @click.stop='deleteOrder(item.order_code)'>删除订单</button>
                        </div>
                        <div class='detail-button-item' v-else-if='item.order_status==3'>
                            <button class='active' @click.stop='buyAgain(item)'>再次购买</button>
                            <button @click.stop='deleteOrder(item.order_code)'>删除订单</button>
                        </div>
                    </div>
                </div>
                <div class='empty' v-show='isDataLoad && datas.length==0'>
                    <img :src='require("@/assets/images/my/order/list/empty.png")'>
                    <span>{{getEmptyText()}}</span>
                </div>
            </div>
        </van-list>
    </div>
</template>

<script type='text/javascript'>
    import Vue from 'vue'
    import {List} from 'vant'
    import 'vant/lib/list/style'
    Vue.use(List)
    import {priceTransitionTwo, isEmpty, fullScreenHeight, getLocalToken, getBrowserType} from '@/utils/CommonUtils.js'

    export default {
        data() {
            return {
                fun: {
                    isEmpty: isEmpty,
                    priceTransitionTwo: priceTransitionTwo
                },
                browserType: getBrowserType(),
                orderType: 'all', //all-全部, haspay-待发货, express-已发货, success-已完成
                isHead: false,
                isDataLoad: false,
                datas: [],
                page: {
                    curr: 1,
                    isLoading: false,
                    isLast: false
                }
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '实物订单'})
            this.$wm_data.setFooter = false
            fullScreenHeight(this.$refs.main)
            if (sessionStorage.route_from.indexOf('/order/detail') > -1) { //从order/detail返回
                if (sessionStorage.orderType) {
                    this.orderType = sessionStorage.orderType
                }
                this.initData()
            } else {
                sessionStorage.orderType = 'all'
                this.initData()
            }
        },
        methods: {
            /**
                刷新分页
                @param
                @return
             */
            refreshPage() {
                this.page.curr = 1
                this.page.isLoading = false
                this.page.isLast = false
                this.datas = []
            },
            /**
                初始化数据
                @param
                @return
             */
            initData() {
                this.isDataLoad = false
                this.page.isLoading = true
                this.$axios.post(`${rec_request}rec/order/goods`, {
                    token: getLocalToken(),
                    page: this.page.curr,
                    request_status: this.getOrderStatus()
                }).then(res => {
                    if (res.code == 200) {
                        this.isDataLoad = true
                        this.page.isLoading = false
                        this.page.curr++
                        if (res.data.is_last_page == 1) {
                            this.page.isLast = true
                        } else {
                            this.page.isLast = false
                        }
                        this.datas = this.datas.concat(res.data.list)
                        if (this.datas.length == 0 && this.orderType == 'all') {
                            this.isHead = false
                        } else {
                            this.isHead = true
                        }
                    }
                }).catch(res => {
                    this.isDataLoad = true
                    this.page.isLoading = false
                })
            },

            /**
                选中订单类型
                @param {String} orderType 订单类型
                @return
             */
            checkOrderType(orderType) {
                if (this.orderType == orderType) {
                    return
                }
                this.orderType = orderType
                sessionStorage.orderType = orderType
                this.refreshPage()
                this.initData()
                window.scroll(0, 0)
            },
            /**
                获取订单类型
                @param
                @return {Number} 订单类型
             */
            getOrderStatus() {
                if (this.orderType == 'haspay') {
                    return 0
                } else if (this.orderType == 'express') {
                    return 1
                } else if (this.orderType == 'success') {
                    return 2
                }
                return -1
            },
            /**
                获取空数据文案
                @param
                @return {String} 数据文案
             */
            getEmptyText() {
                if (this.orderType == 'all') {
                    return '您还没有实物订单哦'
                } else if (this.orderType == 'haspay') {
                    return '您还没有待发货订单哦'
                } else if (this.orderType == 'express') {
                    return '您还没有已发货订单哦'
                } else if (this.orderType == 'success') {
                    return '您还没有已完成订单哦'
                }
                return '您还没有实物订单哦'
            },
            /**
                获取状态class
                @param {String} status 状态
                @return {Object} 状态图标
             */
            getStatusClass(status) {
                if (status == 0) {
                    return 'haspay'
                } else if (status == 1) {
                    return 'express'
                } else if (status == 2) {
                    return 'success'
                } else if (status == 3) {
                    return 'cancel'
                }
                return ''
            },
            /**
                获取状态图标
                @param {String} status 状态
                @return {Object} 状态图标
             */
            getStatusImg(status) {
                if (status == 0) {
                    return require("@/assets/images/my/order/list/status-haspay.png")
                } else if (status == 1) {
                    return require("@/assets/images/my/order/list/status-express.png")
                } else if (status == 2) {
                    return require("@/assets/images/my/order/list/status-success.png")
                } else if (status == 3) {
                    return require("@/assets/images/my/order/list/status-cancel.png")
                }
                return ''
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
                页面跳转-订单详情
                @param {String} code 订单编码
                @param {String} is_again 是否再次购买
                @return
            */
            goDetail(code, is_again) {
                this.$router.push(`./detail?code=${code}&is_again=${is_again}`)
            },

            /**
                取消订单
                @param {Object} item 订单
                @return
             */
            cancelOrder(item) {
                this.$wm_dialog.confirm('您确定要取消订单吗？', '取消', ()=>{

                }, '确定', ()=>{
                    this.$axios.post(`${rec_request}rec/order/cancel`, {
                        token: getLocalToken(),
                        order_code: item.order_code
                    }).then(res => {
                        if (res.code == 200) {
                            this.$wm_dialog.tip('取消成功')
                            item.payment_status = 3
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
                    this.$axios.post(`${rec_request}rec/order/get-goods`, {
                        token: getLocalToken(),
                        order_code: item.order_code
                    }).then(res => {
                        if (res.code == 200) {
                            this.$wm_dialog.tip('确认成功')
                            this.refreshPage()
                            this.initData()
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
                    this.$axios.post(`${rec_request}rec/order/delete`, {
                        token: getLocalToken(),
                        order_code: code
                    }).then(res => {
                        if (res.code == 200) {
                            this.$wm_dialog.tip('删除成功')
                            this.refreshPage()
                            this.initData()
                        }
                    })
                })
            },

            /**
                页面跳转-物流详情
                @param {String} code 订单编码
                @return
             */
            goExpress(code) {
                this.$router.push(`../../mall/logistics?code=${code}`)
            },
            /**
                再次购买
                @param {Object} item 订单
                @return
             */
            buyAgain(item) {
                if (item.is_again != 1) {
                    this.$wm_dialog.tip('商品已下架')
                    return
                }
                this.$router.push(`../../mall/details?goods_code=${item.product_code}&goods_type=1`)
            }
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        background-color: #fafafa;
    }
    #head {
        position: fixed; z-index: 96;
        top: 0.44rem; left: 0; right: 0;
        height: 0.48rem;
        background-color: #fff;
        >.head-item {
            position: absolute;
            top: 0; bottom: 0;
            width: 25%;
            >.text {
                position: absolute;
                top: 0.11rem; left: 0; right: 0;
                height: 0.21rem;
                text-align: center; line-height: 0.21rem;
                font-size: 0.15rem;
                color: #999;
            }
            >.line {
                display: none;
                position: absolute;
                bottom: 0.08rem; left: 0; right: 0;
                margin: auto;
                width: 0.14rem; height: 0.02rem;
                border-radius: 0.01rem;
                background-color: #333;
            }
        }
        >.head-item.active {
            >.text {
                font-weight: bold;
                color: #333;
            }
            >.line {
                display: block;
            }
        }
        >.head-item.all {
            left: 0;
        }
        >.head-item.haspay {
            left: 25%;
        }
        >.head-item.express {
            right: 25%;
        }
        >.head-item.success {
            right: 0;
        }
    }
    #head.noTop {
        top: 0;
    }
    #list {
        padding: 0 0.12rem;
        overflow: hidden;
        >.detail {
            clear: both;
            margin-top: 0.12rem;
            border-radius: 0.06rem;
            background-color: #fff;
            overflow: hidden;
            >.detail-title {
                position: relative;
                margin-top: 0.12rem;
                height: 0.2rem;
                >.status-img {
                    position: absolute;
                }
                >.status-img.haspay {
                    top: 0.04rem; left: 0.12rem;
                    width: 0.14rem; height: 0.13rem;
                }
                >.status-img.express {
                    top: 0.02rem; left: 0.11rem;
                    width: 0.16rem; height: 0.16rem;
                }
                >.status-img.success {
                    top: 0.03rem; left: 0.12rem;
                    width: 0.14rem; height: 0.14rem;
                }
                >.status-img.cancel {
                    top: 0.03rem; left: 0.12rem;
                    width: 0.14rem; height: 0.14rem;
                }
                >.status-text {
                    position: absolute;
                    top: 0; bottom: 0; left: 0.34rem;
                    height: 0.2rem;
                    line-height: 0.2rem;
                }
                >.time {
                    position: absolute;
                    top: 0.01rem; right: 0.12rem;
                    height: 0.18rem;
                    line-height: 0.18rem;
                    font-size: 0.13rem;
                    color: #999;
                }
            }
            >.detail-info {
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
                    height: 0.2rem;
                    line-height: 0.2rem;
                    font-size: 0.1rem; letter-spacing: 0.02rem;
                    color: #999;
                }
            }
            >.detail-give {
                float: left;
                margin: 0.18rem 0 0 0.12rem;
                width: 100%;
                >.img {
                    float: left;
                    margin-top: 0.01rem;
                    width: 0.3rem; height: 0.16rem;
                }
                >.text {
                    float: left;
                    margin-left: 0.08rem;
                    width: 2.9rem;
                    line-height: 0.18rem;
                    font-size: 0.12rem;
                    color: #666;
                }
            }
            >.detail-warranty {
                float: left;
                margin: 0.1rem 0 0 0.12rem;
                width: 100%;
                >.img {
                    float: left;
                    margin-top: 0.01rem;
                    width: 0.5rem; height: 0.16rem;
                }
                >.text {
                    float: left;
                    margin-left: 0.08rem;
                    width: 2.7rem;
                    line-height: 0.18rem;
                    font-size: 0.12rem;
                    color: #666;
                }
            }
            >.detail-price {
                clear: both;
                float: right;
                margin: 0.13rem 0.12rem 0.11rem 0;
                text-align: right;
                >.count {
                    float: left;
                    height: 0.18rem;
                    line-height: 0.18rem;
                    font-size: 0.13rem;
                    color: #999;
                }
                >.coupon {
                    float: left;
                    margin-right: 0.08rem;
                    height: 0.18rem;
                    line-height: 0.18rem;
                    font-size: 0.13rem;
                    color: #999;
                }
                >.remiss {
                    float: left;
                    height: 0.18rem;
                    margin-right: 0.08rem;
                    line-height: 0.18rem;
                    font-size: 0.13rem;
                    color: #999;
                }
                >.amount {
                    float: left;
                    height: 0.18rem;
                    line-height: 0.18rem;
                    font-size: 0.13rem; font-weight: bold;
                }
            }
            >.detail-button {
                clear: both;
                margin-top: 0.12rem;
                height: 0.55rem;
                border-top: 0.01rem solid #efefef;
                >.detail-button-item {
                    height: 0.55rem;
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
                        border: 0.01rem solid #ff2c79;
                        color: #ff2c79;
                    }
                    >span {
                        float: right;
                        margin: 0.18rem 0.12rem 0 0;
                        height: 0.18rem;
                        line-height: 0.18rem;
                        font-size: 0.13rem;
                        color: #666;
                    }
                }
            }
        }
        >.empty {
            position: relative;
            margin: 1.63rem auto 0 auto;
            width: 1.5rem; height: 1.45rem;
            >img {
                position: absolute;
                top: 0; left: 0;
                width: 1.5rem; height: 1.09rem;
            }
            >span {
                position: absolute;
                bottom: 0; left: 0; right: 0;
                text-align: center; line-height: 0.2rem;
                font-size: 0.14rem;
                color: #666;
            }
        }
    }
    #list.gap {
        margin-top: 0.48rem;
    }
</style>
