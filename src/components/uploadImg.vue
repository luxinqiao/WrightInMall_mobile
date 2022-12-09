<!--
 * 文件描述：图片上传
 * 创建人：赵志银
 * 创建时间：2020-10-29
-->
<template>
    <div>
        <input type='file' id='ipload' accept='image/*' multiple ref='file' @change='uploadFile($event)'>
    </div>
</template>
<script type='text/javascript'>
import {dateFormat} from '@/utils/CommonUtils.js'

export default {
    data() {
        return {
            isClick: false
        }
    },
    mounted() {
        
    },
    methods: {
        /**
            登录校验
            @param
            @return
        */
        addImg() {
            if(this.isClick) {
                return
            }
            this.$refs.file.click()
            this.isClick = true
        },

        /**
         上传图片
        @param {object}file 文件
        @return
        */
        uploadFile(file) {
            let style = file.target.files[0].type.substr(6,4)
            var _this = this
            var reads = new FileReader()
            reads.readAsDataURL(file.target.files[0])
            reads.onload = function(e) {
                _this.compressImg(e.target.result, function(blob) {
                    _this.$axios.post(sts_request, {}).then(response => {
                        if(response.status == 200) {
                            let OSS = require('ali-oss')
                            let client = new OSS({
                                accessKeyId: response.AccessKeyId,
                                accessKeySecret: response.AccessKeySecret,
                                stsToken: response.SecurityToken,
                                bucket: 'rightinhome',
                                region: 'oss-cn-hangzhou'
                            })
                            async function put() {
                                try {
                                    const fileName = 'mall/'+dateFormat(new Date(), 'YYYY/MM/DD')+'/'+new Date().getTime()+'.'+style
                                    let result = await client.put(fileName, blob)
                                    var res = result.url.substring(result.url.indexOf('mall'))
                                    _this.$emit('getResult',{url:result.url, img:res})
                                } catch (e) {
                                    _this.$wm_dialog.tip('上传图片失败')
                                }
                                _this.isClick = false
                            }
                            put()
                        }
                    }).catch(response => {

                    })
                })
            }
        },
        /**
         图片压缩
        @param
        @return
        */
        compressImg: function(src, callback) {
            //base64流转Image对象
            var img = new Image()
            img.src = src
            img.onload = function() {
                //Image对象转canvas
                var canvas = document.createElement("canvas")
                canvas.width = img.width
                canvas.height = img.height
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
                //canvas转Blob
                canvas.toBlob(function(blob) {
                    callback(blob)
                }, 'image/jpeg', 0.1)
            }
        },
        
    }
}
</script>

<style lang='scss' scoped>
    input {
        display: none;
    }
</style>