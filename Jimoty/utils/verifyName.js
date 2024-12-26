const db = uniCloud.database()
const uid = uniCloud.getCurrentUserInfo().uid
import { computed } from 'vue'
import { store } from '@/uni_modules/uni-id-pages/common/store.js'


export function verifyName() {
	let userinfo = uni.getStorageSync('uni-id-pages-userInfo')
	let bool = store.hasLogin
	console.log('验证实名', bool)
	if (bool && userinfo.realNameStatus !== 2) {
		// 没有实名
		uni.navigateTo({ url: '/pages/realAuthentication/realAuthentication' })

	} else if (bool && userinfo.realNameStatus === 3) {
		console.log('认证失败')
		uni.showToast({
			title: '请重新实名认证',
			icon: 'none'
		})
		uni.navigateTo({ url: '/pages/realAuthentication/realAuthentication' })
	} else if (!bool) {
		uni.navigateTo({ url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd' })
	}

}