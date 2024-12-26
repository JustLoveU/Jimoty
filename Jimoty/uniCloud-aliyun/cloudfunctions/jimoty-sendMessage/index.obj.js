// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database()
const temp1 = 'Hj-PTOFbLQZgsOxW2kqp_nRv-12-ge-U9_LFWdpxN5U' // 发送聊天消息
const temp2 = '36PabfYsD6cufE_NxI1oq1Mnz2M-ogVyN57WXroeHCs' // 发送关注消息
const temp3 = 'ZZDTdu1fthiNFaAonji8dpxno8uQ21p6DVIzyudvTrY' // 发送评价消息
const temp4 = 'MZUD7HMhQl3m-0d_H74PgxXsmCwhEeIW4kXlCrjVuUQ' // 发送商品上新消息
const temp5 = 'rmH9CpGtyiyJGhNPlOcgqgHm-dPSQllKX_0isZRlvAI' // 发送交易状态消息

const APPID = 'wx593287587cccdf0f'
let ACCESS_TOKEN = ''

const currentDate = new Date()

module.exports = {
	_before: function() { // 通用预处理器

	},

	/* 
	当前仅实现推送，可根据需求修改功能
	 */

	/**
	 * @description 发送聊天消息
	 */
	async sendMessage1(userId, des, path = 'pages/home/home') {
		console.log('开始发送模版消息', des)
		let TOUSER = ''
		let ACCESS_TOKEN = ''
		ACCESS_TOKEN = await getToken()
		TOUSER = await getOpenid(userId)
		try {
			if (TOUSER !== '' && ACCESS_TOKEN !== '') {
				const res = await uniCloud.request({
					url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`,
					method: 'POST',
					data: {
						touser: TOUSER,
						template_id: temp1,
						miniprogram: {
							'appid': APPID,
							'pagepath': path
						},
						data: {
							'thing3': { 'value': des },
							'time6': { 'value': formatDate(currentDate) },
						}
					}
				})
				console.log('发送模板消息成功', res)

			} else {
				console.log('开始发送模版消息失败')
			}
		} catch (e) {
			//TODO handle the exception
			console.log('#####', e)
			return '发送失败'
		}

		return '发送成功'

	},

	/**
	 * @description 发送关注消息
	 */
	async sendMessage2(userId, des, path = 'pages/home/home') {
		console.log('开始发送模版消息', des)
		let TOUSER = ''
		let ACCESS_TOKEN = ''
		ACCESS_TOKEN = await getToken()
		TOUSER = await getOpenid(userId)
		try {
			if (TOUSER !== '' && ACCESS_TOKEN !== '') {
				const res = await uniCloud.request({
					url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`,
					method: 'POST',
					data: {
						touser: TOUSER,
						template_id: temp1,
						miniprogram: {
							'appid': APPID,
							'pagepath': path
						},
						data: {
							'thing3': { 'value': des },
							'time6': { 'value': formatDate(currentDate) },
						}
					}
				})
				console.log('发送模板消息成功', res)

			} else {
				console.log('开始发送模版消息失败')
			}
		} catch (e) {
			//TODO handle the exception
			console.log('#####', e)
			return '发送失败'
		}

		return '发送成功'
	},


	/**
	 * @description 发送评价消息
	 */
	async sendMessage3(userId, des, path = 'pages/home/home') {
		console.log('开始发送模版消息', des)
		let TOUSER = ''
		let ACCESS_TOKEN = ''
		ACCESS_TOKEN = await getToken()
		TOUSER = await getOpenid(userId)
		try {
			if (TOUSER !== '' && ACCESS_TOKEN !== '') {
				const res = await uniCloud.request({
					url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`,
					method: 'POST',
					data: {
						touser: TOUSER,
						template_id: temp1,
						miniprogram: {
							'appid': APPID,
							'pagepath': path
						},
						data: {
							'thing3': { 'value': des },
							'time6': { 'value': formatDate(currentDate) },
						}
					}
				})
				console.log('发送模板消息成功', res)

			} else {
				console.log('开始发送模版消息失败')
			}
		} catch (e) {
			//TODO handle the exception
			console.log('#####', e)
			return '发送失败'
		}

		return '发送成功'
	},

	/**
	 * @description 发送商品上新消息
	 */
	async sendMessage4(userId, des, path = 'pages/home/home') {
		console.log('开始发送模版消息', des)
		let TOUSER = ''
		let ACCESS_TOKEN = ''
		ACCESS_TOKEN = await getToken()
		TOUSER = await getOpenid(userId)
		try {
			if (TOUSER !== '' && ACCESS_TOKEN !== '') {
				const res = await uniCloud.request({
					url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`,
					method: 'POST',
					data: {
						touser: TOUSER,
						template_id: temp1,
						miniprogram: {
							'appid': APPID,
							'pagepath': path
						},
						data: {
							'thing3': { 'value': des },
							'time6': { 'value': formatDate(currentDate) },
						}
					}
				})
				console.log('发送模板消息成功', res)

			} else {
				console.log('开始发送模版消息失败')
			}
		} catch (e) {
			//TODO handle the exception
			console.log('#####', e)
			return '发送失败'
		}

		return '发送成功'
	},


	/**
	 * @description 发送交易状态消息
	 */
	async sendMessage5(userId, des, path = 'pages/home/home') {
		console.log('发送模版消息')
		let TOUSER = ''
		let ACCESS_TOKEN = ''
		ACCESS_TOKEN = await getToken()
		TOUSER = await getOpenid(userId)
		try {
			if (TOUSER !== '' && ACCESS_TOKEN !== '') {
				const res = await uniCloud.request({
					url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`,
					method: 'POST',
					data: {
						touser: TOUSER,
						template_id: temp5,
						miniprogram: {
							'appid': APPID,
							'pagepath': path
						},
						data: {
							'thing1': { 'value': des },
							'time3': { 'value': formatDate(currentDate) },
						}
					}
				})
				console.log('发送模板消息成功', res)

			} else {
				console.log('开始发送模版消息失败')
			}

		} catch (e) {
			//TODO handle the exception
			return '发送失败'
		}


		return '发送成功'
	}


}

// 获取ACCESS_TOKEN
const getToken = async userId => {
	try {
		const res = await db.collection('jimoty-token').get()
		ACCESS_TOKEN = res.data[0].access_token

		return res.data[0].access_token
	} catch (e) {
		//TODO handle the exception
		return ''
	}

}

// 获取对象的openid
const getOpenid = async userId => {
	try {
		const res = await db.collection('uni-id-users').doc(userId).get()
		if (res.data[0].wx_unionid) {
			const data = await db.collection('jimoty-gong-user').where({ UnionID: res.data[0].wx_unionid })
				.get()
			return data.data[0].gongOpenId
		} else {
			return ''
		}

	} catch (e) {
		//TODO handle the exception
		return ''
	}

}

// 格式化时间
function formatDate(date) {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，所以需要+1
	const day = String(date.getDate()).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')

	return `${year}年${month}月${day}日 ${hours}:${minutes}`
}