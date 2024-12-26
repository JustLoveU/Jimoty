'use strict'
const db = uniCloud.database()

let ACCESS_TOKEN = ''
db.collection('jimoty-token').get().then(tokenData => {
	ACCESS_TOKEN = tokenData.data[0].access_token
})
const currentDate = new Date()

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	let result = ''

	const postId = event.postId
	const userId = event.userId

	// const postId = '67419fb8fe975f27663ce11c'
	// const userId = '67429178bd0220786db0810b'
	if (postId === '' && userId === '') {
		return '该帖子错误---' + postId + '----' + userId
	}

	// 创建商品上架消息
	// 通知类型(0系统消息1聊天消息2关注消息,3评论消息,4收藏消息5.关注用户上架商品消息,6商品上架消息)

	// 用户发贴，follow接收消息
	const followres = await db.collection('jimoty-follow').where({ friend_uid: userId }).get()
	let num = 0

	for (let i = 0; i < followres.data.length; i++) {
		db.collection('jimoty-notice').add({
			sendPeople: userId,
			receive: followres.data[i].follow_uid,
			message: postId,
			type: 5,
			status: false,
			create_date: Date.now()
		})
		await sendMessage(followres.data[i].follow_uid, '有一条上新通知')
		num++
	}

	result = result + `--发送给(${num})个粉丝--发送模版消息成功`

	// 根据检索条件给用户发消息
	const postData = await db.collection('jimoty-post').doc(postId).get()
	// 获得所有人的保存通知条件
	const res2 = await db.collection('jimoty-search').get()

	let categoryId = postData.data[0].category
	const res3 = await db.collection('jimoty-category').doc(categoryId).get()

	// 先判断当前该类别
	let needSendUser = []
	// && getDistance(postData.data[0].point,item.point) <= item.length  判断距离也在范围之内
	if (res2.data.length > 0) {
		res2.data.forEach(async item => {
			if (item.text_condition) {
				if ((item.category_condition === postData.data[0].category || res3.data[0]
						.parent_id ===
						item
						.category_condition) && getDistance(postData.data[0].point, item
						.positon_condition
						.point, item.positon_condition.length) && checkStr(postData.data[0]
						.noteTitle,
						item.text_condition)) {
					needSendUser.push({
						_id: item._id,
						point: item.positon_condition.point,
						length: item.positon_condition.length,
						category_condition: item.category_condition,
						userId: item.userId
					})
				}

			} else {
				if ((item.category_condition === postData.data[0].category || res3.data[0]
						.parent_id ===
						item
						.category_condition) && getDistance(postData.data[0].point, item
						.positon_condition
						.point, item.positon_condition.length)) {
					needSendUser.push({
						_id: item._id,
						point: item.positon_condition.point,
						length: item.positon_condition.length,
						category_condition: item.category_condition,
						userId: item.userId
					})
				}

			}

		})
	}

	// 去重
	needSendUser = needSendUser.filter((item, index) => needSendUser.indexOf(item) === index)

	// 发送消息给用户
	let num1 = 0
	if (needSendUser.length > 0) {
		needSendUser.forEach(async item => {
			if (userId !== item.userId) {
				let data = {
					type: 6,
					sendPeople: userId,
					receive: item.userId,
					otherMessage: item.category_condition,
					message: postId, //检索的条件
					status: false,
					create_date: Date.now()
				}

				db.collection('jimoty-notice').add(data)

				await sendMessage(item.userId, '有一条上新通知')
			}
			num1++
		})
	}

	console.log('发送通知消息', needSendUser.length, '条', num1)
	result = result + '--群发检索消息成功--'


	//返回数据给客户端
	console.log(result)
	return null
}


// 获取两点间的距离
function getDistance(coord1, coord2, length) {
	try {
		var R = 6371e3 // 地球半径，单位：米
		var radLat1 = coord1[1] * Math.PI / 180.0
		var radLat2 = coord2[1] * Math.PI / 180.0
		var a = radLat1 - radLat2
		var b = (coord1[0] * Math.PI / 180.0) - (coord2[0] * Math.PI / 180.0)
		var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math
			.cos(
				radLat2) * Math.pow(Math.sin(b / 2), 2)))
		distance = distance * R
		if (distance <= length) {
			return true
		} else {
			return false
		}


	} catch (e) {
		//TODO handle the exception
		return false
	}

}

// 判断字符串是否存在
function checkStr(str1, str2) {
	if (str1.search(str2) !== -1) {
		return true
	} else {
		return false
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

// 发送模版消息
async function sendMessage(userId, des) {
	console.log('发送模板消息', userId)
	try {
		let TOUSER = ''
		const userIdData = await db.collection('uni-id-users').where({ _id: userId }).get()
		const data1 = await db.collection('jimoty-gong-user').where({
			UnionID: userIdData.data[0]
				.wx_unionid
		}).get()
		if (data1.data[0]) {
			TOUSER = data1.data[0].gongOpenId
		}
		if (ACCESS_TOKEN !== '' && TOUSER !== '') {

			await uniCloud.request({
				url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`,
				method: 'POST',
				data: {
					touser: TOUSER,
					template_id: 'Hj-PTOFbLQZgsOxW2kqp_nRv-12-ge-U9_LFWdpxN5U',
					miniprogram: { 'appid': 'wx593287587cccdf0f' },
					data: {
						'thing3': { 'value': des },
						'time6': { 'value': formatDate(currentDate) },
					}
				}
			})
			console.log('发送成功！')

		} else {
			console.log('不用发模版消息')
		}

	} catch (e) {
		//TODO handle the exception
		console.log('发送模板消息失败！', e)
	}



}