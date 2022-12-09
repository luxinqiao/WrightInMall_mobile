<!--
 * 文件描述：登录
 * 创建人：赵志银
 * 创建时间：2019-03-14
-->
<template>
    <div id='main' ref='main'>
        <div id='phone'>
            <input type='number' placeholder='请输入手机号码' v-model='dataObj.phone' @input='inputPhone()'>
        </div>
        <div id='checkCode'>
            <input type='number' placeholder='请输入验证码' v-model='dataObj.checkCode' @input='inputCode()'>
            <span @click.stop='getCheckCode()' v-show="isGet">获取验证码</span>
            <span v-show = "isCount" class="time">{{content}}</span>
        </div>
        <div id='button' :class='isAgree?"active":"unactive"' @click='login()'>
            <span>登录</span>
        </div>
    </div>
</template>

<script type='text/javascript'>
    import {fullScreenHeight, trimStr, getBrowserType} from '@/utils/CommonUtils.js'
    import {phoneValid} from '@/utils/RegUtils.js'

    const browserType = getBrowserType()

    export default {
        data() {
            return {
                dataObj: {
                    phone: '',
                    checkCode: ''
                },
                isAgree: false,
                isGet : true,
                isCount : false,
                leftTime : 60,
                content : "获取验证码",
                isCanClick: true
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '登录'})
            this.$wm_data.setFooter = false
            fullScreenHeight(this.$refs.main)
        },
        methods: {
            /**
                输入手机号
                @param
                @return
             */
            inputPhone() {
                if (this.dataObj.phone.length > 11) {
                    this.dataObj.phone = this.dataObj.phone.slice(0, 11)
                }
                this.dataObj.phone = this.dataObj.phone.replace(/[^\d]/g,'')
            },
            /**
                输入验证码
                @param
                @return
             */
            inputCode() {
                if (this.dataObj.checkCode.length > 6) {
                    this.dataObj.checkCode = this.dataObj.checkCode.slice(0, 6)
                }
                this.dataObj.checkCode = this.dataObj.checkCode.replace(/[^\d]/g,'')
            },
            /**
                获取验证码
                @param
                @return
            */
            getCheckCode() {
                if (!this.validPhone()) {
                    return
                }
                this.$wm_dialog.stopLoading()
                this.$axios.post(common_request+'v1/commonservice/alysms', {
                    msg_type: 1,
                    phone: trimStr(this.dataObj.phone)
                })
                .then(response => {
                    if (response.code == 200) {
                        this.$wm_dialog.tip('验证码已发送')
                        this.isGet = !this.isGet
                        this.isCount = !this.isCount
                        if (!this.isCanClick) {
                            return
                        }
                        this.isCanClick = false
                        this.content = '重发('+this.leftTime+'s)'
                        let clock = window.setInterval(() => {
                            this.leftTime--
                            this.content = '重发('+this.leftTime+'s)'
                            if (this.leftTime <= 0) {
                                window.clearInterval(clock)
                                this.leftTime = 60
                                this.isCanClick = true
                                this.isGet = !this.isGet
                                this.isCount = !this.isCount
                            }
                        }, 1000)
                    }
                })
                .catch(response => {

                })
            },
            /**
                登录
                @param
                @return
            */
            login() {
                if (!this.validCheckCode()) {
                    return
                }
                this.$wm_dialog.stopLoading()
                if (browserType === 'wechat') {
                    this.$axios.post(lesson_request+'v2/wechat/bind', {
                        phone: trimStr(this.dataObj.phone),
                        code: trimStr(this.dataObj.checkCode),
                        unionid: sessionStorage.wm_wechat_unionid,
                        nickname: sessionStorage.wm_wechat_nickname,
                        headimgurl: sessionStorage.wm_wechat_headimgurl,
                        type: '1'
                    })
                    .then(response => {
                        if (response.code == 200) {
                            localStorage.wm_token = response.data.token
                            this.$wm_dialog.tip('登录成功', ()=>{
                                history.back(-1)
                            })
                        }
                    })
                    .catch(response => {

                    })
                } else if (browserType === 'browser') {
                    this.$axios.post(rih_request+'API/V1/LogForToken/validIdenfifyCodeByTelForLogin', {
                        telNumber: trimStr(this.dataObj.phone),
                        identifyCode: trimStr(this.dataObj.checkCode)
                    })
                    .then(response => {
                        if (response.code == 200) {
                            localStorage.wm_token = response.data.Token
                            this.$wm_dialog.tip('登录成功', ()=>{
                                history.back(-1)
                            })
                        }
                    })
                    .catch(response => {

                    })
                }
            },
            /**
                校验-手机号
                @param
                @return {Boolean} 是否校验通过
            */
            validPhone() {
                if (trimStr(this.dataObj.phone) === '') {
                    this.$wm_dialog.tip('请输入手机号码')
                    return false
                }
                if (!phoneValid(this.dataObj.phone)) {
                    this.$wm_dialog.tip('请输入正确的手机号码')
                    return false
                }
                return true
            },
            /**
                校验-验证码
                @param
                @return {Boolean} 是否校验通过
            */
            validCheckCode() {
                if (!this.validPhone()) {
                    return false
                }
                if (trimStr(this.dataObj.checkCode) === '') {
                    this.$wm_dialog.tip('请输入验证码')
                    return false
                }
                return true
            }
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        background-color: #ffb2d2;
        background: url(../../../assets/images/sys/login/bgs.png);
        background-size: 100% auto;
        -moz-background-size:100% 100%;
        width: 100%; height: 100%;
    }
    #phone {
        position: absolute;
        top: 4.35rem;  left: 0; right: 0;
        width: 75%; height: 0.44rem;
        margin: auto;
        >input {
            position: absolute;
            width: 100%;
            height: 0.44rem;
            padding: 0 0.22rem;
            box-sizing: border-box;
            border-radius: 0.22rem;
            border: none;
            background-color: #fff;
            font-size: 0.14rem;
        }
    }
    #checkCode {
        position: absolute;
        top: 4.85rem; left: 0; right: 0;
        width: 75%; height: 0.44rem;
        margin: auto;
        >input {
            position: absolute;
            height: 0.44rem;
            padding: 0 0.22rem;
            width: 55%;
            border: none;
            background-color: #fff;
            border-radius: 0.22rem;
            font-size: 0.14rem;
        }
        >span {
            position: absolute;
            right: 0;
            height: 0.44rem;
            width: 40%;
            text-align: center;
            border-radius: 0.22rem;
            line-height: 0.44rem;
            color: #fff;
            background-color: #FF2C7D;
            font-size: 0.15rem;
        }
    }
    #button {
        position: absolute;
        top: 5.35rem;  left: 0; right: 0;
        width: 75%; height: 0.44rem;
        margin: auto;
        border-radius: 0.22rem;
        background-color: #FF2C7D;
        >span {
            position: absolute;
            width: 100%; height: 0.44rem;
            text-align: center; line-height: 0.44rem;
            color: #fff;
            font-size: 0.14rem;
        }
    }
</style>
