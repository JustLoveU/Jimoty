<template>
	<view class="container">
		<view class="submit-text">
			需要他人帮忙的环境与要求请以同文形式清晰描述。
		</view>
		<view class="cameras">
			<view class="camera" v-for="(item,index) in 5" :key="index" @tap="opencamera">
				<image style="width: 130rpx;height: 130rpx;" :src="previewList[index]" mode="aspectFill"
					v-if="previewList[index]"></image>
				<uni-icons v-else type="camera-filled" color="rgb(33,159,98)" size="32"></uni-icons>
			</view>
		</view>

		<view class="submit-row1" @tap="openCategery">
			<view class="submit-row1-left">
				类别(必需)
			</view>
			<view class="submit-row1-right">
				<view class="submit-row1-right-des" v-if="categeryData.length>0">
					<view class="breadcrumb-item" v-for="(item,index) in categeryData" :key="index">
						{{item}}
					</view>
				</view>
				<uni-icons type="right" size="22"></uni-icons>
			</view>
		</view>



		<view class="submit-row2">
			<view class="submit-row2-top">
				<textarea auto-height placeholder="标题(必填):" :maxlength="255" v-model="titleText" />
			</view>
			<view class="submit-row1-bottom">
				<textarea auto-height placeholder="互助内容(必填，255字符以内)的详细描述" :maxlength="15000" v-model="mainText" />
			</view>
		</view>

		<view class="submit-text">
			时间、地点、辛苦费等信息尽可能详细具体，该部分为重点监察对象，请重视！
		</view>


		<view style="background-color: white;padding: 20rpx;display: flex;align-items: center;">
			<text>地点(必填):</text><input type="text" v-model="conpanyName" />
		</view>
		<view class="submit-text">
			请输入简洁明了的位置。
		</view>

		<view class="submit-row7">
			<view class="submit-row7-row1">
				<view class="submit-row7-row1-text">
					辛苦费形式(必填)
				</view>
				<view class="submit-row7-row1-select">
					<uni-data-select v-model="value1" :localdata="range1" @change="change1"
						:clear="false"></uni-data-select>
				</view>
			</view>

			<view class="submit-row7-row1">
				<view class="submit-row7-row1-text">
					辛苦费(必填)
				</view>
				<view class="submit-row4-right" style="display: flex;align-items: center;">
					<input style="margin-right: 10rpx;" type="digit" v-model="salary" @input="formatPrice" @blur="blur"
						placeholder="￥00.00" />
					<view>元</view>
				</view>
				<!-- 	<input type="number" v-model="salary" @input="formatPrice" @blur="blur"
					style="position: absolute;right: 30rpx;" /> -->

			</view>

			<view class="submit-row7-row1">
				<view class="submit-row7-row1-text">
					<text>补充(任意):</text> <input type="text" placeholder="其他吸睛事项" v-model="salaryAdd" />
				</view>
			</view>

			<view class="submit-row7-row1">
				<view class="submit-row7-row1-text">
					<text style="color: rgb(171, 171, 171);">步行时长(任意):</text> <input type="text"
						placeholder="例如离车站步行几分钟" v-model="traffic" />
				</view>
			</view>

			<view class="submit-row7-row1">
				<view class="submit-row7-row1-text">
					<text style="color: rgb(171, 171, 171);">指定时段(必填):</text> <input type="text"
						placeholder="例如 11/8 9:00-11:30" v-model="workTime" />
				</view>
			</view>
		</view>


		<view class="submit-row1" @tap="openmap">
			<view class="submit-row1-left">
				定位(必填):
			</view>
			<view class="submit-row1-right">
				<view class="submit-row1-right-des ellipsis" v-if="mapData.address">
					{{mapData.address}}
				</view>
				<uni-icons type="right" size="22"></uni-icons>
			</view>
		</view>

		<!-- 		<view class="submit-row1">
			<view class="submit-row1-left" style="display: flex; align-items: center;">
				工作地点(必填)
			</view>
			<view class="submit-row1-right">
				<input type="text" v-model="workPosition" />
			</view>
		</view> -->

		<view class="submit-row2">
			<view class="submit-row2-top" style="display: flex; align-items: center;">
				<text>电话号码(可选)</text> <input class="uni-input" v-model="phone" type="tel" maxlength="11"
					placeholder="电话号码" />
			</view>
		</view>

		<view class="submit-text">
			接收输入固定电话号码的情况下，电话号码会被固定在帖子中，另外，电话号码经过TEL号码认证，只能对用户公开
		</view>

		<view class="submit-row7-row1"
			style="display: flex;align-items: center; justify-content: space-between; background-color: white;padding: 20rpx;">
			<view class="submit-row7-row1-text">
				互助形式(任意):
			</view>
			<view class="submit-row7-row1-select">
				<!-- 			<uni-data-select v-model="value2" :localdata="range2" @change="change2"
					:clear="false"></uni-data-select> -->
				<input type="text" placeholder="临时/互助等" v-model="otherWay" />
			</view>
		</view>
		<!-- 	<input v-if="value2==2" type="text" placeholder="请输入其他形式"
			style="background-color: white;height: 60rpx;line-height: 60rpx;padding: 0 20rpx;" v-model="otherWay" /> -->

		<JJ-protocol ref="protocol"></JJ-protocol>

		<view class="submit-bottom-btu" style="background-color: rgb(33, 159, 98); color: white;" @tap="submit">
			{{ draftPostId == '' ? '投稿' : '重新投稿'}}
		</view>
		<view class="submit-bottom-btu" style="background-color: white; color: rgb(33, 159, 98);" @tap="save"
			v-if="draftPostId == ''">
			保存为草稿
		</view>

	</view>
</template>

<script setup>
	import { onMounted, ref, onUnmounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app'
	let db = uniCloud.database()
	import { upLoadImage } from '@/utils/upLoadImage.js'
	import { verifyName } from '@/utils/verifyName.js'
	import { addXiSocre } from '@/utils/addXiSocre.js'
	const secCheckObj = uniCloud.importObject("secCheckContent", { customUI: true })
	//标题
	const titleText = ref('')
	// 正文
	const mainText = ref('')

	const conpanyName = ref('')
	const salary = ref('')
	const formattedPrice = ref('')
	const salaryAdd = ref('')
	const traffic = ref('')
	const workTime = ref('')
	const workPosition = ref('')

	const categeryData = ref([])
	const categeryStr = ref('')
	const categeryId = ref('')
	const phone = ref('')
	const otherWay = ref('')

	const mapData = ref({})

	const previewList = ref([])
	// 协议
	const protocol = ref(null)

	// 草稿的postID
	const draftPostId = ref('')

	onShow(() => {
		verifyName()
	})

	onLoad(async (e) => {


		if (e.postId) {
			draftPostId.value = e.postId
		}

		if (draftPostId.value != '') {
			// 加载草稿数据
			// console.log('加载草稿数据', draftPostId.value);
			const res = await db.collection('jimoty-post').doc(draftPostId.value).get({ getOne: true })
			let data = res.result.data
			const res2 = await db.collection('jimoty-category').doc(data.category).get({ getOne: true })
			previewList.value = data.photos
			categeryId.value = data.category
			postStatus.value = data.status
			categeryData.value.push(res2.result.data.name)
			titleText.value = data.noteTitle
			mainText.value = data.mainText
			mapData.value = {
				address: data.location.address,
				province: data.location.province,
				longitude: data
					.point[0],
				latitude: data.point[1]
			}
			conpanyName.value = data.companyName
			value1.value = range1.value.find(item => item.text === data.payrollForm).value
			salary.value = data.salary
			salaryAdd.value = data.salarySupplement
			traffic.value = data.traffic
			workTime.value = data.workTime
			workPosition.value = data.workPosition
			phone.value = data.phone

			if (range2.value.find(item => item.text === data.employeeForm)) {
				value2.value = data.employeeForm
			} else {
				value2.value = 2
				otherWay.value = data.employeeForm
			}

		}
	})

	onMounted(() => {
		uni.$on('cameraPhotos', res => {
			previewList.value = res
		})
		uni.$on('categeryData', res => {
			categeryData.value = res.categery
			categeryId.value = res.id
			categeryData.value.forEach(res => {
				categeryStr.value = categeryStr.value + res
			})
		})
		uni.$on('mapData', res => {
			mapData.value = res
		})
	})
	onUnmounted(() => {
		uni.$off('mapData')
		uni.$off('categeryData')
		uni.$off('cameraPhotos')
	})


	function blur() {
		postPrice.value = formattedPrice.value
	}

	function formatPrice() {
		// Remove any non-numeric characters except the decimal point
		let numericValue = postPrice.value.replace(/[^0-9.]/g, '');

		// Ensure there is only one decimal point
		numericValue = numericValue.replace(/(\..*)\./g, '$1');

		// Parse the value as a float and format it to two decimal places
		let parsedValue = parseFloat(numericValue);
		if (!isNaN(parsedValue)) {
			formattedPrice.value = parsedValue.toFixed(2);

		} else {
			formattedPrice.value = '';
		}
	}

	function opencamera() {
		uni.navigateTo({
			url: '/pages/submit/camera'
		})
	}

	function openmap() {
		uni.navigateTo({
			url: `/pages/submit/map?index=-1`
		})
	}

	// 打开类目
	function openCategery() {
		uni.navigateTo({
			url: `/pages/submit/datapage?index=0&parentId=66f0462d7c8de454cff0d229`
		})
	}

	const Inoperation = ref(false)

	function submit() {
		if (Inoperation.value) return
		Inoperation.value = true

		// 必需同意协议
		if (!protocol.value.ifConfirm) {
			uni.showToast({
				title: '请阅读并同意投稿协议',
				icon: 'none'
			})
			Inoperation.value = false
			return
		}
		// 添加至少一张图片
		if (previewList.value.length <= 0) {
			uni.showToast({
				title: '请添加至少一张图片',
				icon: 'none'
			})
			Inoperation.value = false
			return
		}

		if (categeryData.value.length < 1 || titleText.value == '' || mainText.value == '' || !
			mapData.value.address || conpanyName.value == '' || workTime.value == '' || salary.value == '') {
			uni.showToast({
				title: '请填写必须',
				icon: 'none'
			})
			Inoperation.value = false
			return
		} else {
			uni.showModal({
				content: postStatus.value == 1 ? '是否保存为草稿' : '是否确认投稿',
				success: async function(res) {
					if (res.confirm) {
						uni.showLoading({
							mask: true,
							title: '上传中'
						})

						let sec = await secCheckObj.textSecCheck({ content: titleText.value })
						if (sec.errCode != 0) {
							uni.showModal({
								title: sec.errMsg,
								content: `输入的内容违规，涉及“${sec.result.label}”，请重新编辑！`,
								showCancel: false
							})
							titleText.value = ''
							Inoperation.value = false
							uni.hideLoading()
							return
						}

						let sec2 = await secCheckObj.textSecCheck({ content: mainText.value })
						if (sec2.errCode != 0) {
							uni.showModal({
								title: sec2.errMsg,
								content: `输入的内容违规，涉及“${sec2.result.label}”，请重新编辑！`,
								showCancel: false
							})
							mainText.value = ''
							Inoperation.value = false
							uni.hideLoading()
							return
						}



						if (draftPostId.value != '') {
							// 从草稿来更新数据
							if (postStatus.value == 4) {
								db.collection('jimoty-post').doc(draftPostId.value).update({
									photos: previewList.value,
									category: categeryId.value,
									noteTitle: titleText.value,
									mainText: mainText.value,
									location: {
										address: mapData.value.address,
										province: mapData.value
											.province
									},
									point: new db.Geo.Point(Number(mapData.value.longitude),
										Number(
											mapData
											.value
											.latitude)),
									point: [Number(mapData.value.longitude), Number(mapData.value
										.latitude)],
									companyName: conpanyName.value,
									payrollForm: range1.value[value1.value].text,
									salary: salary.value,
									salarySupplement: salaryAdd.value,
									traffic: traffic.value,
									workTime: workTime.value,
									workPosition: workPosition.value,
									phone: phone.value,
									employeeForm: otherWay.value,
									create_date: Date.now(),
									update_date: Date.now(),
									status: 0,
								}).then(async (res) => {
									await upLoadImage(draftPostId.value, previewList.value)
									uni.showToast({
										title: '审核完成后,自动上传',
										icon: 'none'
									})

									setTimeout(() => {
										uni.navigateBack()
									}, 800)
								})
							} else {
								db.collection('jimoty-post').doc(draftPostId.value).update({
									photos: previewList.value,
									category: categeryId.value,
									noteTitle: titleText.value,
									mainText: mainText.value,
									location: {
										address: mapData.value.address,
										province: mapData.value
											.province
									},
									point: new db.Geo.Point(Number(mapData.value.longitude),
										Number(
											mapData
											.value
											.latitude)),
									point: [Number(mapData.value.longitude), Number(mapData.value
										.latitude)],
									companyName: conpanyName.value,
									payrollForm: range1.value[value1.value].text,
									salary: salary.value,
									salarySupplement: salaryAdd.value,
									traffic: traffic.value,
									workTime: workTime.value,
									workPosition: workPosition.value,
									phone: phone.value,
									employeeForm: otherWay.value,
									status: 0,
								}).then(async (res) => {
									await upLoadImage(draftPostId.value, previewList.value)
									uni.showToast({
										title: '审核完成后,自动上传',
										icon: 'none'
									})

									setTimeout(() => {
										uni.navigateBack()
									}, 800)
								})
							}

						} else {
							console.log('用户点击确定');
							let data = {
								type: 2,
								photos: previewList.value,
								category: categeryId.value,
								noteTitle: titleText.value,
								mainText: mainText.value,
								location: {
									address: mapData.value.address,
									province: mapData.value
										.province
								},
								point: new db.Geo.Point(Number(mapData.value.longitude), Number(mapData
									.value
									.latitude)),
								point: [Number(mapData.value.longitude), Number(mapData.value
									.latitude)],
								companyName: conpanyName.value,
								payrollForm: range1.value[value1.value].text,
								salary: salary.value,
								salarySupplement: salaryAdd.value,
								traffic: traffic.value,
								workTime: workTime.value,
								workPosition: workPosition.value,
								phone: phone.value,
								employeeForm: otherWay.value,
								status: postStatus.value
							}

							db.collection('jimoty-post').add(data).then(res => {
								upLoadImage(res.result.id, previewList.value)
								if (postStatus.value == 0) {
									uni.showToast({
										title: '审核完成后,自动上传',
										icon: 'none'
									})
									addXiSocre()
								} else {
									uni.showToast({
										title: '已保存为草稿',
										icon: 'none'
									})
								}
								setTimeout(() => {
									uni.navigateBack()
								}, 800)
							})
						}


					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		}
		uni.hideLoading()
		Inoperation.value = false
	}



	const value1 = ref(0)
	const value2 = ref(0)
	const range1 = ref([
		{ value: 0, text: "按时" },
		{ value: 1, text: "按日" },
		{ value: 2, text: "按月" },
		{ value: 3, text: "其他" },
	])

	const range2 = ref([
		{ value: 0, text: "派遣" },
		{ value: 1, text: "委托" },
		{ value: 2, text: "其他" },
	])



	const postStatus = ref(0)
	// 保存为草稿
	function save() {
		postStatus.value = 1
		submit()
	}
</script>

<style lang="scss">
	.container {
		padding-bottom: 30rpx;
	}

	.cameras {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 20rpx 30rpx 0 30rpx;

		.camera {
			width: 130rpx;
			height: 130rpx;
			background-color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2px solid rgb(33, 159, 98);
		}
	}

	.submit-row1 {
		margin-top: 20rpx;
		background-color: white;
		padding: 0 20rpx;
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.submit-row1-left {
			width: 200rpx;
		}


		.submit-row1-right {
			display: flex;
			align-items: center;

			.submit-row1-right-des {
				display: flex;
				align-items: center;

				.breadcrumb-item:not(:first-child)::before {
					content: '>';
					margin-left: 15rpx;
				}

			}
		}
	}

	.submit-row2 {
		margin-top: 20rpx;
		padding: 20rpx;
		background-color: white;

		.submit-row2-top {

			padding: 10rpx 0;
		}

		.submit-row1-bottom {
			border-top: 1px solid rgb(171, 171, 171);
			min-height: 150rpx;
			padding: 20rpx 0;
		}
	}


	.submit-row3 {
		background-color: white;
		padding: 0 20rpx;
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.submit-row3-left {
			display: flex;
			align-items: center;

			.submit-row3-left-btu1 {
				height: 80rpx;
				padding: 0 20rpx;
				line-height: 80rpx;
				border: 1px solid rgb(121, 121, 121);
				margin-right: 20rpx;
				border-radius: 10rpx;
			}
		}
	}

	.submit-row4 {
		margin-top: 10rpx;
		background-color: white;
		padding: 0 20rpx;
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.submit-row5 {
		margin-top: 10rpx;
		background-color: white;
		padding: 20rpx;
		width: 100%;

		.submit-row5-top {
			font-weight: 600;
			font-size: 30rpx;
			margin-bottom: 20rpx;
		}

		.submit-row5-center {
			min-height: 300rpx;
		}

		.submit-row5-bottom {
			padding: 0 20rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 32rpx;
			text-align: center;
			border: 2px solid #c7c7c7;
			border-radius: 10rpx;
			margin-bottom: 30rpx;
		}
	}

	.submit-row7 {
		padding: 20rpx;
		background-color: white;

		.submit-row7-row1 {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 0;
			border-bottom: 1px solid rgb(157, 157, 157);

			.submit-row7-row1-text {
				display: flex;
				align-items: center;
				color: black;
			}

		}

		.submit-row4-right {
			width: 140rpx;
		}
	}

	.submit-text {
		padding: 30rpx;
		line-height: 40rpx;
		color: rgb(121, 121, 121);
	}

	.submit-bottom-btu {
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		background-color: rgb(33, 159, 98);
		color: white;
		font-weight: 600;
		font-size: 32rpx;
		// width: 90%;
		margin: 20rpx;
		border-radius: 10rpx;
	}
</style>