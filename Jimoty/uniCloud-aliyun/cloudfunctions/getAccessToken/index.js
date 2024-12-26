'use strict'
const Myappid = 'wx8bbabae0e0ef59af' //公众号   
const Mysecret = '2f43a5b38eba97f63f8daacad9e7004a'
const db = uniCloud.database()
exports.main = async (event, context) => {
	// 获取access_token
	const baseURL = 'https://api.weixin.qq.com/cgi-bin/token'

	// 用代理请求发，固定出口ip
	const res = await uniCloud.httpProxyForEip.get(
		baseURL, {
			grant_type: 'client_credential',
			appid: Myappid,
			secret: Mysecret
		}
	)

	const Token = res.body.access_token

	//存入数据库
	// 先删掉，再添加，直接更新有问题
	// await db.collection('jimoty-token').update({ access_token: Token, create_date: Date.now() })
	const tokenData = await db.collection('jimoty-token').limit(1).get()
	if (tokenData.data[0]) {
		await db.collection('jimoty-token').doc(tokenData.data[0]._id).remove()
	}

	await db.collection('jimoty-token').add({
		access_token: Token,
		create_date: Date.now()
	})


	return '更新access_token'
}