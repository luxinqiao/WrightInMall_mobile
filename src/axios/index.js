/**
 * 文件描述：接口请求处理
 * 创建人：赵志银
 * 创建时间：2019-03-14
 */
import axios from 'axios'
import {wm_dialog, wm_data} from '@/main.js'

//设置头
axios.defaults.headers.post['Content-Type'] = 'application/json'
//请求前拦截
axios.interceptors.request.use(
    config => {
        config.headers['REQUESTAPP'] = wm_data.REQUESTAPP
        // 获取REQUESTCLIENT ---4.web,6.公众号
        if (wm_data.REQUESTCLIENT != '') {
            config.headers['REQUESTCLIENT'] = wm_data.REQUESTCLIENT
            wm_data.REQUESTCLIENT = ''
        } else {
            if (wm_data.browserType == 'browser' || wm_data.browserType == 'app') {
                config.headers['REQUESTCLIENT'] = '4'
            } else if (wm_data.browserType == 'wechat') {
                config.headers['REQUESTCLIENT'] = '6'
            } 
        }
        if (wm_data.VERSIONFORAPP == '5.0.5') {
            config.headers['VERSIONFORAPP'] = wm_data.VERSIONFORAPP
        }
        if (config.url.indexOf('http') != 0) {
            config.url = live_request+ 'v2/' + config.url
        }

        if (wm_data.stopCheckSign) {
            wm_data.stopCheckSign = false
        } else {
            attestation(config.data)
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
//请求返回拦截
axios.interceptors.response.use(
    response => {
        const result = response.data
        if (result.code == undefined) {
            return result
        }
        if (result.code == 200) {
            return result
        } else if ((result.code == 3) || (result.code == 102) || (result.code == 201)) {
            if (wm_data.VERSIONFORAPP == 'noCheckToken') {
                wm_data.VERSIONFORAPP = ''
                return result
            }
            wm_dialog.tip('未登录，请先登录', ()=>{
                if(wm_data.browserType == 'app') {
                    appFun(function() {
                        window.jsInterface.loginMall()
                    }, function() {
                        window.webkit.messageHandlers.loginMall.postMessage(null)
                    })
                }
                else if (window.location.hash != '#/my/index') {
                    window.location.href = window.location.origin+'/#/login/index'
                }
            })
            return result
        } else {
            if (wm_dialog.data.stopTip == true) {
                wm_dialog.data.stopTip = false
                return result
            } else {
                if (result.note != undefined) {
                    wm_dialog.tip(result.note)
                } else {
                    wm_dialog.tip(result.msg)
                }
                return result
            }
        }
    },
    error => {
        wm_dialog.data.show = false
        if (error.response) {
            if (error.response.status == 400) {
                wm_dialog.tip('资源未找到，请联系管理员')
            } else if (error.response.status == 404) {
                wm_dialog.tip('资源未找到，请联系管理员')
            } else if (error.response.status == 500) {
                wm_dialog.tip('服务器错误，请联系管理员')
            }
        }
        return error.response.data
    }
)

//验签
const attestation = (data)=> {
    data.timestamp = new Date().getTime()
    data.nonce = getNonce()
    let checkData = JSON.parse(JSON.stringify(data))
    for (let key in checkData) {
        if (typeof(checkData[key])=='undefined' || typeof(checkData[key])=='object') {
            delete checkData[key]
        }
    }
    data.sign = md5(objArgs(sort_ASCII(checkData))).toUpperCase()
    return data
}

//获取32位随机字符串
const getNonce = ()=> {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let nums = ''
    for (let i = 0; i < 32; i++) {
        nums += chars[parseInt(Math.random() * 61)]
    }
    return nums
}

//Js对象按ASCII码排序
const sort_ASCII = (obj)=> {
    let arr = [], num = 0
    for (let i in obj) {
        arr[num] = i
        num++
    }
    const sortArr = arr.sort()
    let sortObj = {}
    for (let i in sortArr) {
        sortObj[sortArr[i]] = obj[sortArr[i]]
    }
    return sortObj
}

//post请求转换成get请求
const objArgs = (obj)=> {
    let url = ''
    for (let name in obj) {
        url += name + '=' + obj[name] + '&' //转码并进行赋值
    }
    url += "secret=BCy94HkqITdAJDCPhw9Sjd6TwLoV8igR"
    return url
}

/**
	调用app方法
	@param {Function}androidFun android方法
    @param {Function}iosFun ios方法
    @return
*/
const appFun = (androidFun, iosFun)=> {
	if (wm_data.browserType != 'app') {
		return
	}
	if (wm_data.appType == 'android') {
		androidFun()
	} else if (wm_data.appType == 'ios') {
		iosFun()
	}
}

export {axios}
