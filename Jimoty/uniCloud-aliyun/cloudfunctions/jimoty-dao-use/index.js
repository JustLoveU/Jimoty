'use strict'
const db = uniCloud.database()
const dbcmd = db.command
exports.main = async (event, context) => {

	const { daojuType, uid, myPostId, postTpye } = event
	// const daojuType = 0
	// const uid = '66f1918e286f7cec14cf68bf'
	// const myPostId = '6725b3081c90b6f6bab728f6'
	// const postTpye = 5


	const Daojudata = await db.collection('jimoty-daoju').where({
		daoUserId: uid,
		daojuType: daojuType
	}).get()

	if (Daojudata.data[0].daojuNum <= 0) {

		return {
			code: 220,
			msg: '道具数量不够'
		}
	}

	if (daojuType === 0) {
		const bool = await checkPost(myPostId, postTpye)
		console.log('%%%%%', bool)
		if (bool) {
			// 置顶
			await db.collection('jimoty-post').doc(myPostId)
				.update({ weight: 200 })
			// 添加使用记录
			await db.collection('jimoty-daoju-use').add({
				delete: false,
				daojuPostId: myPostId,
				daojuType: 0,
				daojuUserId: uid,
				update_date: Date.now(),
				end_date: Date.now() + 7 * 24 * 60 * 60 *
					1000 //一天后结束 1 * 24 * 60 * 60 * 1000
			})
		} else {
			return {
				code: 220,
				msg: '当前该类别有帖子正在置顶'
			}
		}


	} else if (daojuType === 1) {
		// 高亮

		// 判断该帖子是否已经高亮
		const ifHightLight = await db.collection('jimoty-post')
			.where({ _id: myPostId, hightLight: true }).count()

		if (ifHightLight.total > 0) {
			return {
				code: 220,
				msg: '当前帖子正在高亮中'
			}
		}
		await db.collection('jimoty-post').doc(myPostId)
			.update({ hightLight: true })

		// 添加使用记录
		await db.collection('jimoty-daoju-use').add({
			delete: false,
			daojuPostId: myPostId,
			daojuType: 1,
			daojuUserId: uid,
			update_date: Date.now(),
			end_date: Date.now() + 3 * 24 * 60 * 60 * 1000 //三天后结束
		})
	} else if (daojuType === 2) {

		// 刷新
		await db.collection('jimoty-post').doc(myPostId).update({
			update_date: Date.now(),
			create_date: Date.now()
		})

		// 添加使用记录
		await db.collection('jimoty-daoju-use').add({
			delete: false,
			daojuPostId: myPostId,
			daojuType: 2,
			daojuUserId: uid,
			update_date: Date.now(),
			end_date: Date.now()
		})
	} else if (daojuType === 3) {
		// 定期刷新
		await db.collection('jimoty-post').doc(myPostId).update({
			update_date: Date.now(),
			create_date: Date.now()
		})

		// 添加使用记录
		await db.collection('jimoty-daoju-use').add({
			delete: false,
			daojuPostId: myPostId,
			daojuType: 3,
			daojuUserId: uid,
			update_date: Date.now(),
			end_date: Date.now() + 7 * 24 * 60 * 60 * 1000 //设置七天后的截止时间
		})
	}

	let num = Daojudata.data[0].daojuNum - 1
	await db.collection('jimoty-daoju').where({
		daoUserId: uid,
		daojuType: daojuType
	}).update({
		daojuNum: num,
		last_use_date: Date.now()
	})

	//返回数据给客户端
	return {
		code: 200,
		msg: '使用成功!'
	}
}


async function checkPost(myPostId, postTpye) {
	// 获取城市
	const res = await db.collection('jimoty-post').doc(myPostId).get()
	const city = res.data[0].location.province
	// 判断该城市是否存储
	const cityData = await db.collection('jimoty-use-map').where({ city: new RegExp(city, 'g') }).get()
	console.log('@@@@@', cityData)
	if (cityData.data && cityData.data.length <= 0) {
		// 不存在
		console.log(' 不存在')
		if (postTpye === 1) {
			await db.collection('jimoty-use-map').add({
				city: city,
				type1: true,
				type2: false,
				type3: false,
				type4: false,
				type5: false
			})
		} else if (postTpye === 2) {
			await db.collection('jimoty-use-map').add({
				city: city,
				type1: false,
				type2: true,
				type3: false,
				type4: false,
				type5: false
			})
		} else if (postTpye === 3) {
			await db.collection('jimoty-use-map').add({
				city: city,
				type1: false,
				type2: false,
				type3: true,
				type4: false,
				type5: false
			})
		} else if (postTpye === 4) {
			await db.collection('jimoty-use-map').add({
				city: city,
				type1: false,
				type2: false,
				type3: false,
				type4: true,
				type5: false
			})
		} else if (postTpye === 5) {
			await db.collection('jimoty-use-map').add({
				city: city,
				type1: false,
				type2: false,
				type3: false,
				type4: false,
				type5: true
			})
		}
		return true

	} else {
		// 根据分类查看,如果当前分类有置顶的返回false,没有则设置为true
		console.log(' 存在', cityData.data[0])
		if (postTpye === 1) {
			if (!cityData.data[0].type1) {
				await db.collection('jimoty-use-map').where({ city: city }).update({ type1: true })
				return true
			}

		} else if (postTpye === 2) {
			if (!cityData.data[0].type2) {
				await db.collection('jimoty-use-map').where({ city: city }).update({ type2: true })
				return true
			}
		} else if (postTpye === 3) {
			if (!cityData.data[0].type3) {
				await db.collection('jimoty-use-map').where({ city: city }).update({ type3: true })
				return true
			}
		} else if (postTpye === 4) {
			if (!cityData.data[0].type4) {
				await db.collection('jimoty-use-map').where({ city: city }).update({ type4: true })
				return true
			}
		} else if (postTpye === 5) {
			if (!cityData.data[0].type5) {
				await db.collection('jimoty-use-map').where({ city: city }).update({ type5: true })
				return true
			}

		}
		return false

	}


}