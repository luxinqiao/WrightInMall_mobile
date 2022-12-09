<!--
 * 文件描述：我的-系统消息
 * 创建人：赵志银
 * 创建时间：2020-11-05
-->
<template>
    <div id='main' ref='main'>
        <van-pull-refresh 
            v-model='isRefresh'
            @refresh='onRefresh()'
        >
            <div v-if='isHas && !isEmpty(listArr)'>
                <van-list
                    v-model='loading'
                    :finished='finished'
                    :error.sync='error'
                    finished-text="-没有更多内容-"
                    error-text='请求失败，点击重新加载'
                    @load="initList"
                >
                    <div class='list' v-for='(item,index) in listArr' :key='index'>
                        <div class='list_time'>{{item.gmt_create}}</div>
                        <div class='list_con'>
                            <div class='list_title'>{{item.name}}</div>
                            <div class='list_desc'>{{item.content}}</div>
                        </div>
                    </div>
                </van-list>
            </div>
            <div class='none' v-if='isHas && isEmpty(listArr)'>
                <img src='@/assets/images/my/wallet/none.png'>
                <div>暂无系统通知</div>
            </div>
        </van-pull-refresh>
    </div>
</template>

<script type='text/javascript'>
    import {fullScreenHeight, getLocalToken, isEmpty , validLink} from '@/utils/CommonUtils.js'

    import Vue from 'vue'
    import { PullRefresh, List} from 'vant'
    import 'vant/lib/list/style'
    import 'vant/lib/pull-refresh/style'
    Vue.use(PullRefresh).use(List) 

    export default {
        data() {
            return {
                isRefresh: false,
                loading: false,
                finished: false,
                error: false,

                isHas: false,
                currpage: 1,
                listArr: [],

                isEmpty: isEmpty,
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '系统通知'})
            this.$wm_data.setFooter = false
            fullScreenHeight(this.$refs.main)
            this.$wm_dialog.loading()
            this.initList()
            this.isAllRead()
        },
        methods: {
            /**
                设置已读
                @param
                @return
            */
            isAllRead() {
                this.$axios.post(common_request + 'v1/note/read', {
                    token: localStorage.wm_token,
                    code: '',
                    type: '1'
                }).then(response => {
                })
            },

            /**
                接单列表
                @param
                @return
            */
            initList() {
                this.$axios.post(common_request + 'v1/note/records', {
                    token: localStorage.wm_token,
                    page: this.currpage,
                    type: '1',
                    link_where: 1
                }).then(response => {
                    let data = response.data
                    if(response.code == '200') {
                        if(!isEmpty(data)) {
                            for (let idx in data) {
                                data[idx].gmt_create = data[idx].gmt_create.replace(/-/g,'.')
                            }
                            this.listArr = this.currpage==1?data:this.listArr.concat(data)
                        } else {
                            this.finished = true
                        }
                    }
                    this.isHas = true
                    this.loading = false
                    this.$wm_dialog.closeLoading()
                    this.currpage++

                }).catch(response => {
                })
            },

            /**
                下拉刷新
                @param
                @return
            */
            onRefresh() {
                this.finished = false
                this.loading = false
                this.error = false
                this.currpage = 1
                this.initList()
                setTimeout(() => {
                    this.isRefresh = false
                }, 500);
            },
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        position: relative;
        padding-top: 0.1px;
        min-height: 100vh;
        background-color: #f7f8f8;
        .list {
            position: relative;
            margin: 0.16rem 0.16rem 0 0.16rem;  
        }
        .list_time {
            padding-bottom: 0.1rem;
            font-size: 0.14rem;
            text-align: center;
        }
        .list_con {
            padding: 0.16rem;
            width: 100%; height: auto; min-height: 0.5rem;
            background-color: white;
        }
        .list_title {
            font-size: 0.15rem;
            font-weight: bold;
        }
        .list_desc {
            margin-top: 0.1rem;
            line-height: 0.22rem;
            font-size: 0.14rem;
        }
        .none {
            position: relative;
            margin-top: 0.12rem; padding-top: 1.2rem;
            img {
                display: block;
                margin: auto;
                width: 1.5rem; height: 1.09rem;
            }
            div {
                margin-top: 0.16rem;
                text-align: center;
                font-size: 0.14rem; color: #666;
            }
        }
    }
</style>
