<script setup>
	import { computed, onMounted, onUnmounted, ref } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { makeNotice, removeNotice } from '@/utils/noticeOperate.js'
	const secCheckObj = uniCloud.importObject("secCheckContent", { customUI: true })
	const SendMs = uniCloud.importObject('jimoty-sendMessage', { customUI: true })

	let db = uniCloud.database()
	const loading = ref(true)

	const indicatorDots = ref(true)
	const autoplay = ref(true)
	const interval = ref(2000)
	const duration = ref(1000)

	let uid = uniCloud.getCurrentUserInfo().uid
	// 用户id
	const userId = ref('')
	const userAllData = ref([])
	// 帖子id
	const postId = ref('')
	// 帖子类型
	const postType = ref(-1)
	// 页面数据
	const pageData = ref([])

	// 评论弹窗
	const popup = ref(null)
	const commentIndex = ref(0)
	const commentText = ref('')

	// 添加浏览历史到缓存

	function AddHistoryBrowse() {
		if (uid != userId.value) {
			if (uni.getStorageSync('history-browse')) {
				let broseArr = uni.getStorageSync('history-browse')
				if (broseArr.includes(postId.value)) {
					return
				} else {
					broseArr.unshift(postId.value)
					broseArr.splice(30)
					uni.setStorageSync('history-browse', broseArr)
				}
			} else {
				uni.setStorageSync('history-browse', [postId.value])
			}
		}
	}

	const isNotLogin = ref(true)
	onShow(() => {

		// 判断是否登录
		let token = uni.getStorageSync('uni_id_token')
		if (!token) {
			isNotLogin.value = false
		}

	})

	// 加载数据
	onLoad(async (e) => {
		postId.value = e.postId

		// 绑定分享参数
		wx.onCopyUrl(() => {
			return { query: `postId=${postId.value}` }
		})
		if (postId.value != '') {
			await loadData()
			// 添加浏览历史到缓存
			AddHistoryBrowse()
			// 浏览数量增加
			if (uid != userId.value) {
				browseAdd(postId.value, 1)
			}
		} else {
			uni.showToast({
				title: '该帖子已下架',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 800)
		}
	})


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



	onUnmounted(() => {
		// 取消绑定分享参数
		wx.offCopyUrl()
	})



	async function loadData() {
		const temp1 = db.collection('jimoty-post').where(`_id=="${postId.value}"`).getTemp()
		const temp2 = db.collection('uni-id-users').field('_id,nickname,avatar_file.url,xiScore').getTemp()
		const temp3 = db.collection('jimoty-collect').field('_id,post_id,user_id,clickTime').getTemp()
		const temp4 = db.collection('jimoty-category').field('_id,name,parent_id').getTemp()

		let res = await db.collection(temp1, temp2, temp3, temp4).get({ getOne: true })


		if (res.result.data) {
			postType.value = res.result.data.type
			userId.value = res.result.data.userId[0]._id
			pageData.value = res.result.data
			getScore(res.result.data.userId[0].xiScore)
			// 获取用户数据
			await handleSuccess()
			db.collection('jimoty-post').where({
				userId: userId.value,
				status: db.command.in([2, 5]),
				delete: 1,
			}).get().then(
				res => {
					userAllData.value = res.result.data
				})
			loading.value = false
			openshare()
		} else {
			uni.showToast({
				title: '该帖子不存在',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 800)
		}


	}

	// 判断该用户是否收藏
	const handleSuccess = async () => {
		let count = await db.collection('jimoty-collect').where({
			post_id: postId.value,
			user_id: uid
		}).count()
		console.log('count', count);

		if (count.result.total > 0) {
			pageData.value.isCollect = true
		}


		// 判断是否关注
		const follow = await db.collection('jimoty-follow').where({
			friend_uid: userId.value,
			follow_uid: uid
		}).count()


		if (follow.result.total > 0) {
			pageData.value.ifFollow = true
		}
	}

	// 关注
	const attention = () => {
		if (pageData.value.ifFollow) {
			uni.showModal({
				content: '是否取消关注',
				success: function(res) {
					if (res.confirm) {
						console.log('用户点击确定');
						pageData.value.ifFollow = false
						db.collection('jimoty-follow').where({
							friend_uid: userId.value,
							follow_uid: uid
						}).remove()
						removeNotice(uid, userId.value, 2, '关注')
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});

		} else {
			db.collection('jimoty-follow').add({
				friend_uid: userId.value
			}).then(res => {
				makeNotice(uid, userId.value, 2, '关注')
				SendMs.sendMessage1(userId.value, '有人关注了你')
			})

			uni.showToast({
				title: '感谢您的关注',
				icon: 'none'
			})
			pageData.value.ifFollow = true
		}
	}



	// 查看大图
	const previewImage = (index) => {
		// 预览图片
		uni.previewImage({
			current: index,
			urls: pageData.value.photos,
			longPressActions: {
				itemList: ['发送给朋友', '保存图片', '收藏'],
				success: function(data) {
					console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				},
				fail: function(err) {
					console.log(err.errMsg);
				}
			}
		});

	}


	// 收藏操作
	const Inoperation1 = ref(false)
	async function collect() {
		// 未登录跳转
		if (!uid) {
			uni.navigateTo({
				url: 'uni_modules/uni-id-pages/pages/login/login-withoutpwd'
			})
			return
		}
		if (Inoperation1.value) return
		Inoperation1.value = true


		if (pageData.value.isCollect) {
			pageData.value.isCollect = !pageData.value.isCollect
			db.collection('jimoty-collect').where(`post_id=="${postId.value}" && user_id==$cloudEnv_uid`).remove()
			pageData.value.collect--
			collectAdd(postId.value, -1)
			// hotChange(postId.value, -1)
			// experienceChange(-10)
			removeNotice(uid, userId.value, 4, postId.value)
		} else {
			db.collection('jimoty-collect').add({
				post_id: postId.value
			}).then((res) => {
				// 消息添加
				if (uid != userId.value) {
					makeNotice(uid, userId.value, 4, postId.value, pageData.value.mainText)

					SendMs.sendMessage1(userId.value, `有人收藏了你的帖子(${pageData.value.noteTitle})`)
				}

			})

			pageData.value.collect++
			pageData.value.isCollect = !pageData.value.isCollect
			collectAdd(postId.value, 1)

			// experienceChange(10)
		}
		uni.$emit('refashHome', { msg: '详情页操作', post_id: postId.value })
		Inoperation1.value = false
	}



	// 收藏数量改变
	const collectAdd = async (postId, num) => {
		const data = await db.collection('jimoty-post').where(`_id=="${postId}"`).field('collect')
			.get({ getOne: true })
		let thislike = data.result.data.collect + num
		await db.collection('jimoty-post').where(`_id=="${postId}"`).update({ collect: thislike })
	}

	// 浏览量的改变
	function browseAdd(postId, num) {
		db.collection('jimoty-post').where(`_id=="${postId}"`).field('browse')
			.get({ getOne: true }).then(data => {
				if (data.result.data) {
					let thislike = data.result.data.browse + num
					db.collection('jimoty-post').where(`_id=="${postId}"`).update({ browse: thislike })
				}
			})
	}

	// 去聊天
	function gotoChat() {
		uni.navigateTo({
			url: `/pages/message/chatPage?friendId=${userId.value}&postId=${postId.value}`
		})
	}


	function gotoDetail(postId) {
		uni.navigateTo({
			url: `/pages/home/detail?postId=${postId}`
		})
	}


	// 打开评论弹窗
	function openPoup() {

		// 为闲置类别
		if (postType.value == 5) {
			uni.showToast({
				title: '交易成功后可评价',
				icon: 'none'
			})
			return
		}
		popup.value.open()
	}

	function chooseType(index) {
		commentIndex.value = index
	}
	async function sendComent() {
		if (commentText.value == '') {
			uni.showToast({
				title: '请输入评价',
				icon: 'none'
			})
		} else {

			try {
				uni.showLoading({
					mask: true,
					title: '发送中'
				})
				let sec = await secCheckObj.textSecCheck({ content: commentText.value })
				if (sec.errCode != 0) {
					uni.showModal({
						title: sec.errMsg,
						content: `输入的内容违规，涉及“${sec.result.label}”，请重新编辑！`,
						showCancel: false
					})
					commentText.value = ''
					uni.hideLoading()
					return
				}

				db.collection('jimoty-comment').add({
					re_user_id: userId.value,
					post_id: postId.value,
					type: commentIndex.value,
					content: commentText.value
				}).then(res => {
					// 消息添加
					makeNotice(uid, userId.value, 3, res.result.id, pageData.value.mainText)
				})

				changeScore(commentIndex.value)
				uni.hideLoading()
				commentText.value == ''
				popup.value.close()
				uni.showToast({
					title: '评价成功',
					icon: 'none'
				})
			} catch (e) {
				console.log(e);
				commentText.value == ''
				uni.hideLoading()
				uni.showToast({
					title: '发送失败',
					icon: 'none'
				})
				popup.value.close()
				//TODO handle the exception
			}

		}
	}

	// 发送评论后，调整用户的分数
	async function changeScore(type) {
		const res = await db.collection('uni-id-users').doc(userId.value).field('xiScore').get({ getOne: true })
		let score = res.result.data.xiScore
		if (type == 0) {
			// 好评
			score += 5
		} else if (type == 1) {
			// 一般
			score += 2
		} else if (type == 2) {
			// 差评
			score -= 5
		}
		db.collection('uni-id-users').doc(userId.value).update({ xiScore: score })
	}


	// 编辑稿子
	async function editPost() {
		// 根据帖子类型跳转到不同的页面（类目(1社交，2兼职，3教培，4领养，5闲置)）
		const res = await db.collection('jimoty-post').doc(postId.value).field('type').get({ getOne: true })
		console.log(res.result.data);
		switch (res.result.data.type) {
			case 1:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage1?postId=${postId.value}`
				})
				break;
			case 2:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage2?postId=${postId.value}`
				})
				break;
			case 3:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage3?postId=${postId.value}`
				})
				break;
			case 4:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage4?postId=${postId.value}`
				})
				break;
			case 5:
				uni.navigateTo({
					url: `/pages/submit/resubmit/detailpage5?postId=${postId.value}`
				})
				break;
		}
	}

	// 删除稿子
	function cancelPost() {
		uni.showModal({
			content: '是否确认删除',
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定');

					uniCloud.callFunction({
						name: 'jimoty-cancle-post',
						data: {
							postId: postId.value,
							bool: true
						}
					}).then(res => {
						uni.showToast({
							title: res.result.msg,
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 500)
					})

					// 删除相关的数据TODO
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		})
	}

	// 前往主页
	const toMyDetail = () => {
		uni.navigateTo({
			url: `/pages/my/myDetail?userId=${userId.value}`
		})
	}

	import  detailSkeleton  from './skeleton/detailSkeleton.vue'


	function openshare() {

		wx.showShareMenu({
			menus: ['shareAppMessage', 'shareTimeline'],
			title: pageData.value.noteTitle,
			path: `/pages/home/detail?postId=${pageData.value._id}`,
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
		<view v-if="!loading">
			<view class="uni-margin-wrap">
				<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay"
					:interval="interval" :duration="duration">
					<swiper-item v-for="(item,index) in pageData.photos" :key="index">
						<view class="swiper-item " @tap="previewImage(index)">
							<image class="swiper-item-img" :src="item" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>

				<view class="operate">
					<view class="operate-guanzhu" @tap.stop="collect">
						<uni-icons type="star" color="#fff" size="26" v-if="!pageData.isCollect"></uni-icons>
						<uni-icons type="star-filled" size="26" v-else></uni-icons>
						<text style="color: white;" v-if="!pageData.isCollect">{{pageData.collect}}</text>
						<text style="color: black;" v-else>{{pageData.collect}}</text>
					</view>
					<!-- <uni-icons type="bars" color="#fff" size="26"></uni-icons> -->

				</view>
			</view>

			<view class="good-des">
				<view class="good-des-content">
					{{pageData.noteTitle}}
				</view>
				<view class="good-des-bottom">
					<view class="good-des-bottom-user">
						投稿ID:{{pageData.userId ? pageData.userId[0].nickname : '未知用户'}}
					</view>
					<view class="good-des-bottom-time">
						<uni-dateformat :date=pageData.create_date :threshold="[0, 0]"
							format='yyyy年MM月dd日'></uni-dateformat>
					</view>
				</view>
			</view>


			<view class="detail-content">
				<text>{{pageData.mainText}}</text>
			</view>


			<view class="tie-types">
				<view class="tie-type" v-if="pageData.location && pageData.location.address">
					<view class="tie-type-name">
						上传地点
					</view>
					<view class="tie-type-des">
						{{pageData.location.address}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.workTime">
					<view class="tie-type-name">
						营业时间
					</view>
					<view class="tie-type-des">
						{{pageData.workTime}}
					</view>
				</view>
				<view class="tie-type">
					<view class="tie-type-name">
						交易类型
					</view>
					<view class="tie-type-des">
						直接
					</view>
				</view>
				<view class="tie-type" v-if="pageData.category && pageData.category[0] && pageData.category[0].name">
					<view class="tie-type-name">
						类别
					</view>
					<view class="tie-type-des" style="color: rgb(69,122,182);">
						{{ pageData.category[0].name }}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.companyName">
					<view class="tie-type-name">
						地点
					</view>
					<view class="tie-type-des">
						{{pageData.companyName}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.payrollForm">
					<view class="tie-type-name">
						工资形式
					</view>
					<view class="tie-type-des">
						{{pageData.payrollForm}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.salary">
					<view class="tie-type-name">
						薪资
					</view>
					<view class="tie-type-des">
						{{pageData.salary}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.salarySupplement">
					<view class="tie-type-name">
						工资补充
					</view>
					<view class="tie-type-des">
						{{pageData.salarySupplement}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.traffic">
					<view class="tie-type-name">
						交通
					</view>
					<view class="tie-type-des">
						{{pageData.traffic}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.phone">
					<view class="tie-type-name">
						电话
					</view>
					<view class="tie-type-des">
						{{pageData.phone}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.employeeForm">
					<view class="tie-type-name">
						雇佣形式
					</view>
					<view class="tie-type-des">
						{{pageData.employeeForm}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.sex">
					<view class="tie-type-name">
						性别
					</view>
					<view class="tie-type-des">
						{{pageData.sex}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.recruitAge">
					<view class="tie-type-name">
						年龄范围
					</view>
					<view class="tie-type-des">
						{{pageData.recruitAge}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.age">
					<view class="tie-type-name">
						年龄
					</view>
					<view class="tie-type-des">
						{{pageData.age}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.sterOperation">
					<view class="tie-type-name">
						绝育手术
					</view>
					<view class="tie-type-des">
						{{pageData.sterOperation}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.vaccinelnoculation">
					<view class="tie-type-name">
						疫苗接种
					</view>
					<view class="tie-type-des">
						{{pageData.vaccinelnoculation}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.releaseReason">
					<view class="tie-type-name">
						投稿理由
					</view>
					<view class="tie-type-des">
						{{pageData.releaseReason}}
					</view>
				</view>
				<view class="tie-type" v-if="pageData.postPrice">
					<view class="tie-type-name">
						商品价格
					</view>
					<view class="tie-type-des">
						{{pageData.postPrice}}
					</view>
				</view>
			</view>



			<view class="detail-user">
				<view class="user-left">
					<view class="user-img" @tap.capture="toMyDetail">
						<image class="user-img-size"
							:src="pageData.userId &&pageData.userId[0] ?pageData.userId[0].avatar_file.url :'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png' "
							mode="aspectFill"></image>
					</view>
					<view class="user-center">
						<view class="user-center-name">
							{{pageData.userId && pageData.userId[0] ? pageData.userId[0].nickname : '未知用户'}}
						</view>
						<view class="user-center-name">
							帖子: {{userAllData.length}}
						</view>
						<view class="user-center-name">
							<uni-rate :readonly="true" :touchable="false" :value="userScore" />
						</view>
					</view>
				</view>

				<view class="user-opr" @tap="attention" :class="pageData.ifFollow  ? 'active':''" v-if="uid != userId">
					<text
						style="font-weight: 600; font-size: 24rpx; text-align: center;">{{ pageData.ifFollow  ? '已关注': '关注'}}</text>
				</view>
			</view>


			<view class="other-good" v-if="userAllData.length > 0">
				<view class="other-good-top">
					<text>此人的帖子</text>
					<!-- <text style="color: rgb(69,122,182);">全部</text> -->
				</view>
				<view class="other-good-item">
					<view class="goods-item" v-for="(item,index) in userAllData" :key="index"
						@tap="gotoDetail(item._id)">
						<image class="other-good-item-img" :src="item.photos[0]" mode="aspectFill"></image>
						<view class="other-good-item-name ellipsis">
							{{item.noteTitle}}
						</view>
					</view>
				</view>
			</view>

			<view class="detail-bottom" v-if="uid  && uid == userId ">
				<view class="comment-btu" @tap="editPost">
					编辑
				</view>
				<view class="comment-btu" @tap="cancelPost">
					删除
				</view>
			</view>


			<view class="detail-bottom" v-else>
				<view class="detail-bottom-btu" @tap="gotoChat">
					<uni-icons type="email" color="#fff" size="24"></uni-icons>
					<view class="detail-bottom-text">
						咨询
					</view>
				</view>
				<!-- 				<view class="comment-btu" @tap="openshare">
					分享
				</view> -->
			</view>

			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" background-color="#fff">
				<view class="poup-box">
					<view class="choose">
						<view class="choose-item" @tap="chooseType(0)" :class="commentIndex == 0 ? 'comentActive':''">
							好评
						</view>
						<view class="choose-item" @tap="chooseType(1)" :class="commentIndex == 1 ? 'comentActive':''">
							一般
						</view>
						<view class="choose-item" @tap="chooseType(2)" :class="commentIndex == 2 ? 'comentActive':''">
							差评
						</view>
					</view>

					<view class="poup-input">
						<uni-easyinput class="uni-mt-5" trim="all" suffixIcon="paperplane" @iconClick="sendComent"
							v-model="commentText" placeholder="请输入评论" @confirm="sendComent"></uni-easyinput>
					</view>
				</view>
			</uni-popup>
		</view>

		<view v-else>
			<detailSkeleton></detailSkeleton>
		</view>
	</view>

</template>



<style lang="scss" scoped>
	.poup-box {
		padding: 30rpx;

		.choose {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.choose-item {
				padding: 20rpx;
				border: 1px solid #b8b8b8;
				border-radius: 20px;
				width: 200rpx;
				text-align: center;
			}

			.comentActive {
				border: 1px solid rgb(37, 157, 97);
				color: rgb(37, 157, 97);
			}
		}

		.poup-input {
			margin-top: 40rpx;
		}
	}



	.container {
		padding-bottom: 30rpx;
	}

	.uni-margin-wrap {
		width: 100%;
		position: relative;
	}

	.operate {
		display: flex;
		align-items: center;
		position: absolute;
		right: 0%;
		bottom: 20rpx;

		.operate-guanzhu {
			margin-right: 20rpx;
			display: flex;
			align-items: center;
		}
	}

	.swiper {
		height: 600rpx;
		background-color: #b8b8b8;
		width: 600rpx;
		margin-left: 70rpx;
	}

	.swiper-item {
		display: block;
		height: 600rpx;
		line-height: 600rpx;
		text-align: center;

		.swiper-item-img {
			width: 600rpx;
			height: 600rpx;
		}
	}


	.good-des {
		padding: 20rpx;
		background-color: white;

		.good-des-content {
			font-weight: 600;
			font-size: 36rpx;
			line-height: 60rpx;
		}

		.good-des-bottom {
			margin-top: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 22rpx;
			color: rgb(170, 170, 170);
		}
	}


	.detail-content {
		padding: 40rpx 20rpx;
		background-color: white;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.tie-types {
		margin-top: 20rpx;
		background-color: white;
		padding: 20rpx;

		.tie-type {
			display: flex;
			align-items: center;
			padding: 10rpx 0;

			.tie-type-name {
				width: 200rpx;
			}
		}
	}


	.detail-user {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: white;
		padding: 20rpx;
		margin-top: 20rpx;

		.user-left {
			display: flex;
			align-items: center;

			.user-img {
				width: 100rpx;
				height: 100rpx;

				.user-img-size {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}
			}

			.user-center {
				margin-left: 20rpx;

			}
		}

		.user-opr {
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

	.other-good {
		margin-top: 20rpx;
		padding: 20rpx;
		background-color: white;
		padding-bottom: 160rpx;

		.other-good-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;
		}

		.other-good-item {
			display: flex;
			overflow-x: auto;

			.goods-item {
				flex-shrink: 0;
				width: auto;
				max-width: 100%;
				margin-right: 20rpx;

				.other-good-item-img {
					width: 180rpx;
					height: 180rpx;
					border-radius: 10rpx;
				}

				.other-good-item-name {
					margin-top: 10rpx;
					font-weight: 600;
					width: 180rpx;
					overflow: hidden;
				}
			}
		}
	}

	.detail-bottom {
		position: fixed;
		bottom: 0%;
		width: 100%;
		background-color: white;
		// margin-top: 20rpx;
		padding: 20rpx;
		padding-bottom: 50rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;

		.detail-bottom-btu {
			width: 300rpx;
			height: 80rpx;
			border-radius: 10rpx;
			background-color: rgb(33, 159, 98);
			display: flex;
			align-items: center;
			justify-content: center;

			.detail-bottom-text {
				margin-left: 20rpx;
				color: white;

			}

			&:active {
				opacity: 0.7;
			}
		}

		.comment-btu {
			width: 300rpx;
			height: 80rpx;
			border-radius: 10rpx;
			background-color: rgb(33, 159, 98);
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;

			&:active {
				opacity: 0.7;
			}
		}
	}
</style>