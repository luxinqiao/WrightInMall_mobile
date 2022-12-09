<!--
 * 文件描述：弹窗插件
 * 创建人：赵志银
 * 创建时间：2019-03-14
-->
<template>
    <div :class='{shade: true, shadow: isShade()}'>
        <div class='tipDialog' v-if='$parent.dialog.data.type==="tip"'>
            {{$parent.dialog.data.message}}
        </div>
        <div class='alertDialog' v-if='$parent.dialog.data.type==="alert"'>
            <div class='title'>提示</div>
            <div class='content' v-html='$parent.dialog.data.message'></div>
            <div class='button' @click='confirm()'>确定</div>
        </div>
        <div class='confirm_no_top' v-if='$parent.dialog.data.type==="confirm"'>
            <div class='content'>
                <span>{{$parent.dialog.data.message}}</span>
            </div>
            <div class='button'>
                <span @click='close()'>{{$parent.dialog.data.cancelText}}</span>
                <span @click='confirm()'>{{$parent.dialog.data.confirmText}}</span>
            </div>
        </div>
        <div class='loadingDialog' v-if='$parent.dialog.data.type==="loading"'>
            <img src='../assets/images/common/load.gif'>
            <p>加载中...</p>
        </div>
        <div class='imgDialog' v-if='$parent.dialog.data.type==="img"'>
            <img class='close' src='../assets/images/common/pic-close.png' @click="close()">
            <img class='img' :src='$parent.dialog.data.message'>
        </div>
    </div>
</template>

<script type="text/javascript">
export default {
    data() {
        return {

        }
    },
    mounted() {

    },
    methods: {
        /**
            关闭弹出框
            @param
            @return
        */
        close() {
            this.$parent.dialog.data.show = false
            if (typeof(this.$parent.dialog.data.cancelCallBack) === 'function') {
                this.$parent.dialog.data.cancelCallBack()
            }
        },
        /**
            确定
            @param
            @return
        */
        confirm() {
            this.$parent.dialog.data.show = false
            if (typeof(this.$parent.dialog.data.confirmCallBack) === 'function') {
                this.$parent.dialog.data.confirmCallBack()
            }
        },
        /**
            是否有遮罩
            @param
            @return {boolean}  是否有遮罩
        */
        isShade() {
            const type = this.$parent.dialog.data.type
            if (type === 'alert' || type === 'confirm' || type === 'img') {
                return true
            }
            return false
        }
    },
    components: {

    }
}
</script>
