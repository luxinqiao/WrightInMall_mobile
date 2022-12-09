<!--
 * 文件描述：图片上传组件-意见反馈
 * 创建人：赵志银
 * 创建时间：2020-11-06
-->
<template>
    <div class='wm_padding wm_upload'>
        <ul>
            <li class='img' v-for='(pic,i) in upload.pics' :key='"pic"+i'>
                <img :src='pic'>
                <img :src='require("@/assets/images/components/close.png")' @click='upload.pics.splice(i,1);if(!isEmpty(upload.hasFileNameFlag)) {
                                    upload.fileName.splice(i,1)}'>
            </li>
            <li class='addImg' v-show='upload.pics.length<upload.max' @click='addImg()'>
                <img :src='require("@/assets/images/components/addImg.png")'>
            </li>
        </ul>
        <input id='file' type='file' ref='file' accept="image/*">
    </div>
</template>

<script type="text/javascript">
import {dateFormat, isEmpty} from '@/utils/CommonUtils.js'

export default {
    data() {
        return {
            upload: this.$parent.upload,
            isEmpty: isEmpty
        }
    },
    mounted() {
        this.$refs.file.addEventListener('change', ()=>{
            this.uploadFile()
        })
    },
    methods: {
        /**
            添加图片
            @param
            @return 
        */
        addImg() {
            this.$refs.file.click()
        },
        /**
            上传图片
            @param
            @return
        */
        uploadFile() {
            if (!this.$refs.file.value) {
                this.$wm_dialog.tip('没有选择文件')
                return
            }
            const file = this.$refs.file.files[0]
            //校验格式
            if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/gif') {
                this.$wm_dialog.tip('不是有效的图片文件')
                return
            }
            //读取文件
            const reader = new FileReader()
            reader.onload = (e)=> {
                this.$refs.file.value = '' //文件清空
                const pic = this.dataURLtoBlob(e.target.result)
                this.$wm_data.stopCheckSign = true //阻止验签
                this.$axios.get(sts_request, {
                    params: {}
                })
                .then(response => {
                    if (response.status === 200) {
                        let OSS = require('ali-oss')
                        let client = new OSS({
                            accessKeyId: response.AccessKeyId,
                            accessKeySecret: response.AccessKeySecret,
                            stsToken: response.SecurityToken,
                            bucket: 'rightinhome',
                            region: 'oss-cn-hangzhou'
                        })
                        const that = this
                        async function put() {
                            try {
                                const fileName = 'recovery_mobile/'+dateFormat(new Date(), 'YYYY/MM/DD')+'/'+new Date().getTime()+'.jpeg'
                                let result = await client.put(fileName, pic)
                                that.upload.pics.push(result.url)
                                if (!isEmpty(that.upload.hasFileNameFlag)) {
                                    that.upload.fileName.push(fileName)
                                }
                            } catch (e) {
                                that.$wm_dialog.tip('添加图片失败')
                            }
                        }
                        put()
                    } else {
                        this.$wm_dialog.tip('添加图片失败')
                    }
                })
                .catch(response => {

                })
            }
            reader.readAsDataURL(file)
        },
        /**
            base64转blob
            @param {Object}dataurl base64文件流
            @return {Object} blob文件流
        */
        dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }
    },
}
</script>

<style lang='scss' scoped>
    .wm_upload {
        height: 0.55rem;
        padding-top: 0.05rem; padding-bottom: 0.1rem;
        box-sizing: content-box;
        background-color: #fff;
        >ul {
            >li {
                float: left;
                width: 0.8rem; height: 0.8rem;
            }
            >li.img {
                position: relative;
                margin-right: 15px;
                >img:nth-child(1) {
                    width: 100%; height: 100%;
                }
                >img:nth-child(2) {
                    position: absolute;
                    top: -0.04rem; left: -0.04rem;
                    width: 0.2rem; height: 0.2rem;
                }
            }
            >li.addImg {
                position: relative;
                border: 1px solid #eee;
                >img {
                    position: absolute;
                    top: 0; left: 0;
                    margin: auto;
                    width: 0.8rem; height: 0.8rem;
                }
            }
        }
        #file {
            display: none;
        }
    }
</style>
