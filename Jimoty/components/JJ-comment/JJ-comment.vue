<template>
	<view class="container">
		<view class="comment" v-for="(item,index) in 3" :key="index">
			<view class="comment-top">
				<view class="comment-top-left">
					<image class="com-img" src="../../static/logo.png" mode="aspectFill"></image>
					<text class="com-name">张三</text>
				</view>
				<view class="comment-top-right">
					好评
				</view>
			</view>
			<view class="comment-center">
				非常不错 aaaaaaaaaaaaaaaa踩踩踩踩踩踩踩踩踩踩踩踩踩踩踩踩踩踩从
			</view>
			<view class="comment-bottom">
				2024-05-06 17:05:08
			</view>
		</view>
	</view>
</template>

<script setup>


</script>

<style lang="scss">
	.comment {
		margin: 20rpx;
		padding: 20rpx;
		background-color: white;
		border-radius: 10rpx;

		.comment-top {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.comment-top-left {
				.com-img {
					width: 45rpx;
					height: 45rpx;
					border-radius: 50%;
				}

				.com-name {
					color: #848484;
					margin-left: 20rpx;
					font-size: 26rpx;
				}
			}

			.comment-top-right {
				font-size: 22rpx;
				background-color: $uni-color-second;
				padding: 2rpx;
				border-radius: 10rpx;
			}

		}

		.comment-center {
			padding: 15rpx 0;
			font-size: 24rpx;
		}

		.comment-bottom {
			color: #848484;
			font-size: 22rpx;
		}
	}
</style>