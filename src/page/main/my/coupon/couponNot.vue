<!--
 * 文件描述：不可用优惠券
 * 创建人：赵志银
 * 创建时间：2020-10-29
-->
<template>
    <div id='main' ref='main' class='wm_margin'>
        <div  v-if='isHas&&noCouponArr.length>0'>
            <div class='list' v-for='(item, index) in noCouponArr' :key='index'>
                <div class='cou_item_left'>
                    <img v-lazy='require("@/assets/images/my/coupon/bg.png")' class='cou_bg'>
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
                    <img v-lazy='require("@/assets/images/my/coupon/accepted.png")' class='cou_status' v-if='item.status ==1'>
                    <img v-lazy='require("@/assets/images/my/coupon/no.png")' class='cou_status' v-if='item.status ==2'>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {isEmpty, priceTransition, getLocalToken} from '@/utils/CommonUtils.js'
    export default {
        data() {
            return {
                /** 返回数据 **/
                noCouponArr: [],
                isHas: false,
                priceTransition: priceTransition,
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '不可用的优惠券'})
            this.$wm_data.setFooter = false
            this.initData()
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
                    can_use: 0,
                    for_where: 12,
                    time: new Date().getTime()
                })
                .then(response => {
                    if (response.code == 200) {
                        this.noCouponArr = response.data.list
                    }
                    this.isHas = true
                    this.$wm_dialog.closeLoading()
                })
                .catch(response => {
                    
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    #main {
        position: relative;
        margin-top: 0.12rem;
        .list {
            position: relative;
            margin: auto; margin-bottom: 0.1rem; padding: 0.04rem;
            width: 100%; height: 0.8rem;
            border-radius: 0.06rem;
            background-color: #ccc;
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
                    font-size: 0.14rem; color: #ccc;
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
                .cou_status {
                    position: absolute;
                    top: 0; bottom: 0; right: 0.12rem;
                    margin: auto;
                    width: 0.48rem; height: 0.48rem;
                }
            }
        }
    }
</style>

