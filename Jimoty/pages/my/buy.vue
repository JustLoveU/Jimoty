<template>
	<view class="container">

		<view style="padding: 10rpx; background-color: white;">
			<uni-section title="我的收获" type="line">
				<view style="padding: 20rpx 10rpx;">
					<view v-for="(item,index) in localData" :key="index">

						<view style="box-shadow: 1rpx 1rpx 3rpx #dcdcdc;padding: 20rpx;">
							<uni-list-chat :avatar-circle="true" :title="item.sellId[0]?item.sellId[0].nickname:'未知用户'"
								:avatar="item.sellId[0].avatar_file.url"></uni-list-chat>

							<view class="order-center">
								<view class="order-center-img">
									<image class="img-size"
										:src="item.goodId[0] && item.goodId[0].photos[0]?item.goodId[0].photos[0] :avatar"
										mode="aspectFill"></image>
								</view>
								<view class="order-center-title">
									{{item.goodId[0] ? item.goodId[0].noteTitle : '该帖已删除'}}
								</view>
							</view>
							<view class="order-time" style="padding: 0 20rpx;">
								<uni-dateformat :date="item.create_date" format='yyyy-MM-dd hh:mm:ss'
									:threshold="[0,0]"></uni-dateformat>
							</view>
						</view>


					</view>
				</view>

			</uni-section>
		</view>
		<uni-load-more :status="Pageloading"></uni-load-more>

	</view>
</template>

<script setup>
	import { ref, defineProps, computed, onMounted, nextTick } from 'vue';
	import { onLoad, onPullDownRefresh, onReachBottom, onReady } from '@dcloudio/uni-app'
	const avatar = 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/商品不存在(1).png'
	const Pageloading = ref('loading')

	// 渲染的数据
	const localData = ref([])
	let collectArr = []

	let db = uniCloud.database()
	let dbCmd = db.command
	const uid = uniCloud.getCurrentUserInfo().uid

	function timestampToDate(timestamp) {
		const date = new Date(timestamp);
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}


	async function loadData() {
		Pageloading.value = 'loading'
		const temp1 = db.collection('jimoty-buy').where({ buyId: uid }).getTemp()
		const temp2 = db.collection('jimoty-post').field('_id,noteTitle,photos').getTemp()
		const temp3 = db.collection('uni-id-users').field('_id,nickname,avatar_file.url').getTemp()
		const res = await db.collection(temp1, temp2, temp3).orderBy('create_date desc').skip(localData.value
			.length).limit(10).get()
		console.log(res.result.data, 'aaaaaaaaaaaaaaaaaaaaaaa');
		localData.value = [...localData.value, ...res.result.data]
		Pageloading.value = 'noMore'
	}

	onMounted(() => {
		loadData()
	})

	onPullDownRefresh(() => {
		localData.value = []
		loadData()
		uni.stopPullDownRefresh()
	})

	onReachBottom(() => {
		loadData()
	})
</script>

<style lang="scss">
	.order-center {
		display: flex;
		align-items: center;
		// justify-content: space-between;
		color: #000;
		border-top: 1px solid #dedede;
		padding: 20rpx;

		.order-center-img {
			width: 120rpx;
			height: 120rpx;

			.img-size {
				width: 120rpx;
				height: 120rpx;
			}
		}

		.order-center-title {
			margin-left: 20rpx;
			font-size: 30rpx;
		}

	}

	.order-time {
		padding: 20rpx 0;
		color: #acacac;
	}
</style>