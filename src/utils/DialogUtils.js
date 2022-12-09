const wm_dialog = {
    data: {
        show: false, //是否显示
        type: 'alert', //类型(tip/alert/confirm/loading/img)
        message: '', //内容
        confirmText: '', //确认文本
        cancelText: '', //取消文本
        confirmCallBack: () => {}, //确认回调
        cancelCallBack: ()=> {},  //取消回调
        stopTip: false, //阻止提示框(axios内嵌)
        stopLoading: false, //阻止加载框(axios内嵌)
    },
    /** 提示框 **/
    tip(message, confirmCallBack, duration=2000) {
        this.data.show = true
        this.data.type = 'tip'
        this.data.message = message
        setTimeout(() => {
            this.data.show = false
            if (confirmCallBack != undefined) {
                confirmCallBack()
            }
        }, duration)
    },
    /** 警告框 **/
    alert(message, confirmCallBack) {
        this.data.show = true
        this.data.type = 'alert'
        this.data.message = message
        if (confirmCallBack != undefined) {
            this.data.confirmCallBack = confirmCallBack
        } else {
            this.data.confirmCallBack = undefined
        }
    },
    /** 确认框(无标题) **/
    confirm(message, cancelText, cancelCallBack, confirmText, confirmCallBack) {
        this.data.show = true
        this.data.type = 'confirm'
        this.data.message = message
        this.data.cancelText = cancelText
        if (cancelCallBack != undefined) {
            this.data.cancelCallBack = cancelCallBack
        }
        this.data.confirmText = confirmText
        if (confirmCallBack != undefined) {
            this.data.confirmCallBack = confirmCallBack
        }
    },
    /** 加载框 **/
    loading() {
        this.data.show = true
        this.data.type = 'loading'
    },
    /** 阻止加载 **/
    closeLoading() {
        this.data.show = false
    },
    /** 图片框 **/
    img(src) {
        this.data.show = true
        this.data.type = 'img'
        this.data.message = src
    },
    /** 阻止提示 **/
    stopTip() {
        this.data.stopTip = true
    },
    /** 阻止加载 **/
    stopLoading() {
        this.data.stopLoading = true
    },
}

export {wm_dialog}
