<script setup>
	import { ref, defineProps, computed, onMounted, nextTick, onUnmounted } from 'vue';
	import { onLoad, onPullDownRefresh, onReachBottom, onReady, onHide, onShow } from '@dcloudio/uni-app'
	import { verifyName } from '@/utils/verifyName.js'
	import  homeSkeleton  from './skeleton/homeSkeleton.vue'
	import { getLocalMap } from '@/utils/getLocalMap.js'

	// 渲染的数据
	const localData = ref([])

	let db = uniCloud.database()
	let dbCmd = db.command
	const uid = uniCloud.getCurrentUserInfo().uid
	const mapData = ref({})

	const ifLoad = ref(false)

	// 新的消息
	const newNotice = ref(0)

	// 加载的数据类型
	const navIndex = ref(0)

	const Pageloading = ref('loading')

	// 分类数据
	const data = ref([{
			image: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/xianzhi.png',
			name: '闲置',
			id: "66f04609eef9cba934a06332",
			isShow: true
		},
		{
			image: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/social.png',
			name: '社交',
			id: "66f045f8337a9f907ceb9001",
			isShow: true
		},
		{
			image: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/adopt.png',
			name: '领养',
			id: "66f04627c3b5c99cfcd65dd0",
			isShow: true
		},
		{
			image: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/teach.png',
			name: '兴趣',
			id: "66f0461f6e5d2d42f9a67f3a",
			isShow: true
		},
		{
			image: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/concurrent.png',
			name: '互助',
			id: "66f0462d7c8de454cff0d229",
			isShow: true
		}
	])

	let HistoryCity
	onMounted(() => {

		HistoryCity = uni.getStorageSync('HistoryCity')
		if (!HistoryCity) {
			getLocalMap()
			HistoryCity = uni.getStorageSync('HistoryCity')
		}
		mapData.value = HistoryCity
		getData()

		ifLoad.value = true

		// verifyName()
		console.log(uid);

		uni.$on('refashHome', (data) => {
			let index = localData.value.findIndex(obj => obj._id._value == data.post_id);
			nextTick(() => {
				if (localData.value[index].isCollect) {
					localData.value[index].isCollect = false
				} else {
					localData.value[index].isCollect = true
				}
			})
		})


		uni.$on('mapDataHome', res => {
			let data = {
				city: res.address,
				latitude: Number(res.latitude),
				length: res.length,
				longitude: Number(res.longitude),
				time: Date.now()
			}

			mapData.value = data
			uni.setStorageSync('HistoryCity', data)

			HistoryCity = data
			reset()
		})


	})

	let timer = null

	onShow(() => {
		getNewNotice()
		timer = setInterval(() => {
			getNewNotice()
		}, 3000)
	})

	onHide(() => {
		clearInterval(timer)
		timer = null
	})

	// 获取新的消息
	async function getNewNotice() {
		db.collection('jimoty-notice').where({ receive: uid, status: false }).count().then(count => {
			newNotice.value = count.result.total
		})
	}


	const thiswhere = ref('weight desc,browse desc,create_date desc')
	async function getData() {

		Pageloading.value = 'loading'
		let postArr = await db.collection('jimoty-post').where({
			point: dbCmd.geoNear({
				geometry: new db.Geo.Point(HistoryCity.longitude, HistoryCity.latitude),
				maxDistance: HistoryCity.length,
				minDistance: 0
			})
		}).field('_id').get()
		postArr = postArr.result.data.map((item) => {
			return item._id
		})

		if (navIndex.value == 2) {

			const temp1 = db.collection('jimoty-post').where({
				status: db.command.in([2, 5]),
				delete: 1,
				_id: dbCmd.in(postArr),
				type: 5,
				postPrice: '0.00'
			}).getTemp()
			if (navIndex.value == 0) {
				thiswhere.value = 'browse desc,create_date desc'
			} else if (navIndex.value == 1) {
				thiswhere.value = 'weight desc,update_date desc,create_date desc,browse desc'
			}


			const temp3 = db.collection('jimoty-collect').field('_id,post_id,user_id,clickTime').getTemp()



			const res = await db.collection(temp1, temp3).orderBy(thiswhere.value).skip(
				localData.value
				.length).limit(15).get()
			await handleSuccess(res.result.data)

		} else {
			const temp1 = db.collection('jimoty-post').where({
					status: db.command.in([2, 5]),
					delete: 1,
					_id: dbCmd.in(
						postArr)
				})
				.getTemp()
			if (navIndex.value == 0) {
				thiswhere.value = 'browse desc,create_date desc'
			} else if (navIndex.value == 1) {
				thiswhere.value = 'weight desc,update_date desc,create_date desc,browse desc'
			}


			const temp3 = db.collection('jimoty-collect').field('_id,post_id,user_id,clickTime').getTemp()

			if (navIndex.value == 0) {
				const res = await db.collection(temp1, temp3).where('weight != 200').orderBy(thiswhere
						.value)
					.skip(
						localData.value
						.length).limit(15).get()
				await handleSuccess(res.result.data)
			} else if (navIndex.value == 1) {
				const res = await db.collection(temp1, temp3).orderBy(thiswhere.value).skip(
					localData.value
					.length).limit(15).get()
				await handleSuccess(res.result.data)
			}
		}

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

	onPullDownRefresh(() => {
		reset()

	})

	function reset() {
		localData.value = []
		gridIndex.value = -1
		getData()
		console.log('加载');
		uni.stopPullDownRefresh()
	}

	onReachBottom(() => {
		getData()
	})


	function openmap() {
		uni.navigateTo({
			url: `/pages/submit/map?index=1`
		})
	}

	function opennotice() {
		uni.navigateTo({
			url: '/pages/home/notice'
		})
	}

	const gridIndex = ref(-1)
	// 根据类目搜索
	async function search(categoryId, name) {
		uni.navigateTo({
			url: `/pages/home/categoryPage?categoryId=${categoryId}&name=${name}`
		})
	}

	function changeNav(index) {
		navIndex.value = index
		localData.value = []
		gridIndex.value = -1
		if (navIndex.value == 0) {
			getData()
		} else if (navIndex.value == 1) {
			// 获取最新
			getData()
		} else {
			// 获取闲置0元
			getData()
		}

	}
</script>


<template>
	<view class="container">

		<view v-if="ifLoad">
			<view class="address-notice">
				<view style="display: flex;align-items: center;">
					<view class="address" @tap="openmap">
						<view class="address-name">
							{{mapData.city ? mapData.city + ` 周边${mapData.length / 1000}Km`:
							'请选择您的位置'}}
						</view>
					</view>
					<uni-icons type="right" size="18"></uni-icons>
				</view>

				<view class="notice" @tap="opennotice">
					<image class="notice-img"
						src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/lingdang.png"
						mode="aspectFill"></image>
					<view class="notice-number" v-if="newNotice !=0">{{newNotice > 99 ? '99+': newNotice }}</view>
				</view>
			</view>

			<view class="grids">
				<view class="grid " v-for="(item,index) in data" :key="index" @tap="search(item.id,item.name)"
					:class="gridIndex === index? 'grid_active':''">
					<view v-if="item.isShow" style="display: flex; flex-direction: column;align-items: center;">
						<view class="grid-image">
							<image class="grid-image-img" :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="grid-name">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>

			<view class="navbar">
				<view class="navbar-nav" :class="navIndex== 0? 'active' : ''" @tap="changeNav(0)">
					热门
				</view>
				<view class="navbar-nav" :class="navIndex == 1? 'active': ''" @tap="changeNav(1)">
					最新
				</view>
				<view class="navbar-nav" :class="navIndex == 2? 'active': ''" @tap="changeNav(2)">
					0元
				</view>
			</view>


			<homeGoods :data='localData'></homeGoods>

			<uni-load-more :status="Pageloading"></uni-load-more>
		</view>

		<view v-else>
			<homeSkeleton></homeSkeleton>
		</view>


	</view>
</template>


<style lang="scss" scoped>
	.navbar {
		width: 100%;
		height: 80rpx;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid rgb(234, 234, 234);
		border-bottom: 1px solid rgb(234, 234, 234);
		box-shadow: 3rpx 3rpx 5rpx rgba(0, 0, 0, 0.3);

		.navbar-nav {
			width: 50%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 28rpx;
			// font-weight: 600;
			color: rgb(85, 85, 85);
		}

		.active {
			border-bottom: 3px solid rgb(36, 157, 98);
			color: rgb(36, 157, 98);
		}
	}



	.grids {
		margin-top: 10rpx;
		padding: 10rpx 20rpx;
		display: flex;
		justify-content: space-between;
		background-color: white;
		flex-wrap: wrap;
		/* 允许换行 */
		gap: 10px;
		/* 项目之间的间隔 */

		.grid {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 15%;

			.grid-image {
				width: 60rpx;
				height: 60rpx;

				.grid-image-img {
					width: 60rpx;
					height: 60rpx;
				}
			}

			.grid-name {
				// line-height: 50rpx;
				font-size: 26rpx;
			}

			&:active {
				opacity: 0.7;
			}
		}

		.grid_active {
			background-color: #d6d6d6;
			border-radius: 10px;
			filter: saturate(150%);
		}

	}

	.address-notice {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0rpx 40rpx;
		background-color: white;

		.address {
			display: flex;
			align-items: center;
			// width: 550rpx;
			max-width: 550rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;

			.address-name {
				margin-right: 15rpx;
				font-size: 32rpx;
			}

		}

		.notice {
			width: 70rpx;
			height: 70rpx;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;

			.notice-img {
				width: 50rpx;
				height: 50rpx;
			}

			.notice-number {
				background-color: red;
				color: white;
				position: absolute;
				padding: 2rpx;
				width: 25rpx;
				height: 25rpx;
				line-height: 25rpx;
				font-size: 16rpx;
				text-align: center;
				border-radius: 100%;
				right: 0%;
				top: 0%;
				// transform: translate(5%, -5%);

			}
		}

	}
</style>