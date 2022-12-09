/**
 * 文件描述：请求头
 * 创建人：赵志银
 * 创建时间：2019-03-14
*/
import {getBrowserType,getAppStyle} from '@/utils/CommonUtils.js'

/** 全局数据 **/
const wm_data = {
    title: '', //标题名称
    setHeader:({title='商城',isShow=true,back=true,share=false})=> {
        wm_data.title = title
        if(wm_data.browserType == 'wechat') {
            document.title = title
            wm_data.hasHeader = false
            document.getElementById('wm_contain').style.paddingTop = 0
        } else {
            wm_data.hasHeader = isShow
            wm_data.back = back
            wm_data.share = share
            if(!isShow) {
                document.getElementById('wm_contain').style.paddingTop = 0
            } else {
                document.getElementById('wm_contain').style.paddingTop = Math.floor(document.body.offsetWidth/375*44)+'px'
            }
        }
    },
    browserType: getBrowserType(), //浏览器环境(wechat/app/browser)
    appType: '', //app类型(android/ios)
    hasHeader: true, //显示头部
    back: true,
    share: false,
    setFooter: true, //显示底部
    REQUESTAPP: getAppStyle(), //身份(1:澜渟,3:澜渟医生)
    REQUESTCLIENT: '',//4.web,6.公众号
    VERSIONFORAPP: '',
    stopCheckSign: false, //阻止接口发送验签
    isResponse: false //是否接口响应
}

export {wm_data}
