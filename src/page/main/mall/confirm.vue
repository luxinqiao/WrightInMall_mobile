<!--
 * 文件描述：确认订单页
 * 创建人：赵志银
 * 创建时间：2019-03-14
-->
<template>
    <div id='main' ref='main'>
        <div v-if='isHas'>
            <div class='address wm_padding' @click='goAddress'>
                <div class='bg'  v-if='isEmpty(addressCode)' >
                    <img v-lazy='require("@/assets/images/mall/confirm/bg.png")' >
                    <div>请选择收货地址</div>
                </div>
                <img v-lazy='require("@/assets/images/mall/details/right.png")' class='right'>
                <div class='has' v-if='!isEmpty(addressCode)'>
                    <div>
                        <span>{{addressObj.contact_name}}</span>
                        <span>{{addressObj.contact_call}}</span>
                    </div>
                    <div>{{addressObj.zone+addressObj.content}}</div>
                </div>
            </div>

            <div class='info wm_padding'>
                <div class='info_tit'>商品信息</div>
                <div class='goods'>
                    <img v-lazy='detailObj.order_cover' >
                    <div class='text_ellipsis goods_title'>{{detailObj.name}}</div>
                    <div class='style'>
                        <div class='style_name'>规格：{{styleName}}</div>
                        <div class='price_num'>
                            <span class='wm_color_main goods_price'>¥ {{priceTransitionTwo(stylePrice)}}</span>
                            <div class='goods_num'>
                                <span>X </span>
                                <span>{{paramObj.num}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='add_item gift' v-if='detailObj.gift.status==1'>
                    <img v-lazy='require("@/assets/images/my/order/list/give.png")'>
                    <div class='add_item_con'>{{detailObj.gift.content}} <span class='add_item_num'></span>x{{paramObj.num}}</div>
                </div>
                <div class='add_item service' v-if='!isEmpty(paramObj.severCode)'>
                    <img v-lazy='require("@/assets/images/my/order/list/warranty.png")'>
                    <div class='add_item_con'>{{serviceName+' ￥'+priceTransitionTwo(servicePrice)}} <span class='add_item_num'>x{{paramObj.num}}</span></div>
                </div>
                <div class='coupon info_list' @click='seeCoupon' v-if='isEmpty(paramObj.refCode)&&paramObj.goods_type!=4'>
                    <div>优惠券</div>
                    <div v-if='checkCouponPrice<=0&&couponArr.length>0'><span class='color_gray'>请选择优惠券</span></div>
                    <div v-if='checkCouponPrice>0' class='act'><span>-￥{{priceTransitionTwo(checkCouponPrice)}}</span></div>
                    <div v-if='couponArr.length<=0'><span>无可用优惠券</span></div>
                    <img v-lazy='require("@/assets/images/mall/confirm/right.png")'>
                </div>
                <div class='remark info_list'> 
                    <div>留言</div>
                    <input placeholder='对本次交易的说明' maxlength='20' v-model='remark' ref='message' @blur='blurFn()' @focus='changeStyle()' oninput="if(value.length>20)value=value.slice(0,20);">
                </div>
            </div>

            <div class='order wm_padding'>
                <div class='order_tit'>订单总额</div>
                <div class='list'>
                    <div class='list_tit'>商品总价</div>
                    <div class='list_desc'>￥{{priceTransitionTwo(styleTotal)}}</div>
                </div>
                <div class='list'>
                    <div class='list_tit'>运费</div>
                    <div class='list_desc' v-if='!isEmpty(addressObj.express_price)'>￥{{priceTransitionTwo(addressObj.express_price)}}</div>
                    <div class='list_desc' v-else>￥{{priceTransitionTwo(detailObj.express_price)}}</div>
                </div>
                <div class='list' v-if='!isEmpty(paramObj.severCode)'>
                    <div class='list_tit'>延保服务</div>
                    <div class='list_desc'>￥{{priceTransitionTwo(serviceTotal)}}</div>
                </div>
                <div class='list' v-if='!isEmpty(paramObj.refCode)&&!isEmpty(paramObj.refPrice)&&paramObj.refPrice!=0'>
                    <div class='list_tit'>推荐码抵扣</div>
                    <div class='list_desc'>-￥{{priceTransitionTwo(refTotal)}}</div>
                </div>
                <div class='list' v-if='checkCouponPrice>0'>
                    <div class='list_tit'>优惠券优惠</div>
                    <div class='list_desc'>-￥{{priceTransitionTwo(checkCouponPrice)}}</div>
                </div>
                <div class='list'>
                    <div class='list_tit'>实付款</div>
                    <div class='wm_color_main list_desc'>￥{{priceTransitionTwo(realPrice)}}</div>
                </div>
            </div>

            <div class='btn'>
                <div :class='["pay_reduce_no", {"pay_reduce":((!isEmpty(paramObj.refCode)&&!isEmpty(paramObj.refPrice)&&paramObj.refPrice!=0)||checkCouponPrice>0)}]'>
                    <span>共{{paramObj.num}}件，</span>
                    <span>实付款：</span>
                    <span class='wm_color_main'>￥</span>
                    <span class='wm_color_main'>{{priceTransitionTwo(realPrice)}}</span>
                </div>
                <div class='pay_reduce_price' v-if='(!isEmpty(paramObj.refCode)&&!isEmpty(paramObj.refPrice)&&paramObj.refPrice!=0)'>共优惠￥{{priceTransitionTwo(refTotal)}}</div>
                <div class='pay_reduce_price' v-if='checkCouponPrice>0'>共优惠￥{{priceTransitionTwo(checkCouponPrice)}}</div>
                <div @click='confirm' class='wm_bgcolor_main'><span>提交订单</span></div>
            </div>
        </div>

        <mdPopup :isShow='isCoupon' @overlayClose='closeCoupon'>
            <div class='pop_box'>
                <div class='pop_title'>选择优惠券</div>
                <div class='coupon_con' scroll-y @click.stop='seeCoupon' >
                    <div :class='["list", {"cur_list":item.common_type!=1}, {"pri_list":(item.common_type==1)}]' v-for='(item, index) in couponArr' @click.stop='getCoupon({code:item.code,index:index, use:item.use,price:item.amount})' :key='index'>
                        <div class='cou_item_left'>
                            <img v-lazy='require("@/assets/images/mall/details/curbg.png")' v-if='item.common_type==0' class='cou_bg'>
                            <img v-lazy='require("@/assets/images/mall/details/pribg.png")' v-if='item.common_type==1' class='cou_bg'>
                            <img v-lazy='require("@/assets/images/mall/details/curtag.png")' v-if='item.common_type==0' class='cou_tag'>
                            <img v-lazy='require("@/assets/images/mall/details/pritag.png")' v-if='item.common_type==1' class='cou_tag'>
                            <div class='price_cou'>
                                <span>￥</span><span>{{priceTransition(item.amount)}}</span>
                            </div>
                            <div class='full' v-if='item.type==1'>满{{priceTransition(item.full_value)}}使用</div>
                        </div>
                        <div class='cou_item_right'>
                            <div class='cou_name text_ellipsis2'>{{item.name}}</div>
                            <div  class='cou_time'>有效时间:{{item.begin_date}}至{{item.end_date}}</div>
                            <img v-lazy='require("@/assets/images/common/check.png")' v-if='item.use' class='cou_get_btn'>
                            <img v-lazy='require("@/assets/images/common/uncheck.png")' v-if='!item.use' class='cou_get_btn'>
                            <img v-lazy='require("@/assets/images/my/coupon/time.png")' class='cou_unuse' v-if='item.is_expire_soon ==1'>
                        </div>
                    </div>
                </div>
                <div class='pop_btn'><span @click.stop='closeCoupon' class='wm_bgcolor_main'>关闭</span></div>
            </div>
        </mdPopup>
    </div>
</template>

<script type='text/javascript'>
    import {trimStr, priceTransition, getParameter, fullScreenHeight, isEmpty, getLocalToken, urlChange, priceTransitionTwo} from '@/utils/CommonUtils.js'
    import { Dict_CouponSource} from '@/utils/DictUtils.js'
    import {goodsPay} from '@/utils/PayUtils.js'
    import mdPopup from '@/components/popup'
    
    export default {
        components: {
            mdPopup
        },
        data() {
            return {
                paramObj: {},
                isHas: false,

                adddressArr: [],
                addressCode: '',
                addressObj: {},
                detailObj: {
                    gift: {},
                },

                serviceName: '',
                servicePrice: 0,
                serviceTotal: 0,
                styleName: '',
                stylePrice: 0,
                styleTotal: 0,

                isCoupon: false,
                couponText: '请选择优惠券',
                couponArr: [],
                checkCouponCode: '', //选中优惠券的code
                checkCouponPrice: 0, //选中优惠券优惠价格

                price: 0,
                realPrice: 0,
                remark: '',
                isChange: false,
                refTotal: 0,

                priceTransition: priceTransition,
                priceTransitionTwo: priceTransitionTwo,
                isEmpty: isEmpty,
                
                gold: 0
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '确认订单'})
            this.$wm_data.setFooter = false

            fullScreenHeight(this.$refs.main)
            this.paramObj = urlChange(window.location.href)
            this.$wm_dialog.loading()
            this.initAddress()
            this.moneyData()
            document.body.style.overflow = 'auto'
        },
        methods: {
            /**
                初始化数据
                @param
                @return
            */
            initData() {
                this.$axios.post(live_request+'v2/goods/detail', {
                    token: getLocalToken(),
                    goods_code: getParameter('goods_code'),
                    goods_type: getParameter('goods_type')
                })
                .then(response => {
                    if (response.code == 200) {
                        var data = response.data
                        if(!isEmpty(sessionStorage.wm_remark)) {
                            this.remark = sessionStorage.wm_remark
                        }
                        for(let inx in data.tags){
                            if (data.tags[inx].code == this.paramObj.styleCode) {
                                this.stylePrice = data.tags[inx].price,
                                this.styleTotal = Number(data.tags[inx].price) * Number(this.paramObj.num)
                                this.styleName = data.tags[inx].name
                            }
                        }
                        if (!isEmpty(this.paramObj.severCode)) {
                            for (let inx in data.warranty) {
                                if (data.warranty[inx].code == this.paramObj.severCode) {
                                    this.serviceName = data.warranty[inx].name,
                                    this.servicePrice = data.warranty[inx].price,
                                    this.serviceTotal = Number(data.warranty[inx].price)*Number(this.paramObj.num)
                                }
                            }
                        }
                        let expressPrice = 0
                        if (isEmpty(this.addressObj.express_price)){
                            expressPrice = data.express_price
                        } else {
                            expressPrice = this.addressObj.express_price
                        }
                        this.detailObj = data

                        this.price = Number(this.styleTotal) + Number(this.serviceTotal) + Number(expressPrice)
                        if(this.paramObj.goods_type==4) {
                            this.refTotal = Number(this.styleTotal) + Number(this.serviceTotal) + Number(expressPrice),
                            this.realPrice = Number(this.styleTotal) + Number(this.serviceTotal) + Number(expressPrice),
                            this.real = Number(this.styleTotal) + Number(this.serviceTotal) + Number(expressPrice)
                            this.$wm_dialog.closeLoading()
                            this.isHas = true
                            return
                        }
                        if (!isEmpty(this.paramObj.refCode)) {
                            this.refTotal = Number(this.paramObj.refPrice) * Number(this.paramObj.num),
                            this.realPrice = Number(this.styleTotal) - (Number(this.paramObj.refPrice) * Number(this.paramObj.num)) + Number(this.serviceTotal) + Number(expressPrice),
                            this.real = Number(this.styleTotal) - (Number(this.paramObj.refPrice) * Number(this.paramObj.num)) + Number(this.serviceTotal) + Number(expressPrice)
                        }
                        if (this.paramObj.goods_type==1) {
                            this.initCoupon()
                        }
                        
                    }
                    this.$wm_dialog.closeLoading()
                    
                    this.isHas = true
                })
                .catch(response => {
                    
                })
            },
            /**
                初始化地址
                @param
                @return
            */
            initAddress() {
                this.$axios.post(common_request+'v1/address/record', {
                    token: getLocalToken(),
                    code: isEmpty(sessionStorage.wm_addressCode)?'':sessionStorage.wm_addressCode,
                    goods_code: this.paramObj.goods_code
                })
                .then(response => {
                    if (response.code == 200) {
                        this.addressCode = isEmpty(sessionStorage.wm_addressCode)?response.data.code:sessionStorage.wm_addressCode
                        this.addressObj = response.data
                        sessionStorage.wm_addressCode = response.data.code
                    } else {
                        this.addressCode = ''
                        sessionStorage.wm_addressCode = ''
                        this.addressObj = {}
                    }
                    this.initData()
                })
                .catch(response => {
                    
                })
            },
            /**
                选择地址
                @param 
                @return
            */
            goAddress() {
                this.$router.push({path: `../my/appoint/addressList?goods_code=${this.paramObj.goods_code}&express_type=${this.detailObj.express_type}&from=order`})
            },
            /**
                打开优惠券弹窗
                @param 
                @return
            */
            seeCoupon() {
                if (this.couponArr.length > 0) {
                    this.isCoupon = true
                } else {
                    this.$wm_dialog.tip('暂无可用优惠券')
                }
            },
            /**
                关闭优惠券弹窗
                @param 
                @return
            */
            closeCoupon() {
                this.isCoupon = false
            },
            /**
                选择优惠券
                @param {object} param 优惠券
                @return
            */
            getCoupon(param) {
                let index = param.index
                let code = param.code
                for (let inx in this.couponArr) {
                    this.couponArr[inx].use = false
                }
                this.couponArr[index].use = !param.use
                if (!this.couponArr[index].use) {
                    this.checkCouponCode = '',
                    this.checkCouponPrice = 0
                } else {
                    this.checkCouponCode = code
                    this.checkCouponPrice = this.couponArr[index].amount
                }
                let real = this.price - this.checkCouponPrice
                if (real > 0) {
                    this.realPrice = real
                } else {
                    this.realPrice = 0
                }
                this.real = this.realPrice
                setTimeout(()=>{
                    this.isCoupon = false
                },200)
            },
            /**
                初始化优惠券
                @param
                @return
            */
            initCoupon() {
                this.$axios.post(lesson_request+'v1/coupon/canuse', {
                    token: getLocalToken(),
                    where_code: getParameter('goods_code'),
                    for_where: Dict_CouponSource.ACTUAL,
                    pay_count: this.price
                })
                .then(response => {
                    if (response.code == 200) {
                        let data = response.data
                        if (data.length > 0) {
                            for (let inx in data) {
                                if (inx == 0) {
                                    data[inx].use = true
                                    this.checkCouponCode = data[inx].code,
                                    this.checkCouponPrice = data[inx].amount
                                } else {
                                    data[inx].use = false
                                }
                            }
                            let real = this.price - this.checkCouponPrice
                            if (real > 0) {
                                this.realPrice = real
                            } else {
                                this.realPrice = 0
                            }
                        } else {
                            this.realPrice = this.price
                        }
                        this.couponArr = data,
                        this.real = this.realPrice
                    }
                })
                .catch(response => {
                    
                })
            },
            /**
                余额初始化
                @param
                @return
            */
            moneyData() {
                this.$axios.post(rec_request+'v1/account/info', {
                    token: getLocalToken()
                })
                .then(response => {
                    if (response.code == 200) {
                        if(isEmpty(response.data.balance)) {
                           this.gold = 0
                        } else {
                            this.gold = response.data.balance
                        }
                    }
                })
                .catch(response => {
                    
                })
            },
            /**
                校验-留言
                @param
                @return {Boolean} 是否校验通过
            */
            blurFn() {
                sessionStorage.wm_remark = this.remark
                setTimeout(() => {
                    window.scrollTo(0, document.body.scrollTop + 1);
                    document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1);  
                }, 10)
            },
            /**
                样式
                @param
                @return 
            */
            changeStyle() {
                this.$refs.main.style.position = 'relative'
                this.$refs.main.style.top = '0'
                this.$refs.main.style.bottom = '0'
            },
            /**
                跳转支付
                @param
                @return
            */
            confirm() {
                if(isEmpty(this.addressObj)){
                    this.$wm_dialog.tip('请选择收货地址')
                    return
                }
                goodsPay(
                    parseInt(this.realPrice)/100,
                    this.paramObj.goods_code,
                    !isEmpty(this.paramObj.severCode)?this.paramObj.severCode:'',
                    this.paramObj.num,
                    !isEmpty(this.checkCouponCode)?this.checkCouponCode:'',
                    this.paramObj.styleCode,
                    this.styleName,
                    this.addressObj.contact_name,
                    this.addressObj.contact_call,
                    this.addressObj.zone+this.addressObj.content,
                    !isEmpty(this.remark)?this.remark:'',
                    !isEmpty(this.paramObj.refCode)?this.paramObj.refCode:'',
                    !isEmpty(this.paramObj.sn)?this.paramObj.sn:'',
                    this.gold,
                    new Date().getTime(),
                    this.paramObj.goods_type
                )
            }
        },
        watch: {
            remark(val){
                this.remark = val.replace(/(\ud83c[\udc00-\udfff])|(\ud83d[\udc00-\udfff])|(\ud83e[\udc00-\udfff])|[\u2100-\u32ff]|[\u0030-\u007f][\u20d0-\u20ff]|[\u0080-\u00ff]/g,'')
            }
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        position: relative;
        padding-bottom: 1px;
        background-color: #f5f6f6;
        .address {
            position: relative;
            margin-bottom: 0.11rem;
            min-height: 1rem; width: 100%;
            background-color: #fff;
            .right {
                position: absolute;
                top: 0; bottom: 0; right: 0.16rem;
                margin: auto;
                width: 0.07rem; height: 0.12rem;
            }
            .bg {
                position: absolute;
                top: 0.16rem; left: 0;
                width: 100%; 
                img {
                    display: block;
                    margin: auto;
                    width: 0.56rem; height: 0.41rem;
                }
                div {
                    margin-top: 0.08rem;
                    text-align: center;
                    font-size: 0.13rem; color: #999;
                }
            }
            .has {
                width: 3.3rem;
                div:nth-child(1) {
                    padding: 0.24rem 0 0.08rem 0;
                }
                div:nth-child(1) {
                    span {
                        font-size: 0.16rem; font-weight: bold;
                    }
                    span:nth-child(1) {
                        margin-right: 0.16rem;
                    }
                }
                div:nth-child(2) {
                    padding-bottom: 0.24rem;
                    line-height: 0.18rem;
                    font-size: 0.13rem; color: #666;
                }
            }
        }

        .info {
            position: relative;
            width: 100%;
            padding: 0.16rem 0.12rem 0.1rem 0.12rem;
            background-color: #fff;
            .info_tit {
                position: relative;
                margin-bottom: 0.16rem;
                height: 0.22rem;
                line-height: 0.22rem;
                font-size: 0.16rem; font-weight: bold;
            }
            .goods {
                position: relative;
                height: 0.82rem; width: 100%;
                >img {
                    position: absolute;
                    left: 0; top: 0;
                    height: 0.82rem; width: 0.82rem;
                    border-radius: 0.05rem;
                }
                .goods_title {
                    position: absolute;
                    left: 0.9rem; top: 0;
                    width: calc(100% - 0.92rem); height: 0.19rem;
                    line-height: 0.19rem; 
                    font-size: 0.14rem; font-weight: bold;
                }
                .style {
                    position: absolute;
                    left: 0.9rem; top: 0.23rem;
                    width: calc(100% - 0.92rem);
                    .style_name {
                        width: 100%; max-height: 0.32rem;
                        line-height: 0.16rem;
                        font-size: 0.11rem; color: #999;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        word-break: break-all;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                    .price_num {
                        position: relative;
                        margin-top: 0.04rem;
                        width: 100%; height: 0.22rem;
                        .goods_price {
                            position: absolute;
                            left: 0; top: 0;
                            font-size: 0.18rem;
                        }
                        .goods_num {
                            position: absolute;
                            right: 0; top: 0;
                            height: 0.22rem; width: calc(100% - 0.92rem);
                            line-height: 0.22rem; text-align: right;
                            span:nth-child(1) {
                                font-size: 0.1rem;
                            }
                            span:nth-child(2) {
                                font-size: 0.14rem;
                            }
                        }
                    }
                }
            }
            >div:nth-child(3).add_item {
                margin-top: 0.17rem;
            }
            .add_item {
                position: relative;
                padding-bottom: 0.09rem;
                width: 100%;
                box-sizing: content-box;
                img {
                    position: absolute;
                    top: 0; left: 0;
                    width: 0.3rem; height: 0.15rem;
                }
                .add_item_con {
                    padding-left: 0.39rem;
                    line-height: 0.17rem;
                    vertical-align: middle;
                    font-size: 0.11rem; color: #666;
                }
                .add_item_num {
                    display: inline-block;
                    line-height: 0.17rem;
                    font-size: 0.11rem; color: #666;
                }
            }
            .service {
                img {
                    width: 0.5rem;
                }
                .add_item_con{
                    padding-left: 0.58rem;
                }
            }

            .info_list {
                position: relative;
                height: 0.4rem; line-height: 0.4rem;
                >div:nth-child(1) {
                    position: absolute;
                    top: 0; bottom: 0; left: 0;
                    margin: auto;
                    font-size: 0.14rem;
                }
            }
            .coupon {
                margin-top: 0.1rem;
                img {
                    position: absolute;
                    top: 0; bottom: 0; right: 0;
                    margin: auto;
                    width: 0.07rem; height: 0.12rem;
                }
                div:nth-of-type(2) {
                    position: absolute;
                    top: 0; bottom: 0; right: 0.15rem;
                    margin: auto;
                    height: 0.4rem; 
                    align-items: center; justify-content: center;
                    span {
                        background-color: #fff;
                        font-size: 0.14rem;
                    }
                }
                .act {
                    span {
                        font-size: 0.14rem; color: #FF2C79;
                    }
                }
            }
            .remark {
                input {
                    position: absolute;
                    top: 0; bottom: 0; right: 0;
                    margin: auto;
                    width: 2.6rem;
                    text-align: right; border: none; outline: none; font-size: 0.14rem;
                }
                :-ms-input-placeholder {
                    font-size: 0.14rem; color: #999;
                }
                ::-webkit-input-placeholder {
                    font-size: 0.14rem; color: #999;
                }
            }
        }
        
        .order {
            padding: 0.16rem 0.12rem; margin: 0.12rem 0 0.6rem 0;
            background-color: #fff;
            .order_tit {
                padding: 0 0 0.16rem 0;
                height: 0.22rem;
                line-height: 0.22rem;
                font-size: 0.16rem; font-weight: bold;
                box-sizing: content-box;
            }
            .list {
                position: relative;
                margin-bottom: 0.2rem;
                height: 0.2rem; line-height: 0.2rem;
                .list_tit {
                    position: absolute;
                    top: 0; bottom: 0; left: 0;
                    margin: auto;
                    font-size: 0.14rem;
                }
                .list_desc {
                    position: absolute;
                    top: 0; bottom: 0; right: 0;
                    margin: auto;
                    font-size: 0.14rem;
                }
            }
            >div:last-of-type {
                margin-bottom: 0;
            }
        }
        
        .btn {
            position: fixed;
            bottom: 0; left: 0;
            height: 0.55rem; width: 100%;
            background-color: #fff;
            box-shadow: 0px 4px 14px 0px rgba(153, 153, 153, 0.2);
            .pay_reduce_no {
                position: absolute;
                top: 0; right: 1.32rem;
                height: 0.55rem;
                line-height: 0.55rem;
                span:nth-child(1) {
                    font-size: 0.13rem; color: #999;
                }
                span:nth-child(2) {
                    font-size: 0.14rem;
                }
                span:nth-child(3) {
                    font-size: 0.14rem;
                }
                span:nth-child(4) {
                    font-size: 0.18rem; 
                }
            }
            .pay_reduce {
                top: 0.08rem;
                height: 0.25rem;
                line-height: 0.25rem;
            }
            .pay_reduce_price {
                position: absolute;
                top: 0.31rem; right: 1.32rem;
                height: 0.18rem;
                line-height: 0.18rem;
                font-size: 0.13rem; color: #999;
            }
            >div:last-child {
                position: absolute;
                top: 0.07rem; right: 0.16rem;
                height: 0.4rem; width: 1rem;
                // line-height: 0.4rem; text-align: center;
                display: flex;
                align-items: center; justify-content: center;
                border-radius: 0.2rem;
                span {
                    font-size: 0.14rem; color: #fff;
                }
            }
        }
    }

    /* 弹窗 */
    .pop_box {
        position: relative;
        height: 5.33rem; width: 100%;
        .pop_title {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 0.52rem;
            line-height: 0.52rem; text-align: center;
            font-size: 0.15rem; font-weight: bold;
        }
        .pop_btn {
            position: absolute;
            bottom: 0; left: 0;
            height: 0.55rem; width: 100%;
            border-top: 0;
            background-color: transparent;
            box-shadow: 0px 4px 16px 0px rgba(102, 102, 102, 0.26);
            span {
                position: absolute;
                left: 0; right: 0; bottom: 0; top: 0;
                margin: auto;
                width: 3.43rem; height: 0.4rem;
                line-height: 0.4rem; text-align: center;
                font-size: 0.16rem; color: #fff;
                border-radius: 0.25rem;
            }
        }
    }
    /* 优惠券弹窗 */
    .coupon_con {
        position: absolute;
        top: 0.52rem; left: 0;
        padding: 0.14rem 0.11rem 0 0.11rem; margin-bottom: 0.7rem; 
        width: 100%; height: 4.26rem;
        border-top-left-radius: 0.2rem;
        border-top-right-radius: 0.2rem;
        background-color: #fff;
        overflow-y: auto;
        .list {
            position: relative;
            margin: auto; margin-bottom: 0.1rem; padding: 0.04rem;
            width: 100%; height: 0.8rem;
            border-radius: 0.06rem;
        }
        .cur_list {
            background: #D5A663;
        }
        .pri_list {
            background: #E25E38;
        }
        .cou_item_left {
            position: absolute;
            top: 0; left: 0;
            width: 1.1rem; height: 0.8rem;
            .cou_bg {
                position: absolute;
                top: 0; left: 0;
                width: 1.1rem; height: 0.8rem;
                z-index: 1;
            }
            .cou_tag {
                position: absolute;
                top: 1px; left: 1px;
                width: 0.27rem; height: 0.22rem;
                z-index: 1;
            }
            .price_cou {
                position: absolute;
                top: 0; bottom: 0; left: 0; 
                margin: auto;
                height: 0.5rem; width: 0.92rem;
                line-height: 0.5rem; text-align: center;
                z-index: 1;
                span {
                    color: #fff; font-size: 0.12rem;
                }
                span:last-of-type {
                    font-size: 0.32rem;
                }
            }
            .full {
                position: absolute;
                bottom: 0.07rem; right: 0; left: 0;
                margin: auto;
                text-align: center;
                font-size: 0.1rem; color: #fff;
                z-index: 1;
            }
        }
        .cou_item_right {
            position: relative;
            margin: auto;
            width: 100%; height: 100%;
            background-color: #fff;
            border-radius: 0 0.04rem 0.04rem 0;
            .cou_name {
                position: absolute;
                top: 0.12rem; left: 1.15rem;
                height: 0.36rem; width: 1.64rem;
                line-height: 0.18rem;
                box-sizing: content-box;
                font-size: 0.14rem; text-align: left;
            }
            .cou_time {
                position: absolute;
                bottom: 0.1rem; left: 1.15rem;
                height: 0.14rem; width: 1.64rem;
                font-size: 0.1rem; color: #999;
                white-space: nowrap;
            }
            .cou_get_btn {
                position: absolute;
                top: 0; bottom: 0; right: 0.12rem;
                margin: auto;
                width: 0.23rem; height: 0.23rem;
            }
            .cou_unuse {
                position: absolute;
                top: -0.04rem; right: -0.04rem;
                height: 0.47rem; width: 0.52rem;
            }
        }
    }
    .pop_btn {
        position: absolute;
        bottom: 0; left: 0;
        height: 0.55rem; width: 100%;
        border-top: 0;
        background-color: transparent;
        box-shadow: 0px 4px 16px 0px rgba(102, 102, 102, 0.26);
        span {
            position: absolute;
            left: 0; right: 0; bottom: 0; top: 0;
            margin: auto;
            width: calc(100% - 0.24rem); height: 0.4rem;
            line-height: 0.4rem; text-align: center;
            font-size: 0.16rem; color: #fff;
            border-radius: 0.25rem;
        }
    }
</style>
