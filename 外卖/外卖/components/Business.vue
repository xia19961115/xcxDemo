<template>
	<view>
		<view>
			<view class="business-view">
				<view class="business-take">
					<view class="business-img">
						<image :src="busidata.logo" mode="aspectFill"></image>
					</view>
					<view class="business-right">
						<text class="business-title">{{busidata.shop}}</text>
						<view class="business-time">
							<image src="/static/coen/shijian.svg" mode="widthFix"></image>
							<text>配送约{{busidata.duration}}分钟</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:['busidata'],
		data() {
			return {
				// busidata: ''
			};
		}
	}
</script>

<style scoped>
	text {
		display: block;
	}

	.business-view {
		height: 130rpx;
		background: linear-gradient(to top, #ffe566 10%, #ffd300 100%);
		border-bottom-left-radius: 10rpx;
		border-bottom-right-radius: 10rpx;

	}

	/* 1 */
	.business-img image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}

	.business-img {
		width: 150rpx !important;
		height: 120rpx !important;
		padding-right: 20rpx;
	}

	.business-time image {
		width: 27rpx;
		height: 27rpx;
		padding-right: 9rpx;
	}

	.business-time {
		display: flex;
		align-items: center;
		font-size: 27rpx;
		height: 40rpx;
		line-height: 40rpx;
	}

	.business-take {
		display: flex;
		height: 130rpx;
		padding: 0 10rpx;
	}

	.business-right {
		width: 100%;
	}

	.business-title {
		font-size: 37rpx;
		margin-bottom: 19rpx;
		display: block;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
</style>
