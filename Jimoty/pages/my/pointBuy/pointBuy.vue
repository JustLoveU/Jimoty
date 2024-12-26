<template>
	<view class="container">

		<view class="goods" v-for="(item,index) in goodType" :key="index" @tap="buythis(index)"
			:class="navIndex == index ? 'active':''">
			<view class="goods-box">
				<view class="goods-img">
					<image class="good-img-img" :src="item.good_image" mode="aspectFill"></image>
				</view>
				<view class="goods-text">
					<view class="goods-text-des">
						{{item.good_name}}
					</view>
					<view class="goods-text-sub">
						({{item.good_price}}Pt/个)
					</view>
				</view>
			</view>
			<view class="goods-right">
				<view class="goods-right-price">
					{{item.good_price}}Pt
				</view>
				<uni-icons type="right" size="20"></uni-icons>
			</view>
		</view>

		<view class="buy-bottom">
			<view class="buy-bottom-content">
				<view class="buy-num">
					<uni-number-box v-model="vModelValue" :min="1" :max="9" />
				</view>
				<view class="nuy-good" v-if="goodType.length > 0">
					购买( {{ goodType[navIndex].good_name }} ) &nbsp; {{vModelValue}}个
				</view>
				<view class="buy-btu" @tap="buygood">
					购买
				</view>
			</view>

		</view>
	</view>
</template>

<script setup>
	import { ref, toRaw } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	const db = uniCloud.database()
	const dbcmd = db.command
	const uid = uniCloud.getCurrentUserInfo().uid
	const navIndex = ref(0)


	const vModelValue = ref(1)
	const goodType = ref([])

	onLoad(async () => {
		// 获取商品价格
		const res = await db.collection('jimoty-good').get()
		goodType.value = res.result.data
		console.log(goodType.value, '商品详情');
	})


	function buythis(index) {
		navIndex.value = index
	}

	// 随机生成一个7位数给订单号
	const generateRandomSevenDigitNumber = () => {
		let randomNumber = Math.floor(Math.random() * 10000000);
		if (randomNumber < 1000000) {
			randomNumber = '0' + randomNumber;
		}
		return randomNumber;
	}

	function buygood() {

		uni.showModal({
			content: `是否确认购买(${goodType.value[navIndex.value].good_name})(${vModelValue.value})个`,
			success: async function(res) {
				if (res.confirm) {

					uni.showLoading({
						mask: true
					})
					uniCloud.callFunction({
						name: 'jimoty-buy',
						data: {
							vModelValue: vModelValue.value,
							good_type: goodType.value[navIndex.value].good_type,
							userId: uid
						}
					}).then(res => {
						uni.hideLoading()
						console.log('购买成功');
						uni.showToast({
							title: res.result.msg,
							icon: 'none'
						})

					})
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
</script>

<style lang="scss">
	.buy-bottom {
		position: fixed;
		background-color: white;
		width: 100%;
		bottom: 0;
		padding-bottom: 50rpx;

		.buy-bottom-content {
			padding: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.buy-btu {
				width: 120rpx;
				height: 70rpx;
				text-align: center;
				line-height: 70rpx;
				border-radius: 20px;
				color: white;
				background-color: rgb(29, 146, 78);
			}
		}


	}

	.goods {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: white;
		padding: 20rpx;
		border-bottom: 1px solid #b0b0b0;

		.goods-box {
			display: flex;
			align-items: center;


			.goods-img {
				border: 1px solid #b0b0b0;
				width: 100rpx;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.good-img-img {
					width: 80rpx;
					height: 80rpx;
				}
			}

			.goods-text {
				margin-left: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

			}
		}

		.goods-right {
			display: flex;
			align-items: center;

			.goods-right-price {
				font-weight: 600;
				margin-right: 10rpx;
			}
		}
	}

	.active {
		background-color: rgb(40, 207, 110, 0.3);
	}
</style>