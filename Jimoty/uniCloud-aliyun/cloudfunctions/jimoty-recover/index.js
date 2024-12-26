'use strict'
const db = uniCloud.database()
const dbcmd = db.command
const xitong = '66f190b0286f7cec14cf4f62' // 系统审核员
exports.main = async (event, context) => {

	let date = Date.now() - 1000 * 60 * 60 * 24 * 90

	// 回收机制如果帖子发布超过90天且没有被购买则删帖
	const res = await db.collection('jimoty-post').where({
		create_date: dbcmd.lt(date),
		status: 2,
		delete: 1
	}).get()


	const postArr = res.data.map(item => {
		return item._id
	})

	await db.collection('jimoty-post').where({ _id: dbcmd.in(postArr) }).remove()

	let num = 0
	// 发送一条推送消息
	res.data.forEach(item => {
		db.collection('jimoty-notice').add({
			type: 7,
			sendPeople: xitong,
			receive: item.userId,
			message: item._id,
			otherMessage: '您的帖子超过3个月未出售,已被自动下架,详情请点击...',
			status: false,
			create_date: Date.now()
		})
		num++
	})

	console.log('回收过期帖子 ', num, ' 条')
	//返回数据给客户端
	return '回收过期帖子'
}