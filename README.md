##1.项目安装(vue项目)
#安装nodeJs后查看版本
node -v
npm -v
#cnpm代替npm
npm install -g cnpm --registry=http://registry.npm.taobao.org
#安装vue-cli脚手架
cnpm install -g vue-cli
#项目安装依赖包
cnpm install
#启动项目
cnpm run dev
#项目打包
cnpm run build

##2.目录结构
build		项目构建代码(依赖Webpack)
config		配置(端口号等)
dist        打包后的项目
node_modules		项目依赖包(通过package.json安装的包)
src	assets	静态文件(图片和样式)
	components	组件库
	page	页面代码
	router	项目路由
    utils   工具类
	App.vue	项目入口文件(已指向page/main/Index.vue)
	main.js	项目核心js(引用路由、引用vue页面、引用插件)
static		静态资源(不受webpack编译)
.xxx		一堆配置文件(语法配置、git配置)
index.html		项目入口html(可配置meta、统计代码等)
package.json    项目主配置
README.md		项目说明文档(markdown格式)

##3.公共封装
##3.1 公共方法
#设置项目标题
this.$wm_data.setHeader({title:'产康详情'})
#路由跳转
this.$router.push({path: '../user/detail'})
#路由替换
this.$router.replace({path: '../user/detail'})
#获取路由链接中的参数(?后面的参数)
this.$route.query.category_id
##3.2 弹出框
#提示框(2s后自动消失)
this.$wm_dialog.tip('接单成功', ()=>{
	alert('tip回调')
})
#警告框(点击确定后消失)
this.$wm_dialog.alert('您有未完成的上门产康订单<br/>请完成后继续', ()=>{
	alert('alert回调')
})
#确定框(取消/确定)
this.$wm_dialog.confirm('您的该次服务确认完成了？', '取消', ()=>{
	//alert('取消回调')
}, '确定', ()=>{
	alert('确定回调')
})
#阻止接口中的默认提示框(在访问接口前调用)
this.$wm_dialog.stopLoading()
##3.3 访问接口
initData() {
	this.$axios.post('project/index', {
		token: getToken()
	})
	.then(response => {
		//alert(JSON.stringify(response))
	})
	.catch(response => {

	})
}
##3.4 图片上传组件
参考serverRemark.vue中的Upload组件
