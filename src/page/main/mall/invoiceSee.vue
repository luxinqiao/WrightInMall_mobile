<!--
 * 文件描述：申请发票
 * 创建人：赵志银
 * 创建时间：2020-10-30
-->
<template>
    <div id='main' ref='main'>
        <div v-if='isHas'>
            <div id='tip'>提示：请填写正确的发票信息</div>
            <div class='item '>
                <span class='label'>发票内容</span>
                <span class='input name'>{{orderObj.name}}</span>
            </div>
            <div class='item'>
                <span class='label'>发票金额</span>
                <span class='input'>￥{{priceTransitionTwo(orderObj.price)}}</span>
            </div>
            <div class='item' @click='goInvoiceList'>
                <span class='label'>发票抬头</span>
                <span class='input color_gray' v-if='isEmpty(invoiceHead)'>请选择发票抬头</span>
                <div class='invoice_head' v-if='!isEmpty(invoiceHead)'>
                    <span>{{invoiceName}}</span>
                    <span class='wm_color_main'>{{invoiceHead}}</span>
                </div>
                <img class='arrow_right' src='@/assets/images/my/address/arrow-right.png'>
            </div>
            <div class='item border-bottom'>
                <span class='label'>邮箱</span>
                <input class='input' @blur='kickBack' placeholder='请填写收取发票人邮箱' v-model='email' type='text' ref='email'>
            </div>
            <div id='button' @click='apply' class='wm_bgcolor_main'>提交申请</div>
        </div>
    </div>
</template>

<script type='text/javascript'>
    import {fullScreenHeight, isEmpty, trimStr, getParameter, getLocalToken, priceTransitionTwo} from '@/utils/CommonUtils.js'
    import {getInvoiceHead} from '@/utils/DictUtils.js'

    export default {
        data() {
            return {
                orderObj: {
                    name: '',
                    price: 0
                },
                isHas: false,
                invoiceCode: '',
                invoiceName: '',
                invoiceHead: '',
                email: '',
                getInvoiceHead: getInvoiceHead,
                isEmpty: isEmpty,
                priceTransitionTwo: priceTransitionTwo
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '申请发票'})
            this.$wm_data.setFooter = false
            fullScreenHeight(this.$refs.main)
            this.$wm_dialog.loading()
            this.initOrderData()
            this.initData()
        },
        methods: {
            /**
                初始化订单
                @param
                @return
            */
            initOrderData() {
                this.$axios.post(rec_request+'rec/order/detail', {
                    token: getLocalToken(),
                    order_code: getParameter('order_code')
                })
                .then(response => {
                    if (response.code == 200) {
                        this.orderObj.name = response.data.product_name
                        this.orderObj.price = (Number(response.data.payment_amount) - Number(response.data.gold))
                    }
                    this.isHas = true
                    this.$wm_dialog.closeLoading()
                })
                .catch(response => {
                    this.isHas = true
                    this.$wm_dialog.closeLoading()
                })
            },
            /**
                初始化发票
                @param
                @return
            */
            initData() {
                let param = {
                    token: getLocalToken()
                }
                if(!isEmpty(sessionStorage.wm_invoice_code)) {
                    param.code = sessionStorage.wm_invoice_code
                }
                this.$axios.post(common_request+'v1/inv/record', param )
                .then(response => {
                    if (response.code == 200) {
                        if(!isEmpty(response.data.code)) {
                            this.invoiceName = response.data.name
                            this.invoiceHead = getInvoiceHead(response.data.style) + '普票'
                            this.invoiceCode = response.data.code
                        }
                    } else {
                        this.invoiceName = ''
                        this.invoiceHead = ''
                        this.invoiceCode = ''
                    }
                })
                .catch(response => {
                    
                })
            },
            /**
                选择抬头
                @param
                @return
            */
            goInvoiceList() {
                this.$router.push({path: '../my/invoiceList?from=invoiceSee'})
            },
            /**
                提交申请
                @param
                @return
            */
            apply () {
                if(isEmpty(this.invoiceCode)){
                    this.$wm_dialog.tip('请选择发票抬头')
                    return
                }
                if(this.checkEmail()) {
                    this.$axios.post(exam_request+'v1/userInvoiceReq', {
                        token: localStorage.wm_token,
                        order_code: getParameter('order_code'),
                        order_type: '1',
                        invoice_head_code: this.invoiceCode,
                        email: this.email
                    })
                    .then(response => {
                        if (response.code == 200) {
                            this.$wm_dialog.tip('申请成功', ()=>{
                                sessionStorage.wm_invoice_code = ''
                                history.back(-1)
                            })
                        }
                    })
                    .catch(response => {
                        
                    })
                }
            },
            /**
                检测邮箱
                @param
                @return {boolean} 检测邮箱
            */
            checkEmail() {
                let ce = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
                if (trimStr(this.$refs.email.value) === '') {
                    this.$wm_dialog.tip('请输入邮箱')
                    return false
                } else if (!ce.test(this.$refs.email.value)){
                    this.$wm_dialog.tip('请输入正确的邮箱')
                    return false
                }
                return true
            },
            /**
                页面滚动
                @param
                @return
            */
            kickBack() {
                setTimeout(() => {
                    window.scrollTo(0, document.body.scrollTop + 1);
                    document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1);  
                }, 10)
            }
        }
    }
</script>

<style lang='scss' scoped>
#tip {
    height: 0.36rem;
    padding-left: 0.16rem;
    line-height: 0.36rem;
    font-size: 0.14rem;
    color: #f86e21; background-color: #fdfcec;
}
.item {
    position: relative;
    min-height: 0.5rem;
    .label {
        position: absolute;
        top: 0.14rem; left: 0.16rem;
        height: 0.22rem;
        line-height: 0.22rem;
        font-size: 0.16rem;
    }
    .input:not(.name) {
        position: absolute;
        top: 0.14rem; left: 1.12rem; right: 0.25rem;
        height: 0.22rem;
        line-height: 0.22rem;
        font-size: 0.16rem;
    }
    .name.input {
        position: relative;
        top: 0.14rem; left: 1.12rem; right: 0.25rem;
        width: 2.5rem; max-height: 0.44rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-break: break-all;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .color_gray {
        color: #999;
    }
    .invoice_head {
        position: relative;
        margin: 0 0 0 1.12rem; padding-top: 0.14rem;
        min-height: 0.5rem; width: 2.35rem;
        span:nth-child(1) {
            margin-top: 0.14rem;
            height: 0.22rem;
            line-height: 0.22rem;
            font-size: 0.16rem;
            word-break: break-all;
        }
        span:nth-child(2) {
            margin: 0.15rem 0 0 0.16rem; padding: 0 0.08rem;
            height: 0.2rem;
            text-align: center; line-height: 0.2rem;
            border-radius: 0.02px;
            background-color: #fcf1f3;
            font-size: 0.11rem;
        }
    }
    .arrow_right {
        position: absolute;
        top: 0.18rem; right: 0.16rem;
        width: 0.13rem; height: 0.13rem;
    }
    input {
        border: none;
        outline: none;
    }
}

#button {
    height: 0.5rem;
    margin: 0.4rem 0.16rem 0 0.16rem;
    text-align: center; line-height: 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.16rem; letter-spacing: 1px;
    color: #fff; 
}
</style>
