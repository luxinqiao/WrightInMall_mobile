<!--
 * 文件描述：登录
 * 创建人：赵志银
 * 创建时间：2020-04-17
-->
<template>
    <div id='main' ref='main'>
        <div class='logo'>
            <img src='./images/result/logo.png'>
            <span>欢迎来到澜渟</span>
        </div>
        <div class='phone'>
            <div>手机号</div>
            <div id='phone'>
                <input type='number' placeholder='请输入手机号码' v-model='phone' oninput="if(value.length>11)value=value.slice(0,11);value=value.replace(/[^\d]/g,'') ">
            </div>
        </div>
        <div id='button' @click='login()'>
            <span>登录</span>
        </div>
        <div class='mesg' >
            <div>未注册账号将自动注册并登录，登录即代表您已同意<span @click='goUserAgreement()'>《用户协议》</span></div>
            <div>版本号:1.0.0</div>
        </div>
    </div>
</template>

<script>
import {getBrowserType, isEmpty, trimStr, fullScreenHeight, getAppType} from '@/utils/CommonUtils.js'
import {phoneValid} from '@/utils/RegUtils.js'

export default {
    data() {
        return {
            browserType: getBrowserType(),
            phone: ''
        }
    },
    mounted() {
        this.$wm_data.setHeader({title: '登录'})
        this.$wm_data.setFooter = false
        fullScreenHeight(this.$refs.main)
    },
    methods:{
        /**
            用户协议
            @param
            @return 
        */
        goUserAgreement() {
            this.$router.push({path: '../../my/userAgreement'})
        },
        /**
            校验-手机号
            @param
            @return {Boolean} 是否校验通过
        */
        validPhone() {
            if (trimStr(this.phone) === '') {
                this.$wm_dialog.tip('请输入手机号码')
                return false
            }
            if (!phoneValid(this.phone)) {
                this.$wm_dialog.tip('请输入正确的手机号码')
                return false
            }
            return true
        },

        /**
            登录
            @param
            @return
        */
        login() {
            if (!this.validPhone()) {
                return
            }
            this.$axios.post(rih_request+'API/V1/LogForToken/validIdenfifyCodeByTelForLogin', {
                telNumber: trimStr(this.phone),
                login_type: '1'
            })
            .then(response => {
                if (response.code == 200) {
                    localStorage.token = response.data.Token
                    localStorage.phone = trimStr(this.phone)
                    history.back(-1)
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
    position: absolute;
    bottom: 0; left: 0; right: 0; top: 0;
    background-color: #fff;
    width: 100%; height: 100%;
    padding: 0 0.16rem;
    >.logo {
        display: flex;
        align-items: center;
        padding: 0.56rem 0 0.67rem 0;
        height: 0.37rem;
        >img {
            display: block;
            width: 0.26rem; height: 0.37rem;
            margin-right: 0.06rem;
        }
        >div {
            font-size: 0.26rem; font-weight: bold;
        }
    }
    >.phone {
        position: relative;
        >div:nth-of-type(1) {
            height: 0.18rem;
            line-height: 0.18rem;
            font-size: 0.13rem;
        }
        >div:nth-of-type(2) {
            width: 100%; height: 0.4rem;
            line-height: 0.4rem;
            border-bottom: 1px solid #F4F4F4;
            >input {
                display: block;
                width: 100%; height: 0.4rem;
                line-height: 0.4rem;
                font-size: 0.16rem;
                border: none;
            }
        }
    }
    >#button {
        position: relative;
        margin-top: 0.5rem;
        width: 100%; height: 0.47rem;
        border-radius: 0.25rem;
        background-color: #FF2C79;
        display: flex;
        align-items: center; justify-content: center;
        >span {
            font-size: 0.16rem; color: #fff;
        }
    }
    >.mesg {
        position: absolute;
        bottom: 0.12rem; left: 0;
        width: 100%;
        >div {
            text-align: center;
            font-size: 0.12rem; color: #999;
        }
        >div:nth-of-type(1) {
            margin-bottom: 0.04rem;
            >span {
                font-size: 0.12rem; color: #7694CF;
            }
        }
    }
}
</style>