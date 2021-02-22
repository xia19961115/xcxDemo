<template>
	<view class="prefer-content">
		<!-- 标题 -->
		<view class="prefer-title">为你优选</view>
		<!-- Y轴滚轮图片 -->
		<scroll-view scroll-x="true" class="scroll" scroll-with-animation="true">
			<view class="prefer-dis">
				<block v-for="(item, index) in preferlist" :key="index">
					<view class="prefer-view">
						<image :src="item.image" mode="aspectFill"></image>
						<text>{{item.title}}</text>
						<text>{{item.lable}}</text>
					</view>
				</block>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props: ['preferlist'],
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.prefer-content {
		margin: 30rpx 0;

		.prefer-title {
			font-size: 35rpx;
			height: 50rpx;
			line-height: 50rpx;
			margin-bottom: 20rpx;
		}

		.scroll {
			white-space: nowrap;
			width: 100%;
			height: 300rpx;

			.prefer-dis {
				display: flex;
				justify-content: space-between;

				.prefer-view {
					height: 300rpx;
					width: 300rpx;
					padding: 0 8rpx;

					image {
						width: 300rpx;
						height: 200rpx;
						border-radius: 8rpx;
					}

					view:nth-child(2) {
						padding: 0 7rpx !important;
					}

					text {
						height: 45rpx;
						line-height: 45rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;

						&:nth-child(2) {
							font-size: 30rpx;
						}

						&:nth-child(3) {
							font-size: 27rpx;
							color: #9c9c9c;
						}

					}

				}
			}
		}
	}

</style>
