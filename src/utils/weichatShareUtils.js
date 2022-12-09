import axios from 'axios'
import wx from 'weixin-js-sdk'
							
function getJSSDK(shareUrl,dataForWeixin) {
    axios.post(c_request+'v1/wechat/jssdk',{url:shareUrl}).then(res => {
        if (res.code == '200' && res.data && wx) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.data.appid, // 必填，公众号的唯一标识
                timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                signature: res.data.signature, // 必填，签名
                jsApiList:[
                        'onMenuShareTimeline', 
                        'onMenuShareAppMessage',
                        'hideMenuItems'
                    ] // 必填，需要使用的JS接口列表
            })
            wx.ready(function () {
                // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                wx.hideMenuItems({
                    menuList: [
                        'menuItem:share:qq',
                        'menuItem:share:weiboApp',
                        'menuItem:share:facebook',
                        'menuItem:share:QZone',
                        "menuItem:copyUrl"
                    ] 
                });
                //分享给微信朋友
                wx.onMenuShareAppMessage({
                    title: dataForWeixin.title,
                    desc: dataForWeixin.des,
                    link: dataForWeixin.linkurl,
                    imgUrl: dataForWeixin.img,
                    success: function success(res) {
                        console.log('已分享');
                    },
                    cancel: function cancel(res) {
                        console.log('已取消');
                    },
                    fail: function fail(res) {
                        console.log(JSON.stringify(res));
                    }
                });
                // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareTimeline({
                    title: dataForWeixin.title,
                    link: dataForWeixin.linkurl,
                    imgUrl: dataForWeixin.img,
                    success: function success(res) {
                        //alert('已分享');
                    },
                    cancel: function cancel(res) {
                        //alert('已取消');
                    },
                    fail: function fail(res) {
                        console.log(JSON.stringify(res));
                    }
                });
            })
            wx.error(function (res) {
                
            });
        }
    })
}
export default {getJSSDK}
