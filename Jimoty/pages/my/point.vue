<template>
	<view class="container">
		<view class="member-title">
			持有积分
		</view>


		<view class="point">
			<view class="point-number">
				<view class="number-big">
					<text>{{ balance ? balance: 0 }}</text>
					<view class="number-small">
						pt
					</view>
				</view>
			</view>
		</view>


		<view class="member-bottom-btu1">
			<view class="btu1" @click="openBuy">
				购买选项
			</view>
		</view>

		<view style="padding: 20rpx 0; background-color: white;">
			<uni-section title="交易记录" type="line">
				<view v-for="(item,index) in orderData" :key="index">
					<uni-card title="交易单号" :extra="item.order_no">
						<view class="order-center">
							<view class="order-center-type">
								{{item.type== 'test' ? '充值':'消费'}}
							</view>
							<view class="order-center-number" :class="item.type== 'test' ? 'active' :''">
								{{item.type== 'test' ? item.total_fee / 100:-(item.total_fee / 100)}}
							</view>
						</view>
						<view class="order-center" v-if="item.type != 'test'">
							<view class="order-center-des">
								{{item.custom.des}}
							</view>
						</view>
						<view class="order-time">
							<uni-dateformat :date="item.pay_date ? item.pay_date :item.create_date"
								format='yyyy-MM-dd hh:mm:ss' :threshold="[0,0]"></uni-dateformat>
						</view>

					</uni-card>
				</view>
			</uni-section>
		</view>




		<uni-popup ref="popup" background-color="#fff" @change="change" type="bottom" borderRadius="10px 10px 0px 0px">
			<view class="poup-box">
				<view class="poup-box-top">
					<uni-section title="输入购买的积分" subTitle="1元 = 1Pt" type="line" padding>
						<uni-easyinput type="number" class="uni-mt-5" trim="all" v-model="priceValue"
							placeholder="输入购买的积分" @input="changePrice"></uni-easyinput>
					</uni-section>
				</view>
				<view class="poup-box-center">
					<view class="short-btu" :class="navindex == 0 ? 'active' :''" @tap="changeIndex(0)">
						10
					</view>
					<view class="short-btu" :class="navindex == 1 ? 'active' :''" @tap="changeIndex(1)">
						20
					</view>
					<view class="short-btu" :class="navindex == 2 ? 'active' :''" @tap="changeIndex(2)">
						50
					</view>
					<view class="short-btu" :class="navindex == 3 ? 'active' :''" @tap="changeIndex(3)">
						100
					</view>
				</view>
			</view>
			<view class="poup-box-bottom">
				<view class="poup-box-bottom-btu" @tap="comfirmBuy">
					￥{{ priceValue ? priceValue : 0 }} &nbsp; 立即支付
				</view>
			</view>
		</uni-popup>

		<uni-pay ref="pay" :adpid="adpid" return-url="/pages/order-detail/order-detail" logo="/static/logo.png"
			@success="onSuccess" @create="onCreate"></uni-pay>



		<!-- <view class="member-bottom-btu2">
			<view class="btu2">
				<view class="btu2-left">
					<image class="btu2-left-img" src="../../static/my/point.png" mode="aspectFill"></image>
				</view>
				<view class="btu2-center">
					<view class="center-top">
						什么是期权
					</view>
					<view class="center-center">
						使用点
					</view>
					<view class="center-bottom">
						用更方便的选项来代替它！
					</view>
				</view>
				<uni-icons type="right" size="26" color="#fff"></uni-icons>
			</view>
		</view> -->

	</view>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	const db = uniCloud.database()
	const uid = uniCloud.getCurrentUserInfo().uid

	const popup = ref(null)
	const navindex = ref(-1)
	const priceValue = ref('')

	const pay = ref(null)
	const total_fee = ref(0) // 支付金额，单位分 100 = 1元
	const order_no = ref('') // 业务系统订单号（即你自己业务系统的订单表的订单号）
	const out_trade_no = ref("") // 插件支付单号
	const description = ref("购买point点") // 支付描述
	const type = ref(
		"test"
	) // 支付回调类型 如 recharge 代表余额充值 goods 代表商品订单（可自定义，任意英文单词都可以，只要你在 uni-pay-co/notify/目录下创建对应的 xxx.js文件进行编写对应的回调逻辑即可）
	//qr_code= true, // 是否强制使用扫码支付
	// const openid = ref("") // 微信公众号需要
	const custom = ref({
		des: "用户购买重点"
	})
	const adpid = ref("1000000001") // uni-ad的广告位id

	const balance = ref(0)
	const status = ref(false)

	onMounted(() => {
		// createOrder()
		getBalance()
		getorder()
	})


	const orderData = ref([])
	// 查询账单
	const getorder = async () => {
		if (uid != '') {
			const res = await db.collection('jimoty-pay-order').where({ user_id: uid, status: 1 }).orderBy(
					'pay_date desc')
				.get()
			orderData.value = res.result.data
			console.log(orderData.value);
		} else {
			status.value = true
			uni.showToast({
				title: '您的账号异常',
				icon: 'none'
			})
		}
	}


	// 查看余额
	const getBalance = async () => {
		if (uid != '') {
			const res = await db.collection('uni-id-users').doc(uid).field('balance').get({ getOne: true })
			balance.value = res.result.data.balance / 100

		} else {
			status.value = true
			uni.showToast({
				title: '您的账号异常',
				icon: 'none'
			})
		}
	}

	const changePrice = (e) => {
		navindex.value = -1
		console.log(e, 'lll', typeof e);
	}

	const openBuy = () => {
		popup.value.open()
	}

	// 随机生成一个7位数给订单号
	const generateRandomSevenDigitNumber = () => {
		let randomNumber = Math.floor(Math.random() * 10000000);
		if (randomNumber < 1000000) {
			randomNumber = '0' + randomNumber;
		}
		return randomNumber;
	}

	const comfirmBuy = () => {
		if (status.value) {
			uni.showToast({
				title: '您的账号异常,不能购买!',
				icon: 'none'
			})
			return
		}

		// 确认购买
		uni.showModal({
			content: '是否确认购买',
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定');
					if (priceValue.value != '') {
						// 创建订单
						total_fee.value = Number(priceValue.value) * 100
						// total_fee.value = 1 //TODO 0.01元 临时
						order_no.value = 'jimoty' + Date.now() + generateRandomSevenDigitNumber()

						db.collection('jimoty-pay-order').add({
							total_fee: total_fee.value,
							custom: custom.value,
							order_no: order_no.value,
							type: type.value
						}).then(res => {
							createOrder()
						})
						// popup.value.close()
					} else {
						uni.showToast({
							title: '请输入购买的点数',
							icon: 'none'
						})
					}

				} else if (res.cancel) {
					console.log('用户点击取消');
					popup.value.close()
				}
			}
		})
	}


	const changeIndex = (index) => {
		navindex.value = index
		if (navindex.value == 0) {
			priceValue.value = 10
		} else if (navindex.value == 1) {
			priceValue.value = 20
		} else if (navindex.value == 2) {
			priceValue.value = 50
		} else if (navindex.value == 3) {
			priceValue.value = 100
		}

	}

	/**
	 * 发起支付（不唤起收银台，手动指定支付方式）
	 * 在调用此api前，你应该先创建自己的业务系统订单，并获得订单号 order_no，把order_no当参数传给此api，而示例中为了简化跟支付插件无关的代码，这里直接已时间戳生成了order_no
	 */
	const createOrder = () => {
		out_trade_no.value = `${order_no.value}-1`;
		// 发起支付
		pay.value.createOrder({
			provider: 'wxpay', // 支付供应商
			total_fee: total_fee.value, // 支付金额，单位分 100 = 1元（注意：因为是前端传的，此参数可能会被伪造，回调时需要再校验下是否和自己业务订单金额一致）
			order_no: order_no.value, // 业务系统订单号（即你自己业务系统的订单表的订单号）
			out_trade_no: out_trade_no.value, // 插件支付单号
			description: description.value, // 支付描述
			type: type.value, // 支付回调类型
			// qr_code: qr_code.value, // 是否强制使用扫码支付
			// openid: openid.value, // 微信公众号需要
		})
	}

	// 监听事件 - 支付订单创建成功（此时用户还未支付）
	const onCreate = (res) => {
		console.log('create: ', res);
		// 如果只是想生成支付二维码，不需要组件自带的弹窗，则在这里可以获取到支付二维码 qr_code_image
	}
	// 监听事件 - 支付成功
	const onSuccess = (res) => {
		console.log('success: ', res);
		if (res.user_order_success) {
			// 代表用户已付款，且你自己写的回调成功并正确执行了
			console.log('支付成功');
			// 刷新页面
		} else {
			// 代表用户已付款，但你自己写的回调执行成功（通常是因为你的回调代码有问题）
			uni.showToast({
				title: '该订单异常，请联系管理员!',
				icon: 'none'
			})

		}
		getBalance()
		getorder()
	}
</script>

<style lang="scss" scoped>
	.order-center {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #000;

		.order-center-des {
			margin-top: 20rpx;
			color: #acacac;
		}

		.active {
			color: #ffad08;
		}
	}

	.order-time {
		padding: 20rpx 0;
		color: #acacac;
	}

	.poup-box {
		padding: 20rpx;
		padding-bottom: 50rpx;
		height: 40vh;

		.poup-box-center {
			margin-top: 30rpx;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.short-btu {
				width: 120rpx;
				height: 70rpx;
				text-align: center;
				line-height: 70rpx;
				border-radius: 10px;
				border: 1px solid rgb(204, 204, 204);
			}

			.active {
				border: 1px solid rgb(41, 121, 255);
				color: rgb(41, 121, 255);
				background-color: rgb(231, 242, 255);
			}
		}
	}

	.poup-box-bottom {
		position: fixed;
		bottom: 50rpx;
		width: 100%;
		display: flex;
		justify-content: center;

		.poup-box-bottom-btu {
			width: 80%;
			height: 80rpx;
			font-weight: 600;
			font-size: 32rpx;
			color: white;
			border-radius: 20px;
			background-color: rgb(41, 121, 255);
			box-shadow: 2rpx 3rpx 5rpx rgb(99, 188, 255);
			text-align: center;
			line-height: 80rpx;
		}

	}

	.member-title {
		padding: 20rpx;
		font-size: 28rpx;
		color: #515151;
	}

	.point {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx;
		background-color: white;

		.point-number {
			.number-big {
				position: relative;
				font-size: 50rpx;
				font-weight: 600;

				.number-small {
					position: absolute;
					width: 30rpx;
					right: 0%;
					bottom: 0%;
					transform: translateX(120%);
				}

			}

		}
	}

	.member-bottom-btu1 {
		padding: 20rpx 80rpx;
		background-color: white;

		.btu1 {
			text-align: center;
			line-height: 90rpx;
			width: 100%;
			height: 90rpx;
			border-radius: 10rpx;
			font-size: 38rpx;
			margin-bottom: 40rpx;
			background-color: rgb(29, 146, 78);
			color: white;

			&:active {
				opacity: 0.7;
			}
		}


	}

	.member-bottom-btu2 {
		padding: 40rpx;
		background-color: white;

		.btu2 {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-radius: 10rpx;
			background-color: rgb(29, 146, 78);
			color: white;
			width: 100%;
			padding: 20rpx;

			.btu2-left {
				width: 100rpx;
				height: 100rpx;

				.btu2-left-img {
					width: 100rpx;
					height: 100rpx;
				}
			}

			.btu2-center {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;

				.center-top {
					font-size: 40rpx;
				}

				.center-center {
					font-size: 28rpx;
				}

				.center-bottom {
					font-size: 32rpx;
				}
			}
		}
	}
</style>