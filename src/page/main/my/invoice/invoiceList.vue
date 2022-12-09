<!--
 * 文件描述：发票头列表
 * 创建人：赵志银
 * 创建时间：2019-03-14
-->
<template>
    <div id='main' ref='main'>
        <div class='none' v-if='isEmpty(dataListArr)&&isHas'>
            <img src='@/assets/images/my/invoice/empty.png'>
            <span>您还没有抬头哦</span>
            <span @click='goInvoiceAdd()' class='wm_bgcolor_main'>新增抬头</span>
        </div>
        <div class='invoice_list' v-if='!isEmpty(dataListArr)&&isHas'>
            <div v-for='(item,index) in dataListArr' :key='index' class='list'  @click='setInvoice(item)'>
                <div class='title'>{{item.name}}</div>
                <div class='type wm_color_main'>{{getInvoiceHead(item.style)}}普票</div>
                <div>
                    <div class='default' @click.stop='setDefault({code:item.code,index:index})'>
                        <img :src='item.is_default==1?require("@/assets/images/common/check.png"):require("@/assets/images/common/uncheck.png")'>
                        <span>设为默认抬头</span>
                    </div>
                </div>
                <div class='edit' @click.stop='goInvoiceEdit(item.code)'>编辑</div>
            </div>
            <div class='button' @click='goInvoiceAdd()'>
                <span class='wm_bgcolor_main'>新增发票抬头</span>
            </div>
        </div>
    </div>
</template>

<script type='text/javascript'>
    import {fullScreenHeight, getLocalToken, isEmpty, urlChange} from '@/utils/CommonUtils.js'
    import {getInvoiceHead} from '@/utils/DictUtils.js'

    export default {
        data() {
            return {
                paramObj: {},
                dataListArr: [],
                isHas: false,
                getInvoiceHead: getInvoiceHead,
                isEmpty: isEmpty
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '我的发票抬头'})
            this.$wm_data.setFooter = false
            fullScreenHeight(this.$refs.main)
            this.$wm_dialog.loading()
            this.paramObj = urlChange(window.location.href)
            this.initData()
        },
        methods: {
            /**
                初始化数据
                @param
                @return
            */
            initData() {
                this.$axios.post(common_request + 'v1/inv/records', {
                    token: getLocalToken()
                }).then(response => {
                    if (response.code == 200) {
                        this.dataListArr = response.data
                        if(!isEmpty(sessionStorage.wm_invoice_code)) {
                            let isdele = true
                            for (let i=0; i<this.dataListArr.length; i++) {
                                if(this.dataListArr[i].code==sessionStorage.wm_invoice_code) {
                                    isdele = false
                                }
                            }
                            if(isdele) {
                                sessionStorage.wm_invoice_code = ''
                            }
                        }
                    }
                    this.isHas = true
                    this.$wm_dialog.closeLoading()
                }).catch(response => {

                })
            },
            /**
                设置发票抬头
                @param {Object}item 发票数据
                @return
            */
            setInvoice(item) {
                if (this.$route.query.from != 'invoiceSee') {
                    return
                }
                sessionStorage.wm_invoice_code = item.code
                history.back(-1)
            },
            /**
                设为默认
                @param {Object}item 发票数据
                @return
            */
            setDefault(item) {
                this.$wm_dialog.stopLoading()
                this.$axios.post(common_request + 'v1/inv/used', {
                    token: getLocalToken(),
                    code: item.code
                }).then(response => {
                    if (response.code == 200) {
                        if (this.dataListArr[item.index].is_default == 1) {
                            this.dataListArr[item.index].is_default = 0
                        } else {
                            for (let i = 0; i < this.dataListArr.length; i++) {
                                this.dataListArr[i].is_default = 0
                            }
                            this.dataListArr[item.index].is_default = 1
                        }
                        if(this.paramObj.from == 'invoiceSee') {
                            sessionStorage.wm_invoice_code = item.code
                        }
                        this.$wm_dialog.tip('设置成功')
                    }
                }).catch(response => {

                })
            },
            /**
                跳转-新增抬头
                @param
                @return
            */
            goInvoiceAdd() {
                this.$router.push({path: 'invoiceAdd'})
            },
            /**
                跳转-编辑抬头
                @param {String}code 编码
                @return
            */
            goInvoiceEdit(code) {
                this.$router.push({path: 'invoiceEdit', query: {code: code}})
            }
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        padding-bottom: 0.82rem;
        .none {
            img:nth-child(1) {
                position: absolute;
                left: 0; right: 0; top: 0; bottom: 2.5rem;
                margin: auto;
                width: 1.5rem; height: 1.09rem;
            }
            span:nth-child(2) {
                position: absolute;
                left: 0; right: 0; top: 0; bottom: 0.9rem;
                margin: auto;
                width: 100%; height: 0.2rem;
                text-align: center; line-height: 0.2rem;
                color: #666;
                font-size: 0.14rem;
            }
            span:nth-child(3) {
                position: absolute;
                left: 0; right: 0; top: 0.5rem; bottom: 0;
                margin: auto;
                width: 1.6rem; height: 0.4rem;
                text-align: center; line-height: 0.4rem;
                border-radius: 0.22rem;
                font-size: 0.16rem;
                color: #fff;
            }
        }
        .invoice_list {
            .list {
                position: relative;
                margin: 0 0.16rem; padding: 0 0 0.16rem 0;
                border-bottom: 1px solid #eee;
                box-sizing: content-box;
                .title {
                    position: relative;
                    padding-top: 0.12rem;
                    min-height: 0.22rem; width: 2.5rem;
                    line-height: 0.22rem;
                    font-size: 0.16rem; font-weight: bold;
                    word-break: break-all;
                }
                .type {
                    display: inline-block;
                    margin-top: 0.08rem;
                    padding: 0 0.08rem;
                    height: 0.2rem;
                    text-align: center; line-height: 0.2rem;
                    border-radius: 2px;
                    background-color: #fcf1f3;
                    font-size: 0.11rem;
                }
                .default {
                    position: relative;
                    padding: 0.12rem 0 0 0;
                    height: 0.14rem;
                    box-sizing: content-box;
                    display: inline-flex;
                    align-items: center;
                    img:nth-child(1) {
                        display: block;
                        width: 0.14rem; height: 0.14rem;
                        margin-top: 1px;
                    }
                    span:nth-child(2) {
                        height: 0.14rem;
                        margin-left: 0.03rem;
                        line-height: 0.14rem;
                        font-size: 0.11rem;
                        color: #999;
                    }
                }
                .edit {
                    position: absolute;
                    top: 0.24rem; right: 0;
                    width: 0.58rem; height: 0.28rem;
                    text-align: center; line-height: 0.28rem;
                    border-left: 1px solid #efefef;
                    font-size: 0.13rem;
                    color: #999;
                }
            }
            .button {
                position: fixed;
                left: 0; right: 0; bottom: 0; z-index: 98;
                height: 0.66rem;
                background-color: #fff;
                span {
                    display: inline-block;
                    width: 90%; height: 0.5rem;
                    margin: 0 0.16rem 0.16rem 0.16rem;
                    text-align: center; line-height: 0.5rem;
                    color: #fff;
                    border-radius: 0.25rem;
                    font-size: 0.16rem;
                }
            }
        }

    }
</style>
