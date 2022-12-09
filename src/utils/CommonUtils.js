/**
 * 文件描述：普通插件
 * 创建人：赵志银
 * 创建时间：2019-03-14
*/

/**
    去除字符串左右空格
    @param {String}str 原字符串
    @return {String} 去除左右空格后的字符串
*/
const trimStr = function(str) {
	if (str === undefined || str === 'undefined') {
		return ''
	}
	if (typeof(str) == 'number') {
		str = str.toString()
	}
    return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'')
}
/**
    是否为空
    @param {String} a 变量
    @return {Boolean} 是否为空
*/
const isEmpty = function(a) {
	if (a === undefined || a === 'undefined' || a === null || a === 'null' || a === '' || JSON.stringify(a) === '{}' || JSON.stringify(a) === '[]' || a === ' ') {
        return true
	}
    return false
}
/**
	价格分转元
	@param {String}price 分
	@return {String} 元
*/
const priceTransition = (price)=> {
    if (isEmpty(price)) {
        return 0
    }
	return parseInt(price)/100
}
/**
	价格分转元
	@param {String}price 分
	@return {String} 元
*/
const priceTransitionTwo = (price)=> {
    if (isEmpty(price)) {
        return 0
    }
	return (parseInt(price)/100).toFixed(2)
}
/**
    重设协调尺寸
    @param {Dom}dom dom元素
    @param {Number}width 宽
    @param {Number}height 高
    @return
*/
const resetSize = function(dom, width, height) {
    dom.style.height = (dom.clientWidth * height/width) + 'px'
}
/**
    元素高度铺满屏幕
    @param {Dom}dom dom元素
    @return
*/
import {wm_data} from '@/common/index.js'
const fullScreenHeight = (dom)=> {
	dom.parentNode.style.minHeight = (window.innerHeight-1) + 'px'
	let padding = 1
	if (wm_data.hasHeader && getBrowserType()!='wechat') {
        padding += Math.floor(document.body.offsetWidth/375*44)
        if(getBrowserType()=='app' && !isEmpty(getAppHeader())) {
            padding += Number(getAppHeader())
        }
    }
	if (wm_data.setFooter) {
		padding += Math.floor(document.body.offsetWidth/375*44)
	}
	dom.style.minHeight = (window.innerHeight-padding) + 'px'
}
/**
	日期格式化
	@param {Date}time 时间
	@param {String}format 时间格式
	@return {String} 新格式日期
*/
const dateFormat = function(time, format) {
	if (isEmpty(time)) {
		return ''
	}
	const t = new Date(time)
	const tf = function(i) {
		return (i<10?'0':'')+i
	}
	return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(a) {
		switch(a){
			case 'YYYY':
				return tf(t.getFullYear())
				break
			case 'MM':
				return tf(t.getMonth()+1)
				break
			case 'DD':
				return tf(t.getDate())
				break
			case 'hh':
				return tf(t.getHours())
				break
			case 'mm':
				return tf(t.getMinutes())
				break
			case 'ss':
				return tf(t.getSeconds())
				break
		}
	})
}
/**
	日期反格式化
	@param {String}dateStr 日期
	@param {String}format 分隔符
	@return {Date} 新格式日期
*/
const parseDate = function(dateStr, separator){
	if(!separator){
		separator = '-'
	}
	const dateArr = dateStr.split(separator)
	const year = parseInt(dateArr[0])
	let month
	if (dateArr[1].indexOf('0') == 0) {
		month = parseInt(dateArr[1].substring(1))
	} else {
		month = parseInt(dateArr[1])
	}
	const day = parseInt(dateArr[2])
	return new Date(year, month-1, day)
}
/**
	获取浏览器类型
	@param
	@return {String} 浏览器类型
*/
const getBrowserType = ()=> {
	const u = window.navigator.userAgent
	if (u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
		return 'wechat'
	}
	if (!isEmpty(getCookie('app_uinfo'))) {
		return 'app'
	}
	return 'browser'
}
/**
	获取app类型
	@param
	@return {String} app类型
*/
const getAppType = ()=> {
	const u = window.navigator.userAgent
	if (u.indexOf('Android') > -1) {
		return 'android'
	}
	if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
		return 'ios'
	}
	return ''
}
/**
	调用app方法
	@param {Function}androidFun android方法
    @param {Function}iosFun ios方法
    @return
*/
const appFun = (androidFun, iosFun)=> {
	if (getBrowserType() != 'app') {
		return
	}
	if (getAppType() === 'android') {
		androidFun()
	} else if (getAppType() === 'ios') {
		iosFun()
	}
}
/**
	获取cookie参数
	@param {String}key 参数名
	@return {String} 参数值
*/
const getCookie = (key)=> {
	const cookieArr = document.cookie.split(';')
	for (let i = 0; i < cookieArr.length; i++) {
		const arr = cookieArr[i].split('=')
		if (trimStr(arr[0]) === key){
			return arr[1]
		}
	}
	return ''
}
/**
	转换#链接
	@param {String}key #链接
	@return {String} %23链接
*/
const convert23 = (url)=> {
	if (url.indexOf('#') > -1) {
		return url.replace(new RegExp('#','g'),'%23')
	}
	return url
}
/**
	清除地址缓存
	@param
	@return
*/
const clearAddress = ()=> {
	sessionStorage.wm_address_province = undefined
	sessionStorage.wm_address_city = undefined
	sessionStorage.wm_address_area = undefined
	sessionStorage.wm_address_name = undefined
	sessionStorage.wm_address_phone = undefined
	sessionStorage.wm_address_zone = undefined
	sessionStorage.wm_address_addr = undefined
}
/**
	清除日期时间
	@param
	@return
*/
const clearTime = ()=> {
	sessionStorage.wm_day_select = undefined
	sessionStorage.wm_time_select = undefined
}
/**
	清除备注
	@param
	@return
*/
const clearRemark = ()=> {
	sessionStorage.wm_address_remark = undefined
}
/**
	清除日期时间
	@param
	@return
*/
const clearAll = ()=> {
	clearAddress()
	clearTime()
	clearRemark()
}
/**
	获取链接参数
	@param
	@return {String} 参数值
*/
const getParameter = (param)=> {
	const h = window.location.hash.substr(1)
	const i = h.indexOf('?')<0 ? h.length : h.indexOf('?')
	const r = h.substr(i+1).match(new RegExp('(^|&)'+param+'=([^&]*)(&|$)','i'))
	if (r != null) {
		return r[2]
	} else {
		return ''
	}
}
/**
	设置微信授权参数
	@param {Object}param 微信授权参数
	@return
*/
const setWechatRole = (param)=> {
	if (!isEmpty(param.uuid)) {
		sessionStorage.wm_token = param.token
		localStorage.wm_token = param.token
	}
	if (!isEmpty(param.uuid)) {
		sessionStorage.wm_uuid = param.uuid
	}
	if (!isEmpty(param.status)) {
		sessionStorage.wm_wechat_status = param.status
	}
	if (!isEmpty(param.openid)) {
		sessionStorage.wm_wechat_openid = param.openid
	}
	if (!isEmpty(param.unionid)) {
		sessionStorage.wm_wechat_unionid = param.unionid
	}
	if (!isEmpty(param.nickname)) {
		sessionStorage.wm_wechat_nickname = param.nickname
	}
	if (!isEmpty(param.headimgurl)) {
		sessionStorage.wm_wechat_headimgurl = param.headimgurl
	}
}
/**
	校验链接
	@param {String}link 链接
	@return {Boolean} 校验是否成功
*/
const validLink = (link)=> {
	if (link.indexOf('http:')==0||link.indexOf('https:')==0) {
		return true
	}
	return false
}
/**
	转换链接:字符串转成对象
	@param {String} url 链接
	@return {Object} 转换后的链接
*/
const urlChange = (url)=> {
    let obj = {}
    if (url.indexOf('?') > -1) {
        let urllist = (url).split('?')[1].split('&')
        for(let i = 0;i<urllist.length;i++){
            let subArr = urllist[i].split('=')
            obj[subArr[0]] = decodeURIComponent(subArr[1])
        }
    }
    return obj
}
/**
	获取app的token
	@param
	@return {String} app的token
*/
const getAppToken = ()=> {
	const app_uinfo = getCookie('app_uinfo')
	if (isEmpty(app_uinfo)) {
		return ''
	}
    const token = app_uinfo.split('|')[1]
	if (isEmpty(token)) {
		return ''
	}
    return token
}
/**
	获取app的version
	@param
	@return {String} app的version
*/
const getAppVersion = ()=> {
	const app_uinfo = getCookie('app_uinfo')
	if (isEmpty(app_uinfo)) {
		return ''
	}
	const version = app_uinfo.split('|')[2]
	if (isEmpty(version)) {
		return ''
	}
    return version
}
/**
	获取app的头部信息栏高度
	@param
	@return {String} app的header
*/
const getAppHeader = ()=> {
	const app_uinfo = getCookie('app_uinfo')
	if (isEmpty(app_uinfo)) {
		return ''
	}
	const header = app_uinfo.split('|')[3]
	if (isEmpty(header)) {
		return 0
	}
    return header
}
/**
	设置app的头部信息栏高度
	@param
	@return 
*/
const setAppHeader = ()=> {
    let height = Number(getAppHeader())
	if(getBrowserType()=='app' && !isEmpty(height)) {
        if(document.getElementById('wm_header')) {
            document.getElementById('wm_header').style = `padding-top:${height}px !important;`
        }
        if(document.getElementById('wm_contain')) {
            document.getElementById('wm_contain').style = `padding-top:${height+Math.floor(document.body.offsetWidth/375*44)}px !important;`
        }
    }
}
/**
	设置app的token
	@param
	@return
*/
const setAppToken = ()=> {
	const app_uinfo = getCookie('app_uinfo')
    const token = app_uinfo.split('|')[1]
	sessionStorage.wm_token = trimStr(token)
	localStorage.wm_token = trimStr(token)
}
/**
	获取localtoken
	@param
	@return {String} 返回localtoken
*/
const getLocalToken = ()=> {
	if (getBrowserType() == 'app') {
		return getAppToken()
	}
	return localStorage.wm_token
}
/**
	获取APP(澜渟还是澜渟医生)
	@param
	@return {String} 返回REQUESTAPP
*/
const getAppStyle = ()=> {
	if (getBrowserType() == 'app') {
		const requestApp = getCookie('requestApp')
		if (!isEmpty(requestApp)) {
			return 3
		}
	}
	return 1
}

/**
	图片压缩
	@param {Number}width 宽
    @param {Number}height 高
	@return {String} 压缩链接
*/
const compressImg = (width, height)=> {
    return '?x-oss-process=image/auto-orient,0/resize,m_lfit,h_' + height + ',w_' + width
}

/**
	图片剪切
	@param {Number} minshort 最短边(必须是三个值中最小的)
	@param {Number} width 宽
	@param {Number} height 高
	@return {String} 压缩链接
*/
const shearImg = (minshort, width, height)=> {
    return '?x-oss-process=image/resize,s_' + minshort + '/crop,w_' + width + ',h_' + height + ',g_center'
}

/**
	app分享
	@param {Object} {
        title 标题
        desc 描述
        link 链接
        icon 图标
    } shareData
	@return 
*/
const appShare = function(shareData) {
    appFun(function() {
      window.jsInterface.shareActivity(shareData.title, shareData.desc, shareData.link, shareData.icon)
    }, function() {
      window.webkit.messageHandlers.shareActivity.postMessage([shareData.title, shareData.desc, shareData.link, shareData.icon])
    })
}

/**
	图片下载
	@param {String} imgsrc 图片链接
	@param {String} name 图片名称
	@return 
*/
const downloadIamge = (imgsrc, name)=> {
    let image = new Image()
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = function() {
        let canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        let context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        let url = canvas.toDataURL('image/png') //得到图片的base64编码数据
        let a = document.createElement('a') // 生成一个a元素
        let event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
    }
    image.src = imgsrc

}

export {
	trimStr,
	isEmpty,
    priceTransition,
    priceTransitionTwo,
	resetSize,
	fullScreenHeight,
	dateFormat,
	parseDate,
	getBrowserType,
	getAppType,
	appFun,
	getCookie,
	convert23,
	clearAddress,
	clearTime,
	clearAll,
	getParameter,
	setWechatRole,
	validLink,
	getAppToken,
	setAppToken,
	getLocalToken,
	urlChange,
	getAppStyle,
	compressImg,
    shearImg,
    getAppVersion,
    getAppHeader,
    setAppHeader,
    appShare,
    downloadIamge
}