<template>
	<view>
		<view class="prefer-posi">
			<!-- 筛选区 -->
			<view class="delica-view">
				<view class="delica-list delica-grow" @click="multiple()">
					<text>{{synthesize}}</text>
					<image src="/static/coen/paixu.png" mode="widthFix"></image>
				</view>
				<view class="delica-grow" @click="saLes()">销量高</view>
				<view class="delica-grow" @click="saLes()">速度快</view>
				<view class="delica-grow" @click="saLes()">津贴联盟</view>
				<view class="delica-list delica-right" @click="scReen()">
					<text>筛选</text>
					<image src="/static/coen/shaixuan.png" mode="widthFix"></image>
				</view>
			</view>
			<!-- 综合排序筛选 -->
			<view class="sortlist sortliteltle" v-if="drop">
				<block v-for="(item,index) in sortlist" :key="index">
					<text :class="{activeb: index == num}" @click="sortClick(index,item.name,item.screen,item.nums)">{{item.name}}</text>
				</block>
			</view>
			<!-- 多个筛选区 -->
			<view class="sortlist sortlist-view" v-if="sortmen">
				<!-- 多选：商家特色 -->
				<block v-for="(item,index) in screendata" :key="index">
					<view>
						<view class="sortlist-title">{{item.title}}</view>
						<view class="sortlist-flex">
							<block v-for="(itemdata,indexs) in item.datas" :key="indexs">
								<text class="Choice" :class="{scractive: itemdata.id === 2}" @click="screenchoIce(indexs,itemdata.sign)">{{itemdata.name}}</text>
							</block>
						</view>
					</view>
				</block>
				<!-- 单选：人均价 -->
				<block v-for="(item,index) in person" :key="index">
					<view>
						<view class="sortlist-title">{{item.title}}</view>
						<view class="sortlist-flex">
							<block v-for="(itemdata,indexs) in item.datas" :key="indexs">
								<text class="Choice" :class="{scractive: indexs == scrnum}" @click="personchoIce(indexs,itemdata.per)">{{itemdata.name}}</text>
							</block>
						</view>
					</view>
				</block>
				<!-- 置顶 -->
				<view class="sortlist-bottom">
					<text @click="emPty()">清空</text>
					<text @click="flag && compLete()">完成</text>
				</view>
			</view>


		</view>
		<!-- 透明背景 -->
		<view class="yin" v-if="ying" @click="backClic()"></view>
		<!-- 提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
	// 引入提示组件
	import HMmessages from "@/common/HM-messages/HM-messages.vue"
	//引入请求
	import {publicing} from '../api/api.js'
	// 引入请求地址
	import {startingurl,multipleurl} from'../api/request.js'
	//引入反馈组件
	import tips from'../element/tips.vue'
	export default {
		components:{HMmessages,},
		data() {
			return {
				flag: false,
				synthesize: "综合排序",
				drop: false,
				sortmen: false,
				ying: false,
				num: 0,
				scrnum: -1,
				multiobj:{},
				sortlist: [{
						"name": "综合排序",
						"screen": "_id",
						"nums": 1
					},
					{
						"name": "起送价最低",
						"screen": "delivering",
						"nums": 1
					},
					{
						"name": "配送费最低",
						"screen": "physical",
						"nums": 1
					},
					{
						"name": "人均高到低",
						"screen": "capita",
						"nums": -1
					},
					{
						"name": "人均低到高",
						"screen": "capita",
						"nums": 1
					}
				],
				// 多选
				screendata: [{
					"title": "商家特色(可多选)",
					"datas": [{
							"id": 1,
							"sign": 'duration',
							"name": '配送最快'
						},
						{
							"id": 1,
							"sign": 'deliver',
							"name": '0元起送'
						},
						{
							"id": 1,
							"sign": 'physi',
							"name": '免配送费'
						}
					],
				}],
				// 人均价筛选
				person: [{
					"title": "人均价",
					"datas": [{
							"name": "20元以下",
							"per": {
								"$lt": 20
							},
						},
						{
							"name": "20-40元",
							"per": {
								"$lte": 40,
								"$gte": 20
							},
						},
						{
							"name": "40元以上",
							"per": {
								"$gt": 40
							},
						},
					]
				}],
			}
		},
		
		
		methods:{
			//综合排序
			multiple(){
				this.drop=true
				this.sortmen=false
				this.backOne()
			},
			//综合排序替换
			sortClick(index,name,screen,nums){
				this.synthesize=name
				this.num = index
				this.backClic()
				this.starTing(screen,nums)
				
			},
			//请求
			starTing(screen,nums){
				let Data={
					screen,
					nums
				}
				publicing(startingurl,Data)
				.then((res)=>{
					console.log(res);
					//vuex  同步存储
					this.$store.commit('screenmuta',res.data)
				})
				.catch((err)=>{
					console.log(err);
				})
			},
			//销量 速度 津贴
			saLes(){
				this.backClic()
			},
			//筛选
			scReen(){
				this.drop=false
				this.sortmen=true
				this.backOne()
			},
			//透明背景
			backOne(){
				setTimeout(()=>{
					this.ying= true
				},300)
			},
			//隐藏透明背景
			backClic(){
				this.ying= false
				this.drop=false
				this.sortmen=false
			},
			// 商家特色（多选）
			screenchoIce(indexs,sign){
				console.log(sign)
				if(this.screendata[0].datas[indexs].id == 1){
					// 选中
					this.screendata[0].datas[indexs].id = 2
					// console.log('选中')
					//给对象添加
					this.$set(this.multiobj,sign,sign)
					// this.$set给对象添加一个属性
					console.log(this.multiobj)
				}else{
					// 未选中
					this.screendata[0].datas[indexs].id = 1
					// console.log('未选中')
					//删除对象中的属性
					this.$delete(this.multiobj,sign)
					console.log(this.multiobj)
				}
			},
			// 人均价（单选）
			personchoIce(index,name){
				if(this.scrnum == index){
					// 未选中
					this.scrnum = -1
					this.$delete(this.multiobj,'capita')
					// console.log(this.multiobj)
				}else{
					// 选中
					this.scrnum = index
					this.$set(this.multiobj,'capita',name)
					// console.log(this.multiobj)
				}
			},
			tIps(succ, ico) {
				this.HMmessages.show(succ, {
					icon: ico,
					fontColor: "#ffffff",
					iconColor: "#ffffff",
					background: "rgba(102,0,51,0.8)"
				})
			},
			
			// 完成
			compLete(){
				this.backClic()
				publicing(multipleurl,this.multiobj)
				.then((res)=>{
					if(res.data==='没有商品数据'){
						let succ = '没有找到你要的商品,请重新选择'
						let ico = 'error'
						this.tIps(succ,ico)
					}else{
						console.log(res)
						// 存储到vuex数据仓库
						this.$store.commit('screenmuta',res.data)
					}
				})
				.catch((err)=>{
					console.log(err)
				})
			},
			// 清空
			emPty(){
				// 商家特色
				this.screendata.forEach((item)=>{
					let arr = item.datas.map((items)=>{
						items.id = 1
						return items
					})
					console.log(arr)
				})
				this.multiobj = {}
				// 人均价
				this.scrnum = -1
				this.backClic()
			},
			
			
			
		},
		computed:{
			//监听用户 没有选择  完整按钮禁用
			emptyIng(){
				let contentMuse =JSON.stringify(this.multiobj)
				//转字符串  判断能判断是否为空对象
				if(contentMuse==='{}'){
					this.flag=false
				}else{
					this.flag=true
				}
			}
		}
		
		
	}
</script>

<style scoped>
	/* 筛选区 */
	.delica-view image {
		width: 30rpx;
		height: 30rpx;
		display: block;
	}

	.delica-view {
		font-size: 30rpx;
		display: flex;
		align-items: center;
		color: #666666;
		height: 70rpx;
		padding: 0 15rpx;
		background: #FFFFFF;
	}

	.delica-list {
		display: flex;
		align-items: center;
	}

	.delica-right {
		justify-content: flex-end;
		flex-grow: 5;
	}

	.delica-grow {
		flex-grow: 1;
	}

	.prefer-posi {
		position: absolute;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 99;
	}

	/* 排序 */
	.sortlist {
		background: #ffffff;
	}

	.sortliteltle text {
		padding: 0 15rpx;
		display: block;
		font-size: 30rpx;
		height: 70rpx;
		line-height: 70rpx;
		border-top: 1rpx solid #ededed;
	}

	.activeb {
		color: #f89903 !important;
	}

	/* 选择 */
	/*相对定位*/
	.sortlist-view {
		height: 700rpx;
		overflow: hidden;
		overflow-y: scroll;
		position: relative;
	}

	.sortlist-title {
		padding: 0 15rpx;
		font-size: 30rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.Choice {
		font-size: 28rpx;
		background: #f8f8f8;
		height: 55rpx;
		line-height: 55rpx;
		color: #666666;
		width: calc((100% / 3) - 15px) !important;
		margin: 7.5px;
		text-align: center;
		display: block;
		border-radius: 5rpx;
	}

	.sortlist-flex {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.sortlist-bottom {
		background: #ffffff;
		height: 80rpx;
		border-top: 1rpx solid #e4e4e4;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.sortlist-bottom text {
		flex-grow: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}

	.sortlist-bottom text:nth-child(1) {
		border-right: 1rpx solid #e4e4e4;
	}

	.sortlist-bottom text:nth-child(2) {
		background: #ffd348;
	}

	.yin {
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	/* 商家特色加样式 */
	.scractive {
		background: #fef6df !important;
		color: #f29909 !important;
	}
</style>
