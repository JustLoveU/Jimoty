<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app'
	const db = uniCloud.database()


	onLoad((e) => {
		if (e) {
			getData(e.postId)
		} else {
			uni.navigateBack()
		}
	})

	const forData = ref()
	async function getData(postId) {
		const res = await db.collection('jimoty-post').doc(postId).get({ getOne: true })
		const res2 = await db.collection('jimoty-category').get({
			getTreePath: {
				limitLevel: 10,
				"startWith": `_id == "${res.result.data.category}"`
			}
		})
		forData.value = res.result.data
		forData.value.time = formatTime(res.result.data.create_date)
		forData.value.categoryNmae = res2.result.data[0].name
	}

	function formatTime(timestamp) {
		// 创建一个新的Date对象
		let date = new Date(timestamp);

		// 获取年、月、日、时、分
		let year = date.getFullYear();
		let month = date.getMonth() + 1; // getMonth()返回的月份是从0开始的，所以需要+1
		let day = date.getDate();
		let hour = date.getHours();
		let minute = date.getMinutes();

		// 格式化输出
		return year + '-' + month + '-' + day + ' ';
	}

	function handleLongPress() {
		let data = '标题：' + forData.value.noteTitle + '\n' + '投稿ID：' + forData.value._id + '\n' + '初次投稿日期：' + forData.value
			.time + '\n' +
			'内容：' + forData.value.mainText + '\n' + '上传地点：' + forData.value.location.province + '\n' + '类别：' + forData
			.value.categoryNmae

		uni.setClipboardData({
			data: data,
			success: () => {
				uni.showToast({
					title: '复制成功',
					icon: 'success'
				});
			},
			fail: (err) => {
				console.error('复制失败', err);
			}
		});
	}
</script>

<template>
	<view class="container" v-if="forData">
		<uni-section class="mb-10" title="本平台依据投稿协议中，对已满3个月期限的下述帖子进行了自动删除，无法恢复。" type="line"></uni-section>

		<view class="post-data" @longpress="handleLongPress">
			<view>
				-------------------------
			</view>
			<uni-list-item :title="`标题：${forData.noteTitle}`" />

			<uni-list-item :title="`投稿ID：${forData._id}`" />

			<uni-list-item :title="`初次投稿日期：${forData.time}`" />

			<uni-list-item :title="`内容：${forData.mainText}`" />

			<uni-list-item :title="`上传地点：${forData.location.province}`" />

			<uni-list-item :title="`类别：${forData.categoryNmae}`" />

			<view>
				-------------------------
			</view>
		</view>

		<uni-section class="mb-10" title="若您同意通过本平台进行公益捐赠，请复制上述帖子信息联系客服(HyperLink 跳转客服页面)。" type="line"></uni-section>

		<button type="primary" open-type="contact">联系客服</button>
	</view>
</template>



<style lang="scss" scoped>
	.post-data {
		padding: 20rpx;
		background-color: white;
	}
</style>