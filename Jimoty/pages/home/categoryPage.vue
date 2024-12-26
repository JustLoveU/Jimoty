<script setup>
	import { ref } from 'vue';
	import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

	const db = uniCloud.database()
	const dbCmd = db.command
	const uid = uniCloud.getCurrentUserInfo().uid
	const categoryArr = ref([])
	const localData = ref([])

	const text_condition = ref('')

	onPullDownRefresh(async () => {
		localData.value = []
		await getData()
		console.log('加载');
		uni.stopPullDownRefresh()

	})

	onReachBottom(() => {
		getData()
	})


	let HistoryCity
	onLoad((e) => {
		uni.setNavigationBarTitle({
			title: e.name
		})

		// 获得搜索距离
		HistoryCity = uni.getStorageSync('HistoryCity')
		getCategoryArr(e.categoryId)

	})

	const Pageloading = ref('loading')
	const thiswhere = ref('weight desc,browse desc,create_date desc')


	async function getCategoryArr(id) {
		const res = await db.collection('jimoty-category').field('_id,name').get({
			getTree: {
				limitLevel: 10, // 最大查询层级（不包含当前层级），可以省略默认10级，最大15，最小1
				startWith: `_id=="${id}"` // 末级节点的条件，此初始条件不可以省略
			}
		})

		categoryArr.value = getAllValues(res.result.data[0])
		getData()
	}

	function getAllValues(tree) {
		let values = [];

		function traverse(node) {
			values.push(node._id);
			for (let i = 0; i < node.children.length; i++) {
				traverse(node.children[i]);
			}
		}

		traverse(tree);
		return values;
	}

	async function getData() {
		Pageloading.value = 'loading'

		let postArr = await db.collection('jimoty-post').where({
			category: dbCmd.in(categoryArr.value),
			point: dbCmd.geoNear({
				geometry: new db.Geo.Point(HistoryCity.longitude, HistoryCity.latitude),
				maxDistance: HistoryCity.length,
				minDistance: 0
			})
		}).field('_id').get()
		postArr = postArr.result.data.map((item) => {
			return item._id
		})


		const temp1 = db.collection('jimoty-post').where({
			status: dbCmd.in([2, 5]),
			delete: 1,
			_id: dbCmd.in(postArr)
		}).getTemp()


		const temp3 = db.collection('jimoty-collect').field('_id,post_id,user_id,clickTime').getTemp()

		const temp4 = db.collection('jimoty-category').field('_id,parent_id,name').getTemp()

		const res = await db.collection(temp1, temp3, temp4).where(
			`${new RegExp(text_condition.value, 'i')}.test(noteTitle)`).orderBy(thiswhere.value).skip(
			localData.value
			.length).limit(15).get()
		await handleSuccess(res.result.data)
	}

	async function handleSuccess(e) {
		if (e.length > 0) {
			Pageloading.value = ''
		} else {
			Pageloading.value = 'noMore'
		}

		localData.value = [...localData.value, ...e];

		let collectArr = localData.value.map((item) => {
			return item._id._value
		})
		let likeArr = await db.collection('jimoty-collect').where({
			post_id: dbCmd.in(collectArr),
			user_id: uid
		}).get()

		for (var i = 0; i < localData.value.length; i++) {
			let localIndex = likeArr.result.data.findIndex(find => {
				return localData.value[i]._id._value == find.post_id
			})
			if (localIndex !== -1) {
				localData.value[i].isCollect = true
			}
		}
	}

	// 搜索
	function search(e) {
		console.log(e, '搜索条件');
		text_condition.value = e.value
		localData.value = []
		getData()

	}

	import { makeNotice, removeNotice } from '@/utils/noticeOperate.js'


	// 进入详情页
	const gotoDetail = (postId) => {
		uni.navigateTo({
			url: `/pages/home/detail?postId=${postId}`
		})
	}

	const classify = ref([
		'社交',
		'兼职',
		'教培',
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
		<uni-search-bar class="uni-mt-10" radius="5" placeholder="请输入搜索内容" clearButton="auto" cancelButton="none"
			@confirm="search" />


		<view class="goods">
			<view class="good" v-for="(item,index) in localData" :key="index" @click="gotoDetail(item._id._value)"
				:class="[item?.hightLight ? 'active':'',item?.weight == 200 ? 'prActive':'']">

				<view class="good-img-box">
					<image class="good-image"
						:src="item.photos && item.photos[0] ? item.photos[0] : 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/moren.png'"
						mode="aspectFill"></image>
					<view class="goodd-shadow">
						<view class="shadow-text">{{item.category[0].name}}</view>
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



		<!-- <homeGoods :data='localData'></homeGoods> -->
		<uni-load-more :status="Pageloading"></uni-load-more>
	</view>
</template>



<style lang="scss" scoped>
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