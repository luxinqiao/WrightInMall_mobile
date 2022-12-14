<!--
 * 文件描述：弹出层组件组件
 * 创建人：段素栋
 * 创建时间：2020.3.30
-->
<template>
    <div class="md_popup">
        <div v-if="isOverlay && isShowOverlay" :class="`md_popup-overlay ${overlayClass}`" @click="closePopup()"></div>
        <transition :name="`ani-popup-${position}`">
            <div v-if="isShow" :class="`md_popup-box md_popup-${position} ${isRound ? 'md_popup-round-' + position : ''}`" :style="`animation-duration: ${(duration - 20) / 1000}s`">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'mdPopup',
        data() {
            return {
                isShowOverlay: false   //控制popup展示
            }
        },
        props: {
            isOverlay: {   //是否显示遮罩层
                type: Boolean,
                default: true
            },
            overlayClass: {   //自定义遮罩层类名
                type: String,
                default: ''
            },
            closeOnClickOverlay: {   //是否点击遮罩层后关闭
                type: Boolean,
                default: true
            },
            isShow: {   //控制popup展示
                type: Boolean,
                default: false
            },
            position: {   //弹出层位置 botom、top、left、right、center
                type: String,
                default: 'bottom'
            },
            isRound: {   //是否展示圆角
                type: Boolean,
                default: true
            },
            duration: {   //动画时长
                type: Number,
                default: 300
            },
            lockScroll: {   //是否锁定背景滚动 默认为true
                type: Boolean,
                default: true
            }
        },
        model: {
           prop: 'isShow',
           event: 'overlayClose'
        },
        mounted() {
            if(this.lockScroll) {

            }
            if(this.isShow) {
                this.isShowOverlay = true
            }
        },
        methods: {
            /**
             点击遮罩层时触发
             @return
             */
            closePopup() {
                if(this.closeOnClickOverlay){
                    //popup开始关闭时触发
                    this.$emit('overlayClose', false)
                }
            }
        },
        watch: {
            /**
             监听isShow状态
             @return
             */
            isShow(val) {
                if(val){
                    //打开popup时触发
                    this.$emit('open')
                    this.isShowOverlay = val
                    if(this.lockScroll){
                        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
                        window.scrollTo(0, scrollTop + 1)
                    }
                    setTimeout(()=>{
                        //popup打开且动画完成时触发
                        this.$nextTick(()=>{
                            this.$emit('opened')
                            document.body.style.overflow = 'hidden'
                        })
                    }, this.duration)
                } else {
                    this.$emit('close', false)
                    setTimeout(()=>{
                        this.isShowOverlay = val
                        //popup关闭且动画结束时触发触发
                        this.$nextTick(()=>{
                            this.$emit('closed')
                            if(this.lockScroll){
                                document.body.style.overflow=''
                            }
                        })
                    },this.duration)
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .md_popup {
        .md_popup-overlay {
            position: fixed;
            top: 0; left: 0;
            height: 100%;
            width: 100%;
            z-index: 99;
            background-color: rgba(0, 0, 0, 0.7);
        }
        .md_popup-box {
            z-index: 99;
            overflow: hidden;
            background-color: #fff;
        }
        .md_popup-center {
            box-sizing: border-box;
            position: fixed;
            top: 50%; left: 50%;
            transform: translate3d(-50%, -50%, 0);
        }
        .md_popup-round-center {
            border-radius: 0.12rem;
        }
        .md_popup-round-top {
            border-bottom-left-radius: 0.12rem;
            border-bottom-right-radius: 0.12rem;
        }
        .md_popup-round-right {
            border-bottom-left-radius: 0.12rem;
            border-top-left-radius: 0.12rem;
        }
        .md_popup-round-bottom {
            border-top-left-radius: 0.12rem;
            border-top-right-radius: 0.12rem;
        }
        .md_popup-round-left {
            border-bottom-right-radius: 0.12rem;
            border-top-right-radius: 0.12rem;
        }
        .md_popup-top {
            position: fixed;
            top: 0; left: 0;
            width: 100%;
        }
        .md_popup-right {
            position: fixed;
            top: 0; right: 0;
            height: 100%;
        }
        .md_popup-bottom {
            position: fixed;
            bottom: 0; left: 0;
            width: 100%;
        }
        .md_popup-left {
            position: fixed;
            top: 0; left: 0;
            height: 100%;
        }
        //center动画效果
        .ani-popup-center-enter-active {
            animation-name: fade-in;
            animation-fill-mode: forwards;
        }
        .ani-popup-center-leave-active {
            animation-name: fade-out;
            animation-fill-mode: forwards;
            animation-duration: 0.28s;
        }
        @keyframes fade-in {
            0% {
                -webkit-transform: scale3d(0, 0, 0) translate3d(-75%, -75%, 0);
                transform: scale3d(0.5, 0.5, 0.5) translate3d(-75%, -75%, 0);
                opacity: 0;
            }
            50% {
                -webkit-animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
                animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
            }
            100% {
                -webkit-transform: scale3d(1, 1, 1) translate3d(-50%, -50%, 0);
                transform: scale3d(1, 1, 1) translate3d(-50%, -50%, 0);
                -webkit-animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                opacity: 1;
            }
        }
        @keyframes fade-out {
            0% {
                -webkit-transform: scale3d(1, 1, 1) translate3d(-50%, -50%, 0);
                transform: scale3d(1, 1, 1) translate3d(-50%, -50%, 0);
                opacity: 1;
            }
            100% {
                opacity: 0;
                -webkit-transform: scale3d(0.9, 0.9, 1)  translate3d(-55%, -55%, 0);
                transform: scale3d(0.9, 0.9, 1)  translate3d(-55%, -55%, 0);
            }
        }

        //top动画效果
        .ani-popup-top-enter-active {
            animation-name: popup-top-in;
        }
        .ani-popup-top-leave-active {
            animation-name: popup-top-out;
        }
        @keyframes popup-top-in {
            0% {
                transform: translate(0, -100%);
            }
            100% {
                transform: translate(0, 0);
            }
        }
        @keyframes popup-top-out {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(0, -100%);
            }
        }

        //right动画效果
        .ani-popup-right-enter-active {
            animation-name: popup-right-in;
        }
        .ani-popup-right-leave-active {
            animation-name: popup-right-out;
        }
        @keyframes popup-right-in {
            0% {
                transform: translate(100%, 0);
            }
            100% {
                transform: translate(0, 0);
            }
        }
        @keyframes popup-right-out {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(100%, 0);
            }
        }

        //bottom动画效果
        .ani-popup-bottom-enter-active {
            animation-name: popup-bottom-in;
        }
        .ani-popup-bottom-leave-active {
            animation-name: popup-bottom-out;
        }
        @keyframes popup-bottom-in {
            0% {
                transform: translate(0, 100%);
            }
            100% {
                transform: translate(0, 0);
            }
        }
        @keyframes popup-bottom-out {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(0, 100%);
            }
        }

        //left动画效果
        .ani-popup-left-enter-active {
            animation-name: popup-left-in;
        }
        .ani-popup-left-leave-active {
            animation-name: popup-left-out;
        }
        @keyframes popup-left-in {
            0% {
                transform: translate(-100%, 0);
            }
            100% {
                transform: translate(0, 0);
            }
        }
        @keyframes popup-left-out {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(-100%, 0);
            }
        }
    }
</style>