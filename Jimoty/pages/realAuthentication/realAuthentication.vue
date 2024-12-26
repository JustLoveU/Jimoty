<template>
	<view class="container">

		<view class="real-box">
			<uni-forms ref="form" :modelValue="formData" label-position="top" :rules="rules">
				<uni-forms-item required label="姓名" name="name">
					<uni-easyinput type="text" v-model="formData.name" placeholder="请输入您的真实姓名" />
				</uni-forms-item>
				<uni-forms-item required name="idcard" label="身份证号">
					<uni-easyinput type="idcard" v-model="formData.idcard" placeholder="请输入您的真实身份证号码" />
				</uni-forms-item>
			</uni-forms>
		</view>

		<view class="real-bottom">
			<view class="bottom-row1-btu" @tap="submit">
				提交
			</view>
			<view class="bottom-row2">
				<uni-data-checkbox multiple v-model="checkbox1" :localdata="check"></uni-data-checkbox>
				<view class="bottom-row2-des">
					已阅读并同意 <text style="color: rgb(107,156,231);">《用户协议》</text>
				</view>
			</view>

		</view>

	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad, onUnload } from '@dcloudio/uni-app'
	const db = uniCloud.database()
	const uid = uniCloud.getCurrentUserInfo().uid
	import { mutations } from '@/uni_modules/uni-id-pages/common/store.js'


	const checkbox1 = ref([])

	const form = ref(null)

	const formData = ref({
		name: '',
		idcard: ''
	})

	const check = ref([{
		text: '',
		value: 0
	}])


	// 隐藏返回按钮
	onLoad(() => {
		// uni.hideHomeButton()
	})
	onUnload(() => {

	})

	const rules = ref({
		// 对name字段进行必填验证
		name: {
			rules: [{
					required: true,
					errorMessage: '请输入姓名',
				},
				{
					pattern: /^[\u4e00-\u9fa5]{2,4}$/,
					errorMessage: '姓名长度在 2 到 4 个中文字符',
				}
			]
		},
		// 对idcard字段进行必填验证
		idcard: {
			rules: [{
					required: true,
					errorMessage: '请输入身份证号',
				},
				{
					pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])\d{3}(\d|X)$/,
					errorMessage: '请输入正确的身份证',
				},
			]
		}
	})

	const ifOperation = ref(false)

	function submit() {
		console.log(checkbox1.value);
		if (ifOperation.value) return
		ifOperation.value = true
		if (checkbox1.value.length > 0) {
			form.value.validate().then(res => {
				console.log('表单数据信息：', res);

				// 更新数据
				let data = {
					identity: formData.value.idcard,
					real_name: formData.value.name,
					auth_status: 2
				}
				db.collection('uni-id-users').doc(uid).update({ realname_auth: data })

				let userinfo = uni.getStorageSync('uni-id-pages-userInfo')

				userinfo.realNameStatus = 2
				uni.setStorageSync('uni-id-pages-userInfo', userinfo)

				uni.showToast({
					title: '已完成实名认证',
					icon: 'none'
				})

				setTimeout(() => {
					uni.navigateBack()
				}, 800)


			}).catch(err => {
				console.log('表单错误信息：', err);
			})
		} else {
			uni.showToast({
				title: '请勾选并阅读协议',
				icon: 'none'
			})
		}
		ifOperation.value = false
	}
</script>

<style lang="scss">
	.real-box {
		padding: 20rpx;
		margin: 20rpx;
		background-color: white;
		border-radius: 10px;

	}

	.real-bottom {
		position: fixed;
		width: 100%;
		bottom: 50rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.bottom-row1-btu {
			background-color: rgb(0, 178, 106);
			color: white;
			border-radius: 20px;
			width: 80%;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			margin-bottom: 50rpx;
			font-weight: 600;
			font-size: 32rpx;
		}

		.bottom-row2 {
			display: flex;
			align-items: center;

			.bottom-row2-des {
				// margin-left: 10rpx;
			}
		}
	}
</style>