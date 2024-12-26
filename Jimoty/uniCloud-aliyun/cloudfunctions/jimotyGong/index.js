const crypto = require('crypto')
const xml2js = require('xml2js')

function getSignature(token, timestamp, nonce, msgEncrypt) {
	const str = [token, timestamp, nonce, msgEncrypt].sort().join('')
	return crypto.createHash('sha1').update(str).digest('hex')
}

const db = uniCloud.database()
exports.main = async function(event, context) {
	const {
		signature: signature,
		timestamp: timestamp,
		nonce: nonce,
		echostr: echostr,
		openid: openid,
	} = event.queryStringParameters
	const tmpStr = getSignature('jimoty2024', timestamp, nonce)
	if (signature === tmpStr) {
		let jsonObj
		xml2js.parseString(event.body, { trim: true }, function(err, result) {
			if (err) {
				throw err
			}
			jsonObj = result.xml
		})

		if (jsonObj.MsgType[0] === 'event' && jsonObj.Event && jsonObj.Event[0] === 'subscribe') {
			console.log('添加')

			// 获取unionID 
			const data = await db.collection('jimoty-token').get()

			let ACCESS_TOKEN = data.data[0].access_token
			const res = await uniCloud.request({
				url: `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${ACCESS_TOKEN}&openid=${openid}&lang=zh_CN`,
				method: 'GET'
			})

			let unionID = res.data.unionid

			await db.collection('jimoty-gong-user').add({
				gongOpenId: openid,
				UnionID: unionID,
				create_date: Date.now()
			})
			console.log('新增成功')
		} else if (jsonObj.MsgType[0] === 'event' && jsonObj.Event && jsonObj.Event[0] ===
			'unsubscribe') {
			console.log('移除')
			await db.collection('jimoty-gong-user').where({ gongOpenId: openid }).remove()
		}

		return '成功接收公众号信息'
	} else {
		return 'err'
	}
}