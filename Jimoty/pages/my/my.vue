<script setup>
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	import callCheckVersion from '@/uni_modules/uni-upgrade-center-app/utils/call-check-version';
	import { verifyName } from '@/utils/verifyName.js'
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	import { ref, computed, onMounted } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app'
	const db = uniCloud.database()
	const uid = uniCloud.getCurrentUserInfo().uid

	const isApple = ref(false)
	onLoad(() => {
		let brand = uni.getDeviceInfo().deviceBrand
		console.log('########获取设备', brand);
		if (brand == 'iphone') {
			isApple.value = true
		}

	})


	const userInfo = computed(() => {
		return store.userInfo
	})


	const hasLogin = computed(() => {
		return store.hasLogin
	})

	// 列表一
	const ucenterList1 = ref([{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/tiezi.png',
			text: '帖子列表',
			to: `/pages/my/draft?index=${0}`
		},
		{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/caogao.png',
			text: '我的草稿',
			to: `/pages/my/draft?index=${1}`
		}
	])

	// 列表二
	const ucenterList2 = ref([{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/shoucang.png',
			text: '收藏夹',
			to: '/pages/my/collect'
		},
		{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/lishi.png',
			text: '浏览记录',
			to: `/pages/my/draft?index=${2}`
		},
		{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/mysearch.png',
			text: '设置保存的新通知',
			to: '/pages/my/notice'
		}
	])

	// 列表三
	const ucenterList3 = ref([{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/购物车空.png',
			text: '我的收获',
			to: '/pages/my/buy'
		}, {
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/bi.png',
			text: '市级特权',
			to: '/pages/my/member'
		},
		{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/p.png',
			text: '我的积分',
			to: '/pages/my/point'
		},
		{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/zhanghu.png',
			text: '账户设置',
			to: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
		},
		{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/pingjia.png',
			text: '我的评价',
			to: '/pages/my/comment'
		},
		{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/guanzhu.png',
			text: '关注列表',
			to: '/pages/my/follow'
		}
	])

	// 列表三
	const ucenterList5 = ref([{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/购物车空.png',
			text: '我的收获',
			to: '/pages/my/buy'
		},
		{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/bi.png',
			text: '市级特权',
			to: '/pages/my/member'
		},
		{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/zhanghu.png',
			text: '账户设置',
			to: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
		},
		{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/pingjia.png',
			text: '我的评价',
			to: '/pages/my/comment'
		},
		{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/guanzhu.png',
			text: '关注列表',
			to: '/pages/my/follow'
		}
	])

	// 列表四
	const ucenterList4 = ref([

		{
			icon: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/feedBack.png',
			text: '意见反馈',
			to: '/pages/my/feedBack'
		}
	])

	// 前往登录
	const toUserInfo = () => {
		uni.navigateTo({
			url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
		})
	}

	// 前往主页
	const toMyDetail = () => {
		uni.navigateTo({
			url: `/pages/my/myDetail?userId=${uid}`
		})
	}
</script>


<template>
	<view class="center">
		<view class="userInfo">
			<cloud-image width="150rpx" height="150rpx" @tap.capture="toMyDetail"
				v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url"
				:src="userInfo.avatar_file.url"></cloud-image>

			<view v-else class="defaultAvatarUrl">
				<uni-icons color="#ffffff" size="50" type="person-filled" />
			</view>

			<view class="logo-title">
				<view class="uer-name" v-if="hasLogin">
					<view class="uer-name-top">
						{{userInfo.nickname}}
					</view>
					<view class="uer-name-bottom">
						<!-- 12321312321@qq.com	 -->
					</view>
				</view>
				<view class="uer-name" @tap.capture="toUserInfo" v-else>用户未登录</view>
			</view>
		</view>

		<view class="center-list">
			<view class="center-list-item">
				<navigator class="center-list-item-row" :url="item.to" v-for="(item,index) in ucenterList1"
					:key="index">
					<view class="center-list-item-row-left">
						<image class="center-list-item-row-left-image" :src="item.icon" mode="aspectFill"></image>
						<view class="center-list-item-row-text">
							{{item.text}}
						</view>
					</view>
					<uni-icons type="right" size="26"></uni-icons>
				</navigator>
			</view>

			<view class="center-list-item">
				<navigator class="center-list-item-row" :url="item.to" v-for="(item,index) in ucenterList2"
					:key="index">
					<view class="center-list-item-row-left">
						<image class="center-list-item-row-left-image" :src="item.icon" mode="aspectFill"></image>
						<view class="center-list-item-row-text">
							{{item.text}}
						</view>
					</view>
					<uni-icons type="right" size="26"></uni-icons>
				</navigator>
			</view>

			<view class="center-list-item">
				<navigator class="center-list-item-row" :url="item.to"
					v-for="(item,index) in (isApple ? ucenterList5 : ucenterList3) " :key="index">
					<view class="center-list-item-row-left">
						<image class="center-list-item-row-left-image" :src="item.icon" mode="aspectFill"></image>
						<view class="center-list-item-row-text">
							{{item.text}}
						</view>
					</view>
					<uni-icons type="right" size="26"></uni-icons>
				</navigator>

			</view>

			<view class="center-list-item">
				<button class="center-list-item-row" v-for="(item,index) in ucenterList4" :key="index"
					open-type="contact">
					<view class="center-list-item-row-left">
						<image class="center-list-item-row-left-image" :src="item.icon" mode="aspectFill"></image>
						<view class="center-list-item-row-text">
							{{item.text}}
						</view>
					</view>
					<uni-icons type="right" size="26"></uni-icons>
				</button>

			</view>

		</view>

		<view class="beian">
			<view class="beian-text">
				湘ICP备2023022869号-3X
			</view>
		</view>


	</view>
</template>
<!-- {{userInfo.nickname||userInfo.username||userInfo.mobile}} -->

<style lang="scss">
	.beian {
		padding: 20rpx;
		width: 100%;
		text-align: center;

		.beian-text {
			color: #9e9e9e;
		}
	}

	.center-list {
		.center-list-item {
			margin-top: 30rpx;


			.center-list-item-row {
				width: 100%;
				display: flex;
				padding: 0 20rpx;
				justify-content: space-between;
				height: 100rpx;
				align-items: center;
				border-bottom: 1px solid #e0e0e0;
				background-color: white;

				.center-list-item-row-left {
					display: flex;
					align-items: center;

					.center-list-item-row-left-image {
						width: 50rpx;
						height: 50rpx;
					}

					.center-list-item-row-text {
						margin-left: 30rpx;
						font-size: 30rpx;
					}
				}

			}

		}
	}

	.center {
		flex: 1;
		flex-direction: column;
	}

	.userInfo {
		display: flex;
		// flex-direction: column;
		align-items: center;
		background-color: white;
		padding: 20rpx;
		margin-top: 10rpx;
	}

	.defaultAvatarUrl {
		display: flex;
		width: 150rpx;
		height: 150rpx;
		background-color: #007aff;
		justify-content: center;
		border-radius: 20px;
		align-items: center;
	}

	.logo-title {
		margin-left: 40rpx;

		.uer-name {
			height: 100rpx;

			font-size: 38rpx;
			color: #000;

			.uer-name-top {
				font-size: 30rpx;
				font-weight: 600;
				line-height: 50rpx;
			}

			.uer-name-bottom {
				font-size: 26rpx;
			}
		}
	}
</style>