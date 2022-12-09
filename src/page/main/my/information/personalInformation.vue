<!--
 * 文件描述：个人信息
 * 创建人：赵志银
 * 创建时间：2020-10-29
-->
<template>
    <div>
        <div class='content' v-if='!isEmpty(useInfoObj)'>
            <div class='list' @click='handleImage'>
                <span>头像</span>
                <uploadImg  ref="uploadImg" @getResult='changeImg'></uploadImg>
                <img :src='imgUrl' class='img'>
                <img src='@/assets/images/my/order/detail/right.png'>
            </div>
            <div class='list'>
                <span>昵称</span>
                <input v-model='name' @blur='changeNickName' placeholder='请输入您的昵称' maxlength='12' oninput='if(value.length>12)value=value.slice(0,12);'>
            </div>
            <div class='list' v-if='useInfoObj.uiRealNameAuthentication==2'>
                <span>姓名</span>
                <span>{{useInfoObj.id_realname}}</span> 
            </div>
            <div class='list' v-if='useInfoObj.uiRealNameAuthentication!=2'>
                <span>姓名</span>
                <input v-model='useInfoObj.id_realname' placeholder='请输入您的姓名' bindblur='changeName' maxlength='12' oninput='if(value.length>12)value=value.slice(0,12);'>
            </div>

            <div class='list'>
                <span>手机号</span>
                <span>{{phone}}</span>
            </div>

            <div class='list' @click='sexObj.isShow=!sexObj.isShow'>
                <span>性别</span>
                <span v-if='useInfoObj.uiGender==1'>男</span>
                <span v-if='useInfoObj.uiGender==2'>女</span>
                <span v-if='useInfoObj.uiGender!=2&&useInfoObj.uiGender!=1' class='msg'>请选择您的性别</span>
                <img src='@/assets/images/my/order/detail/right.png'>
            </div>

            <div class='list'  @click='birthObj.isShow=!birthObj.isShow'>
                <span>出生日期</span>
                <span v-if='!isEmpty(useInfoObj.uiBirthDate)'>{{useInfoObj.uiBirthDate}}</span>
                <span v-if='isEmpty(useInfoObj.uiBirthDate)'>请选择您的出生日期</span>
                <img src='@/assets/images/my/order/detail/right.png'>
            </div>

            <div class='list city' @click='zoneObj.isShow=!zoneObj.isShow'>
                <span>地区</span>
                <span class='text_ellipsis' v-if='!isEmpty(useInfoObj.cityName)'>{{useInfoObj.cityName}}</span>
                <span class='msg' v-if='isEmpty(useInfoObj.cityName)'>请选择您的地址</span>
                <img src='@/assets/images/my/order/detail/right.png'>
            </div>

            <div class='list'>
                <span>身高</span>
                <div>
                    <input v-model='useInfoObj.uiHeight' placeholder='请填写具体身高' @blur='changeStature' type='number' maxlength='3' oninput='if(value.length>3)value=value.slice(0,3);'>
                    <span>cm</span>
                </div>
            </div>
            <div class='list'>
                <span>体重</span>
                <div>
                    <input v-model='useInfoObj.uiWeight' placeholder='请填写具体体重' @blur='changeWeight' type='number' maxlength='4' oninput='if(value.length>4)value=value.slice(0,4);'>
                    <span>kg</span>
                </div>
            </div>

            <div class='list' @click='birthChildObj.isShow=!birthChildObj.isShow'>
                <span>分娩次数</span>
                <span>{{birthChildObj.desc}}</span>
                <img src='@/assets/images/my/order/detail/right.png'>
            </div>

            <div class='list' v-if='(birthChildObj.index!=deliverCount.UNFERTILITY)&&(birthChildObj.index!=deliverCount.NOFILED)' @click='bcDateObj.isShow=!bcDateObj.isShow'>
                <span>最近分娩时间</span>
                <span>{{useInfoObj.delivery_date}}</span>
                <img src='@/assets/images/my/order/detail/right.png'>
            </div>

            <div class='list' @click='misObj.isShow=!misObj.isShow'>
                <span>流产次数</span>
                <span>{{misObj.desc}}</span>
                <img src='@/assets/images/my/order/detail/right.png'>
            </div>

            <div class='list' v-if='(misObj.index!=abortionCount.NONABORTION)&&(misObj.index!=abortionCount.NOFILED)' @click='misDateObj.isShow=!misDateObj.isShow'>
                <span>最近流产时间</span>
                <span>{{useInfoObj.abortion_date}}</span>
                <img src='@/assets/images/my/order/detail/right.png'>
            </div>

            <div class='list_area sign' @click='goSignature(useInfoObj.sign)'>
                <span>个性签名</span>
                <img src='@/assets/images/my/order/detail/right.png'>
                <div v-if='!isEmpty(useInfoObj.sign)'>{{useInfoObj.sign}}</div>
                <div v-if='isEmpty(useInfoObj.sign)' class='none'>请输入个人签名</div>
            </div>
            <div class='list_area' @click='goIntroduction(useInfoObj.uiRemark)'>
                <span>个人简介</span>
                <img src='@/assets/images/my/order/detail/right.png'>
                <div v-if='!isEmpty(useInfoObj.uiRemark)'>{{useInfoObj.uiRemark}}</div>
                <div v-if='isEmpty(useInfoObj.uiRemark)' class='none'>请输入个人简介</div>
            </div>
        </div>

        <van-popup v-model='sexObj.isShow' position='bottom' :style="{ height: '40%' }">
            <van-picker
                show-toolbar
                title='性别'
                :columns='sexObj.dataArr'
                @cancel='sexObj.isShow=!sexObj.isShow'
                @confirm='changeSex'
                ref='sex'
            />
        </van-popup>

        <van-popup v-model='birthObj.isShow' position='bottom' :style="{ height: '40%' }">
            <van-datetime-picker
                v-model='birthObj.data'
                :min-date='startDate'
                type='date'
                title='出生日期'
                @cancel='birthObj.isShow=!birthObj.isShow'
                @confirm='changeBirthDate'
            />
        </van-popup>

        <van-popup v-model='zoneObj.isShow' position='bottom' :style="{ height: '40%' }">
            <van-picker
                show-toolbar
                title='地址'
                :columns='zoneObj.dataArr'
                @change='changeAddress'
                @cancel='zoneObj.isShow=!zoneObj.isShow'
                @confirm='confirmAddress'
                ref='address'
            />
        </van-popup>

        <van-popup v-model='birthChildObj.isShow' position='bottom' :style="{ height: '40%' }">
            <van-picker
                show-toolbar
                title='分娩次数'
                :columns='birthChildObj.dataArr'
                @cancel='birthChildObj.isShow=!birthChildObj.isShow'
                @confirm='changeBirthChild'
                ref='gp'
            />
        </van-popup>

        <van-popup v-model='bcDateObj.isShow' position='bottom' :style="{ height: '40%' }">
            <van-datetime-picker
                v-model='bcDateObj.data'
                :min-date='startDate'
                type='date'
                title='最近分娩时间'
                @cancel='bcDateObj.isShow=!bcDateObj.isShow'
                @confirm='changeBirthTime'
            />
        </van-popup>

        <van-popup v-model='misObj.isShow' position='bottom' :style="{ height: '40%' }">
            <van-picker
                show-toolbar
                title='流产次数'
                :columns='misObj.dataArr'
                @cancel='misObj.isShow=!misObj.isShow'
                @confirm='changeMisCount'
                ref='mis'
            />
        </van-popup>
        
        <van-popup v-model='misDateObj.isShow' position='bottom' :style="{ height: '40%' }">
            <van-datetime-picker
                v-model='misDateObj.data'
                :min-date='startDate'
                type='date'
                title='最近流产时间'
                @cancel='misDateObj.isShow=!misDateObj.isShow'
                @confirm='changeMisTime'
            />
        </van-popup>

    </div>
</template>

<script type='text/javascript'>
    import {isEmpty, dateFormat, trimStr, getLocalToken} from '@/utils/CommonUtils.js'
    import {deliverCount, getDeliverCount, abortionCount, getAbortionCount, getRealName} from '@/utils/DictUtils.js'
    import uploadImg from '@/components/uploadImg'

    import Vue from 'vue'
    import { Picker, Popup , DatetimePicker, Uploader} from 'vant'
    import 'vant/lib/picker/style'
    import 'vant/lib/popup/style'
    import 'vant/lib/datetime-picker/style'
    import 'vant/lib/uploader/style'
    Vue.use(Picker)
    Vue.use(Popup)
    Vue.use(DatetimePicker)
    Vue.use(Uploader)

    export default {
        data() {
            return {
                useInfoObj: {},
                imgUrl: require('@/assets/images/my/index/avatar.png'),
                name: '',
                sexObj: {
                    isShow: false,
                    dataArr: ['男', '女'],
                },
                startDate: new Date('1900/1/1'),
                birthObj: {
                    isShow: false,
                    data: null,
                },
                birthChildObj: {    //生产
                    isShow: false,
                    dataArr: ['未生育', '一胎', '二胎', '三胎及以上'],
                    desc: '',
                    index: 0,
                },
                bcDateObj: {
                    isShow: false,
                    data: null,
                },
                misObj: {
                    isShow: false,
                    dataArr: ['0次', '1次', '2次', '3次及以上'],
                    index: 0,
                    desc: '',
                },
                misDateObj: {
                    isShow: false,
                    data: null,
                },
                zoneObj: {
                    isShow: false,
                    selectText: '请选择',
                    dataArr: [
                        {
                            values: [],
                            defaultIndex: 0,
                        },
                        {
                            values: [],
                            defaultIndex: 0,
                        },
                        {
                            values: [],
                            defaultIndex: 0,
                        },
                    ],
                    provinceArr: [],
                    cityArr: [],
                    areaArr: []
                },
                phone: '',
                isEmpty: isEmpty,
                deliverCount, 
                getDeliverCount, 
                abortionCount, 
                getAbortionCount, getRealName
            }
        },
        created() {
            this.initProvince()
        },
        mounted() {
            this.$wm_data.setHeader({title: '个人信息'})
            this.$wm_data.setFooter = false
            this.initData()
        },
        methods: {
            /**
             * 初始数据
             * @param
             * @return
             */
            initData() {
                this.$axios.post(rih_request + 'API/V1/Login/getUserInfo', {
                    token: getLocalToken()
                }).then(response => {
                    if(response.code == 200) {
                        let infoData = response.data.UserInfo
                        /**** 初始化出生日期****/
                        infoData.uiBirthDate = infoData.uiBirthDate.split(' ')[0]
                        this.birthObj.data = new Date(infoData.uiBirthDate)
                        /**** 初始化昵称 ****/
                        if (isEmpty(infoData.uiNickName) && !isEmpty(infoData.WeChatIDName)) {
                            this.name = infoData.WeChatIDName
                        } else {
                            this.name = infoData.uiNickName
                        }
                        /**** 初始化头像 ****/
                        if (isEmpty(infoData.uiHeadImageUrl) && !isEmpty(infoData.weChatHeadImageUrl)) {
                            this.imgUrl = infoData.weChatHeadImageUrl
                        } else if (!isEmpty(infoData.uiHeadImageUrl)){
                            if (infoData.uiHeadImageUrl.indexOf('http') == -1) {
                                infoData.uiHeadImageUrl = 'https://rightinhome.oss-cn-hangzhou.aliyuncs.com/' + infoData.uiHeadImageUrl
                            }
                            this.imgUrl =  infoData.uiHeadImageUrl
                        }
                        /**** 初始化身高 ****/
                        infoData.uiHeight = (!isEmpty(infoData.uiHeight)&&infoData.uiHeight!=0)?infoData.uiHeight:""

                        /**** 初始化体重 ****/
                        infoData.uiWeight = (!isEmpty(infoData.uiWeight)&&infoData.uiWeight!=0)?infoData.uiWeight:""
                        
                        /**** 初始化分娩次数 ****/
                        this.birthChildObj.desc =  getDeliverCount(infoData.gp)
                        this.birthChildObj.index = infoData.gp
                        /**** 初始化分娩时间 ****/
                        if ((infoData.gp !== deliverCount.TIRE) && (infoData.gp !== deliverCount.NOFILED)) {
                            infoData.delivery_date = infoData.delivery_date.split(' ')[0]
                            this.bcDateObj.data = new Date(infoData.delivery_date)
                        }
                        /**** 初始化流产次数 ****/
                        this.misObj.desc = getAbortionCount(infoData.abortion_num)
                        this.misObj.index = infoData.abortion_num
                        /**** 初始化流产时间 ****/
                        if ((infoData.abortion_num !== abortionCount.NONABORTION) && (infoData.abortion_num !== abortionCount.NOFILED)) {
                            infoData.abortion_date = infoData.abortion_date.split(' ')[0]
                            this.misDateObj.data = new Date(infoData.abortion_date)
                        }
                        this.useInfoObj = infoData
                        this.phone =  infoData.uiTelephone
                    }
                }).catch(response => {

                })
            },

            /**
             * 上传头像
             * @param
             * @return
             */
            handleImage() {
                this.$refs.uploadImg.addImg()
            },

            /**
             * 修改头像
             * @param {object} 返回的数据
             * @return
             */
            changeImg(e) {
                this.imgUrl = e.url
                this.$axios.post(rih_request + 'API/V1/UserInfo/updateUserInfo', {
                    token: getLocalToken(),
                    uiHeadImageUrl: e.url
                }).then(response => {
                    if(response.code == 200) {
                        this.initData()
                    }
                }).catch(response => {

                })
            },

            /**
             * 修改昵称
             * @param
             * @return
             */
            changeNickName() {
                if (isEmpty(trimStr(this.name))) {
                    this.name = ''
                    this.$wm_dialog.tip('修改昵称不可为空')
                    this.initData()
                    return
                }
                this.$axios.post(rih_request + 'API/V1/UserInfo/setUserNickName', {
                    token: getLocalToken(),
                    uiNickName: this.name
                }).then(response => {
                    if(response.code == 200) {
                        this.initData()
                    }
                }).catch(response => {

                })
            },

            /**
             * 修改姓名
             * @param
             * @return
             */
            changeName() {
                if (isEmpty(trimStr(this.useInfoObj.id_realname))) {
                    this.useInfoObj.id_realname = ''
                    this.$wm_dialog.tip('修改姓名不可为空')
                    this.initData()
                    return
                }
                this.$axios.post(rih_request + 'API/V1/UserInfo/setUserRealName', {
                    token: getLocalToken(),
                    uiRealName: this.useInfoObj.id_realname
                }).then(response => {
                    if(response.code == 200) {
                        this.initData()
                    }
                }).catch(response => {

                })
            },
            /**
             * 修改性别
             * @param {Array}value 性别选中值
             * @param {Array}index 性别选中值下标
             * @return
             */
            changeSex(value, index) {
                this.sexObj.isShow = false
                this.$axios.post(rih_request + 'API/V1/UserInfo/updateUserInfo', {
                    token: getLocalToken(),
                    uiGender: index+1
                }).then(response => {
                    if(response.code == 200) {
                        this.useInfoObj.uiGender = index+1 
                        this.initData()
                    }
                }).catch(response => {

                })
            },
            /**
             * 修改出生日期
             * @param {string} value 出生日期
             * @return
             */
            changeBirthDate(value) {
                this.birthObj.isShow = false
                this.$axios.post(rih_request + 'API/V1/UserInfo/updateUserInfo', {
                    token: getLocalToken(),
                    uiBirthDate: value
                }).then(response => {
                    if(response.code == 200) {
                        this.initData()
                    }
                }).catch(response => {

                })
            },

            /**
             * 修改身高
             * @param
             * @return
             */
            changeStature() {
                if (isEmpty(trimStr(this.useInfoObj.uiHeight))) {
                    this.useInfoObj.uiHeight = ''
                    this.$wm_dialog.tip('修改身高不可为空')
                    this.initData()
                    return
                } else if (Number(this.useInfoObj.uiHeight) > 255) {
                    this.$wm_dialog.tip('请输入正确的身高')
                    this.initData()
                    return
                }
                this.$axios.post(rih_request + 'API/V1/UserInfo/updateUserInfo', {
                    token: getLocalToken(),
                    uiHeight: this.useInfoObj.uiHeight
                }).then(response => {
                    if(response.code == 200) {
                        this.initData()
                    }
                }).catch(response => {

                })
            },

            /**
             * 修改体重
             * @param
             * @return
             */
            changeWeight() {
                if (isEmpty(trimStr(this.useInfoObj.uiWeight))) {
                    this.useInfoObj.uiWeight = ''
                    this.$wm_dialog.tip('修改体重不可为空')
                    this.initData()
                    return
                } else if (Number(this.useInfoObj.uiWeight) > 255) {
                    this.$wm_dialog.tip('请输入正确的体重')
                    this.initData()
                    return
                }
                this.$axios.post(rih_request + 'API/V1/UserInfo/updateUserInfo', {
                    token: getLocalToken(),
                    uiWeight: this.useInfoObj.uiWeight
                }).then(response => {
                    if(response.code == 200) {
                        this.initData()
                    }
                }).catch(response => {

                })
            },
            
            // 地区
            /**
                初始化省
                @param
                @return
            */
            initProvince() {
                this.$axios.post(live_request+'v1/cn/province', {})
                .then(response => {
                    if (response.code == 200) {
                        this.zoneObj.provinceArr = response.data
                        this.zoneObj.cityArr =  []
                        this.zoneObj.areaArr =  []
                        this.zoneObj.dataArr[0].values =  this.convertNameArr(response.data)
                        this.zoneObj.dataArr[0].defaultIndex =  0
                        this.zoneObj.dataArr[1] =  []
                        this.zoneObj.dataArr[2] =  []
                        if (response.data.length > 0) {
                            this.initCity(response.data[0].code)
                        }
                        this.$refs.address.setColumnValues(0, this.convertNameArr(response.data))
                    }
                })
                .catch(response => {

                })
            },
            /**
                初始化市
                @param {String}provinceCode 省
                @return
            */
            initCity(provinceCode) {
                this.$wm_dialog.stopLoading()
                this.$axios.post(live_request+'v1/cn/city', {
                    pcode: provinceCode
                })
                .then(response => {
                    if (response.code == 200) {
                        this.zoneObj.cityArr = response.data
                        this.zoneObj.areaArr =  []
                        this.zoneObj.dataArr[1].values =  this.convertNameArr(response.data)
                        this.zoneObj.dataArr[1].defaultIndex =  0
                        this.zoneObj.dataArr[2] =  []
                        if (response.data.length > 0) {
                            this.initArea(response.data[0].code)
                        } else {
                            this.$refs.address.setColumnValues(2, [])
                        }
                        this.$refs.address.setColumnValues(1, this.convertNameArr(response.data))
                    }
                })
                .catch(response => {

                })
            },
            /**
                初始化区
                @param {String}cityCode 市
                @return 
            */
            initArea(cityCode) {
                this.$wm_dialog.stopLoading()
                this.$axios.post(live_request+'v1/cn/area', {
                    pcode: cityCode
                })
                .then(response => {
                    if (response.code == 200) {
                        this.zoneObj.areaArr = response.data
                        this.zoneObj.dataArr[2].values =  this.convertNameArr(response.data)
                        this.zoneObj.dataArr[2].defaultIndex =  0
                        this.$refs.address.setColumnValues(2, this.convertNameArr(response.data))
                    }
                })
                .catch(response => {

                })
            },
            /**
                抽离出名称数组
                @param {Array} arr 全数据数组
                @return {Array} 名称数组
            */
            convertNameArr(arr) {
                let nameArr = []
                for (let i = 0; i < arr.length; i++) {
                    nameArr.push(arr[i].name)
                }
                return nameArr
            },
            /**
                省市区切换
                @param {Object}picker picker对象
                @param {Array}value 省市区选中值
                @param {Array}index 省市区选中值下标
                @return
            */
            changeAddress(picker, value, index) {
                if(index == 0) {
                    this.initCity(this.getProvinceCode(value[0]))
                } else if(index == 1) {
                    this.initArea(this.getCityCode(value[1]))
                }
            },
            /**
                确认
                @param {Array}value 省市区选中值
                @param {Array}index 省市区选中值下标
                @return
            */
            confirmAddress(value, index) {
                let add = value[0]
                let code = this.getProvinceCode(value[0])
                if(!isEmpty(value[1])) {
                    add += value[1]
                    code = this.getCityCode(value[1])
                }
                if(!isEmpty(value[2])) {
                    add += value[2]
                    code = this.getAreaCode(value[2])
                }
                this.zoneObj.isShow = false
                this.zoneObj.selectText = add
                this.$axios.post(rih_request+'API/V1/UserInfo/userModifyArea', {
                    token: getLocalToken(),
                    where: code
                })
                .then(response => {
                    if (response.code == 200) {
                        this.initData()
                    }
                })
                .catch(response => {

                })
            },
            /**
                获取省编码
                @param {String}name 省名称
                @return {String} 省编码
            */
            getProvinceCode(name) {
                for (var i=0; i<this.zoneObj.provinceArr.length; i++) {
                    if (this.zoneObj.provinceArr[i].name === name) {
                        return this.zoneObj.provinceArr[i].code
                    }
                }
                return ''
            },
            /**
                获取市编码
                @param {String}name 市名称
                @return {String} 市编码
            */
            getCityCode(name) {
                for (var i=0; i<this.zoneObj.cityArr.length; i++) {
                    if (this.zoneObj.cityArr[i].name === name) {
                        return this.zoneObj.cityArr[i].code
                    }
                }
                return ''
            },
            /**
                获取区编码
                @param {String}name 区名称
                @return {String} 区编码
            */
            getAreaCode(name) {
                for (var i=0; i<this.zoneObj.areaArr.length; i++) {
                    if (this.zoneObj.areaArr[i].name === name) {
                        return this.zoneObj.areaArr[i].code
                    }
                }
                return ''
            },

            
            /**
             * 修改分娩次数
             * @param {Array}value 分娩次数选中值
             * @param {Array}index 分娩次数选中值下标
             * @return
             */
            changeBirthChild(value, index) {
                this.birthChildObj.isShow = false
                this.birthChildObj.index = index
                this.birthChildObj.desc = getDeliverCount(index)
                if (index == 0) {
                    this.$axios.post(rih_request + 'API/V1/UserInfo/updateUserInfo', {
                        token: getLocalToken(),
                        gp: 0,
                        delivery_date: ''
                    }).then(response => {
                        if(response.code == 200) {
                            this.initData()
                        }
                    }).catch(response => {

                    })
                } else if (index != 0 && !isEmpty(this.useInfoObj.delivery_date)) {
                    this.$axios.post(rih_request + 'API/V1/UserInfo/updateUserInfo', {
                        token: getLocalToken(),
                        gp: index,
                        delivery_date: this.useInfoObj.delivery_date
                    }).then(response => {
                        if(response.code == 200) {
                            this.initData()
                        }
                    }).catch(response => {

                    })
                }
            },

            /**
             * 修改分娩日期
             * @param {string} value 出生日期
             * @return
             */
            changeBirthTime(value) {
                this.bcDateObj.isShow = false
                this.$axios.post(rih_request + 'API/V1/UserInfo/updateUserInfo', {
                    token: getLocalToken(),
                    gp: this.birthChildObj.index ,
                    delivery_date: value
                }).then(response => {
                    if(response.code == 200) {
                        this.initData()
                    }
                }).catch(response => {

                })
            },

            /**
             * 修改流产次数
             * @param {Array}value 流产次数选中值
             * @param {Array}index 流产次数选中值下标
             * @return
             */
            changeMisCount(value, index) {
                this.misObj.isShow = false
                this.misObj.index = index
                this.misObj.desc = getAbortionCount(index)
                if (index == 0) {
                    this.$axios.post(rih_request + 'API/V1/UserInfo/updateUserInfo', {
                        token: getLocalToken(),
                        abortion_num: 0,
                        abortion_date: ''
                    }).then(response => {
                        if(response.code == 200) {
                            this.initData()
                        }
                    }).catch(response => {

                    })
                } else if (index != 0 && !isEmpty(this.useInfoObj.abortion_date)) {
                    this.$axios.post(rih_request + 'API/V1/UserInfo/updateUserInfo', {
                        token: getLocalToken(),
                        abortion_num: index,
                        abortion_date: this.useInfoObj.abortion_date
                    }).then(response => {
                        if(response.code == 200) {
                            this.initData()
                        }
                    }).catch(response => {

                    })
                }
            },

            /**
             * 修改流产时间
             * @param {string} value 流产时间
             * @return
             */
            changeMisTime(value) {
                this.misDateObj.isShow = false
                this.$axios.post(rih_request + 'API/V1/UserInfo/updateUserInfo', {
                    token: getLocalToken(),
                    abortion_num: this.misObj.index,
                    abortion_date: value
                }).then(response => {
                    if(response.code == 200) {
                        this.initData()
                    }
                }).catch(response => {

                })
            },

            /**
                个性签名
                @param
                @return
            */
            goSignature(sign) {
                this.$router.push({path: '../my/personalInfo/change', query: { value: sign,type:'sign' }})
            },
            /**
                个人简介
                @param
                @return
            */
            goIntroduction(remark) {
                this.$router.push({path: '../my/personalInfo/change', query: { value: remark, type:'remark'}})
            }
        },
        components: {
            uploadImg
        }
    }
</script>

<style lang='scss' scoped>
    .content {
        position: relative;
        padding-bottom: 0.5rem;
        background-color: #fafafa;
        .list {
            position: relative;
            height: 0.5rem; line-height: 0.5rem;
            background-color: #fff;
            span:nth-child(1) {
                position: absolute;
                top: 0; bottom: 0; left: 0.16rem;
                margin: auto;
                font-size: 0.16rem;
            }
            >img:last-child {
                position: absolute;
                top: 0; bottom: 0; right: 0.16rem;
                margin: auto;
                width: 0.06rem; height: 0.09rem;
            }
            .img {
                position: absolute;
                top: 0; bottom: 0; left: 1.36rem;
                margin: auto;
                width: 0.3rem; height: 0.3rem;
                border-radius: 50%;
                background-color: #D8D8D8;
            }
            >span:nth-child(2) {
                position: absolute;
                top: 0; bottom: 0; left: 1.36rem;
                margin: auto;
                width: 2rem;
                font-size: 0.16rem;
            }
            >input {
                position: absolute;
                top: 0; bottom: 0; left: 1.36rem;
                margin: auto;
                font-size: 0.16rem;
                border: none; outline: none;
            }
            >div {
                display: flex;
                position: absolute;
                top: 0; bottom: 0; left: 1.36rem;
                margin: auto;
                width: 1.2rem; height: 0.5rem;
                line-height: 0.5rem;
                font-size: 0.14rem;
                input {
                    height: 0.5rem; width: auto;
                    line-height: 0.5rem;
                    border: none; outline: none;
                }
            }
        }
        >div:nth-child(1) {
            margin-bottom: 0.12rem;
        }
        .city, .auth {
            margin-bottom: 0.12rem;
        }
        .list_area {
            position: relative;
            min-height: 0.5rem;
            background-color: #fff;
            span {
                position: absolute;
                top: 0.14rem; left: 0.16rem;
                font-size: 0.16rem;
            }
            img {
                position: absolute;
                top: 0.2rem; right: 0.16rem;
                width: 0.06rem; height: 0.09rem;
            }
            div {
                padding: 0.14rem 0.38rem 0.14rem 1.36rem;
                line-height: 0.2rem;
                font-size: 0.14rem; 
            }
        }
        .sign {
            margin-top: 0.12rem;
        }
    }
    .none{
        font-size: 0.16rem; color: #999;
    }
    .msg {
        color: #999;
    }

</style>
