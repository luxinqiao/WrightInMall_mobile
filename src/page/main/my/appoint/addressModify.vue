<!--
 * 文件描述：修改地址
 * 创建人：赵志银
 * 创建时间：2019-03-14
-->
<template>
    <div id='main' ref='main'>
        <div class='list_box'>
            <div class='list wm_margin'>
                <span class='list_tit'>姓名</span>
                <input type='text' placeholder='请填写收货人姓名' v-model='name' oninput="if(value.length>20)value=value.slice(0,20);">
            </div>
            <div class='list wm_margin'>
                <span class='list_tit'>手机号码</span>
                <input type='number' placeholder='请填写手机号码' v-model='phone' oninput="if(value.length>11)value=value.slice(0,11);value=value.replace(/[^\d]/g,'')" maxlength='11'>
            </div>

            <div class='list wm_margin list_zone' @click='zoneObj.isShow=!zoneObj.isShow'>
                <span class='list_tit'>所在地区</span>
                <span :class='["list_con_zone",{"color_gray":zoneObj.selectText=="请选择地区"}]'>{{zoneObj.selectText}}</span>
                <img src='@/assets/images/my/address/arrow-right.png'>
            </div>

            <div class='list last_list wm_margin'>
                <span class='list_tit'>详细地址</span>
                <textarea placeholder='请填写街道、楼牌号等' v-model='content' oninput="if(value.length>50)value=value.slice(0,50);"></textarea>
            </div>

            <div class='tip wm_margin'>收货人姓名请放心填写，已保证您正常收货，为保证您的个人隐私，快递外包装不会注明物品内容。</div>
        </div>

        <div class='dele_btn wm_padding' @click='deleteAddress'>
            <span class='wm_color_main'>删除收货地址</span>
        </div>

        <div class='btn'>
            <span @click='edit' class='wm_bgcolor_main'>保存</span>
        </div>
        <van-popup v-model='zoneObj.isShow' position='bottom' :style="{ height: '40%' }">
            <van-picker
                show-toolbar
                title='地址'
                :columns='zoneObj.dataArr'
                @change='onChange'
                @cancel='zoneObj.isShow=!zoneObj.isShow'
                @confirm='onConfirm'
                ref='picker'
            />
        </van-popup>
    </div>
</template>

<script type='text/javascript'>
    import {fullScreenHeight, trimStr, getLocalToken, isEmpty } from '@/utils/CommonUtils.js'
    import {phoneValid} from '@/utils/RegUtils.js'
    import Vue from 'vue'
    import { Picker, Popup } from 'vant'
    import 'vant/lib/picker/style'
    import 'vant/lib/popup/style'
    Vue.use(Picker).use(Popup)

    export default {
        data() {
            return {
                code: '',
                name: '',
                phone: '',
                content: '',
                isDefault: false,
                zoneObj: {
                    isShow: false,
                    selectText: '请选择地区',
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
                isEmpty: isEmpty 
            }
        },
        created() {
            this.initProvince()
        },
        mounted() {
            this.$wm_data.setHeader({title: '修改地址'})
            this.$wm_data.setFooter = false
            fullScreenHeight(this.$refs.main)
            //初始化地址信息
            this.initAddressData()
        },
        methods: {
            /**
                初始化地址
                @param
                @return 
            */
            initAddressData() {
                this.code = this.$route.query.code
                this.name = this.$route.query.name
                this.phone = this.$route.query.call
                this.zoneObj.selectText = this.$route.query.zone
                this.content = this.$route.query.content
                var default_flag = this.$route.query.is_default
            },
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
                        this.$refs.picker.setColumnValues(0, this.convertNameArr(response.data))
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
                            this.$refs.picker.setColumnValues(2, [])
                        }
                        this.$refs.picker.setColumnValues(1, this.convertNameArr(response.data))
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
                        this.$refs.picker.setColumnValues(2, this.convertNameArr(response.data))
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
            onChange(picker, value, index) {
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
            onConfirm(value, index) {
                let add = value[0]
                if(!isEmpty(value[1])) {
                    add += value[1]
                }
                if(!isEmpty(value[2])) {
                    add += value[2]
                }
                this.zoneObj.isShow = false
                this.zoneObj.selectText = add
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
             修改
                @param
                @return
            */
            edit() {
                if (!this.valid()) {
                    return
                }
                this.$axios.post(common_request+'v1/address/modify', {
                    token: getLocalToken(),
                    code: this.code,
                    contact_name: this.name,
                    contact_call: this.phone,
                    zone: this.zoneObj.selectText,
                    content: this.content
                }).then(response => {
                if (response.code == 200) {
                    this.$wm_dialog.tip('修改成功', ()=>{
                        history.back(-1);
                    })
                }else {
                    this.$wm_dialog.tip('修改失败');
                }
                })
            },
            /**
             删除地址
                @param
                @return
            */
            deleteAddress() {
                this.$wm_dialog.confirm('确定删除该地址吗？', '确定', ()=>{
                    this.$axios.post(common_request+'v1/address/delete', {
                        token: getLocalToken(),
                        code: this.code
                    }).then(response => {
                        if (response.code == 200) {
                            if(sessionStorage.wm_addressCode == this.code) {
                                sessionStorage.wm_addressCode = ''
                            }
                            this.$wm_dialog.tip('删除成功', ()=>{
                                history.back(-1);
                            })
                        }else {
                            this.$wm_dialog.tip('删除失败');
                        }
                    })
                }, '取消', ()=>{

                })
            },
            /**
             校验
                @param
                @return
            */
            valid() {
                if (trimStr(this.name) === '') {
                    this.$wm_dialog.tip('请填写收货人姓名')
                    return false
                }
                if (trimStr(this.phone) === '') {
                    this.$wm_dialog.tip('请填写手机号码')
                    return false
                }
                if (!phoneValid(this.phone)) {
                    this.$wm_dialog.tip('请填写正确的手机号码')
                    return false
                }
                if (trimStr(this.zoneObj.selectText) === '请填写省、市、地区') {
                    this.$wm_dialog.tip('请选择地区')
                    return false
                }
                if (trimStr(this.content) === '') {
                    this.$wm_dialog.tip('请填写详细地址')
                    return false
                }
                if (trimStr(this.content).length<5) {
                    this.$wm_dialog.tip('详细地址长度需要在5-50个字符')
                    return false
                }
                return true
            },
        },
        watch: {
            name(val){
                this.name = val.replace(/(\ud83c[\udc00-\udfff])|(\ud83d[\udc00-\udfff])|(\ud83e[\udc00-\udfff])|[\u2100-\u32ff]|[\u0030-\u007f][\u20d0-\u20ff]|[\u0080-\u00ff]/g,'')
            },
            content(val){
                this.content = val.replace(/(\ud83c[\udc00-\udfff])|(\ud83d[\udc00-\udfff])|(\ud83e[\udc00-\udfff])|[\u2100-\u32ff]|[\u0030-\u007f][\u20d0-\u20ff]|[\u0080-\u00ff]/g,'')
            },
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        height: 100%;
        background-color: #fafafa;
        .list_box {
            position: relative;
            padding-bottom: 0.16rem;
            background-color: #fff;
            .list {
                position: relative;
                height: 0.5rem;
                border-bottom: 1px solid #efefef;
                box-sizing: content-box;
                .list_tit {
                    position: absolute;
                    top: 0; left: 0;
                    width: 0.8rem; height: 0.5rem;
                    line-height: 0.5rem;
                    font-size: 0.14rem;
                    color: #666;
                }
                input {
                    position: absolute;
                    top: 0; left: 0.8rem; right: 0;
                    height: 0.5rem;
                    line-height: 0.5rem;
                    border: none; outline: none;
                    font-size: 0.14rem;
                    color: #000;
                }
                ::-webkit-input-placeholder{
                    color: #999;
                }
                ::-moz-placeholder{
                    color: #999;
                }
                :-moz-placeholder{
                    color: #999;
                }
                :-ms-input-placeholder{
                    color: #999;
                }
                textarea {
                    position: absolute;
                    top: 0; left: 0.8rem; right: 0;
                    width: 2.63rem; height: 0.9rem;
                    line-height: 0.2rem;
                    padding: 0.17rem 0;
                    border: none; resize: none;
                    font-size: 0.14rem;
                    color: #000;
                    resize: none;
                }
                img {
                    position: absolute;
                    top: 0.02rem; bottom: 0; right: 0;
                    margin: auto;
                    width: 0.15rem; height: 0.15rem;
                }
            }
            .list_zone {
                min-height: 0.5rem; height: auto;
                .list_con_zone {
                    position: relative;
                    display: block;
                    padding: 0.15rem 0.12rem 0.1rem 0.8rem;
                    line-height: 0.2rem;
                    font-size: 0.14rem; 
                }
            }
            .last_list {
                height: 0.9rem;
            }
            .tip {
                margin-top: 0.09rem;
                line-height: 0.16rem;
                font-size: 0.11rem; color: #999;
            }
        }
        .dele_btn {
            margin-top: 0.12rem;
            height: 0.5rem;
            line-height: 0.5rem;
            background-color: #fff;
            span {
                font-size: 0.16rem;
            }
        }
        .btn {
            position: fixed;
            bottom: 0; left: 0;
            height: 0.55rem; width: 100%;
            border-top: 0;
            background-color: transparent;
            box-shadow: 0px 4px 16px 0px rgba(102, 102, 102, 0.26);
            span {
                position: absolute;
                left: 0; right: 0; bottom: 0; top: 0;
                margin: auto;
                width: 3.43rem; height: 0.4rem;
                line-height: 0.4rem; text-align: center;
                font-size: 0.16rem; color: #fff;
                border-radius: 0.25rem;
            }
        }
    }
    .pickHead {
        height: 0.45rem;
        >span {
            height: 0.45rem;
            line-height: 0.45rem;
            font-size: 0.18rem;
        }
        >span:nth-child(1) {
            float: left;
            margin-left: 0.35rem;
            color: #999;  
        }
        >span:nth-child(2) {
            float: right;
            margin-right: 0.35rem;
        }
    }
</style>
