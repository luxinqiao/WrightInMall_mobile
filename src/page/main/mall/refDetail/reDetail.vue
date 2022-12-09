<!--
 * 文件描述：商品详情
 * 创建人：赵志银
 * 创建时间：2019-12-02
-->
<template>
    <div id='main' ref='main'>
        <!-- v-if="(browserType == 'app') && !isTitle" -->
        <div class='head_one'  id='head_one' :style="{display:(((browserType == 'app') && (!isTitle))?'block':'none')}">
            <img :src="require('@/assets/images/common/ic_back2.png')" @click="back()" id='back_img'>
        </div>
<!-- v-if="(browserType != 'wechat') && isTitle" -->
        <div class='head_two'  id='head_two' :style="{display:(((browserType != 'wechat') && isTitle)?'block':'none')}">
            <div class='head_two_box'>
                <img :src='require("@/assets/images/common/backbtn.png")' class='back_btn' @click='back()' v-if='browserType == "app"'>
                <div class='head_box'>
                    <div :class='["headItem", {"acive":currTab==0}]' @click='changeTab(0)'>
                        <span class='headItemText'>商品</span>
                        <span class='headItemMark'></span>
                    </div>
                    <div :class='["headItem", {"acive":currTab==1}]' @click='changeTab(1)'>
                        <span class='headItemText'>详情</span>
                        <span class='headItemMark'></span>
                    </div>
                </div>
            </div>
        </div>

        <div id="noUse" ref="noUse"><img v-lazy='require("@/assets/images/mall/details/bg_empty.png")'><p>尊敬的用户:</p><p>您好,感谢您对澜渟平台的认可！此次活动已经结束！欢迎致电<a href="tel:18021397056" >18021397056</a>、<a href="tel:18021391929" >18021391929</a>、<a href="tel:18021397075" >18021397075</a>（微信同号）澜渟运营同学了解更多优惠活动！</p></div>

        <div v-if='detailObj.is_release == "1"' ref='content'>

            <div class='top'>
                <div id='banner' ref='banner'>
                    <van-swipe :autoplay='0' @change="swipeChange">
                        <van-swipe-item v-for='(item, i) in detailObj.mainimgs' :key='i' >
                            <img v-lazy='item' @click='previewImg(i)' class='banner_list'>
                        </van-swipe-item>
                    </van-swipe>
                    <div class="currentItem">{{currentIndex}}/{{detailObj.mainimgs.length}}</div>
                </div>

                <!-- 价格 -->
                <div class='price_sale'>
                    <div class='price wm_margin'>
                        <span class='wm_color_main'>￥</span><span class='wm_color_main'>{{rePrice}}</span><span v-if='rePrice!=price'>商城价￥{{price}}</span>
                    </div>
                </div>
                <div class='title wm_margin'>{{detailObj.name}}</div>
                <!-- 活动 -->
                <div class='gift list list_nomal' @click='openPop("gift")' v-if='detailObj.gift.status==1'>
                    <div class='list_tit'>活动</div>
                    <img v-lazy='require("@/assets/images/my/order/list/give.png")'>
                    <div class='text_ellipsis gift_det'>{{detailObj.gift.content}}</div>
                    <img v-lazy='require("@/assets/images/mall/details/right.png")' class='next'>
                </div>
                
                <div @click='openPop("style")' v-if='detailObj.is_release==1' class='list norms'>
                    <div class='list_tit'>规格</div>
                    <div class='goods_cho'>{{formatText}}</div>
                    <img v-lazy='require("@/assets/images/mall/details/right.png")' class='next'>
                </div>
            </div>
            <div class='middle'>
                <div class='address list list_nomal'>
                    <div class='list_tit'>快递</div>
                    <div>{{detailObj.express_price>0?priceTransition(detailObj.express_price):'包邮'}}</div>
                    <div class='add_from'>发货地：江苏南京</div>
                    <div class='sale'>销量 {{detailObj.saled}}</div>
                </div>
                <div class='service_con' v-if='!isEmpty(detailObj.services)'>
                    <div class='service_style'>
                        <div class='list_tit'>服务</div>
                        <div v-if='!isEmpty(detailObj.services)' class='service_style_box'>
                            <div v-for='(item, index) in detailObj.services' :key='index' class='service_style_item'>
                                <img v-lazy='require("@/assets/images/mall/details/service.png")'>
                                <span>{{item.name}}</span>
                            </div>
                        </div>
                    </div>
                    <div class='add_info'>
                        <span class='wm_color_main'>*</span><span>澜渟官方渠道销售，请放心购买！购买成功后可在澜渟App我的“订单”中查看，如有问题联系官方客服</span><a class='wm_color_main' href='tel:400-133-5668'>400-133-5668</a>
                    </div>
                </div>
            </div>
            
            <div class='detail_quest' v-if='!isEmpty(detailObj.contents)' id='detail' ref='detCon'>
                <div class='detail_title'>商品详情</div>
                <div class='detail' >
                    <img v-for='(item, index) in detailObj.contents' :key='index'  v-lazy='item' />
                </div>
            </div>
            <div  v-if='detailObj.is_release==1' class='btn'>
                <div v-if="browserType == 'app' && !isEmpty(version)">
                    <div class='call_btn' @click='call()'>
                        <img v-lazy='require("@/assets/images/mall/details/call.png")'>
                        <span>客服</span>
                    </div>
                    <div class='wm_bgcolor_main buy_btn' @click='goBuy()'>立即购买</div>
                </div>
                <div v-else class='wm_bgcolor_main buy_btn buy_btn_wchat' @click='goBuy()'>立即购买</div>
            </div>
        </div>

        <div style='display:none;'>
            <loginCheck ref='loginCheck'></loginCheck>
        </div>

        <!-- 图片预览 -->
        <div class='image_preview' @touchstart.stop='handleStart($event)' @touchend.stop='handleEnd($event)' @touchmove.stop='handleMove($event)'>
            <van-image-preview
                v-model='isShowPreview'
                :images='detailObj.mainimgs'
                :start-position='startIndex'
                @close='onClose()'
                @change='changeImg'
            >
            </van-image-preview>
        </div>
        <mdPopup position='bottom' :isShow='isImgPre' :isRound='false' @overlayClose='closeImgPre'>
            <div class='download_img'>
                <div @click.stop='downloadImage'>保存图片</div>
                <div class='cancle_btn' @click.stop='closeImgPre'>取消</div>
            </div>
        </mdPopup>

        <mdPopup :isShow='isGift' @overlayClose='closePop("gift")'>
            <div class='pop_box'>
                <div class='pop_title'>活动详情</div>
                <div class='gift_box'>
                    <img v-lazy='require("@/assets/images/my/order/list/give.png")'/>
                    <div>{{detailObj.gift.content}}</div>
                </div>
                <div class='pop_btn'><span @click='closePop("gift")' class='wm_bgcolor_main'>关闭</span></div>
            </div>
        </mdPopup>

        <mdPopup :isShow='isStyle' @overlayClose='closePop("style")'>
            <div class='pop_box style_pop'>
                <img v-lazy='require("@/assets/images/mall/details/cancle.png")' class='cancle' @click.stop='closePop("style")'>
                <div class='style_con' scroll-y >
                    <div class='info'>
                        <img v-lazy='detailObj.order_cover'>
                        <div>
                            <div class='wm_color_main'>￥{{!isEmpty(styleCode)?priceTransitionTwo((stylePrice-reducePrice)>0?(stylePrice-reducePrice):0):rePrice}}</div>
                            <div>{{styleChoose}}</div>
                        </div>
                    </div>
                    <div class='style'>
                        <div class='item_tit'>选择规格</div>
                        <div>
                            <div :class='["style_item", {"act":styleCode==item.code}]' @click.stop='choiceStyle({code:item.code,name:item.name,price:item.price})' v-for='(item,index) in detailObj.tags'  :key='index'><span :class='{"wm_color_main":styleCode==item.code}'>{{item.name}}</span></div>
                        </div>
                    </div>
                    <div class='style insure' v-if='!isEmpty(detailObj.warranty)'>
                        <div class='item_tit'>延保服务(可选)</div>
                        <div class='insure_box'>
                            <div :class='[{actInsure:severCode==item.code}]' @click.stop='getService({code:item.code,name:item.name})' v-for='(item,index) in detailObj.warranty' :key='index'>
                                <span>{{item.name}}</span>
                                <span>￥{{priceTransitionTwo(item.price)}}</span>
                            </div>
                        </div>
                        <div @click.stop='goInsurance' class='desc_btn'>
                            <div class='wm_color_main'>延保说明</div>
                            <img v-lazy='require("@/assets/images/mall/details/ques.png")'>
                        </div>
                    </div>
                    <div class='buy_num'>
                        <div class='item_tit'>购买数量</div>
                        <div class='num_btn'>
                            <img v-lazy='require("@/assets/images/mall/details/minus.png")' @click.stop='minus' v-if='num>1'>
                            <img v-lazy='require("@/assets/images/mall/details/minmore.png")' @click.stop='minus' v-if='num<=1'>
                            <input type='number' maxlength='3' v-model='num' onkeyup="value=value.replace(/[^\d]/g,'')" >
                            <img v-lazy='require("@/assets/images/mall/details/add.png")' @click.stop='add'>
                        </div>
                    </div>
                </div>
                <div class='pop_btn'><span @click.stop='goBuy()' class='wm_bgcolor_main'>立即购买</span></div>
            </div>
        </mdPopup>

    </div>
</template>
<script type='text/javascript'>
    import Vue from 'vue'
    import {ImagePreview, Swipe, SwipeItem} from 'vant'
    import 'vant/lib/image-preview/style'
    import 'vant/lib/swipe/style'
    import 'vant/lib/swipe-item/style'
    Vue.use(Swipe).use(SwipeItem)
    Vue.use(ImagePreview)

    import '@/assets/css/common/Common.scss'
    import loginCheck from '@/components/loginCheck'
    import mdPopup from '@/components/popup'
    import {priceTransition, priceTransitionTwo, getParameter, getBrowserType, isEmpty, getLocalToken, convert23, setWechatRole, urlChange, appFun, getAppVersion, getAppHeader} from '@/utils/CommonUtils.js'
    import {wechatAuthorize} from '@/utils/WechatUtils.js'
    import sdk from '@/utils/weichatShareUtils.js'

    export default {
         data() {
            return {
                /** 返回数据 **/
                paramObj: {},
                currTab: 0,
                isTitle: false, //是否显示可切换的标题头部
                isClickTab: false,

                isGift: false, //赠品弹窗

                isStyle: false, //规格弹窗
                num: 1,
                styleChoose: '请选择规格',
                styleCode: '',
                styleName: '',
                stylePrice: '',
                severCode: '',
                severName: '',

                detailObj: {
                    gift: {},
                },
                reducePrice: 0, //可减免价格
                price: '',
                rePrice: '',
                formatText: '颜色分类/型号/其他',

                currentIndex: 1, //banner
                isShowPreview: false,
                startIndex: 0,
                curIndex: 0,
                isImgPre: false,
                longClick: 0,
                timeOutEvent: 0,
                downloadImgSrc: '',

                priceTransition: priceTransition,
                priceTransitionTwo: priceTransitionTwo,
                isEmpty: isEmpty,
                version: getAppVersion(),
                browserType: getBrowserType(),
            }
        },
        mounted() {
            //页面初始化
            this.$wm_data.setHeader({title: '商品详情',isShow: false})
            this.$wm_data.setFooter = false

            this.paramObj = urlChange(window.location.href)
            this.paramObj.goods_type = isEmpty(this.paramObj.goods_type)?'3':this.paramObj.goods_type
            sessionStorage.wm_addressCode = ''
            sessionStorage.wm_remark = ''

            // 微信授权
            if (getBrowserType() == 'wechat' && isEmpty(this.$route.query.openid) && getParameter('type')=='LT01') { //跳转微信授权
                const url = convert23(host_path)+'mall/details?goods_type=3'+'&referral_code='+getParameter('referral_code')+'&sn='+getParameter('sn')+'&goods_code='+getParameter('goods_code') 
                window.location.replace(c_request+'v1/wechat/login?back_url='+url)
                let inter = setInterval(()=>{
                    let urlObj = urlChange(window.location.href)
                    if(!isEmpty(urlObj.openid)&&isEmpty(sessionStorage.wm_wechat_openid)) {
                        this.initData()
                        setWechatRole(urlChange(window.location.href))
                        clearInterval(inter)
                    }
                    if(!isEmpty(sessionStorage.wm_wechat_openid)&&!isEmpty(urlObj.openid)) {
                        clearInterval(inter)
                    }
                },500)
                if(!isEmpty(sessionStorage.wm_wechat_openid)) {
                    clearInterval(inter)
                }
                return
            } 
            this.initData()
            if(getBrowserType() == 'wechat') {
                setWechatRole(urlChange(window.location.href))
            }
            setTimeout(()=>{
                if(isEmpty(this.detailObj)){
                    this.$wm_dialog.loading()
                }
            },1000)
            
            setTimeout(() => {
                window.scrollTo(0, document.body.scrollTop + 1);
                document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1);  
            }, 10)
            document.body.style.overflow = ''
            document.documentElement.style.overflow=''

            this.initAppTop()
        },
        methods: {
            /**
                app内顶部距离
                @param
                @return
            */
            initAppTop() {
                let height = getAppHeader()
                if(this.browserType =='app' && !isEmpty(height)) {
                    if(document.getElementById('head_one')) {
                        document.getElementById('head_one').style = `margin-top:${height}px`
                    }
                    if(document.getElementById('head_two')) {
                        document.getElementById('head_two').style = `padding-top:${height}px`
                    }
                }
            },
            /**
                监听页面滚动
                @param
                @return
            */
            pageScroll() {
                if(this.isClickTab) {
                    return
                }
                if(this.$refs.banner.getBoundingClientRect().top<0) {
                    this.isTitle = true
                } else {
                    this.isTitle = false
                }
                if(this.$refs.detCon.getBoundingClientRect().top < (document.body.clientHeight/12)) {
                    this.currTab = 1
                } else {
                    this.currTab = 0
                }
            },
            /**
                标题切换
                @param {number} type 标题下标
                @return
            */
            changeTab(type) {
                this.currTab = type
                this.isClickTab = true
                if(type == 1) {
                    document.body.scrollTop = this.$refs.detCon.offsetTop - 50
                    document.documentElement.scrollTop = this.$refs.detCon.offsetTop - 50
                } else {
                    document.body.scrollTop = 0
                    document.documentElement.scrollTop = 0
                    this.isTitle = false
                }
                let inter = setInterval(()=>{
                    clearInterval(inter)
                    this.isClickTab = false
                },200)
            },
            /**
                初始化商品
                @param
                @return
            */
            initData() {
                this.$axios.post(live_request+'v2/goods/detail', {
                    token: getLocalToken(),
                    goods_code: getParameter('goods_code'),
                })
                .then(response => {
                    if (response.code == 200) {
                        this.detailObj = response.data
                        if(this.detailObj.is_release == '1') {
                            if(sessionStorage.wm_goods_code == this.paramObj.goods_code && !isEmpty(sessionStorage.wm_style_code) && !isEmpty(sessionStorage.wm_goods_code)) {
                                this.num = sessionStorage.wm_goods_num
                                for (let inx in this.detailObj.tags) {
                                    if(this.detailObj.tags[inx].code == sessionStorage.wm_style_code) {
                                        this.styleName = this.detailObj.tags[inx].name
                                        this.styleCode = this.detailObj.tags[inx].code
                                        this.stylePrice = this.detailObj.tags[inx].price
                                    }
                                }
                                if(!isEmpty(sessionStorage.wm_service_code)) {
                                    for (let inx in this.detailObj.warranty) {
                                        if(this.detailObj.warranty[inx].code == sessionStorage.wm_service_code) {
                                            this.severCode = this.detailObj.warranty[inx].code
                                            this.severName = this.detailObj.warranty[inx].name
                                        }
                                    }
                                }
                                let str = '已选：'
                                if(!isEmpty(this.styleCode)) {
                                    str += this.styleName
                                    if(!isEmpty(this.severCode)) {
                                        str += ' '+this.severName
                                    } 
                                }  
                                this.styleChoose = str
                                this.formatText = str +' ×'+ this.num
                            } else {
                                sessionStorage.wm_goods_code = ''
                                if(this.detailObj.tags.length<2) {
                                    this.styleName = this.detailObj.tags[0].name
                                    this.styleCode = this.detailObj.tags[0].code
                                    this.stylePrice = this.detailObj.tags[0].price
                                    this.styleChoose = '已选：' + this.detailObj.tags[0].name
                                }
                            }
                            this.initRecom()
                            this.countRecom()

                            /**** 微信分享 ****/
                            let obj={
                                title: this.detailObj.name,
                                des: '这个商品还不错，推荐给您！',
                                linkurl: window.location.protocol+ '//' + window.location.host + '/#/mall/details?goods_code='+ this.paramObj.goods_code +'&goods_type=1&type=LT01',
                                img: this.detailObj.mainimgs[0]
                            }
                            let url = encodeURIComponent(window.location.href.split('#')[0]);
                            sdk.getJSSDK(url, obj) 
                        } else if(this.detailObj.is_release == '0') {
                            /**** 商品下架 ****/
                            this.$refs.main.style = 'background-color:#fff;'
                            this.$refs.noUse.style = 'display: block;'
                            return
                        }
                        window.addEventListener('scroll', this.pageScroll)
                    }
                    this.$wm_dialog.closeLoading()
                })
                .catch(response => {

                })
            },
            /**
                初始化商品价格
                @param
                @return
            */
            initPrice() {
                let countPrice = this.detailObj.tags;
                let minPrice = countPrice[0].price;
                let maxPrice = countPrice[0].price;
                let minOriginal = countPrice[0].original_price;
                let maxOriginal = countPrice[0].original_price;
                for(let i = 1;i<countPrice.length;i++){
                    if(Number(minPrice)>Number(countPrice[i].price)){
                        minPrice = countPrice[i].price
                    }
                    if(Number(maxPrice)<Number(countPrice[i].price)){
                        maxPrice = countPrice[i].price
                    }
                    if(Number(minOriginal)>Number(countPrice[i].original_price)){
                        minOriginal = countPrice[i].original_price
                    }
                    if(Number(maxOriginal)<Number(countPrice[i].original_price)){
                        maxOriginal = countPrice[i].original_price
                    }
                }
                if(minPrice==maxPrice){
                    this.price = priceTransitionTwo(minPrice)
                    this.rePrice = priceTransitionTwo(minPrice-this.reducePrice)
                }else if(minPrice!=maxPrice){
                    this.price = priceTransitionTwo(minPrice)+'-'+priceTransitionTwo(maxPrice)
                    this.rePrice = priceTransitionTwo(minPrice-this.reducePrice)+'-'+priceTransitionTwo(maxPrice-this.reducePrice)
                }
            },
            /**
                初始化推荐商品
                @param
                @return
            */
            initRecom() {
                this.$axios.post(rec_request+'v1/referral/check', {
                    token: getLocalToken(),
                    goods_code: getParameter('goods_code'),
                    referral_code: this.paramObj.referral_code
                })
                .then(response => {
                    if (response.code == 200) {
                        this.reducePrice = response.data.remiss_cash
                        this.initPrice()
                    }
                })
                .catch(response => {

                })
            },
            /**
                推荐商品埋点
                @param
                @return
            */
            countRecom() {
                this.$axios.post(live_request+'v1/click', {
                    token: getLocalToken(),
                    module: 'REFERRAL',
                    event: 'SCAN_GOODS',
                    business_child_id: getParameter('goods_code'),
                    business_id: getParameter('referral_code')
                })
                .then(response => {
                    if (response.code == 200) {

                    }
                })
                .catch(response => {

                })
            },
            /**
             * 预览-实时监听
             * @param {number} index 下标
             * @return
            */
            changeImg(index){
                if(this.isImgPre) {
                    this.isImgPre = false
                }
                this.downloadImgSrc = this.detailObj.mainimgs[index]
                this.curIndex = index
            },
            /**
             * 开始预览
             * @param {number} index 下标
             * @return
            */
            previewImg(index){
                if(this.isImgPre) {
                    this.isImgPre = false
                }
                this.downloadImgSrc = this.detailObj.mainimgs[index]
                this.startIndex = index
                this.isShowPreview = true
            },
            /**
             * 关闭预览
             * @param 
             * @return
            */
            onClose() {
                this.isShowPreview = false 
                this.isLongClick = false 
                this.closeImgPre()
                this.downloadImgSrc = ''
            },
            /**
             * 触摸开始
             * @param {dom} e 触摸事件
             * @return
            */
            handleStart(e) {
                this.longClick = 0
                this.timeOutEvent = setTimeout(()=> {
                    if(this.browserType == 'app' && this.version) {
                        this.longClick = 1
                        this.showImgPre()
                    }
                }, 500)
            },
            /**
             * 触摸移动（如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按 ）
             * @param {dom} e 触摸事件
             * @return
            */
            handleMove(e) {
                e.preventDefault()
                clearTimeout(this.timeOutEvent)
                this.timeOutEvent = 0
            },
            /**
             * 触摸结束（手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件 ）
             * @param {dom} e 触摸事件
             * @return
            */
            handleEnd(e) {
                clearTimeout(this.timeOutEvent)
                return false
            },

            /**
             * 显示弹出层-图片预览下载
             * @param 
             * @return
            */
            showImgPre() {
                this.isImgPre = true
            },
            /**
             * 关闭弹出层-图片预览下载
             * @param 
             * @return
            */
            closeImgPre() {
                this.isImgPre = false
            },
            /**
             * 下载图片
             * @param 
             * @return
            */
            downloadImage() {
                appFun(()=> {
                    window.jsInterface.downloadImage(JSON.stringify({src:this.downloadImgSrc}))
                }, ()=> {
                    window.webkit.messageHandlers.downloadImage.postMessage({src:this.downloadImgSrc})
                })
                this.isImgPre = false
            },
            /**
                开启弹窗
                @param {string} type 弹窗类型
                @return
            */
            openPop(type) {
                this.isClickTab = true
                let inter = setInterval(()=>{
                    clearInterval(inter)
                    this.isClickTab = false
                },200)
                if(type == 'gift') {
                    this.isGift = true
                } else if(type == 'style') {
                    this.$refs.loginCheck.checkToken(()=>{
                        this.isStyle = true
                    })
                }
            },
            /**
                关闭弹窗
                @param {string} type 弹窗类型
                @return
            */
            closePop(type) {
                if(type == 'gift') {
                    this.isGift = false
                } else if(type == 'style') {
                    this.closeStyle()
                }
            },
            /**
                关闭规格弹窗
                @param 
                @return
            */
            closeStyle() {
                let str = '已选：'
                if(!isEmpty(this.styleCode)) {
                    str += this.styleName
                    if(!isEmpty(this.severCode)) {
                        str += ' '+this.severName
                    } 
                }  
                if(isEmpty(this.styleCode)) {
                    str = '颜色分类/型号/其他'
                }
                this.formatText = (str=='颜色分类/型号/其他')?str:str+' ×'+this.num
                this.isStyle = false
            },
            /**
             * 选择规格
             * @param {object} param 规格
             * @return
             */
            choiceStyle(param) {
                if(param.code == this.styleCode) {
                    this.styleName = ''
                    this.styleCode = ''
                    this.stylePrice = ''
                    this.styleChoose = '请选择规格'
                    return
                } else {
                    this.styleName = param.name
                    this.styleCode = param.code
                    this.stylePrice = param.price
                }
                let str = '已选：'
                if(!isEmpty(this.styleCode)) {
                    str += this.styleName
                    if(!isEmpty(this.severCode)) {
                        str += ' '+this.severName
                    } 
                }  
                if(isEmpty(this.styleCode)) {
                    str = '请选择规格'
                }
                this.styleChoose = str
            },
            /**
             * 选择延保
             * @param {object} param 延保
             * @return
             */
            getService(param) {
                if (param.code == this.severCode) {
                    this.severCode= ''
                    this.severName= ''
                } else {
                    this.severCode= param.code
                    this.severName= param.name
                }
                let str = '已选：'
                if(!isEmpty(this.styleCode)) {
                    str += this.styleName
                    if(!isEmpty(this.severCode)) {
                        str += ' '+this.severName
                    } 
                }  
                if(isEmpty(this.styleCode)) {
                    str = '请选择规格'
                }
                this.styleChoose = str
            },
            /**
                选择购买数量-+
                @param 
                @return
            */
            add() {
                if(parseInt(this.num)>=999){
                    this.num = 999
                    return
                }
                this.num = parseInt(this.num)
                this.num++
            },
            /**
                选择购买数量--
                @param 
                @return
            */
            minus() {
                if(parseInt(this.num)<=1){
                    this.num = 1
                    this.$wm_dialog.tip('最少购买1件哦')
                    return
                }
                this.num = parseInt(this.num)
                this.num--
            },
            /**
                跳转延保
                @param 
                @return
            */
            goInsurance() {
                this.$router.push({path: '../mall/insurance'})
            },
            /**
                校验-数量
                @param
                @return {Boolean} 是否校验通过
            */
            validCheckNum() {
                if (trimStr(this.num) === ''|| this.num<=0) {
                    this.$wm_dialog.tip('请输入购买数量')
                    return false
                }
                return true
            },
            /**
                立即购买
                @param 
                @return
            */
            goBuy() {
                this.$refs.loginCheck.checkToken(()=>{
                    this.buyCheck()
                })
            },
            /**
                购买
                @param 
                @return
            */
            buyCheck() {
                if(!this.isStyle && this.formatText=='颜色分类/型号/其他') {
                    this.isClickTab = true
                    let inter = setInterval(()=>{
                        clearInterval(inter)
                        this.isClickTab = false
                    },200)
                    this.isStyle = true
                    return
                }
                if(this.isStyle && isEmpty(this.styleCode)) {
                    this.$wm_dialog.tip('请先选择规格')
                    return
                }
                let path = `../mall/confirm?goods_code=${this.paramObj.goods_code}&goods_type=3&styleCode=${this.styleCode}&num=${this.num}`
                if(!isEmpty(this.severCode)) {
                    path += `&severCode=${this.severCode}`
                    sessionStorage.wm_service_code = this.severCode
                }
                if(!isEmpty(this.paramObj.referral_code)) {
                    path += `&refCode=${this.paramObj.referral_code}`
                    path += `&refPrice=${this.reducePrice}`
                }
                if(!isEmpty(this.paramObj.sn)) {
                    path += `&sn=${this.paramObj.sn}`
                }
                sessionStorage.wm_goods_code = this.paramObj.goods_code
                sessionStorage.wm_style_code = this.styleCode
                sessionStorage.wm_goods_num = this.num
                this.$router.push({path: encodeURI(path)})
                if(this.isStyle) {
                    this.closeStyle()
                }
                
            },
            
            /**
                客服
                @param
                @return
            */
            call() {
                if (this.browserType == 'app') {
                    appFun(()=> {
                        window.jsInterface.jumpToCustomer(JSON.stringify({type:'CSP0007'}))
                    }, ()=> {
                        window.webkit.messageHandlers.jumpToCustomer.postMessage({type:'CSP0007'})
                    })
                } else {
                    window.location.href = 'tel:400-133-5668'
                }
            },

            /**
                返回商城首页
                @param
                @return
            */
            back() {
                appFun(()=> {
                    window.jsInterface.closeWindow()
                }, ()=> {
                    window.webkit.messageHandlers.closeWindow.postMessage(null)
                })
            },
            /**
             swipe改变事件
             @param {Dom} e 事件参数
             @return
             */
            swipeChange(e){
                this.currentIndex = Number(e) + 1
            },
            
        },
        components: {
            loginCheck,
            mdPopup
        },
        beforeDestroy() {
            window.removeEventListener('scroll',this.pageScroll)
        }
    }
</script>
<style lang='scss' scoped>

    #main {
        position: relative;
        background-color: #f4f5f5;
        .top {
            position: relative;
            background-color: #fff;
        }
        .head_one {
            display: block;
            position: fixed;
            top: 0;
            width: 100%;
            padding: 0.14rem; padding-top: 0.2rem;
            z-index: 10;
            img:nth-of-type(1) {
                position: absolute;
                left: 0.14rem; top: 0.09rem;
                width: 0.34rem; height: 0.34rem;
            }
        }
        .head_two {
            display: none;
            position: fixed;
            top: 0; left: 0;
            height: 0.44rem; width: 100%;
            background-color: #fff;
            z-index: 2;
            box-sizing: content-box;
            .head_two_box {
                position: relative;
                height: 0.44rem; width: 100%;
                .back_btn {
                    position: absolute;
                    top: 0; bottom: 0; left: 0;
                    margin: auto;
                    padding: 0.12rem;
                    width: 0.09rem; height: 0.15rem;
                    box-sizing: content-box;
                }
                .head_box {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    margin: auto;
                    width: 1.08rem; height: 0.44rem;
                    .headItem {
                        position: absolute;
                        top: 0;
                        width: 0.36rem; height: 0.44rem;
                        .headItemText {
                            position: absolute;
                            bottom: 0.11rem; left: 0; right: 0;
                            height: 0.25rem;
                            text-align: center; line-height: 0.25rem;
                            font-size: 0.16rem;
                            color: #999;
                        }
                    }
                    .headItem.acive{
                        .headItemText {
                            font-size: 0.16rem; font-weight: bold;
                            color: #333;
                        }
                        .headItemMark {
                            position: absolute;
                            bottom: 0.04rem; left: 0; right: 0;
                            margin: auto;
                            width: 0.18rem; height: 0.02rem;
                            border-bottom: 0.02rem solid #ff2c79; border-radius: 0.02rem;
                        }
                    }
                    .headItem:nth-child(1) {
                        left: 0;
                    }
                    .headItem:nth-child(2) {
                        right: 0;
                    }
                }
            }
        }
        #banner {
            position: relative;
            width: 100%; height: auto;
            .van-swipe {
                position: relative;
                height: 3.75rem;; width: 100%;
                .banner_list {
                    display: block;
                    width: 100%; height: 3.75rem;
                }
                >>>.van-swipe__indicators {
                    display: none !important;
                }
            }
            .currentItem{
                position: absolute;
                bottom: 0.12rem; right: 0.12rem;
                padding: 0 0.1rem;
                height: 0.2rem; 
                border-radius: 0.02rem;
                line-height: 0.2rem; text-align: center;
                font-size: 0.12rem; color: #fff;
                background-color: rgba(0, 0, 0, 0.3462);
            }
        }
        .activity {
            position: relative;
            padding-left: 0.12rem;
            height: 0.29rem;
            line-height: 0.29rem;
            font-size: 0.12rem; color: #fff;
            background: linear-gradient(44deg, #FFB8C6 0%, #F15676 100%);
        }
        #noUse {
            display: none;
            position: absolute;
            top: 50%; left: 50%;transform: translate(-50%,-50%);
            text-align:center;
            >img {
                display: block;
                margin: auto;
                height: auto; width: 1.15rem;
            }
            >p:nth-of-type(1) {
                width: 3rem;
                line-height: 0.43rem; text-align: left;
                color: #999;
                font-size: 0.16rem;
            }
            >p {
                width: 3rem;
                line-height: 0.43rem; text-align: left;
                color: #999;
                font-size: 0.16rem;
                >a {
                    display: inline-block;
                    color: #4cc7fe;
                }
            }
            >p:nth-of-type(2) {
                width: 3rem;
                text-indent: 0.32rem;
            }
        }
        .price_sale {
            position: relative;
            .price {
                margin-top: 0.16rem;
                height: 0.24rem;
                line-height: 0.24rem;
                span:nth-child(1) {
                    font-size: 0.18rem;
                }
                span:nth-child(2) {
                    font-size: 0.26rem; 
                }
                span:nth-child(3) {
                    margin-left: 0.08rem;
                    font-size: 0.13rem; color: #999;
                    text-decoration: line-through;
                }
            }
        }
        .title {
            margin-top: 0.12rem;
            line-height: 0.24rem;vertical-align: middle;
            font-size: 0.16rem; font-weight: bold;
        }
        .list {
            position: relative;
            padding: 0 0.12rem;
            background-color: #fff;
            .list_tit {
                width: 0.46rem; height: 0.4rem;
                line-height: 0.4rem;
                font-size: 0.13rem; color: #999;
            }
            .next {
                position: absolute;
                top: 0; bottom: 0; right: 0.12rem;
                margin: auto;
                width: 0.07rem; height: 0.12rem;
            }
        }
        .list_nomal {
            position: relative;
            display: flex;
            align-items: center;
            min-height: 0.4rem;
        }
        .gift {
            img:nth-of-type(1) {
                margin-right: 0.08rem;
                width: 0.3rem; height: 0.15rem;
            }
            .gift_det {
                max-width: 2.65rem;
                font-size: 0.14rem;
            }
        } 

        .norms {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            min-height: 0.4rem;
            .goods_cho {
                padding: 0.12rem 0;
                width: 2.9rem;
                line-height: 0.18rem;
                font-size: 0.13rem;
            }
        }

        .middle {
            position: relative;
            margin-top: 0.1rem; padding: 0 0.12rem;
            background-color: #fff;
            .address {
                padding: 0;
                border-bottom: 0.01rem solid #f4f4f4;
                div:not(.list_tit) {
                    line-height: 1;
                    font-size: 0.14rem;
                }
                .add_from {
                    margin-left: 0.55rem;
                    font-size: 0.14rem;
                }
                .sale {
                    position: absolute;
                    top: 0; right: 0; bottom: 0;
                    margin: auto;
                    height: 0.2rem;
                    line-height: 0.2rem;
                    font-size: 0.14rem; color: #999;
                }
            }

            .service_con {
                padding: 0.11rem 0;
                .service_style {
                    display: flex;
                    width: 3.51rem; height: auto;
                    .list_tit {
                        height: 0.2rem;width: 0.46rem; 
                        line-height: 0.2rem;
                        font-size: 0.13rem; color: #999;
                    }
                    .service_style_box {
                        width: 3.05rem; 
                        .service_style_item {
                            position: relative;
                            display: inline-block;
                            margin-bottom: 0.04rem;
                            width: 50%; height: 0.2rem;
                            line-height: 0.2rem;
                            img {
                                position: absolute;
                                top: 0; bottom: 0; left: 0;
                                margin: auto;
                                width: 0.13rem; height: 0.13rem;
                            }
                            span {
                                display: block;
                                margin-left: 0.18rem;height: 0.2rem;
                                line-height: 0.2rem;
                                font-size: 0.13rem; color: #333;
                            }
                        }
                        >span {
                            margin-right: 0.2rem;
                            font-size: 0.12rem;
                        }
                        >span:last-child {
                            margin-right: 0;
                        }
                    }
                }
                >div:nth-child(2) {
                    margin-top: 0.1rem;
                    line-height: 0.17rem;
                }
                .add_info { 
                    span {
                        font-size: 0.12rem;
                    }
                    span:nth-child(2) {
                        margin-left: 0.04rem;
                        color: #999;
                    }
                    a {
                        margin-left: 0.02rem;
                        font-size: 0.12rem; text-decoration: none;
                    }
                }
                
            }
        }

        .detail_quest {
            margin-top: 0.1rem;
            background-color: #fff;
            .detail_title {
                padding-left: 0.12rem;
                height: 0.46rem; line-height: 0.46rem;
                font-size: 0.15rem; color: #333; font-weight: 550;
                border-bottom: 0.01rem solid #EFEFEF;
            }
            .detail {
                padding: 0 0 0.6rem 0;
                img {
                    display: block;
                    width: 100%; height: auto;
                }
            }
        }

        .btn {
            position: fixed;
            bottom: 0; left: 0;
            width: 100%; height: 0.55rem;
            background-color: #fff;
            box-shadow: 0px 4px 16px 0px rgba(102, 102, 102, 0.26);
            .call_btn {
                height: 0.55rem;
                padding-left: 0.23rem;
                display: inline-flex;
                align-items: center;
                img {
                    display: block;
                    width: 0.2rem; height: 0.23rem;
                }
                span {
                    margin-left: 0.04rem;
                    font-size: 0.14rem;
                }
            }
            .buy_btn {
                position: absolute;
                top: 0.07rem; right: 0.12rem;
                width: 2.6rem; height: 0.4rem;
                line-height: 0.4rem; text-align: center;
                font-size: 0.16rem; color: #fff;               
                border-radius: 0.2rem;
            }
            .buy_btn_wchat {
                position: absolute;
                top: 0.07rem; right: 0; left: 0;
                margin: auto;
                width: 3.5rem;
            }
        }
        
        .back {
            position: fixed;
            bottom: 1rem; left: 0;
            height: 0.3rem;
            z-index: 1;
        }
    }

    /* 弹窗 */
    .pop_box {
        position: relative;
        height: 5.33rem; width: 100%;
        .pop_title {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 0.52rem;
            line-height: 0.52rem; text-align: center;
            font-size: 0.15rem; font-weight: bold;
            background-color: #fff;
            z-index: 1;
        }
        .pop_btn {
            position: absolute;
            bottom: 0; left: 0;
            height: 0.55rem; width: 100%;
            border-top: 0;
            background-color: transparent;
            box-shadow: 0rem 0.04rem 0.16rem 0rem rgba(102, 102, 102, 0.26);
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
    /* 活动弹窗 */
    .gift_box {
        position: relative;
        padding: 0.64rem 0.12rem 0 0.12rem;
        height: 4.1rem;
        box-sizing: content-box;
        overflow-y: auto;
        img {
            display: block;
            width: 0.3rem; height: 0.17rem;  
        }
        div {
            margin-top: 0.06rem;
            line-height: 0.2rem;
            font-size: 0.14rem;
        }
    }

    /* 规格弹窗 */
    .style_pop {
        position: relative;
        padding: 0 0.16rem;
        .cancle {
            position: absolute; 
            right: 0.1rem; top: 0.1rem;
            padding: 0.1rem;
            width: 0.12rem; height: 0.12rem;
            z-index: 2;
            box-sizing: content-box;
        }
        .style_con {
            position: absolute;
            top: 0.24rem; left: 0;
            padding: 0 0.16rem 0 0.16rem; margin-bottom: 0.7rem;
            width: 100%; height: 4.5rem;
            overflow-y: auto;
            .info {
                position: relative;
                padding-bottom: 0.24rem;
                height: 1.34rem; width: 100%;
                border-bottom: 1px solid rgba(239,239,239,0.6);
                transition: all 1s linear;
                img {
                    position: absolute;
                    top: 0; left: 0;
                    width:1.1rem; height:1.1rem;
                    border-radius: 0.05rem;
                }
                >div {
                    position: absolute;
                    bottom: 0.24rem; left: 1.22rem;
                    width: 2.21rem; min-height: 0.48rem;
                    div:nth-of-type(1) {
                        margin-bottom: 0.08rem;
                        line-height: 0.22rem;
                        font-size: 0.18rem;
                    }
                    div:nth-child(2) {
                        line-height: 0.18rem;
                        font-size: 0.13rem;
                    }
                }
            }
            .item_tit {
                padding: 0.15rem  0 0.16rem 0;
                line-height: 0.2rem;
                font-size: 0.14rem;
            }
            .style {
                position: relative;
                padding-bottom: 0.06rem;
                width: 100%;
                z-index: 2;
                border-bottom: 1px solid rgba(239,239,239,0.6);
                .style_item {
                    display: inline-flex;
                    align-items: center; justify-content: center;
                    padding: 0 0.14rem; margin: 0 0.08rem 0.08rem 0;
                    line-height: 0.32rem;
                    border-radius: 0.04rem;
                    border: 0.5px solid transparent;
                    background-color: #F6F6F6;
                    span {
                        font-size: 0.13rem;
                    }
                }
                div:not(.item_tit) {
                    span:last-of-type {
                        margin-right: 0;
                    }
                }
                .act {
                    border-color: #FF2C7D;
                    background-color: rgba(239,94,143,0.07);
                }
            }
            .insure {
                position: relative;
                width: 100%;
                .item_tit {
                    padding-top: 0.23rem;
                }
                .insure_box {
                    div {
                        display: inline-block;
                        padding: 0 0.08rem; margin: 0 0.08rem 0.08rem 0;
                        line-height: 0.32rem;
                        font-size: 0.13rem;
                        border-radius: 0.04rem;
                        border: 1px solid transparent;
                        background-color: #F6F6F6;
                    }
                    span {
                        font-size: 0.13rem;
                    }
                    span:last-of-type {
                        margin-right: 0;
                    }
                    .actInsure {
                        border-color: #FF2C7D;
                        background-color: rgba(239,94,143,0.07);
                        span {
                            color: #FF2C7D;
                        }
                    }
                }
                .desc_btn{
                    display: flex;
                    align-items: center;
                    position: absolute;
                    top: 0.25rem; right: 0;
                    height: 0.16rem;
                    img {
                        display: block;
                        width: 0.1rem; height: 0.1rem;
                    }
                    div {
                        margin-right: 0.04rem;
                        font-size: 0.11rem;
                    }
                }
            }


            .buy_num {
                position: relative;
                padding: 0.21rem 0 0.48rem;
                height: 0.26rem; width: 100%;
                box-sizing: content-box;
                .item_tit {
                    padding: 0;
                    height: 0.26rem;
                    line-height: 0.26rem;
                    font-size: 0.14rem;
                }
                .num_btn {
                    display: flex;
                    align-items: center;
                    position: absolute;
                    top: 0.21rem; right: 0;
                    height: 0.26rem;
                    img {
                        display: block;
                        height: 0.26rem; width: 0.26rem;
                    }
                    input {
                        display: block;
                        height: 0.26rem; width: 0.5rem;
                        text-align: center; line-height: 0.26rem;
                        font-size: 0.16rem; color: #666;
                        border: none; outline: none;
                    }
                }
            }

        }
    }

    ::-webkit-scrollbar{
        width: 0 !important; height: 0 !important; 
        color: transparent !important;
    }

    .download_img {
        position: relative;
        background-color: #F6F6F6;
        >div {
            height: 0.51rem; width: 100%;
            line-height: 0.51rem; text-align: center;
            font-size: 0.18rem;
            background-color: #fff;
        }
        >.cancle_btn {
            margin-top: 0.06rem;
            height: 0.48rem; width: 100%;
            line-height: 0.48rem; text-align: center;
            background-color: #fff;
        }
    }
    .image_preview {
        z-index: 20;
        >>>.van-image-preview {
            z-index: 21 !important;
        }
        >>>.van-image-preview__overlay {
            background-color: rgba(0,0,0,1) !important;
        }
        >>>.van-overlay {
            z-index: 20 !important;
            background-color: rgba(0,0,0,1) !important;
        }
    }
</style>
