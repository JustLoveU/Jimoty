<script setup>
	import { ref, defineProps, onMounted } from 'vue';
	import { onLoad } from '@dcloudio/uni-app'
	import { makeNotice, removeNotice } from '@/utils/noticeOperate.js'
	const SendMs = uniCloud.importObject('jimoty-sendMessage', { customUI: true })

	let db = uniCloud.database()
	const uid = uniCloud.getCurrentUserInfo().uid

	// 渲染的数据
	const localData = ref([])

	const prop = defineProps({
		data: Object,
		default: () => {},
	})


	// 进入详情页
	const gotoDetail = (postId) => {
		uni.navigateTo({
			url: `/pages/home/detail?postId=${postId}`
		})
	}

	const classify = ref([
		'社交',
		'互助',
		'兴趣',
		'领养',
		'闲置'
	])


	// 收藏操作
	const Inoperation1 = ref(false)
	async function collect(postId, userId, index, isCollect) {
		// 未登录跳转
		if (!uid) {
			uni.navigateTo({
				url: 'uni_modules/uni-id-pages/pages/login/login-withoutpwd'
			})
			return
		}


		if (Inoperation1.value) return
		Inoperation1.value = true

		if (isCollect) {
			prop.data[index].isCollect = !prop.data[index].isCollect
			collectAdd(postId, -1)
			db.collection('jimoty-collect').where(`post_id=="${postId}" && user_id==$cloudEnv_uid`).remove()
			// hotChange(postId, -1)
			// 消息删除
			removeNotice(uid, userId, 4, postId)
		} else {
			db.collection('jimoty-collect').add({
				post_id: postId
			}).then((res) => {
				// 消息添加			
				if (uid != userId) {
					makeNotice(uid, userId, 4, postId)
					SendMs.sendMessage1(userId, '有人收藏了你的帖子')
				}
			})

			prop.data[index].like++
			prop.data[index].isCollect = !prop.data[index].isCollect
			collectAdd(postId, 1)

			// experienceChange(10)
		}
		Inoperation1.value = false
	}

	// 收藏数量改变
	const collectAdd = async (postId, num) => {
		const data = await db.collection('jimoty-post').where(`_id=="${postId}"`).field('collect')
			.get({ getOne: true })
		let thislike = data.result.data.collect + num
		await db.collection('jimoty-post').where(`_id=="${postId}"`).update({ collect: thislike })
	}
</script>

<template>
	<view class="container">
		<view class="goods">
			<view class="good" v-for="(item,index) in prop.data" :key="index" @click="gotoDetail(item._id._value)"
				:class="[item?.hightLight ? 'active':'',item?.weight == 200 ? 'prActive':'']">

				<view class="good-img-box">
					<image class="good-image" :class="item.status == 4 ? 'overActive' :''"
						:src="item.photos && item.photos[0] ? item.photos[0] : 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/moren.png'"
						mode="aspectFill"></image>
					<view class="goodd-shadow">
						<view class="shadow-text">{{classify[item.type-1]}}</view>
					</view>
				</view>

				<view class="good-des">
					<view class="des-top">
						<view class="des-top-title ellipsis">
							{{item.noteTitle}}
						</view>
						<view class="des-top-price" v-if="item.postPrice">
							￥{{item.postPrice}}
						</view>
					</view>


					<view class="des-bottom">
						<view class="des-bottom-address">
							{{item.location && item.location.province ? item.location.province  :'未知'}}
						</view>
						<view class="des-bottom-time">
							<text style="margin-right: 15rpx;">
								<uni-dateformat :date=item.create_date :threshold="[60000, 86400000]"
									format='MM/dd'></uni-dateformat>
							</text>

							<view class="collect"
								@tap.stop="collect(item._id._value,item.userId[0]._id?item.userId[0]._id:item.userId,index,item.isCollect)">
								<uni-icons type="star" size="24" v-if="!item.isCollect"></uni-icons>
								<uni-icons type="star-filled" size="24" v-else></uni-icons>
							</view>
						</view>
					</view>

				</view>
			</view>


		</view>
	</view>
</template>


<style lang="scss">
	.goods {
		display: flex;
		flex-direction: column;

		.good {
			margin-top: 10rpx;
			display: flex;
			background-color: white;
			padding: 10rpx;
			border-radius: 10rpx;
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


				.overActive {
					&::before {
						content: '已下架';
						position: absolute;
						top: 0%;
						width: 170rpx;
						height: 40rpx;
						text-align: center;
						line-height: 40rpx;
						background-color: #a7a7a7;
						color: white;
						font-size: 20rpx;
					}
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
				display: flex;
				flex: 1;
				flex-direction: column;
				padding: 0 10rpx;
				justify-content: space-between;

				.des-top {
					.des-top-title {
						font-weight: 600;
						font-size: 26rpx;
						line-height: 40rpx;

					}

					.des-top-price {
						font-size: 24rpx;
					}
				}

				.des-bottom {
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: rgb(204, 204, 204);
					font-size: 24rpx;
				}
			}

		}

		.active {
			background-color: rgb(255, 210, 44);
			border-radius: 5px;

			.des-bottom-address {
				color: white;
			}
		}

		.prActive {
			&::before {
				content: "PR";
				position: absolute;
				right: 20rpx;
				top: 20rpx;
				width: 80rpx;
				border: 1px solid #249d62;
				color: #249d62;
				border-radius: 5px;
				text-align: center;
			}
		}


	}
</style>