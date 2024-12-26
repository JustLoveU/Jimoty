<template>
	<view class="container">


		<view class="other" v-if="type == 1">
			<view class="other-title">
				<!-- 限定为同性的情况下，需要输入你的个人资料中的性别 -->
				请选择限定的性别
			</view>
			<view class="other-content">
				<view class="other-content-item" @tap="cheack('男')">
					<view class="other-content-item-left">
						<!-- <uni-icons v-if="chooseText == '限定'" type="checkmarkempty" size="20"></uni-icons> -->
						<view class="item-left-text">
							男
						</view>
					</view>
					<uni-icons type="right" size="24"></uni-icons>
				</view>

				<view class="other-content-item" @tap="cheack('女')">
					<view class="other-content-item-left">
						<!-- <uni-icons v-if="chooseText == '限定'" type="checkmarkempty" size="20"></uni-icons> -->
						<view class="item-left-text">
							女
						</view>
					</view>
					<uni-icons type="right" size="24"></uni-icons>
				</view>

				<view class="other-content-item" @tap="cheack('没有限定')">
					<view class="other-content-item-left">
						<!-- <uni-icons v-if="chooseText == '没有限定'" type="checkmarkempty" size="20"></uni-icons> -->
						<view class="item-left-text">
							没有限定
						</view>
					</view>
					<uni-icons type="right" size="24"></uni-icons>
				</view>

			</view>
		</view>


		<view class="other" v-else-if="type == 2">
			<view class="other-title">
				<!-- 限定为年龄的情况下，需要输入你的个人资料中的年龄 -->
				请选择限定的性别
			</view>
			<view class="other-content">
				<view class="other-content-item" @tap="cheackage('限定')">
					<view class="other-content-item-left">
						<!-- <uni-icons v-if="chooseText == '限定'" type="checkmarkempty" size="20"></uni-icons> -->
						<view class="item-left-text">
							限定
						</view>
					</view>
					<uni-icons type="right" size="24"></uni-icons>
				</view>

				<view class="other-content-item" @tap="cheackage('没有限定')">
					<view class="other-content-item-left">
						<!-- <uni-icons v-if="chooseText == '没有限定'" type="checkmarkempty" size="20"></uni-icons> -->
						<view class="item-left-text">
							没有限定
						</view>
					</view>
					<uni-icons type="right" size="24"></uni-icons>
				</view>

			</view>
			<view class="slider-box" v-if="chooseAge">
				<s-region-slider :fillValue=100 :minValue="minValue" :maxValue="maxValue" :step="1" @up="up" />
				<button class="mybtu" size="mini" @tap="choooseMyage">确认</button>
			</view>
		</view>

	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app'
	import sRegionSlider from '@/components/s-region-slider/s-region-slider.vue'


	const type = ref(0)

	const minValue = ref(18) // 可以指定默认值
	const maxValue = ref(40) // 可以指定默认值

	onLoad((e) => {
		console.log(e);
		type.value = e.index
	})


	const chooseText = ref('没有限定')
	const chooseAge = ref(false)

	function move(e) {
		// e中包含了原有的e信息, 并添加了custom对象
		minValue.value = e.custom.minValue;
		maxValue.value = e.custom.maxValue;
	}

	// 选择限定条件
	function cheack(text) {
		if (text == '男') {
			uni.$emit('condition', '男')
			uni.navigateBack()
		} else if (text == '女') {
			uni.$emit('condition', '女')
			uni.navigateBack()
		} else if (text == '没有限定') {
			uni.$emit('condition', '没有限定')
			uni.navigateBack()
		}
		chooseText.value = text
	}

	// 选择限定条件
	function cheackage(text) {
		if (text == '限定') {
			// chooseAge.value = false
			// uni.$emit('conditionAge', '限定')
			// uni.navigateBack()
			chooseAge.value = true
		} else {
			chooseAge.value = false
			uni.$emit('conditionAge', '没有限定')
			uni.navigateBack()
		}
		chooseText.value = text
	}

	function up(e) {
		minValue.value = e.custom.minValue;
		maxValue.value = e.custom.maxValue;
		console.log(e, 'ooo');
	}


	function choooseMyage() {
		console.log(minValue.value, 'aaaaaaaaaa', maxValue.value);
		uni.$emit('conditionAge', [minValue.value, maxValue.value])
		uni.navigateBack()
	}
</script>

<style lang="scss">
	.other {
		padding: 20rpx;
		background-color: white;
	}

	.other-title {
		border-bottom: 1px solid #c3c3c3;
		line-height: 40rpx;
	}

	.other-content {
		.slider-box {
			margin-top: 30rpx;
			padding: 20rpx;
			background-color: white;
			position: relative;

			.mybtu {
				background-color: rgb(33, 159, 98);
				color: white;
				position: absolute;
				left: 0;
				bottom: 0;
			}
		}

		.other-content-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #c3c3c3;
			padding: 20rpx 0;
		}

		.other-content-item-left {
			display: flex;
			align-items: center;

			.item-left-text {
				margin-left: 20rpx;
			}
		}
	}
</style>