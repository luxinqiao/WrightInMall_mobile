const routes = [{
        path: '/404',
        component: (resolve) => require(['@/page/error/404'], resolve)
    },{
        path: '/mall',
        component: (resolve) => require(['@/page/sys/Index'], resolve),
        children: [{
            path: 'index', // 商城首页
            component: (resolve) => require(['@/page/main/mall/index'], resolve),
            meta: {
                keepAlive: true, 
                isBack: false
            }
        },{
            path: 'details', // 商品详情
            component: (resolve) => require(['@/page/main/mall/details'], resolve)
        },{
            path: 'confirm', // 确认订单
            component: (resolve) => require(['@/page/main/mall/confirm'], resolve)
        },{
            path: 'logistics', //物流
            component: (resolve) => require(['@/page/main/mall/logisticsDetail'], resolve)
        },{
            path: 'invoiceSee', //申请开票
            component: (resolve) => require(['@/page/main/mall/invoiceSee'], resolve)
        },{
            path: 'invoiceDetail', //开票详情
            component: (resolve) => require(['@/page/main/mall/invoiceDetail'], resolve)
        },{
            path: 'insurance', //延保说明
            component: (resolve) => require(['@/page/main/mall/insurance'], resolve)
        },{
            path: 'invoiceRules', //发票规则
            component: (resolve) => require(['@/page/main/mall/invoiceRules'], resolve)
        },{
            path: 'reDetail', // 商品详情-推荐
            component: (resolve) => require(['@/page/main/mall/refDetail/reDetail'], resolve)
        }]
    },{
        path: '/pay',
        component: (resolve) => require(['@/page/sys/Index'], resolve),
        children: [{
            path: 'success', //支付成功
            component: (resolve) => require(['@/page/main/pay/success'], resolve)
        },{
            path: 'cancel', //支付取消
            component: (resolve) => require(['@/page/main/pay/cancel'], resolve)
        },{
            path: 'error', //支付失败
            component: (resolve) => require(['@/page/main/pay/error'], resolve)
        }]
    },{
        path: '/login', //登录
        component: (resolve) => require(['@/page/sys/Index'], resolve),
        children: [{
            path: 'index',
            component: (resolve) => require(['@/page/main/login/index'], resolve)
        }]
    },{
        path: '/my', //我的
        component: (resolve) => require(['@/page/sys/Index'], resolve),
        children: [
            {
            path: 'index', //我的-主页
            component: (resolve) => require(['@/page/main/my/index'], resolve)
        }, {
            path: 'feedback', //我的-意见反馈
            component: (resolve) => require(['@/page/main/my/information/feedback'], resolve)
        }, {
            path: 'aboutUs', //设置-关于我们
            component: (resolve) => require(['@/page/main/my/setting/aboutUs'], resolve)
        }, {
            path: 'setting', //我的-设置
            component: (resolve) => require(['@/page/main/my/setting/setting'], resolve)
        }, {
            path: 'userAgreement', //设置-用户协议
            component: (resolve) => require(['@/page/main/my/setting/userAgreement'], resolve)
        }, {
            path: 'appoint/addressList', //我的-地址管理
            component: (resolve) => require(['@/page/main/my/appoint/addressList'], resolve)
        }, {
            path: 'appoint/addressAdd', //我的-地址新增
            component: (resolve) => require(['@/page/main/my/appoint/addressAdd'], resolve)
        }, {
            path: 'appoint/addressModify', //我的-地址编辑
            component: (resolve) => require(['@/page/main/my/appoint/addressModify'], resolve)
        }, {
            path: 'msgNotice', //我的-消息通知
            component: (resolve) => require(['@/page/main/my/information/msgNotice'], resolve)
        },{
            path: 'personalInfo', //我的-个人信息
            component: (resolve) => require(['@/page/main/my/information/personalInformation'], resolve)
        }, {
            path: 'personalInfo/change', //个人信息-个性签名/个人简介修改
            component: (resolve) => require(['@/page/main/my/information/personalInfo/change'], resolve),
        }, {
            path: 'invoiceList', //我的-发票头管理
            component: (resolve) => require(['@/page/main/my/invoice/invoiceList'], resolve)
        }, {
            path: 'invoiceAdd', //我的-发票头新增
            component: (resolve) => require(['@/page/main/my/invoice/invoiceAdd'], resolve)
        }, {
            path: 'invoiceEdit', //我的-发票头修改
            component: (resolve) => require(['@/page/main/my/invoice/invoiceEdit'], resolve)
        }, {
            path: 'coupon/couponUse', //我的-优惠券可用
            component: (resolve) => require(['@/page/main/my/coupon/couponUse'], resolve)
        }, {
            path: 'coupon/couponNot', //我的-优惠券不可用
            component: (resolve) => require(['@/page/main/my/coupon/couponNot'], resolve)
        }, {
            path: 'wallet', //我的-钱包
            component: (resolve) => require(['@/page/main/my/wallet/wallet'], resolve)
        }, {
            path: 'order/list', //我的-订单列表
            component: (resolve) => require(['@/page/main/my/order/list'], resolve)
        }, {
            path: 'order/detail', //我的-订单详情
            component: (resolve) => require(['@/page/main/my/order/detail'], resolve)
        }, {
            path: 'order/receiveSuccess', //我的-订单-收货成功
            component: (resolve) => require(['@/page/main/my/order/receiveSuccess'], resolve)
        }
     ]
    },{
        path: '/college', //极致学院
        component: (resolve) => require(['@/page/sys/Index'], resolve),
        children: [{
            path: 'login',
            component: (resolve) => require(['@/page/main/college/login'], resolve)
        },{
            path: 'detail',
            component: (resolve) => require(['@/page/main/college/detail'], resolve)
        },{
            path: 'payResult',
            component: (resolve) => require(['@/page/main/college/payResult'], resolve)
        }]
    }
]

export {routes}
