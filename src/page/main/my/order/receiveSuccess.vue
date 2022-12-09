<!--
    文件描述：订单-收货成功
    创建人：卢信桥
    创建时间：2020-10-26
 -->
<template>
    <div id='main' ref='main'>
        <img :src='require("../../../../assets/images/mall/success/success.png")'/>
        <p>确认收货成功！</p>
    </div>
</template>

<script type='text/javascript'>
    export default {
        mounted() {
            this.$wm_data.setHeader({title: ''})
            this.$wm_data.setFooter = false
        }
    }
</script>

<style lang='scss' scoped>
    #main {
        padding-top: 1.13rem;
        >img {
            display: block;
            margin: auto;
            width: 0.76rem; height: 0.76rem;
        }
        >p {
            margin-top: 0.05rem;
            text-align:center; line-height: 0.22rem;
        }
    }
</style>
