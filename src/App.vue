<template>
    <router-view/>
</template>

<script>
import {setAppHeader} from './utils/CommonUtils.js'
import Vue from 'vue'
export default {
    data () {
        return {}
    },
    watch: {
        $route: {
            handler: function(now, old) {
                Vue.nextTick(() => {
                    document.body.scrollTop = 0
                    document.documentElement.scrollTop = 0
                    window.scrollTo(0, 0)
                    document.documentElement.style.overflow=''
                    if(now.path!='/mall/details' && now.path!='/mall/reDetail') {
                        setAppHeader()
                    } else {
                        document.getElementById('wm_contain').style = `padding-top:0px !important;`
                    }
                })
        	},
        	deep: true,
        }
    }

}
</script>