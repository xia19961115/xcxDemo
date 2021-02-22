<template>
	<view>
		<view class="ordering">
			<block v-for="(item,index) in order" :key="index">
				<text :class="{activetext:index == num}" @click="menubtn(index)">{{item}}</text>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				num: 0,
				order: ['点菜', '评价', '商家']
			};
		},
		methods:{
			menubtn(index){
				this.num=index
				//发射自定义事件到父组件
				this.$emit('change',this.num)
			}
		}
	}
</script>

<style>
	.ordering {
		margin: 20rpx;
		display: flex;
	}

	.ordering text {
		margin-right: 60rpx;
		display: block;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 33rpx;
		color: #666666;
	}

	.activetext {
		color: #333333 !important;
		font-weight: bold !important;
		border-bottom: 5rpx solid #ffd161;
	}
</style>
