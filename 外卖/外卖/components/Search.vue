<template>
	<view>
		<!-- 定位 -->
		<view class="search-view">
			<image src="/static/coen/dingwei.svg" mode="widthFix"></image>
			<text class="search-text">杭州市</text>
			<text>></text>
		</view>
		<!-- 搜索 -->
		<view class="search-cont">
			<view class="search" @click="handlesearch()">
				<image src="/static/coen/sousuo.svg" mode="widthFix" class="search-img"></image>
				<!-- disabled 禁止输入文字功能  -->
				<input type="text" placeholder="麻辣烫" disabled />
			</view>
		</view>
		<!-- 自定义轮播 -->
		<view class="swiper-view">
			<swiper :interval="2000" :duration="1000" @change="bannerfun">
				<block v-for="(item,index) in lable" :key="index">
					<swiper-item>
						<view class="swiper-item">
							<block v-for="(listdata,index) in item" :key="index">
								<view class="conteng-img">
									<image :src="listdata.img" mode="widthFix" class="uploadimg"></image>
									<text>{{listdata.title}}</text>
								</view>
							</block>
						</view>
					</swiper-item>
				</block>
			</swiper>
			<!-- 指示点 -->
			<view class="instruct-view">
				<block v-for="(item, index) in instructdata" :key="index">
					<view class="instruct" :class="{active:index == num}">{{item}}</view>
				</block>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				num: 0,
				// 面板指示点
				instructdata: ['', ''],
				//轮播图组件
				lable: [
					[{
							'img': '/static/inster/meishi.png',
							'title': '美食'
						},
						{
							'img': '/static/inster/chaoshi.png',
							'title': '超市便利'
						},
						{
							'img': '/static/inster/shuiguo.png',
							'title': '蔬菜水果'
						},
						{
							'img': '/static/inster/meituan.png',
							'title': '美团专送'
						},
						{
							'img': '/static/inster/paotui.png',
							'title': '跑腿代购'
						},
						{
							'img': '/static/inster/yexiao.png',
							'title': '夜宵'
						},
						{
							'img': '/static/inster/jintie.png',
							'title': '津贴联盟'
						},
						{
							'img': '/static/inster/pinping.png',
							'title': '甜点饮品'
						},
						{
							'img': '/static/inster/shaokao.png',
							'title': '龙虾烧烤'
						},
						{
							'img': '/static/inster/dangao.png',
							'title': '甜蜜蛋糕'
						}
					],
					[{
							'img': '/static/inster/hanbao.png',
							'title': '汉堡披萨'
						},
						{
							'img': '/static/inster/liaoli.png',
							'title': '日韩料理'
						},
						{
							'img': '/static/inster/malatang.png',
							'title': '麻辣烫'
						},
						{
							'img': '/static/inster/kuaican.png',
							'title': '快食简餐'
						},
						{
							'img': '/static/inster/xianhua.png',
							'title': '浪漫鲜花'
						},
						{
							'img': '/static/inster/lazi.png',
							'title': '无辣不欢'
						},
						{
							'img': '/static/inster/jiaozi.png',
							'title': '饺子馆'
						},
						{
							'img': '/static/inster/xiaochi.png',
							'title': '小吃馆'
						},
						{
							'img': '/static/inster/baofan.png',
							'title': '煲仔饭'
						},
						{
							'img': '/static/inster/qita.png',
							'title': '其他'
						}
					]
				]
			};
		},
		methods:{
			handlesearch(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			},
			bannerfun(e){
				// console.log(e.detail.current)
				this.num = e.detail.current
			},

		}
	}
</script>

<style scoped lang="scss">
	/* 定位 */
	.search-view {
		font-size: 30rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		height: 80rpx;

		image {
			width: 35rpx;
			height: 35rpx;
		}

		.search-text {
			padding: 0 10rpx;
		}
	}

	/* 搜索 */
	.search-cont {
		display: flex;
		justify-content: space-between;
		height: 70upx;
		align-items: center;

		.search {
			height: 70rpx;
			line-height: 70rpx;
			width: 100%;
			display: flex;
			flex-direction: flex;
			background: #eff3f4;
			border-radius: 10rpx;

			.search-img {
				margin: auto 0 auto 20rpx;
				width: 40rpx;
				height: 40rpx;
			}

			input {
				height: 70rpx;
				line-height: 70rpx;
				width: 100%;
				font-size: 25rpx;
				color: #666666;
			}

		}
	}

	/* 轮播 */
	swiper {
		height: 320rpx !important;

		/* 小图标 */
		.swiper-item {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;
			height: 320rpx;

			/* 图片 CSS3样式 一排站5个 */
			.conteng-img {
				width: calc((100% / 5) - 12px) !important;
				margin: 6px;
				position: relative;
				text-align: center;

				.uploadimg {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50rpx;
					display: block;
					margin: 0 auto 20rpx;
				}

				text {
					padding-top: 20rpx;
					font-size: 25rpx;
				}
			}

		}
	}

	/*指示灯*/
	.instruct-view {
		display: flex;
		justify-content: center;
		padding-top: 10rpx;

		.instruct {
			background: #e6e6e6;
			height: 10rpx;
			width: 30rpx;
			border-radius: 50rpx;
			margin: 0 10rpx;
			
		}

		.active {
			background: #fbae22 !important;
		}

	}
</style>
