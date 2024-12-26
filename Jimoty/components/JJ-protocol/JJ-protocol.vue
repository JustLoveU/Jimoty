<script setup>
	import { ref, defineExpose } from 'vue';

	const ifConfirm = ref(true)

	const url =
		"https://static-mp-67be408c-9398-4e3f-bf46-1df6dcf05919.next.bspapp.com/markdown-share-docs/0033811186596cdc9fdd18b980396c92/"

	function comfirm() {
		ifConfirm.value = !ifConfirm.value
	}

	function gotoUser() {
		// uni.navigateTo({
		// 	url: `/pages/submit/common/webview/webview?url=${url}&title=投稿协议`
		// })

		// 直接进入页面
		uni.navigateTo({
			url: '/doc/userProtocol/userProtocol'
		})
	}

	// 暴露出去
	defineExpose({
		ifConfirm
	})
</script>

<template>
	<view class="container">
		<view class="item-right" @tap="comfirm" :class="ifConfirm ? 'active' :''"></view>
		<view class="item-left" @tap="gotoUser">
			《投稿协议》
		</view>
	</view>
</template>



<style lang="scss" scoped>
	.container {
		padding: 20rpx;
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: flex-end;
	}

	.item-right {
		width: 25rpx;
		height: 25rpx;
		border-radius: 100%;
		background-color: white;
		border: 1px solid #a5a5a5;
	}

	.active {
		background-color: #219f62;
	}

	.item-left {
		color: #219f62;
	}
</style>