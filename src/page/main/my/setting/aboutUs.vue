<!--
 * 文件描述：关于我们
 * 创建人：赵志银
 * 创建时间：2020-11-04
-->
<template>
    <div class='content'>
        <div class='qrCode'>
            <img src='@/assets/images/my/setting/lanting.png'>
            <span>澜渟公众号</span>
        </div>
        <div class='contactWay'>
            <span class='title'>联系方式</span>
            <div bindtap='contactShop'>
                <img src='@/assets/images/my/setting/phone.png'>
                <span>联系电话：</span>
                <a href='tel:400-133-5668'>400-133-5668</a>
            </div>
            <div>
                <img src='@/assets/images/my/setting/mail.png'>
                <span>联系邮箱：</span>
                <span>support@medoht.com</span>
            </div>
        </div>
    </div>
</template>

<script type='text/javascript'>
    export default {
        mounted() {
            this.$wm_data.setHeader({title: '关于我们'})
            this.$wm_data.setFooter = false
        }
    }
</script>

<style lang='scss' scoped>
    .qrCode {
        margin: 0.47rem auto;
        text-align: center;
        img {
            display: block;
            margin: 0 auto 0 auto;
            width: 1.24rem; height: 1.24rem;
        }
        span {
            font-size: 0.16rem;
        }
    }
    .contactWay {
        position: absolute;
        padding: 0 0.16rem;
        width: 100%;
        .title {
            font-size:0.16rem; font-weight: bold;
        }
        div {
            display: flex;
            margin-top: 0.16rem;
            img {
                display: block;
                width: 0.22rem; height: 0.22rem;
            }
            span:nth-of-type(1) {
                margin-left: 0.08rem;
                line-height: 0.22rem;
                font-size: 0.14rem; color: rgba(153,153,153,1);
            }
        }
    }
</style>
