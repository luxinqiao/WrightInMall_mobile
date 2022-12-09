<!--
    文件描述：个人信息修改
    创建人：赵志银
    创建时间：2020-11-05
-->
<template>
    <div ref='main' id='main'>
        
        <div class='list' v-if='paramObj.type=="remark"'>
            <textarea type='text' bindinput='remarkChange' placeholder='请输入您的个人简介' v-model='paramObj.value' maxlength='150' oninput="if(value.length>150)value=value.slice(0,150);"></textarea>
            <div @click='complete()' :class='{"no":isEmpty(paramObj.value)}'>完成</div>
            <span>150</span>
        </div>

        <div class='list sign' v-if='paramObj.type=="sign"'>
            <textarea type='text' bindinput='signChange' placeholder='请输入您的个性签名' v-model='paramObj.value' maxlength='25' oninput="if(value.length>25)value=value.slice(0,25);"></textarea>
            <div @click='completeSign()' :class='{"no":isEmpty(paramObj.value)}'>完成</div>
            <span>25</span>
        </div>
    </div>
</template>

<script type='text/javascript'>
    import {isEmpty, fullScreenHeight, urlChange} from '@/utils/CommonUtils.js';
    import {wm_dialog} from '@/utils/DialogUtils.js';

    export default {
        data() {
            return {
                paramObj: {},
                isEmpty: isEmpty
            }
        },
        mounted() {
            this.initPage()
        },
        methods: {
            /**
             * 初始化页面
             * @param
             * @return
             */
            initPage() {
                this.$wm_data.setFooter = false
                fullScreenHeight(this.$refs.main)
                this.paramObj = urlChange(window.location.href)
                if(this.paramObj.type=="sign") {
                    this.$wm_data.setHeader({title: '个性签名'})
                } else {
                    this.$wm_data.setHeader({title: '个人简介'})
                }
            },

            /**
             * 保存个性签名成功后返回上一页
             * @param
             * @return
             */
            completeSign() {
                if(isEmpty(this.paramObj.value)) {
                    return
                }
                this.$wm_data.stopCheckSign = true; //阻止验签
                this.$axios.post(rih_request + 'API/V1/UserInfo/setUserSign', {
                    token: localStorage.wm_token,
                    sign: this.paramObj.value
                }).then(response => {
                    if (response.code == 200) {
                        history.back(-1)
                    }
                });
            },

            /**
             * 保存个人简介成功后返回上一页
             * @param
             * @return
             */
            complete() {
                if(isEmpty(this.paramObj.value)) {
                    return
                }
                this.$axios.post(rih_request + 'API/V1/UserInfo/updateUserInfo', {
                    token: localStorage.wm_token,
                    uiRemark: this.paramObj.value
                }).then(response => {
                    if (response.code == 200) {
                        history.back(-1)
                    }
                });
            },
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        padding-top: 1px;
        background-color: #FAFAFA;
        .list {
            position: relative;
            textarea {
                width: 100%; height: 2rem;
                padding: 0.12rem 0.16rem;
                font-size: 0.16rem; line-height: 0.22rem;
                background-color: white;
                border: none;
                resize: none;
            }
            div {
                width: 3.43rem; height: 0.5rem;
                margin: auto; margin-top: 0.4rem;
                text-align: center; line-height: 0.5rem;
                font-size: 0.16rem; color: #fff;
                background-color: rgb(255,44,121);
                border-radius: 0.25rem;
            }
            span {
                position: absolute;
                top: 1.79rem; right: 0.16rem;
                font-size: 0.13rem; color: #999;
            }
            .no {
                background-color:#FFC0D7;
            }
        }
        .sign {
            textarea {
                height: 1.2rem;
            }
            span {
                position: absolute;
                top: 0.99rem; right: 0.16rem;
                font-size: 0.13rem; color: #999;
            }
        }
    }
    // /deep/ .mint-button-text {
    //     color: white;
    //     font-size: 14px;
    // }

    // .content {
    //     padding-right:16px;
    //     padding-left:16px;
    //     text-align: center;
    //     background-color: #f8f8f8;
    //     >.signBox {
    //         padding-top: 35px;
    //         >.signText {
    //             width:100%;
    //             border: 1px solid #d9d9d9;
    //             border-radius: 8px;
    //             background-color: white;
    //             >textarea {
    //                 width:95%;
    //                 height:40px;
    //                 font-size: 14px;
    //                 border: 0;
    //             }
    //         }
    //         >.signBtn {
    //             width: 95%;
    //             height: 35px;
    //             margin-top: 25px;
    //             background-color: #ef5e8f;
    //             border-radius: 8px;
    //         }
    //         >.signDivBtn {
    //             left:0;
    //             right:0;
    //             margin: 25px auto 0 auto;
    //             line-height:33px;
    //             width: 95%;
    //             height: 35px;
    //             background-color: rgb(200,200,200);
    //             border-radius: 8px;
    //             color: white;
    //             font-size: 14px;
    //         }
    //     }
    // }
</style>
