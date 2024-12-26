<template>
	<view class="container">
		<view class="search-body">

			<unicloud-db ref="udb" #default="{data, loading, error, options}" collection="jimoty-search,jimoty-category"
				orderby="create_date desc" :page-size="15" @load="handleHot" :where="`userId == '${userId}'`" manual>

				<view class="word-container_body">
					<text v-if="error" class="word-container_body-info">{{error.message}}</text>
					<template v-else>

						<view class="search-hot">
							<view class="search-hot-top">
								<view class="search-hot-title">
									搜索条件
								</view>
								<view class="search-hot-btu">
									<button type="primary" size="mini" @tap="makeNotice">新建</button>
								</view>
							</view>

							<view class="search-hot-item" v-for="(item,index) in searchConditons" :key="index">
								<view class="search-hot-item-left">
									<view class="search-hot-item-left-text">
										{{item.text_condition}}
									</view>
									<view class="search-hot-item-left-sub">
										类别--{{ item?.category_condition[0] ? item.category_condition[0].name : '' }}
									</view>
									<view class="search-hot-item-left-sub">
										{{item.positon_condition.address}}
										&nbsp;/&nbsp;{{item.positon_condition.length / 1000}}km以内
									</view>
								</view>
								<view class="search-hot-item-right" @tap.stop="setNotice(item,index)">
									<uni-icons type="more-filled" size="24" color="rgb(159, 159, 159)"></uni-icons>
								</view>
							</view>
						</view>

					</template>

				</view>

				<uni-load-more :status="Pageloading"></uni-load-more>
			</unicloud-db>


		</view>
	</view>
</template>

<script setup>
	import { onMounted, ref, onUnmounted } from 'vue';
	import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
	const Pageloading = ref('loading')
	const userId = uniCloud.getCurrentUserInfo().uid
	const db = uniCloud.database()

	const inputDialog = ref(null)

	const searchConditons = ref([])

	onPullDownRefresh(() => {
		console.log('刷新');

		udb.value.loadData({
			clear: true
		}, () => {
			// 停止下拉刷新
			uni.stopPullDownRefresh()
		})


	})

	onReachBottom(() => {
		udb.value.loadMore()
	})

	onMounted(() => {
		udb.value.loadData()
	})

	const udb = ref(null)
	// 创建消息
	function makeNotice() {
		uni.navigateTo({
			url: '/pages/my/noticeAdd'
		})
	}

	function handleHot(e) {

		console.log(e);
		if (e.length > 0) {
			Pageloading.value = ''
		} else {
			Pageloading.value = 'noMore'
		}

		searchConditons.value = [...e]
	}

	function setNotice(data, index) {
		console.log(data);

		uni.showModal({
			content: '是否确认删除',
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定');
					searchConditons.value.splice(index, 1)
					db.collection('jimoty-search').doc(data._id).remove()
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
</script>

<style lang="scss">
	.dialog {
		padding: 20rpx;
		background-color: white;


		.dialog-btu {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.btu1 {
				width: 120rpx;
				height: 70rpx;
				border-radius: 20px;

			}

			.btu2 {
				width: 120rpx;
				height: 70rpx;
				border-radius: 20px;
				background-color: rgb(52, 155, 109);
				color: white;
			}
		}
	}

	.search-body {
		background-color: #fff;
		border-bottom-right-radius: 10px;
		border-bottom-left-radius: 10px;

		.word-container_body-info {
			display: flex;
			justify-content: center;
			padding: 20rpx 0;
		}


		.search-hot {
			padding: 0 20rpx 20rpx 20rpx;
			width: 100%;

			.search-hot-top {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #dedede;
				margin-bottom: 20rpx;

				.search-hot-btu {
					width: 140rpx;
				}

				.search-hot-title {
					font-size: 30rpx;
				}
			}



			.search-hot-item {
				border-bottom: 1px solid #dedede;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.search-hot-item-left {
					padding: 20rpx 0;

					.search-hot-item-left-text {
						font-size: 30rpx;
						color: black;
					}

					.search-hot-item-left-sub {
						color: rgb(156, 156, 156);
						font-size: 24rpx;
						margin-top: 15rpx;
					}
				}

				&:active {
					opacity: 0.7;
				}
			}
		}

	}
</style>