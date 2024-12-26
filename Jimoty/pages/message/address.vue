<script setup>
	import { onMounted, ref, nextTick } from 'vue';

	// 管理
	const ifcontral = ref(false)
	const controlAddress = () => {
		ifcontral.value = !ifcontral.value

	}

	onMounted(() => {

	})
	const citySelect = ref(null)
	// 打开城市选择页面
	const open = () => {

		uni.navigateTo({
			url: '/pages/message/addAddress'
		})
		// nextTick(() => {
		// 	citySelect.value.open();
		// })

	}
</script>

<template>
	<view class="container">
		<view class="Myaddress">

			<view class="address" v-for="(item,index) in 3" :key="index">
				<view class="address-main">
					<view class="address-top">
						<view class="address-top-name">
							小新
						</view>
					</view>
					<view class="address-center">
						<view class="address-center-np">
							<view class="address-center-name">
								<text style="font-weight: 600;font-size: 26rpx;">小新</text><text>1827311111</text>
							</view>
							<view class="address-center-tip">
								默认
							</view>
						</view>
						<view class="address-center-des">
							湖南省长沙市雨花区
						</view>
					</view>
					<view class="address-left">
						<image src="../../static/tabbar/submit.png" mode="aspectFill"></image>
					</view>
				</view>

				<view class="address-other" v-if="ifcontral">
					<view class="address-other-left">
						<view class="address-other-left-dot"></view>
						<view class="address-other-left-text">
							默认收货地址
						</view>
					</view>
					<view class="address-other-right">
						<uni-icons type="trash" size="14"></uni-icons>删除
					</view>
				</view>

			</view>

			<!-- 	<unicloud-city-select ref="citySelect" :hot-city="hotCity" :location="true"
				@select="select"></unicloud-city-select> -->

		</view>

		<view class="page-bottom">
			<view class="con-address" @tap="controlAddress">
				{{ifcontral ? '退出管理' :'管理'}}
			</view>
			<view class="add-address" @tap="open">
				+ 添加收获地址
			</view>
		</view>
	</view>
</template>



<style lang="scss">
	.Myaddress {
		padding: 20rpx;
	}

	.address {
		padding: 20rpx;
		background-color: white;
		margin-bottom: 20rpx;
		border-radius: 10px;

		.address-other {
			border-top: 1px solid #e1e1e1;
			height: 50rpx;
			display: flex;
			align-items: center;
			padding-top: 10rpx;
			justify-content: space-between;
			font-size: 22rpx;
			color: $uni-text-color-grey;

			.address-other-left {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.address-other-left-dot {
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					border: 1rpx solid #e1e1e1;
				}

				.address-other-left-text {
					margin-left: 20rpx;
				}
			}

		}

		.address-main {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 20rpx;

		}

		.address-top-name {
			width: 60rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			border-radius: 50%;
			font-weight: 600;
			font-size: 24rpx;
			color: $uni-color-primary;
			background-color: $uni-color-second;
		}

		.address-center {
			flex: 1;
			margin-left: 20rpx;

			.address-center-np {
				display: flex;
				align-items: center;

				.address-center-name {
					font-size: 24rpx;
				}

				.address-center-tip {
					border-radius: 10rpx;
					border: 1px solid $uni-color-second ;
					color: $uni-color-second;
					margin-left: 15rpx;
					padding: 3rpx;
					font-size: 18rpx;
				}
			}

			.address-center-des {
				color: $uni-text-color-grey;
				height: 40rpx;
				font-size: 22rpx;
			}


		}

		.address-left {
			width: 35rpx;
			height: 35rpx;
		}

	}


	.page-bottom {
		display: flex;
		align-items: center;
		width: 100%;
		font-weight: 600;
		position: fixed;
		background-color: white;
		padding: 20rpx;
		bottom: 30rpx;
		font-size: 28rpx;

		.con-address {
			width: 200rpx;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			border-radius: 20px;
			background-color: $uni-text-color-disable;
		}

		.add-address {
			flex: 1;
			margin-left: 20rpx;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			border-radius: 20px;
			background-color: $uni-color-success;
		}
	}
</style>