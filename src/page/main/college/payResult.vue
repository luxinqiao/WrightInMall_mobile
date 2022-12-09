<!--
 * 文件描述：支付结果
 * 创建人：赵志银
 * 创建时间：2020-04-16
-->
<template>
    <div id='main' ref='main'>
        <div class='top success has free' v-show='isShow'>
            <img src='./images/result/success.png' v-show='payType==1'>
            <div class='title'>{{payType==1?'购买成功':(payType==2?'已购买过该课程':(payType==3?'VIP免费学习该课程':(payType==4?'SVIP免费学习该课程':'已兑换过该课程')))}}</div>
            <div class='phone'>{{payType==3?'已授权澜渟VIP账号':(payType==4?'已授权澜渟SVIP账号':'已放入澜渟账号')}}{{phone}}</div>
        </div>
        <div class='mesg'>
            <div>使用说明</div>
            <div>
                <div>
                    <img src='./images/result/1.png'>
                    <img src='./images/result/0.png' class='next'>
                </div>
                <div>
                    <img src='./images/result/2.png'>
                    <img src='./images/result/0.png' class='next'>
                </div>
                <img src='./images/result/3.png'>
            </div>
        </div>
        <div class='bottom'>
            <div class='backBtn' @click='back()'>返回</div>
            <div class='openBtn' @click='openApp()'>
                <div>打开澜渟</div>
            </div>
        </div>
    </div>
</template>

<script>
import {fullScreenHeight, getParameter, getBrowserType} from '@/utils/CommonUtils.js'

export default {
    data() {
        return {
            payType: '', //1:成功， 2：重复支付，3：VIP免费，4：SVIP免费，5：兑换
            phone: localStorage.phone,
            isShow: false
        }
    },
    mounted() {
        this.$wm_data.setHeader({title: '澜渟极致学院'})
        this.$wm_data.setFooter = false
        // 判断来源是app、微信、浏览器
        if (this.browserType == 'wechat') {
            this.$wm_data.hasHeader = false
        }
        if(getParameter('payType')==1) {
            this.payType = 1
            this.isShow = true
        } else {
            this.initPage()
        }
    },
    methods:{
        /**
            初始化页面
            @param
            @return 
        */
        initPage() {
            this.$axios.post(lesson_request+'v2/source/auth-type', {
                token: localStorage.token,
                code: getParameter('code'),
                type: getParameter('type')
            })
            .then(response => {
                if (response.code == 200) {
                    let data = response.data
                    if(data.auth_type == 1) { //购买
                        this.payType = 2
                    } else if(data.auth_type == 2) { //兑换
                        this.payType = 5
                    } else if(data.auth_type == 3) { //vip
                        this.payType = 3
                    } else if(data.auth_type == 4) {  //svip
                        this.payType = 4
                    }
                    this.isShow = true
                }
            })
            .catch(response => {

            })
        },
        /**
            返回详情页
            @param
            @return 
        */
        back() {
            history.back(-1)
        },
        /**
            打开详情页
            @param
            @return 
        */
        openApp() {
            window.location.href = downUrl
        }
    }
}
</script>
<style lang='scss' scoped>
#main {
    padding-bottom: 0.7rem;
    background-color: #FAFAFA;
    >.top {
        text-align: center;
        background-color: #fff;
        >img {
            display: block;
            margin: auto;
            width: 0.75rem; height: 0.74rem;
        }
        >.title {
            margin-top: 0.02rem;
            height: 0.25rem;
            line-height: 0.25rem;
            font-size: 0.18rem;
        }
        >.phone {
            margin-top: 0.04rem;
            height: 0.2rem;
            line-height: 0.2rem;
            font-size: 0.14rem; color: #666;
        }
    }
    >.success {
        padding: 0.3rem 0 0.32rem 0;
    }
    >.has {
        padding: 0.35rem 0 0.35rem 0;
    }
    >.success {
        padding: 0.34rem 0 0.36rem 0;
    }
    >.mesg {
        margin-top: 0.1rem; padding: 0.15rem 0.12rem;
        background-color: #fff;
        >div:nth-of-type(1) {
            font-size: 0.15rem;
        }
        >div:nth-of-type(2) {
            position: relative;
            width: 100%;
            >img {
                display: block;
                width: 100%; height: auto;
            }
            > div {
                position: relative;
                margin-bottom: 0.13rem;
                >img:nth-of-type(1) {
                    display: block;
                    width: 100%; height: auto;
                }
                >img:nth-of-type(2) {
                    position: absolute;
                    left: 0; right: 0; bottom: -0.24rem;
                    margin: auto;
                    width: 0.27rem; height: 0.29rem;
                }
            }
        }
    }
    .bottom {
        position: fixed;
        bottom: 0; left: 0;
        width: 100%; height: 0.6rem;
        display: flex;
        align-items: center;
        background-color: #fff;
        >.backBtn {
            margin-left: 0.4rem;
            font-size: 0.16rem;
            color: #999;
        }
        >.openBtn {
            position: absolute;
            top: 0; bottom: 0; right: 0.2rem;
            margin: auto;
            width: 2.42rem; height: 0.38rem;
            border-radius: 0.2rem;
            background-color: #FF2C79;
            display: flex;
            align-items: center; justify-content: center;
            >div {
                font-size: 0.14rem; color: #fff; 
            }
        }
    }
}
</style>