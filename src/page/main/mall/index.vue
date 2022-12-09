<!--
 * 文件描述：商城首页
 * 创建人：赵志银
 * 创建时间：2019-03-14
-->
<template>
    <div id='main' ref='main'>
        <van-pull-refresh 
            v-model='isRefresh'
            @refresh='onRefresh()'
        >
            <div v-if='isHas'>
                <div id='banner' ref='banner' v-if = "bannerArr.length>0" class='wm_padding'>
                    <van-swipe :autoplay='4000' id='wm_index'>
                        <van-swipe-item v-for='(item, i) in bannerArr' :key='i'>
                            <img :src='item.cover' @click='jumpLink(item.link)' class='banner_list'>
                        </van-swipe-item>
                    </van-swipe>
                </div>

                <div class='tag_three'>
                    <div class='tag_list'>
                        <img v-lazy='require("@/assets/images/mall/index/l1.png")' />
                        <div>自营品牌</div>
                    </div>
                    <div class='tag_list'>
                        <img v-lazy='require("@/assets/images/mall/index/l2.png")' />
                        <div>正品保证</div>
                    </div>
                    <div class='tag_list'>
                        <img v-lazy='require("@/assets/images/mall/index/l3.png")' />
                        <div>售后无忧</div>
                    </div>
                </div>

                <div id='goods'  ref='goods'>
                    <van-list
                        v-model='loading'
                        :finished='finished'
                        :error.sync='error'
                        finished-text="-没有更多内容-"
                        error-text='请求失败，点击重新加载'
                        @load="initData"
                    >
                        <div :class='["goods_list", {"left":(i%2==0)}]' v-for='(item, i) in hotListArr'  :key='i' @click='goDetail(item.goods_code)'>
                            <img class='head' v-lazy='item.cover'>
                            <h1 class='title text_ellipsis2'>{{item.name}}</h1>
                        
                            <div class='tag' v-show = "item.mark.status=='1'&&paramObj.goods_type=='1'" ref='tag' id='tag'>
                                <div class='tag_box' v-if='tagLength<item.mark.content.length'>
                                    <span>{{item.mark.content}}</span><span style="display: inline-block; width: 5em;"></span>
                                    <span>{{item.mark.content}}</span><span style="display: inline-block; width: 5em;"></span>
                                    <span>{{item.mark.content}}</span><span style="display: inline-block; width: 5em;"></span>
                                </div>
                                <div class='tag_con' v-if='tagLength >= item.mark.content.length'>{{item.mark.content}}</div>
                            </div>

                            <div class='price'>
                                <span class='wm_color_main'>￥</span><span class='wm_color_main'>{{priceTransitionTwo(item.price)}}</span><span v-if='!isEmpty(item.original_price)&&(item.original_price!=0) && (priceTransitionTwo(item.original_price) != item.price)'>￥{{priceTransitionTwo(item.original_price)}}</span>
                            </div>
                            <div class='people'>{{item.saled}}人购买</div>
                        </div>
                    </van-list>
                </div>

                <div :class='["order_call", {"order_btn_hid":isOrderHid},{"order_btn_show":!isOrderHid}, {"order_btn_wec":browserType != "app"}]' v-if='(!isEmpty(version)&&browserType=="app")||browserType!="app"'>
                    <img v-lazy='require("@/assets/images/mall/index/call.png")' class='call_btn' @click='call()' v-if='browserType == "app"'>
                    <img v-lazy='require("@/assets/images/mall/index/order.png")' class='order_btn' @click='goOrder()'>
                </div>
            </div>
        </van-pull-refresh>

        <div style='display:none;'>
            <loginCheck ref='loginCheck'></loginCheck>
        </div>
    </div>
</template>
<script type='text/javascript'>
    import loginCheck from '@/components/loginCheck'
    import {isEmpty, getBrowserType, convert23, fullScreenHeight, validLink, getParameter, getLocalToken, urlChange, setWechatRole, priceTransitionTwo, appFun, getCookie, getAppVersion, setAppHeader} from '@/utils/CommonUtils.js'
    import Vue from 'vue'

    import { PullRefresh, List, Swipe, SwipeItem} from 'vant'
    import 'vant/lib/swipe/style'
    import 'vant/lib/swipe-item/style'
    import 'vant/lib/list/style'
    import 'vant/lib/pull-refresh/style'
    Vue.use(Swipe).use(SwipeItem)
    Vue.use(PullRefresh).use(List) 

    import sdk from '@/utils/weichatShareUtils.js'

    export default {
        components: {
            loginCheck
        },
        data() {
            return {
                /** 返回数据 **/
                paramObj: {},
                isHas: false,

                isRefresh: false,
                loading: false,
                finished: false,
                error: false,

                hotListArr: [],
                bannerArr: {},
                tagLength: 0,
                referDataObj: {},
                currpage: 1,

                scrollTop: 0, // 记录当前的滚动距离
                isOrderHid: false,

                priceTransitionTwo: priceTransitionTwo,
                isEmpty: isEmpty,
                version: getAppVersion(),
                browserType: getBrowserType(),
            }
        },
        mounted() {
            this.$axios.post('http://api-live.sunnycare.cc/API/V1/UserAssessRecord/getUserAssessRecordByUserID', {
                token: getLocalToken()
            })
            .then(response => {
            })
            .catch(response => {

            })

            //页面初始化
            this.initParam()
            if (this.browserType == 'app') {
                this.$wm_data.setFooter = false
                if(this.paramObj.goods_type=='1') {
                    this.$wm_data.setHeader({title: '商城',share: true})
                }else if(this.paramObj.goods_type=='3') {
                    this.$wm_data.setHeader({title: '商城'})
                }
            } else {
                this.$wm_data.setFooter = true
                this.$wm_data.setHeader({title: '商城',back: false})
            }
            document.body.style.overflow = ''
            document.documentElement.style.overflow=''
            fullScreenHeight(this.$refs.main)
            this.$wm_dialog.loading()

            let isFirst = true
            let inter
            //微信授权
            if (getBrowserType() == 'wechat' && isEmpty(this.$route.query.openid) && (isEmpty(sessionStorage.wm_wechat_openid)||isEmpty(sessionStorage.wm_wechat_unionid)||isEmpty(sessionStorage.wm_wechat_headimgurl))) { //跳转微信授权
                const url = convert23(host_path)+'mall/index?goods_type='+this.paramObj.goods_type+'&referral_code='+getParameter('referral_code')+'&sn='+getParameter('sn')
                window.location.replace(c_request+'v1/wechat/login?back_url='+url)
                inter = setInterval(()=>{
                    let urlObj = urlChange(window.location.href)
                    if(!isEmpty(urlObj.openid)&&(isEmpty(sessionStorage.wm_wechat_openid)||isFirst)) {
                        isFirst = false
                        setWechatRole(urlObj)
                        if(isEmpty(urlObj.token)) {
                            sessionStorage.wm_token = ''
                            localStorage.wm_token = ''
                        }
                        this.initPage()
                    }
                    if((!isEmpty(sessionStorage.wm_wechat_openid)&&!isFirst)&&!isEmpty(urlObj.openid)) {
                        clearInterval(inter)
                    }
                },500)
                if((!isEmpty(sessionStorage.wm_wechat_openid)&&!isFirst)) {
                    clearInterval(inter)
                }
                return
            }
            isFirst = false
            clearInterval(inter)

            //数据初始化
            if(getBrowserType() == 'wechat' && !isEmpty(this.$route.query.openid)) {
                let urlObj = urlChange(window.location.href)
                if(isEmpty(urlObj.token)) {
                    sessionStorage.wm_token = ''
                    localStorage.wm_token = ''
                }
                setWechatRole(urlObj)
            }
            this.initPage()
        },
        methods: {
            /**
                初始化链接
                @param
                @return
            */
            initParam() {
                this.paramObj = urlChange(window.location.href)
                if(isEmpty(this.paramObj.goods_type)) {
                    this.paramObj.goods_type = 1
                }
            },
            /**
                初始化页面
                @param
                @return
            */
            initPage() {
                this.initParam()
                this.initBanner()
                setTimeout(()=>{
                    if(isEmpty(this.hotListArr)){
                        this.$wm_dialog.loading()
                    }
                },1000)
                window.addEventListener('scroll', this.pageScroll)
                // 获取tag最长字数
                this.tagLength = Math.floor(document.body.offsetWidth/375*160/11)
                sessionStorage.wm_goods_code = ''
                this.share()
            },
            /**
                分享
                @param
                @return
            */
            share() {
                //微信分享
                if(getBrowserType() == 'wechat') {
                    let obj={
                        title: '澜渟商城',
                        des: '更多产后康复好物，尽在澜渟商城！',
                        linkurl: window.location.protocol+ '//' + window.location.host + '/#/mall/index?goods_type=1',//分享链接
                        img: 'http://mall.sunnycare.cc/static/img/common/logo.png'
                    }
                    let urlshare = encodeURIComponent(window.location.href.split('#')[0]);
                    sdk.getJSSDK(urlshare, obj) 
                } else if(getBrowserType() == 'app') {
                    //app分享-老版分享
                    sessionStorage.wm_title = '澜渟商城'
                    sessionStorage.wm_desc = '更多产后康复好物，尽在澜渟商城！'
                    sessionStorage.wm_link = window.location.protocol+ '//' + window.location.host + '/#/mall/index?goods_type=1'
                    sessionStorage.wm_icon = ''

                    if(this.version) {
                        //app分享-新版分享-新增
                        sessionStorage.wm_share_type = '501'
                        sessionStorage.wm_share_code = ''
                    }
                }
            },
            /**
                客服
                @param
                @return
            */
            call() {
                if(this.browserType == 'app') {
                    appFun(()=> {
                        window.jsInterface.jumpToCustomer(JSON.stringify({type:'CSP0007'}))
                    }, ()=> {
                        window.webkit.messageHandlers.jumpToCustomer.postMessage({type:'CSP0007'})
                    })
                } else {
                    window.location.href = 'tel:400-133-5668'
                }
            },
            /**
                跳转订单页面
                @param
                @return
            */
            goOrder() {
                this.$refs.loginCheck.checkToken(()=>{
                    if(this.browserType == 'app') {
                        appFun(()=> {
                            window.jsInterface.goOrder()
                        }, ()=> {
                            window.webkit.messageHandlers.goOrder.postMessage(null)
                        })
                    } else {
                        this.$router.push({path: '../my/order/list'})
                    }
                })
            },
            /**
                页面滚动
                @param
                @return
            */
            pageScroll() {
                this.scrollTop = window.scrollY
                if(!this.isOrderHid) {
                    this.isOrderHid = true
                }
            },
            /**
                初始化banner
                @param
                @return
            */
            initBanner() {
                this.$axios.post(live_request+'v1/goods/banner', {
                    token: getLocalToken()
                })
                .then(response => {
                    if (response.code == 200) {
                        this.bannerArr = response.data
                    }
                    this.isHas = true
                    this.$wm_dialog.closeLoading()
                })
                .catch(response => {

                })
            },
            /**
                初始化商品列表
                @param
                @return
            */
            initData() {
                this.$axios.post( live_request+'v2/goods/list', {
                    type: '3',
                    goods_type: this.paramObj.goods_type,
                    page: this.currpage,
                    referral_code: getParameter('referral_code')
                })
                .then(response => {
                    let dataObj = response.data
                    if (response.code == 200) {
                        this.hotListArr = (this.currpage==1)?dataObj.goodslist:this.hotListArr.concat(dataObj.goodslist)
                    }
                    this.loading = false
                    if(dataObj.is_last_page == 1) {
                        this.finished = true
                    }
                    this.isHas = true
                    this.$wm_dialog.closeLoading()
                    this.currpage++
                })
                .catch(response => {
                })
            },
            /**
                下拉刷新
                @param
                @return
            */
            onRefresh() {
                this.finished = false
                this.loading = false
                this.error = false
                this.currpage = 1
                this.initData()
                this.initBanner()
                setTimeout(() => {
                    this.isRefresh = false
                }, 500)
            },
            /**
                跳转链接
                @param{String}src 跳转链接
                @return
            */
            jumpLink(src) {
                if (validLink(src)) {
                    window.location.href = src
                }
            },
            /**
                商品详情
                @param {String}code 商品详情code
                @return
            */
            goDetail(code) {
                let path = '../mall/details?goods_code='+code+'&goods_type='+this.paramObj.goods_type
                if(this.paramObj.goods_type!=1) {
                    path += '&referral_code='+this.paramObj.referral_code+'&sn='+this.paramObj.sn
                }
                this.$router.push({path: path})
            },
        },
        activated() {
            if (this.browserType == 'app') {
                this.$wm_data.setFooter = false
                if(this.paramObj.goods_type=='1') {
                    this.$wm_data.setHeader({title: '商城',share: true})
                }else if(this.paramObj.goods_type=='3') {
                    this.$wm_data.setHeader({title: '商城'})
                }
            } else {
                this.$wm_data.setFooter = true
                this.$wm_data.setHeader({title: '商城',back: false})
            }
            setAppHeader()
            this.share()
            if (!this.$route.meta.isBack) {
                this.currpage = 1
                this.initParam()
                this.initPage()
            }
            this.$route.meta.isBack = false
        },
        watch: {
            scrollTop(newValue, oldValue) {
                setTimeout(() => {
                    if(newValue == window.scrollY) {
                        this.isOrderHid = false
                    }
                }, 500)
            }
        },
        beforeDestroy() {
            window.removeEventListener('scroll',this.pageScroll)
        },
        destroyed() {
            //页面销毁时，如果上一页是支付成功页，
            if(sessionStorage.wm_from == 'success') {
                if(this.browserType == 'app') {
                    appFun(()=> {
                        window.jsInterface.closeWindow()
                    }, ()=> {
                        window.webkit.messageHandlers.closeWindow.postMessage(null)
                    })
                } else {
                    history.go(-(localStorage.wm_router_history.split(',').length))
                    localStorage.wm_router_history = ''
                    history.go(-history.length)
                }
                sessionStorage.wm_from = ''
            }
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        position: relative;
        width: 100%;
        background-color: #f4f5f5;
    }
    #banner {
        position: relative;
        width: 100%;
        margin: auto; padding: 0.08rem 0.12rem 0 0.12rem;
        .van-swipe {
            position: relative;
            height: 1.4rem; width: 100%;
            border-radius: 4px;
            .banner_list {
                display: block;
                width: 100%; height: 1.4rem;
                border-radius: 4px;
            }
            >>>.van-swipe__indicators {
                bottom: 0.1rem !important;
                height: 0.06rem !important;
                line-height: 0.06rem !important;
                /deep/.van-swipe__indicators {
                    margin: 0 0.03rem !important;
                    width: 0.06rem; height: 0.06rem !important;
                    opacity: 1 !important;
                    background: rgba(255,255,255,0.5) !important;
                }
                /deep/.van-swipe__indicator--active {
                    background: #fff !important;
                }
            }
        }
    }
    .tag_three {
        position: relative;
        margin: 0.16rem 0.08rem 0.08rem 0.08rem;
        display: flex;
        align-items: center;
        height: 0.18rem;
        .tag_list {
            width: 33%;
            display: flex;
            align-items: center; justify-content: center;
            img{
                display: block;
                margin-right: 2px;
                width: 0.16rem; height: 0.16rem;
            }
            div {
                font-size: 0.13rem;
            }
        }
    }
    
    #goods {
        position: relative;
        margin: auto; padding: 0.12rem;
        width: 100%;
        .left {
            margin-right: 0.09rem;
        }
        .goods_list {
            position: relative;
            display: inline-block;
            margin-bottom: 0.09rem;
            width: calc((100% - 0.09rem)/2); height: 2.69rem;
            box-shadow: #f1f1f1 0px 0px 10px;
            border-radius: 0.06rem;
            text-align: left;
            background-color: #fff;
            overflow: hidden;
            .head {
                display: block;
                width: 100%; height: 1.70rem;
            }
            .title {
                position: absolute;
                top: 1.78rem; left: 0; right: 0;
                margin: auto; padding: 0 0.12rem;
                width: 100%;
                font-size: 0.14rem; font-weight: normal;
            }
            .tag {
                position: absolute;
                top: 1.56rem; left: 0;
                padding-left: 0.1rem;
                width: 100%; height: 0.2rem;
                line-height: 0.2rem;
                background: linear-gradient(45deg, #FFB8C6 0%, #F15676 100%);
                border-radius: 0.12rem 0 0.12rem 0;
                overflow: hidden;
                .tag_box {
                    display: inline-block;
                    position: relative;
                    height: 0.2rem;
                    white-space: nowrap;
                    animation: horse_animation 6s linear infinite;
                    span {
                        display: inline-block;
                        height: 0.2rem;
                        line-height: 0.2rem; vertical-align: top;
                        font-size: 0.11rem; color: #fff;
                    }
                }
                .tag_con {
                    font-size: 0.11rem; color: #fff;
                }
            }
            .price {
                position: absolute;
                bottom: 0.25rem; left: 0.12rem;
                height: 0.22rem;
                span:nth-of-type(1) {
                    font-size: 0.11rem; font-weight: bold;
                }
                span:nth-of-type(2) {
                    font-size: 0.18rem; font-weight: bold;
                }
                span:nth-of-type(3) {
                    margin-left: 0.05rem;
                    font-size: 0.11rem; color: #999;
                    text-decoration: line-through; 
                }
            }
            
            .people {
                position: absolute;
                bottom: 0.1rem; left: 0.12rem;
                height: 0.14rem;
                line-height: 0.14rem;
                font-size: 0.1rem; color: #999;
            }
        }
    }
    .order_call {
        position: fixed;
        bottom: 0.35rem; right: 0.07rem;
        width: 0.56rem; 
        img {
            display: block;
            height: 0.56rem; height: 0.56rem;
        }
        .order_btn {
            margin-top: 0.07rem;
        }
    }
    .order_btn_wec {
        bottom: 0.85rem
    }

    .order_btn_hid {
        animation: right_hid 0.3s linear forwards;
    }
    .order_btn_show {
        animation: right_show 0.3s linear forwards;
    }
    @keyframes horse_animation{ 
        0% { 
            transform: translateX(0); 
        } 
        100% { 
            transform: translateX(-33.33%); 
        } 
    }

    @keyframes right_hid {
        0% { 
            right: 0.07rem;
            opacity: 1;
        } 
        100% { 
            right: -0.3rem;
            opacity: 0.7;
        } 
    }
    @keyframes right_show {
        0% { 
            right: -0.3rem;
            opacity: 0.7;
        } 
        100% { 
            right: 0.07rem;
            opacity: 1;
        } 
    }
</style>
