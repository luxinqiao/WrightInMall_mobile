<!--
 * 文件描述：发票详情
 * 创建人：赵志银
 * 创建时间：2020-11-11
-->
<template>
    <div id='main' ref='main'>
        <div id='order'>
            <div class='item'>
                <span class='label'>开票状态</span>
                <span :class='["text", {"yp_color_main":dataObj.status==Dict_Inv.AUDITING}]'>{{getInv(dataObj.status)}}</span>
                <img v-if='dataObj.status==Dict_Inv.ISSUIED' src='../../../assets/images/my/invoice/hasGrant.png'>
            </div>
            <div class='item'>
                <span class='label'>订单编号</span>
                <span class='text'>{{dataObj.order_no}}</span>
            </div>
            <div class='item'>
                <span class='label'>下单时间</span>
                <span class='text'>{{dataObj.payment_time}}</span>
            </div>
        </div>
        <div id='invoice'>
            <div class='item'>
                <span class='label'>发票类型</span>
                <span class='text'>{{getInvoiceType(dataObj.style)}}</span>
            </div>
            <div class='item'>
                <span class='label'>抬头类型</span>
                <span class='text'>{{getInvoiceHead(dataObj.inv_style)}}</span>
            </div>
            <div class='item'>
                <span class='label'>发票抬头</span>
                <span class='text'>{{dataObj.inv_name}}</span>
            </div>
            <div class='item'>
                <span class='label'>开票内容</span>
                <span class='text'>{{dataObj.invoice_content}}</span>
            </div>
            <div class='item'>
                <span class='label'>开票金额</span>
                <span class='text'>￥{{priceTransition(dataObj.product_price)}}</span>
            </div>
            <div class='item'>
                <span class='label'>申请时间</span>
                <span class='text'>{{dataObj.gmt_create}}</span>
            </div>
            <div class='item'>
                <span class='label'>邮箱地址</span>
                <span class='text'>{{dataObj.inv_email}}</span>
            </div>
        </div>
        <div v-if='dataObj.status==Dict_Inv.ISSUIED' class='btn'>
            <a :href='dataObj.inv_download_link' class='download wm_bgcolor_main'>发票</a>
        </div>
    </div>
</template>

<script type='text/javascript'>
    import {fullScreenHeight, getParameter, priceTransition, getLocalToken} from '@/utils/CommonUtils.js'
    import {getInvoiceHead, getInv, getInvoiceType, Dict_Inv} from '@/utils/DictUtils.js'

    export default {
        data() {
            return {
                dataObj: {},
                getInvoiceHead: getInvoiceHead,
                getInv: getInv,
                priceTransition: priceTransition,
                getInvoiceType: getInvoiceType,
                Dict_Inv
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '发票详情'})
            this.$wm_data.setFooter = false
            fullScreenHeight(this.$refs.main)
            this.initData()
        },
        methods: {
            /**
                初始化数据
                @param
                @return
            */
            initData() {
                 this.$axios.post(rec_request+'v1/inv/detail', {
                    token: getLocalToken(),
                    inv_code: getParameter('inv_code')
                })
                .then(response => {
                    if (response.code == 200) {
                        this.dataObj = response.data
                    }
                })
                .catch(response => {
                    
                })
            }
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        height: 100%;
        background-color: #f8f8f8;
        #order {
            padding: 0.16rem;
            background-color: #fff;
        }
        #invoice {
            margin-top: 0.12rem; padding: 0.16rem;
            background-color: #fff;
        }
        .item {
            position: relative;
            min-height: 0.2rem;
            margin-top: 0.2rem;
            .label {
                position: absolute;
                top: 0; left: 0;
                height: 0.2rem;
                line-height: 0.2rem;
                font-size: 0.14rem;
            }
            .text {
                display: block;
                margin-left: 0.9rem; 
                min-height: 0.2rem; width: 2.53rem;
                line-height: 0.2rem;
                font-size: 0.14rem; text-align: right;
            }
            img {
                position: absolute;
                top: 0.08rem; right: 0.4rem;
                width: 0.74rem; height: 0.74rem;
            }
        }
        .item:nth-child(1) {
            margin-top: 0;
        }
        .btn {
            position: fixed;
            bottom: 0; left: 0;
            width: 100%; height: 0.42rem;
            background-color: #fff;
            a {
                position: absolute;
                bottom: 0.17rem; left: 0.16rem;
                width: 3.43rem; height: 0.5rem;
                line-height: 0.5rem; text-align: center;
                font-size: 0.16rem; color: #fff;               
                border-radius: 0.25rem; text-decoration: none;
            }
        }
    }
</style>
