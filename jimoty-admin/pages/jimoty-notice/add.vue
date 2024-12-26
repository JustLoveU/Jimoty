<template>
	<view class="uni-container">

		<view class="">
			发送系统消息：
		</view>
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<uni-forms-item name="message" label="消息" required>
				<uni-easyinput placeholder="消息" v-model="formData.message"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="otherMessage" label="其他消息">
				<uni-easyinput placeholder="其他消息" v-model="formData.otherMessage"></uni-easyinput>
			</uni-forms-item>
			<view class="uni-button-group">
				<button type="primary" class="uni-button" style="width: 100px;" @click="submit">发送</button>
				<navigator open-type="navigateBack" style="margin-left: 15px;">
					<button class="uni-button" style="width: 100px;">返回</button>
				</navigator>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import { validator } from '../../js_sdk/validator/jimoty-notice.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'jimoty-notice';
	const uid = uniCloud.getCurrentUserInfo().uid

	function getValidator(fields) {
		let result = {}
		for (let key in validator) {
			if (fields.includes(key)) {
				result[key] = validator[key]
			}
		}
		return result
	}



	export default {
		data() {
			let formData = {
				"type": 0,
				"sendPeople": '66f00e149755e3b8e775034c',
				"receive": "",
				"message": "",
				"otherMessage": "系统消息",
			}
			return {
				formData,
				formOptions: {},
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {

			/**
			 * 验证表单并提交
			 */
			submit() {
				uni.showLoading({
					mask: true
				})
				if (this.formData.message == '') {
					uni.showToast({
						title: '请输入消息',
						icon: 'none'
					})
					return
				}
				this.$refs.form.validate().then((res) => {
					return this.submitForm(res)
				}).catch(() => {}).finally(() => {
					uni.hideLoading()
				})
			},

			/**
			 * 提交表单
			 */
			async submitForm(value) {
				// 使用 clientDB 提交数据
				const res = await db.collection('uni-id-users').field('_id').get()

				res.result.data.forEach((item) => {
					let data = {
						"type": 0,
						"sendPeople": '66f00e149755e3b8e775034c',
						"receive": item._id,
						"message": this.formData.message,
						"otherMessage": this.formData.otherMessage,
					}
					console.log(data);
					db.collection(dbCollectionName).add(data).then((res) => {

					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					})

				})

				// this.getOpenerEventChannel().emit('refreshData')
				// setTimeout(() => uni.navigateBack(), 500)
				return
			}
		}
	}
</script>