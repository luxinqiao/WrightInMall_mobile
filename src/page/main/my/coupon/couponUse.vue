<!--
 * 文件描述：我的-优惠券
 * 创建人：赵志银
 * 创建时间：2019-03-14
-->
<template>
    <div id='main' ref='main'>
        <div class='none' v-show = 'isHas&&couponArr.length<=0'>
            <img src='@/assets/images/my/coupon/bg_empty.png'>
            <p>您无可用优惠券哦</p>
        </div>
        <div  v-if='isHas&&couponArr.length>0'>
            <div :class='["list", {"cur_list":item.common_type!=1}, {"pri_list":(item.common_type==1)}]' v-for='(item, index) in couponArr' @click.stop='goDetail({link:item.link})' :key='index'>
                <div class='cou_item_left'>
                    <img v-lazy='require("@/assets/images/mall/details/curbg.png")' v-if='item.common_type==0' class='cou_bg'>
                    <img v-lazy='require("@/assets/images/mall/details/pribg.png")' v-if='item.common_type==1' class='cou_bg'>
                    <div v-if='item.common_type==0' class='cou_tag'>通</div>
                    <div v-if='item.common_type==1' class='cou_tag'>专</div>
                    <div class='price_cou'>
                        <span>￥</span><span>{{priceTransition(item.amount)}}</span>
                    </div>
                    <div class='full' v-if='item.type==1'>满{{priceTransition(item.full_value)}}使用</div>
                </div>
                <div class='cou_item_right'>
                    <div class='cou_name text_ellipsis2'>{{item.name}}</div>
                    <div  class='cou_time'>有效时间:{{item.begin_date}}至{{item.end_date}}</div>
                    <img v-lazy='require("@/assets/images/my/coupon/time.png")' class='cou_unuse' v-if='item.is_expire_soon ==1'>
                </div>
            </div>
            <div class='nouse wm_color_main' @click='goNoUse()'>查看不可用优惠券</div>
        </div>
    </div>
</template>
<script>
    import { fullScreenHeight, priceTransition, getLocalToken,} from '@/utils/CommonUtils.js'
    import Vue from 'vue'
    export default {
        data() {
            return {
                couponArr: [],
                isHas: false,
                noCouponArr: [],
                priceTransition: priceTransition,
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '我的优惠券'})
            this.$wm_data.setFooter = false 
            fullScreenHeight(this.$refs.main)
            this.$wm_dialog.loading()
            this.initData()
            this.initNoCoupon()
        },
        methods: {
            /**
                初始化
                @param
                @return
            */
            initData() {
                this.$axios.post(live_request+'v1/coupon/mine', {
                    token: getLocalToken(),
                    can_use: 1,
                    for_where: 12,
                    time: new Date().getTime()
                })
                .then(response => {
                    if (response.code == 200) {
                        this.couponArr = response.data.list
                    }
                    this.isHas = true
                    this.$wm_dialog.closeLoading()
                })
                .catch(response => {
                    
                })
            },
            /**
            * 不可用优惠券
            * @param 
            * @return
            */
            initNoCoupon() {
                this.$axios.post(live_request+'v1/coupon/mine', {
                    token: getLocalToken(),
                    can_use: 0,
                    for_where: 12,
                    time: new Date().getTime()
                })
                .then(response => {
                    if (response.code == 200) {
                        this.noCouponArr = response.data.list
                    }
                })
                .catch(response => {
                    
                })
            },
            /**
                跳转到不可用页面
                @param
                @return
            */
            goNoUse() {
                if(this.noCouponArr.length<=0) {
                    this.$wm_dialog.tip('暂时还没有不可用优惠券')
                    return
                }
                this.$router.push({path: '../coupon/couponNot'})
            },
            /**
                跳转到使用该优惠券页面
                @param{string} code 优惠券链接
                @return
            */
            goDetail(item) {
                window.location.href = item.link
            }
        }
    }
</script>
<style lang="scss" scoped>
    #main {
        position: relative;
        padding-top: 0.12rem;
        .list {
            position: relative;
            margin: auto; margin-bottom: 0.1rem; padding: 0.04rem;
            width: 3.52rem; height: 0.8rem;
            border-radius: 0.06rem;
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
                    line-height: 0.22rem; text-align: center;
                    font-size: 0.14rem; color: #D5A663;
                    background: #FFFFFF;
                    border-radius: 0.05rem 0 0.05rem 0;
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
                    font-size: 0.1rem; color: #999; white-space: nowrap;
                }
                .cou_unuse {
                    position: absolute;
                    top: -0.04rem; right: -0.04rem;
                    height: 0.47rem; width: 0.52rem;
                }
            }
        }
        .cur_list {
            background: #D5A663;
        }
        .pri_list {
            background: #E25E38;
        }
        .nouse {
            margin-top: 0.4rem;
            text-align: center;
            font-size: 0.16rem; 
        }
        .none {
            margin: 1.2rem auto 0 auto;
            img {
                display: block;
                margin: auto;
                width: 1.5rem; height: 1.09rem;
            }
            p {
                margin-top: 0.16rem;
                text-align: center;
                font-size: 0.14rem; color: #666;
            }
        }
    }
</style>

