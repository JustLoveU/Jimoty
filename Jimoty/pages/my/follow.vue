<template>
	<view class="container">

		<view class="navbar">
			<view class="navbar-nav" :class="navIndex== 0? 'active' : ''" @tap="changeNav(0)">
				我关注的
			</view>
			<view class="navbar-nav" :class="navIndex == 1? 'active': ''" @tap="changeNav(1)">
				关注我的
			</view>

		</view>

		<view class="content" v-if="ifLoad">

			<view class="user" v-for="(item,index) in index1data" :key="index" v-if="navIndex==0">
				<view class="user-left">
					<view class="user-left-img">
						<image class="user-img" @tap="gotoUser(item.friend_uid[0]._id)"
							:src="item.friend_uid && item.friend_uid[0].avatar_file ?item.friend_uid[0].avatar_file.url :defalutImage"
							mode="aspectFill"></image>
					</view>
					<view class="user-left-name">
						{{item.friend_uid && item.friend_uid[0] ? item.friend_uid[0].nickname :'未知用户'}}
					</view>
				</view>
				<view class="user-right-btu" :class="item.isfollow ?'other':'' "
					@tap="cancleFD(item.friend_uid[0]._id,index)">
					{{item.isfollow ? '已互相关注' :'取消关注'}}
				</view>
			</view>

			<view class="user" v-for="(item,index) in index2data" :key="index" v-else>
				<view class="user-left">
					<view class="user-left-img">
						<image class="user-img" @tap="gotoUser(item.follow_uid[0]._id)"
							:src="item.follow_uid && item.follow_uid[0].avatar_file ?item.follow_uid[0].avatar_file.url :defalutImage"
							mode="aspectFill"></image>
					</view>
					<view class="user-left-name">
						{{item.follow_uid && item.follow_uid[0] ? item.follow_uid[0].nickname :'未知用户'}}
					</view>
				</view>
				<view class="user-right-btu" :class="check(item.follow_uid[0]._id) ?'other':'' "
					@tap="withFD(item.follow_uid[0]._id,index)">
					{{check(item.follow_uid[0]._id) ? '已互相关注' :'点击互关'}}
				</view>
			</view>

		</view>

		<uni-load-more :status="Pageloading"></uni-load-more>
	</view>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
	import { makeNotice, removeNotice } from '@/utils/noticeOperate.js'
	let db = uniCloud.database()
	let dbcmd = db.command
	const uid = uniCloud.getCurrentUserInfo().uid

	const defalutImage = 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png'

	const navIndex = ref(0)

	const Pageloading = ref('loading')
	const ifLoad = ref(false)

	const index1data = ref([])
	const index2data = ref([])

	const havefollow = ref([])

	const myFollowId = ref({})

	onLoad(async (e) => {
		if (e.myFollowId) {
			navIndex.value = 1
			myFollowId.value = e.myFollowId
		}

		await loadData()
		ifLoad.value = true
	})

	onPullDownRefresh(() => {
		reset()
		uni.stopPullDownRefresh()
	})

	onReachBottom(() => {
		loadData()
	})

	function reset() {
		index1data.value = []
		index2data.value = []
		havefollow.value = []
		loadData()
	}

	function check(id) {
		if (havefollow.value.includes(id)) {
			return true
		}
		return false
	}

	// 前往对方主页
	function gotoUser(id) {
		uni.navigateTo({
			url: `/pages/my/myDetail?userId=${id}`
		})
	}


	async function loadData() {
		Pageloading.value = 'loading'
		try {
			const temp1 = db.collection('jimoty-follow').where({ follow_uid: uid }).getTemp()
			const temp2 = db.collection('uni-id-users').field('_id,nickname,avatar_file.url').getTemp()
			const res = await db.collection(temp1, temp2).orderBy('create_date desc').skip(index1data.value.length)
				.limit(
					10).get()
			index1data.value = [...index1data.value, ...res.result.data]

			await checkIfMutualFollow()

			const temp3 = db.collection('jimoty-follow').where({
				friend_uid: uid,

			}).getTemp()
			const temp4 = db.collection('uni-id-users').field('_id,nickname,avatar_file.url').getTemp()
			const res2 = await db.collection(temp3, temp4).orderBy('create_date desc').skip(index2data.value.length)
				.limit(
					10).get()
			index2data.value = [...index2data.value, ...res2.result.data]

			if (myFollowId.value !== '') {
				index2data.value = findAndMoveToFront(index2data.value, myFollowId.value)
			}
			console.log('###', index2data.value);
			Pageloading.value = 'noMore'
		} catch (e) {
			//TODO handle the exception
			Pageloading.value = 'noMore'
		}

	}


	function changeNav(index) {
		navIndex.value = index
	}


	// 找到消息通知的对象
	function findAndMoveToFront(arr, targetId) {
		let foundIndex = -1;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].follow_uid && arr[i].follow_uid[0]._id === targetId) {
				foundIndex = i;
				break;
			}
		}

		if (foundIndex !== -1) {
			const foundObj = arr.splice(foundIndex, 1)[0];
			arr.unshift(foundObj);
		}

		return arr;
	}


	// 判断是否互相关注
	async function checkIfMutualFollow() {
		let followArr = index1data.value.map(item => {
			return item.friend_uid[0]._id
		})
		let havefollowArr = await db.collection('jimoty-follow').where({
			follow_uid: dbcmd.in(followArr),
			friend_uid: uid
		}).get()
		index1data.value.forEach(item => {
			let localIndex = havefollowArr.result.data.findIndex(find => {
				return item.friend_uid[0]._id == find.follow_uid
			})
			if (localIndex !== -1) {
				item.isfollow = true
				// 如果相互关注移除index2data的数据
				havefollow.value.push(item.friend_uid[0]._id)
			}
		})
	}


	// 取消关注
	function cancleFD(userId, index) {
		uni.showModal({
			content: '是否取消关注',
			success: async function(res) {
				if (res.confirm) {
					index1data.value.splice(index, 1)
					let find = havefollow.value.findIndex(item => item == userId)
					if (find != -1) {
						console.log(find, '移除', havefollow.value, '%%%', userId);
						havefollow.value.splice(find, 1)

					}
					await db.collection('jimoty-follow').where({
						friend_uid: userId,
						follow_uid: uid
					}).remove()
					removeNotice(uid, userId, 2, '互相关注')
					// reset()
				} else if (res.cancel) {

				}
			}
		});
	}


	// 互相关注
	async function withFD(followUid, index) {
		// index2data.value.splice(index, 1)

		if (havefollow.value.includes(followUid)) {
			uni.showModal({
				content: '是否取消关注',
				success: async function(res) {
					if (res.confirm) {
						let find = havefollow.value.findIndex(item => item == followUid)
						if (find != -1) {
							console.log('移除');
							havefollow.value.splice(find, 1)
						}
						await db.collection('jimoty-follow').where({
							friend_uid: followUid,
							follow_uid: uid
						}).remove()
						removeNotice(uid, followUid, 2, '互相关注')
						reset()
					} else if (res.cancel) {

					}
				}
			});
		} else {
			await db.collection('jimoty-follow').add({
				friend_uid: followUid
			}).then(async res => {
				havefollow.value.push(followUid)
				makeNotice(uid, followUid, 2, '互相关注')
				console.log('&&&&', havefollow.value);

			})

			uni.showToast({
				title: '已关注',
				icon: 'none'
			})
			reset()
		}

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
			width: 50%;
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

	.content {
		padding: 20rpx;
		background-color: white;
	}

	.user {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid rgb(167, 167, 167);
		padding: 20rpx;

		.user-left {
			display: flex;
			align-items: center;

			.user-img {
				width: 70rpx;
				height: 70rpx;
				border-radius: 50%;
			}

			.user-left-name {
				margin-left: 20rpx;
			}
		}

		.user-right-btu {
			width: 140rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			border: 1px solid rgb(167, 167, 167);
			border-radius: 10rpx;
		}

		.other {
			border: 1px solid rgb(1, 133, 119);
			color: rgb(1, 133, 119);
		}
	}
</style>