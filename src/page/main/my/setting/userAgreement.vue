<!--
 * 文件描述：我的-设置
 * 创建人：赵志银
 * 创建时间：2020-11-05
-->
<template>
  <div id='main' class='' ref='main' v-html='contentHtml'>

  </div>
</template>

<script type='text/javascript'>
    import {fullScreenHeight} from '@/utils/CommonUtils.js'

    export default {
        data() {
            return {
                contentHtml: ''
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '用户协议'})
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
                this.$axios.post(rih_request+'API/V1/Agreement/LantingUser', {})
                .then(response => {
                    if (response.code == 200) {
                        this.contentHtml = response.data.content
                    }
                })
                .catch(response => {

                })
            }
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        background-color: #fff;
    }
    #main /deep/p.p1 {
        margin: 25px 10px 10px 10px;
        line-height: 24.0px;
        font: 21.3px SimSun;
        color: #3c3c3c;
        -webkit-text-stroke: #3c3c3c;
        background-color: #fff;
    }
    #main /deep/p.p2 {
        margin: 10px 10px 10px 10px;
        line-height: 18.0px;
        font: 16.0px SimSun;
        color: #505050;
        -webkit-text-stroke: #505050;
        background-color: #fff;
    }
    #main /deep/p.p3 {
        margin: 10px 10px 10px 10px;
        line-height: 19.0px;
        font: 16.0px SimSun;
        color: #505050;
        -webkit-text-stroke: #505050;
        background-color: #fff;
    }
    #main /deep/span.s1 {
        font-kerning: none
    }
    #main /deep/span.s2 {
        font: 16.0px Tahoma;
        font-kerning: none
    }
</style>
