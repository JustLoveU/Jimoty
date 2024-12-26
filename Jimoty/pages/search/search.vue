<template>
	<view class="container">
		<view class="search-container">
			<!-- 搜索框 -->
			<view class="search-container-bar">
				<!-- #ifdef APP-PLUS -->
				<uni-icons class="search-icons" :color="iconColor" size="22" type="mic-filled" @click="speech" />
				<!-- #endif -->
				<!-- :cancelText="keyBoardPopup ? '取消' : '搜索'" -->
				<uni-search-bar ref="searchBar" style="flex:1;" radius="100" v-model="searchText" :focus="focus"
					:placeholder="hotWorld" clearButton="auto" cancelButton="always" @clear="clear" @confirm="confirm"
					:cancelText="keyBoardPopup ? '取消' : '搜索'" />
			</view>
		</view>

		<view class="submit-row1" @tap="openCategery">
			<view class="submit-row1-left">
				选择类别
			</view>
			<view class="submit-row1-right">
				<view class="submit-row1-right-des" v-if="categeryData.length>0">
					<view class="breadcrumb-item" v-for="(item,index) in categeryData" :key="index">
						{{item}}
					</view>
				</view>
				<uni-icons type="right" size="22"></uni-icons>
			</view>
		</view>

		<view class="search-body" v-if="!associativeShow">
			<!-- 搜索历史 -->
			<view class="word-container" v-if="localSearchList.length">
				<view class="word-container_header">
					<text class="word-container_header-text">搜索历史</text>
					<uni-icons v-if="!localSearchListDel" @click="localSearchListDel = true" class="search-icons"
						style="padding-right: 0;" :color="iconColor" size="18" type="trash"></uni-icons>
					<view v-else class="flex-center flex-row" style="font-weight: 500;justify-content: space-between;">
						<text
							style="font-size: 22rpx;color: #666;padding-top:4rpx;padding-bottom:4rpx;padding-right:20rpx;"
							@click="LocalSearchListClear">全部删除</text>
						<text
							style="font-size: 22rpx;color: #c0402b;padding-top:4rpx;padding-bottom:4rpx;padding-left:20rpx;"
							@click="localSearchListDel = false">完成</text>
					</view>
				</view>

				<view class="word-container_body">
					<view class="flex-center flex-row word-container_body-text" v-for="(word,index) in localSearchList"
						:key="index" @click="LocalSearchlistItemClick(word,index)">
						<text class="word-display" :key="word">{{word}}</text>
						<uni-icons v-if="localSearchListDel" size="12" type="closeempty" />
					</view>
				</view>
			</view>


			<view class="word-container_body_notice">
				<view class="search-hot">
					<view class="search-hot-item" v-for="(item,index) in NoticeConditons" :key="index">
						<view class="search-hot-item-left">
							<view class="search-hot-item-left-text">
								{{item.text_condition}}
							</view>
							<view class="search-hot-item-left-sub">
								类别--{{ item.name }}
							</view>
							<view class="search-hot-item-left-sub">
								{{item.positon_condition.address}}
								&nbsp;/&nbsp;{{item.positon_condition.length / 1000}}km以内
							</view>
						</view>
						<view class="search-hot-item-right" @tap.stop="setNotice(item)">
							<uni-icons type="more-filled" size="24" color="rgb(159, 159, 159)"></uni-icons>
						</view>
					</view>
				</view>

			</view>

		</view>


		<!-- 搜索联想 -->
		<view class="search-associative" v-else>
			<homeGoods :data="commentData"></homeGoods>
		</view>

	</view>
</template>

<script>
	import { nextTick } from 'vue';
	let udb;
	let db = uniCloud.database()
	let dbCmd = db.command
	/**
	 * 云端一体搜索模板
	 * @description uniCloud云端一体搜索模板，自带下拉候选、历史搜索、热搜。无需再开发服务器代码
	 */
	const searchLogDbName = 'opendb-search-log'; // 搜索记录数据库
	const mallGoodsDbName = 'jimoty-post'; // 文章数据库
	const associativeSearchField = 'content'; // 联想时，搜索框值检索数据库字段名
	const associativeField = '_id,content'; // 联想列表每一项携带的字段
	const localSearchListKey = '__local_search_history'; //	本地历史存储字段名

	// 数组去重
	const arrUnique = arr => {
		for (let i = arr.length - 1; i >= 0; i--) {
			const curIndex = arr.indexOf(arr[i]);
			const lastIndex = arr.lastIndexOf(arr[i])
			curIndex != lastIndex && arr.splice(lastIndex, 1)
		}
		return arr
	}
	// 节流
	// 防抖
	function debounce(fn, interval, isFirstAutoRun) {
		/**
		 * 
		 * @param {要执行的函数} fn 
		 * @param {在操作多长时间后可再执行，第一次立即执行} interval 
		 */
		var _self = fn;
		var timer = null;
		var first = true;

		if (isFirstAutoRun) {
			_self();
		}

		return function() {
			var args = arguments;
			var _me = this;
			if (first) {
				first = false;
				_self.apply(_me, args);
			}

			if (timer) {
				clearTimeout(timer)
				// return false;
			}

			timer = setTimeout(function() {
				clearTimeout(timer);
				timer = null;
				_self.apply(_me, args);
			}, interval || 300);
		}
	}

	export default {
		data() {
			return {
				mallGoodsDbName,
				searchLogDbName,
				statusBarHeight: '0px',
				localSearchList: uni.getStorageSync(localSearchListKey),
				localSearchListDel: false,
				netHotListIsHide: false,
				searchText: '',
				iconColor: '#999999',
				keyBoardPopup: false,
				hotWorld: '无聊的日子刷刷~', //	搜索热词，如果没有输入即回车，则搜索热词，但是不会加入搜索记录
				focus: true, //	是否自动聚焦
				speechEngine: 'iFly', //	语音识别引擎 iFly 讯飞 baidu 百度
				commentData: [], //搜索结果
				Inoperation1: false,
				categeryData: [],
				categeryStr: '',
				categeryId: '', //类目条件
				userId: uniCloud.getCurrentUserInfo().uid,
				longitude: 113.038530, //搜索的基点
				latitude: 28.135795,
				searchLength: 10000, //范围
				searchAddress: '', //搜索的基地址
				searchConditons: [],
				NoticeConditons: [],
				categoryArr: [], //相关的子类目
				ifTimer: null,
				ifOperate: false
			}
		},
		created() {
			this.searchLogDb = db.collection(this.searchLogDbName);
			this.mallGoodsDb = db.collection(this.mallGoodsDbName);

			this.searchText = getApp().globalData.searchText;
		},


		computed: {
			associativeShow() {
				return this.searchText && this.commentData.length > 0;
			}
		},
		onShow() {
			// 获取当前的地理位置和搜索距离
			let historyCity = uni.getStorageSync('HistoryCity')
			if (historyCity) {
				this.longitude = Number(historyCity.longitude)
				this.latitude = Number(historyCity.latitude)
				this.searchLength = Number(historyCity.length)
				this.searchAddress = historyCity.city
				console.log(typeof this.longitude, this.latitude, 'nnnnnnn');

			} else {
				uni.showToast({
					title: '暂未设置地理位置，请去首页设置',
					icon: 'none'
				})
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/home/home'
					})
				}, 500)
			}

		},



		onLoad() {
			//#ifdef APP-PLUS
			this.statusBarHeight = `${uni.getSystemInfoSync().statusBarHeight}px`;
			//#endif


			this.handleNotice()

			uni.$on('categerySearchData', (res) => {

				this.categeryData = res.categery
				this.categeryId = res.id
				this.categeryData.forEach(res => {
					this.categeryStr = this.categeryStr + res
				})


				// 查询相关的子类目
				this.getCatogoryData(this.categeryId)

			})

			uni.$on('refashHome', (data) => {
				let index = this.commentData.findIndex(obj => obj._id._value == data.post_id);
				nextTick(() => {
					if (this.commentData[index].isCollect) {
						this.commentData[index].isCollect = false
					} else {
						this.commentData[index].isCollect = true
					}
				})
			})
		},

		onUnload() {
			uni.$off('categerySearchData')
			uni.$off('refashHome')
		},

		methods: {
			handleNotice() {
				let localSearchNotice = uni.getStorageSync('localSearchNotice')
				if (!localSearchNotice) {
					uni.setStorageSync('localSearchNotice', [])
				} else {
					localSearchNotice = localSearchNotice.slice(0, 20)
					this.NoticeConditons = localSearchNotice
				}

				if (this.NoticeConditons.length > 0) {
					this.NoticeConditons.forEach(async (item) => {
						const res = await db.collection('jimoty-category').doc(item.category_condition).field(
							'name').get({ getOne: true })

						item.name = res.result.data.name
					})
				}
			},

			async getCatogoryData(categeryId) {
				await db.collection('jimoty-category').field('_id,name').get({
					getTree: {
						limitLevel: 2,
						startWith: `_id=="${categeryId}"`
					}
				}).then(res => {
					if (res.result.data.length > 0) {
						this.categoryArr = this.getAllValues(res.result.data[0])
					}
				})
			},

			getAllValues(tree) {
				try {
					let values = [];

					function traverse(node) {
						values.push(node._id);
						if (node.children) {
							for (let i = 0; i < node.children.length; i++) {
								traverse(node.children[i]);
							}
						}

					}

					traverse(tree);
					return values;
				} catch (e) {
					//TODO handle the exception
				}
			},
			// 打开类目
			openCategery() {
				uni.navigateTo({
					url: `/pages/submit/datapage?index=1`
				})
			},

			// 将获得的最新最热的关键词传给hotword
			handleHot(res) {
				// this.hotWorld = res[0].content
				this.searchConditons = res
			},
			clear(res) {
				console.log("res: ", res);
				this.searchText = '';
				this.commentData = []
			},
			confirm(res) {
				if (this.ifOperate) return
				this.ifOperate = true
				// 键盘确认
				if (this.searchText === '') res.value = this.hotWorld
				// if (this.searchText === '') {
				// 	// res.value = this.hotWorld
				// 	uni.showToast({
				// 		title: '请输入搜索内容',
				// 		icon: 'none'
				// 	})
				// 	return
				// }

				if (this.categeryId != '') {
					// 将该搜索条件作为notice存起来
					console.log('保存通知', res.value);
					this.addSearchNotice(res.value)
				}


				this.search(res.value);
			},

			input(e) {
				if (this.ifOperate) return
				this.ifOperate = false
				if (this.ifTimer != null) return
				if (this.searchText == "") return
				console.log('watch');
				this.getCommentDate(e)

				setTimeout(() => {
					clearTimeout(this.ifTimer)
					this.ifTimer = null
				}, 2000)

			},
			localSearchListManage(word) {
				let list = uni.getStorageSync(localSearchListKey);
				if (list.length) {
					this.localSearchList.unshift(word);
					arrUnique(this.localSearchList);
					if (this.localSearchList.length > 6) {
						this.localSearchList.pop();
					}
				} else {
					this.localSearchList = [word];
				}
				uni.setStorageSync(localSearchListKey, this.localSearchList);
			},
			LocalSearchListClear() {
				uni.showModal({
					content: "确认清空搜索历史吗",
					confirmText: "删除",
					confirmColor: 'red',
					cancelColor: '#808080',
					success: res => {
						if (res.confirm) {
							this.localSearchListDel = false;
							this.localSearchList = [];
							uni.removeStorageSync(localSearchListKey)
						}
					}
				});
			},
			LocalSearchlistItemClick(word, index) {
				if (this.localSearchListDel) {
					this.localSearchList.splice(index, 1);
					uni.setStorageSync(localSearchListKey, this.localSearchList);
					if (!this.localSearchList.length) {
						this.localSearchListDel = false;
					}
					return;
				}
				if (word) {
					if (this.searchText !== word) {
						this.searchText = word
					}
					this.localSearchListManage(word)
					this.searchLogDbAdd(word)
				}
			},
			cancel(res) {
				// uni.hideKeyboard();
				// this.searchText = '';
				// this.commentData = []
			},
			search(value) {
				if (!value && !this.hotWorld) {
					return;
				}
				if (value) {
					if (this.searchText !== value) {
						this.searchText = value
					}
					this.localSearchListManage(value)
					this.searchLogDbAdd(value)
				} else if (this.hotWorld) {
					this.searchText = this.hotWorld

				}
				this.getCommentDate(value)
				uni.hideKeyboard();
			},

			searchHotRefresh() {
				this.$refs.udb.refresh();
				this.$refs.udbNotice.refresh();
			},
			speech() {
				// #ifdef APP-PLUS
				plus.speech.startRecognize({
					engine: this.speechEngine,
					punctuation: false, // 标点符号 
					timeout: 10000
				}, word => {
					word = word instanceof Array ? word[0] : word;
					this.search(word)
				}, err => {
					console.error("语音识别错误: ", err);
				});
				// #endif
			},

			setNotice(data) {
				console.log(data);
				uni.showModal({
					content: '是否添加为设置保留的通知',
					success: async function(res) {
						if (res.confirm) {
							// 先查询有没有相同的，
							const count = await db.collection('jimoty-search').where({
								userId: this.userId,
								category_condition: data.category_condition,
								text_condition: data.text_condition,
								positon_condition: {
									address: data.positon_condition.address,
									point: [data.positon_condition.longitude, data.positon_condition
										.latitude
									],
									length: data.positon_condition.length
								}
							}).count()

							if (count.result.total == 0) {
								db.collection('jimoty-search').add({
									positon_condition: {
										address: data.positon_condition.address,
										point: [data.positon_condition.longitude, data
											.positon_condition.latitude
										],
										length: data.positon_condition.length
									},
									category_condition: data.category_condition,
									text_condition: data.text_condition
								})

								uni.showToast({
									title: '添加成功',
									icon: 'none'
								})
							} else {
								uni.showToast({
									title: '已添加',
									icon: 'error'
								})
							}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},


			// 获取数据
			async getCommentDate(text) {
				this.commentData = []
				console.log('搜索关键字：', text);
				uni.showLoading({
					title: '加载中'
				})
				// 判断搜索距离内的数据
				try {
					let postArr
					if (this.categoryArr.length > 0) {
						postArr = await db.collection('jimoty-post').where({
							category: dbCmd.in(this.categoryArr),
							point: dbCmd.geoNear({
								geometry: new db.Geo.Point(this.longitude, this.latitude),
								maxDistance: this.searchLength,
								minDistance: 0
							})
						}).field('_id').get()
						postArr = postArr.result.data.map((item) => {
							return item._id
						})


					} else {
						postArr = await db.collection('jimoty-post').where({
							point: dbCmd.geoNear({
								geometry: new db.Geo.Point(this.longitude, this.latitude),
								maxDistance: this.searchLength,
								minDistance: 0
							})
						}).field('_id').get()
						postArr = postArr.result.data.map((item) => {
							return item._id
						})

					}

					const temp1 = db.collection('jimoty-post').where({
							_id: dbCmd.in(postArr),
							delete: 1,
							status: dbCmd
								.in([2, 5])
						})
						.getTemp()
					const temp2 = db.collection('uni-id-users').field('_id,nickname,avatar_file.url')
						.getTemp()
					const temp3 = db.collection('jimoty-collect').field('_id,post_id,user_id,clickTime').getTemp()
					const temp4 = db.collection('jimoty-category').field('_id,name,parent_id').getTemp()
					//mainText: new RegExp(text, 'g')

					db.collection(temp1, temp2, temp3, temp4).where({
							noteTitle: new RegExp(text, 'g'),
						}).orderBy(
							'weight desc,browse desc,create_date desc')
						.skip(this
							.commentData
							.length)
						.limit(15)
						.get().then(async (res) => {
							let arr1 = await this.handleSuccess(res.result.data)
							this.commentData = [...this.commentData, ...Array.from(arr1)]
							if (this.commentData.length < 1) {
								uni.showToast({
									title: '没有搜索到结果',
									icon: 'none'
								})
							}

							uni.hideLoading()
							this.ifOperate = false

						})



				} catch (e) {
					//TODO handle the exception
					uni.showToast({
						title: '搜索失败',
						icon: 'none'
					})
					console.log(e);
					uni.hideLoading()
					this.ifOperate = false
				}

			},
			async addSearchNotice(text) {
				let bool = true
				let position = {
					address: this.searchAddress,
					point: [this.longitude, this.latitude],
					length: this.searchLength
				}
				// 先查询有没有相同的，添加到本地
				const localSearchNotice = uni.getStorageSync('localSearchNotice')
				if (localSearchNotice) {
					localSearchNotice.forEach((item) => {
						if (item.text_condition == text && item.category_condition == this
							.categeryId && item.positon_condition.address == this.searchAddress && item
							.positon_condition.length == this.searchLength && item.positon_condition.point[
								0] == this.longitude && item.positon_condition.point[1] == this.latitude
						) {
							bool = false
						}
					})
					console.log('boollll', bool);
					if (bool) {
						// 不存在则添加到本地
						localSearchNotice.push({
							text_condition: text,
							category_condition: this.categeryId,
							positon_condition: position,
						})

						this.$nextTick(() => {
							uni.setStorageSync('localSearchNotice', localSearchNotice)
							this.handleNotice()
						})
					}

				} else {
					console.log('localSearchNotice不存在');
				}

			},
			noticeSearch() {
				// 根据保存的搜索条件搜索
			},

			getDeviceId() {
				return new Promise((resolve, reject) => {
					const uniId = uni.getStorageSync('uni_id');
					if (!uniId) {
						// #ifdef APP-PLUS
						plus.device.getInfo({
							success: (deviceInfo) => {
								resolve(deviceInfo.uuid)
							},
							fail: () => {
								resolve(uni.getSystemInfoSync().system + '_' + Math.random().toString(
									36).substr(2))
							}
						});
						// #endif
						// #ifndef APP-PLUS
						resolve(uni.getSystemInfoSync().system + '_' + Math.random().toString(36).substr(2))
						// #endif
					} else {
						resolve(uniId)
					}
				})
			},


			searchLogDbAdd(value) {
				/*
					在此处存搜索记录，如果登录则需要存 user_id，若未登录则存device_id
				 */
				this.getDeviceId().then(device_id => {
					this.searchLogDb.add({
						// user_id: device_id,
						device_id,
						content: value,
						create_date: Date.now()
					})
				})
			},


			// 数据处理
			async handleSuccess(arr) {
				let collectArr = arr.map((item) => {
					return item._id._value
				})

				let likeArr = await db.collection('jimoty-collect').where({
					post_id: dbCmd.in(collectArr),
					user_id: uniCloud.getCurrentUserInfo().uid
				}).get()

				arr.forEach((item, index) => {
					let localIndex = likeArr.result.data.findIndex(find => {
						return item._id._value == find.post_id
					})
					if (localIndex !== -1) {
						item.isCollect = true
					}
				})
				return arr
			}

		},

		watch: {
			searchText: debounce(function(value) {
				if (value) {
					if (this.ifOperate) return
					this.ifOperate = true
					if (this.ifTimer != null) return
					if (this.searchText == "") return
					console.log('watch');
					this.getCommentDate(value)

				} else {
					this.commentData.length = 0;
					getApp().globalData.searchText = '';
				}
			}, 200)
		},

	}
</script>

<style>
	page {
		height: 100%;
		flex: 1;
	}
</style>

<style lang="scss" scoped>
	$search-bar-height: 52px;
	// $word-container_header-height: 72rpx;

	.word-container_body_notice {
		.word-container_body-info {
			display: flex;
			justify-content: center;
			padding: 20rpx 0;
		}

		.search-hot {
			padding: 0 20rpx 20rpx 20rpx;
			width: 100%;

			.search-hot-top {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #dedede;
				margin-bottom: 20rpx;

				.search-hot-btu {
					width: 140rpx;
				}

				.search-hot-title {
					font-size: 30rpx;
				}
			}



			.search-hot-item {
				border-bottom: 1px solid #dedede;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.search-hot-item-left {
					padding: 20rpx 0;

					.search-hot-item-left-text {
						font-size: 30rpx;
						color: black;
					}

					.search-hot-item-left-sub {
						color: rgb(156, 156, 156);
						font-size: 24rpx;
						margin-top: 15rpx;
					}
				}

				&:active {
					opacity: 0.7;
				}
			}
		}
	}



	.search-container {
		background-color: white;
	}

	.submit-row1 {
		margin-top: 20rpx;
		background-color: white;
		padding: 0 20rpx;
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.submit-row1-right {
			display: flex;
			align-items: center;

			.submit-row1-right-des {
				display: flex;
				align-items: center;

				.breadcrumb-item:not(:first-child)::before {
					content: '>';
					margin-left: 15rpx;
				}

			}
		}
	}

	.search-body {
		background-color: #fff;
		border-bottom-right-radius: 10px;
		border-bottom-left-radius: 10px;
	}

	.word-container {
		margin-bottom: 10rpx;

		.word-container_header {
			display: flex;
			justify-content: space-between;
			padding: 0 20rpx;
			margin-bottom: 10rpx;
		}

		.word-container_body {
			display: flex;
			flex-wrap: wrap;

			.word-container_body-text {
				background-color: #f1f1f1;
				color: #505050;
				font-size: 26rpx;
				margin: 10rpx 15rpx;
				padding: 10rpx;
				border-radius: 10rpx;
			}
		}

		.word-container_body-info {
			color: #505050;
			font-size: 26rpx;
			padding: 20rpx;
		}

		.word-container_body {
			color: #505050;
			font-size: 26rpx;
			padding: 20rpx;
		}
	}
</style>