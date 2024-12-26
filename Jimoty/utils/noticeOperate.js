const db = uniCloud.database()
const dbcmd = db.command
const uid = uniCloud.getCurrentUserInfo().uid

export function makeNotice(sendPeople, receive, type = 0, message = '', otherMessage = '') {
	// 创建消息
	// 通知类型(0系统消息1聊天消息2关注消息,3评论消息,4收藏消息5.商品上架消息)
	try {
		db.collection('jimoty-notice').add({
			sendPeople,
			receive,
			message,
			otherMessage,
			type
		})
	} catch (e) {
		//TODO handle the exception
		console.log('参数错误')
	}

}


export function removeNotice(sendPeople, receive, type = 0, message = '') {
	// 创建消息
	// 通知类型(0系统消息1聊天消息2关注消息,3评论消息,4收藏消息5.商品上架消息)
	db.collection('jimoty-notice').where({
		sendPeople,
		receive,
		type,
		message
	}).remove()
}