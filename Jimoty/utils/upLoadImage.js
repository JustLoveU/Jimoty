const prefix = 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919'
const secCheckObj = uniCloud.importObject('secCheckContent', { customUI: true })
const db = uniCloud.database()

// 导入压缩工具类
// import compress from 'compress.js'

export async function upLoadImage(postId, previewList) {
	// 获取openid
	let userInfo = uni.getStorageSync('uni-id-pages-userInfo')
	const userData = await db.collection('uni-id-users').doc(userInfo._id).field('wx_openid.mp')
		.get({ getOne: true })

	let openId = userData.result.data.wx_openid.mp

	let needArr = previewList.filter(str => !str.startsWith(prefix))
	let noNeedArr = previewList.filter(str => str.startsWith(prefix))
	let images = []

	if (needArr.length > 0) {
		for (var i = 0; i < needArr.length; i++) {
			const res = await uniCloud.uploadFile({
				filePath: needArr[i],
				cloudPath: new Date().getTime() + '' + Math.floor(10000 +
					Math
					.random() *
					90000)
			})
			images.push(res.fileID)
			if (i === needArr.length - 1) {
				// 更新的数组字段值	
				let imagesArr = [...noNeedArr, ...images]
				console.log('####', imagesArr)
				secCheckObj.imgSecCheckP({
					picurls: imagesArr,
					verify_id: postId,
					openid: openId
				})
				await db.collection('jimoty-post').doc(postId).update({
					photos: [...noNeedArr, ...
						images
					]
				})
			}

		}

	} else {
		db.collection('jimoty-post').doc(postId).update({ status: 2 })
	}
}