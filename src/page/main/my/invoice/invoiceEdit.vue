<!--
 * 文件描述：发票头修改
 * 创建人：赵志银
 * 创建时间：2019-03-14
-->
<template>
    <div id='main' ref='main'>
        <div class='wm_padding invoice_type'>
            <div class='title'>发票类型</div>
            <div class='check'>
                <img src='@/assets/images/common/check.png'>
                <span>电子普通发票</span>
            </div>
            <div class='tip'>
                <span>*</span>
                <span>提示：电子普通发票与纸质发票具备同等法律效力，可支持报销入账。</span>
            </div>
        </div>
        <div class='wm_padding head_type'>
            <div class='title'>抬头类型</div>
            <div :class='["check",{"no_check":headType!=invoiceHead.PERSON}]'>
                <img :src='headType==invoiceHead.PERSON?require("@/assets/images/common/check.png"):require("@/assets/images/common/uncheck.png")'>
                <span>个人</span>
            </div>
            <div :class='["check",{"no_check":headType!=invoiceHead.COMPANY}]'>
                <img :src='headType==invoiceHead.COMPANY?require("@/assets/images/common/check.png"):require("@/assets/images/common/uncheck.png")'>
                <span>单位</span>
            </div>
        </div>
        <div class='wm_padding info'>
            <div class='condition'>
                <label>名称</label>
                <input v-model='name' :placeholder='headType==invoiceHead.COMPANY?"请填写公司名称":"请填写姓名"' @blur='kickBack()'>
            </div>
            <div class='condition' v-if='headType==invoiceHead.COMPANY'>
                <label>纳税人识别号</label>
                <input placeholder='请填写纳税人识别号' v-model='taxNumber' bindinput='inputTaxNumber' @blur='kickBack()'>
            </div>
        </div>
        <div id='delete' class='wm_padding' @click='dele()'>删除发票抬头</div>
        <div id='save'>
            <div @click='save()' class='wm_bgcolor_main'>保存</div>
        </div>
    </div>
</template>

<script type='text/javascript'>
    import {fullScreenHeight, getLocalToken, isEmpty} from '@/utils/CommonUtils.js'
    import {Dict_InvoiceHead, Dict_InvoiceType} from '@/utils/DictUtils.js'

    export default {
        data() {
            return {
                name: '',
                headType: '',
                taxNumber: '',
                invoiceHead: Dict_InvoiceHead
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '修改发票抬头'})
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
                this.$axios.post(common_request + 'v1/inv/record', {
                    token: getLocalToken(),
                    code: this.$route.query.code
                }).then(response => {
                    if (response.code == 200) {
                        this.name = response.data.name
                        this.headType = response.data.style
                        this.taxNumber = response.data.tax_number
                    }
                })
            },
            /**
                删除
                @param
                @return
            */
            dele() {
                this.$wm_dialog.confirm('确定删除该发票头吗？', '取消', ()=>{
                    
                }, '确定', ()=>{
                    this.$axios.post(common_request + 'v1/inv/delete', {
                        token: getLocalToken(),
                        code: this.$route.query.code
                    }).then(response => {
                        if (response.code == 200) {
                            this.$wm_dialog.tip('删除成功', ()=>{
                                history.back(-1)
                            })
                        }
                    })
                })
            },
            /**
                保存
                @param
                @return
            */
            save() {
                if (!this.valid()) {
                    return
                }
                this.$axios.post(common_request + 'v1/inv/modify', {
                    token: getLocalToken(),
                    code: this.$route.query.code,
                    name: this.name,
                    tax_number: this.taxNumber
                }).then(response => {
                    if (response.code == 200) {
                        this.$wm_dialog.tip('保存成功', ()=>{
                            history.back(-1)
                        })
                    }
                })
            },
            /**
                校验
                @param
                @return {Boolean} 是否校验通过
            */
            valid() {
                if (this.headType == Dict_InvoiceHead.PERSON) {
                    if (isEmpty(this.name)) {
                        this.$wm_dialog.tip('请填写姓名')
                        return false
                    }
                } else if (this.headType == Dict_InvoiceHead.COMPANY) {
                    if (isEmpty(this.name)) {
                        this.$wm_dialog.tip('请填写公司名称')
                        return false
                    }
                    if (isEmpty(this.taxNumber)) {
                        this.$wm_dialog.tip('请填写纳税人识别号')
                        return false
                    }
                }
                return true
            },
            /**
                失去焦点
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
    #main {
        position: relative;
        padding-bottom: 0.64rem;
        height: 100%;
        background-color: #f8f8f8;
        .invoice_type {
            padding-top: 0.08rem; padding-bottom: 0.08rem;
            background-color: #fff;
            .tip {
                margin-top: 0.05rem;
                span:nth-child(1) {
                    font-size: 0.13rem;
                    color: #ff3333;
                }
                span:nth-child(2) {
                    margin-left: 0.05rem;
                    font-size: 0.13rem;
                    color: #999;
                }
            }
        }
        .head_type {
            margin-top: 0.16rem; padding-top: 0.08rem; padding-bottom: 0.08rem;
            background-color: #fff;
        }
        .info {
            margin-top: 0.16rem; padding-top: 0.08rem; padding-bottom: 0.08rem;
            background-color: #fff;
            .condition {
                height: 0.4rem;
                line-height: 0.4rem;
                label {
                    float: left;
                    width: 1.2rem;
                }
                input {
                    display: block;
                    margin-left: 1.2rem;
                    height: 0.4rem;
                    line-height: 0.4rem;
                    border: none;
                }
            }
        }
        #save {
            position: fixed;
            left: 0; right: 0; bottom: 0; z-index: 98;
            width: 100%; height: 0.64rem;
            border-top: 1px solid #f8f8f8;
            background-color: #fff;
            div {
                width: 90%; height: 0.44rem;
                margin: 0.1rem 5%;
                text-align: center; line-height: 0.44rem;
                color: #fff;
                border-radius: 0.22rem;
                font-size: 0.16rem;
            }
        }
        .title {
            height: 0.4rem;
            line-height: 0.4rem;
            font-weight: bold;
        }
        .check {
            height: 0.4rem;
            background-color: #fff;
            img:nth-child(1) {
                float: left;
                width: 0.14rem; height: 0.14rem;
                margin-top: 0.13rem;
            }
            span:nth-child(2) {
                float: left;
                height: 0.4rem;
                margin-left: 0.06rem;
                line-height: 0.4rem;
                font-size: 0.14rem;
            }
        }
        .no_check {
            span:nth-child(2) {
                color: #999;
            }
        }
        #delete {
            height: 0.4rem;
            margin-top: 0.16rem; padding-left: 0.16rem;
            line-height: 0.4rem;
            background-color: #fff; color: #ff3333;
        }
    }
</style>
