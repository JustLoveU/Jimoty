// 钩子函数示例 hooks/index.js
function beforeRegister({
	userRecord,
	clientInfo
} = {}) {
	if (clientInfo.appId === '__UNI__61206C3') {
		if (!userRecord.nickname) {
			let randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
			let name = '用户' + randomNum
			userRecord.nickname = name
		}
		if (!userRecord.nickname.avatar_file) {
			userRecord.avatar_file = {
				extname: 'png',
				url: 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png'
			}
		}
		if (!userRecord.xiScore) {
			userRecord.xiScore = 50
		}



	}
	return userRecord // 务必返回处理后的userRecord
}

module.exports = { beforeRegister }