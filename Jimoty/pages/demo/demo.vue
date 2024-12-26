<template>
	<view class="container">
		{{a}}--------------{{b}}
		<hr />
		{{stsss}}
		<button @tap="send">发送</button>
	</view>
</template>

<script setup>
	import { ref, nextTick, onMounted } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	const db = uniCloud.database()
	const secCheckObj = uniCloud.importObject("secCheckContent", { customUI: true })
	import { sendMessage1 } from '@/utils/sendMessage.js'
	// 导入压缩工具类
	// import compress from 'compress.js'

	// const myModule = await import('compress.js')

	const a = ref()
	const b = ref()
	const stsss = ref('aa')

	function send() {

		db.collection('jimoty-notice').add({
			sendPeople: '66f190b0286f7cec14cf4f62',
			type: 7,
			receive: '67429178bd0220786db0810b',
			message: "673b35ddf2949ce0c7f7fefb",
			otherMessage: '您的帖子超过3个月未出售,已被自动下架,详情请点击...',
			status: false
		})

		// wx.login({
		// 	success(res) {
		// 		if (res.code) {
		// 			//发起网络请求
		// 			uni.request({
		// 				url: 'https://api.weixin.qq.com/sns/jscode2session',
		// 				method: 'GET',
		// 				data: {
		// 					appid: 'wx0452efcda925733d',
		// 					secret: '68069b9bfd8faa47f27d08d3e7ee2ab8',
		// 					js_code: res.code,
		// 					grant_type: 'authorization_code'
		// 				}
		// 			})
		// 		} else {
		// 			console.log('登录失败！' + res.errMsg)
		// 		}
		// 		console.log(res.code);

		// 	}
		// });
		// sendMessage1()
		// let str = ''
		// wx.getLocation({
		// 	type: 'wgs84',
		// 	success: function(data) {
		// 		console.log('当前位置的经度：' + data.longitude)
		// 		console.log('当前位置的纬度：' + data.latitude)
		// 		let longitude = Number(data.longitude.toFixed(6))
		// 		let latitude = Number(data.latitude.toFixed(6))
		// 		a.value = longitude
		// 		b.value = latitude

		// 		uni.request({
		// 			url: `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=5a1b7f0c30df0aac815403ea512b3d32`,
		// 			success(res) {
		// 				if (typeof res.data.regeocode.formatted_address === 'string') {
		// 					str = res.data.regeocode.formatted_address
		// 				} else {
		// 					str = '中国'
		// 				}

		// 				stsss.value = str
		// 			},
		// 			fail() {
		// 				stsss.value = '失败'
		// 			}
		// 		})

		// 	}
		// })








	}


	onMounted(() => {
		// let image = "http://tmp/bX8bKMw3mvrF9afbb27207db4f4bb789105550582006.png"

		// console.log('%%%%%%%', image)
		// compress(image, {
		// 	quality: 0.6, // 设置压缩质量
		// 	async success(result) {
		// 		console.log('%%%%%%%', result)

		// 	},
		// 	error(err) {
		// 		console.log(err.message)
		// 	}
		// })
	})
</script>

<style scoped>
	.container {
		padding: 20px;
	}

	.content {
		background: #fff;
		padding: 20px;
		border: 1px solid #ddd;
	}
</style>