import {convert23} from '@/utils/CommonUtils.js'

/**
    去除字符串左右空格
    @param {String} backUrl 回调链接
    @return {String}
*/
const wechatAuthorize = (backUrl)=> {
    window.location.replace(c_request+'v1/wechat/login?back_url='+convert23(host_path)+backUrl)
}

export {wechatAuthorize}