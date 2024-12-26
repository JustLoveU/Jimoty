<template>
	<view class="container">

		<view class="navbar">
			<view class="navbar-nav" :class="navIndex== 3? 'active' : ''" @tap="changeNav(3)">
				<view class="navbar-nav-item">
					<view class="navbar-nav-top" style="margin-top: 10rpx;">
						全部
					</view>
					<view class="navbar-nav-num">
						{{ 99 > pagedata3.length > 0 ? pagedata3.length : 0 }}
					</view>
				</view>

			</view>
			<view class="navbar-nav" :class="navIndex == 0? 'active': ''" @tap="changeNav(0)">
				<view class="navbar-nav-item">
					<view class="navbar-nav-top">
						<image style="width: 50rpx;height: 50rpx;border-radius: 50%;"
							src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/commentxiao.png"
							mode="aspectFill"></image>
						<text style="margin-left: 10rpx;">好评</text>
					</view>
					<view class="navbar-nav-num">
						{{ 99 > pagedata0.length > 0 ? pagedata0.length : 0 }}
					</view>
				</view>

			</view>
			<view class="navbar-nav" :class="navIndex == 1? 'active': ''" @tap="changeNav(1)">
				<view class="navbar-nav-item">
					<view class="navbar-nav-top">
						<image style="width: 50rpx;height: 50rpx;border-radius: 50%;"
							src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/cry.png"
							mode="aspectFill"></image>
						<text style="margin-left: 10rpx;">一般</text>
					</view>
					<view class="navbar-nav-num">
						{{ 99 > pagedata1.length > 0 ? pagedata1.length : 0 }}
					</view>
				</view>
			</view>
			<view class="navbar-nav" :class="navIndex == 2? 'active': ''" @tap="changeNav(2)">
				<view class="navbar-nav-item">
					<view class="navbar-nav-top">
						<image style="width: 50rpx;height: 50rpx;border-radius: 50%;"
							src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/commentku.png"
							mode="aspectFill"></image>
						<text style="margin-left: 10rpx;">差评</text>
					</view>
					<view class="navbar-nav-num">
						{{ 99 > pagedata2.length > 0 ? pagedata2.length : 0 }}
					</view>
				</view>
			</view>
		</view>


		<view class="content">
			<view class="page1" v-if="navIndex == 3 ">

				<view class="comments" v-for="(item,index) in pagedata3" :key="index">
					<view class="comment">
						<view class="comment-user">
							<view class="comment-user-left">
								<view class="comment-user-image">
									<image class="comment-user-img" @tap="gotoUser(item.send_user_id[0]._id)"
										:src="item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].avatar_file.url : 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png'"
										mode="aspectFill"></image>
								</view>
								<view class="comment-user-name">
									{{item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].nickname :'未知用户'}}
								</view>
							</view>

							<view class="comment-type">
								{{commentType[item.type]}}
							</view>
						</view>
						<view class="comment-post">
							帖子: {{item.post_id[0] ?item.post_id[0].noteTitle :'该贴已被删除'}}
						</view>
						<view class="comment-content">
							评论内容: {{item.content}}
						</view>
						<view class="comment-time">
							<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
								format="MM-dd"></uni-dateformat>
						</view>
					</view>
				</view>

			</view>

			<view class="page2" v-else-if="navIndex == 0">

				<view class="comments" v-for="(item,index) in pagedata0" :key="index">
					<view class="comment">
						<view class="comment-user">
							<view class="comment-user-left">
								<view class="comment-user-image">
									<image class="comment-user-img" @tap="gotoUser(item.send_user_id[0]._id)"
										:src="item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].avatar_file.url : 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png'"
										mode="aspectFill"></image>
								</view>
								<view class="comment-user-name">
									{{item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].nickname :'未知用户'}}
								</view>
							</view>

							<view class="comment-type">
								{{commentType[item.type]}}
							</view>
						</view>
						<view class="comment-post">
							帖子: {{item.post_id[0] ?item.post_id[0].noteTitle :'该贴已被删除'}}
						</view>
						<view class="comment-content">
							评论内容: {{item.content}}
						</view>
						<view class="comment-time">
							<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
								format="MM-dd"></uni-dateformat>
						</view>
					</view>
				</view>

			</view>

			<view class="page3" v-else-if="navIndex == 1">


				<view class="comments" v-for="(item,index) in pagedata1" :key="index">
					<view class="comment">
						<view class="comment-user">
							<view class="comment-user-left">
								<view class="comment-user-image">
									<image class="comment-user-img" @tap="gotoUser(item.send_user_id[0]._id)"
										:src="item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].avatar_file.url : 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png'"
										mode="aspectFill"></image>
								</view>
								<view class="comment-user-name">
									{{item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].nickname :'未知用户'}}
								</view>
							</view>

							<view class="comment-type">
								{{commentType[item.type]}}
							</view>
						</view>
						<view class="comment-post">
							帖子: {{item.post_id[0] ?item.post_id[0].noteTitle :'该贴已被删除'}}
						</view>
						<view class="comment-content">
							评论内容: {{item.content}}
						</view>
						<view class="comment-time">
							<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
								format="MM-dd"></uni-dateformat>
						</view>
					</view>
				</view>

			</view>

			<view class="page4" v-else>


				<view class="comments" v-for="(item,index) in pagedata2" :key="index">
					<view class="comment">
						<view class="comment-user">

							<view class="comment-user-left">
								<view class="comment-user-image">
									<image class="comment-user-img"
										:src="item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].avatar_file.url : 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png'"
										mode="aspectFill"></image>
								</view>
								<view class="comment-user-name">
									{{item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].nickname :'未知用户'}}
								</view>
							</view>

							<view class="comment-type">
								{{commentType[item.type]}}
							</view>

						</view>
						<view class="comment-post">
							帖子: {{item.post_id[0] ?item.post_id[0].noteTitle :'该贴已被删除'}}
						</view>
						<view class="comment-content">
							评论内容: {{item.content}}
						</view>
						<view class="comment-time">
							<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
								format="yyyy-MM-dd hh:mm:ss"></uni-dateformat>
						</view>
					</view>
				</view>


			</view>
		</view>
		<!-- <uni-load-more v-if="idLoad" status="loading"></uni-load-more> -->
		<uni-load-more :status="Pageloading"></uni-load-more>

	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onReachBottom, onPullDownRefresh, onLoad } from '@dcloudio/uni-app'
	const db = uniCloud.database()
	let uid = uniCloud.getCurrentUserInfo().uid
	const idLoad = ref(true)
	const Pageloading = ref('loading')

	const pagedata0 = ref([])
	const pagedata1 = ref([])
	const pagedata2 = ref([])
	const pagedata3 = ref([])

	const commentType = {
		0: '好评',
		1: '一般',
		2: '差评'
	}


	const navIndex = ref(3)

	onPullDownRefresh(() => {
		pagedata0.value = []
		pagedata1.value = []
		pagedata2.value = []
		pagedata3.value = []
		getData()
		uni.stopPullDownRefresh()
	})

	onReachBottom(() => {
		getData()
	})


	onLoad((e) => {
		if (e.userId) {
			uid = e.userId
		}
		getData()
	})

	// 前往对方主页
	function gotoUser(id) {
		uni.navigateTo({
			url: `/pages/my/myDetail?userId=${id}`
		})
	}

	function changeNav(index) {
		navIndex.value = index
	}

	async function getData() {

		Pageloading.value = 'loading'
		const temp1 = db.collection('jimoty-post').field('_id,noteTitle').getTemp()
		const temp6 = db.collection('uni-id-users').field('_id,nickname,avatar_file.url').getTemp()

		// 好评
		const temp2 = db.collection('jimoty-comment').where({ re_user_id: uid, type: 0 }).getTemp()
		const res2 = await db.collection(temp2, temp1, temp6).orderBy('create_date desc').skip(pagedata0.value.length)
			.limit(10).get()
		pagedata0.value = [...pagedata0.value, ...res2.result.data]

		console.log(res2.result.data, 'aaaaaaaaaaaaaaaaaaaaaaaaaa');


		// 一般
		const temp3 = db.collection('jimoty-comment').where({ re_user_id: uid, type: 1 }).getTemp()
		const res3 = await db.collection(temp3, temp1, temp6).orderBy('create_date desc').skip(pagedata1.value.length)
			.limit(10).get()
		pagedata1.value = [...pagedata1.value, ...res3.result.data]


		// 差评
		const temp4 = db.collection('jimoty-comment').where({ re_user_id: uid, type: 2 }).getTemp()
		const res4 = await db.collection(temp4, temp1, temp6).orderBy('create_date desc').skip(pagedata2.value.length)
			.limit(10).get()
		pagedata2.value = [...pagedata2.value, ...res4.result.data]

		// 全部
		const temp5 = db.collection('jimoty-comment').where({ re_user_id: uid }).getTemp()
		const res5 = await db.collection(temp5, temp1, temp6).orderBy('create_date desc').skip(pagedata3.value.length)
			.limit(10).get()
		pagedata3.value = [...pagedata3.value, ...res5.result.data]

		idLoad.value = false
		Pageloading.value = 'noMore'

	}
</script>

<style lang="scss">
	.navbar {
		width: 100%;
		height: 120rpx;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid rgb(234, 234, 234);
		border-bottom: 1px solid rgb(234, 234, 234);
		box-shadow: 3rpx 3rpx 5rpx rgba(0, 0, 0, 0.3);

		.navbar-nav {
			width: 25%;
			height: 120rpx;
			font-size: 32rpx;
			color: rgb(85, 85, 85);

			.navbar-nav-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-top: 20rpx;
			}
		}

		.active {
			border-bottom: 3px solid rgb(36, 157, 98);
			color: rgb(36, 157, 98);
		}
	}

	.comments {
		padding: 20rpx;
		background-color: white;

		.comment {
			padding: 20rpx 0;
			border-bottom: 1px solid #c6c6c6;
		}

		.comment-user {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.comment-user-left {
			display: flex;
			align-items: center;

			.comment-user-image {
				width: 80rpx;
				height: 80rpx;

				.comment-user-img {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}
			}

			.comment-user-name {
				margin-left: 20rpx;
			}

		}

		.comment-type {
			padding: 10rpx 20rpx;
			border: 1px solid rgb(36, 157, 98);
			border-radius: 20px;
			font-size: 24rpx;
		}


		.comment-post {
			margin-top: 15rpx;
		}

		.comment-content {
			margin-top: 15rpx;
		}

		.comment-time {
			margin-top: 15rpx;
			font-size: 24rpx;
			color: #8a8a8a;
		}
	}
</style>