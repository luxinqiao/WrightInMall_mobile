<template>
  <div id="demo" class="cropperImg">
    <!-- 遮罩层 -->
    <div class="container" v-show="panel">
      <div>
        <img id="image" :src="url" alt="Picture">
        <!--<vueCropper ref="cropper" :img="url" :outputSize="option.size"-->
                    <!--:outputType="option.outputType" :info="true" :full="option.full"-->
                    <!--:canMove="option.canMove" :canMoveBox="option.canMoveBox"-->
                    <!--:original="option.original" :autoCrop="option.autoCrop"-->
                    <!--:autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight"-->
                    <!--:fixedBox="option.fixedBox">-->
        <!--</vueCropper>-->
      </div>
      <button type="button" id="button" @click="crop">确定</button>
    </div>
    <div>
      <div class="show" style="height:42px;width:42px;">
        <div class="picture" :style="'backgroundImage:url('+headerImage+')'" style="height:42px;width:42px;">
        </div>
      </div>
      <div style="opacity:0;width:360px;position:absolute;top:0;right:0;height:56px;">
        <input type="file" id="change" accept="image/*" @change="change" style="height:56px;">
        <label for="change"></label>
      </div>
    </div>
  </div>
</template>

<script>
  import Cropper from 'cropperjs'  //引入插件
  import {dateFormat, getLocalToken} from '@/utils/CommonUtils.js'
  import EXIF from 'exif-js'
  import {VueCropper} from 'vue-cropper'

  export default {
    props:{
      headerImage:{   //从user.vue父组件传过来数据库图片，即用户从本地上传的图片
        type:String,
        default:''
      }
    },
    data () {
      return {
        crap: false,
        previews: {},
        option: {
          img:
            'http:img1.vued.vanthink.cn/vued751d13a9cb5376b89cb6719e86f591f3.png',
          size: 1,
          full: false, // 输出原图比例截图 props名full
          outputType: 'png',
          canMove: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 200,
          autoCropHeight: 200,
          fixedBox: true
        },
        downImg: '#',


        picValue:'',
        cropper:'',
        croppable:false,
        panel:false,
        url:'',
        postHeaderImg:'',
        imgUrl:''
      }
    },
    mounted () {
      //初始化这个裁剪框
      var self = this;
      var image = document.getElementById('image');
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        //background:false,
        //zoomable:false,
        ready: function () {
          self.croppable = true;
        }
      });
    },
    components: { VueCropper },
    methods: {
      // 实时预览函数
      realTime(data) {
        this.previews = data
      },
      down(type) {
        // event.preventDefault()
        var aLink = document.createElement('a')
        aLink.download = 'author-img'
        // 输出
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob(data => {
            this.downImg = window.URL.createObjectURL(data)
            //            aLink.download = this.downImg;
            aLink.href = window.URL.createObjectURL(data)
            aLink.click()
          })
        } else {
          this.$refs.cropper.getCropData(data => {
            this.downImg = data
            // aLink.href = data
            // aLink.click()
            // 将头像图片数据发送给后台
          })
        }
      },
      uploadImg(e, num) {
        //上传图片
        // this.option.img
        var file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        var reader = new FileReader()
        reader.onload = e => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          if (num === 1) {
            this.option.img = data
          } else if (num === 2) {
            this.example2.img = data
          }
        }
        // 转化为base64
        reader.readAsDataURL(file)
        // 转化为blob
        // reader.readAsArrayBuffer(file)
      },
      imgLoad(msg) {

      },


      getImgUrl(file) {
        //读取文件
        const reader = new FileReader();
        reader.onload = (e)=> {
          //var pic = this.rotateImage(e.target.result);
          //const pic = this.dataURLtoBlob(newImage);
          this.compressImg(e.target.result, (pic)=> {
            this.$wm_data.stopCheckSign = true //阻止验签
            this.$axios.post(sts_request, {
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

                  const that = this;
                  async function put() {
                    try {
                      const fileName = 'recovery_mobile/'+dateFormat(new Date(), 'YYYY/MM/DD')+'/'+new Date().getTime()+'.jpeg';
                      let result = await client.put(fileName, pic);
                      that.imgUrl = result.url;
                    } catch (e) {
                      that.$wm_dialog.tip('上传图片失败')
                    }
                  }
                  put().then(result => {
                    // 按钮可点击
                    this.panel = false;
                    this.crop();
                  })
                } else {
                  this.$wm_dialog.tip('上传图片失败')
                }
              })
              .catch(response => {

              })
          })


        };
        reader.readAsDataURL(file);
      },

      /**
       图片压缩
       @param
       @return
       */
      compressImg(src, callback){
        //base64流转Image对象
        var newImage = new Image();
        newImage.src = src
        var img = new Image();
        img.src = src
        img.onload = function() {
          var width = img.width;
          var height = img.height;

          var canvas = document.createElement("canvas")
          var ctx = canvas.getContext('2d');


          EXIF.getData(img,function () {
            var orientation = EXIF.getTag(this,'Orientation');
            //orientation = 6;//测试数据
            switch (orientation){
              //正常状态
              case 1:
                //console.log('旋转0°');
                // canvas.height = height;
                // canvas.width = width;
                newImage = img;
                break;
              //旋转90度
              case 6:
                //console.log('旋转90°');
                canvas.height = width;
                canvas.width = height;
                ctx.rotate(Math.PI/2);
                ctx.translate(0,-height);

                ctx.drawImage(img,0,0)
                var imageDate = canvas.toDataURL('Image/jpeg',1)
                newImage.src = imageDate;
                break;
              //旋转180°
              case 3:
                //console.log('旋转180°');
                canvas.height = height;
                canvas.width = width;
                ctx.rotate(Math.PI);
                ctx.translate(-width,-height);

                ctx.drawImage(img,0,0)
                var imageDate = canvas.toDataURL('Image/jpeg',1)
                newImage.src = imageDate;
                break;
              //旋转270°
              case 8:
                //console.log('旋转270°');
                canvas.height = width;
                canvas.width = height;
                ctx.rotate(-Math.PI/2);
                ctx.translate(-height,0);

                ctx.drawImage(img,0,0)
                var imageDate = canvas.toDataURL('Image/jpeg',1)
                newImage.src = imageDate;
                break;
              //undefined时不旋转
              case undefined:
                //console.log('undefined  不旋转');
                newImage = img;
                break;
            }
          });
        }

        newImage.onload = function() {
          var canvas = document.createElement("canvas")
          canvas.width = newImage.width
          canvas.height = newImage.height
          canvas.getContext('2d').drawImage(newImage, 0, 0, canvas.width, canvas.height)
          //canvas转Blob
          canvas.toBlob(function(blob) {
            callback(blob)
          }, 'image/jpeg', 0.1)
        }
      },

      getObjectURL (file) {
        var url = null ;
        if (window.createObjectURL!=undefined) { // basic
          url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
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
      },

      change (e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.panel = false;
        this.picValue = files[0];

        this.url = this.getObjectURL(this.picValue);
        this.getImgUrl(this.picValue);

        //每次替换图片要重新得到新的url
        if(this.cropper){
          this.cropper.replace(this.url);
        }
        //this.panel = true;
      },
      crop () {
        this.panel = false;
        var croppedCanvas;
        var roundedCanvas;

        if (!this.croppable) {
          return;
        }
        // Crop
        croppedCanvas = this.cropper.getCroppedCanvas();
        //console.log(this.cropper)
        // Round
        roundedCanvas = this.getRoundedCanvas(croppedCanvas);

        this.postHeaderImg = roundedCanvas.toDataURL();
        //传递给父组件
        this.$emit('getHeaderImage',roundedCanvas.toDataURL());

        this.postImg()//上传图片

      },
      getRoundedCanvas (sourceCanvas) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var width = sourceCanvas.width;
        var height = sourceCanvas.height;
        //为了每张图片的大小不超过50k,所以不论裁剪多大，最后上传的，最大宽度不超过90。
        if(width > 90){
          width = 90
        }
        if(height > 90){
          height = 90
        }

        canvas.width = width;
        canvas.height = height;

        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
        context.fill();

        return canvas;
      },
      postImg () {
        //alert('1122'+this.imgUrl);
        this.$axios.post(rih_request + 'API/V1/UserInfo/setUserHeadImageUrl', {
          token: localStorage.wm_token,
          uiHeadImageUrl: this.imgUrl
        }).then(response => {
          let code = response.code;
          if(code == 200) {
            sessionStorage.uiHeadImageUrl = this.imgUrl;
            // history.back(-1);
          }else {
            this.$wm_dialog.tip('更新失败！');
          }
        });
      }
    }
  }
</script>

<style lang='scss' scoped>
  *{
    margin: 0;
    padding: 0;
  }
  #demo #button {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 80px;
    height: 40px;
    border:none;
    border-radius: 5px;
    background:white;
  }
  #demo .show {
    width: 100px;
    height: 100px;
    overflow: hidden;
    position: relative;
    border-radius: 50%;
    border: 1px solid #d5d5d5;
  }
  #demo .picture {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  #demo .container {
    z-index: 99;
    position: fixed;
    padding-top: 60px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background:rgba(0,0,0,1);
  }
  #demo #image {
    max-width: 100%;
  }
  .cropper-view-box,.cropper-face {
    border-radius: 50%;
  }
  /*!
   * Cropper.js v1.0.0-rc
   * https://github.com/fengyuanchen/cropperjs
   *
   * Copyright (c) 2017 Fengyuan Chen
   * Released under the MIT license
   *
   * Date: 2017-03-25T12:02:21.062Z
   */
  .cropper-container {
    font-size: 0;
    line-height: 0;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    direction: ltr;
    -ms-touch-action: none;
    touch-action: none
  }
  .cropper-container img {
    /* Avoid margin top issue (Occur only when margin-top <= -height) */
    display: block;
    min-width: 0 !important;
    max-width: none !important;
    min-height: 0 !important;
    max-height: none !important;
    width: 100%;
    height: 100%;
    image-orientation: 0deg
  }
  .cropper-wrap-box,
  .cropper-canvas,
  .cropper-drag-box,
  .cropper-crop-box,
  .cropper-modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .cropper-wrap-box {
    overflow: hidden;
  }
  .cropper-drag-box {
    opacity: 0;
    background-color: #fff;
  }
  .cropper-modal {
    opacity: .5;
    background-color: #000;
  }
  .cropper-view-box {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    outline: 1px solid #39f;
    outline-color: rgba(51, 153, 255, 0.75);
  }
  .cropper-dashed {
    position: absolute;
    display: block;
    opacity: .5;
    border: 0 dashed #eee
  }
  .cropper-dashed.dashed-h {
    top: 33.33333%;
    left: 0;
    width: 100%;
    height: 33.33333%;
    border-top-width: 1px;
    border-bottom-width: 1px
  }
  .cropper-dashed.dashed-v {
    top: 0;
    left: 33.33333%;
    width: 33.33333%;
    height: 100%;
    border-right-width: 1px;
    border-left-width: 1px
  }
  .cropper-center {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0;
    height: 0;
    opacity: .75
  }
  .cropper-center:before,
  .cropper-center:after {
    position: absolute;
    display: block;
    content: ' ';
    background-color: #eee
  }
  .cropper-center:before {
    top: 0;
    left: -3px;
    width: 7px;
    height: 1px
  }
  .cropper-center:after {
    top: -3px;
    left: 0;
    width: 1px;
    height: 7px
  }
  .cropper-face,
  .cropper-line,
  .cropper-point {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    opacity: .1;
  }
  .cropper-face {
    top: 0;
    left: 0;
    background-color: #fff;
  }
  .cropper-line {
    background-color: #39f
  }
  .cropper-line.line-e {
    top: 0;
    right: -3px;
    width: 5px;
    cursor: e-resize
  }
  .cropper-line.line-n {
    top: -3px;
    left: 0;
    height: 5px;
    cursor: n-resize
  }
  .cropper-line.line-w {
    top: 0;
    left: -3px;
    width: 5px;
    cursor: w-resize
  }
  .cropper-line.line-s {
    bottom: -3px;
    left: 0;
    height: 5px;
    cursor: s-resize
  }
  .cropper-point {
    width: 5px;
    height: 5px;
    opacity: .75;
    background-color: #39f
  }
  .cropper-point.point-e {
    top: 50%;
    right: -3px;
    margin-top: -3px;
    cursor: e-resize
  }
  .cropper-point.point-n {
    top: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: n-resize
  }
  .cropper-point.point-w {
    top: 50%;
    left: -3px;
    margin-top: -3px;
    cursor: w-resize
  }
  .cropper-point.point-s {
    bottom: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: s-resize
  }
  .cropper-point.point-ne {
    top: -3px;
    right: -3px;
    cursor: ne-resize
  }
  .cropper-point.point-nw {
    top: -3px;
    left: -3px;
    cursor: nw-resize
  }
  .cropper-point.point-sw {
    bottom: -3px;
    left: -3px;
    cursor: sw-resize
  }
  .cropper-point.point-se {
    right: -3px;
    bottom: -3px;
    width: 20px;
    height: 20px;
    cursor: se-resize;
    opacity: 1
  }
  @media (min-width: 768px) {
    .cropper-point.point-se {
      width: 15px;
      height: 15px
    }
  }
  @media (min-width: 992px) {
    .cropper-point.point-se {
      width: 10px;
      height: 10px
    }
  }
  @media (min-width: 1200px) {
    .cropper-point.point-se {
      width: 5px;
      height: 5px;
      opacity: .75
    }
  }
  .cropper-point.point-se:before {
    position: absolute;
    right: -50%;
    bottom: -50%;
    display: block;
    width: 200%;
    height: 200%;
    content: ' ';
    opacity: 0;
    background-color: #39f
  }
  .cropper-invisible {
    opacity: 0;
  }
  .cropper-bg {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
  }
  .cropper-hide {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
  }
  .cropper-hidden {
    /*display: none !important;*/
  }
  .cropper-move {
    cursor: move;
  }
  .cropper-crop {
    cursor: crosshair;
  }
  .cropper-disabled .cropper-drag-box,
  .cropper-disabled .cropper-face,
  .cropper-disabled .cropper-line,
  .cropper-disabled .cropper-point {
    cursor: not-allowed;
  }
</style>
