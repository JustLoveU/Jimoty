'use strict'
const db = uniCloud.database()
exports.main = async (event, context) => {
	console.log('event', event)
	const { postId, bool } = event
	//删除帖子后进行操作

	try {

		const res = await db.collection('jimoty-post').doc(postId).get()
		if (Boolean(bool)) {
			await db.collection('jimoty-post').doc(postId).remove()
		} else {
			await db.collection('jimoty-post').doc(postId).update({
				weight: 100,
				hightLight: false,
				browse: 0,
			})
		}
		console.log('#####', res.data)
		// 同时取消该贴拥有的特权
		if (res.data[0].type === 1) {
			await db.collection('jimoty-use-map').where({ city: res.data[0].location.province })
				.update({ type1: false })
		} else if (res.data[0].type === 2) {
			await db.collection('jimoty-use-map').where({ city: res.data[0].location.province })
				.update({ type2: false })
		} else if (res.data[0].type === 3) {
			await db.collection('jimoty-use-map').where({ city: res.data[0].location.province })
				.update({ type3: false })
		} else if (res.data[0].type === 4) {
			await db.collection('jimoty-use-map').where({ city: res.data[0].location.province })
				.update({ type4: false })
		} else if (res.data[0].type === 5) {
			await db.collection('jimoty-use-map').where({ city: res.data[0].location.province })
				.update({ type5: false })
		}
	} catch (e) {
		//TODO handle the exception
		return {
			code: 220,
			msg: '删除失败'
		}
	}

	//返回数据给客户端
	return {
		code: 200,
		msg: '删除成功'
	}
}