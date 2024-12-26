<template>
	<view class="container">
		<view class="addAddress">
			<view class="addAddress-top">
				<text style="font-weight: 600;">地址信息</text>
				<view style="display: flex;align-items: center; font-size: 24rpx;">
					<view class="addAddress-top-check" @tap="choose" :class="ifdefault?'active':''"></view>
					默认收货地址
				</view>
			</view>


			<view class="example">
				<!-- 基础表单校验 -->
				<uni-forms ref="form" :rules="rules" :modelValue="valiFormData">
					<uni-forms-item label="联系人" required name="name">
						<uni-easyinput v-model="valiFormData.name" placeholder="请输入姓名" />
					</uni-forms-item>
					<uni-forms-item label="手机号" required name="phone">
						<uni-easyinput v-model="valiFormData.phone" placeholder="请输入手机号" />
					</uni-forms-item>
					<uni-forms-item label="所在地区" required name="country">
						<view style="background-color: white;">
							<uni-data-picker clear-icon="false" placeholder="请选择所在地区" popup-title="请选择城市"
								collection="opendb-city-china" field="code as value, name as text" orderby="value asc"
								:step-searh="true" self-field="code" parent-field="parent_code" @change="onchange">
							</uni-data-picker>
						</view>
					</uni-forms-item>
					<uni-forms-item label="详细地址" required name="address">
						<uni-easyinput type=textarea auto-height="true" maxlength="50" v-model="valiFormData.address"
							placeholder="请输入详细地址" />
					</uni-forms-item>
				</uni-forms>

			</view>

		</view>

		<view class="page-bottom">
			<view class="add-address" @tap="submit">
				保存
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';

	const ifdefault = ref(false)

	const valiFormData = ref({
		name: '',
		phone: '',
		country: '',
		address: ''
	})

	// 默认收货地址
	const choose = () => {
		ifdefault.value = !ifdefault.value
	}

	// 选择地区
	const onchange = (e) => {
		const value = e.detail.value
		console.log(value, 'kkkkkkkkkkkkkkkkk');
	}


	const submit = () => {
		form.value.validate().then(res => {
			console.log('success', res);
			uni.showToast({
				title: `已保存`
			})




		}).catch(err => {
			console.log('err', err);
		})
	}


	const form = ref(null)

	// 校验规则
	const rules = ref({
		phone: {
			rules: [{
					required: true,
					errorMessage: '请输入电话号码',
				},
				{
					pattern: /^1[3-9]\d{9}$/,
					errorMessage: '请输入正确的手机号',
				}
			]
		},
		name: {
			rules: [{
				required: true,
				errorMessage: '请输入名字',
			}]
		},
		country: {
			rules: [{
				required: true,
				errorMessage: '请选择城市',
			}]
		},
		address: {
			rules: [{
				required: true,
				errorMessage: '请输入详细地址',
			}]
		}
	})
</script>

<style lang="scss">
	.addAddress {
		padding: 20rpx;

		.addAddress-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;

			.addAddress-top-check {
				width: 20px;
				height: 20px;
				border-radius: 50%;
				border: 1rpx solid #e1e1e1;
				background-color: white;
				margin-right: 20rpx;
			}

			.active {
				background-color: $uni-color-success;
				position: relative;

				&::after {
					content: "✔";
					color: white;
					font-size: 20rpx;
					text-align: center;
					position: absolute;
					top: 5rpx;
					left: 10rpx;
					font-family: Arial, Helvetica, sans-serif;
				}
			}
		}
	}

	.page-bottom {
		display: flex;
		align-items: center;
		width: 100%;
		font-weight: 600;
		position: fixed;
		background-color: white;
		padding: 20rpx;
		bottom: 30rpx;
		font-size: 28rpx;


		.add-address {
			flex: 1;
			margin-left: 20rpx;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			border-radius: 20px;
			background-color: $uni-color-success;
		}
	}
</style>