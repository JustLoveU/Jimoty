'use strict'
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	const { vModelValue, good_type, userId } = event


	// 获取价格
	const resGood = await db.collection('jimoty-good').where({ good_type: good_type }).get()
	const good = resGood.data[0]

	const totalPrice = vModelValue * good.good_price * 100

	// 先判断该用户余额是否足够
	const userData = await db.collection('uni-id-users').doc(userId).get()

	let balance = Number(userData.data[0].balance)
	if (balance && balance > 0 && balance >= totalPrice) {


		const newPrice = balance - totalPrice
		// 更新余额
		await db.collection('uni-id-users').doc(userId).update({ balance: newPrice })

		// 添加
		// 如果存在更新，不存在添加
		const data = await db.collection('jimoty-daoju').where({
			daoUserId: userId,
			daojuType: good.good_type
		}).get()

		if (data.data.length > 0) {
			let num = data.data[0].daojuNum + vModelValue
			await db.collection('jimoty-daoju').where({
				daoUserId: userId,
				daojuType: good.good_type
			}).update({ daojuNum: num })
		} else {
			await db.collection('jimoty-daoju').add({
				daoUserId: userId,
				daojuType: good.good_type,
				daojuNum: vModelValue,
				last_use_date: Date.now(),
				create_date: Date.now()
			})
		}

		let order_no = 'jimoty' + Date.now() + generateRandomSevenDigitNumber()
		await db.collection('jimoty-pay-order').add({
			total_fee: totalPrice,
			user_id: userId,
			custom: { des: `用户消费购买${good.good_name}` },
			order_no: order_no,
			type: 'buy',
			pay_date: Date.now(),
			create_date: Date.now(),
			status: 1
		})

	} else {
		return {
			code: 220,
			msg: '您的余额不够，请充值!'
		}
	}

	//返回数据给客户端
	return {
		code: 200,
		msg: '购买成功!'
	}
}


// 随机生成一个7位数给订单号
const generateRandomSevenDigitNumber = () => {
	let randomNumber = Math.floor(Math.random() * 10000000)
	if (randomNumber < 1000000) {
		randomNumber = '0' + randomNumber
	}
	return randomNumber
}