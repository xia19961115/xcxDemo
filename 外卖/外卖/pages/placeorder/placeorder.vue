<template>
	<view>
		<view class="place-view">
			<view class="place-addres" v-if="addreing" @click="addRess()">
				+ 新增收货地址
			</view>
			<!-- 已选中收货地址 -->
			<view class="goods-address" v-if="!addreing" @click="addRess()">
				<view class="goods-address-left">
					<image src="/static/coen/address.png" mode="widthFix"></image>
				</view>
				<view class="goods-address-in">
					<view>{{addressing.detailInfo}}</view>
					<view class="goods-address-name">
						<text>{{addressing.userName}}</text>
						<text>{{addressing.telNumber}}</text>
					</view>
				</view>
				<view class="goods-address-right">
					<image src="/static/coen/jiantou.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="place-time">
				<image src="/static/coen/times.png" mode="widthFix"></image>
				<text>立即送出</text>
			</view>
		</view>
		<!-- 菜单 -->
		<view class="place-view">
			<view>
				<block v-for="(item,index) in allorder" :key="index">
					<view class="order-view">
						<view class="order-img">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="order-title">
							<text>{{item.input}}</text>
							<text>x{{item.amount}}</text>
						</view>
						<view class="order-price">
							单价:¥{{item.price}}
						</view>
					</view>
				</block>
			</view>
		</view>
		<!-- 配送费 -->
		<view class="place-view">
			<view class="Delivery">配送费：¥{{physical}}</view>
		</view>
		<!-- 高度 -->
		<view style="height: 140upx;"></view>
		<!-- 支付 -->
		<view class="payment">
			<view class="payment-left">
				<text>合计</text>
				<text>¥{{payment}}</text>
			</view>
			<view class="payment-right" @click="toPay()">
				去支付
			</view>
		</view>
		<!-- 提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
	// 引入提示组件
	import HMmessages from "@/common/HM-messages/HM-messages.vue"
	// post
	import {publicing} from '../../api/api.js'
	// 地址
	import {wxpayingurl} from '../../api/request.js'
	export default {
		components: {
			HMmessages
		},
		data() {
			return {
				addreing: true,
				allorder:[],
				openid:'',
				payment:'',
				physical:Number,
				MerchantId:'',
				nameshop:'',
				logo:'',
				// 收货地址
				addressing:{}
			}
		},
		methods: {
			//选择收获地址
			addRess(){
				//只能支持小程序  APP不支持
				uni.chooseAddress({
					success: (res) => {
						console.log(res);
						this.addressing=res
						this.addreing=false
					}
				})
			},
			toPay(){
				if(this.addreing ==true){
					// console.log('没有地址');
					let succ='请选择收货地址'
					let ico ='error'
					this.tIps(succ,ico)
					return false
				}
					console.log('可以支付');
					this.wxPay()
				
			},
			//微信支付
			async wxPay(){
				//必填参数
				// 客户信息
				let peopleobj = {
					address:this.addressing.detailInfo,
					name:this.addressing.userName,
					iphone:this.addressing.telNumber
				}
				// 商家标识
				let merchantid = this.MerchantId
				// 截取商家标识前7位字符串
				let ide = this.MerchantId.slice(0,7)
				// 商家名称
				let commod = this.nameshop
				// 商家logo
				let logo = this.logo
				// 把要发送到后台的数据以对象形式存储
				let Paymentinfor = {
					peopleobj,
					arrinfo:this.allorder,
					merchantid,
					ide,
					commod,
					logo,
					useropenid:this.openid,
					payment:this.payment
				}
				console.log(Paymentinfor);
				// 第一步：统一下单
				let Placeorder = await this.placeOrder(Paymentinfor)
				console.log(Placeorder);
				
			},
			// 第一步：统一下单
			placeOrder(Paymentinfor){
				return new Promise((resolve,reject)=>{
					publicing(wxpayingurl,Paymentinfor)
					.then((res)=>{
						// console.log(res);
						// uni.hideToast()
						resolve(res)
						let succ = '虚拟支付成功'
						let ico = 'success'
						this.tIps(succ,ico)
						uni.navigateTo({
							url:'/pages/order/order'
						})
					})
					.catch((err)=>{
						// console.log(err);
						// uni.hideToast()
						reject('支付错误')
						let succ = '支付失败'
						let ico = 'error'
						this.tIps(succ,ico)
					})
				})
				
			},
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			// 提示
			tIps(succ, ico) {
				this.HMmessages.show(succ, {
					icon: ico,
					fontColor: "#ffffff",
					iconColor: "#ffffff",
					background: "rgba(102,0,51,0.8)"
				})
			},
		},
		onLoad(e) {
			//接收下单页面的路径数据
			let ordermen =JSON.parse(e.ide)
			// console.log(ordermen);
			// 商品数据
			this.allorder = ordermen.allorder
			// openid
			this.openid = ordermen.openid
			// 支付的价格
			this.payment = ordermen.payment
			// 配送费
			this.physical = ordermen.physical
			// 商家标识
			this.MerchantId = ordermen.MerchantId
			// 商家名称
			this.nameshop = ordermen.nameshop
			// 商家logo
			this.logo = ordermen.logo
			
		}
	}
</script>

<style scoped>
	page {
		background: #F4f4f4;
	}

	.place-view {
		background: #FFFFFF;
		margin: 20rpx;
		border-radius: 9rpx;
		padding: 35rpx 15rpx;
	}

	.place-addres {
		border: 1rpx solid #ffb000;
		width: 400rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 50rpx;
		text-align: center;
		color: #ffb000;
		margin: 0 auto;
		font-size: 30rpx;
	}

	.place-time image {
		width: 40rpx;
		height: 40rpx;
		padding-right: 20rpx;
	}

	.place-time {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		border-top: 1rpx solid #F4f4f4;
		padding-top: 35rpx;
		margin-top: 35rpx;
	}

	/* 菜单 */
	.order-view {
		display: flex;
		height: 150rpx !important;
		overflow: hidden;
		margin-bottom: 15rpx;
		font-size: 30rpx;
	}

	.order-view text {
		display: block;
	}

	.order-img {
		width: 200rpx !important;
		height: 150rpx !important;
		padding-right: 15rpx;
	}

	.order-img image {
		width: 100%;
		height: 100%;
	}

	.order-title {
		flex-grow: 1;
	}

	.order-title text:nth-child(2) {
		color: #999999;
		font-size: 25rpx;
	}

	.Delivery {
		display: flex;
		justify-content: flex-end;
		font-size: 30rpx;
	}

	/* 支付 */
	.payment {
		background: #FFFFFF;
		height: 120rpx;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
	}

	.payment-left {
		display: flex;
		align-items: center;
		font-size: 30rpx;
	}

	.payment-left text:nth-child(2) {
		font-weight: bold;
		font-size: 32rpx;
	}

	.payment-right {
		background: #07c160;
		color: #FFFFFF;
		padding: 20rpx 60rpx;
		font-size: 30rpx;
		border-radius: 7rpx;
	}

	/* 收货地址 */
	.goods-address-left {
		width: 40rpx;
		height: 40rpx;
		padding-right: 20rpx;
	}

	.goods-address-left image {
		width: 40rpx;
		height: 40rpx;
	}

	.goods-address-name {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		padding-top: 10rpx;
	}

	.goods-address-right {
		width: 40rpx;
		height: 40rpx;
	}

	.goods-address-right image {
		width: 40rpx;
		height: 40rpx;
	}

	.goods-address {
		display: flex;
		align-items: center;
	}

	.goods-address-in {
		flex-grow: 1;
		font-size: 30rpx;
	}

	.goods-address-name text:nth-child(1) {
		padding-right: 10rpx;
	}
</style>
