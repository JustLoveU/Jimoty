<template>
	<view class="container">

		<view class="navbar">
			<view class="navbar-nav" :class="navIndex== 0? 'active' : ''" @tap="changeNav(0)">
				我的发布
			</view>
			<view class="navbar-nav" :class="navIndex == 1? 'active': ''" @tap="changeNav(1)">
				草稿
			</view>
			<view class="navbar-nav" :class="navIndex == 2? 'active': ''" @tap="changeNav(2)">
				浏览历史
			</view>
		</view>


		<view v-if="navIndex==0" class="pageindex1">
			<view class="goods">
				<view class="good" v-for="(item,index) in pageData1" :key="index" @click="gotoDetail(item._id)">

					<view class="good-img-box">
						<image class="good-image" :src="item.photos && item.photos[0] ? item.photos[0] : defalutImage "
							mode="aspectFill">
						</image>
						<view class="goodd-shadow" v-if="item.category && item.category[0]">
							<view class="shadow-text">{{item.category[0].name}}
							</view>
						</view>
					</view>

					<view class="good-des">
						<view class="good-des-name ellipsis">
							【{{item.status == 5? '交易中': statusType[item.status]}}】{{item.noteTitle}}
						</view>
						<view class="good-time">
							<uni-dateformat :date="item.create_date" format="MM/dd hh:mm"></uni-dateformat>
						</view>

						<view class="good-liulan">
							收藏: {{item.collect}} &nbsp; 浏览数: {{item.browse}}
						</view>
					</view>

					<view class="good-operate">
						<view class="good-operate-btu" @tap.stop="edit(item._id)">
							编辑
						</view>
						<view class="good-operate-btu" @tap.stop="cancel(item._id,index)">
							删除
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="Pageloading"></uni-load-more>

		</view>



		<view v-else-if="navIndex==1" class="pageindex2">

			<view class="goods">
				<view class="good" v-for="(item,index) in pageData2" :key="index" @click="gotoDetail2(item._id)">

					<view class="good-img-box">
						<image class="good-image" :src="item.photos && item.photos[0] ? item.photos[0] : defalutImage "
							mode="aspectFill">
						</image>
						<view class="goodd-shadow" v-if="item.category && item.category[0]">
							<view class="shadow-text">{{item.category[0].name}}</view>
						</view>
					</view>

					<view class="good-des">
						<view class="good-des-name ellipsis">
							【{{statusType[item.status]}}】{{item.noteTitle}}
						</view>
					</view>

					<view class="cancle-btu" @tap.stop="cancleCaogao(item._id,index)">
						删除
					</view>
				</view>
			</view>
			<uni-load-more :status="Pageloading"></uni-load-more>

		</view>


		<view v-else-if="navIndex==2" class="pageindex2">

			<view class="goods">
				<view class="good" v-for="(item,index) in pageData3" :key="index" @click="gotoDetail(item._id)">

					<view class="good-img-box">
						<image class="good-image" :src="item.photos && item.photos[0] ? item.photos[0] : defalutImage "
							mode="aspectFill">
						</image>
						<view class="goodd-shadow" v-if="item.category && item.category[0]">
							<view class="shadow-text">{{item.category[0].name}}</view>
						</view>
					</view>

					<view class="good-des">
						<view class="good-des-name ellipsis">
							【{{statusType[item.status]}}】{{item.noteTitle}}
						</view>
						<view class="good-des-price" v-if="item.postPrice">
							￥{{item.postPrice}}
						</view>
					</view>

					<view class="cancle-btu" @tap.stop="cancleHistory(item._id)">
						删除
					</view>
				</view>
			</view>
			<uni-load-more :status="Pageloading"></uni-load-more>
		</view>


	</view>

</template>

<script setup>
	import { ref, onMounted, } from 'vue'
	import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

	const defalutImage = 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png'
	const navIndex = ref(0)

	let db = uniCloud.database()
	let dbcmd = db.command
	const uid = uniCloud.getCurrentUserInfo().uid
	const Pageloading = ref('loading')

	const pageData1 = ref([])
	const pageData2 = ref([])
	const pageData3 = ref([])

	const statusType = ref({
		1: '草稿',
		2: '发布中',
		4: '结束'
	})


	onLoad((e) => {
		navIndex.value = e.index
		loadData()
	})

	onPullDownRefresh(() => {
		pageData1.value = []
		pageData2.value = []
		pageData3.value = []
		loadData()
		uni.stopPullDownRefresh()
	})

	onReachBottom(() => {
		loadData()
	})

	async function changeNav(index) {
		navIndex.value = index
	}

	async function loadData() {

		Pageloading.value = 'loading'
		const temp1 = db.collection('jimoty-post').where({ userId: uid, status: dbcmd.in([2, 4, 5]), delete: 1 })
			.getTemp()
		const temp2 = db.collection('jimoty-category').field('_id,name,parent_id').getTemp()
		const res = await db.collection(temp1, temp2).skip(pageData1.value.length).limit(10).get()
		pageData1.value = [...pageData1.value, ...res.result.data]


		const temp3 = db.collection('jimoty-post').where({ userId: uid, status: 1, delete: 1 }).getTemp()
		const temp4 = db.collection('jimoty-category').field('_id,name,parent_id').getTemp()
		const res2 = await db.collection(temp3, temp4).skip(pageData2.value.length).limit(10).get()
		console.log(res2.result.data, 'llllllllllll');
		pageData2.value = [...pageData2.value, ...res2.result.data]

		//从缓存拿历史记录
		let broseArr = uni.getStorageSync('history-browse')
		if (broseArr) {
			const temp5 = db.collection('jimoty-post').where({
				status: 2,
				delete: 1,
				_id: dbcmd.in(
					broseArr)
			}).getTemp()
			const temp6 = db.collection('jimoty-category').field('_id,name,parent_id').getTemp()
			const res3 = await db.collection(temp5, temp6).get()
			pageData3.value = res3.result.data
		}

		Pageloading.value = 'noMore'

	}


	// 进入详情页
	function gotoDetail(postId) {
		uni.navigateTo({
			url: `/pages/home/detail?postId=${postId}`
		})
	}

	// 进入草稿页
	async function gotoDetail2(postId) {
		const res = await db.collection('jimoty-post').doc(postId).field('type').get({ getOne: true })
		console.log(res.result.data);
		switch (res.result.data.type) {
			case 1:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage1?postId=${postId}`
				})
				break;
			case 2:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage2?postId=${postId}`
				})
				break;
			case 3:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage3?postId=${postId}`
				})
				break;
			case 4:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage4?postId=${postId}`
				})
				break;
			case 5:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage5?postId=${postId}`
				})
				break;
		}

	}

	// 删除历史记录
	function cancleHistory(postId) {

		uni.showModal({
			content: '是否确认删除该历史',
			success: function(res) {
				if (res.confirm) {
					console.log(pageData3.value, 'aaaaaa');
					let findIndex = pageData3.value.findIndex(item => {
						item._id = postId
					})
					if (findIndex != -1) {
						pageData3.value.splice(findIndex, 1)
						let broseArr = uni.getStorageSync('history-browse')
						let index = broseArr.findIndex(item => item == postId)
						if (index != -1) {
							broseArr.splice(index, 1)
							uni.setStorageSync('history-browse', broseArr)
						} else {
							uni.showToast({
								title: '删除失败',
								icon: 'none'
							})
						}
					} else {
						uni.showToast({
							title: '该记录不存在',
							icon: 'none'
						})
					}
				}
			}

		});

	}

	// 删除草稿
	function cancleCaogao(postId, index) {
		uni.showModal({
			content: '是否确认删除草稿，删除则不可被找回',
			success: function(res) {
				if (res.confirm) {
					pageData2.value.splice(index, 1)
					db.collection('jimoty-post').doc(postId).remove()
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});

	}

	// 编辑投稿
	async function edit(postId) {
		const res = await db.collection('jimoty-post').doc(postId).field('type').get({ getOne: true })
		console.log(res.result.data);
		switch (res.result.data.type) {
			case 1:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage1?postId=${postId}`
				})
				break;
			case 2:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage2?postId=${postId}`
				})
				break;
			case 3:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage3?postId=${postId}`
				})
				break;
			case 4:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage4?postId=${postId}`
				})
				break;
			case 5:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage5?postId=${postId}`
				})
				break;
		}
	}


	// 删除投稿
	function cancel(postId, index) {
		uni.showModal({
			content: '是否确认删除投稿',
			success: function(res) {
				if (res.confirm) {
					pageData1.value.splice(index, 1)

					uniCloud.callFunction({
						name: 'jimoty-cancle-post',
						data: {
							postId: postId,
							bool: 'true'
						}
					}).then(res => {
						uni.showToast({
							title: res.result.msg,
							icon: 'none'
						})

					})
					// 删除相关的数据TODO
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
</script>

<style lang="scss">
	.navbar {
		width: 100%;
		height: 100rpx;
		background-color: white;
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

	.pageindex1 {
		.goods {
			display: flex;
			flex-direction: column;

			.good {
				display: flex;
				background-color: white;
				padding: 20rpx;
				border-bottom: 1px solid rgb(199, 199, 199);

				.good-operate {
					position: absolute;
					right: 20rpx;

					.good-operate-btu {
						width: 120rpx;
						height: 60rpx;
						text-align: center;
						line-height: 60rpx;
						border: 1px solid #bfbfbf;
						border-radius: 5px;
						margin: 20rpx 0;

						&:active {
							opacity: 0.7;
						}
					}
				}

				.good-img-box {
					position: relative;
					width: 170rpx;
					height: 170rpx;

					.good-image {
						width: 170rpx;
						height: 170rpx;
						border-radius: 8rpx;
					}

					.goodd-shadow {
						position: absolute;
						bottom: 0%;
						left: 0%;
						width: 100%;
						background-color: rgba(0, 0, 0, 0.3);
						height: 40rpx;

						.shadow-text {
							color: white;
							width: 100%;
							opacity: 1;
							z-index: 99;
							position: absolute;
							text-align: center;
							font-size: 22rpx;
							line-height: 40rpx;
						}
					}
				}


				.good-des {
					margin-left: 20rpx;
					padding: 0 10rpx;

					.good-des-name {
						font-weight: 600;
						line-height: 50rpx;
						font-size: 30rpx;
						max-width: 300rpx;
					}

					.good-liulan,
					.good-time {
						margin-top: 10rpx;
						color: rgb(139, 139, 139);
						font-size: 26rpx;
					}
				}

			}

		}
	}

	.pageindex2 {
		.goods {
			display: flex;
			flex-direction: column;

			.good {
				display: flex;
				background-color: white;
				padding: 20rpx;
				border-bottom: 1px solid rgb(199, 199, 199);
				position: relative;


				.good-img-box {
					position: relative;
					width: 170rpx;
					height: 170rpx;

					.good-image {
						width: 170rpx;
						height: 170rpx;
						border-radius: 8rpx;
					}

					.goodd-shadow {
						position: absolute;
						bottom: 0%;
						left: 0%;
						width: 100%;
						background-color: rgba(0, 0, 0, 0.3);
						height: 40rpx;

						.shadow-text {
							color: white;
							width: 100%;
							opacity: 1;
							z-index: 99;
							position: absolute;
							text-align: center;
							font-size: 22rpx;
							line-height: 40rpx;
						}
					}
				}

				.good-des {
					margin-left: 20rpx;
					padding: 0 10rpx;

					.good-des-name {
						font-weight: 600;
						line-height: 50rpx;
						font-size: 30rpx;
					}
				}

				.cancle-btu {
					position: absolute;
					right: 30rpx;
					bottom: 30rpx;
					width: 120rpx;
					height: 70rpx;
					border: 1px solid rgb(139, 139, 139);
					border-radius: 10rpx;
					line-height: 70rpx;
					text-align: center;

					&:active {
						opacity: 0.7;
					}
				}

			}

		}
	}
</style>