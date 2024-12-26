<template>
	<view class="container">

		<view class="member-title">
			持有特权
		</view>

		<view class="oprate">

			<view class="oprate-item" @tap="changethis(0)" :class="navIndex == 0 ? 'active':''">
				<view class="oprate-left">

					<view class="oprate-left-image">
						<image class="oprate-left-image-img"
							src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/top.png"
							mode="aspectFill"></image>
					</view>
					<view class="oprate-left-title">
						置顶
					</view>

				</view>
				<view class="oprate-right">
					x &nbsp; {{ pageData1.daojuNum &&  pageData1.daojuNum != 0 ?pageData1.daojuNum :'0' }}
				</view>
			</view>

			<view class="oprate-item" @tap="changethis(1)" :class="navIndex == 1 ? 'active':''">
				<view class="oprate-left">

					<view class="oprate-left-image">
						<image class="oprate-left-image-img"
							src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/light.png"
							mode="aspectFill"></image>
					</view>
					<view class="oprate-left-title">
						高亮
					</view>

				</view>
				<view class="oprate-right">
					x &nbsp; {{ pageData2.daojuNum &&  pageData2.daojuNum != 0 ?pageData2.daojuNum :'0' }}
				</view>
			</view>


			<view class="oprate-item" @tap="changethis(2)" :class="navIndex == 2 ? 'active':''">
				<view class="oprate-left">

					<view class="oprate-left-image">
						<image class="oprate-left-image-img"
							src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/refrash.png"
							mode="aspectFill">
						</image>
					</view>
					<view class="oprate-left-title">
						刷新
					</view>

				</view>
				<view class="oprate-right">
					x &nbsp; {{ pageData3.daojuNum &&  pageData3.daojuNum != 0 ?pageData3.daojuNum :'0' }}
				</view>
			</view>


			<view class="oprate-item" @tap="changethis(3)" :class="navIndex == 3 ? 'active':''">
				<view class="oprate-left">

					<view class="oprate-left-image">
						<image class="oprate-left-image-img"
							src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/refrash.png"
							mode="aspectFill">
						</image>
					</view>
					<view class="oprate-left-title">
						定期刷新
					</view>

				</view>
				<view class="oprate-right">
					x &nbsp; {{ pageData4.daojuNum &&  pageData4.daojuNum != 0 ?pageData4.daojuNum :'0' }}
				</view>
			</view>

		</view>


		<view class="member-bottom">
			<view class="member-bottom-tip" v-if="isApple">
				「※iOS用户无法购买，有疑问请联系客服。」
			</view>

			<view class="member-bottom-btu btu1" @tap="gotoBuy" v-if="!isApple">
				购买选项
			</view>
			<button class="member-bottom-btu btu1" open-type="contact" v-else>
				购买选项
			</button>
			<view class="member-bottom-btu btu2" @tap="useMember">
				使用选项
			</view>
		</view>


	</view>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
	const db = uniCloud.database()
	const uid = uniCloud.getCurrentUserInfo().uid
	const navIndex = ref(-1)
	const goodName = ref('')

	const pageData1 = ref({})
	const pageData2 = ref({})
	const pageData3 = ref({})
	const pageData4 = ref({})


	const isApple = ref(false)
	onLoad(() => {
		let brand = uni.getDeviceInfo().deviceBrand
		console.log('########获取设备', brand);
		if (brand == 'iphone') {
			isApple.value = true
		}

	})

	onPullDownRefresh(() => {
		getdData()
		uni.stopPullDownRefresh()
	})

	onShow(() => {
		getdData()
	})

	function changethis(index) {
		navIndex.value = index
		if (index == 0) {
			goodName.value = '置顶'
		} else if (index == 1) {
			goodName.value = '高亮'
		} else if (index == 2) {
			goodName.value = '刷新'
		} else {
			goodName.value = '定期刷新'
		}
	}

	async function getdData() {
		const res = await db.collection('jimoty-daoju').where({ daoUserId: uid }).get()
		groupByType(res.result.data)
	}

	function groupByType(arr) {
		arr.forEach(item => {
			if (item.daojuType === 0) {
				pageData1.value = item
			} else if (item.daojuType === 1) {
				pageData2.value = item
			} else if (item.daojuType === 2) {
				pageData3.value = item
			} else if (item.daojuType === 3) {
				pageData4.value = item
			}
		})
	}

	function gotoBuy() {
		uni.navigateTo({
			url: '/pages/my/pointBuy/pointBuy'
		})
	}

	function useMember() {

		if (goodName.value != '') {
			uni.showModal({
				content: `是否前往使用(${goodName.value})`,
				success: async function(res) {
					if (res.confirm) {
						// 判断是否有数量
						const data = await db.collection('jimoty-daoju').where({
							daoUserId: uid,
							daojuType: navIndex.value
						}).field('daojuNum').get({ getOne: true })
						if (data.result.data && data.result.data.daojuNum > 0) {

							uni.navigateTo({
								url: `/pages/my/pointBuy/pointBuyDetail?daojuType=${navIndex.value}`
							})

						} else {
							uni.showToast({
								title: '已经没有道具了，请您购买！',
								icon: 'none'
							})
						}
						getdData()
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		} else {
			uni.showToast({
				title: '请选择使用的道具',
				icon: 'none'
			})
		}
	}
</script>

<style lang="scss">
	.member-title {
		padding: 20rpx;
		font-size: 28rpx;
		color: #515151;
	}

	.oprate {
		padding: 20rpx;
		background-color: white;

		.oprate-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 15rpx 0;

			.oprate-left {
				display: flex;
				align-items: center;

				.oprate-left-image {
					width: 90rpx;
					height: 90rpx;
					border: 1px solid #c5c5c5;
					box-shadow: 0 0 0;
					display: flex;
					align-items: center;
					justify-content: center;

					.oprate-left-image-img {
						width: 60rpx;
						height: 60rpx;
					}
				}

				.oprate-left-title {
					margin-left: 15rpx;
					font-size: 36rpx;
					color: #515151;
				}
			}
		}

		.active {
			background-color: rgb(40, 207, 110, 0.3);
		}
	}

	.member-bottom {
		padding: 40rpx;
		background-color: white;

		.member-bottom-tip {
			margin: 10rpx;
			width: 100%;
			text-align: center;
		}

		.member-bottom-btu {
			text-align: center;
			line-height: 90rpx;
			width: 100%;
			height: 90rpx;
			border-radius: 10rpx;
			font-size: 38rpx;
			margin-bottom: 40rpx;

		}

		.btu1 {
			background-color: rgb(29, 146, 78);
			color: white;
		}

		.btu2 {
			border: 1px solid rgb(29, 146, 78);
			color: rgb(29, 146, 78);
		}
	}
</style>