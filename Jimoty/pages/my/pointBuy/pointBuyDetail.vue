<template>
	<view class="container">
		<view class="goods">
			<view class="good" v-for="(item,index) in pageData1" :key="index" @click="chooseUse(item,index)"
				:class="navIndex == index? 'active' :''">

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
						【{{item.status == 5 ? '交易中' :statusType[item.status]}}】{{item.noteTitle}}
					</view>
					<view class="good-time">
						<uni-dateformat :date="item.create_date" format="MM/dd hh:mm"></uni-dateformat>
					</view>

					<view class="good-liulan">
						收藏: {{item.collect}} &nbsp; 浏览数: {{item.browse}}
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="Pageloading"></uni-load-more>

		<view class="my-btu">
			<view class="btu" @tap="submit">
				确认使用
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, } from 'vue'
	import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

	const defalutImage = 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png'

	let db = uniCloud.database()
	const dbcmd = db.command
	const uid = uniCloud.getCurrentUserInfo().uid
	const Pageloading = ref('loading')

	const pageData1 = ref([])

	const myPostId = ref('')
	const chooseData = ref({})


	const statusType = ref({
		1: '草稿',
		2: '发布中',
		4: '结束'
	})

	const daojuEme = ref({
		0: '置顶',
		1: '高亮',
		2: '刷新',
		3: '定期刷新'
	})

	const daojuType = ref(-1) //0置顶，1高亮，2刷新,3定期刷新
	onLoad((e) => {
		// 判断使用的类型
		daojuType.value = Number(e.daojuType)
		console.log('道具类型', daojuEme.value[daojuType.value]);
		loadData()
	})

	onPullDownRefresh(() => {
		pageData1.value = []
		loadData()
		uni.stopPullDownRefresh()
	})

	onReachBottom(() => {
		loadData()
	})


	async function loadData() {
		Pageloading.value = 'loading'
		const temp1 = db.collection('jimoty-post').where({ userId: uid, status: dbcmd.in([2, 5]), delete: 1 })
			.getTemp()
		const temp2 = db.collection('jimoty-category').field('_id,name,parent_id').getTemp()
		const res = await db.collection(temp1, temp2).skip(pageData1.value.length).limit(10).get()
		console.log(res.result.data, 'llllllllllll');
		pageData1.value = [...pageData1.value, ...res.result.data]

		Pageloading.value = 'noMore'

	}

	const navIndex = ref(-1)

	const postTpye = ref(1) //帖子类型

	function chooseUse(data, index) {
		navIndex.value = index
		chooseData.value = data
		myPostId.value = data._id
		postTpye.value = data.type
		console.log(data, 'kkkk');
	}


	function checkZhiDing() {
		db.collection('jimoty-post').where({ status: 2, delete: 1, hightLight: true }).count()
	}

	function submit() {
		if (myPostId.value != '' && myPostId.value) {
			uni.showModal({
				content: `是否对稿子(${chooseData.value.noteTitle})使用(${daojuEme.value[daojuType.value]})道具`,
				success: async function(res) {
					if (res.confirm) {
						uniCloud.callFunction({
							name: 'jimoty-dao-use',
							data: {
								daojuType: daojuType.value,
								uid: uid,
								myPostId: myPostId.value,
								postTpye: postTpye.value
							}
						}).then(res => {
							if (res.result.code == 200) {
								uni.showToast({
									title: res.result.msg,
									icon: 'none'
								})
							} else {
								uni.showToast({
									title: res.result.msg,
									icon: 'none'
								})
							}
							setTimeout(() => {
								uni.navigateBack()
							}, 800)
						}).catch(e => {
							uni.showToast({
								title: '使用失败！！！',
								icon: 'error'
							})
						})

					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		} else {
			uni.showToast({
				title: '请选择需要使用的投稿',
				icon: 'none'
			})
		}
	}
</script>

<style lang="scss">
	.goods {
		display: flex;
		flex-direction: column;
		padding-bottom: 120rpx;

		.good {
			display: flex;
			background-color: white;
			padding: 20rpx;
			border-bottom: 1px solid rgb(199, 199, 199);


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

				.good-liulan,
				.good-time {
					margin-top: 10rpx;
					color: rgb(139, 139, 139);
					font-size: 26rpx;
				}
			}

		}

		.active {
			background-color: rgb(0, 214, 125);
			border-radius: 20px;
		}

	}

	.my-btu {
		position: fixed;
		bottom: 0rpx;
		background-color: white;
		width: 100%;
		padding-bottom: 50rpx;
		padding-top: 20rpx;
		display: flex;
		justify-content: center;
		z-index: 10;

		.btu {
			width: 80%;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 20px;
			text-align: center;
			font-size: 32rpx;
			color: white;
			background-color: rgb(0, 178, 106);
		}
	}
</style>