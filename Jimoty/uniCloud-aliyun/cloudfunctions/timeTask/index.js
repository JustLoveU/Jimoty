'use strict'
const db = uniCloud.database()
const dbcmd = db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)


	// 每隔一小时刷新一次，

	// 查找道具还在使用情况
	const res = await db.collection('jimoty-daoju-use').where({ delete: false }).get()

	// const data = await db.collection('jimoty-daoju-use').where({ end_date: dbcmd.lt(Date.now()) }).get()


	// 判断道具是否过期，过期则取消
	res.data.forEach(async item => {
		if (Date.now() > item.end_date) {

			if (item.daojuType === 1) {
				//1.将高亮到期的取消	
				await db.collection('jimoty-post').doc(item.daojuPostId)
					.update({ hightLight: false })
			} else if (item.daojuType === 0) {
				// 2.取消置顶 回归权重100
				await db.collection('jimoty-post').doc(item.daojuPostId).update({ weight: 100 })
			}
			// 过期
			db.collection('jimoty-daoju-use').doc(item._id).update({ delete: true })

		} else {
			// 没过期
			//3.将需要定时刷新的刷新
			if (item.daojuType === 3) {

				if (Date.now() >= item.update_date && (Date.now() - item.update_date) >= 23 * 60 *
					60 *
					1000) {
					// 大于上次更新时间24小时则更新下一次
					db.collection('jimoty-daoju-use').doc(item._id).update({
						update_date: Date
							.now()
					})
					db.collection('jimoty-post').doc(item.daojuPostId)
						.update({ update_date: Date.now() })
				}

			}


		}

	})


	//返回数据给客户端
	return '更新道具的使用'
}