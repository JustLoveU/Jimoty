<template>
	<view class="container">
		<view class="cameras">
			<view class="camera" v-for="(item,index) in 5" :key="index" @tap="opencamera">
				<image style="width: 130rpx;height: 130rpx;" :src="previewList[index]" mode="aspectFill"
					v-if="previewList[index]"></image>
				<uni-icons v-else type="camera-filled" color="rgb(33,159,98)" size="32"></uni-icons>
			</view>
		</view>

		<view class="submit-row1" @tap="openCategery">
			<view class="submit-row1-left">
				类别(必填)
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
				<textarea auto-height placeholder="标题(必填255个字符以内):" :maxlength="255" v-model="titleText" />
			</view>
			<view class="submit-row1-bottom">
				<textarea auto-height placeholder="正文(必填15000个字符以内):" :maxlength="15000" v-model="mainText" />
			</view>
		</view>

		<view class="submit-row1" @tap="openmap">
			<view class="submit-row1-left">
				活动场所(必填)
			</view>
			<view class="submit-row1-right">
				<view class="submit-row1-right-des ellipsis" v-if="mapData.address">
					{{mapData.address}}
				</view>
				<uni-icons type="right" size="22"></uni-icons>
			</view>
		</view>



		<view style="padding: 20rpx; background-color: white; margin-top: 20rpx;">
			设定成员招募条件(可选)
		</view>
		<view class="submit-row1" style="margin-top: 0%;" @tap="gotochoose(1)">
			<view class="submit-row1-left">
				仅限于同性
			</view>
			<view class="submit-row1-right">
				<view class="submit-row1-right-des">
					{{condition}}
				</view>
				<uni-icons type="right" size="22"></uni-icons>
			</view>
		</view>
		<view class="submit-row1" style="margin-top: 0%;" @tap="gotochoose(2)">
			<view class="submit-row1-left">
				招募的年龄
			</view>
			<view class="submit-row1-right">
				<view class="submit-row1-right-des">
					{{conditionAge == [1,99] ? '没有限定':conditionAge}}
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
	import { upLoadImage } from '@/utils/upLoadImage.js'
	let db = uniCloud.database()
	import { verifyName } from '@/utils/verifyName.js'
	import { addXiSocre } from '@/utils/addXiSocre.js'
	const secCheckObj = uniCloud.importObject("secCheckContent", { customUI: true })
	const previewList = ref([])

	const categeryData = ref([])
	const categeryStr = ref('')
	const categeryId = ref('')

	const mapData = ref({})

	const condition = ref('')

	const conditionAge = ref('')

	// 协议
	const protocol = ref(null)

	//标题
	const titleText = ref('')
	// 正文
	const mainText = ref('')

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
			conditionAge.value = data.recruitAge
			condition.value = data.sex
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

		uni.$on('condition', res => {
			condition.value = res
		})

		uni.$on('conditionAge', res => {
			if (res == '没有限定') {
				conditionAge.value = res
			} else {
				conditionAge.value = res[0] + '-' + res[1]
			}

		})

	})

	onUnmounted(() => {
		uni.$off('mapData')
		uni.$off('categeryData')
		uni.$off('condition')
		uni.$off('conditionAge')
	})


	function opencamera() {

		const images = JSON.stringify(previewList.value)
		uni.navigateTo({
			url: `/pages/submit/camera?images=${images}`
		})
	}

	function openmap() {
		uni.navigateTo({
			url: `/pages/submit/map?index=-1`
		})
	}

	function gotochoose(index) {
		uni.navigateTo({
			url: `/pages/submit/otherDataPage?index=${index}`
		})
	}




	// 投稿
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
			mapData.value.address) {
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
									sex: condition.value,
									recruitAge: conditionAge.value,
									create_date: Date.now(),
									update_date: Date.now(),
									status: 0
								}).then(
									async (res) => {
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
									sex: condition.value,
									recruitAge: conditionAge.value,
									status: 0
								}).then(
									async (res) => {
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
								type: 1,
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
								sex: condition.value,
								recruitAge: conditionAge.value,
								status: postStatus.value
							}

							db.collection('jimoty-post').add(data).then(async (res) => {
								console.log(res);
								await upLoadImage(res.result.id, previewList.value)

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
								}, 1000)
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

	// 打开类目
	function openCategery() {
		uni.navigateTo({
			url: `/pages/submit/datapage?index=0&parentId=66f045f8337a9f907ceb9001`
		})
	}


	const postStatus = ref(0)
	// 保存为草稿
	function save() {
		postStatus.value = 1
		submit()
	}
</script>

<style lang="scss">
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

	.submit-row6 {
		display: flex;
		align-items: center;
		background-color: white;
		margin-top: 20rpx;
		padding: 20rpx;
		border-bottom: 1px solid rgb(171, 171, 171);

		.submit-row6-cheack {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			border: 2px solid rgb(130, 130, 130);
			display: flex;
			align-items: center;
			justify-content: center;

			.submit-row6-cheack-dot {
				width: 30rpx;
				height: 30rpx;
				border-radius: 50%;
				background-color: rgb(33, 159, 98);
			}
		}

		.submit-row6-des {
			margin-left: 20rpx;
		}


	}

	.submit-text {
		padding: 30rpx;
		line-height: 40rpx;
		color: rgb(121, 121, 121);
	}

	.submit-bottom-btu {
		margin-bottom: 30rpx;
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