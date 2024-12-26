<template>
	<view class="container">
		<view class="cameras">
			<view class="camera" v-for="(item,index) in 5" :key="index">
				<uni-icons type="camera-filled" color="rgb(33,159,98)"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script setup>

</script>

<style lang="scss">
	.cameras {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.camera {
			width: 150rpx;
			height: 150rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2px solid rgb(33, 159, 98);
		}
	}
</style>