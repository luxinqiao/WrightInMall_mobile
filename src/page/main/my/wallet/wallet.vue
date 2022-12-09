<!--
 * 文件描述：我的钱包
 * 创建人：赵志银
 * 创建时间：2020-10-29
-->
<template>
    <div ref='main' id='main'>
        <van-pull-refresh 
            v-model='isRefresh'
            @refresh='onRefresh()'
        >
            <div class='content' v-if='isHas'>
                <!-- 头部 -->
                <div class='header'>
                    <img src='@/assets/images/my/wallet/wallet.png'>
                    <div class='header_price'>
                        <div>{{priceTransitionTwo(balance)}}</div>
                        <div>余额(元)</div>
                    </div>
                </div>
                <!-- 收支明细 -->
                <div class='detail' v-if='isHas && !isEmpty(recordsArr)'> 
                    <div class='detail_tit'>收支明细</div>
                    <van-list
                        v-model='loading'
                        :finished='finished'
                        :error.sync='error'
                        finished-text="-没有更多内容-"
                        error-text='请求失败，点击重新加载'
                        @load="initRecords"
                    >
                        <div class='detail_con' v-for='(item,ind) in recordsArr' :key='ind'>
                            <span v-if='ind==0' class='month'>{{item.format_date}}</span>
                            <span v-else>
                                <span v-if='item.format_date != recordsArr[ind-1].format_date' class='month'>{{item.format_date}}</span>
                            </span>
                            <div class='record'>
                                <div class='record_left'>
                                    <div class='record_desc text_ellipsis'>{{item.remark}}</div>
                                    <div class='record_date'>{{item.date}}</div>
                                </div>
                                <span v-if='item.type==0 || item.type==2 || item.type==4' class='money money_add'>+{{priceTransitionTwo(item.cash)}}</span>
                                <span v-if='item.type==1 || item.type==3' class='money money_red'>-{{priceTransitionTwo(item.cash)}}</span>
                            </div>
                        </div>
                    </van-list>
                </div>

                <div class='none' v-if='isHas && isEmpty(recordsArr)'>
                    <img src='@/assets/images/my/wallet/none.png'>
                    <div>暂无收支明细</div>
                </div>
            </div>
        </van-pull-refresh>
    </div>
</template>
<script>
import {fullScreenHeight, getLocalToken, isEmpty ,priceTransitionTwo} from '@/utils/CommonUtils.js'

import Vue from 'vue'
import { PullRefresh, List} from 'vant'
import 'vant/lib/list/style'
import 'vant/lib/pull-refresh/style'
Vue.use(PullRefresh).use(List) 

export default {
    data() {
        return {
            isRefresh: false,
            loading: false,
            finished: false,
            error: false,

            isHas: false,
            currpage: 1,
            balance: 0, // 账户资金
            recordsArr: [], // 流水
            isEmpty: isEmpty,
            priceTransitionTwo
        }
    },
    mounted() {
        this.$wm_data.setHeader({title: '我的钱包'})
        this.$wm_data.setFooter = false
        fullScreenHeight(this.$refs.main)
        this.$wm_dialog.loading()
        this.initRecords()
        this.initInfo()
    },
    methods: {
        /**
            余额
            @param
            @return
        */
        initInfo() {
            this.$axios.post(rec_request+'v1/account/info', {
                token: getLocalToken()
            })
            .then(response => {
                if (response.code == 200) {
                    this.balance = response.data.balance
                }
            })
            .catch(response => {
            })
        },
        /**
            收支明细
            @param
            @return
        */
        initRecords() {
            this.$axios.post(rec_request+'v1/account/records', {
                token: getLocalToken(),
                page: this.currpage
            })
            .then(response => {
                let dataObj = response.data
                if (response.code == 200) {
                    this.recordsArr = this.currpage==1?dataObj.list:this.recordsArr.concat(dataObj.list)
                }
                this.isHas = true
                this.loading = false
                if(dataObj.is_last == 1) {
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
            this.initInfo()
            this.initRecords()
            setTimeout(() => {
                this.isRefresh = false
            }, 500)
        },
    }
}
</script>
<style lang="scss" scoped>
    #main {
        position: relative;
        background-color: rgba(250,250,250,1);
        .header {
            display: flex;
            align-items: center;
            justify-content:space-between;
            height: 1.61rem;
            padding: 0.42rem 0.33rem 0.31rem 0.33rem;
            border-top: 1px solid rgba(239,239,239,1);
            background-color: #fff;
            img {
                display: block;
                width: 1.18rem; height: 0.88rem;
            }
            .header_price {
                text-align: center;
                div:nth-child(1) {
                    font-size: 0.52rem;
                    font-weight: bold;
                    color: #FF2C79;
                    word-break: break-all;
                }
                div:nth-child(2){
                    font-size: 0.14rem;
                    color:rgba(241,112,155,1);
                }
            }
        }
        .detail {
            position: relative;
            margin-top: 0.12rem;
            padding: 0.24rem 0.13rem 0.16rem 0.16rem;
            min-height: calc(100vh - 1.73rem);
            border-radius: 0.2rem 0.2rem 0 0;
            background-color: white;
            .detail_tit {
                font-size: 0.18rem; font-weight: bold;
                color:rgba(51,51,51,1);
            }
            .detail_con{
                padding: 0.16rem 0;
                border-bottom: 1px solid #F2F2F2;
                .month {
                    display: inline-block;
                    margin-bottom: 0.15rem; padding: 0.05rem 0.13rem;
                    line-height: 0.18rem;
                    border-radius: 0.14rem;
                    font-size: 0.13rem; color: #FF2C79; font-weight: bold;
                    background:#FFF3F6;
                }
                .record {
                    display: flex;
                    align-items: center;
                    justify-content:space-between;
                    .record_left {
                        .record_desc {
                            font-size: 0.16rem;
                            color:rgba(51,51,51,1);
                            width: 2.4rem;
                        }
                        .record_date {
                            margin-top: 0.1rem;
                            font-size: 0.13rem;
                            color:rgba(153,153,153,1);
                        }
                    }
                    .money {
                        font-size: 0.22rem; font-weight:500;
                    }
                    .money_add {
                        color: #FF2C79;
                    }
                    .money_red {
                        color:rgba(105,168,246,1);
                    }
                }

            }
        }
        .none {
            position: relative;
            margin-top: 0.12rem; padding-top: 1.2rem;
            height: calc(100vh - 1.73rem);
            border-radius: 0.2rem 0.2rem 0 0;
            background-color: #fff;
            img {
                display: block;
                margin: auto;
                width: 1.5rem; height: 1.09rem;
            }
            div {
                margin-top: 0.16rem;
                text-align: center;
                font-size: 0.14rem; color: #666;
            }
        }
    }
</style>