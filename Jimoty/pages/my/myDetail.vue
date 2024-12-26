<script setup>
	import { ref, onUnmounted } from 'vue';
	import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
	import { makeNotice, removeNotice } from '@/utils/noticeOperate.js'
	const SendMs = uniCloud.importObject('jimoty-sendMessage', { customUI: true })
	const db = uniCloud.database()
	const dbCmd = db.command
	const userID = ref('')
	const uid = uniCloud.getCurrentUserInfo().uid


	onUnmounted(() => {
		// 取消绑定分享参数
		wx.offCopyUrl()
	})

	const Pageloading = ref('loading')
	onLoad(async (e) => {
		userID.value = e.userId
		// 绑定分享参数
		wx.onCopyUrl(() => {
			return { query: `userId=${userID.value}` }
		})
		// 获取主页数据
		if (userID.value != '') {
			if (userID.value != uid) {
				// 判断是否关注
				const follow = await db.collection('jimoty-follow').where({
					friend_uid: userID.value,
					follow_uid: uid
				}).count()


				if (follow.result.total > 0) {
					ifFollow.value = true
				}
			}

			openshare()
			getUserData()
			loadData()
		} else {
			uni.showToast({
				title: '该用户不存在',
				icon: 'none'
			})
		}

	})


	onPullDownRefresh(async () => {
		console.log('刷新');
		postData.value = []
		await loadData()
		uni.stopPullDownRefresh()
	})

	onReachBottom(() => {
		loadData()
	})

	const userData = ref({})
	const postData = ref([])
	const guanzhu = ref(0)
	const fengsi = ref(0)
	const yishou = ref(0)

	const ifFollow = ref(false)

	// 获取用户数据
	async function getUserData() {
		const res = await db.collection('uni-id-users').doc(userID.value).field(
				'avatar_file.url,nickname,describe,xiScore')
			.get({ getOne: true })

		userData.value = res.result.data
		getScore(res.result.data.xiScore)
		const count = await db.collection('jimoty-follow').where({ friend_uid: userID.value }).count()
		const count2 = await db.collection('jimoty-follow').where({ follow_uid: userID.value }).count()
		fengsi.value = count.result.total
		guanzhu.value = count2.result.total

		// 查询已售的数量
		const count3 = await db.collection('jimoty-post').where({ userId: userID.value, status: 4 }).count()
		yishou.value = count3.result.total

	}

	// 获取投稿数据
	async function loadData() {
		Pageloading.value = 'loading'
		const temp1 = db.collection('jimoty-post').where({ userId: userID.value, delete: 1, status: dbCmd.in([2, 4]) })
			.getTemp()
		const temp2 = db.collection('jimoty-collect').field('_id,post_id,user_id,clickTime').getTemp()
		const temp3 = db.collection('jimoty-category').field('_id,name,parent_id').getTemp()
		const res = await db.collection(temp1, temp2, temp3).where('delete == 1').orderBy(
			'create_date desc,weight desc,update_time desc,browse desc').skip(postData.value
			.length).limit(10).get()
		handleSuccess(res.result.data)
	}

	async function handleSuccess(e) {

		postData.value = [...postData.value, ...e];

		let collectArr = postData.value.map((item) => {
			return item._id._value
		})

		let likeArr = await db.collection('jimoty-collect').where({
			post_id: dbCmd.in(collectArr),
			user_id: uid
		}).get()

		postData.value.forEach((item, index) => {
			let localIndex = likeArr.result.data.findIndex(find => {
				return item._id._value == find.post_id
			})
			if (localIndex !== -1) {
				item.isCollect = true
			}
		})
		console.log('@#@@@@', postData.value);
		Pageloading.value = 'noMore'
	}

	const goeditor = () => {
		uni.navigateTo({
			url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
		})
	}


	// 用户星级
	const userScore = ref(3)

	function getScore(score) {
		if (score <= 20) {
			userScore.value = 1
		} else if (score <= 40) {
			userScore.value = 2
		} else if (score <= 60) {
			userScore.value = 3
		} else if (score <= 80) {
			userScore.value = 4
		} else if (80 < score) {
			userScore.value = 5
		}
	}

	// 关注
	const attention = () => {
		if (ifFollow.value) {
			uni.showModal({
				content: '是否取消关注',
				success: function(res) {
					if (res.confirm) {
						console.log('用户点击确定');
						ifFollow.value = false
						db.collection('jimoty-follow').where({
							friend_uid: userID.value,
							follow_uid: uid
						}).remove()
						removeNotice(uid, userID.value, 2, '关注')
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});

		} else {
			db.collection('jimoty-follow').add({
				friend_uid: userID.value
			}).then(res => {
				makeNotice(uid, userID.value, 2, '关注')
				SendMs.sendMessage1(userID.value, '有人关注了你')
			})

			uni.showToast({
				title: '感谢您的关注',
				icon: 'none'
			})
			ifFollow.value = true
		}
	}

	function gotoComent() {
		uni.navigateTo({
			url: `/pages/my/comment?userId=${userID.value}`
		})
	}

	function openshare() {

		wx.showShareMenu({
			menus: ['shareAppMessage', 'shareTimeline'],
			title: userData.value.nickname,
			path: `/pages/my/myDetail?userId=${userID.value}`,
			success() {
				console.log('成功');
			},
			fail() {
				uni.showToast({
					title: '转发失败',
					icon: 'none'
				})
			}

		})
	}
</script>


<template>
	<view class="container">

		<view class="my-messge">
			<view class="head">
				<image class="head-img"
					:src=" userData.avatar_file && userData.avatar_file.url  ? userData.avatar_file.url : 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png'"
					mode="aspectFill"></image>
				<view class="head-name">
					{{userData.nickname}}
				</view>

				<view class="user-opr" @tap="attention" :class="ifFollow  ? 'active':''" v-if="uid != userID">
					<text
						style="font-weight: 600; font-size: 24rpx; text-align: center">{{ ifFollow  ? '已关注': '关注'}}</text>
				</view>
			</view>

			<view class="detail">
				<view class="fan">
					<view class="fan-num">
						{{guanzhu}}<text
							style="margin-right: 20rpx;">关注</text>&nbsp;{{fengsi}}<text>粉丝</text>&nbsp;&nbsp;{{yishou}}<text>已售商品</text>
					</view>
					<view class="editor" @tap="goeditor" v-if="userID === uid">
						编辑资料
					</view>
				</view>
				<view class="inroduce">{{userData.describe ? userData.describe:'这个家伙很神秘，没有个人简介'}}</view>

			</view>
		</view>

		<view class="my-body">

			<view class="my-uni-rate" @tap="gotoComent">
				<div>评分</div>
				<view style="display: flex;align-items: center;">
					<uni-rate :readonly="true" :touchable="false" :value="userScore" />
					<uni-icons type="right" size="16"></uni-icons>
				</view>

			</view>

			<view class="des">
				我的帖子 &nbsp; ({{postData.length}}件)
			</view>
			<view>
				<homeGoods :data="postData"></homeGoods>
			</view>
			<uni-load-more :status="Pageloading"></uni-load-more>
		</view>

	</view>
</template>

<style lang="scss">
	.my-messge {
		background-color: white;

		.head {
			display: flex;
			align-items: center;
			padding: 20rpx;
			position: relative;

			.head-img {
				width: 65px;
				height: 65px;
				border: 2px solid white;
			}

			.head-name {
				margin-left: 20rpx;
				font-weight: 600;
				font-size: 34rpx;
			}

			.user-opr {
				position: absolute;
				right: 20rpx;
				border: 1px solid rgb(37, 157, 97);
				width: 120rpx;
				height: 50rpx;
				text-align: center;
				line-height: 50rpx;
				border-radius: 10rpx;
				color: rgb(37, 157, 97);
			}

			.active {
				opacity: 0.7;
			}
		}

		.detail {
			padding: 0 20rpx 20rpx 20rpx;
			;

			.inroduce {
				font-size: 24rpx;
				border-radius: 10rpx;
				padding: 20rpx;
				margin: 20rpx 0;
				background-color: rgb(239, 239, 239);
			}

			.fan {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.fan-num {
					font-size: 24rpx;
				}

				.editor {
					background-color: #e3e3e3;
					padding: 10rpx 20rpx;
					border-radius: 20px;
					font-size: 26rpx;
					font-weight: 600;
				}
			}
		}
	}

	.my-body {

		.my-uni-rate {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;
			background-color: white;
			border-top: 1px solid #e3e3e3;
			border-bottom: 1px solid #e3e3e3;
		}

		.des {
			padding: 20rpx;
			background-color: white;
			font-weight: 600;
			font-size: 30rpx;
		}
	}
</style>