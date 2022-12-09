/**
 * 文件描述：字节处理插件
 * 创建人：赵志银
 * 创建时间：2019-03-14
*/

//支付方式
const Dict_pay = {
    ALI: '0', //支付宝支付
    WECHAT: '1', //微信支付
    //2 - 银联、3 - Apple Pay、4 - 免费支付、5 - 余额
    FREEPAY: '4',   //免费支付
    BILLOWS: '5'  //余额
}
//支付成功来源
const Dict_PaySuccess = {
    PAY: 'pay_center_bar', //支付成功
    APPOINT: 'appoint_center_bar' //预约成功
}
//商品链接来源
const Dict_GoodsType = {
    ORDINARY: '1',//普通商品
    RECOMMEND: '3'//推荐商品
}
//项目类型
const Dict_Product = {
    //1 - 考试、2 - 课程、3 - 专栏、4 - 会议门票、5 - 会议讲义、6 - 评估、7 - 余额 、8 - 方案、9 - 定制方案、10 - 会议视频、11 - 直播 12-澜渟设备
    RECOVERY_PRODUCT: '13', //上门产康-项目
    RECOVERY_SERVICE: '14' //上门产康-服务
}
//预约类型
const Dict_Appoint = {
    SHOP: '1', //到店服务
    HOME: '2', //上门服务
    ALL: '0' //到店服务/上门服务
}
//订单状态
const Dict_OrderStatus = {
    PAY: '1', //已付款
    PREBACK: '3', //申请退款中
    BACK: '4' //已退款
}
//抬头类型
const Dict_InvoiceHead = {
    PERSON: '0', //个人
    COMPANY: '1' //单位
}
//发票类型
const Dict_InvoiceType = {
    COMMON: '0', //普通发票
    VAT: '1' //增值税专用发票
}
//优惠券来源
const Dict_CouponSource = {
    COURSE: '2', //课程
    COLUMN: '3',    //专栏
    LIVE: '11', //直播 
    ACTUAL: '12'    //实物商品
}
// 实物商品订单状态
const Dict_ActualStatus = {
    ONWAY: '0', //在途中
    RECEIVED: '1', //已揽收
    KIND: '2', //疑难
    SIGNED: '3', //已签收
    REFUNED: '4', //退签
    DISPATCHED: '5', //同城派送中
    RETUENED: '6', //退回
    BILSLAD: '7' //转单
}
// 发票申请状态
const Dict_Inv = {
    PEND: '0', //待申请
    AUDITING: '1', //审核中
    AUDITED: '2', //审核通过
    ISSUING: '3', //发放中
    ISSUIED: '4' //已发放
}
// H5商城订单状态
const Dict_Order = {
    SHIPPED: '0', //待发货
    RECEIVED: '1', //待收货
    COMPLETED: '2', //已完成
}
// 实名认证
const Dict_RealName = {
    REALNAMENEVER: '0', //未实名认证
    REALNAMEIN: '1', //实名认证中
    REALNAMEHAS: '2', //已实名认证
    REALNAMEFAIL: '3', //实名认证失败
}
// 分娩次数
const deliverCount = {
    NOFILED: '-1', //未填写
    UNFERTILITY: '0', //未生育
    TIRE: '1', //一胎
    CHILDSECOND: '2', //二胎
    TRIPLET: '3', //三胎及以上
}
// 流产次数
const abortionCount = {
    NOFILED: '-1', //未填写
    NONABORTION: '0', //0次
    ONCEABORTION: '1', //1次
    TWICEABORTION: '2', //2次
    MULTIPABORTION: '3', //3次及以上
}

/**
    实名认证
    @param {Number}val 字典值
    @return {String} 字典描述
*/
const getRealName = function (val) {
    if (val == Dict_RealName.REALNAMENEVER) {
        return '未实名认证'
    } else if (val == Dict_RealName.REALNAMEIN) {
        return '实名认证中'
    } else if (val == Dict_RealName.REALNAMEHAS) {
        return '已实名认证'
    } else if (val == Dict_RealName.REALNAMEFAIL) {
        return '实名认证失败'
    }
    return val
}
/**
    预约类型
    @param {Number}val 字典值
    @return {String} 字典描述
*/
const getAppointType = function(val) {
    if (val == Dict_Appoint.ALL) {
        return '到店服务/上门服务'
    } else if (val == Dict_Appoint.SHOP) {
        return '到店服务'
    } else if (val == Dict_Appoint.HOME) {
        return '上门服务'
    }
    return val
}
/**
    订单状态
    @param {Number}val 字典值
    @return {String} 字典描述
*/
const getOrderStatus = function(val) {
    if (val == Dict_OrderStatus.PAY) {
        return '已付款'
    } else if (val == Dict_OrderStatus.PREBACK) {
        return '申请退款中'
    } else if (val == Dict_OrderStatus.BACK) {
        return '已退款'
    }
    return val
}
/**
    服务状态
    @param {Number}val 字典值
    @return {String} 字典描述
*/
const getServerStatus = function(val) {
    if (val == '0') {
        return '待服务'
    } else if (val == '1') {
        return '待评价'
    } else if (val == '2') {
        return '服务完成'
    }
    return val
}
/**
    预约状态
    @param {Number}val 字典值
    @return {String} 字典描述
*/
const getAppointStatus = function(val) {
    if (val == '0') {
        return '不可预约'
    } else if (val == '1') {
        return '可预约'
    }
    return val
}
/**
    获取抬头类型
    @param {Number}val 字典值
    @return {String} 字典描述
*/
const getInvoiceHead = (val)=> {
    if (val == Dict_InvoiceHead.PERSON) {
        return '个人'
    } else if (val == Dict_InvoiceHead.COMPANY) {
        return '单位'
    }
    return val
}
/**
    获取支付类型
    @param {Number}val 字典值
    @return {String} 字典描述
*/
const getPayType = (val)=> {
    if (val == Dict_pay.ALI) {
        return '支付宝支付'
    } else if (val == Dict_pay.WECHAT) {
        return '微信支付'
    } else if (val == Dict_pay.FREEPAY) {
        return '免费支付'
    } else if (val == Dict_pay.BILLOWS) {
        return '余额支付'
    }
    return val
}
/**
    获取实物商品快递状态
    @param {Number}val 字典值
    @return {String} 字典描述
*/
const getActualStatus = (val)=> {
    if (val == Dict_ActualStatus.ONWAY) {
        return '在途中'
    } else if (val == Dict_ActualStatus.RECEIVED) {
        return '已揽收'
    } else if (val == Dict_ActualStatus.KIND) {
        return '疑难'
    } else if (val == Dict_ActualStatus.SIGNED) {
        return '已签收'
    } else if (val == Dict_ActualStatus.REFUNED) {
        return '退签'
    } else if (val == Dict_ActualStatus.DISPATCHED) {
        return '同城派送中'
    } else if (val == Dict_ActualStatus.RETUENED) {
        return '退回'
    } else if (val == Dict_ActualStatus.BILSLAD) {
        return '转单'
    }
    return val
}
/**
    发票申请状态
    @param {Number}val 字典值
    @return {String} 字典描述
*/
const getInv = (val)=> {
    if (val == Dict_Inv.PEND) {
        return '待申请'
    } else if (val == Dict_Inv.AUDITING) {
        return '审核中'
    } else if (val == Dict_Inv.AUDITED) {
        return '审核通过'
    } else if (val == Dict_Inv.ISSUING) {
        return '开票中'
    } else if (val == Dict_Inv.ISSUIED) {
        return '已开票'
    } 
    return val
}
/**
    获取发票类型
    @param {Number}val 字典值
    @return {String} 字典描述
*/
const getInvoiceType = (val)=> {
    if (val == Dict_InvoiceType.COMMON) {
        return '普通发票'
    } else if (val == Dict_InvoiceType.VAT) {
        return '增值税专用发票'
    }
    return val
}
/**
    H5商城订单状态
    @param {Number}val 字典值
    @return {String} 字典描述
*/
const getOrder = (val)=> {
    if (val == Dict_Order.SHIPPED) {
        return '待发货'
    } else if (val == Dict_Order.RECEIVED) {
        return '已发货'
    } else if (val == Dict_Order.COMPLETED) {
        return '已完成'
    }
    return val
}

/**
    分娩次数
    @param {Number}val 字典值
    @return {String} 字典描述
*/
const getDeliverCount = (val)=> {
    if (val == deliverCount.NOFILED) {
        return ''
    } else if (val == deliverCount.UNFERTILITY) {
        return '未生育'
    } else if (val == deliverCount.TIRE) {
        return '一胎'
    } else if (val == deliverCount.CHILDSECOND) {
        return '二胎'
    } else if (val == deliverCount.TRIPLET) {
        return '三胎及以上'
    }
    return val
}
/**
    流产次数
    @param {Number}val 字典值
    @return {String} 字典描述
*/
const getAbortionCount = (val)=> {
    if (val == abortionCount.NOFILED) {
        return ''
    } else if (val == abortionCount.NONABORTION) {
        return '0次'
    } else if (val == abortionCount.ONCEABORTION) {
        return '1次'
    } else if (val == abortionCount.TWICEABORTION) {
        return '2次'
    } else if (val == abortionCount.MULTIPABORTION) {
        return '3次及以上'
    }
    return val
}

export {Dict_pay, Dict_PaySuccess, Dict_Product, Dict_Appoint, Dict_OrderStatus, Dict_Order, getAppointType, getOrderStatus, getServerStatus, getAppointStatus, Dict_InvoiceHead, Dict_InvoiceType, getInvoiceHead, Dict_CouponSource, getPayType, getActualStatus, Dict_Inv, getInv, getInvoiceType, getOrder, Dict_RealName, getRealName, deliverCount, getDeliverCount, abortionCount, getAbortionCount}
