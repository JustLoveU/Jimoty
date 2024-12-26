<script setup>
	import { ref } from 'vue';

	// 确认下单
	const payment = () => {
		uni.showModal({
			title: '是否确认下单',
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定');
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}


	// 进去地址管理
	const gotodetail = () => {
		uni.navigateTo({
			url: '/pages/message/address'
		})
	}
</script>

<template>
	<view class="container">
		<view class="good-box">
			<view class="good-img">
				<image src="../../static/logo.png" mode="aspectFill"></image>
			</view>
			<view class="good-des">
				<view class="good-des-text ellipsis">
					阿萨德hi你粗啊不是擦凯撒较大很尬科技手打啊实打实
				</view>
				<view class="good-des-price">
					￥1280
				</view>
			</view>
		</view>

		<view class="address-box">
			<view class="address" @tap="gotodetail">
				<view class="address-left">
					收货地址
				</view>
				<view class="address-right">
					<view class="address-des">
						<view class="address-des-name-phone">
							张三 <text style="margin-left: 10rpx;">1234567811</text>
						</view>
						<view class="address-des-text ellipsis">
							湖南省长沙市雨花区德思勤6栋888888菜鸟驿站
						</view>
					</view>
					<uni-icons type="right" size="24"></uni-icons>
				</view>
			</view>

			<view class="address">
				<view class="address-left">
					运费
				</view>
				<view class="address-price">
					￥0
				</view>
			</view>

		</view>

		<view class="bottom">
			<view class="bottom-price">
				<text>实付款</text><text style="font-size: 20rpx; color: red;">￥</text><text
					style="color: red;">1280.00</text>
			</view>
			<view class="bottom-btu" @tap="payment">
				确认下单
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.good-box {
		margin: 20rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		background-color: white;
		display: flex;
		align-items: center;
		position: relative;

		.good-img {
			width: 200rpx;
			height: 150rpx;
			border-radius: 15rpx;
		}

		.good-des {
			width: 100%;
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.good-des-text {
				line-height: 50rpx;
				font-size: 26rpx;
			}

			.good-des-price {
				color: red;
				font-size: 26rpx;
				position: absolute;
				right: 20rpx;
				bottom: 20rpx;
			}
		}
	}

	.address-box {
		margin: 20rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		background-color: white;
		display: flex;
		flex-direction: column;

		.address {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.address-left {
				font-size: 26rpx;
			}

			.address-price {
				color: red;
				font-size: 26rpx;
			}

			.address-right {
				display: flex;
				align-items: center;
				color: #a1a1a1;
				font-size: 24rpx;

				.address-des {
					display: flex;
					flex-direction: column;
					margin-right: 15rpx;
					width: 300rpx;

					.address-des-text {
						// display: flex;
						// justify-content: flex-end;
					}
				}
			}
		}

		.address:nth-child(1) {
			border-bottom: 1px solid #f5f5f5;
		}

		.address:nth-child(2) {
			padding: 20rpx 0;
		}
	}

	.bottom {
		position: fixed;
		width: 100%;
		bottom: 0%;
		background-color: white;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-top: 20rpx;
		// padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: 40rpx;
		padding-right: 20rpx;

		.bottom-btu {
			width: 200rpx;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 20px;
			color: white;
			font-size: 32rpx;
			font-weight: 600;
			background: linear-gradient(to bottom, #ff7301, #ff4406);
			text-align: center;
			margin-left: 20rpx;
		}
	}
</style>