<template>
	<view class="container">

		<view class="navbar">
			<view class="navbar-nav" :class="navIndex== 0? 'active' : ''" @tap="changeNav(0)">
				发你的
			</view>
			<view class="navbar-nav" :class="navIndex == 1? 'active': ''" @tap="changeNav(1)">
				系统通知
			</view>
			<view class="navbar-nav" :class="navIndex == 2? 'active': ''" @tap="changeNav(2)">
				新通知
			</view>
		</view>



		<view>
			<view v-if="navIndex==0" class="noticePage1">

				<view class="all-notice" v-for="(item,index) in pagedata1" :key="index">

					<uni-swipe-action-item :right-options="options" @click="bindClick(item._id,index,1)">
						<view class="notice" v-if="item.type == 4" @tap="gotopage1(item,index)">
							<view class="notice-user">
								<view class="notice-dot" v-if="!item.status"></view>
								<image class="notice-user-img"
									:src="item.sendPeople.length > 0  ? item.sendPeople[0].avatar_file.url :defaultAvatar"
									mode="aspectFill">
								</image>
								<image class="notice-user-icon"
									src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/pen.png"
									mode="aspectFill">
								</image>
							</view>
							<view class="notice-des">
								<view class="notice-type ellipsis">
									{{item.sendPeople.length > 0  ? item.sendPeople[0].nickname :'有人'}}收藏了你的帖子
								</view>
								<view class="notice-time">
									<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
										format="MM月dd日"></uni-dateformat>
								</view>
							</view>
						</view>

						<view class="notice" v-else-if="item.type == 1" @tap="gotopage2(item,index)">
							<view class="notice-user">
								<view class="notice-dot" v-if="!item.status"></view>
								<image class="notice-user-img"
									:src="item.sendPeople.length > 0 ? item.sendPeople[0].avatar_file.url :defaultAvatar"
									mode="aspectFill">
								</image>
								<image class="notice-user-icon"
									src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/xin.png"
									mode="aspectFill">
								</image>
							</view>
							<view class="notice-des">
								<view class="notice-type ellipsis">
									{{item.sendPeople.length > 0   ? item.sendPeople[0].nickname :'有人'}}对你的帖子“{{item.otherMessage}}”发来了{{item.total?item.total + '条':''}}消息
								</view>
								<view class="notice-time">
									<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
										format="MM月dd日"></uni-dateformat>
								</view>
							</view>
						</view>

						<view class="notice" v-else-if="item.type == 3" @tap="gotopage3(item,index)">
							<view class="notice-user">
								<view class="notice-dot" v-if="!item.status"></view>
								<image class="notice-user-img"
									:src="item.sendPeople.length > 0 ? item.sendPeople[0].avatar_file.url :defaultAvatar"
									mode="aspectFill">
								</image>
								<image class="notice-user-icon"
									src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/xiao.png"
									mode="aspectFill">
								</image>
							</view>
							<view class="notice-des">
								<view class="notice-type ellipsis">
									{{item.sendPeople.length > 0 ? item.sendPeople[0].nickname :'有人'}}对你的帖子"{{item.otherMessage}}"给予了评价
								</view>
								<view class="notice-time">
									<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
										format="MM月dd日"></uni-dateformat>
								</view>
							</view>
						</view>

						<view class="notice" v-else-if="item.type == 2" @tap="gotopage4(item,index)">
							<view class="notice-user">
								<view class="notice-dot" v-if="!item.status"></view>
								<image class="notice-user-img"
									:src="item.sendPeople.length > 0  ? item.sendPeople[0].avatar_file.url :defaultAvatar"
									mode="aspectFill">
								</image>
								<image class="notice-user-icon"
									src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/plus.png"
									mode="aspectFill">
								</image>
							</view>
							<view class="notice-des">
								<view class="notice-type">
									{{item.sendPeople.length > 0  ? item.sendPeople[0].nickname :'有人'}}关注了你
								</view>
								<view class="notice-time">
									<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
										format="MM月dd日"></uni-dateformat>
								</view>
							</view>
						</view>

					</uni-swipe-action-item>

				</view>
				<uni-load-more :status="Pageloading"></uni-load-more>

			</view>

			<view v-else-if="navIndex==1" class="noticePage2">

				<view class="all-notice" v-for="(item,index) in pagedata2" :key="index">

					<uni-swipe-action-item :right-options="options" @click="bindClick(item._id,index,2)">
						<view class="notice" v-if="item.type == 0">
							<view class="notice-user">
								<view class="notice-dot"
									style="position: absolute;left: 0%;top: 0%;width: 15rpx;height: 15rpx;border-radius: 50%;background-color: red;z-index: 10;color: green;"
									v-if="!item.status"></view>
								<image class="notice-user-img" :src="xitong" mode="aspectFill"></image>

							</view>
							<view class="notice-des">
								<view class="notice-type">
									{{item.otherMessage}}
								</view>
								<view class="notice-type-msg">
									{{item.message}}
								</view>
								<view class="notice-time">
									<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
										format="MM月dd日"></uni-dateformat>
								</view>
							</view>
						</view>


						<view class="notice" v-if="item.type == 7" @tap="gotopage7(item,index)">
							<view class="notice-user">
								<view class="notice-dot"
									style="position: absolute;left: 0%;top: 0%;width: 15rpx;height: 15rpx;border-radius: 50%;background-color: red;z-index: 10;color: green;"
									v-if="!item.status"></view>
								<image class="notice-user-img" :src="xitong" mode="aspectFill"></image>

							</view>
							<view class="notice-des">
								<view class="notice-type">
									{{item.otherMessage}}
								</view>
								<view class="notice-time">
									<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
										format="MM月dd日"></uni-dateformat>
								</view>
							</view>
						</view>
					</uni-swipe-action-item>

				</view>
				<uni-load-more :status="Pageloading"></uni-load-more>
			</view>


			<view v-else-if="navIndex==2" class="noticePage3">

				<view class="all-notice" v-for="(item,index) in pagedata3" :key="index">

					<uni-swipe-action-item :right-options="options" @click="bindClick(item._id,index,3)">

						<view class="notice" v-if="item.type == 6" @tap="gotopage6(item,index)">
							<view class="notice-des ellipsis">
								检索条件"{{item.otherMessage[0].name}}"有{{item.total ? item.total : '1'}}件新到通知
							</view>

							<view class="good-from">

								<!-- <image class="good-img" src="../../static/submit/safa.png" mode="aspectFill"></image> -->
								<view class="good-time">
									<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
										format="MM月dd日"></uni-dateformat>
								</view>

								<view class="good-from-des">
									<view class="good-from-des-text ellipsis">
										{{item.otherMessage[0].name}}
									</view>

									<uni-icons type="right" size="18"></uni-icons>
								</view>

							</view>
						</view>

						<view class="notice" style="display: flex; align-items: center;" v-else
							@tap="gotopage5(item,index)">

							<view class="notice-user">
								<view class="notice-dot" v-if="!item.status"
									style="position: absolute;left: 0%;top: 0%;width: 15rpx;height: 15rpx;border-radius: 50%;background-color: red;z-index: 10;color: green;">
								</view>
								<image class="notice-user-img"
									:src="item.sendPeople && item.sendPeople[0] && item.sendPeople[0].avatar_file ? item.sendPeople[0].avatar_file.url :defaultAvatar"
									mode="aspectFill">
								</image>
							</view>
							<view class="notice-des">
								<view class="notice-type ellipsis">
									{{item.sendPeople && item.sendPeople[0] ? item.sendPeople[0].nickname :'有人'}}上架了新的商品
								</view>
								<view class="notice-time">
									<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
										format="MM月dd日"></uni-dateformat>
								</view>
							</view>

						</view>

					</uni-swipe-action-item>
				</view>
				<uni-load-more :status="Pageloading"></uni-load-more>
			</view>

		</view>



	</view>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
	const defaultAvatar = 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png'
	const xitong = 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/系统.png'
	const db = uniCloud.database()
	const dbcmd = db.command
	const userId = uniCloud.getCurrentUserInfo().uid
	const Pageloading = ref('loading')


	const pagedata1 = ref([])
	const pagedata2 = ref([])
	const pagedata3 = ref([])


	const pageArr1 = ref([])
	const pageArr2 = ref([])
	const pageArr3 = ref([])

	const commentType = {
		0: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/xiao.png',
		1: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/ku.png',
		2: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/ku.png'
	}

	const commentTextType = {
		0: '好评',
		1: '一般的评价',
		2: '差评'
	}

	const options = ref([{
		text: '删除',
		style: {
			backgroundColor: '#F56C6C'
		}
	}])


	function bindClick(noticeId, index, type) {
		uni.showModal({
			content: '是否删除',
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定');

					if (type == 1) {
						pagedata1.value.splice(index, 1)
					} else if (type == 2) {
						pagedata2.value.splice(index, 1)
					} else {
						pagedata3.value.splice(index, 1)
					}
					db.collection('jimoty-notice').doc(noticeId).remove()

				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		})
	}


	const navIndex = ref(0)

	onMounted(() => {
		// let arr = pageArr1.value.map(item => {
		// 	return item._id
		// })
		// db.collection('jimoty-notice').where({ _id: dbcmd.in(arr) }).update({ status: true })




	})

	function changeNav(index) {
		navIndex.value = index
		if (navIndex.value == 1) {
			// 将系统消息已阅
			pagedata2.value.forEach(item => {
				db.collection('jimoty-notice').doc(item._id).update({ status: true })
				item.status = true
			})

		}
	}

	onPullDownRefresh(async () => {
		pagedata1.value = []
		pagedata2.value = []
		pagedata3.value = []
		await getData()
		uni.stopPullDownRefresh()
	})

	onReachBottom(() => {
		getData()
	})

	onLoad(async () => {
		await getData()
	})

	// function handData(data) {
	// 	data.forEach(async (item) => {
	// 		if ([1, 3].includes(item.type)) {
	// 			const res = await db.collection('jimoty-post').where({ _id: item.message }).field(
	// 					'_id,noteTitle')
	// 				.get({ getOne: true })
	// 			console.log('###', res);
	// 			item.otherMessage = res.result.data.noteTitle
	// 		}
	// 	})
	// 	return data
	// }


	// 获取消息  
	async function getData(index) {
		Pageloading.value = 'loading'
		const temp2 = db.collection('uni-id-users').field('_id,nickname,avatar_file.url').getTemp()

		// 页面1的数据
		const temp1 = db.collection('jimoty-notice').where({ receive: userId, type: dbcmd.in([1, 2, 3, 4]) }).getTemp()
		const res1 = await db.collection(temp1, temp2).orderBy('create_date desc').skip(pagedata1.value.length)
			.limit(
				10).get()
		pageArr1.value = [...res1.result.data]
		// res1.result.data = mergeData1(res1.result.data)

		pagedata1.value = [...pagedata1.value, ...res1.result.data]

		console.log(pagedata1.value, '@@@@@');

		// 页面2的数据
		const temp3 = db.collection('jimoty-notice').where({ receive: userId, type: dbcmd.in([0, 7]) }).getTemp()
		const res2 = await db.collection(temp3, temp2).orderBy('create_date desc')
			.skip(pagedata2.value.length).limit(
				10).get()

		pagedata2.value = [...pagedata2.value, ...res2.result.data]
		console.log(pagedata2.value, '@@@@@');

		// 页面3的数据
		const temp4 = db.collection('jimoty-notice').where({ receive: userId, type: dbcmd.in([5, 6]) }).getTemp()
		const temp5 = db.collection('jimoty-category').getTemp()
		const res3 = await db.collection(temp4, temp2, temp5).orderBy('create_date desc')
			.skip(pagedata3.value.length).limit(
				10).get()

		// pageArr3.value = [...res3.result.data]
		// res3.result.data = mergeData(res3.result.data)
		pagedata3.value = [...pagedata3.value, ...res3.result.data]

		console.log(pagedata3.value, '@@@@@');
		Pageloading.value = 'noMore'
	}


	// 处理上新数据，将一样的归为一类
	function mergeData(data) {
		const result = [];
		const map = new Map();

		data.forEach(item => {
			if (item.type === 6 && item.status === false) {
				const key = item.message;
				if (map.has(key)) {
					map.get(key).total += 1;
				} else {
					map.set(key, { ...item, total: 1 });
				}
			} else {
				result.push(item);
			}
		});

		map.forEach(value => {
			result.push(value);
		});

		return result;
	}



	function gotopage1(data, index) {

		pagedata1.value[index].status = true

		db.collection('jimoty-notice').doc(data._id).update({ status: true })
		uni.navigateTo({
			url: `/pages/home/detail?postId=${data.message}`
		})
	}

	function gotopage2(data, index) {

		pagedata1.value[index].status = true

		db.collection('jimoty-notice').doc(data._id).update({ status: true })

		uni.navigateTo({
			url: `/pages/message/chatPage?chatId=${data.message}`
		})
	}

	function gotopage3(data, index) {

		pagedata1.value[index].status = true

		db.collection('jimoty-notice').doc(data._id).update({ status: true })
		uni.navigateTo({
			url: '/pages/my/comment'
		})
	}

	function gotopage4(data, index) {

		pagedata1.value[index].status = true

		db.collection('jimoty-notice').doc(data._id).update({ status: true })
		uni.navigateTo({
			url: `/pages/my/follow?myFollowId=${data.sendPeople[0]._id}`
		})
	}

	function gotopage5(data, index) {
		pagedata3.value[index].status = true
		db.collection('jimoty-notice').doc(data._id).update({ status: true })
		uni.navigateTo({
			url: `/pages/home/detail?postId=${data.message}`
		})
	}

	function gotopage6(data, index) {
		db.collection('jimoty-notice').doc(data._id).update({ status: true })
		uni.navigateTo({
			url: `/pages/my/myDetail?userId=${data.sendPeople[0]._id}`
		})
	}

	function gotopage7(data, index) {
		db.collection('jimoty-notice').doc(data._id).update({ status: true })
		uni.navigateTo({
			url: `/pages/home/reback_notice?postId=${data.message}`
		})
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



	.noticePage1 {
		.all-notice {
			padding: 20rpx;
			background-color: white;

		}

		.notice {
			border-bottom: 1px solid rgb(204, 204, 204);
			display: flex;
			padding: 20rpx;
		}

		.notice-user {
			width: 120rpx;
			height: 120rpx;
			position: relative;

			.notice-dot {
				position: absolute;
				left: 0%;
				top: 0%;
				width: 15rpx;
				height: 15rpx;
				border-radius: 50%;
				background-color: red;
				z-index: 10;
				color: green;
			}

			.notice-user-img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}

			.notice-user-icon {
				position: absolute;
				right: 5rpx;
				top: 5rpx;
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				background-color: white;
				z-index: 10rpx;
			}
		}

		.notice-des {
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.notice-type {
				font-weight: 600;
			}

			.notice-type-msg {}

			.notice-time {
				font-size: 24rpx;
				color: rgb(193, 193, 193);
			}
		}
	}

	.noticePage2 {
		.all-notice {
			padding: 20rpx;
			background-color: white;

		}

		.notice {
			border-bottom: 1px solid rgb(204, 204, 204);
			display: flex;
			padding: 20rpx;

			&:active {
				opacity: 0.7;
			}
		}

		.notice-user {
			width: 120rpx;
			height: 120rpx;
			position: relative;

			.notice-user-img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}

		}

		.notice-des {
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.notice-type {
				font-weight: 600;
			}

			.notice-time {
				font-size: 24rpx;
				color: rgb(193, 193, 193);
			}
		}
	}

	.noticePage3 {
		.all-notice {
			padding: 20rpx;
			background-color: white;

		}

		.notice {
			border-bottom: 1px solid rgb(204, 204, 204);
			padding: 20rpx;
		}


		.notice-user {
			width: 120rpx;
			height: 120rpx;
			position: relative;

			.notice-user-img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}

			.notice-user-icon {
				position: absolute;
				right: 5rpx;
				top: 5rpx;
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				background-color: white;
				z-index: 10rpx;
			}
		}

		.notice-des {
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.notice-type {
				font-weight: 600;
			}

			.notice-time {
				font-size: 24rpx;
				color: rgb(193, 193, 193);
			}
		}

		.notice-des {
			font-size: 32rpx;
			line-height: 50rpx;
			font-weight: 600;
		}

		.good-from {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10rpx 0;

			.good-img {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
			}

			.good-from-des {
				display: flex;
				align-items: center;

				.good-from-des-text {
					margin-right: 20rpx;
				}
			}
		}

		.good-time {
			margin-top: 20rpx;
			font-size: 24rpx;
			color: rgb(143, 144, 147);
		}
	}
</style>