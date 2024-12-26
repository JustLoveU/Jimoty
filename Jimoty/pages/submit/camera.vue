<template>
	<view class="container">
		<view class="look-camera" v-if="ifLook">
			<image class="look-camera-image" :src="lookImage" mode="aspectFill"></image>
		</view>

		<camera v-else class="camera" :device-position="back" :flash="off" @error="error" @stop="stop"></camera>

		<view class="preview-wrapper">
			<view v-for="(item, index) in 5" :key="index" class="preview-item" @tap="reback">
				<image v-if="previewList[index]" :src="previewList[index] ? previewList[index] :''" mode="aspectFit"
					@tap.stop="lookImagefun(previewList[index],index)" />
			</view>
		</view>


		<view class="button-wrapper" v-if="!ifLook">
			<view class="flash-btn" @tap="toggleFlash">
				<image style="width: 50rpx;height: 50rpx;" src="../../static/submit/flash.png" mode="aspectFill">
				</image>
			</view>

			<view class="capture-btn" @tap="takePhoto"></view>

			<view class="flip-btn" @tap="flipCamera">
				<image style="width: 50rpx;height: 50rpx;" src="../../static/submit/recamera.png" mode="aspectFill">
				</image>
			</view>
		</view>

		<view class="button-wrapper" v-else>
			<view class="flash-btn" @tap="deleteImage">
				<image style="width: 50rpx;height: 50rpx;" src="../../static/submit/trash.png" mode="aspectFill">
				</image>
			</view>

			<view class="flash-btn" @tap="edit">
				<image style="width: 30rpx;height: 30rpx;"
					src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/编辑.png"
					mode="aspectFill">
				</image>
			</view>
		</view>

		<view class="bottom-buttons">
			<button class="open-gallery-btn" @tap="openGallery">
				<image style="width: 40rpx;height: 40rpx;" src="../../static/submit/xiang.png" mode="aspectFill" />

				<text style="margin-left: 20rpx;">打开相册</text>
			</button>
			<button class="other-btn" @tap="complete">
				<image style="width: 40rpx;height: 40rpx;" src="../../static/submit/complete.png" mode="aspectFill" />

				<text style="margin-left: 20rpx;">完成</text>
			</button>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app'


	const previewList = ref([]);
	const back = ref('back')
	const off = ref('off')

	// 查看图片
	const ifLook = ref(false)
	const lookImage = ref('')


	onLoad((e) => {
		if (e.images) {
			previewList.value = JSON.parse(e.images)
		}
	})

	// 拍照
	function takePhoto() {
		const ctx = uni.createCameraContext();

		ctx.takePhoto({
			quality: 'normal',
			success: (res) => {
				if (previewList.value.length < 5) {
					previewList.value.push(res.tempImagePath);
				} else {
					uni.showToast({ title: '最多只能拍摄五张照片', icon: 'none' });
				}
				console.log(previewList.value, '拍摄中');
			},
		});

	}
	const imageIndex = ref(0)
	// 查看图片
	function lookImagefun(image, index) {
		if (image) {
			lookImage.value = image
			imageIndex.value = index
			ifLook.value = true
		}

	}


	function edit() {
		uni.chooseImage({
			count: 1,
			sourceType: ['album'],
			sizeType: ['compressed'],
			success: (res) => {
				lookImage.value = res.tempFilePaths[0]
				previewList.value[imageIndex.value] = res.tempFilePaths[0]
			},
		});
	}

	// 回到照相机
	function reback() {
		console.log('@@@');
		if (ifLook.value) {
			ifLook.value = false
		}
	}

	// 完成
	function complete() {
		uni.$emit('cameraPhotos', previewList.value)
		uni.navigateBack()
	}


	function deleteImage() {
		const index = previewList.value.findIndex(item => item = lookImage.value)
		previewList.value.splice(index, 1);
		lookImage.value = ''
		ifLook.value = false
	}

	function toggleFlash() {
		if (off.value == 'off') {
			off.value = 'on'
		} else {
			off.value = 'off'
		}

	}

	function flipCamera() {
		if (back.value == 'front') {
			back.value = 'back'
		} else {
			back.value = 'front'
		}
	}

	function openGallery() {
		let num = 5 - previewList.value.length
		uni.chooseImage({
			count: num,
			sourceType: ['album'],
			sizeType: ['compressed'],
			success: (res) => {
				if (previewList.value.length < 5) {
					res.tempFilePaths.forEach((item) => {
						previewList.value.push(item);
					})

				} else {
					uni.showToast({ title: `最多只能选择${num}张照片`, icon: 'none' });
				}
			},
		});
	}

	function error(e) {
		uni.showToast({ title: '摄像头错误：' + e.detail.errMsg, icon: 'none' });
	}

	function stop() {
		// 停止录制视频时的操作，如果有需要的话
	}
</script>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		background-color: black;
	}

	.camera {
		width: 100%;
		height: 60vh;
	}

	.look-camera {
		width: 80%;
		height: 60vh;

		.look-camera-image {
			width: 100%;
			height: 60vh;
		}
	}

	.preview-wrapper {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 100%;
		padding: 10px;
	}

	.preview-item {
		position: relative;
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
		background-color: rgb(51, 51, 51);
		border: 2px solid rgb(171, 171, 171);
	}

	.delete-icon {
		position: absolute;
		top: -5px;
		right: -5px;
		font-size: 20px;
		color: red;
	}

	.button-wrapper {
		display: flex;
		justify-content: space-around;
		width: 100%;
		padding: 10px;

		.flip-btn,
		.flash-btn {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: rgb(51, 51, 51);

			&:active {
				opacity: 0.7;
			}
		}

		.capture-btn {
			width: 120rpx;
			height: 120rpx;
			text-align: center;
			border-radius: 50%;
			border: 10rpx solid white;
			position: relative;


			&::after {
				content: '';
				display: block;
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
				background-color: white;
				position: absolute;
				left: 6rpx;
				top: 6rpx;
				z-index: 10;
			}

			&:active {
				opacity: 0.7;
			}
		}



	}

	.bottom-buttons {
		display: flex;
		justify-content: space-around;
		width: 100%;
		padding: 10px;
		font-size: 24rpx;

		.open-gallery-btn {
			border-radius: 20px;
			border: 2px solid white;
			background-color: black;
			color: white;
			display: flex;
			align-items: center;
		}

		.other-btn {
			background-color: white;
			border-radius: 20px;
			display: flex;
			align-items: center;
		}
	}
</style>