<template>
	<view class="container">

		<view class="map-wrapper">
			<map class="Mymap" :longitude="longitude" :latitude="latitude" :scale="14" :markers="covers"
				@tap="getLocation" @markertap="markerclick"></map>
			<view class="map-btu" @tap.capture="rebackLocation">
				<image class="map-btu-img" src="../../static/my/dingwei.png" mode="aspectFill"></image>
			</view>
		</view>

		<view class="home-search" v-if="FromIndex">
			<view class="home-search-des">
				请选择搜索的范围(单位为km)
			</view>
			<view class="home-search-box">
				<yichan-movable-area :min=1 :max=30 :defaultValue='searchLong' @change="homesearch" />
			</view>
		</view>

		<view class="location-input">
			<view class="location-input-des">
				填写具体地址信息:省+市+区+街道+门牌号
			</view>
			<uni-easyinput v-model="locationName" @confirm="searchAddress" suffixIcon="search"
				@iconClick="searchAddress" />
			<view class="location-input-btu" @click="setLocation">
				确认位置
			</view>
		</view>
	</view>
</template>

<script setup>
	import { onMounted, ref, nextTick } from 'vue';
	import { onLoad } from '@dcloudio/uni-app'

	const id = ref(0) // 使用 marker点击事件 需要填写id
	const latitude = ref(28.135795)
	const longitude = ref(113.03853)
	const covers = ref([{
		id: 187220,
		latitude: latitude.value,
		longitude: longitude.value,
		iconPath: '/static/submit/location.png',
		width: 30,
		height: 30,
	}])

	const controls = ref([{
		iconPath: '../../static/my/dingwei.png',
		clickable: true
	}])

	const cityText = ref('');
	const locationName = ref('');
	const GDkey = '5a1b7f0c30df0aac815403ea512b3d32'
	const FromIndex = ref(false)

	const searchLong = ref(0)

	onLoad((e) => {
		console.log(e, e.index == "1");
		if (e.index == "1") {
			FromIndex.value = true
		} else {
			FromIndex.value = false
		}

		let location = uni.getStorageSync('HistoryCity')
		if (location) {
			latitude.value = location.latitude
			longitude.value = location.longitude
			searchLong.value = location.length / 1000

			covers.value[0].latitude = latitude.value
			covers.value[0].longitude = longitude.value
		}

	})

	function rebackLocation() {
		console.log('####');
		wx.getLocation({
			type: 'wgs84',
			success: function(data) {
				console.log('当前位置的经度：' + data.longitude)
				console.log('当前位置的纬度：' + data.latitude)
				longitude.value = Number(data.longitude.toFixed(6))
				latitude.value = Number(data.latitude.toFixed(6))

				uni.request({
					url: `https://restapi.amap.com/v3/geocode/regeo?location=${longitude.value},${latitude.value}&key=5a1b7f0c30df0aac815403ea512b3d32&extensions=base`,
					success(res) {

						cityText.value = res.data.regeocode.addressComponent.province
						locationName.value = res.data.regeocode.formatted_address
						covers.value[0].latitude = latitude.value
						covers.value[0].longitude = longitude.value

					}
				})
			}
		})
	}

	function homesearch(e) {
		// 选择的距离
		searchLong.value = e
	}

	function markerclick(e) {
		console.log(e.detail, 'oooooooooo');
	}

	function searchAddress() {
		// 调用地图API搜索地址并更新经纬度
		// 示例代码，实际使用时需要替换为真实的地图API调用

		if (locationName.value == '') {
			uni.showToast({
				title: '请输入搜索的地址',
				icon: 'none'
			})
		} else {
			uni.request({
				url: `https://restapi.amap.com/v3/geocode/geo?key=${GDkey}&address=${locationName.value}&city=`,
				success(res) {
					console.log(res, 'pppp');
					let arr = res.data.geocodes[0].location.split(',')
					latitude.value = arr[1]
					longitude.value = arr[0]
					cityText.value = res.data.geocodes[0].city

					covers.value[0].latitude = latitude.value
					covers.value[0].longitude = longitude.value


				}
			})
		}
	}

	function getLocation(e) {
		uni.showLoading({
			mask: true,
			title: '获取位置中'
		})
		latitude.value = e.detail.latitude
		longitude.value = e.detail.longitude

		let location = e.detail.longitude + ',' + e.detail.latitude
		uni.request({
			url: `https://restapi.amap.com/v3/geocode/regeo?key=${GDkey}&location=${location}&extensions=base&roadlevel=0`,
			success(res) {
				console.log(res, 'aa');
				locationName.value = res.data.regeocode.formatted_address
				cityText.value = res.data.regeocode.addressComponent.city

				covers.value[0].latitude = latitude.value
				covers.value[0].longitude = longitude.value
			},
			fail(e) {
				uni.showToast({
					title: '获取位置失败',
					icon: 'none'
				})
				uni.hideLoading()
			}
		})
		uni.hideLoading()
	}

	function setLocation() {
		// 设置位置后的操作，例如更新地图中心点等	
		if (locationName.value != '') {
			uni.showLoading({
				mask: true,
				title: '获取位置中'
			})
			uni.request({
				url: `https://restapi.amap.com/v3/geocode/geo?key=${GDkey}&address=${locationName.value}&city=`,
				success(res) {
					let arr = res.data.geocodes[0].location.split(',')
					cityText.value = res.data.geocodes[0].city
					let data = {
						latitude: arr[1],
						longitude: arr[0],
						address: locationName.value,
						province: cityText.value,
						length: searchLong.value * 1000
					}

					if (FromIndex.value) {
						console.log('主页');
						uni.$emit('mapDataHome', data)
					} else {
						console.log('投稿页');
						uni.$emit('mapData', data)
					}
					uni.navigateBack()
				},
				fail(e) {
					uni.showToast({
						title: '获取位置失败',
						icon: 'none'
					})
					uni.hideLoading()
				}
			})
			uni.hideLoading()
		} else {
			uni.showToast({
				title: '请填写城市和地址',
				icon: 'none'
			})
		}



	}
</script>

<style scoped lang="scss">
	.container {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		height: 100%;
		padding-bottom: 50rpx;
	}

	.home-search {
		padding: 40rpx 40rpx 30rpx 40rpx;
		background-color: white;

		.home-search-des {
			font-size: 30rpx;
			font-weight: 600;
			padding: 20rpx 0;
		}

		.home-search-box {}
	}

	.Mymap {
		width: 100%;
		height: 65vh;
	}

	.map-btu {
		position: absolute;
		right: 50rpx;
		bottom: 50rpx;
		width: 60rpx;
		height: 60rpx;
		z-index: 10;

		.map-btu-img {
			width: 60rpx;
			height: 60rpx;
		}
	}

	.search-bar {
		display: flex;
		justify-content: space-between;
		padding: 20px;
	}

	.map-wrapper {
		height: 65vh;
		position: relative;
	}

	.location-input {
		padding: 20px;
		padding-bottom: 60rpx;

		.location-input-des {
			font-size: 30rpx;
			font-weight: 600;
			padding: 20rpx 0;
		}

		.location-input-btu {
			margin-top: 20rpx;
			width: 100%;
			padding: 20rpx;
			background-color: rgb(33, 159, 98);
			color: white;
			text-align: center;
			border-radius: 10rpx;

			&:active {
				opacity: 0.7;
			}
		}
	}
</style>