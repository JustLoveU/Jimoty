const db = uniCloud.database()
const uid = uniCloud.getCurrentUserInfo().uid

const temp1 = 'Hj-PTOFbLQZgsOxW2kqp_nRv-12-ge-U9_LFWdpxN5U' // 发送聊天消息
const temp2 = '36PabfYsD6cufE_NxI1oq1Mnz2M-ogVyN57WXroeHCs' // 发送关注消息
const temp3 = 'ZZDTdu1fthiNFaAonji8dpxno8uQ21p6DVIzyudvTrY' // 发送评价消息
const temp4 = 'MZUD7HMhQl3m-0d_H74PgxXsmCwhEeIW4kXlCrjVuUQ' // 发送商品上新消息
const temp5 = 'rmH9CpGtyiyJGhNPlOcgqgHm-dPSQllKX_0isZRlvAI' // 发送交易状态消息

const APPID = 'wx593287587cccdf0f'

/**
 * @description 发送聊天消息
 */
export async function sendMessage1(userId, des) {
	const ACCESS_TOKEN = await getAccessToken()
	const TOUSER = await getOpenid(userId)
	if (TOUSER === null) return null
	const currentDate = new Date()
	uni.request({
		url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`,
		method: 'POST',
		data: {
			touser: TOUSER,
			template_id: temp1,
			miniprogram: { 'appid': APPID },
			data: {
				'thing3': { 'value': des },
				'time6': { 'value': formatDate(currentDate) },
			}
		}
	}).then(res => {
		console.log('发送模板消息', res)
	})

}

/**
 * @description 发送关注消息
 */
export async function sendMessage2(User) {

	const ACCESS_TOKEN = await getAccessToken()
	const TOUSER = await getOpenid()
	const currentDate = new Date()
	uni.request({
		url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`,
		method: 'POST',
		data: {
			touser: TOUSER,
			template_id: 'Hj-PTOFbLQZgsOxW2kqp_jYoLzzKFWdkZHzdnLmG-lE',
			miniprogram: { 'appid': APPID },
			data: {
				'thing3': { 'value': '充值' },
				'character_string2': { 'value': '2231313131313111' },
				'time6': { 'value': formatDate(currentDate) },
			}
		}
	}).then(res => {
		console.log('发送模板消息', res)
	})

}


/**
 * @description 发送评价消息
 */
export async function sendMessage3() {

	const ACCESS_TOKEN = await getAccessToken()
	const TOUSER = await getOpenid()
	const currentDate = new Date()
	uni.request({
		url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`,
		method: 'POST',
		data: {
			touser: TOUSER,
			template_id: 'Hj-PTOFbLQZgsOxW2kqp_jYoLzzKFWdkZHzdnLmG-lE',
			miniprogram: { 'appid': APPID },
			data: {
				'thing3': { 'value': '充值' },
				'character_string2': { 'value': '2231313131313111' },
				'time6': { 'value': formatDate(currentDate) },
			}
		}
	}).then(res => {
		console.log('发送模板消息', res)
	})

}

/**
 * @description 发送商品上新消息
 */
export async function sendMessage4() {
	const ACCESS_TOKEN = await getAccessToken()
	const TOUSER = await getOpenid()
	const currentDate = new Date()
	uni.request({
		url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`,
		method: 'POST',
		data: {
			touser: TOUSER,
			template_id: 'Hj-PTOFbLQZgsOxW2kqp_jYoLzzKFWdkZHzdnLmG-lE',
			miniprogram: { 'appid': APPID },
			data: {
				'thing3': { 'value': '充值' },
				'character_string2': { 'value': '2231313131313111' },
				'time6': { 'value': formatDate(currentDate) },
			}
		}
	}).then(res => {
		console.log('发送模板消息', res)
	})

}


/**
 * @description 发送交易状态消息
 */
export async function sendMessage5(userId, user) {

	const ACCESS_TOKEN = await getAccessToken()
	const TOUSER = await getOpenid(userId)
	if (TOUSER === null) return null
	const currentDate = new Date()
	uni.request({
		url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`,
		method: 'POST',
		data: {
			touser: TOUSER,
			template_id: temp5,
			miniprogram: { 'appid': APPID },
			data: {
				'thing1': { 'value': user },
				'time3': { 'value': formatDate(currentDate) },
			}
		}
	}).then(res => {
		console.log('发送模板消息', res)
	})

}


// 获取access_token
async function getAccessToken() {
	try {
		// 获取access_token
		const res = await db.collection('jimoty-token').get({ getOne: true })
		return res.result.data.access_token
	} catch (e) {
		//TODO handle the exception
	}
}

// 获取对象的openid
async function getOpenid(userId) {
	try {
		const res = await db.collection('uni-id-users').doc(userId).field('wx_unionid').get({ getOne: true })
		const data = await db.collection('jimoty-gong-user').where({ UnionID: res.result.data.wx_unionid })
			.field('gongOpenId').get({ getOne: true })
		return data.result.data.gongOpenId
	} catch (e) {
		//TODO handle the exception
		return null
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