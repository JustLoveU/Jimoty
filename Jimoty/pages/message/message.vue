<script setup>
	import { ref } from 'vue';
	import page1 from '@/pages/message/components/page1.vue'
	import page2 from '@/pages/message/components/page2.vue'
	import page3 from '@/pages/message/components/page3.vue'

	const navIndex = ref(0)

	function changeNav(index) {
		navIndex.value = index
	}
</script>


<template>
	<view class="container">

		<view class="navbar">
			<view class="navbar-nav" :class="navIndex== 0? 'active' : ''" @tap="changeNav(0)">
				我的帖子
			</view>
			<view class="navbar-nav" :class="navIndex == 1? 'active': ''" @tap="changeNav(1)">
				咨询
			</view>
			<view class="navbar-nav" :class="navIndex == 2? 'active': ''" @tap="changeNav(2)">
				评价
			</view>
		</view>

		<view style="margin-top: 100rpx;">
			<page1 v-if="navIndex==0"></page1>
			<page2 v-else-if="navIndex==1"></page2>
			<page3 v-else-if="navIndex==2"></page3>
		</view>


	</view>
</template>


<style lang="scss">
	// .container {
	// 	padding-top: 50rpx;
	// }

	.navbar {
		width: 100%;
		height: 100rpx;
		background-color: white;
		position: fixed;
		top: 0%;
		z-index: 10;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid rgb(234, 234, 234);
		border-bottom: 1px solid rgb(234, 234, 234);
		box-shadow: 3rpx 3rpx 5rpx rgba(0, 0, 0, 0.3);

		.navbar-nav {
			width: 33%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			font-size: 32rpx;
			// font-weight: 600;
			color: rgb(85, 85, 85);
		}

		.active {
			border-bottom: 3px solid rgb(36, 157, 98);
			color: rgb(36, 157, 98);
		}
	}
</style>