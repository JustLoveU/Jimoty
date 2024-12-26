<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<uni-forms-item name="userId" label="发布者" required>
				<uni-easyinput disabled placeholder="发布者" v-model="formData.userId"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="type" label="类目" required>
				<uni-easyinput placeholder="类目(1社交，2兼职，3教培，4领养，5闲置)" type="number"
					v-model="formData.type"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="category" label="类别">
				<uni-easyinput placeholder="发布者" v-model="formData.category"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="recruitAge" label="招募年龄">
				<uni-easyinput placeholder="招募年龄" v-model="formData.recruitAge"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="noteTitle" label="标题">
				<uni-easyinput placeholder="标题" v-model="formData.noteTitle" trim="both"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="mainText" label="正文">
				<uni-easyinput placeholder="正文" v-model="formData.mainText" trim="both"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="companyName" label="公司名">
				<uni-easyinput placeholder="公司名" v-model="formData.companyName"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="payrollForm" label="工资形式">
				<uni-easyinput placeholder="工资形式" v-model="formData.payrollForm"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="salary" label="薪资">
				<uni-easyinput placeholder="薪资" v-model="formData.salary"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="salarySupplement" label="工资补充">
				<uni-easyinput placeholder="工资补充" v-model="formData.salarySupplement"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="traffic" label="交通">
				<uni-easyinput placeholder="交通" v-model="formData.traffic"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="workTime" label="工作时间">
				<uni-easyinput placeholder="工作时间" v-model="formData.workTime"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="workPosition" label="工作地点">
				<uni-easyinput placeholder="工作地点" v-model="formData.workPosition"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="phone" label="电话">
				<uni-easyinput placeholder="电话" v-model="formData.phone"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="employeeForm" label="雇佣形式">
				<uni-easyinput placeholder="雇佣形式" v-model="formData.employeeForm"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="sex" label="性别">
				<uni-easyinput placeholder="性别(男,女,不限制)" v-model="formData.sex"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="age" label="年龄">
				<uni-easyinput placeholder="年龄（6年7月）" v-model="formData.age"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="sterOperation" label="绝育手术">
				<uni-easyinput placeholder="绝育手术" v-model="formData.sterOperation"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="vaccinelnoculation" label="疫苗接种">
				<uni-easyinput placeholder="疫苗接种" v-model="formData.vaccinelnoculation"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="releaseReason" label="投稿理由">
				<uni-easyinput placeholder="投稿理由" v-model="formData.releaseReason"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="payMethod" label="支付方式">
				<uni-easyinput placeholder="支付方式(0线下1线上)" type="number" v-model="formData.payMethod"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="postPrice" label="商品价格">
				<uni-easyinput placeholder="商品价格" v-model="formData.postPrice"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="status" label="帖子状态">
				<uni-easyinput placeholder="帖子状态(0待审核1草稿2审核通过3审核不通过4已结束)" type="number"
					v-model="formData.status"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="delete" label="逻辑删除">
				<uni-easyinput placeholder="逻辑删除(0删除，1未删除)" type="number" v-model="formData.delete"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="browse" label="浏览数">
				<uni-easyinput placeholder="浏览数" type="number" v-model="formData.browse"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="weight" label="权重">
				<uni-easyinput placeholder="权重" type="number" v-model="formData.weight"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="collect" label="收藏数">
				<uni-easyinput placeholder="收藏数" type="number" v-model="formData.collect"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="hightLight" label="高亮">
				<switch @change="binddata('hightLight', $event.detail.value)" :checked="formData.hightLight"></switch>
			</uni-forms-item>
			<uni-forms-item name="location" label="地理位置">
				<uni-easyinput disabled v-model="formData.location.address"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="create_date" label="创建时间">
				<uni-datetime-picker disabled return-type="timestamp"
					v-model="formData.create_date"></uni-datetime-picker>
			</uni-forms-item>
			<uni-forms-item name="update_date" label="更新时间">
				<uni-datetime-picker return-type="timestamp" v-model="formData.update_date"></uni-datetime-picker>
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
	import { validator } from '../../js_sdk/validator/jimoty-post.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'jimoty-post';

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
				"userId": "",
				"type": null,
				"category": "",
				"photos": [],
				"point": [],
				"recruitAge": "",
				"noteTitle": "",
				"mainText": "",
				"companyName": "",
				"payrollForm": "",
				"salary": "",
				"salarySupplement": "",
				"traffic": "",
				"workTime": "",
				"workPosition": "",
				"phone": "",
				"employeeForm": "",
				"sex": "",
				"age": "",
				"sterOperation": "",
				"vaccinelnoculation": "",
				"releaseReason": "",
				"payMethod": 0,
				"postPrice": "",
				"status": 0,
				"delete": 1,
				"browse": 0,
				"weight": 100,
				"collect": 0,
				"hightLight": false,
				"location": null,
				"create_date": null,
				"update_date": null
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
					"userId,type,category,photos,point,recruitAge,noteTitle,mainText,companyName,payrollForm,salary,salarySupplement,traffic,workTime,workPosition,phone,employeeForm,sex,age,sterOperation,vaccinelnoculation,releaseReason,payMethod,postPrice,status,delete,browse,weight,collect,hightLight,location,location,create_date,update_date"
				).get().then((res) => {
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