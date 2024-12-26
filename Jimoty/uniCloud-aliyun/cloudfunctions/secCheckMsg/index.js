const crypto = require('crypto')
const db = uniCloud.database()

function getSignature(token, timestamp, nonce, msgEncrypt) {
	const str = [token, timestamp, nonce, msgEncrypt].sort().join('')
	return crypto.createHash('sha1').update(str).digest('hex')
}

function PKCS7Decode(buf) {
	let padSize = buf[buf.length - 1]
	return buf.slice(0, buf.length - padSize)
}

function decryptMsg(encodingAESKey, msgEncrypt) {
	const key = Buffer.from(encodingAESKey + '=', 'base64')
	const iv = key.slice(0, 16)
	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
	decipher.setAutoPadding(false)
	let deciphered = Buffer.concat([decipher.update(msgEncrypt, 'base64'), decipher.final()])
	deciphered = PKCS7Decode(deciphered)
	const content = deciphered.slice(16)
	const length = content.slice(0, 4).readUInt32BE(0)
	return {
		message: JSON.parse(content.slice(4, length + 4).toString()),
		appId: content.slice(length + 4).toString()
	}
}
exports.main = async function(event, context) {
	const {
		signature: signature,
		timestamp: timestamp,
		nonce: nonce,
		echostr: echostr
	} = event.queryStringParameters
	let body = ''
	if (event.body !== '') {
		body = JSON.parse(event.body)
	}
	let result = body

	const tmpStr = getSignature('jimotyToken', timestamp, nonce)

	if (signature === tmpStr) {
		// 	// 验证是从微信发来的消息
		if (body.Encrypt) {
			const decrypt = decryptMsg('UMABMcwFCvR4bVTA32i0jHxBoV2aemTqEjqFbgEMsTR', body.Encrypt)
			//返回的所有数据
			result = decrypt.message
			//根据图片校验返回的审核ID，比对图片日志表，获取满足条件的数据，作为后续增删改查的依据
			let imgLogs = await db.collection('jimoty-sec-check-img-log').where({ traceId: result.trace_id })
				.get()

			let verify_id = imgLogs.data[0].verify_id
			let picurl = imgLogs.data[0].picurl


			//【重点】图片合规处理函数
			if (result.result.suggest === 'pass' || result.result.suggest === 'review') {
				//根据图片日志返回的verify_id获取表中对应指定的数据
				let res = await db.collection('jimoty-post').where({ _id: verify_id }).get()

				//只用状态为0待审核的才能修改业务内容状态，2通过的不再修改
				if (res.data[0].status === 0) {
					await db.collection('jimoty-post').where({ _id: verify_id }).update({ status: 2 })
				}
				//修改图片状态
				await db.collection('jimoty-sec-check-img-log').where({
						traceId: result
							.trace_id
					})
					.update({ state: 1 })
				console.log('审核通过')

				// 审核通过给follow成员发送消息,并推送相关的商品上架信息
				console.log('审核通过给follow成员发送消息')
				await uniCloud.callFunction({
					name: 'sendGruopMessage',
					data: { postId: verify_id, userId: res.data[0].userId }
				})
				return '审核通过'
			}
			//【重点】图片违规的处理函数
			if (result.result.suggest === 'risky') {
				//图片违规，立即将发布的业务状态改为2为审核不通过
				await db.collection('jimoty-post').where({ _id: verify_id })
					.update({ status: 3 })
				//将图片日志的状态改为2为不通过
				await db.collection('jimoty-sec-check-img-log').where({
						traceId: result
							.trace_id
					})
					.update({ state: 2 })
				//删除违规图片，如果要看看用户传了什么，可以不删，但是占用存储空间，看个人选择，可以注释掉
				await uniCloud.deleteFile({ fileList: [picurl] })

				await db.collection('jimoty-notice').add({
					sendPeople: '66f190b0286f7cec14cf4f62',
					receive: res.data[0].userId,
					message: '帖子审核不通过',
					otherMessage: '系统消息',
					type: 0,
					status: false,
					create_date: Date.now()
				})

				console.log('审核不通过')
				return '审核不通过'
			} else {
				await db.collection('jimoty-sec-check-img-log').where({
						traceId: result
							.trace_id
					})
					.update({ state: 4 })
			}

		}

		return 'sucess'
	} else {
		return '非微信来的请求'
	}
}