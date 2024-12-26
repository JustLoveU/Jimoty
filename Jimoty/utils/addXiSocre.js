const db = uniCloud.database()
const uid = uniCloud.getCurrentUserInfo().uid

export async function addXiSocre() {
	// 发表一条加2分
	console.log('发表一条加2分')
	const res = await db.collection('uni-id-users').doc(uid).field('xiScore').get({ getOne: true })
	let score = res.result.data.xiScore + 2
	db.collection('uni-id-users').doc(uid).update({ xiScore: score })
}

export async function changeXiSocre(type, userId) {
	const res = await db.collection('uni-id-users').doc(userId).field('xiScore').get({ getOne: true })
	if (type === 0) {
		// 被好评加2分
		let score = res.result.data.xiScore + 2
		db.collection('uni-id-users').doc(userId).update({ xiScore: score })
	} else if (type === 1) {
		// 被一般加1分	
		let score = res.result.data.xiScore + 1
		db.collection('uni-id-users').doc(userId).update({ xiScore: score })
	} else if (type === 2) {
		// 差评-3		
		let score = res.result.data.xiScore - 3
		db.collection('uni-id-users').doc(userId).update({ xiScore: score })
	}

}