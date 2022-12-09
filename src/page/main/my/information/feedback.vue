<!--
 * 文件描述：意见反馈
 * 创建人：赵志银
 * 创建时间：2020-11-06
-->
<template>
    <div id='main' ref='main'>
        <div class='content'>
            <input type='text' placeholder='标题' v-model='title'>
            <div>
                <textarea type='text' v-model='content' placeholder='意见描述'></textarea>
                <div class='imglist'>
                    <Upload></Upload>
                </div>
            </div>
        </div>
        <div class='btn' @click='submit'>提交</div>
    </div>
</template>

<script type='text/javascript'>
  import {isEmpty, fullScreenHeight, getLocalToken} from '@/utils/CommonUtils.js';
  import {rv_dialog} from '@/utils/DialogUtils.js';
  import Upload from '@/components/Upload';

  export default {
    data() {
      return {
        title: '',
        content: '',
        upload: {
          max: 3,
          pics: [],
          hasFileNameFlag: 1, // 是否有fileName(默认为1，用于Upload控件判断)
          fileName: []
        }
      }
    },
    mounted() {
        this.$wm_data.setHeader({title: '意见反馈'})
        this.$wm_data.setFooter = false
        fullScreenHeight(this.$refs.main)
    },
    methods: {
        /**
            提交
            @param
            @return 
        */
        submit() {
            if(isEmpty(this.title)) {
                this.$wm_dialog.tip('请填写反馈标题')
                return
            }else if(isEmpty(this.content)) {
                this.$wm_dialog.tip('请填写反馈内容')
                return
            }else {
                this.$axios.post(rih_request + 'API/V1/UserFeedBack/addAUserFeedBack', {
                    token: getLocalToken(),
                    ufbTitle: this.title,
                    ufbDesc: this.content,
                    ufbImages: JSON.stringify(this.upload.fileName)
                }).then(response => {
                    if(response.code == 200) {
                        this.$wm_dialog.tip('反馈成功', ()=>{
                            history.back(-1)
                        })
                    }else {
                        this.wm_dialog.tip('反馈失败！')
                    }
                })
            }
        }
    },
    components: {
        Upload
    }
  }
</script>

<style lang='scss' scoped>
    .content {
        position: relative;
        padding: 0 0.16rem;
        border-bottom: 1px solid rgba(239,239,239,1);
        border-top: 1px solid #f4f4f4;
        input {
            display: block;
            height: 0.5rem; width: 100%;
            line-height: 0.3rem;
            box-sizing: border-box;
            border: none;
            border-bottom: 1px solid #f4f4f4;
            font-size: 0.16rem;
        }
        div:nth-child(2) {
            padding: 0.12rem 0 0.16rem 0;
            border-radius: 8px;
            width: 100%;
            background-color: white;
            textarea {
                display: block;
                height: 1.8rem; width: 100%;
                line-height: 0.2rem;
                font-size: 0.14rem;
                color: rgba(0,0,0,1);
                border: none; resize: none;
            }
        }
    }
    .btn {
        margin: auto; margin-top: 0.3rem;
        width: 3.43rem; height: 0.5rem;
        text-align: center; line-height: 0.48rem;
        color: #fff; font-size: 0.16rem;
        background-color: rgb(255,44,121);
        border-radius: 0.25rem;
    }

</style>
