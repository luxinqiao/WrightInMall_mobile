<!--
 * 文件描述：地址
 * 创建人：赵志银
 * 创建时间：2019-03-14
-->
<template>
    <div id='main' ref='main'>
        <div class='address_box' v-if='!isEmpty(dataArr)&&isHas'>
            <div class='address_list' >
                <div class='address_item' v-for='(item,index) in dataArr' :key='index'  @click='checkAddress({address:item})'>
                    <div class='name'>
                        <span class='text_ellipsis'>{{item.contact_name}}</span>
                        <span>{{item.contact_call}}</span>
                    </div>
                    <div class='info'>
                        <span>{{item.zone}}</span>
                        <span>{{item.content}}</span>
                    </div>
                    <div class='default' @click.stop='setDefault({code:item.code,index:index})'>
                        <img src='@/assets/images/common/check.png' v-if='item.is_default==1'>
                        <img src='@/assets/images/common/uncheck.png' v-if='item.is_default!=1'>
                        <span>设为默认地址</span>
                    </div>
                    <span class='edit' @click.stop='goEdit(item)'>编辑</span>
                </div>
            </div>
            <div class='btn' @click='goAdd'>
                <span @click='goAdd' class='wm_bgcolor_main'>新增地址</span>
            </div>
        </div>

        <div class='address_empty' v-if='isEmpty(dataArr)&&isHas'>
            <img src='@/assets/images/my/address/empty.png'>
            <span>您还没有收货地址哦</span>
            <span @click='goAdd' class='wm_bgcolor_main'>新增地址</span>
        </div>
    </div>
</template>

<script type='text/javascript'>
    import {fullScreenHeight, getLocalToken, getParameter,isEmpty, urlChange} from '@/utils/CommonUtils.js'

    export default {
        data() {
            return {
                isHas: false,
                paramObj: {},
                dataArr: [],
                dataListArr: [],
                isEmpty: isEmpty
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '地址管理'})
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
                this.$axios.post(common_request+'v1/address/records', {
                    token: getLocalToken()
                })
                .then(response => {
                    if (response.code == 200) {
                        this.dataListArr = response.data
                        this.dataArr = response.data
                        if(!isEmpty(sessionStorage.wm_addressCode)) {
                            let isdele = true
                            for (let i=0; i<this.dataListArr.length; i++) {
                                if(this.dataListArr[i].code==sessionStorage.wm_addressCode) {
                                    isdele = false
                                }
                            }
                            if(isdele) {
                                sessionStorage.wm_addressCode = ''
                            }
                        }
                    }
                    this.$wm_dialog.closeLoading()
                    this.isHas = true
                })
                .catch(response => {

                })
            },

            /**
                选中地址
                @param {Dom} e 地址
                @return
            */
            checkAddress(e) {
                if (this.paramObj.from=='order') {
                    sessionStorage.wm_addressCode = e.address.code
                    history.back(-1)
                }
            },

            /**
                设为默认地址
                @param {Dom} item 地址
                @return
            */
            setDefault(item) {
                this.$axios.post(common_request+'v1/address/used', {
                    token: getLocalToken(),
                    code: item.code
                }).then(response => {
                    if(response.code == 200) {
                        if (this.dataArr[item.index].is_default == 1) {
                            this.dataArr[item.index].is_default = 0
                        } else {
                            for (let i = 0; i < this.dataArr.length; i++) {
                                this.dataArr[i].is_default = 0
                            }
                            this.dataArr[item.index].is_default = 1
                        }
                    }
                })
            },
            
            /**
                跳转-编辑地址
                @param {object} param 编辑按钮
                @return
            */
            goEdit(param) {
                this.$router.push({
                    path: 'addressModify',
                    query: {
                        code: param.code,
                        name: param.contact_name,
                        call: param.contact_call,
                        zone: param.zone,
                        content: param.content,
                        is_default: param.is_default
                    }
                })
            },

            /**
                跳转新增地址
                @param
                @return
            */
            goAdd() {
                this.$router.push({path: 'addressAdd'})
            }
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        background-color: #fff;
        .address_list {
            padding-bottom: 0.82rem;
            .address_item {
                position: relative;
                margin: 0 0.16rem; padding: 0.16rem 0 0.04rem 0;
                border-bottom: 1px solid #efefef;
                .name {
                    height: 0.22rem;
                    span:nth-child(1) {
                        float: left;
                        height: 0.22rem; max-width: 2.1rem;
                        line-height: 0.22rem;
                        font-size: 0.16rem; font-weight: bold;
                    }
                    span:nth-child(2) {
                        float: left;
                        margin-left: 0.24rem;
                        height: 0.22rem;
                        line-height: 0.22rem; font-weight: bold;
                    }
                }
                .info {
                    margin: 0.04rem 0.75rem 0 0;
                    span {
                        font-size: 0.13rem;
                        line-height: 0.18rem;
                        color: #666;
                    }
                }
                .default {
                    display: inline-block;
                    padding: 0.12rem 0.12rem 0.12rem 0;
                    height: 0.16rem;
                    box-sizing: content-box;
                    img {
                        float: left;
                        width: 0.14rem; height: 0.14rem;
                        margin-top: 1px;
                    }
                    span {
                        float: left;
                        margin-left: 0.03rem;
                        height: 0.16rem;
                        line-height: 0.16rem;
                        font-size: 0.12rem;
                        color: #999;
                    }
                }
                .edit {
                    position: absolute;
                    top: 0.33rem; right: 0;
                    width: 0.58rem; height: 0.28rem;
                    text-align: center; line-height: 0.28rem;
                    border-left: 1px solid #efefef;
                    font-size: 0.13rem;
                    color: #999;
                }
            }
        }
        .btn {
            position: fixed;
            bottom: 0; left: 0;
            height: 0.55rem; width: 100%;
            border-top: 0;
            background-color: transparent;
            box-shadow: 0px 4px 16px 0px rgba(102, 102, 102, 0.26);
            background-color: #fff;
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
        .address_empty {
            position: absolute;
            left: 0; right: 0; bottom: 2.8rem;
            margin: auto;
            width: 1.6rem; height: 2.25rem;
            img {
                position: absolute;
                left: 0; right: 0; top: 0;
                margin: auto;
                width: 1.5rem; height: 1.09rem;
            }
            span:nth-of-type(1) {
                position: absolute;
                left: 0; right: 0; top: 1.25rem;
                height: 0.2rem;
                text-align: center; line-height: 0.2rem;
                font-size: 0.14rem;
                color: #666;
            }
            span:nth-of-type(2) {
                position: absolute;
                left: 0; right: 0; bottom: 0;
                height: 0.4rem;
                text-align: center; line-height: 0.4rem;
                font-size: 0.16rem;
                color: #666; color: #fff;
                border-radius: 0.25rem;
            }
        }
    }
</style>
