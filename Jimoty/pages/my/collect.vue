<template>
	<view class="container">

		<view v-if="!loading">
			<homeGoods :data='localData'></homeGoods>
			<!-- 		<uni-load-more :status="loading ? 'loading' :'no-more'" /> -->
		</view>


		<uni-load-more v-else status="loading" />


	</view>
</template>

<script setup>
	import { ref, defineProps, computed, onMounted, nextTick } from 'vue';
	import { onLoad, onPullDownRefresh, onReachBottom, onReady } from '@dcloudio/uni-app'

	// 渲染的数据
	const localData = ref([])
	let collectArr = []
	const loading = ref(true)



	let db = uniCloud.database()
	let dbCmd = db.command
	const uid = uniCloud.getCurrentUserInfo().uid

	onReady(async () => {
		const res = await db.collection('jimoty-collect').where({ user_id: uid }).field('post_id').get()

		collectArr = res.result.data.map((item) => {
			return item.post_id
		})
		console.log(collectArr, 'mmmmmmmmmmm', uid);
		loadData()
	})



	async function loadData() {
		const temp1 = db.collection('jimoty-post').where({ _id: dbCmd.in(collectArr) }).field(
			'_id,userId,type,photos,location,noteTitle,mainText,postPrice,status,delete,collect,create_date,workTime,workPosition,employeeForm,category,browse'
		).getTemp()
		const temp2 = db.collection('jimoty-collect').field('_id,post_id,user_id,clickTime').getTemp()
		const temp3 = db.collection('jimoty-category').field('_id,name,parent_id').getTemp()
		const res = await db.collection(temp1, temp2, temp3).where({
			status: db.command.in([2, 5]),
			delete: 1
		}).skip(localData.value
			.length).limit(10).get()
		console.log(res.result.data, 'aaaaaaaaaaaaaaaaaaaaaaa');
		handleSuccess(res.result.data)
	}

	onMounted(() => {
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
	})


	async function handleSuccess(e) {

		localData.value = [...localData.value, ...e];

		let collectArr = localData.value.map((item) => {
			return item._id._value
		})

		let likeArr = await db.collection('jimoty-collect').where({
			post_id: dbCmd.in(collectArr),
			user_id: uid
		}).get()

		localData.value.forEach((item, index) => {
			let localIndex = likeArr.result.data.findIndex(find => {
				return item._id._value == find.post_id
			})
			if (localIndex !== -1) {
				item.isCollect = true
			}
		})
		console.log(localData.value, 'kkkkkkkkkkkkkkkkk');
		loading.value = false
	}

	onPullDownRefresh(() => {
		localData.value = []
		loadData()
		uni.stopPullDownRefresh()
	})

	onReachBottom(() => {
		loadData()
	})


	function openmap() {
		uni.navigateTo({
			url: '/pages/submit/map'
		})
	}

	function opennotice() {
		uni.navigateTo({
			url: '/pages/home/notice'
		})
	}
</script>

<style lang="scss">

</style>