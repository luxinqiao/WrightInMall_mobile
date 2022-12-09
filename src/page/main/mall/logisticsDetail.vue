<!--
 * 文件描述：物流
 * 创建人：赵志银
 * 创建时间：2020-10-29
-->
<template>
    <div id='main' ref='main'>
        <div class='info' v-if='isInfo'>
            <img :src='data.product_image' class='info_img'>
            <div class='info_name text_ellipsis'>{{data.product_name}}</div>
            <div class='info_tag text_ellipsis'>规格：{{data.product_tag}}</div>
            <div class='info_express'>{{logisData.express_name+'：'+logisData.express_no}}</div>
        </div>
        <div class='express' v-if='isExpress && !isEmpty(logisData.express_info)'>
            <div class='express_suc' v-if='logisData.express_state==3'>
                <img src='@/assets/images/my/order/logistics/complete.png'>
                <div>已签收</div>
            </div>
            <div v-for='(item,i) of logisData.express_info' :key=i class='express_item'>
                <div :class='["express_context",{new:i==0},{"tag":i>0}]'>{{item.context}}</div>
                <div class='express_time'>{{item.time}}</div>
            </div>
        </div>
        <div class='none' v-if='isExpress && isEmpty(logisData.express_info)'>
            <img src='@/assets/images/my/order/logistics/none.png'>
            <div>暂无物流信息</div>
        </div>
    </div>
</template>
<script>
    import {getLocalToken, getParameter, fullScreenHeight, isEmpty} from '@/utils/CommonUtils.js'

    export default {
        data() {
            return {
                /** 返回数据 **/
                data: {},
                logisData: {},
                isInfo: false,
                isExpress: false,
                isEmpty: isEmpty
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '物流详情'})
            this.$wm_data.setFooter = false
            fullScreenHeight(this.$refs.main)
            this.$wm_dialog.loading()
            this.initLogisData()
            this.initData()
        },
        methods: {
            /**
                初始化物流
                @param
                @return
            */
            initLogisData() {
                this.$axios.post(rec_request+'v1/express/info', {
                    token: getLocalToken(),
                    order_code: getParameter('code')
                })
                .then(response => {
                    this.$wm_dialog.closeLoading()
                    if (response.code == 200) {
                        this.logisData = response.data
                        this.isExpress = true
                    }
                })
                .catch(response => {
                })
            },
            /**
                初始化数据
                @param
                @return
            */
            initData() {
                this.$axios.post(rec_request+'v1/order/detail', {
                    token: getLocalToken(),
                    order_code: getParameter('code')
                })
                .then(response => {
                    this.$wm_dialog.closeLoading()
                    if (response.code == 200) {
                        this.data = response.data
                        this.isInfo = true
                    }
                })
                .catch(response => {
                    
                })
            },
        }
    }
</script>
<style lang='scss' scoped>
    #main {
        position: relative;
        background-color: #fafafa;
        .info {
            position: relative;
            padding: 0.16rem;
            background-color: #fff;
            .info_img {
                display: block;
                width: 0.82rem; height: 0.82rem;
            }
            .info_name {
                position: absolute;
                left: 1.06rem; top: 0.16rem;
                height: 0.19rem;
                line-height: 0.19rem;
                font-size: 0.14rem;
                width: 2.53rem;
            }
            .info_tag {
                position: absolute;
                left: 1.06rem; top: 0.39rem;
                height: 0.16rem;
                line-height: 0.16rem;
                width: 2.53rem;
                font-size: 0.11rem; color: #999;
            }
            .info_express {
                position: absolute;
                left: 1.06rem; top: 0.71rem;
                line-height: 0.18rem;
                width: 2.53rem;
                font-size: 0.13rem; color: #666;
            }
        }
        .express {
            position: relative;
            margin-top: 0.12rem; padding: 0.16rem 0.12rem;
            background-color: #fff;
            .express_suc {
                position: relative;
                padding: 0 0 0.06rem 0.23rem; margin-left: 0.1rem;
                border-left: 1px solid #EFEFEF;
                img {
                    position: absolute;
                    top: 0; left: -0.11rem;
                    width: 0.22rem; height: 0.22rem;
                }
                div {
                    line-height: 0.22rem;
                    font-size: 0.16rem;
                }
            }
            .express_item {
                position: relative;
                padding: 0 0 0.23rem 0.23rem; margin-left: 0.1rem;
                border-left: 1px solid #EFEFEF;
                .express_context {
                    font-size: 0.14rem;
                    line-height: 0.23rem; color: #999;
                }
                .express_time {
                    margin-top: 0.05rem;
                    line-height: 0.18rem;
                    font-size: 0.13rem; color: #999;
                }
                .new {
                    color: #333;
                }
                .tag::before {
                    content: '';
                    position: absolute;
                    top: 0.08rem; left: -0.04rem;
                    width: 0.08rem; height: 0.08rem;
                    background-color: #cecece;
                    border-radius: 0.04rem;
                }
            }
        }
        .none {
            position: relative;
            margin-top: 0.2rem; padding-top: 1.5rem;
            height: calc(100vh - 1.78rem);
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
        .none_wc {
            height: calc(100vh - 1.27rem);
        }
    }
</style>
