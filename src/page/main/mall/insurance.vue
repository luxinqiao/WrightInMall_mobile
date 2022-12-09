<!--
 * 文件描述：延保
 * 创建人：赵志银
 * 创建时间：2019-03-14
-->
<template>
    <div id='main' ref='main'>
        <div class='logo'>
            <img v-lazy='require("@/assets/images/mall/details/logobg.png")' class='logo_bg'>
        </div>
        <div class='know wm_margin'>
            <div class='title'>服务须知</div>
            <div class='list'>
                <img v-lazy='require("@/assets/images/mall/details/time.png")'>
                <div class='list_tit'>保障期限</div>
                <div class='list_desc'>半年-1年</div>
            </div>
            <div class='list right'>
                <img v-lazy='require("@/assets/images/mall/details/ways.png")'>
                <div class='list_tit'>保障方式</div>
                <div class='list_desc'>维修</div>
            </div>
            <div class='list'>
                <img v-lazy='require("@/assets/images/mall/details/apply.png")'>
                <div class='list_tit'>申请方式</div>
                <div class='list_desc'>在线申请</div>
            </div>
            <div class='list right'>
                <img v-lazy='require("@/assets/images/mall/details/applyTime.png")'>
                <div class='list_tit'>申请时间</div>
                <div class='list_desc'>7×24小时</div>
            </div>
        </div>
        <div class='detail wm_margin'>
            <div class='title'>服务详情</div>
            <div class='content'>1.产品可在激活日起7天内补充购买延保服务，通过线上渠道购买产品可同时一并购买延保服务，购买延保服务时需提供产品编号。</div>
            <div class='content'>2.延保服务是在产品保质期1年的基础上，从产品原有保质期结束次日起开始计算，主机延长半年或一年（具体以您所购买的延保期限为准）保修服务。</div>
            <div class='content'>3.延保服务仅限主机，不包括充电盒、充电线等附件及赠品。</div>
            <div class='content'>4.每个产品仅支持购买一次延保服务，不可叠加购买。</div>
            <div class='content'>5.延保服务为增值服务产品，支付成功立即生效，不支持无理由退款。</div>
            <div>
                <span>如果对设备质保有疑问，可以</span><a href='tel:400-133-5668'>联系客服</a><span>为您解答哦！</span>
            </div>
        </div>
    </div>
</template>
<script>
import {fullScreenHeight} from '@/utils/CommonUtils.js'
import Vue from 'vue'

export default {
    mounted() {
        this.$wm_data.setHeader({title: '延保说明'})
        this.$wm_data.setFooter = false
        fullScreenHeight(this.$refs.main)
        document.body.style.overflow = 'auto'
        window.scrollTo(0,0)
    },
}
</script>
<style lang='scss' scoped>
    #main {
        position: relative;
        width: 100%;
        .logo {
            position: relative;
            width: 100%; height: auto;
            .logo_bg{
                display: block;
                width: 100%; height: auto;
            }
        }
        .title {
            margin: 0.24rem 0 0.16rem 0;
            height: 0.22rem;
            line-height: 0.22rem;
            font-size: 0.16rem; font-weight: bold;
        }
        .know {
            position: relative;
            font-size: 0;
            .list {
                display: inline-block;
                position: relative;
                margin: 0 0.09rem 0.08rem  0;
                width: calc((100% - 0.09rem)/2); height: 0.68rem;
                border: 1px solid rgba(206,206,206,0.2);
                border-radius: 3px;
                vertical-align: top;
                img {
                    position: absolute;
                    top: 0.12rem; left:  0.16rem;
                    width: 0.44rem; height: 0.44rem;
                }
                .list_tit {
                    position: absolute;
                    top: 0.15rem; left: 0.76rem;
                    height: 0.18rem;
                    line-height: 0.18rem;
                    font-size: 0.13rem;
                }
                .list_desc {
                    position: absolute;
                    top: 0.37rem; left: 0.76rem;
                    height: 0.16rem;
                    line-height: 0.16rem;
                    font-size: 0.11rem; color: #999;
                }
            } 
            .right {
                margin-right: 0;
            }
        }
        .detail {
            position: relative;
            padding: 0.08rem 0 0.16rem 0;
            .content {
                margin-bottom: 0.08rem;
                line-height: 0.2rem;
                font-size: 0.13rem;
            }
            >div:last-child {
                margin-top: 0.16rem;
                span {
                    font-size: 0.11rem; color: #999;
                }
            }
            a {
                color: #FF2C7D; font-size: 0.11rem; text-decoration: none;
            }
        }
    }
</style>
