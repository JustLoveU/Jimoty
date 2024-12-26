<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<uni-forms-item name="type" label="通知类型" required>
				<uni-easyinput disabled placeholder="通知类型(0系统消息1聊天消息2关注消息,3评论消息,4收藏消息5.关注用户上架商品消息,6商品上架消息)"
					type="number" v-model="formData.type"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="sendPeople" label="发送者">
				<uni-easyinput disabled placeholder="发送者" v-model="formData.sendPeople"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="receive" label="接收者" required>
				<uni-easyinput disabled placeholder="接收者" v-model="formData.receive"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="message" label="消息">
				<uni-easyinput disabled placeholder="消息" v-model="formData.message"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="otherMessage" label="其他消息">
				<uni-easyinput disabled placeholder="其他消息" v-model="formData.otherMessage"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="status" label="消息状态">
				<switch @change="binddata('status', $event.detail.value)" :checked="formData.status"></switch>
			</uni-forms-item>
			<uni-forms-item name="create_date" label="">
				<uni-datetime-picker return-type="timestamp" v-model="formData.create_date"></uni-datetime-picker>
			</uni-forms-item>
			<view class="uni-button-group">
				<button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
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
				"type": null,
				"sendPeople": "",
				"receive": "",
				"message": "",
				"otherMessage": "",
				"status": false,
				"create_date": null
			}
			return {
				formData,
				formOptions: {},
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onLoad(e) {
			if (e.id) {
				const id = e.id
				this.formDataId = id
				this.getDetail(id)
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
				this.$refs.form.validate().then((res) => {
					return this.submitForm(res)
				}).catch(() => {}).finally(() => {
					uni.hideLoading()
				})
			},

			/**
			 * 提交表单
			 */
			submitForm(value) {
				// 使用 clientDB 提交数据
				return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
					uni.showToast({
						title: '修改成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
			},

			/**
			 * 获取表单数据
			 * @param {Object} id
			 */
			getDetail(id) {
				uni.showLoading({
					mask: true
				})
				db.collection(dbCollectionName).doc(id).field(
					"type,sendPeople,receive,message,otherMessage,status,create_date").get().then((res) => {
					const data = res.result.data[0]
					if (data) {
						this.formData = data

					}
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>