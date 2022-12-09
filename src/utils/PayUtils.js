/**
 * 文件描述：支付插件
 * 创建人：赵志银
 * 创建时间：2019-03-14
*/

import {getBrowserType, appFun, isEmpty} from '@/utils/CommonUtils.js'

/**
    实物商品支付
    @param {String}price 支付金额
    @param {String}product_code 商品编号
    @param {String}service_code 服务编号
    @param {String}goods_count 商品数量
    @param {String}referral_code 推荐码
    @param {String}sn 推荐渠道
    @param {String}coupon_code 优惠券code
    @param {String}product_tag_code 规格标签code
    @param {String}product_tag 规格标签名称
    @param {String}name 收货人姓名
    @param {String}phone 收货人手机号
    @param {String}addr 收货人地址
    @param {String}remark 订单留言
    @param {String}gold 余额
    @param {String}time 下单时间
    @param {String}goodstype 商品类型
    @return
*/
const goodsPay = (price,product_code,service_code,goods_count,coupon_code,product_tag_code,product_tag,name,phone,addr,remark,referral_code,sn,gold,time,goodstype)=> {
    if (getBrowserType() == 'app') {
        const successUrl = host_path+'pay/success?'
        +'wm_price='+price
        +'&wm_product_code='+product_code
        +'&wm_service_code='+service_code
        +'&wm_goods_count='+goods_count
        +'&wm_coupon_code='+coupon_code
        +'&wm_product_tag_code='+product_tag_code
        +'&wm_product_tag='+product_tag
        +'&wm_name='+name
        +'&wm_phone='+phone
        +'&wm_addr='+addr
        +'&wm_remark='+remark
        +'&wm_referral_code='+referral_code
        +'&wm_sn='+sn
        +'&wm_goodstype='+goodstype
        appMallPay(
            successUrl,
            host_path+'pay/error',
            host_path+'pay/cancel',
            price,
            '12',
            product_code,
            service_code,
            goods_count,
            coupon_code,
            product_tag_code,
            product_tag,
            name,
            phone,
            addr,
            remark,
            referral_code,
            sn,
            goodstype
        )
    } else {
        let path = pay_url+'mall/product?t='+new Date().getTime()
        +'&wm_token='+localStorage.wm_token
        +'&wm_price='+price
        +'&wm_product_code='+product_code
        +'&wm_service_code='+service_code
        +'&wm_goods_count='+goods_count
        +'&wm_coupon_code='+coupon_code
        +'&wm_product_tag_code='+product_tag_code
        +'&wm_product_tag='+product_tag
        +'&wm_name='+name
        +'&wm_phone='+phone
        +'&wm_addr='+addr
        +'&wm_remark='+remark
        +'&wm_referral_code='+referral_code
        +'&wm_sn='+sn
        +'&wm_gold='+gold
        +'&wm_time='+time
        +'&wm_goodstype='+goodstype
        if (!isEmpty(sessionStorage.wm_wechat_openid)) {
            path += '&wm_wechat_openid='+sessionStorage.wm_wechat_openid
        }
        window.location.href = encodeURI(path)
    }
}
/**
    appH5商城支付
    @param {String}successUrl 支付成功跳转链接
    @param {String}errorUrl 支付失败跳转链接
    @param {String}cancelUrl 支付取消跳转链接
    @param {String}price 支付金额
    @param {String}product_type 商品类型
    @param {String}product_code 商品编号
    @param {String}service_code 服务编号
    @param {String}goods_count 商品数量
    @param {String}coupon_code 优惠券code
    @param {String}product_tag_code 规格标签code
    @param {String}product_tag 规格标签名称
    @param {String}name 收货人姓名
    @param {String}phone 收货人手机号
    @param {String}addr 收货人地址
    @param {String}remark 订单留言
    @param {String}referral_code 推荐码
    @param {String}sn 渠道号
    @param {String}goodstype 商品类型
    @return
*/
const appMallPay = (successUrl,errorUrl,cancelUrl,price,product_type,product_code,service_code,goods_count,coupon_code,product_tag_code,product_tag,name,phone,addr,remark,referral_code,sn,goodstype)=> {
    appFun(()=> {
        window.jsInterface.mallPay(
            successUrl,
            errorUrl,
            goodstype,
            price,
            product_type,
            product_code,
            service_code,
            goods_count,
            coupon_code,
            product_tag_code,
            product_tag,
            name,
            phone,
            addr,
            remark,
            referral_code,
            sn
        )
    }, ()=> {
        window.webkit.messageHandlers.mallPay.postMessage([
            successUrl,
            errorUrl,
            cancelUrl,
            price,
            product_type,
            product_code,
            service_code,
            goods_count,
            coupon_code,
            product_tag_code,
            product_tag,
            name,
            phone,
            addr,
            remark,
            referral_code,
            sn,
            goodstype
        ])
    })
}

export {goodsPay}