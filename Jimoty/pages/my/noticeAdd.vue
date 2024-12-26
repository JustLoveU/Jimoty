<script setup>
	import { onMounted, ref, onUnmounted } from 'vue';

	const categeryData = ref([])
	const categeryStr = ref('')
	const categeryId = ref('') //类目条件

	const db = uniCloud.database()


	onMounted(() => {
		uni.$on('categerySearchData', (res) => {

			categeryData.value = res.categery
			categeryId.value = res.id
			categeryData.value.forEach(res => {
				categeryStr.value = categeryStr.value + res
			})
		})

	})

	onUnmounted(() => {
		uni.$off('categerySearchData')
		uni.$off('refashHome')
	})

	// 打开类目
	function openCategery() {
		uni.navigateTo({
			url: `/pages/submit/datapage?index=1`
		})
	}

	// 添加
	function addNotice() {
		if (categeryId.value == '') {
			uni.showToast({
				title: '请选择类别',
				icon: 'none'
			})
			return
		}


		let position = uni.getStorageSync('HistoryCity')


		db.collection('jimoty-search').add({
			positon_condition: {
				address: position.city,
				point: [position.longitude, position.latitude],
				length: position.length
			},
			category_condition: categeryId.value,
		})

		uni.showToast({
			title: '添加成功',
			icon: 'none'
		})
		setTimeout(() => {
			uni.navigateBack()
		}, 800)
	}
</script>

<template>
	<div class="container">
		<view class="submit-row1" @tap="openCategery">
			<view class="submit-row1-left">
				选择类别
			</view>
			<view class="submit-row1-right">
				<view class="submit-row1-right-des" v-if="categeryData.length>0">
					<view class="breadcrumb-item" v-for="(item,index) in categeryData" :key="index">
						{{item}}
					</view>
				</view>
				<uni-icons type="right" size="22"></uni-icons>
			</view>
		</view>

		<button type="primary" @tap="addNotice">添加</button>
	</div>
</template>

<style scoped lang='scss'>
	.submit-row1 {
		margin-top: 20rpx;
		background-color: white;
		padding: 0 20rpx;
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.submit-row1-right {
			display: flex;
			align-items: center;

			.submit-row1-right-des {
				display: flex;
				align-items: center;

				.breadcrumb-item:not(:first-child)::before {
					content: '>';
					margin-left: 15rpx;
				}

			}
		}
	}
</style>