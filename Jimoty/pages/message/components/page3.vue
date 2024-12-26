<template>
	<view class="container">
		<scroll-view style="height:100vh;" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered"
			@refresherrefresh="onPullDownRefresh" @scrolltolower="onReachBottom">

			<view class="comments" v-for="(item,index) in pagedata" :key="index">
				<uni-swipe-action-item :right-options="options" @click="bindClick(item._id,index)">
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
							帖子: {{item.post_id[0] ?item.post_id[0].noteTitle :'该贴已被删除' }}
						</view>
						<view class="comment-content">
							评论内容: {{item.content}}
						</view>
						<view class="comment-time">
							<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
								format="yyyy-MM-dd hh:mm:ss"></uni-dateformat>
						</view>
					</view>
				</uni-swipe-action-item>
			</view>

			<uni-load-more :status="Pageloading"></uni-load-more>

		</scroll-view>

	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	const db = uniCloud.database()
	const uid = uniCloud.getCurrentUserInfo().uid
	const Pageloading = ref('loading')

	const pagedata = ref([])

	const options = ref([{
		text: '删除',
		style: {
			backgroundColor: '#F56C6C'
		}
	}])



	// 删除评论
	function bindClick(chatId, index) {
		uni.showModal({
			content: '是否删除',
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定');

					pagedata.value.splice(index, 1)
					db.collection('jimoty-comment').doc(chatId).remove()


				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		})
	}

	const commentType = {
		0: '好评',
		1: '一般',
		2: '差评'
	}


	const triggered = ref(false)

	async function onPullDownRefresh() {
		console.log('刷新');
		triggered.value = true
		pagedata.value = []
		await getData()
		triggered.value = false
	}

	function onReachBottom() {
		console.log('触底');
		getData()
	}

	onMounted(() => {
		console.log('加载数据');
		getData()
	})

	async function getData() {

		Pageloading.value = 'loading'
		const temp1 = db.collection('jimoty-post').field('_id,noteTitle').getTemp()
		const temp6 = db.collection('uni-id-users').field('_id,nickname,avatar_file.url').getTemp()

		// 好评
		const temp2 = db.collection('jimoty-comment').where({ send_user_id: uid }).getTemp()
		const res2 = await db.collection(temp2, temp1, temp6).orderBy('create_date desc').skip(pagedata.value.length)
			.limit(10).get()
		pagedata.value = [...pagedata.value, ...res2.result.data]
		Pageloading.value = 'noMore'
		console.log(pagedata.value);
	}

	// 前往对方主页
	function gotoUser(id) {
		uni.navigateTo({
			url: `/pages/my/myDetail?userId=${id}`
		})
	}
</script>

<style lang="scss">
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