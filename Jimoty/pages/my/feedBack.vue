<template>
	<view>
		<uni-title type="h2" title="关注下方公众号,即时获得消息通知" align="center"></uni-title>

		<view class="image-box" @tap="open">
			<image class="img" :src="image" mode="aspectFill"></image>
		</view>

		<view class="my-btu-bottom">
			<button style="my-btu" open-type="contact" type="primary">联系客服</button>
		</view>


	</view>
</template>

<script setup>
	import { ref } from 'vue';

	const image = ref(
		'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/gongzhonghaoerweima.png')

	function open() {
		console.log('打开');
		uni.previewImage({
			urls: [image.value],
			longPressActions: {
				itemList: ['发送给朋友', '保存图片', '收藏'],
				success: function(data) {

				},
				fail: function(err) {
					console.log(err.errMsg);
				}
			}
		});
	}
</script>

<style lang="scss">
	.image-box {
		display: flex;
		justify-content: center;
		width: 100%;
		height: 800rpx;

		.img {
			width: 600rpx;
			height: 600rpx;
		}
	}

	.my-btu-bottom {
		padding: 30rpx;

		.my-btu {
			width: 100rpx;
			height: 100rpx;
			border-radius: 100%;
		}
	}
</style>