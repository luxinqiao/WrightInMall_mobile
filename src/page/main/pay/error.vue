<!--
 * 文件描述：支付失败
 * 创建人：赵志银
 * 创建时间：2010-10-30
-->
<template>
    <div id='main' ref='main'>
        支付失败
    </div>
</template>

<script type='text/javascript'>
    export default {
        data() {
            return {
                
            }
        },
        mounted() {
            this.$wm_data.setHeader({title: '支付失败'})
            this.$wm_data.setFooter = false
        },
        methods: {

        }
    }
</script>

<style lang='scss' scoped>
    
</style>
