<template>
	<view>
		<view class="ordering-fls">
			<!-- 商品分类左边 -->
			<view class="ordering-left">
				<block v-for="(item,index) in orderclass" :key="index">
					<text :class="{activeord:index == numing}" @click="ordermeClic(index,item)">{{item}}</text>
				</block>
			</view>
			<!-- 商品列表：右边 -->
			<view class="ordering-right">
				<text class="ordering-right-title">{{ordertitle}}</text>
				<view>
					<block v-for="(item,index) in classifarr" :key="index">
						<view class="content-view">
							<!-- 左边商品图片 -->
							<view class="content-img">
								<image :src="item.objdis.image" mode="aspectFill"></image>
							</view>
							<!-- 右边商品 -->
							<view class="content-title">
								<text class="conteng-take">{{item.objdis.input}}</text>
								<view class="conteng-monthly">
									<block v-for="(itemdata,index) in item.objdis.tags" :key="index">
										<text>{{itemdata}}</text>
									</block>
								</view>
								<view class="conteng-starting">
									<text>月售10</text>
								</view>
								<view class="conteng-price">
									<view class="conteng-shi">¥{{item.objdis.Discount}}</view>
									<view class="conteng-hua">¥{{item.objdis.Price}}</view>
									<view class="ordering-price">
										<image 
										@click="reDuce(item.amount,item._id,index,item.objdis.Discount,item.objdis.image,item.objdis.input)" 
										src="/static/coen/jianhao.png"
										 mode="widthFix"></image>
										<text class="amounting">{{item.amount}}</text>
										<image 
										@click="pLus(item.amount,item._id,index,item.objdis.Discount,item.objdis.image,item.objdis.input)" 
										src="/static/coen/jiahao.png"
										 mode="widthFix"></image>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
			<!-- 总价计算区域 -->
			<view class="Shopping">
				<!-- 骑手 -->
				<view class="qishou">
					<image v-if="!isActive" src="/static/coen/weigou.png" mode="widthFix"></image>
					<image v-if="isActive" src="/static/coen/yigou.png" mode="widthFix"></image>
				</view>
				<!-- 多少量 -->
				<view class="Numbering" v-if="listNum">{{listNum}}</view>
				<!-- 金额 -->
				<view class="Shopping-dis">
					<view class="Shopping-left">
						<view class="Cost-mony">
							<text class="Total-price">¥{{Takeawayprice}}</text>
							<text class="Delivery">另需配送费{{physical}}元</text>
						</view>
					</view>
					<view class="Shopping-right" :class="{shoppactive: isActive}" @click="flat && settLement()">
						<text v-if="!isActive">{{delivering}}元起送</text>
						<text v-if="isActive">{{difference}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 登录模态弹窗组件 -->
		<motal ref="mon"></motal>
	</view>
</template>

<script>
	// 引入登录模态弹窗组件
	import motal from '../element/modal.vue'
	export default {
		components:{
			motal
		},
		props: ['orderingdata', 'busidata'],
		
		data() {
			return {
				// 禁止点击
				flat: false,
				// 商品分类左边
				numing: 0,
				isActive: false,
				// 左边的分类
				orderclass: [],
				// 右边默认展示的分类
				ordertitle: '',
				// 右边默认展示的商品
				classifarr: [],
				// 所有的商品数据
				commodity: [],
				// 配送费
				physical: Number,
				// 起送费
				delivering: Number,
				// 商品数量
				amount: '',
				// 存放得到总价的商品
				arrtotalPrice: [],
				// 所有商品累积的总价
				Takeawayprice: 0,
				// 选择了几份商品
				Takeleng: [],
				//还差多少满足起送金额
				difference: '',
				// 商家标识
				MerchantId: '',
				// 商家名称
				nameshop: '',
				// 商家logo
				logo: '',
				//商品数量综合
				listNum:'',
			};
		},
		methods: {
			//去结算
			settLement(){
				console.log("去结算");
				// 去结算前的条件就是必须已经登录：到本地存储去查看是否已经有用户信息
				let setdata = uni.getStorageSync('usermen')
				if(!setdata){
					console.log("用户没有登录");
					//弹出模态登录框
					this.$nextTick(()=>{
						this.$refs.mon.init()
					})
				}else{
					console.log("用户已经登录");
					//做支付
					// 需要支付的总金额
					// 配送费
					// 用户openid
					// 商家标识：身份证
					// 商家名称
					// 商家logo
					// 点的商品个数
					let payment = parseFloat((this.Takeawayprice + this.physical).toFixed(10))
					let Ordering = {
						payment,
						physical:this.physical,
						openid:setdata.openid,
						MerchantId:this.MerchantId,
						nameshop:this.nameshop,
						logo:this.logo,
						allorder:this.Takeleng
					}
					//带过去的参数必须是字符串
					let strorder = JSON.stringify(Ordering)
					uni.navigateTo({
						url:'/pages/placeorder/placeorder?ide='+strorder
					})
					
				}
				
			},
			//左边商品分类的切换
			ordermeClic(index, itemclass) {
				this.numing = index
				this.ordertitle = itemclass
				// 分类切换
				let itemarr = this.commodity.filter((item) => {
					return item.optidata == itemclass
				})
				this.classifarr = itemarr
			},
			//加价
			//第一个参数  0 元 第二个参数 商品ID 第三个参数 商品下标 第四个参数 商品价格  五图片 六 商品介绍
			pLus(amounts,indexs,indexdata,price,image,input) {
				//商品数量
				this.amount = Number(amounts) + Number(1)
				// console.log(this.amount);
				this.pullData(indexs,indexdata,price,image,input)
			},
			//减价
			reDuce(amounts,indexs,indexdata,price,image,input) {
				this.amount = Number(amounts) - Number(1)
				this.pullData(indexs,indexdata,price,image,input)
			},
			// 加减价公用函数(不写上面的amount在数组中始终为0)
			pullData(indexs,indexdata,price,image,input) {
				let findarr = this.classifarr.filter((item, index) => {
					//用户点击的物品 直接对应 物品的唯一ID标识
					if (item._id == indexs) {
						if (this.amount < 1) {
							return item.amount = '0'
						} else {
							return item.amount = this.amount
						}
					}
					
				})
				// console.log(findarr);
				// 得到更改的数组重新更新classifarr数组，数组顺序要保持不变
				this.classifarr[indexdata] = findarr[0]
				//计算总价  单价*数量
				if(Number(this.amount) <=0){
					this.amount=0
				}
				let Totalnum = price* Number(this.amount)
				// console.log(Totalnum);
				// 解决总价为浮点数的情况
				let Totalprice = parseFloat((Totalnum).toFixed(10))
				// console.log(Totalprice)
				// 把单个商品得到的总价作为一个对象push到数组里，方便后面
				// 多个商品总价计算时来得到最终的价格
				let fands={
					//商品ID值(键值/名 相同)
					indexs,
					//总价
					Totalprice,
					//图片
					image,
					//名称
					input,
					//数量
					"amount":this.amount,
					//单价
					price
				}
				this.arrtotalPrice.push(fands)
				// console.log(this.arrtotalPrice);
				// 查询当前点击的商品ID，替换总价
				let findarrdata = this.arrtotalPrice.map((item)=>{
					//如果商品ID 相同 这个吧fands重新赋值可以直接拿到总价(第一项中Totalprice) *tips
					return item.indexs == indexs ? fands : item
				})
				// console.log(findarrdata)
				//让上面的数组重新变成 点击相同ID的物品 总价都相等, 最后进行去重
				this.arrtotalPrice = findarrdata
			},

		},
		computed:{
			calculation(){
				// 监听总价
				// 1数组对象去重 :累加器：reduce()
				let arr = {}
				let arrdata = this.arrtotalPrice.reduce((preVal,curVal)=>{
					arr[curVal.indexs] ? '' : arr[curVal.indexs] = true && preVal.push(curVal)
					return preVal
				},[])
				// console.log(arrdata);
				// 剔除总价为0的商品
				this.Takeleng = arrdata.filter((item)=>{
					return item.Totalprice != 0
				})
				console.log(this.Takeleng);
				//获取商品数量
				let num = this.Takeleng.map((item)=>{
					let counts =0
					return counts+= item.amount
				})
				// console.log(num);
				//得到商品数量综合
				this.listNum=num.reduce((pre,item)=>{
					return pre+item
				},0)
				// console.log(this.listNum);
				// 所有商品的总价累积之和
				let numdata = 0
				arrdata.forEach((item)=>{
					numdata += item.Totalprice
				})
				// 得到的总价去除浮点数
				this.Takeawayprice = parseFloat((numdata).toFixed(10))
			},
			
			// //监听是否已经选择商品
			// choiceTake(){
			// 	if(this.Takeawayprice===0){
			// 		this.isActive =false
			// 	}else{
			// 		this.isActive =true
			// 	}
			// },
			// //监听起送价格是否满足
			// deliVering(){
			// 	if(this.Takeawayprice < this.delivering ){
			// 		//不满足起送金额(起送金额-总价)
			// 		let preceMen =parseFloat((this.delivering - this.Takeawayprice).toFixed(10))
			// 		console.log(preceMen);
			// 		this.difference=`还差${preceMen}元`
			// 		this.flat =false
			// 	}else{
			// 		this.difference='去结算'
			// 		this.flat=true
			// 	}
			
			// },
			//是否满足下单的条件
			condition(){
				//是否选择任何一个商品
				if(this.Takeawayprice===0){
					this.isActive =false
					this.flat =false
					console.log('没有商品');
				}else{
					this.isActive =true
					this.flat=true
					console.log('有商品');
					if(this.Takeawayprice < this.delivering ){
						//不满足起送金额(起送金额-总价)
						let preceMen =parseFloat((this.delivering - this.Takeawayprice).toFixed(10))
						console.log(preceMen);
						this.difference=`还差${preceMen}元`
						this.flat =false
					}else{
						this.difference='去结算'
						this.flat=true
					}
				}
			},
			
			
		},
		
		
		
		
		
		watch: {
			// 用户进入该页面，1.默认展示在第一个tab上（盖浇饭），2.并且展示该分类下面的商品
			orderingdata(newvalue, oldvalue) {
				// console.log(newvalue);
				// 1取出左边的商品分类
				let classifdata = newvalue.map((item) => {
					return item.optidata
				})
				// console.log(classifdata);
				// 数组去重
				let setdataarr = Array.from(new Set(classifdata))
				// console.log(setdataarr);
				this.orderclass = setdataarr
				// 2右边的商品
				this.commodity = newvalue
				// 3右边默认分类为第一个分类
				this.ordertitle = newvalue[0].optidata
				// 4往商品里添加一个字段为0
				let commoditytata = newvalue.map((item) => {
					let key = 'amount'
					let value = 0
					return item[key] = value
				})
				// 5右边默认展示的商品是第一个分类下的商品
				let classifarr = this.commodity.filter((item) => {
					return item.optidata == newvalue[0].optidata
				})
				// console.log(classifarr);
				this.classifarr = classifarr
			},
			// 商家介绍
			busidata(newvalue, oldvalue) {
				// 配送费
				this.physical = newvalue.physical
				// 起送价
				this.delivering = newvalue.delivering
				// 商家标识
				this.MerchantId = newvalue.openid
				// 商家名称
				this.nameshop = newvalue.shop
				// 商家logo
				this.logo = newvalue.logo
			}


		}
	}
</script>

<style scoped>
	.ordering-fls {
		display: flex;
		justify-content: space-between;
	}

	/* 左边商品分类 */
	.ordering-left {
		width: 190rpx;
		background: #fafafa;
		overflow-y: auto;
		height: 100%;
	}

	.ordering-left text {
		color: #a8a8a8;
		display: block;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}

	.activeord {
		background: #FFFFFF !important;
		font-weight: bold !important;
	}

	/* 右边 */
	.ordering-right {
		width: 100%;
		padding: 9rpx 9rpx 130rpx 9rpx;
		overflow: hidden;
		overflow-y: auto;
	}

	.activeord {
		background: #FFFFFF !important;
		font-weight: bold !important;
	}

	.ordering-right-title {
		font-size: 28rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.content-view {
		display: flex;
		justify-content: space-between;
		height: 200rpx !important;
		overflow: hidden;
		margin: 30rpx 0;
		color: #898989;
	}

	.content-img {
		width: 180rpx !important;
		height: 200rpx !important;
		overflow: hidden;
	}

	.content-img image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.content-title {
		/* width: 100%; */
		padding-left: 10rpx;
		font-size: 24rpx;
	}

	.conteng-take {
		color: #333333;
		height: 50rpx;
		font-size: 33rpx;
		font-weight: bold;
		line-height: 50rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.conteng-monthly {
		display: flex;
	}

	.conteng-monthly text {
		background: #f1f1f1;
		margin-right: 9rpx;
		padding: 4rpx 13rpx;
		border-radius: 7rpx;
		display: block;
	}

	.conteng-starting {
		display: flex;
		align-items: center;
		height: 50rpx;
		line-height: 50rpx;
	}

	.conteng-price image {
		width: 60rpx;
		height: 60rpx;
	}

	.conteng-price {
		display: flex;
		align-items: center;
	}

	.ordering-price {
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
	}

	/* 数量 */
	.amounting {
		width: 50rpx;
		text-align: center;
	}

	.conteng-hua {
		text-decoration: line-through;
	}

	.conteng-shi {
		color: #fb4e44;
		font-size: 33rpx;
		width: 180rpx;
		overflow: hidden;
	}

	/* 购物车 */
	.Shopping {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
	}

	.Shopping-left {
		height: 130rpx;
		background: #000000;
		flex-grow: 2;
		border-top-left-radius: 50rpx;
		border-bottom-left-radius: 50rpx;
	}

	.Shopping-right {
		height: 130rpx;
		line-height: 130rpx;
		font-size: 30rpx;
		color: #7f7f7f;
		text-align: center;
		background: #000000;
		flex-grow: 1;
		border-top-right-radius: 50rpx;
		border-bottom-right-radius: 50rpx;
	}

	.Shopping-dis {
		display: flex;
		height: 130rpx;
		margin: 0 20rpx;
	}

	.qishou {
		width: 120rpx;
		height: 150rpx;
		position: fixed;
		bottom: 0rpx;
		left: 50rpx;
	}

	.qishou image {
		width: 120rpx;
		height: 150rpx !important;
	}

	/* 定位 */
	.Delivery {
		color: #999999;
		font-size: 28rpx;
		height: 65rpx;
	}

	.Shopping-left text {
		display: block;
	}

	.Total-price {
		font-size: 40rpx;
		color: #FFFFFF;
		height: 65rpx;
		line-height: 65rpx;
	}

	.Cost-mony {
		padding-left: 170rpx;
		color: #4CD964;
		height: 130rpx;
	}

	/* 数量 */
	.Numbering {
		background: red;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		font-size: 20rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 40rpx;
		position: fixed;
		bottom: 50rpx;
		left: 130rpx;
	}

	/* 选中菜品 */
	.shoppactive {
		background: #ffd300 !important;
		color: #000000 !important;
	}
</style>
