<template>
	<view class="container">


		<uni-load-more status="loading" v-if="ifLoding" />

		<view class="categery-body" v-else>
			<view class="breadcrumb">
				<view class="breadcrumb-item" v-for="(item,index) in breadcrumbArr" :key="index" @tap="navBack(index)">
					<text style="padding-left: 15rpx;">{{item.name}}</text>
				</view>

				<view class="over" v-if="topclass">
					<button size="mini" @tap="getOver" type="primary">完成</button>
				</view>
			</view>

			<view class="categery">
				<view class="categery-item" v-for="(item,index) in needShow" :key="index"
					@tap="toggleChildren(item.children ?item.children:[] ,item.name,item._id)">
					<view class="categery-item-left">
						<view class="categery-item-left-text-title">
							{{item.name}}
						</view>

					</view>
					<uni-icons type="right" size="24"></uni-icons>
				</view>
			</view>

		</view>


	</view>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { onLoad, onHide } from '@dcloudio/uni-app'
	let db = uniCloud.database()

	// 面包屑
	const breadcrumbArr = ref([])

	// 需要展示的类目数据
	const needShow = ref([])

	const ifLoding = ref(true)

	// 记录需要返回的数据
	const rebackData = ref([])

	const topclass = ref(false)

	const overId = ref()

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


	onLoad(async (e) => {
		console.log(e.index, 'llllllllllllllllLLLLLLLLLLLLL', e.parentId);
		if (e.index == "1") {
			console.log('地图获取数据');
			topclass.value = true
		} else {
			console.log('投稿获取数据');
			topclass.value = false
		}

		if (topclass.value) {
			db.collection('jimoty-category').field('_id,name').get({
				getTree: {
					limitLevel: 1
				}
			}).then(res => {
				needShow.value = [...res.result.data]
				let nowData = {
					name: '首页',
					data: [...needShow.value]
				}
				breadcrumbArr.value.push(nowData)
			})
		} else {

			const res = await db.collection('jimoty-category').field('_id,name')
				.get({ getTree: { startWith: `_id=="${e.parentId}"`, limitLevel: 10 } })
			needShow.value = res.result.data[0].children
			let nowData = {
				name: '首页',
				data: [...needShow.value]
			}
			breadcrumbArr.value.push(nowData)


		}
		ifLoding.value = false
	})

	// 直接完成
	function getOver() {
		let data = {
			categery: rebackData.value,
			id: overId.value
		}
		if (topclass.value) {
			uni.$emit('categerySearchData', data)

		} else {
			uni.$emit('categeryData', data)
		}
		uni.navigateBack()
	}


	// 打开其子数据
	const ifoperate2 = ref(false)
	const toggleChildren = (data, name, id) => {
		if (ifoperate2.value) return
		ifoperate2.value = true
		overId.value = id
		if (data.length > 0) {
			needShow.value = data
			let nowData = {
				name: name,
				data: [...data]
			}
			rebackData.value.push(name)
			breadcrumbArr.value.push(nowData)
			console.log(rebackData.value, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
		} else {
			// 没有子数据
			rebackData.value.push(name)
			let data = {
				categery: rebackData.value,
				id: id
			}
			if (topclass.value) {
				uni.$emit('categerySearchData', data)

			} else {
				uni.$emit('categeryData', data)

			}
			uni.navigateBack()

		}
		ifoperate2.value = false
	}




	const ifoperate = ref(false)
	const navBack = (index) => {

		if (ifoperate.value) return
		ifoperate.value = true
		breadcrumbArr.value.splice(index + 1, breadcrumbArr.value.length - index - 1)

		rebackData.value.splice(index, rebackData.value.length)

		needShow.value = breadcrumbArr.value[index].data
		ifoperate.value = false
		console.log(index, 'oooo', rebackData.value);
	}
</script>

<style lang="scss">
	.categery {
		padding: 20rpx;
		background-color: white;

	}

	.categery-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		border-bottom: 1px solid rgb(195, 195, 195);

		.categery-item-left {
			display: flex;
			align-items: center;

			.categery-item-left-icon {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
			}


			.categery-item-left-text-title {
				font-weight: 600;
				font-size: 30rpx;
			}

		}
	}

	.breadcrumb {
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		background-color: white;
		position: relative;

		.over {
			position: absolute;
			right: 30rpx;
		}

		.breadcrumb-item {
			position: relative;
			font-size: 24rpx;
			color: #5b5b5b;
			line-height: 50rpx;
			text-align: right;
		}

		.breadcrumb-item:not(:first-child)::before {
			content: '>';
			margin-left: 15rpx;
		}

		.breadcrumb-item:last-child {
			color: rgb(91, 160, 202);
		}
	}
</style>