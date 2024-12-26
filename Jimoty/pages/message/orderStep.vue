<script setup>
	import { ref } from 'vue';
	import { onPullDownRefresh } from '@dcloudio/uni-app'

	const status = ref('loading')

	setTimeout(() => {
		status.value = 'noMore'
	}, 500)

	const active = ref(1)

	const list1 = ref([{
		title: '买家下单',
		desc: '2018-11-11'
	}, {
		title: '卖家发货',
		desc: '2018-11-12'
	}, {
		title: '买家签收',
		desc: '2018-11-13'
	}, {
		title: '交易完成',
		desc: '2018-11-14'
	}])

	// 改变状态
	const change = () => {
		if (active.value < list1.value.length - 1) {
			active.value += 1
		} else {
			active.value = 0
		}
	}
</script>

<template>
	<view class="container">
		<view class="orderstep">
			<uni-steps :options="list1" :active="active" />
			<!-- <button type="primary" size="mini" style="margin: 30px 1z0px; width: 100px;" @click="change">改变状态</button> -->
		</view>

		<view class="order-detail">

			<view class="des-top-des">
				<image class="good-img" src="../../static/logo.png" mode="aspectFill"></image>
				<view class="good-des ellipsis">
					描述描述描述描述
				</view>
			</view>
			<view class="top-bottom">
				<text>成交价</text>
				<text>￥340.00</text>
			</view>

			<view class="des-center">
				<uni-list>

					<uni-list-item title="订单编号" rightText="1111111111111" />
					<uni-list-item title="收货地址" rightText="湖南省长沙市天心区" />
					<uni-list-item title="买家昵称" rightText="小心" />
					<uni-list-item title="下单时间" rightText="2024-08-20 01:18:43" />
					<uni-list-item title="付款时间" rightText="2024-08-20 01:18:43" />
					<uni-list-item title="发货时间" rightText="2024-08-20 01:18:43" />
				</uni-list>
			</view>
		</view>

		<view class="nomore">
			<uni-load-more :status="status" />
		</view>
	</view>
</template>



<style lang="scss">
	.orderstep {
		margin-top: 20rpx;
		padding: 20rpx;
		width: 100%;
		border-radius: 20px;
		background: linear-gradient(to right, #fcfcfc, #b6f5e0);
	}

	.order-detail {
		padding: 20rpx;
		background-color: white;
		margin-top: 30rpx;

		.des-top-des {
			display: flex;
			align-items: center;

			.good-img {
				width: 140rpx;
				height: 140rpx;
				border-radius: 10px;

			}

			.good-des {
				flex: 1;
				font-size: 26rpx;
				margin-left: 20rpx;
			}
		}

		.top-bottom {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 0;
		}

		.des-center {
			margin-top: 20rpx;
		}
	}
</style>