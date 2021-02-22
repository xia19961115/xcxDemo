<template>
	<view class="order-no" v-if="modaishow">
		<image src="/static/coen/meoyopu.png" mode="widthFix"></image>
		<text>{{tips}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tips: '',
				modaishow: false
			}
		},
		methods:{
			init(bull,tips){
				this.modaishow = bull,
				this.tips = tips
			}
		}
	}
</script>

<style scoped>
	.order-no {
		width: 400rpx;
		height: 400rpx;
		margin: 90rpx auto 0 auto;
		text-align: center;
		font-size: 28rpx;
	}

	.order-no image {
		display: block;
		width: 250rpx;
		height: 250rpx;
		margin: 0 auto;
		padding-bottom: 30rpx;
	}
</style>
