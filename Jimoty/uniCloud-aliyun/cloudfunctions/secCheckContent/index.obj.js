// 引入uni-sec-check公共模块  
const UniSecCheck = require('uni-sec-check')
const db = uniCloud.database()
module.exports = {
	//文本安全校验方法textSecCheck({文本内容,openid,场景值,接口版本})
	async textSecCheck({
		content,
		openid = 'oplOy69Ux38CGtIck0_MlM2FmTlw',
		scene = 2,
		version = 2
	} = {}) {
		const uniSecCheck = new UniSecCheck({
			provider: 'mp-weixin',
			requestId: this.getUniCloudRequestId(), // 云函数内则写 context.requestId
		})
		const checkRes = await uniSecCheck.textSecCheck({
			content,
			openid,
			scene,
			version
		})
		if (checkRes.errCode === 'uni-sec-check-risk-content') {
			return {
				code: 400,
				errMsg: '内容不合规',
				result: checkRes.result
			}
		} else if (checkRes.errCode) {
			return {
				code: 400,
				errMsg: checkRes.errMsg,
				result: checkRes.result
			}
		} else if (checkRes.result.suggest === 'pass') {
			return {
				errCode: 0,
				errMsg: checkRes.result
			}
		} else if (checkRes.result.suggest === 'review') {
			return {
				errCode: 0,
				errMsg: ''
			}
		}
		return {
			errCode: 0,
			errMsg: ''
		}

	},

	/* imgSecCheck({对象})
	 *picurls    客户端传url数组来
	 *openid     用户openid
	 *scene      场景值
	 *version    版本号
	 *verify_id  业务ID
	 *type      0帖子 1评论
	 * 使用v1版本同步获得结果
	 */

	async imgSecCheckC({
		image,
		scene = 2,
		version = 1,
		type = 0
	} = {}) {
		const uniSecCheck = new UniSecCheck({
			provider: 'mp-weixin',
			requestId: this.getUniCloudRequestId(), // 云函数内则写 context.requestId
		})
		//因为图片校验只能单图验证，所以将客户端传来的url数组循环遍历
		// let data = []
		// for (let image of picurls) {
		// 	let res = await uniSecCheck.imgSecCheck({
		// 		image,
		// 		scene,
		// 		version
		// 	})
		// 	data.push(res)
		// }
		let res = await uniSecCheck.imgSecCheck({
			image,
			scene,
			version
		})
		return res
	},


	/* imgSecCheck({对象})
	 *picurls    客户端传url数组来
	 *openid     用户openid
	 *scene      场景值
	 *version    版本号
	 *verify_id  业务ID
	 * 使用v2版本异步获得结果
	 */
	async imgSecCheckP({
		picurls,
		openid,
		scene = 2,
		version = 2,
		verify_id,
	} = {}) {
		const uniSecCheck = new UniSecCheck({
			provider: 'mp-weixin',
			requestId: this.getUniCloudRequestId(), // 云函数内则写 context.requestId
		})
		//因为图片校验只能单图验证，所以将客户端传来的url数组循环遍历
		for (let image of picurls) {
			let res = await uniSecCheck.imgSecCheck({
				image,
				openid,
				scene,
				version
			})
			//将校验回调的唯一校验码traceId存储图片日志中
			await db.collection('jimoty-sec-check-img-log').add({
				verify_id: verify_id,
				picurl: image,
				traceId: res.traceId,
				state: 0
			})
		}
	},


	// 删除云文件操作
	async imgcancel(picurls) {
		try {
			// 云函数删除文件示例代码
			let result = await uniCloud.deleteFile({ fileList: picurls })
			return result

		} catch (e) {
			console.log(e)
		}
	},




}