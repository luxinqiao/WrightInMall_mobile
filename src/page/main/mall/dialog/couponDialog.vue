<template>
    <div id='content' ref='content' class='pop_box'>
        <div class='pop_title'>领取优惠券</div>
        <div class='coupon_con' scroll-y @click.stop='seeCoupon' >
            <div :class='["list", {"cur_list":item.common_type!=1}, {"pri_list":(item.common_type==1)}]' v-for='(item, index) in couponArr' @click.stop='getCoupon({code:item.code,index:index})' :key='index'>
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
                    <img v-lazy='require("@/assets/images/mall/details/curbtn.png")' v-if='item.common_type==0 && item.is_get!=1' class='cou_get_btn'>
                    <img v-lazy='require("@/assets/images/mall/details/pribtn.png")' v-if='item.common_type==1 && item.is_get!=1' class='cou_get_btn'>
                    <img v-lazy='require("@/assets/images/mall/details/has.png")' class='cou_get_btn' v-if='item.is_get==1'>
                    <img v-lazy='require("@/assets/images/my/coupon/time.png")' class='cou_unuse' v-if='item.is_expire_soon ==1'>
                </div>
            </div>
        </div>
        <div class='pop_btn'><span @click.stop='back' class='wm_bgcolor_main'>关闭</span></div>
    </div>
</template>
<script>
import {priceTransition, getLocalToken, getParameter, isEmpty} from '@/utils/CommonUtils.js'
import {Dict_CouponSource} from '@/utils/DictUtils.js'

export default {
    data () {
        return{
            couponArr: [],
            priceTransition: priceTransition,
        }
    },
    mounted() {
        this.initData()
    },
    methods: {
        /**
            领取优惠券
            @param {object} param 优惠劵
            @return
        */
        getCoupon(param) {
            this.$axios.post(lesson_request+'v1/coupon/get', {
                token: getLocalToken(),
                coupon_code: param.code
            })
            .then(response => {
                if (response.code == 200) {
                   this.couponArr[param.index].is_get = 1
                   this.$wm_dialog.tip('领取成功')
                } else if(response.code == 206) {
                    this.$wm_dialog.tip('优惠券已领取')
                }
            })
            .catch(response => {
                
            })
        },
        /**
            确认，返回详情页
            @param
            @return
        */
        back() {
            this.$emit('closeCoupon')
        },
        /**
            初始化
            @param
            @return
        */
        initData() {
            if(isEmpty(getLocalToken())) {
                this.$axios.post(lesson_request+'v1/coupon/canget', {
                    token: getLocalToken(),
                    for_where: Dict_CouponSource.ACTUAL,
                    where_code: getParameter('goods_code'),
                })
                .then(response => {
                    if (response.code == 200) {
                        this.couponArr = response.data
                    }
                })
                .catch(response => {
                    
                })
            } else {
                this.$axios.post(lesson_request+'v1/coupon/canusedetail', {
                    token: getLocalToken(),
                    for_where: Dict_CouponSource.ACTUAL,
                    where_code: getParameter('goods_code'),
                })
                .then(response => {
                    if (response.code == 200) {
                        this.couponArr = response.data
                    }
                })
                .catch(response => {
                    
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
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
                width: 0.48rem; height: 0.48rem;
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
