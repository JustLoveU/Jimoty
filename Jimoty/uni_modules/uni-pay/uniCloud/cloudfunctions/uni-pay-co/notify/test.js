'use strict'
/**
 * 此处建议只改下订单状态，保证能及时返回给第三方支付服务器成功状态
 * 限制4秒内必须执行完全部的异步回调逻辑，建议将消息发送、返佣、业绩结算等业务逻辑异步处理（如用定时任务去处理这些异步逻辑）
 * 建议再判断下金额和你业务系统订单中的金额是否一致
 */

const payCrypto = require('../libs/crypto.js') // 获取加密服务

module.exports = async obj => {
	let user_order_success = true
	let { data = {} } = obj
	let {
		order_no,
		out_trade_no,
		total_fee
	} = data // uni-pay-orders 表内的数据均可获取到

	console.log('type：test', data)

	// 此处写你自己的支付成功逻辑开始-----------------------------------------------------------
	// 方式一：直接写数据库操作
	// 此处只是简单演示下，实际数据库语句会更复杂一点。
	const db = uniCloud.database()
	const dbcmd = db.command
	// 获取你的业务订单信息
	let orderRes = await db.collection('jimoty-pay-order').where({ order_no }).get()
	let orderInfo = orderRes.data[0]
	// 判断total_fee是否和你业务订单的金额一致
	if (orderInfo.total_fee === total_fee) {
		// 对用户的point点即余额充值
		let res = await db.collection('uni-id-users').doc(orderInfo.user_id).update({
			balance: dbcmd.inc(
				total_fee)
		})

		// 更新自己的业务订单
		let res2 = await db.collection('jimoty-pay-order').where({ order_no }).update({
			status: 1,
			pay_date: Date.now()
		})

		if (res && res.updated && res2 && res2.updated) {
			user_order_success = true // 通知插件我的自定义回调逻辑执行成功
		} else {
			user_order_success = false // 通知插件我的自定义回调逻辑执行失败
		}
	} else {
		user_order_success = false
	}

	// 此处写你自己的支付成功逻辑结束-----------------------------------------------------------

	// user_order_success =  true 代表你自己的逻辑处理成功 返回 false 代表你自己的处理逻辑失败。
	return user_order_success

}






// 此处写你自己的支付成功逻辑开始-----------------------------------------------------------
// 有三种方式
// 方式一：直接写数据库操作
// 方式二：使用 await uniCloud.callFunction 调用其他云函数或云对象，云对象则使用 uniCloud.importObject('云对象名称')来请求
// 方式三：使用 await uniCloud.httpclient.request 调用http接口地址


/* 
// 方式二安全模式一（加密）
let encrypted = payCrypto.aes.encrypt({
	data: data, // 待加密的原文
});
await uniCloud.callFunction({
	name: "你的云函数名称",
	data: {
		encrypted, // 传输加密数据
	},
});
*/


/* 
	// 方式二安全模式二（只传一个订单号 out_trade_no，你自己的回调里查数据库表  uni-pay-orders 判断 status是否等于1来判断是否真的支付了）
	await uniCloud.callFunction({
		name: "你的云函数名称",
		data: {
			out_trade_no, // 支付插件订单号
		},
	});
 */


/* 
	// 方式三安全模式一（加密）
	let encrypted = payCrypto.aes.encrypt({
		data: data, // 待加密的原文
	});
	await uniCloud.httpclient.request("你的服务器接口请求地址", {
		method: "POST",
		data: {
			encrypted, // 传输加密数据
		},
	});
 */


/* 
	// 方式三安全模式二（只传一个订单号 out_trade_no，你自己的回调里执行url请求来请求 uni-pay-co 云对象的 getOrder 接口来判断订单是否真的支付了）
	await uniCloud.httpclient.request("你的服务器接口请求地址", {
		method: "POST",
		data: {
			out_trade_no, // 支付插件订单号
		},
	});
 */