<template>
	<view class="container">

		<view class="submit-text">
			远离生物体的交易，请事先出示疾病和健康状态等，交付的时候一定要签订误渡合同。避免阉割手术和接种疫苗的费用，请根据收据事先咨询负担部分。
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
				<textarea auto-height v-model="titleText" placeholder="标题(必填255字符以内):" :maxlength="255" />
			</view>
			<view class="submit-row1-bottom">
				<textarea auto-height v-model="mainText" placeholder="正文(必填15000个字符以内)请报告以下信息" :maxlength="15000" />
			</view>
		</view>




		<view class="submit-row3">
			<view class="submit-row3-row">
				<view class="submit-row3-row-des">
					年龄
				</view>
				<view class="submit-row3-row-oprate">
					<uni-data-select v-model="value1" :localdata="range1" :clear="false"></uni-data-select>年
					<uni-data-select v-model="value2" :localdata="range2" :clear="false"></uni-data-select>月
				</view>
			</view>

			<view class="submit-row3-row">
				<view class="submit-row3-row-des">
					性别(必须)
				</view>
				<view class="submit-row3-row-oprate">
					<uni-data-select v-model="value3" :localdata="range3" :clear="false"></uni-data-select>
				</view>
			</view>

			<view class="submit-row3-row">
				<view class="submit-row3-row-des">
					绝育手术(必须)
				</view>
				<view class="submit-row3-row-oprate">
					<uni-data-select v-model="value4" :localdata="range4" :clear="false"></uni-data-select>
				</view>
			</view>

			<view class="submit-row3-row">
				<view class="submit-row3-row-des">
					疫苗接种(必须)
				</view>
				<view class="submit-row3-row-oprate">
					<uni-data-select v-model="value5" :localdata="range5" :clear="false"></uni-data-select>
				</view>
			</view>

		</view>


		<view class="submit-row1">
			<view class="submit-row1-right" style="min-height: 100rpx;">
				<textarea auto-height placeholder="投稿理由(必需)" v-model="releaseReason" :maxlength="255" />
			</view>
		</view>



		<view class="submit-row1" @tap="openmap">
			<view class="submit-row1-left">
				交接地点(必填)
			</view>
			<view class="submit-row1-right">
				<view class="submit-row1-right-des ellipsis" v-if="mapData.address">
					{{mapData.address}}
				</view>
				<uni-icons type="right" size="22"></uni-icons>
			</view>
		</view>

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

	const releaseReason = ref('')
	// 协议
	const protocol = ref(null)
	const previewList = ref([])

	const categeryData = ref([])
	const categeryStr = ref('')
	const categeryId = ref('')

	const mapData = ref({})

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

			value3.value = range3.value.find(item => item.text === data.sex).value,

				value4.value = range4.value.find(item => item.text === data.sterOperation).value,
				value5.value = range5.value.find(item => item.text === data.vaccinelnoculation).value
			releaseReason.value = data.releaseReason
			let numbers = data.age.match(/\d+/g)
			value1.value = range1.value.find(item => item.text === numbers[0]).value
			value2.value = range2.value.find(item => item.text === numbers[1]).value
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

	// 打开类目
	function openCategery() {
		uni.navigateTo({
			url: `/pages/submit/datapage?index=0&parentId=66f04627c3b5c99cfcd65dd0`
		})
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

	// 投稿
	const Inoperation = ref(false)

	async function submit() {
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
			mapData.value.address || releaseReason.value == '') {
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
									sex: range3.value[value3.value].text,
									age: range1.value[value1.value].text + '年' + range2.value[
											value2
											.value]
										.text + '月',
									sterOperation: range4.value[value4.value].text,
									vaccinelnoculation: range5.value[value5.value].text,
									releaseReason: releaseReason.value,
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
									sex: range3.value[value3.value].text,
									age: range1.value[value1.value].text + '年' + range2.value[
											value2
											.value]
										.text + '月',
									sterOperation: range4.value[value4.value].text,
									vaccinelnoculation: range5.value[value5.value].text,
									releaseReason: releaseReason.value,
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
								type: 4,
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
								sex: range3.value[value3.value].text,
								age: range1.value[value1.value].text + '年' + range2.value[value2.value]
									.text + '月',
								sterOperation: range4.value[value4.value].text,
								vaccinelnoculation: range5.value[value5.value].text,
								releaseReason: releaseReason.value,
								status: postStatus.value
							}

							db.collection('jimoty-post').add(data).then(res => {
								console.log(res);
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


	const postStatus = ref(0)
	// 保存为草稿
	function save() {
		postStatus.value = 1
		submit()
	}

	const value1 = ref(0)
	const value2 = ref(0)
	const value3 = ref(0)
	const value4 = ref(0)
	const value5 = ref(0)

	const range1 = ref([
		{ value: 0, text: "0" },
		{ value: 1, text: "1" },
		{ value: 2, text: "2" },
		{ value: 3, text: "3" },
		{ value: 4, text: "4" },
		{ value: 5, text: "5" },
		{ value: 6, text: "6" },
		{ value: 7, text: "7" },
		{ value: 8, text: "8" },
		{ value: 9, text: "8" },
		{ value: 10, text: "9" },
		{ value: 11, text: "11" },
		{ value: 12, text: "12" },
		{ value: 13, text: "13" },
		{ value: 14, text: "14" },
		{ value: 15, text: "15" },
		{ value: 16, text: "16" },
		{ value: 17, text: "17" },
		{ value: 18, text: "18" },
		{ value: 19, text: "19" },
		{ value: 20, text: "20" },
		{ value: 21, text: "21" },
		{ value: 22, text: "22" },
		{ value: 23, text: "23" },
		{ value: 24, text: "24" },
		{ value: 25, text: "25" },
	])

	const range2 = ref([
		{ value: 0, text: "0" },
		{ value: 1, text: "1" },
		{ value: 2, text: "2" },
		{ value: 3, text: "3" },
		{ value: 4, text: "4" },
		{ value: 5, text: "5" },
		{ value: 6, text: "6" },
		{ value: 7, text: "7" },
		{ value: 8, text: "8" },
		{ value: 9, text: "9" },
		{ value: 10, text: "10" },
		{ value: 11, text: "11" }
	])

	const range3 = ref([
		{ value: 0, text: "男" },
		{ value: 1, text: "女" },
		{ value: 2, text: "其他" }
	])


	const range4 = ref([
		{ value: 0, text: "是" },
		{ value: 1, text: "否" }

	])

	const range5 = ref([
		{ value: 0, text: "是" },
		{ value: 1, text: "否" }
	])
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
		// color: rgb(171, 171, 171);
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
		margin-top: 20rpx;
		padding: 20rpx;
		background-color: white;

		.submit-row3-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2px solid rgb(230, 230, 230);
			padding: 20rpx 0;
		}

		.submit-row3-row-oprate {
			display: flex;
			align-items: center;
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