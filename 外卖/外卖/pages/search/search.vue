<template>
	<view>
		<!-- 搜索栏 -->
		<view class="search-cont">
			<view class="search">
				<input 
				type="text" 
				placeholder-class="inputclass" 
				confirm-type="done" 
				focus="true" 
				placeholder="请输入关键字" 
				v-model="searchdata"
				@confirm="onKeyInput"
				/>
			</view>
			<view class="search-code" @click="seArch()">
				搜索
			</view>
		</view>
		
		<!-- 搜索历史 -->
		<view class="search-history" v-if="ifhistory">
			<view class="search-title">
				<view>搜索历史</view>
				<view @click="removeStorage()"><image src="/static/coen/searchend.svg" mode="widthFix"></image></view>
			</view>
			<!-- tab -->
			<view class="menu-block">
				<block v-for="(item,index) in setdata" :key="index">
					<view @click="menubtn(item)">{{item}}</view>
				</block>
			</view>
		</view>
		
		
		
		
		<!-- 商品列表 -->
		<view class="content-left" v-if="shopcont">
			<block v-for="(item,index) in takeshop" :key="index">
				<view class="content-view">
					<view class="content-img">
						<image :src="item.logo" mode="aspectFill"></image>
					</view>
					<view class="content-title">
						<text class="conteng-take">{{item.shop}}</text>
						<view class="conteng-monthly">
							<text>月售200</text>
							<text>约{{item.duration}}分钟</text>
						</view>
						<view class="conteng-starting">
							<text>起送¥{{item.delivering}}</text>
							<text>配送¥{{item.physical}}</text>
							<text>人均¥{{item.capita}}</text>
						</view>
						<view class="conteng-starting">
							<image src="/static/coen/liwu.svg" mode="widthFix"></image>
							<text>{{item.types}}</text>
						</view>
					</view>
				</view>
			</block>
		</view>
		
		<!-- 反馈组件 -->
		<!-- 获取元素节点 -->
		<tips ref='tips'></tips>
	</view>
</template>

<script>
	// 引入post请求
	import {publicing} from '../../api/api.js'
	import {searchurl} from '../../api/request.js'
	//引入反馈组件
	import tips from'../../element/tips.vue'
	export default {
		components:{
			tips,
		},
		data() {
			return {
				// 搜索关键词
				searchdata:'',
				// 搜索结果
				takeshop:'',
				//搜索历史
				setdata:'',
				// 是否有搜索历史
				ifhistory:false,
				// 内容展示区
				shopcont:false
			}
		},
		created() {
			this.setStorage()
		},
		methods: {
			//搜索键盘触发的
			onKeyInput(e){
				if(e.detail.value !==''){
					//搜索时 让搜索历史消失
					this.ifhistory = false
					//调用搜索
					this.searchData(e.detail.value)
					//调用搜索历史
					this.getStorage(e.detail.value)
					
				}
				
			},
			//点击搜索触发的
			seArch(){
				//判断输入内容是否为空
				if(this.searchdata !==''){
					//搜索时 让搜索历史消失
					this.ifhistory = false
					//调用搜索
					this.searchData(this.searchdata)
					//调用搜索历史
					this.getStorage(this.searchdata)
				}

			},
			//获取搜索历史
			getStorage(searchkey){
				// 先取出本地缓存的数据
				let seararray = uni.getStorageSync('search_key') || []
				// 要存入一个数组array
				seararray.unshift(searchkey)
				uni.setStorageSync('search_key', seararray);
			},
			//取出本地缓存数据
			setStorage(){
				let setdata = uni.getStorageSync('search_key')
				//去重
				let setdataarr = Array.from(new Set(setdata))
				// this.setdata = setdataarr
				if(setdataarr == ''){
					this.ifhistory = false
				}else{
					this.setdata = setdataarr
					this.ifhistory = true
				}
				
			},
			//手动清除搜索历史
			removeStorage(){
				uni.removeStorageSync('search_key');
				//提高用户体验当数据没用了  直接隐藏搜索历史
				this.setStorage()
			},
			//搜索历史
			menubtn(item){
				//发送搜索之后 让搜索历史隐藏 (提高用户体验)
				this.ifhistory = false
				this.searchData(item)
			},
			
			
			//发起搜索
			searchData(searchkey){
				let data ={
					searchdata:searchkey
				}
				publicing(searchurl,data)
				.then((res)=>{
					// console.log(res);
					if(res.data == '没有商品数据'){
						// log('没有商品数据')
						//没有商品数据  让内容展示区隐藏
						this.shopcont = false
						let bull = true
						let tips = '没有你要找的商品'
						this.tising(bull,tips)
					}else{
						let bull = false
						let tips = ''
						this.tising(bull,tips)
						//有商品数据  让内容展示区现实
						this.shopcont = true
						this.takeshop = res.data
					}
				})
				.catch((err)=>{
					console.log(err);
				})
				
			},
			//反馈提示
			tising(bull,tips){
				this.$nextTick(()=>{
					this.$refs.tips.init(bull,tips)
				})
			}
		}
	}
</script>

<style scoped>
	@import "../../common/meituan.css";

	.content-left {
		margin: 0 20rpx;
	}

	.search {
		height: 70rpx;
		line-height: 70rpx;
		width: 100%;
		display: flex;
		flex-direction: row;
		background: #f8f8f8;
		border-radius: 20rpx;
		margin-left: 20rpx;
	}

	.search input {
		height: 70rpx;
		line-height: 70rpx;
		width: 100%;
		font-size: 30rpx;
		color: #666666;
		padding-left: 30rpx;
	}

	.search-cont {
		display: flex;
		justify-content: space-between;
		height: 70rpx;
		align-items: center;
		padding: 30rpx 0;
	}

	.search-code {
		width: 150rpx;
		height: 50rpx;
		text-align: center;
		font-size: 30rpx;
	}

	/* 搜索历史 */
	.search-history {
		margin: 20rpx;
	}

	.search-title {
		font-size: 30rpx;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 60rpx;
		line-height: 60rpx;
	}

	.search-title image {
		width: 36rpx;
		height: 36rpx;
		display: block;
	}

	.menu-block view {
		background: #f7f8fa;
		border-radius: 6rpx;
		font-size: 27rpx;
		color: #292c33;
		text-align: center;
		padding: 10rpx;
		margin: 20rpx 20rpx 0 0;
	}

	.menu-block {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
</style>
