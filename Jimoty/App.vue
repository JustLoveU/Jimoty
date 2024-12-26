<script>
	import initApp from '@/common/appInit.js';
	import openApp from '@/common/openApp.js';
	import { getLocalMap } from '@/utils/getLocalMap.js'
	import { verifyName } from '@/utils/verifyName.js'
	// #ifdef H5
	openApp() //创建在h5端全局悬浮引导用户下载app的功能
	// #endif
	import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	export default {
		globalData: {
			searchText: '',
			appVersion: {},
			config: {},
			$i18n: {},
			$t: {}
		},
		onLaunch: async function() {
			console.log('App Launch')
			this.globalData.$i18n = this.$i18n
			this.globalData.$t = str => this.$t(str)

			// 获取当前位置的ip
			getLocalMap()
			console.log('获取地理位置');
			// 判断用户是否禁用，禁用则退出登录
			if (store.hasLogin) {
				const db = uniCloud.database()
				const res = await db.collection('uni-id-users').doc(uniCloud.getCurrentUserInfo().uid).field('status')
					.get({ getOne: true })
				if (res.result.data.status && res.result.data.status == 1) {
					uni.showToast({
						title: '该账号已被禁用',
						icon: 'error'
					})
					setTimeout(() => {
						mutations.logout()
					}, 800)

				}
			}

			initApp();
			uniIdPageInit()

			// #ifdef APP-PLUS
			//checkIsAgree(); APP端暂时先用原生默认生成的。目前，自定义方式启动vue界面时，原生层已经请求了部分权限这并不符合国家的法规
			// #endif

			// #ifdef H5
			// checkIsAgree(); // 默认不开启。目前全球，仅欧盟国家有网页端同意隐私权限的需要。如果需要可以自己去掉注视后生效
			// #endif

			// #ifdef APP-PLUS
			//idfa有需要的用户在应用首次启动时自己获取存储到storage中
			/*var idfa = '';
			var manager = plus.ios.invoke('ASIdentifierManager', 'sharedManager');
			if(plus.ios.invoke(manager, 'isAdvertisingTrackingEnabled')){
				var identifier = plus.ios.invoke(manager, 'advertisingIdentifier');
				idfa = plus.ios.invoke(identifier, 'UUIDString');
				plus.ios.deleteObject(identifier);
			}
			plus.ios.deleteObject(manager);
			console.log('idfa = '+idfa);*/
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	page {
		/* background-color: #f3f3f3; */
		background-color: $uni-bg-color;
		height: 100vh;
	}

	view,
	navigator,
	input,
	scroll-view {
		box-sizing: border-box;
		font-size: 26rpx;
	}

	button::after {
		border: none;
	}

	swiper,
	scroll-view {
		flex: 1;
		height: 100%;
		overflow: hidden;
	}

	image {
		width: 100%;
		height: 100%;
		vertical-align: middle;
	}

	/* 两行省略 */
	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>