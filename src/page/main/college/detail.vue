<template>
    <div id='main'>
        <div class='header'>
            <div class='headerImgBox'>
                <div class='liveTypeBox' v-if='paramObj.type=="LT11"||paramObj.type=="LT13"'>
                    <img src='./images/detail/audio.png' v-if='dataObj.is_broad==0'>
                    <img src='./images/detail/video.png' v-if='dataObj.is_broad==1'>
                    <div>
                        <img src='./images/detail/pre_tip.png' v-if='dataObj.status==0'>
                        <img src='./images/detail/live_tip.gif' v-if='dataObj.status==1'>
                        <img src='./images/detail/end_tip.png' v-if='dataObj.status==2&&((dataObj.is_broad==0)||(dataObj.is_broad==1&&dataObj.push_status==2))'>
                        <img src='./images/detail/live_back.png' v-if='dataObj.is_broad==1&&dataObj.push_status==3'>
                        <span v-if='(dataObj.is_broad==0)||(dataObj.is_broad==1&&dataObj.push_status!=3)'>{{getLiveStatus(dataObj.status)}}</span>
                        <span v-if='dataObj.is_broad==1&&dataObj.push_status==3'>{{getVideoStatus(dataObj.push_status)}}</span>
                    </div>
                </div>
                <div class="headerPopup" v-if='isCountdown'></div>
                <div class="popupContent" v-if='isCountdown'>
                    <span class="trailContentOne">距开始还剩</span>
                    <div class="timeNum">
                        <span class="num">{{dateArr[0]}}</span>
                        <span class="word">天</span>
                        <span class="num">{{dateArr[1]}}</span>
                        <span class="word">时</span>
                        <span class="num">{{dateArr[2]}}</span>
                        <span class="word">分</span>
                        <span class="num">{{dateArr[3]}}</span>
                        <span class="word">秒</span>
                    </div>
                </div>
                <img class='headerImg' v-if='isDataLoad' :src='dataObj.cover+compressImg(800,800)'>
            </div>
            <div class='headerContent'>
                <div :class='"titleMark "+getMarkClass()'>{{getMarkText()}}</div>
                <div class='titleBox'>{{dataObj.name}}</div>
                <div class='liveDetail'>
                    <div :class='isExpand ? "liveDetailTitle" : "liveDetailTitle ellipsis2"'>{{dataObj.short_name}}</div>
                    <div class='liveExpand' bindtap='expand'>
                        <img v-if='isExceed' :class='isExpand ? "moreTextArrow collapseArrow": "moreTextArrow"' src='./images/detail/list.png'>
                    </div>
                </div>
                <div class='liveTime'>
                    <div>
                        <span class='livePeopleNum' v-if='!isCountdown'>{{propleFilter(dataObj.learn_num)}}人学习</span>
                        <span class='livePeopleNum' v-if='isCountdown'>{{propleFilter(dataObj.sub)}}人预约</span>
                    </div>
                    <div class='liveTimeDetail' v-if='paramObj.type=="LT11"||paramObj.type=="LT13"'>开始时间：{{dataObj.start_at}}</div>
                </div>
            </div>
        </div>
        <div class='coup' @click='seeCoupon' v-if='getCouponShow()'>
            <div class='coupon'>
                <span>优惠券</span>
                <div>
                    <div v-for='(item, i) in couponArr' v-if='i<=1' :key='i'>
                        <span>{{priceTransition(item.amount)}}元优惠券</span>
                        <img src='./images/detail/coupon.png'>
                    </div>
                </div>
                <span>领券</span>
                <img src='./images/detail/right.png'>
            </div>
        </div>
		<div id='couponDialog' v-if='isCouponDialogShow' @click='closeCoupon()'>
			<div :class='isCouponDialogUp?"couponContent comeIn":"couponContent comeOut"' @click.stop='seeCoupon()'>
                <div class='list' v-for='(item, i) in couponArr' :key='i' @click.stop='getCoupon(item)'>
                    <img src='./images/detail/current.png' v-if='item.common_type==0'>
                    <img src='./images/detail/pri.png' v-if='item.common_type==1'>
                    <span>{{priceTransition(item.amount)}}</span>
                    <div>{{item.name}}</div>
                    <div>{{item.begin_date}}-{{item.end_date}}</div>
                    <div v-if='item.is_get==0'>领取</div>
                    <img src='./images/detail/has.png' class='has' v-if='item.is_get==1'>
                    <div class='full' v-if='item.type==1'>满{{priceTransition(item.full_value)}}使用</div>
                </div>
                <div class='popupBtn'>
                    <span @click.stop='closeCoupon()'>确定</span>
                </div>
            </div>
		</div>
        <div class='detail'>
            <div class='detailContent'>
                <div class='detailCaption'>详情</div>
                <div class='courseFocus'>重点</div>
                <img v-for='(item, i) in dataObj.detail' :key='i' class='detailImg' :src='item'>
                <span class='liveOldDetail' v-if='dataObj.detail!=undefined && dataObj.old_detail!=""'>{{dataObj.old_detail}}</span>
                <div class='contentBox' v-if='paramObj.type=="LT11"||paramObj.type=="LT13"'>
                    <div class='detailTitle'>嘉宾</div>
                    <div class='courseTeacher' v-for='(item, i) in dataObj.member' :key='i'>
                        <img :src='item.avatar+compressImg(200,200)'>
                        <div class='teacherInfo'>
                            <div class='teacherName'>
                                <span>{{item.nickname}}</span>
                                <div></div>
                                <span v-if='item.rule_type == "1"'>主持人</span>
                                <span v-if='item.rule_type == "2"'>嘉宾</span>
                            </div>
                            <div class='jobTitle ellipsis2'>{{item.remark}}</div>
                        </div>
                    </div>
                    <div class='detailTitle'>适用人群</div>
                    <div class='detailText'>{{dataObj.for_people}}</div>
                </div>
            </div>
        </div>
        <div class='bottomReplace'></div>
        <div class='fixBottom'>
            <!-- 直播（普通） -->
            <button class='enterBtn' v-if='paramObj.isRetail==0 && (paramObj.type=="LT11"||paramObj.type=="LT13")'>
                <div class='price' v-if='isEmpty(dataObj.price) || dataObj.price == 0' @click='goDownload()'>
                    <span class='buy'><span class='buyText'>{{isDataLoad?"打开澜渟APP 学习精彩课程":""}}</span></span>
                </div>
                <!-- 需购买 -->
                <div class='price' v-else-if='dataObj.is_authed == 0' @click='goBuy()'>
                    <span class='buy'>
                        <span class='buyText'>购买</span>
                        <span class='buyMark'>￥</span>
                        <span class='buyContent'>{{priceTrasTwo(dataObj.price)}}</span>
                    </span>
                    <span class='delete' v-if='dataObj.original_price>0&&dataObj.original_price>dataObj.price'>￥{{priceTrasTwo(dataObj.original_price)}}</span>
                </div>
                <!-- 无需购买 -->
                <div class='price' v-else @click='goPaySuccess()'>
                    <span class='buy'>
                        <span class='buyText'>购买</span>
                        <span class='buyMark'>￥</span>
                        <span class='buyContent'>{{priceTrasTwo(dataObj.price)}}</span>
                    </span>
                    <span class='delete' v-if='dataObj.original_price>0&&dataObj.original_price>dataObj.price'>￥{{priceTrasTwo(dataObj.original_price)}}</span>
                </div>
            </button>
            <!-- 直播（分销） -->
            <button class='enterBtn' v-if='paramObj.isRetail==1 && (paramObj.type=="LT11"||paramObj.type=="LT13")'>
                <div class='price' v-if='isEmpty(dataObj.display_price) || dataObj.display_price == 0' @click='goDownload()'>
                    <span class='buy'><span class='buyText'>{{isDataLoad?"打开澜渟APP 学习精彩课程":""}}</span></span>
                </div>
                <!-- 需购买 -->
                <div class='price' v-else-if='dataObj.is_authed == 0' @click='goBuy()'>
                    <span class='buy'>
                        <span class='buyText'>购买</span>
                        <span class='buyMark'>￥</span>
                        <span class='buyContent'>{{priceTrasTwo(dataObj.display_price)}}</span>
                    </span>
                    <span class='pop' v-if='dataObj.display_remiss_price > 0'>立减{{priceTrasTwo(dataObj.display_remiss_price)}}元</span>
                    <span class='delete' v-else>￥{{priceTrasTwo(dataObj.original_price)}}</span>
                </div>
                <!-- 无需购买 -->
                <div class='price' v-else @click='goPaySuccess()'>
                    <span class='buy'>
                        <span class='buyText'>购买</span>
                        <span class='buyMark'>￥</span>
                        <span class='buyContent'>{{priceTrasTwo(dataObj.display_price)}}</span>
                    </span>
                    <span class='pop' v-if='dataObj.display_remiss_price > 0'>立减{{priceTrasTwo(dataObj.display_remiss_price)}}元</span>
                    <span class='delete' v-else>￥{{priceTrasTwo(dataObj.original_price)}}</span>
                </div>
            </button>

            <!-- 课程+专栏（普通） -->
            <button class='enterBtn' v-if='paramObj.isRetail==0 && (paramObj.type=="LT09"||paramObj.type=="LT12"||paramObj.type=="LT10")'>
                <div class='price' v-if='isEmpty(dataObj.price) || dataObj.price == 0' @click='goDownload()'>
                    <span class='buy'><span class='buyText'>{{isDataLoad?"打开澜渟APP 学习精彩课程":""}}</span></span>
                </div>
                <!-- 需购买 -->
                <div class='price' v-else-if='dataObj.is_authed == 0' @click='goBuy()'>
                    <span class='buy'>
                        <span class='buyText'>购买</span>
                        <span class='buyMark'>￥</span>
                        <span class='buyContent'>{{priceTrasTwo(dataObj.price)}}</span>
                    </span>
                    <span class='delete' v-if='dataObj.original_price>0&&dataObj.original_price>dataObj.price'>￥{{priceTrasTwo(dataObj.original_price)}}</span>
                </div>
                <!-- 无需购买 -->
                <div class='price' v-else @click='goPaySuccess()'>
                    <span class='buy'>
                        <span class='buyText'>购买</span>
                        <span class='buyMark'>￥</span>
                        <span class='buyContent'>{{priceTrasTwo(dataObj.price)}}</span>
                    </span>
                    <span class='delete' v-if='dataObj.original_price>0&&dataObj.original_price>dataObj.price'>￥{{priceTrasTwo(dataObj.original_price)}}</span>
                </div>
            </button>
            <!-- 课程+专栏（分销） -->
            <button class='enterBtn' v-if='paramObj.isRetail==1 && (paramObj.type=="LT09"||paramObj.type=="LT12"||paramObj.type=="LT10")'>
                <div class='price' v-if='isEmpty(dataObj.display_price) || dataObj.display_price == 0' @click='goDownload()'>
                    <span class='buy'><span class='buyText'>{{isDataLoad?"打开澜渟APP 学习精彩课程":""}}</span></span>
                </div>
                <!-- 需购买 -->
                <div class='price' v-else-if='dataObj.is_authed == 0' @click='goBuy()'>
                    <span class='buy'>
                        <span class='buyText'>购买</span>
                        <span class='buyMark'>￥</span>
                        <span class='buyContent'>{{priceTrasTwo(dataObj.display_price)}}</span>
                    </span>
                    <span class='pop' v-if='dataObj.display_remiss_price > 0'>立减{{priceTrasTwo(dataObj.display_remiss_price)}}元</span>
                    <span class='delete' v-else>￥{{priceTrasTwo(dataObj.original_price)}}</span>
                </div>
                <!-- 无需购买 -->
                <div class='price' v-else @click='goPaySuccess()'>
                    <span class='buy'>
                        <span class='buyText'>购买</span>
                        <span class='buyMark'>￥</span>
                        <span class='buyContent'>{{priceTrasTwo(dataObj.display_price)}}</span>
                    </span>
                    <span class='pop' v-if='dataObj.display_remiss_price > 0'>立减{{priceTrasTwo(dataObj.display_remiss_price)}}元</span>
                    <span class='delete' v-else>￥{{priceTrasTwo(dataObj.original_price)}}</span>
                </div>
            </button>
        </div>
        <div class='liveDetail_replace' id='liveDetail_replace'>{{dataObj.short_name}}</div>
        <div @click='clearStorage()' style='font-size:0.14rem;position:fixed;z-index:999;left:0.2rem;top:0.6rem;background:red;color:#fff;width:0.8rem;height:0.32rem;text-align:center;line-height:0.32rem;border-radius:0.1rem;'>清缓存</div>
    </div>
</template>

<script>
let liveTimer

import {getParameter, compressImg, isEmpty, convert23} from '@/utils/CommonUtils.js'

export default {
    data() {
        return {
            paramObj: {},
            dataObj: {},
            couponArr: [],
            dateArr: [],
            isDataLoad: false,
            isCountdown: false,
            isExceed: false, //是否超过两行
            isExpand: false, //是否展开
            isCouponDialogShow: false,
            isCouponDialogUp: false,
            compressImg: compressImg,
            isEmpty: isEmpty
        }
    },
    mounted() {
        clearInterval(liveTimer)
        this.$wm_data.setHeader({title: '澜渟极致学院',isShow: false})
        this.$wm_data.setFooter = false
        this.paramObj = {
            type: getParameter('type'), //LT09-音频课程，LT12-视频课程，LT10-专栏、LT11-音频直播、LT13-视频直播
            isRetail: getParameter('a').split(',')[0], //是否分销
            code: getParameter('a').split(',')[1], //课程code
            refCode: getParameter('a').split(',')[2] //推荐码
        }
        if (this.paramObj.isRetail == 0) {
            this.paramObj.refCode = ''
        }
        if (this.paramObj.type == 'LT11' || this.paramObj.type == 'LT13') {
            this.initLiveData()
        } else if (this.paramObj.type == 'LT09' || this.paramObj.type == 'LT12') {
            this.initCourseData()
        } else if (this.paramObj.type == 'LT10') {
            this.initSpeData()
        }
        this.initCoupon()
        if (isEmpty(this.$route.query.openid)) { //跳转微信授权
            const url = convert23(host_path)+'college/detail?type='+getParameter('type')+'&a='+getParameter('a')+'&timeStamp=' + (new Date()).getTime()
            window.location.replace(c_request+'v1/wechat/login?back_url='+url)
        }
    },
    destroyed() {
        clearInterval(liveTimer)
    },
    methods: {
        //TODO
        clearStorage() {
            localStorage.token = ""
            localStorage.phone = ""
        },
        /**
            初始化直播数据
            @param
            @return
        */
        initLiveData() {
            let data = {
                token: localStorage.token,
                live_code: this.paramObj.code
            }
            if (this.paramObj.isRetail == 1) {
                data.referral_code = this.paramObj.refCode
            }
            this.$wm_data.VERSIONFORAPP = '5.0.5'
            this.$axios.post(lesson_request+'v2/source/live', data)
            .then(res => {
                this.refreshRetail(res.data.is_retail)
                if (res.code == 200) {
                    this.isDataLoad = true
                    if (res.data.role_name == 1 || res.data.role_name == 2) { //主持人&嘉宾，金额=0
                        if (this.paramObj.isRetail == 0) {
                            res.data.price = 0
                        } else if (this.paramObj.isRetail == 1) {
                            res.data.display_price = 0
                        }
                    }
                    if (this.paramObj.isRetail == 1) {
                        res.data.display_price = parseInt(res.data.display_price)
                        res.data.display_remiss_price = parseInt(res.data.display_remiss_price)
                    } else {
                        res.data.price = parseInt(res.data.price)
                    }
                    res.data.original_price = parseInt(res.data.original_price)
                    this.dataObj = res.data
                    if (res.data.status == 0) {
                        let left_time = parseInt(res.data.left_time)
                        this.dateArr = this.processTime(left_time)
                        this.isCountdown = true
                        liveTimer = setInterval(() => {
                            this.dateArr = this.processTime(--left_time)
                            if (left_time <= 0) {
                                this.dataObj.status = 1
                                clearInterval(liveTimer)
                                this.initLiveData()
                            }
                        }, 1000)
                    } else {
                        this.isCountdown = false
                    }
                } else {
                    setTimeout(()=>{
                        this.goDownload()
                    }, 2000)
                }
            })
            .catch(response => {

            })
        },

        /**
            初始化课程数据
            @param
            @return
        */
        initCourseData() {
            let data = {
                token: localStorage.token,
                lesson_code: this.paramObj.code
            }
            if (this.paramObj.isRetail == 1) {
                data.referral_code = this.paramObj.refCode
            }
            this.$axios.post(lesson_request+'v2/source/lesson', data)
            .then(res => {
                this.refreshRetail(res.data.is_retail)
                if (res.code == 200) {
                    this.isDataLoad = true
                    if (this.paramObj.isRetail == 1) {
                        res.data.display_price = parseInt(res.data.display_price)
                        res.data.display_remiss_price = parseInt(res.data.display_remiss_price)
                    } else {
                        res.data.price = parseInt(res.data.price)
                    }
                    res.data.original_price = parseInt(res.data.original_price)
                    this.dataObj = res.data
                } else {
                    setTimeout(()=>{
                        this.goDownload()
                    }, 2000)
                }
            })
            .catch(response => {

            })
        },

        /**
            初始化专栏
            @param
            @return
        */
        initSpeData() {
            let data = {
                token: localStorage.token,
                spe_code: this.paramObj.code
            }
            if (this.paramObj.isRetail == 1) {
                data.referral_code = this.paramObj.refCode
            }
            this.$axios.post(lesson_request +'v3/source/spe', data)
            .then(res => {
                this.refreshRetail(res.data.is_retail)
                if (res.code == 200) {
                    this.isDataLoad = true
                    if (this.paramObj.isRetail == 1) {
                        res.data.display_price = parseInt(res.data.display_price)
                        res.data.display_remiss_price = parseInt(res.data.display_remiss_price)
                    } else {
                        res.data.price = parseInt(res.data.price)
                    }
                    res.data.original_price = parseInt(res.data.original_price)
                    this.dataObj = res.data
                } else {
                    setTimeout(()=>{
                        this.goDownload()
                    }, 2000)
                }
            })
            .catch(response => {

            })
        },

        /**
            刷新分销状态
            @param
            @return
        */
        refreshRetail(is_retail) {
            if (this.paramObj.isRetail == 0) {
                return
            }
            if (is_retail == 0) {
                this.paramObj.isRetail = 0
            } else if (is_retail == 1) {
                this.paramObj.isRetail = 1
            } else if (is_retail == 2) {
                this.paramObj.isRetail = 0
                this.$wm_dialog.tip('活动已结束')
            }
        },

        /**
            初始化优惠券
            @param
            @return
         */
        initCoupon() {
            let for_where = 11
            if (this.paramObj.type == 'LT11' || this.paramObj.type == 'LT13') {
                for_where = 11
            } else if (this.paramObj.type == 'LT09' || this.paramObj.type == 'LT12') {
                for_where = 2
            } else if (this.paramObj.type == 'LT10') {
                for_where = 3
            }
            this.$axios.post(live_request+'v1/coupon/canget', {
                token: localStorage.token,
                where_code: this.paramObj.code,
                for_where: for_where
            })
            .then(res => {
                if (res.code == 200) {
                    let data = res.data
                    for (let i in data) {
                        data[i].begin_date = data[i].begin_date.replace(/-/g, '.')
                        data[i].end_date = data[i].end_date.replace(/-/g, '.')
                    }
                    this.couponArr = data
                }
            })
            .catch(response => {

            })
        },
        
        /**
            获取优惠券是否显示
            @param
            @return
         */
        getCouponShow() {
            if (this.paramObj.isRetail == 1) {
                return false
            }
            if (isEmpty(this.couponArr)) {
                return false
            }
            //免费直播/课程/专栏 & 限时免费课程/专栏：优惠券不显示
            if (this.paramObj.isRetail == 0) {
                if (isEmpty(this.dataObj.price) || this.dataObj.price == 0) {
                    return false
                }
            } else if (this.paramObj.isRetail == 1) {
                if (isEmpty(this.dataObj.display_price) || this.dataObj.display_price == 0) {
                    return false
                }
            }
            //加密直播：优惠券不显示
            if (this.paramObj.type == 'LT11' || this.paramObj.type == 'LT13') {
                if (this.dataObj.liveType == 2) {
                    return false
                }
            }
            //已登录
            if (!isEmpty(localStorage.token)) {
                //已授权（已购买、已兑换、Svip/Vip）：优惠券不显示
                if (this.dataObj.is_authed == 1) {
                    return false
                }
                //直播身份是主持人/嘉宾：优惠券不显示
                if (this.paramObj.type == 'LT11' || this.paramObj.type == 'LT13') {
                    if (this.dataObj.role_name == 1 || this.dataObj.role_name == 2) {
                        return false
                    }
                }
            }
            return true
        },
        /**
            弹出优惠券
            @param
            @return
         */
        seeCoupon() {
            this.validToken(()=> {
                this.isCouponDialogUp = true
                this.isCouponDialogShow = true
                document.querySelector('html').style.position = 'fixed'
                document.querySelector('body').style.position = 'fixed'
            })
        },
        /**
            领取优惠券
            @param
            @return
         */
        getCoupon(item) {
            if (item.is_get == '1') {
                return
            }
            this.$wm_data.VERSIONFORAPP = 'noCheckToken'
            this.$axios.post(live_request+'v1/coupon/get', {
                token: localStorage.token,
                coupon_code: item.code
            })
            .then(res => {
                if (res.code == 200) {
                    this.initCoupon()
                }
            })
            .catch(response => {

            })
        },
        /**
            关闭优惠券
            @param
            @return
         */
        closeCoupon() {
            this.isCouponDialogUp = false
            setTimeout(()=>{
                this.isCouponDialogShow = false
                document.querySelector('html').style.position = 'static'
                document.querySelector('body').style.position = 'static'
            }, 300)
        },

        /**
            跳转-下载
            @param
            @return
         */
        goDownload() {
            window.location.href = downUrl
        },
        /**
            跳转-购买
            @param
            @return
         */
        goBuy() {
            this.validToken(()=> {
                let url = pay_url + 'college/product?price=' + this.dataObj.price
                if (!isEmpty(this.paramObj.refCode)) {
                    url += '&refCode='+this.paramObj.refCode
                }
                if (this.paramObj.type == 'LT11' || this.paramObj.type == 'LT13') {
                    url += '&type=11'
                } else if (this.paramObj.type == 'LT09' || this.paramObj.type == 'LT12') {
                    url += '&type=2'
                } else if (this.paramObj.type == 'LT10') {
                    url += '&type=3'
                }
                url += '&isRetail='+this.paramObj.isRetail+'&token='+localStorage.token+'&code='+this.paramObj.code
                +'&phone='+localStorage.phone+'&openid='+this.$route.query.openid
                window.location.href = url
            })
        },
        /**
            跳转-支付成功
            @param
            @return
         */
        goPaySuccess() {
            this.validToken(()=> {
                let type = 2
                if (this.paramObj.type == 'LT11' || this.paramObj.type == 'LT13') {
                    type = 2
                } else if (this.paramObj.type == 'LT09' || this.paramObj.type == 'LT12') {
                    type = 0
                } else if (this.paramObj.type == 'LT10') {
                    type = 1
                }
                this.$router.push({path: './payResult?payType=2&code='+this.paramObj.code+'&type='+type})
            })
        },

        /**
            校验token
            @param {function} callback 回调函数
            @return
         */
        validToken(callback) {
            if (isEmpty(localStorage.token)) {
                this.goLogin()
                return
            }
            this.$wm_data.VERSIONFORAPP = 'noCheckToken'
            this.$axios.post(live_request+'common/token/check', {
                token: localStorage.token
            })
            .then(res => {
                if (res.code == 200) {
                    typeof (callback) == 'function' ? callback() : ''
                } else {
                    localStorage.token = ''
                    this.goLogin()
                }
            })
            .catch(response => {

            })
        },

        /**
            跳转-登录
            @param
            @return
         */
        goLogin() {
            this.$router.push({path: './login'})
        },

        /**
            转换时间
            @param {Number} second 秒数
            @return {Array} 时间的数组
         */
        processTime(second) {
            let day = Math.floor(second / 86400)
            let remain = second % 86400
            let hour = Math.floor(remain / 3600)
            remain = remain % 3600
            let minute = Math.floor(remain / 60)
            return [day, hour, minute, second % 60]
        },
        /**
            字典值-获取直播状态
            @param {Number}val 字典值
            @return {String} 字典描述
         */
        getLiveStatus(val) {
            if (val == 0) {
                return '预告'
            } else if (val == 1) {
                return 'LIVE'
            } else if (val == 2) {
                return '结束'
            }
            return val
        },
        /**
            字典值-获取视频直播状态
            @param {Number}val 字典值
            @return {String} 字典描述
         */
        getVideoStatus(val) {
            if (val == 0) {
                return '预告'
            } else if (val == 1) {
                return 'LIVE'
            } else if (val == 2) {
                return '结束'
            } else if (val == 3) {
                return '回放'
            }
            return val
        },
        /**
            过滤人数
            @param {Number} peopleNum 人数
            @return {String} 过滤后的人数
         */
        propleFilter (peopleNum) {
            if (!peopleNum && peopleNum != 0) {
                return
            }
            if (parseInt(peopleNum) < 10000) {
                return peopleNum
            } else if (parseInt(peopleNum) < 100000000) {
                var w = Math.floor(parseInt(peopleNum) / 1000) / 10
                return w.toFixed(1) + 'w'
            } else {
                var y = Math.floor(parseInt(peopleNum) / 10000000) / 10
                return y.toFixed(1) + 'y'
            }
        },
        /**
            价格分转元（精确到小数点后两位）
            @param {String} price 分
            @return {String} 元
        */
        priceTrasTwo(price) {
            if (isEmpty(price)) {
                return ''
            } else {
                return (price/100).toFixed(2)
            }
        },
        /**
            价格分转元
            @param {String}price 分
            @return {String} 元
        */
        priceTransition(price) {
            if (isEmpty(price)) {
                return ''
            }
            return parseInt(price) / 100
        },
        /**
            获取标签class
            @param
            @return {String} 标签class
        */
        getMarkClass() {
            if (this.paramObj.type=="LT11" || this.paramObj.type=="LT13") {
                return 'live'
            } else if (this.paramObj.type=="LT10") {
                return 'spec'
            } else if (this.paramObj.type=="LT09" || this.paramObj.type=="LT12") {
                return 'course'
            }
            return ''
        },
        /**
            获取标签文本
            @param
            @return {String} 标签文本
        */
        getMarkText() {
            if (this.paramObj.type=="LT11" || this.paramObj.type=="LT13") {
                return '直播'
            } else if (this.paramObj.type=="LT10") {
                return '专栏'
            } else if (this.paramObj.type=="LT09" || this.paramObj.type=="LT12") {
                return '课程'
            }
            return ''
        }
    }
}
</script>

<style lang='scss' scoped>
    .header {
        >.headerImgBox{
            position: relative;
            height: 2.1rem;
            >.liveTypeBox{
                position: absolute; z-index: 2;
                top: 0.1rem; right: 0;
                width: 0.68rem; height: 0.18rem;
                >img {
                    position: absolute;
                    top: 0; left: 0;
                    width: 0.28rem; height: 0.18rem;
                }
                >div {
                    position: absolute;
                    top: 0; right: 0;
                    width: 0.4rem; height: 0.18rem;
                    background-color: rgba(0, 0, 0, 0.6);
                    >img{
                        position: absolute;
                        top: 0.03rem; left: 0.03rem;
                        width: 0.11rem; height: 0.11rem;
                    }
                    >span{
                        position: absolute;
                        top: 0.04rem; right: 0.03rem;
                        height: 0.1rem;
                        line-height: 0.1rem;
                        font-size: 0.1rem;
                        color: #fff;
                    }
                }
            }
            >.headerPopup{
                position: absolute;
                left: 0; top: 0;
                width: 100%; height: 2.1rem;
                background-color: #000;
                opacity: 0.6
            }
            >.popupContent{
                display: flex; flex-direction: column; align-items: center;
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 2.1rem;
                >.trailContentOne{
                    display: block;
                    margin: 0.62rem 0 0.16rem 0;
                    font-size: 0.14rem; line-height: 0.2rem;
                    color: #fff; 
                }
                >.timeNum{
                    >.word{
                        display: inline-block; margin-right: 0.04rem;
                        font-size: 0.14rem; line-height: 0.33rem;
                        color: #fff;
                    }
                    >.num{
                        display: inline-block; margin-right: 0.05rem;
                        font-size: 0.24rem; line-height: 0.33rem;
                        color: #fff;
                    }
                }
            }
            >.headerImg{
                width: 100%;
                height: 2.1rem;
            }
        }
        >.headerContent {
            position: relative;
            padding: 0.2rem 0.14rem 0.15rem 0.16rem;
            >.titleMark {
                position: absolute;
                top: 0.2rem; left: 0.14rem;
                width: 0.28rem; height: 0.16rem;
                text-align: center; line-height: 0.16rem;
                border-radius: 0.02rem;
                font-size: 0.1rem;
            }
            >.titleMark.live {
                border: 0.005rem solid rgba(232,98,114,0.3);
                background-color: rgba(232,98,114,0.05); color: rgb(232,98,114);
            }
            >.titleMark.spec {
                border: 0.005rem solid rgba(73,201,158,0.3);
                background-color: rgba(73,201,158,0.05); color: rgb(73,201,158);
            }
            >.titleMark.course {
                border: 0.005rem solid rgba(107,123,214,0.3);
                background-color: rgba(107,123,214,0.05); color: rgb(107,123,214);
            }
            >.titleBox {
                flex: 1;
                text-indent: 0.32rem;
                font-size: 0.16rem; line-height: 0.19rem;
                font-weight: bold;
                color: rgba(51,51,51,1);
            }
            >.liveDetail {
                position: relative;
                display: flex; flex-direction: row;
                >.liveDetailTitle {
                    margin: 0.08rem 0 0.16rem 0;
                    color:rgba(153,153,153,1);
                    flex: 1;
                    font-size: 0.12rem;
                    line-height: 0.18rem;
                    word-wrap: break-word;
                }
                >.liveExpand {
                    >.moreTextArrow {
                        padding: 0.1rem 0 0.1rem 0.1rem;
                        width: 0.09rem; height: 0.09rem;
                    }
                    >.collapseArrow{
                        transform: rotate(180deg);
                        padding: 0.1rem 0.1rem 0.1rem 0;
                    }
                }
            }
            >.liveTime {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                >div:nth-child(1) {
                    height: 0.28rem;
                    background:rgba(246,246,246,1);
                    border-radius: 0.16rem;
                    >.livePeopleNum {
                        padding: 0.05rem 0.08rem;
                        line-height: 0.27rem;
                        font-size: 0.13rem;
                        color:rgba(102,102,102,1);
                    }
                }
                >.liveTimeDetail {
                    font-size: 0.13rem;
                    color:rgba(153,153,153,1);
                    line-height: 0.27rem;
                }
            }
        }
    }
    .coup {
        position: relative;
        background-color: #fff;
        >.coupon {
            position: relative;
            height: 0.51rem; width: 100%;
            border-bottom: 0.005rem solid #f2f2f2;
            >span:nth-child(1) {
                position: absolute;
                top: 0; bottom: 0; left: 0.16rem;
                margin: auto;
                height: 0.51rem; 
                line-height: 0.51rem;
                font-size: 0.14rem;
            }
            >div:nth-child(2) {
                position: absolute;
                top: 0; bottom: 0; left: 0.66rem;
                margin: auto;
                text-align: left;
                width: 2.5rem; height: 0.51rem;
                >div {
                    display: inline-block;
                    position: relative;
                    margin-right: 0.08rem;
                    width: 0.8rem; height: 0.51rem;
                    >img {
                        position: absolute;
                        top: 0; left: 0; bottom: 0;
                        margin: auto;
                        width: 0.8rem; height: 0.2rem;
                    }
                    >span {
                        position: absolute;
                        top: 0; left: 0;
                        width: 0.8rem;
                        line-height: 0.51rem; text-align: center;
                        font-size: 0.11rem; color: #ef5e8f;
                    }
                }
            }
            >span:nth-child(3) {
                position: absolute;
                right: 0.26rem; top: 0; bottom: 0;
                margin: auto;
                line-height: 0.51rem;
                font-size: 0.13rem; color: #999;
            }
            >img:last-child {
                position: absolute;
                right: 0.16rem; top: 0; bottom: 0;
                margin: auto;
                width: 0.09rem; height: 0.09rem;
            }
        }
    }
    #couponDialog {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 100;
        >.couponContent {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            padding: 0.18rem 0;
            max-height: 3.87rem;
            overflow-y: auto;
            border-radius: 0.2rem 0.2rem 0 0;
            background-color: #fff;
            >.list {
                position: relative;
                margin: auto; margin-bottom: 0.1rem; 
                width: 3.39rem; height: 0.82rem;
                border: 1px solid #f6f6f6;
                border-radius: 0.08rem;
                box-shadow: #f2f2f2 0 0 0.1rem;
                >img:nth-child(1) {
                    position: absolute;
                    top: 0; left: 0;
                    width: 1.3rem; height: 0.8rem;
                }
                >span:nth-child(2) {
                    position: absolute;
                    top: 0; left: 0;
                    width: 1.3rem; height: 0.8rem;
                    line-height: 0.8rem; text-align: center;
                    font-size: 0.3rem; color: #fff;
                }
                >div:nth-child(3) {
                    display: -webkit-box;
                    position: absolute;
                    top: 0.08rem; left: 1.41rem;
                    width: 1.9rem; max-height: 0.36rem;
                    line-height: 0.18rem;
                    font-size: 0.13rem;
                    text-overflow: -o-ellipsis-lastline;overflow: hidden;text-overflow: ellipsis;
                    -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-clamp: 2;
                }
                >div:nth-child(4) {
                    position: absolute;
                    top: 0.52rem; left: 1.41rem;
                    width: 1.9rem; height: 0.15rem;
                    line-height: 0.15rem; 
                    font-size: 0.1rem; color: #999;
                }
                >div:nth-child(5) {
                    position: absolute;
                    bottom: 0.08rem; right: 0.11rem;
                    width: 0.53rem; height: 0.24rem;
                    line-height: 0.24rem; text-align: center;
                    font-size: 0.12rem; color: #ef5e8f;
                    border: 1px solid #ef5e8f;
                    border-radius: 0.15rem;
                }
                >img.has {
                    position: absolute;
                    bottom: 0.04rem; right: 0.11rem;
                    width: 0.52rem; height: 0.52rem;
                }
                >div.full {
                    position: absolute;
                    top: 0.58rem; left: 0;
                    width: 1.3rem; height: 0.14rem;
                    line-height: 0.14rem; text-align: center;
                    font-size: 0.1rem; color: #fff;
                }
            }
            >.popupBtn {
                position: relative;
                height: 0.75rem;
                >span {
                    position: absolute;
                    left: 0; right: 0; top: 0; bottom: 0;
                    margin: auto;
                    width: 3.43rem; height: 0.45rem;
                    text-align: center; line-height: 0.45rem;
                    border-radius: 0.25rem;
                    font-size: 0.16rem;
                    background-color: #ef5e8f; color: #fff;
                }
            }
        }
    }
    .comeIn {
        animation: dialogIn 0.3s linear normal forwards;
    }
    @keyframes dialogIn {
        0% {
            transform: translateY(100%);
        }
        100% {
            transform: translateY(0);
        }
    }
    .comeOut {
        animation: dialogOut 0.3s linear normal forwards;
    }
    @keyframes dialogOut {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(100%);
        }
    }
    .detail {
        border-top: 0.005rem solid #f2f2f2;
        border-bottom: 0.005rem solid #f2f2f2;
        >.detailContent {
            padding: 0.24rem 0 0 0;
            >.detailCaption {
                margin: 0 0.16rem 0.24rem 0.16rem;
                font-size: 0.18rem;
                font-weight: bold;
            }
            >.courseFocus{
                margin: 0 0.16rem 0.08rem 0.16rem;
                font-size: 0.14rem; line-height: 0.2rem;
                color: #333; font-weight: bold;
            }
            >.detailImg {
                width: 100%;
                margin: 0 auto;
            }
            >.liveOldDetail {
                display: inline-block;
                padding: 0 0.16rem;
                font-size: 0.13rem;
            }
            >.contentBox{
                padding: 0.18rem 0.16rem 0 0.16rem;
                >.detailTitle {
                    padding-top: 0.1rem; padding-bottom: 0.08rem;
                    font-size: 0.14rem; font-weight: bold;
                    color:rgba(51,51,51,1);
                }
                >.courseTeacher {
                    display: flex;
                    height: 1.07rem;
                    border-bottom: 0.01rem solid #f2f2f2;
                    >img {
                        margin-top: 0.16rem;
                        width: 0.6rem; height: 0.6rem;
                        border-radius: 0.04rem;
                    }
                    >.teacherInfo {
                        width: 2.71rem;
                        margin: 0.13rem auto 0 0.12rem;
                        >.teacherName{
                            display: flex;
                            margin-bottom: 0.06rem;
                            >span:nth-child(1) {
                                color:rgba(51,51,51,1);
                                font-weight: bold;
                            }
                            >div {
                                margin: 0.02rem 0 0 0.08rem;
                                width: 0.3rem;
                                height: 0.15rem;
                                background:rgba(235,94,139,1);
                                border-radius: 0.02rem;  
                                opacity: 0.07;
                            }
                            >span:nth-child(3) {
                                margin: 0.02rem 0 0 -0.25rem;
                                font-size: 0.1rem;
                                color:rgba(255,44,121,1);
                            }
                        }
                        >.jobTitle {
                            color:rgba(153,153,153,1);
                            font-size: 0.13rem;
                        }
                    }
                }
                >.detailText {
                    margin: 0 0 0.24rem 0;
                    color:rgba(102,102,102,1);
                    font-size: 0.14rem;
                    line-height: 0.2rem;
                }
            }
        }
    }
    .bottomReplace{
        height: 0.8rem;
    }
    .fixBottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 0.55rem;
        background:rgba(255,255,255,1);
        box-shadow: #c9c7c7 0 0 8px 0;
        >.enterBtn {
            position: absolute;
            top: 0; bottom: 0; left: 0; right: 0;
            margin: auto;
            width: 3.43rem; height: 0.38rem;
            display: flex; flex-direction: row; align-items: center; justify-content: center;
            background:rgba(255,44,121,1);
            border-radius: 0.25rem;
            color:rgba(255,255,255,1);
            >.price {
                width: 100%; height: 0.38rem;
                line-height: 0.38rem;
                >.buy {
                    >.buyText {
                        font-size: 0.14rem;
                        color: #fff;
                    }
                    >.buyMark {
                        font-size: 0.1rem;
                        color: #fff;
                    }
                    >.buyContent {
                        margin-left: -0.04rem;
                        font-size: 0.14rem;
                        color: #fff;
                    }
                }
                >.delete {
                    text-decoration: line-through;
                    font-size: 0.12rem;
                    color: #fff;
                }
                >.pop {
                    position: relative;
                    top: -0.01rem;
                    margin-left: 0.04rem; padding: 0.03rem 0.06rem;
                    background-color: #fff;
                    font-size: 0.1rem;
                    color: #FF2C79;
                    border-radius: 0.15rem 0.15rem 0.15rem 0;
                }
            }
        }
    }
    .liveDetail_replace{
        position: fixed;
        bottom: -999999rem;
        width: 3.43rem;
        font-size: 0.12rem;
        line-height: 0.18rem;
    }
    .ellipsis2 {
        display: -webkit-box;
        text-overflow: -o-ellipsis-lastline;overflow: hidden;text-overflow: ellipsis;
        -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-clamp: 2;
    }
</style>