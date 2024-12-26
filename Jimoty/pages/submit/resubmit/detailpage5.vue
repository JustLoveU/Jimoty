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

		<view class="submit-row3">
			<view class="submit-row3-left">
				<input style="width: 100%;" type="text" v-model="postName" placeholder="请输入商品名字" />
			</view>
			<view class="submit-row3-right">
				<uni-icons type="right" size="22"></uni-icons>
			</view>
		</view>


		<view class="submit-row4">
			<view class="submit-row4-left">
				商品价格
			</view>
			<view class="submit-row4-right" style="display: flex;align-items: center;">
				<input style="margin-right: 15rpx;" type="digit" v-model="postPrice" @input="formatPrice" @blur="blur"
					placeholder="￥00.00" />
				<view>元</view>
			</view>
		</view>


		<view class="submit-row5">
			<view class="submit-row5-top">
				商品说明
			</view>
			<view class="submit-row5-center">
				<textarea auto-height v-model="mainText" placeholder="请记载以下信息,尺寸,重量,注意事项等" :maxlength="255" />
			</view>
		</view>

		<view class="submit-row6">
			<view class="submit-row6-cheack active">

			</view>
			<view class="submit-row6-des">
				现金支付
			</view>
		</view>


		<view class="submit-row1" @tap="openmap">
			<view class="submit-row1-left">
				交接地点
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
	import { onMounted, ref, nextTick, onUnmounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app'
	let db = uniCloud.database()
	import { upLoadImage } from '@/utils/upLoadImage.js'
	import { verifyName } from '@/utils/verifyName.js'
	import { addXiSocre } from '@/utils/addXiSocre.js'
	const secCheckObj = uniCloud.importObject("secCheckContent", { customUI: true })
	const postPrice = ref('')
	const formattedPrice = ref('')
	const mainText = ref('')
	const postName = ref('')

	const previewList = ref([])
	// 协议
	const protocol = ref(null)
	const categeryData = ref([])
	const categeryStr = ref('')
	const categeryId = ref('')

	const mapData = ref({})

	// 草稿的postID
	const draftPostId = ref('')

	const postStatus = ref(0)

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
			postName.value = data.noteTitle
			postPrice.value = data.postPrice
			mainText.value = data.mainText
			mapData.value = {
				address: data.location.address,
				province: data.location.province,
				longitude: data
					.point[0],
				latitude: data.point[1]
			}

		}
	})

	onMounted(() => {
		uni.$on('cameraPhotos', res => {
			console.log(res, '拍摄的照片');
			previewList.value = [...res]
		})

		uni.$on('mapData', res => {
			mapData.value = res
			console.log(res);
		})

		uni.$on('categeryData', res => {
			categeryData.value = res.categery
			categeryId.value = res.id
			categeryData.value.forEach(res => {
				categeryStr.value = categeryStr.value + res
			})

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


	// 打开类目
	function openCategery() {
		uni.navigateTo({
			url: `/pages/submit/datapage?index=0&parentId=66f04609eef9cba934a06332`
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

		// 必需填写价格
		if (postPrice.value == '') {
			uni.showToast({
				title: '请填写价格',
				icon: 'none'
			})
			Inoperation.value = false
			return
		}


		if (categeryData.value.length < 1 || postName.value == '' || !
			mapData.value.address) {
			uni.showToast({
				title: '请填写完整',
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

						let sec = await secCheckObj.textSecCheck({ content: postName.value })
						if (sec.errCode != 0) {
							uni.showModal({
								title: sec.errMsg,
								content: `输入的内容违规，涉及“${sec.result.label}”，请重新编辑！`,
								showCancel: false
							})
							postName.value = ''
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
									noteTitle: postName.value,
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
									payMethod: 0,
									postPrice: postPrice.value,
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
									noteTitle: postName.value,
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
									payMethod: 0,
									postPrice: postPrice.value,
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
							console.log(postStatus.value, '@@@@#!', draftPostId.value);
							let data = {
								type: 5,
								photos: previewList.value,
								category: categeryId.value,
								noteTitle: postName.value,
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
								payMethod: 0,
								postPrice: postPrice.value,
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
		}

		.submit-row1-right-des {
			display: flex;
			align-items: center;

			.breadcrumb-item:not(:first-child)::before {
				content: '>';
				margin-left: 15rpx;
			}

		}
	}


	.submit-row3 {
		background-color: white;
		margin-top: 20rpx;
		padding: 0 20rpx;
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.submit-row3-left {
			display: flex;
			align-items: center;
			padding: 20rpx 0;
			width: 100%;

			// .submit-row3-left-btu1 {
			// 	height: 80rpx;
			// 	padding: 0 20rpx;
			// 	line-height: 80rpx;
			// 	border: 1px solid rgb(121, 121, 121);
			// 	margin-right: 20rpx;
			// 	border-radius: 10rpx;
			// }
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

		.submit-row4-right {
			width: 140rpx;
		}
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

	}

	.submit-row6 {
		display: flex;
		align-items: center;
		background-color: white;
		margin-top: 20rpx;
		padding: 0 20rpx;

		.submit-row6-cheack {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			border: 2px solid rgb(130, 130, 130);
			display: flex;
			align-items: center;
			justify-content: center;

		}

		.active {
			border: 2px solid rgb(33, 159, 98);


			&::after {
				content: '';
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				background-color: rgb(33, 159, 98);
			}
		}

		.submit-row6-des {
			margin-left: 20rpx;
			height: 80rpx;
			line-height: 80rpx;
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
		margin: 20rpx;
		border-radius: 10rpx;
	}
</style>