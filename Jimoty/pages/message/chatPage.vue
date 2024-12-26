<script setup>
	import { onMounted, ref, onUnmounted, nextTick, computed } from 'vue';
	import { onLoad, onHide } from '@dcloudio/uni-app'
	import { makeNotice, removeNotice } from '@/utils/noticeOperate.js'
	const SendMs = uniCloud.importObject('jimoty-sendMessage', { customUI: true })

	// 获取屏幕边界到安全区域距离
	const { safeAreaInsets } = uni.getSystemInfoSync()
	const systemInfo = uni.getSystemInfoSync();
	const scrollView = ref(null)
	let db = uniCloud.database()
	let dbP = uniCloud.databaseForJQL()
	let uid = uniCloud.getCurrentUserInfo().uid
	const postId = ref('')
	const friendId = ref('')
	const userId = ref('')

	const postUserId = ref('')

	const myUserData = ref([])
	const otherUserData = ref([])
	const ifSendMessage = ref(true)

	const secCheckObj = uniCloud.importObject("secCheckContent", { customUI: true })


	const dialogId = ref('')
	const dialogData = ref([])
	const postData = ref({})
	const chatId = ref('')


	onMounted(async () => {


		db.collection('uni-id-users').doc(uid).field('_id,nickname,avatar_file.url').get().then((
			res) => {
			myUserData.value = res.result.data
		})

	})

	// 交易状态
	const stepId = ref(0)
	// 交易状态(0交易前1协商2交易中3完成4取消)

	// 标记是否有发送过消息
	const ifSendOne = ref(false)


	onLoad(async (e) => {
		console.log(e);

		if (e.chatId && e.chatId != null) {
			// 存在
			// 使用chatId来找到对话框
			chatId.value = e.chatId
			const chatData = await db.collection('jimoty-chat').doc(chatId.value).get({ getOne: true })
			postId.value = chatData.result.data.postId
			friendId.value = chatData.result.data.friendId
			userId.value = chatData.result.data.userId
			stepId.value = chatData.result.data.step

		} else {
			friendId.value = e.friendId
			postId.value = e.postId
			const res = await db.collection('jimoty-chat').where({
				userId: uid,
				friendId: e.friendId,
				postId: e.postId,
			}).get()
			// 判断从详情页进入,聊天框存在
			if (res.result.data.length > 0) {
				console.log(' 判断从详情页进入,聊天框存在', res.result.data);
				chatId.value = res.result.data[0]._id
				userId.value = res.result.data[0].userId
				stepId.value = res.result.data[0].step
			} else {
				// 先不创建聊天框,等发送消息后创建
				console.log(' 判断从详情页进入,聊天框不存在', res.result.data);
				ifSendOne.value = true
			}

		}
		getPostData()
		if (ifSendOne.value) return
		await getData()

		// setTimeout(() => {
		uptoBottom()
		// }, 500)
		// 定时器刷新
		timer = setInterval(async () => {
			console.log('刷新');
			await getData()

		}, 2000)
	})

	// 创建聊天盒子
	async function createMessageBox() {
		const res = await db.collection('jimoty-chat').add({
			userId: uid,
			friendId: friendId.value,
			postId: postId.value,
		})
		chatId.value = res.result.id
		ifSendOne.value = false
		// 定时器刷新
		timer = setInterval(async () => {
			getData()
		}, 2000)
	}

	async function getPostData() {

		const temp1 = db.collection('jimoty-post').where(`_id=="${postId.value}"`).field(
			'_id,userId,type,photos,location,noteTitle,mainText,postPrice,status,delete,collect,create_date,employeeForm,category'
		).getTemp()
		const temp2 = db.collection('uni-id-users').field('_id,nickname,avatar_file.url')
			.getTemp()
		const temp3 = db.collection('jimoty-category').field('_id,name,parent_id').getTemp()

		let pageData = await db.collection(temp1, temp2, temp3).get({ getOne: true })

		if (!pageData.result.data) {
			console.log('商品不存在');
			ifSendMessage.value = false
		} else {
			postData.value = pageData.result.data
			postUserId.value = postData.value.userId[0]._id
			// 设置页面标题
			db.collection('uni-id-users').doc(friendId.value == uid ? userId.value : friendId.value).field(
				'_id,nickname,avatar_file.url').get().then((res) => {
				otherUserData.value = res.result.data
				uni.setNavigationBarTitle({
					title: otherUserData.value && otherUserData.value[0].nickname ? otherUserData
						.value[0]
						.nickname : '未知用户'
				})
			})
		}

	}

	async function getData() {
		const temp1 = await db.collection('jimoty-chat-message').where({ chatBoxId: chatId.value }).getTemp()
		const temp2 = db.collection('uni-id-users').field('_id,nickname,avatar_file.url').getTemp()
		const res = await db.collection(temp1, temp2).orderBy('create_date desc').get()
		if (dialogData.value.length != res.result.data.length) {
			imgarr.value = []
			res.result.data.forEach(item => {
				if (item.type == 1) {
					imgarr.value.push(item.message)
				}
			})
		}

		const resData = await db.collection('jimoty-chat').doc(chatId.value).field('step')
			.get({ getOne: true })
		stepId.value = resData.result.data.step
		if (res.result.data.length > dialogData.value.length) {
			uptoBottom()
		}
		dialogData.value = reconstructArray(res.result.data)

		// 批量更新
		dbP.collection('jimoty-chat-message').where({ chatBoxId: chatId.value, friendId: uid })
			.update({ status: true })

		dbP.collection('jimoty-notice').where({ message: postId.value, receive: uid })
			.update({ status: true })
	}


	function reconstructArray(timestamps) {

		timestamps.sort((a, b) => a.time - b.time)
		let newArr = [];
		let a = timestamps[0].time;

		for (let i = 0; i < timestamps.length; i++) {
			if (timestamps[i].time > a + 600000) {
				a = timestamps[i].time;
				newArr.push(timestamps[i]);
			} else {

				newArr.push({
					chatBoxId: timestamps[i].chatBoxId,
					delete: timestamps[i].delete,
					friendId: timestamps[i]
						.friendId,
					message: timestamps[i].message,
					status: timestamps[i].status,
					type: timestamps[
						i].type,
					userId: timestamps[i].userId,
					_id: timestamps[i]._id,
					time: ""
				});
			}
		}
		return newArr

	}

	let timer = null
	onUnmounted(() => {
		clearInterval(timer)
		timer = null
	})

	onHide(() => {
		clearInterval(timer)
		timer = null
	})

	const goback = () => {
		uni.navigateBack()
	}


	// 触顶
	function scrolltoupper(e) {
		// 可以加载更多聊天信息
	}

	// 立即购买
	const takeOrder = () => {
		uni.navigateTo({
			url: '/pages/message/order'
		})
	}


	// 存放页面的所有图片以供查看
	const imgarr = ref([])


	// 查看大图
	const previewImage = (image) => {
		let index = 0;
		for (let i = 0; i < imgarr.value.length; i++) {
			if (imgarr.value[i] == image) index = i
		}
		// 预览图片
		uni.previewImage({
			current: index,
			urls: imgarr.value,
			longPressActions: {
				itemList: ['发送给朋友', '保存图片', '收藏'],
				success: function(data) {
					console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				},
				fail: function(err) {
					console.log(err.errMsg);
				}
			}
		});

	}

	// 发送的消息
	const sendText = ref('')
	const ifOperate = ref(false)
	// 发送消息
	async function sendMessage() {
		if (!ifSendMessage.value) return
		if (ifOperate.value) return
		ifOperate.value = true
		console.log(sendText.value);
		if (sendText.value == '') {
			uni.showToast({
				title: '请输入消息',
				icon: 'none'
			})
		} else {
			try {
				// 如果发送了一条消息则创建消息框
				if (ifSendOne.value) {
					await createMessageBox()
				}

				uni.showLoading({
					mask: true,
					title: '发送中'
				})
				let sec = await secCheckObj.textSecCheck({ content: sendText.value })
				if (sec.errCode != 0) {
					uni.showModal({
						title: sec.errMsg,
						content: `输入的内容违规，涉及“${sec.result.label}”，请重新编辑！`,
						showCancel: false
					})
					sendText.value = ''
					uni.hideLoading()
					ifOperate.value = false
					return
				} else {
					let data = {
						chatBoxId: chatId.value,
						userId: myUserData.value,
						friendId: friendId.value == uid ? userId.value : friendId.value,
						message: sendText.value,
						type: 0,
						status: false,
						time: Date.now()
					}
					dialogData.value.push(data)

					db.collection('jimoty-chat-message').add({
						chatBoxId: chatId.value,
						userId: uid,
						friendId: friendId.value == uid ? userId.value : friendId.value,
						message: sendText.value,
						type: 0,
					}).then(res => {
						// 更新消息框时间
						db.collection('jimoty-chat').doc(chatId.value).update({
							update_date: Date.now(),
							delete: false
						})

						setTimeout(() => {
							// 延迟执行，先判断有没有被读，没被读则发消息通知
							db.collection('jimoty-chat-message').doc(res.result.id)
								.get({ getOne: true })
								.then(async item => {
									if (!item.result.data.status) {
										// 发送消息推送

										makeNotice(uid, friendId.value == uid ? userId.value :
											friendId
											.value, 1, chatId.value, postData.value
											.noteTitle)

										let UserName = myUserData.value[0].nickname +
											'给你发来了一条的消息'
										await SendMs.sendMessage1(friendId.value == uid ?
											userId
											.value :
											friendId
											.value, UserName)



									}
								})
						}, 6000)
					})
					ifOperate.value = false
					sendText.value = ''

					uptoBottom()
				}

			} catch (e) {
				console.log(e, '发送失败');
				sendText.value == ''
				ifOperate.value = false
				uni.hideLoading()
				uni.showToast({
					title: '发送失败',
					icon: 'none'
				})
			}
			sendText.value = ''
		}
		ifOperate.value = false
		uni.hideLoading()
	}


	// 发送图片
	async function sendPhoto(arr) {
		if (!ifSendMessage.value) return
		console.log(arr);
		try {
			uni.showLoading({
				mask: true,
				title: '发送中'
			})
			arr.forEach(async (image) => {

				await uniCloud.uploadFile({
					filePath: image,
					cloudPath: new Date().getTime() + '' + Math.floor(10000 +
						Math
						.random() *
						90000)
				}).then(async (res) => {

					// 如果发送了一条消息则创建消息框
					if (ifSendOne.value) {
						await createMessageBox()
					}
					let data = {
						chatBoxId: chatId.value,
						userId: myUserData.value,
						friendId: friendId.value == uid ? userId.value : friendId.value,
						message: res.fileID,
						type: 1,
						status: false,
						time: Date.now()
					}
					dialogData.value.push(data)

					db.collection('jimoty-chat-message').add({
						chatBoxId: chatId.value,
						userId: uid,
						friendId: friendId.value == uid ? userId.value : friendId
							.value,
						message: res.fileID,
						type: 1
					}).then(res => {
						// 更新消息框时间
						db.collection('jimoty-chat').doc(chatId.value)
							.update({ update_date: Date.now(), delete: false })

						setTimeout(() => {
							// 延迟执行，先判断有没有被读，没被读则发消息通知
							db.collection('jimoty-chat-message').doc(res.result
									.id).get({ getOne: true })
								.then(async item => {
									if (!item.result.data.status) {
										makeNotice(uid, friendId
											.value ==
											uid ? userId.value :
											friendId.value, 1,
											chatId
											.value, postData.value
											.noteTitle)
										// 发送消息推送
										let UserName = myUserData
											.value[0]
											.nickname + '给你发来了一条的消息'
										await SendMs.sendMessage1(
											friendId
											.value ==
											uid ? userId.value :
											friendId.value,
											UserName)
									}

								})
						}, 6000)
					})

					uptoBottom()
					uni.hideLoading()
				})

			})

		} catch (e) {
			uni.hideLoading()
			uni.showToast({
				title: '发送失败',
				icon: 'none'
			})
		}

		uni.hideLoading()
	}


	// 打开拍照
	function opencamera() {
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['camera'],
			success: function(res) {
				console.log(JSON.stringify(res.tempFilePaths));
				sendPhoto(res.tempFilePaths)
			}
		});
	}

	// 打开相册
	function openalbum() {
		uni.chooseImage({
			count: 3, //默认3
			sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: function(res) {
				sendPhoto(res.tempFilePaths)
			}
		});
	}


	// 长按撤回 (两分钟之内)
	function handleLongPress(item, index) {

		if (Date.now() - item.time > 1000 * 60 * 2) return
		if (item.userId[0]._id === uid) {
			console.log(item, '该聊天记录的id');
			uni.showModal({
				content: '是否撤回',
				success: function(res) {
					if (res.confirm) {
						console.log('用户点击确定');
						dialogData.value.splice(index, 1)
						db.collection('jimoty-chat-message').doc(item._id).remove()

					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			})
		}

	}
	// 修改交易状态
	async function changeStep(index) {

		let message = ''
		if (index == 0) {
			const resData = await db.collection('jimoty-post').doc(postId.value).field('status').get({ getOne: true })
			if (resData.result.data.status == 5) {
				uni.showToast({
					title: '当前有已经确认的用户',
					icon: 'none'
				})
				return
			}

			message = '已将您设置为买家'
			uni.showModal({
				content: `是否${typeStatus.value[postData.value.type-1].sell[0]}`,
				success: async function(res) {
					if (res.confirm) {
						stepId.value = 1
						db.collection('jimoty-chat').doc(chatId.value).update({ step: 1 })
						db.collection('jimoty-post').doc(postId.value).update({ status: 5 }) //交易中

						//添加确认记录
						db.collection('jimoty-buy').add({
							buyId: friendId.value == uid ? userId.value : friendId.value,
							goodId: postId.value
						})

						if (message != '') {
							let data = {
								chatBoxId: chatId.value,
								userId: myUserData.value,
								friendId: friendId.value == uid ? userId.value : friendId.value,
								message: message,
								type: 4,
								status: true,
								time: Date.now()
							}
							dialogData.value.push(data)

							db.collection('jimoty-chat-message').add({
								chatBoxId: chatId.value,
								userId: uid,
								friendId: friendId.value == uid ? userId.value : friendId.value,
								message: message,
								type: 4,
								status: true,
							})
							uptoBottom()
							await SendMs.sendMessage5(friendId.value == uid ? userId.value : friendId
								.value,
								'你有交易状态发生变化')

						}
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			})


		} else if (index == 1) {
			message = '完成'
			uni.showModal({
				content: typeStatus.value[postData.value.type - 1].sell[8],
				success: async function(res) {
					if (res.confirm) {

						// // 判断当前是否为交易状态
						const resData = await db.collection('jimoty-chat').doc(chatId.value)
							.get({ getOne: true })
						if (resData.result.data.step != 1) {
							uni.showToast({
								title: '当前非协商状态',
								icon: 'none'
							})
							return
						} else {
							stepId.value = 3

							db.collection('jimoty-chat').doc(chatId.value).update({ step: 3 })
							db.collection('jimoty-post').doc(postId.value).update({ status: 4 })

							resetPost()

							if (message != '') {
								let data = {
									chatBoxId: chatId.value,
									userId: myUserData.value,
									friendId: friendId.value == uid ? userId.value : friendId.value,
									message: message,
									type: 4,
									status: true,
									time: Date.now()
								}
								dialogData.value.push(data)

								db.collection('jimoty-chat-message').add({
									chatBoxId: chatId.value,
									userId: uid,
									friendId: friendId.value == uid ? userId.value : friendId
										.value,
									message: message,
									type: 4,
									status: true,
								})
								uptoBottom()
								await SendMs.sendMessage5(friendId.value == uid ? userId.value : friendId
									.value,
									'你有交易状态发生变化')
							}
						}



					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});

		} else if (index == 2) {
			message = '交易取消'
			uni.showModal({
				content: typeStatus.value[postData.value.type - 1].sell[10],
				success: async function(res) {
					if (res.confirm) {

						// // 判断当前是否为交易状态
						const resData = await db.collection('jimoty-chat').doc(chatId.value)
							.get({ getOne: true })
						if (resData.result.data.step != 1) {
							uni.showToast({
								title: '取消失败',
								icon: 'none'
							})
							return
						} else {
							stepId.value = 0
							db.collection('jimoty-chat').doc(chatId.value).update({ step: 0 })
							db.collection('jimoty-post').doc(postId.value).update({ status: 2 })

							db.collection('jimoty-buy').where({
								buyId: friendId.value == uid ? userId.value : friendId.value,
								goodId: postId.value
							}).remove()

							if (message != '') {
								let data = {
									chatBoxId: chatId.value,
									userId: myUserData.value,
									friendId: friendId.value == uid ? userId.value : friendId.value,
									message: message,
									type: 4,
									status: true,
									time: Date.now()
								}
								dialogData.value.push(data)

								db.collection('jimoty-chat-message').add({
									chatBoxId: chatId.value,
									userId: uid,
									friendId: friendId.value == uid ? userId.value : friendId
										.value,
									message: message,
									type: 4,
									status: true,
								})
								await SendMs.sendMessage5(friendId.value == uid ? userId.value : friendId
									.value,
									'你有交易状态发生变化')
							}
							uptoBottom()
						}

					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		}


	}

	// 重置帖子的特权
	function resetPost() {
		// 更新帖子的置顶
		uniCloud.callFunction({
			name: 'jimoty-cancle-post',
			data: {
				postId: postId.value,
				bool: false
			}
		})

	}


	// 评论
	// 评论弹窗
	function openComent() {
		if (stepId.value == 3) {
			popup.value.open()
		} else {
			uni.showToast({
				title: '您已经评价过了',
				icon: 'none'
			})
		}

	}

	const popup = ref(null)
	const commentIndex = ref(0)
	const commentText = ref('')


	function chooseType(index) {
		commentIndex.value = index
	}

	import { changeXiSocre } from '@/utils/addXiSocre.js'
	async function sendComent() {
		if (commentText.value == '') {
			uni.showToast({
				title: '请输入评价',
				icon: 'none'
			})
		} else {

			try {
				uni.showLoading({
					mask: true,
					title: '发送中'
				})
				let sec = await secCheckObj.textSecCheck({ content: commentText.value })
				if (sec.errCode != 0) {
					uni.showModal({
						title: sec.errMsg,
						content: `输入的内容违规，涉及“${sec.result.label}”，请重新编辑！`,
						showCancel: false
					})
					commentText.value = ''
					uni.hideLoading()
					return
				}

				db.collection('jimoty-comment').add({
					re_user_id: postUserId.value,
					post_id: postId.value,
					type: commentIndex.value,
					content: commentText.value
				}).then(res => {
					// 消息添加
					makeNotice(uid, postUserId.value, 3, res.result.id, postData.value.noteTitle)
					changeXiSocre(commentIndex.value, friendId.value == uid ? userId.value : friendId.value)
					sendMessage3(friendId.value == uid ? userId.value : friendId.value)
				})

				uni.hideLoading()
				commentText.value == ''
				popup.value.close()
				stepId.value == 0
				db.collection('jimoty-chat').doc(chatId.value).update({ step: 5 })
				uni.showToast({
					title: '评价成功',
					icon: 'none'
				})

			} catch (e) {
				console.log(e);
				commentText.value == ''
				uni.hideLoading()
				uni.showToast({
					title: '发送失败',
					icon: 'none'
				})
				popup.value.close()
				//TODO handle the exception
			}

		}
	}


	// 前往对方主页
	function gotoUser(id) {
		uni.navigateTo({
			url: `/pages/my/myDetail?userId=${id}`
		})
	}

	const changeHeigh = ref(false)
	const inputHeigh = ref(0)

	function addHeight(e) {
		inputHeigh.value = e.detail.height
		changeHeigh.value = true
	}

	function cancelHeigh(e) {
		changeHeigh.value = false
	}

	// 格式化时间
	function formatTimestamp(timestamp) {
		const now = new Date();
		const inputDate = new Date(timestamp);
		const daysDifference = Math.floor((now - inputDate) / (1000 * 60 * 60 * 24));

		if (daysDifference === 0) {
			const hours = inputDate.getHours().toString().padStart(2, '0');
			const minutes = inputDate.getMinutes().toString().padStart(2, '0');
			return `${hours}:${minutes}`;
		} else if (daysDifference === 1) {
			const hours = inputDate.getHours().toString().padStart(2, '0');
			const minutes = inputDate.getMinutes().toString().padStart(2, '0');
			return `昨天 ${hours}:${minutes}`;
		} else if (daysDifference === 2) {
			const hours = inputDate.getHours().toString().padStart(2, '0');
			const minutes = inputDate.getMinutes().toString().padStart(2, '0');
			return `前天 ${hours}:${minutes}`;
		} else {
			const month = inputDate.getMonth() + 1;
			const day = inputDate.getDate();
			const hours = inputDate.getHours().toString().padStart(2, '0');
			const minutes = inputDate.getMinutes().toString().padStart(2, '0');
			return `${month}月${day}日 ${hours}:${minutes}`;
		}
	}

	const uptoBottom = () => {
		scrollTop.value = scrollNumber.value
		nextTick(() => {
			scrollTop.value = 9999 * dialogData.value.length
		})

	}

	// 自动下滑
	const scrollTop = ref(0)
	const scrollNumber = ref(0)
	const scroll = (e) => {
		// scrollTop.value = scrollNumber.value
		scrollNumber.value = e.detail.scrollTop
	}

	// 进入详情页
	const gotoDetail = (postId) => {
		uni.navigateTo({
			url: `/pages/home/detail?postId=${postId}`
		})
	}


	const typeStatus = ref([{
			sell: ['确认对方加入活动', '参与取消', '参与结束', '该活动还在进行中', '请联系参与', '对方已经同意您参与', '已确定对方为成员', '你已经被确定为该活动的参与者',
				'是否确认已参与结束', '已结束参与', '是否确定取消结束'
			],
		},
		{
			sell: ['确定对方参与互助', '互助取消', '互助结束', '此互助还在', '请联系商家进行互助', '对方已经将您设为互助', '已确定对方为互助', '你已经被确定为该活动的参与者',
				'是否确认完成互助', '已完成互助', '是否确定参与结束'
			],
		},
		{
			sell: ['确定对方加入课堂', '试课取消', '试课结束', '该课堂还在进行中', '请联系进行试课', '对方已经将您设为学员', '已确定对方为学员', '你已经被确定为该活动的参与者',
				'是否确定取消试课', '已结束参与', '是否确定参与结束'
			],
		},
		{
			sell: ['确定将宠物交给对方', '领养取消', '领养成功', '领养还在进行中', '请联系商家进行领养', '对方已确认您的领养资格', '已确认对方的领养资格', '对方已确认您的领养资格',
				'是否确认领养', '确认领养', '是否取消对方的领养资格'
			],
		},
		{
			sell: ['确定对方为买家', '交易取消', '交易已完成', '还没有购买这个商品', '请联系商家进行购买', '对方已经将您设为买家', '已确定对方为买家', '对方已确定您为买家',
				'是否确认交易完成!(买家收货后点击确定)', '确认收货', '中断这笔交易?(确保已与买家沟通好)'
			],
		}
	])
</script>

<template>
	<view class="container">

		<view class="content-center">
			<view class="chat-good-status">
				<view class="good-status">
					<view class="no-buy" v-if="postData && postData.type">
						<view v-if="postUserId == uid"
							style="display: flex;align-items: center;justify-content: center;">
							<view class="no-buy-btu" v-if="stepId == 0 || stepId == 4" @tap="changeStep(0)">
								{{typeStatus[postData.type-1].sell[0]}}
							</view>
							<view class="no-buy-btu" v-if="stepId == 1" @tap="changeStep(2)" style="width: 300rpx;">
								{{typeStatus[postData.type-1].sell[1]}}
							</view>
							<view class="no-buy-sub" v-if="stepId == 3">
								{{typeStatus[postData.type-1].sell[2]}}
							</view>

							<view class="no-buy-sub" style="padding: 20rpx 0 ;" v-if="stepId == 5">
								已结束
							</view>

						</view>

						<view class="" v-else>
							<view class="" v-if="stepId == 0 || stepId == 4">
								<view class="no-buy-title">
									{{typeStatus[postData.type-1].sell[3]}}
								</view>
								<view class="no-buy-sub">
									{{typeStatus[postData.type-1].sell[4]}}
								</view>
							</view>

							<view class="" v-if="stepId == 1"
								style="display: flex;flex-direction: column; align-items: center;">
								<view class="no-buy-sub">
									{{typeStatus[postData.type-1].sell[5]}}
								</view>
								<view class="no-buy-btu" @tap="changeStep(1)" style="width: 300rpx;">
									{{typeStatus[postData.type-1].sell[9]}}
								</view>
							</view>

							<view class="" v-if="stepId == 3" @tap="openComent">
								<view class="no-buy-sub" style="padding: 20rpx 0 ;">
									评价
								</view>
							</view>

							<view class="" v-if="stepId == 5">
								<view class="no-buy-sub" style="padding: 20rpx 0 ;">
									已结束
								</view>
							</view>

						</view>

					</view>

				</view>

				<view class="good" @tap="gotoDetail(postData._id)">
					<image class="good-img"
						:src="postData.photos ? postData.photos[0] : 'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/商品不存在(1).png'"
						mode="aspectFill"></image>
					<view class="good-right">
						<view class="good-title">
							{{postData.noteTitle}}
						</view>
						<view class="good-price" v-if="postData.postPrice">
							￥{{postData.postPrice}}
						</view>
					</view>
				</view>

			</view>


			<view class="Css-chat">
				<scroll-view class="scroll-view" scroll-y="true" :scroll-top="scrollTop" @scrolltoupper="scrolltoupper"
					@scroll="scroll" :scroll-with-animation="true">
					<view class="scroll-view">
						<view class="chat-main">
							<view class="chat-ls" v-for="(item,index) in dialogData" :key="index">

								<view class="xitong" v-if="item.type === 4">

									<view v-if="item.message == '已将您设置为买家'">
										{{item.userId[0]._id === uid ? typeStatus[postData.type-1].sell[6]:typeStatus[postData.type-1].sell[7]}}
									</view>
									<view v-else>
										{{item.message}}
									</view>

								</view>
								<view class="msg-m" :class="item.userId[0]._id === uid ? 'msg-right':'msg-left'" v-else>

									<image
										:src="item.userId[0] && item.userId[0].avatar_file ? item.userId[0].avatar_file.url:'https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png'"
										mode="aspectFill" class="user-img" v-if="item.userId[0]._id !== uid "
										@click="gotoUser(item.userId[0]._id)"></image>
									<view class="message" v-if="item.type === 0" style="flex: none;">
										<view class="msg-text" @longpress="handleLongPress(item,index)">
											{{item.message}}
										</view>
										<view class="chat-time" v-if="item.time != ''"
											:class="item.userId[0]._id === uid ? 'time-right':'time-left'">
											{{formatTimestamp(item.time)}}
										</view>
									</view>
									<view class="message" v-else>
										<image :src="item.message" mode="widthFix" class="msg-img"
											@click="previewImage(item.message)"
											@longpress="handleLongPress(item,index)">
										</image>
										<view class="chat-time" v-if="item.time != ''"
											:class="item.userId[0]._id === uid ? 'img-right':'img-left'">
											{{formatTimestamp(item.time)}}
										</view>
									</view>

								</view>
							</view>

						</view>

					</view>
				</scroll-view>
			</view>

		</view>

		<view class="Css-input">
			<view class="message-input" :style="{bottom : changeHeigh ? (inputHeigh - 10)+'px':''}">
				<view class="my-input-box">
					<textarea @confirm="sendMessage" v-model="sendText" :show-confirm-bar="false" auto-height
						@keyboardheightchange="changeInputHeigh" disable-default-padding placeholder="请输入消息"
						class="my-input" :adjust-position="false" :auto-blur="true" @focus="addHeight"
						@blur="cancelHeigh" />
				</view>

				<view class="message-bottom">
					<view class="message-bottom-left">
						<uni-icons type="camera-filled" size="26" @tap="opencamera"></uni-icons>
						<uni-icons type="image-filled" size="26" @tap="openalbum"></uni-icons>
						<!-- <uni-icons type="location" size="26" @tap="getIp"> </uni-icons> -->
					</view>
					<view class="message-bottom-right" @tap="sendMessage">
						送信
					</view>
				</view>

			</view>
		</view>

		<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" background-color="#fff">
			<view class="poup-box">
				<view class="choose">
					<view class="choose-item" @tap="chooseType(0)" :class="commentIndex == 0 ? 'comentActive':''">
						好评
					</view>
					<view class="choose-item" @tap="chooseType(1)" :class="commentIndex == 1 ? 'comentActive':''">
						一般
					</view>
					<view class="choose-item" @tap="chooseType(2)" :class="commentIndex == 2 ? 'comentActive':''">
						差评
					</view>
				</view>

				<view class="poup-input">
					<uni-easyinput class="uni-mt-5" trim="all" suffixIcon="paperplane" @iconClick="sendComent"
						v-model="commentText" placeholder="请输入评论" @confirm="sendComent"></uni-easyinput>
				</view>
			</view>
		</uni-popup>

	</view>
</template>


<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: hidden;
	}

	.content-center {
		// padding-top: 180rpx;
		// padding-bottom: 160rpx;
		height: 100%;

	}

	.poup-box {
		padding: 30rpx;

		.choose {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.choose-item {
				padding: 20rpx;
				border: 1px solid #b8b8b8;
				border-radius: 20px;
				width: 200rpx;
				text-align: center;
			}

			.comentActive {
				border: 1px solid rgb(37, 157, 97);
				color: rgb(37, 157, 97);
			}
		}

		.poup-input {
			margin-top: 40rpx;
		}
	}


	.chat-good-status {
		width: 100%;
	}

	.good-status {
		padding: 20rpx;
		background-color: rgb(246, 247, 251);
		width: 100%;

		.no-buy {
			.no-buy-title {
				display: flex;
				justify-content: center;
				font-size: 32rpx;
				line-height: 50rpx;
			}

			.no-buy-sub {
				display: flex;
				justify-content: center;
				font-size: 26rpx;
				color: rgb(126, 127, 127);
				line-height: 50rpx;
			}

			.no-buy-btu {
				margin-top: 20rpx;
				width: 100%;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				border: 1px solid rgb(86, 166, 130);
				border-radius: 10rpx;
				color: rgb(86, 166, 130);
			}
		}
	}

	.good {
		padding: 20rpx;
		width: 100%;
		display: flex;
		background-color: white;
		border-top: 1px solid rgb(204, 204, 204);
		border-bottom: 1px solid rgb(204, 204, 204);

		.good-img {
			width: 100rpx;
			height: 100rpx;
		}

		.good-right {
			margin-left: 20rpx;

			.good-title {
				font-weight: 600;
				font-size: 30rpx;
			}

			.good-price {
				font-size: 26rpx;
			}
		}
	}


	.Css-chat {
		.scroll-view {
			height: 65vh;

			.chat-main {
				// height: 100%;
				padding-left: 20rpx;
				padding-right: 20rpx;
				display: flex;
				flex-direction: column;
			}

			.chat-ls {
				.chat-time {
					font-size: $uni-font-size-sm;
					color: rgb(39, 40, 50, 0.3);
					line-height: 34rpx;
					padding: 20rpx 0;
					text-align: center;
					display: flex;
					white-space: nowrap;
				}

				.xitong {
					width: 100%;
					max-height: 200rpx;
					padding: 20rpx;
					text-align: center;
					border: 1px solid #bcbcbc;
					background-color: white;
					border-radius: 20px;
					margin-bottom: 20rpx;
				}

				.msg-m {
					display: flex;
					padding: 20rpx 0;

					.user-img {
						width: 80rpx;
						height: 80rpx;
						border-radius: 20rpx;
					}

					.message {
						max-width: 500rpx;
						flex: auto;
						position: relative;

						.chat-time {
							position: absolute;
							bottom: -10rpx;

						}

						.time-left {
							transform: translateX(120%);
							right: 0%;
						}

						.time-right {
							transform: translateX(-120%);
							left: 0%;
						}


						.img-left {
							transform: translateX(-160rpx);
							right: 0%;
						}

						.img-right {
							transform: translateX(160rpx);
							left: 0%;
						}
					}

					.msg-text {
						font-size: 32rpx;
						color: rgba(39, 40, 50, 1);
						line-height: 44rpx;
						padding: 18rpx 24rpx;
					}

					.msg-img {
						max-width: 250rpx;
						border-radius: 20rpx;
					}
				}

				.msg-left {
					flex-direction: row;

					.msg-text {
						margin-left: 16rpx;
						background-color: rgb(246, 247, 251);
						border-radius: 0rpx 20rpx 20rpx 20rpx;
					}

					.msg-img {
						margin-left: 16rpx;
					}
				}

				.msg-right {
					flex-direction: row-reverse;

					.msg-text {
						margin-right: 16rpx;
						background-color: rgb(121, 224, 53);
						border-radius: 20rpx 0rpx 20rpx 20rpx;
					}

					.msg-img {
						transform: translateX(95%);

					}
				}
			}
		}
	}

	.Css-input {

		.message-input {
			padding: 25rpx 25rpx 50rpx 25rpx;
			position: fixed;
			bottom: 0%;
			width: 100%;
			background-color: rgb(246, 247, 251);

			.my-input-box {
				width: 100%;

				.my-input {
					width: 95%;
					background-color: white;
					padding: 20rpx;
				}
			}

			.message-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20rpx;
			}

			.message-bottom-left {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 130rpx;
			}

			.message-bottom-right {
				width: 120rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				background-color: rgb(33, 159, 98);
				border-radius: 10rpx;
				color: white;

				&:active {
					opacity: 0.7;
				}
			}
		}
	}
</style>