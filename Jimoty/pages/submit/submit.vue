<template>
	<view class="container">
		<view class="submit-top">
			<view class="submit-top-des">
				发布帖子
			</view>
			<view class="submit-top-btu" @tap="gotoDetail5">
				<view style="display: flex;flex-direction: column;align-items: center;">
					<image class="submit-top-btu-img"
						src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/safa.png"
						mode="aspectFill"></image>
					<view class="submit-top-btu-des">
						单品发布
					</view>
				</view>
			</view>
		</view>

		<view class="submit-grid">
			<view class="submit-grid-des">
				其他类别
			</view>
			<view class="submit-grids">
				<view class="submit-grid" @tap="gotoDetail1">
					<view style="display: flex;flex-direction: column;align-items: center;">
						<image class="submit-grid-img"
							src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/social.png"
							mode="aspectFill"></image>
						<view class="submit-grid-des">
							社交
						</view>
					</view>
				</view>
				<view class="submit-grid" @tap="gotoDetail2">
					<view style="display: flex;flex-direction: column;align-items: center;">
						<image class="submit-grid-img"
							src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/concurrent.png"
							mode="aspectFill">
						</image>
						<view class="submit-grid-des">
							互助
						</view>
					</view>
				</view>
				<view class="submit-grid" @tap="gotoDetail3">
					<view style="display: flex;flex-direction: column;align-items: center;">
						<image class="submit-grid-img"
							src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/teach.png"
							mode="aspectFill"></image>
						<view class="submit-grid-des">
							兴趣
						</view>
					</view>
				</view>
				<view class="submit-grid" @tap="gotoDetail4">
					<view style="display: flex;flex-direction: column;align-items: center;">
						<image class="submit-grid-img"
							src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/adopt.png"
							mode="aspectFill"></image>
						<view class="submit-grid-des">
							领养
						</view>
					</view>
				</view>
			</view>
		</view>


		<view class="submit-imgs">
			<image class="submit-img"
				src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/submitimage1.jpg"
				mode="widthFix"></image>
			<image class="submit-img"
				src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/submitimage2.jpg"
				mode="widthFix"></image>
			<image class="submit-img"
				src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/submitimage3.jpg"
				mode="widthFix"></image>
			<image class="submit-img"
				src="https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/submitimage4.jpg"
				mode="widthFix"></image>
		</view>


		<view class="xuanfu-btu" @tap="gotoDetail5">
			<view style="display: flex;flex-direction: column;align-items: center;">
				<image class="xuanfu-btu-pen" src="../../static/submit/pen.png" mode="aspectFill"></image>
				<view class="xuanfu-btu-des">
					发布
				</view>
			</view>

		</view>
	</view>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue';
	import { store } from '@/uni_modules/uni-id-pages/common/store.js'

	let bool = store.hasLogin


	//   1:社交
	const gotoDetail1 = (index) => {
		if (!bool) {
			uni.navigateTo({
				url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
			})
		}
		uni.navigateTo({
			url: '/pages/submit/resubmit/detailpage1'
		})
	}
	// 2. 兼职
	const gotoDetail2 = (index) => {
		if (!bool) {
			uni.navigateTo({
				url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
			})
		}
		uni.navigateTo({
			url: '/pages/submit/resubmit/detailpage2'
		})
	}

	// 3.教培
	const gotoDetail3 = (index) => {
		if (!bool) {
			uni.navigateTo({
				url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
			})
		}
		uni.navigateTo({
			url: '/pages/submit/resubmit/detailpage3'
		})
	}

	// 4领养
	const gotoDetail4 = (index) => {
		if (!bool) {
			uni.navigateTo({
				url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
			})
		}
		uni.navigateTo({
			url: '/pages/submit/resubmit/detailpage4'
		})
	}

	//5闲置
	const gotoDetail5 = (index) => {
		if (!bool) {
			uni.navigateTo({
				url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
			})
		}
		uni.navigateTo({
			url: '/pages/submit/resubmit/detailpage5'
		})
	}
</script>

<style lang="scss">
	.submit-top {
		margin-top: 20rpx;
		background-color: white;
		padding: 20rpx;

		.submit-top-des {
			font-size: 32rpx;
			line-height: 70rpx;
		}

		.submit-top-btu {
			width: 300rpx;
			height: 150rpx;
			border: 2px solid rgb(209, 209, 209);
			border-radius: 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			&:active {
				opacity: 0.7;
			}


			.submit-top-btu-img {
				width: 70rpx;
				height: 70rpx;

			}

			.submit-top-btu-des {
				font-weight: 600;

			}
		}
	}

	.submit-grid {
		margin-top: 20rpx;
		background-color: white;
		padding: 20rpx;

		.submit-grid-des {
			font-size: 32rpx;
			// line-height: 70rpx;
		}

		.submit-grids {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.submit-grid {
				width: 140rpx;
				height: 140rpx;
				border: 2px solid rgb(209, 209, 209);

				&:active {
					opacity: 0.7;
				}

				.submit-grid-img {
					width: 60rpx;
					height: 60rpx;
				}

				.submit-grid-des {
					font-weight: 600;
					font-size: 25rpx;
				}
			}
		}
	}

	.submit-imgs {
		padding: 20rpx 0;
		margin-top: 20rpx;
		background-color: white;
		width: 100%;

		.submit-img {
			width: 100%;
			height: 100%;
		}
	}


	.xuanfu-btu {
		position: fixed;
		bottom: 50rpx;
		right: 50rpx;
		width: 180rpx;
		height: 180rpx;
		border-radius: 50%;
		background-color: rgb(33, 159, 98);
		box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;

		&:active {
			opacity: 0.7;
		}

		.xuanfu-btu-pen {
			width: 70rpx;
			height: 70rpx;
		}

		.xuanfu-btu-des {
			font-weight: 600;
			color: white;
		}
	}
</style>