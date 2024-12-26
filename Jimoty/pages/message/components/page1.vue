<template>
	<view class="container">

		<scroll-view style="height: 100vh;" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered"
			@refresherrefresh="onPullDownRefresh" @scrolltolower="onReachBottom">
			<view class="content">

				<view class="content-item" v-for="(item,index) in pageData" :key="index" @tap="gotochat(item)">

					<uni-swipe-action-item :right-options="options" @click="bindClick(item._id,index)">

						<view class="content-item-row">
							<view class="content-item-left">

								<image class="left-img" :class="item.hasNew ? 'active':''"
									:src="item.postId[0] && item.postId[0].photos[0] ? item.postId[0].photos[0] :'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/商品不存在(1).png'"
									mode="aspectFill"></image>

								<view class="left-des">
									<view class="left-des-title">
										{{item.postId && item.postId[0]? item.postId[0].noteTitle : '暂无详情'}}
									</view>
									<view class="left-des-sub">
										{{item.userId && item.userId[0] ? item.userId[0].nickname :'未知用户'}}
									</view>

									<view class="left-des-sub" style="font-size: 24rpx;">
										{{formatTimestamp(item.update_date)}}
									</view>
								</view>
							</view>
							<uni-icons type="right" size="24"></uni-icons>
						</view>

					</uni-swipe-action-item>

				</view>

			</view>
			<uni-load-more :status="Pageloading"></uni-load-more>
		</scroll-view>

	</view>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	const Pageloading = ref('loading')

	const options = ref([{
		text: '删除',
		style: {
			backgroundColor: '#F56C6C'
		}
	}])

	let db = uniCloud.database()
	let uid = uniCloud.getCurrentUserInfo().uid


	// 删除聊天（逻辑删除）
	function bindClick(chatId, index) {
		uni.showModal({
			content: '是否删除',
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定');

					pageData.value.splice(index, 1)
					db.collection('jimoty-chat').doc(chatId).update({ delete: true })


				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		})
	}

	const triggered = ref(false)
	async function onPullDownRefresh() {
		triggered.value = true
		pageData.value = []
		await getData()
		uni.stopPullDownRefresh()
		triggered.value = false
	}

	function onReachBottom() {
		getData()
	}
	const pageData = ref([])

	onMounted(async () => {
		getData()
	})


	// 格式化时间
	function formatTimestamp(timestamp) {
		const now = new Date();
		const inputDate = new Date(timestamp);
		const daysDifference = Math.floor((now - inputDate) / (1000 * 60 * 60 * 24));

		if (daysDifference === 0) {
			const hours = inputDate.getHours().toString().padStart(2, '0');
			const minutes = inputDate.getMinutes().toString().padStart(2, '0');
			return `${hours}:${minutes}`;
		} else if (daysDifference === 1) {
			const hours = inputDate.getHours().toString().padStart(2, '0');
			const minutes = inputDate.getMinutes().toString().padStart(2, '0');
			return `昨天 ${hours}:${minutes}`;
		} else if (daysDifference === 2) {
			const hours = inputDate.getHours().toString().padStart(2, '0');
			const minutes = inputDate.getMinutes().toString().padStart(2, '0');
			return `前天 ${hours}:${minutes}`;
		} else {
			const month = inputDate.getMonth() + 1;
			const day = inputDate.getDate();
			const hours = inputDate.getHours().toString().padStart(2, '0');
			const minutes = inputDate.getMinutes().toString().padStart(2, '0');
			return `${month}月${day}日 ${hours}:${minutes}`;
		}
	}


	async function getData() {
		Pageloading.value = 'loading'
		const temp1 = db.collection('jimoty-chat').where(`friendId == "${uid}" && delete == false`).getTemp()
		const temp2 = db.collection('jimoty-post').where('delete != 0').field('_id,photos,noteTitle').getTemp()
		const temp3 = db.collection('uni-id-users').field('_id,nickname,avatar_file.url').getTemp()
		const res = await db.collection(temp1, temp2, temp3).orderBy('update_date desc').skip(pageData.value.length)
			.limit(10).get()

		let data = res.result.data

		for (let i = 0; i < data.length; i++) {
			data[i].hasNew = false
			const count = await db.collection('jimoty-chat-message').where({
				chatBoxId: data[i]._id,
				friendId: uid,
				status: false
			}).count()
			if (count.result.total > 0) {
				data[i].hasNew = true
			}
		}

		pageData.value = [...pageData.value, ...data]
		console.log('@@@@@@', pageData.value);
		if (res.result.data.length > 0) {
			Pageloading.value = ''
		} else {
			Pageloading.value = 'noMore'
		}

	}

	async function handData(data) {
		for (let i = 0; i < data.length; i++) {
			data[i].hasNew = false
			const count = await db.collection('jimoty-chat-message').where({
				chatBoxId: data[i]._id,
				status: false
			}).count()
			if (count.result.total > 0) {
				data[i].hasNew = true
			}
		}
		console.log('!!!!!!', data);
		return data
	}


	function gotochat(item) {
		console.log(chatId, 'aaaaaaaa');
		item.hasNew = false
		let chatId = item._id
		if (chatId != '' && chatId) {
			uni.navigateTo({
				url: `/pages/message/chatPage?chatId=${chatId}`
			})
		} else {
			uni.showToast({
				title: '该聊天记录不存在',
				icon: 'none'
			})
		}

	}
</script>

<style lang="scss">
	.content {
		padding: 20rpx;
		background-color: white;
	}

	.content-item {
		padding: 20rpx 0;
		border-top: 1px solid rgb(190, 190, 190);

		.content-item-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.content-item-left {
			display: flex;

			.left-img {
				width: 120rpx;
				height: 120rpx;
				position: relative;
			}

			.active {
				&::before {
					content: 'NEW!';
					position: absolute;
					top: 0%;
					width: 120rpx;
					height: 40rpx;
					text-align: center;
					line-height: 40rpx;
					background-color: red;
					color: white;
					font-size: 18rpx;
				}
			}

			.left-des {
				margin-left: 20rpx;

				.left-des-title {
					font-weight: 600;
					font-size: 32rpx;
				}

				.left-des-sub {
					font-size: 32rpx;
					color: rgb(119, 119, 119);
				}
			}
		}
	}

	.content-item:first-child {
		border-top: none;
	}
</style>