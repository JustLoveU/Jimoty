<template>
	<view class="container">
		<scroll-view style="height:100vh;" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered"
			@refresherrefresh="onPullDownRefresh" @scrolltolower="onReachBottom">
			<view class="content">
				<view class="content-item" v-if="hideArr.length > 0">

					<view style="transform: translateY(28rpx);">有{{hideArr.length}}个咨询处于折叠中 </view>

					<view class="left-btu" @tap.stop="changeMesaageType(false)" style="border: 1px solid #000;">
						展开
					</view>

				</view>
				<view class="content-item" v-for="(item,index) in pageData" :key="index" @tap="gotochat(item)">
					<uni-swipe-action-item :right-options="options" @click="bindClick(item._id,index)">
						<view class="content-item-left">
							<image class="left-img" :class="item.hasNew ? 'newActive':''"
								:src="item.postId[0] ? item.postId[0].photos[0] : 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/商品不存在(1).png'"
								mode="aspectFill"></image>
							<view class="left-des">
								<view class="left-des-title">
									[咨询]
								</view>
								<view class="left-des-sub ellipsis">
									{{item.postId[0] ? item.postId[0].noteTitle : '该贴已删除'}}
								</view>
								<view class="left-des-time">
									<!-- 	<uni-dateformat :date="item.create_date" :threshold="[60000,7200000]"
										format="yyyy-MM-dd hh:mm:ss"></uni-dateformat> -->

									{{formatDate(item.create_date)}}
								</view>
							</view>
						</view>

						<view class="left-btu" @tap.stop="changeMesaageType(true,item,index)">
							折叠
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
	let dbcmd = db.command
	let uid = uniCloud.getCurrentUserInfo().uid


	const hideArr = ref([])
	//切换表示状态
	function changeMesaageType(bool, data, index) {
		if (bool) {
			pageData.value[index].isShow = 0
			hideArr.value.push(data)
			pageData.value.splice(index, 1)
		} else {
			let arr = hideArr.value.map((item) => {
				return item._id._value
			})
			hideArr.value.forEach(item => {
				item.isShow = 1
				pageData.value.unshift(item)
			})
			hideArr.value = []
			console.log('$$$$', pageData.value);
			// pageData.value[index].isShow = 1
		}
	}


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
		hideArr.value = []
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


	async function getData() {
		Pageloading.value = 'loading'
		const temp1 = db.collection('jimoty-chat').where(`userId == "${uid}" && delete == false`).field(
			'_id as message,userId,friendId,postId,delete,create_date,isShow,update_date').getTemp()
		const temp2 = db.collection('jimoty-post').where('delete != 0').field('_id,photos,noteTitle').getTemp()
		// const temp3 = db.collection('jimoty-chat-message').field('_id,chatBoxId,time,status').getTemp()
		const res = await db.collection(temp1, temp2).orderBy('update_date desc').skip(pageData.value.length)
			.limit(10)
			.get()

		let data = res.result.data

		for (var i = 0; i < data.length; i++) {
			data[i].hasNew = false
			data[i].isShow = 1
			const count = await db.collection('jimoty-chat-message').where({
				chatBoxId: data[i]._id,
				friendId: uid,
				status: false
			}).count()
			if (count.result.total > 0) {
				data[i].hasNew = true
			}
			if (i == data.length - 1) {
				pageData.value = [...pageData.value, ...data]
				console.log(pageData.value, 'oooooooo');
				Pageloading.value = 'noMore'
			}

		}
		Pageloading.value = 'noMore'

	}


	function gotochat(item) {
		item.hasNew = false
		if (!item.postId[0]) {
			uni.showToast({
				title: '该贴已删除',
				icon: 'none'
			})
			return
		}
		uni.navigateTo({
			url: `/pages/message/chatPage?userId=${item.userId}&friendId=${item.friendId}&postId=${item.postId[0]._id}`
		})
	}

	// 时间转换
	function formatDate(timestamp) {
		const now = new Date();
		const inputDate = new Date(timestamp);
		const daysDifference = Math.floor((now - inputDate) / (1000 * 60 * 60 * 24));

		if (daysDifference === 0) {
			return "今日";
		} else if (daysDifference === 1) {
			return "昨天";
		} else if (daysDifference === 2) {
			return "前天";
		} else {
			return `${daysDifference}日前`;
		}
	}
</script>

<style lang="scss">
	.content {
		padding: 20rpx;
		background-color: white;
	}

	.content-item {
		padding: 20rpx 0 70rpx 0;
		border-top: 1px solid rgb(190, 190, 190);
		position: relative;

		&:active {
			opacity: 0.7;
		}

		.content-item-left {
			display: flex;

			.left-img {
				width: 120rpx;
				height: 120rpx;

			}

			.newActive {
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
					width: 350rpx;
				}

				.left-des-time {
					margin-top: 10rpx;
					font-size: 24rpx;
					color: rgb(119, 119, 119);
				}
			}
		}

		.left-btu {
			position: absolute;
			right: 30rpx;
			bottom: 20rpx;
			width: 120rpx;
			height: 70rpx;
			font-weight: 600;
			line-height: 70rpx;
			text-align: center;
			border: 1px solid rgb(127, 127, 127);
			border-radius: 10rpx;
			color: rgb(127, 127, 127);
		}
	}

	.content-item:first-child {
		border-top: none;
	}
</style>