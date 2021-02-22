<template>
	<view>
		<view class="myhome">
			<!-- 已登录 -->
			<view class="wx-name" v-if="wxlogin">
				<view>
					<image :src="usering.avatarUrl"></image>
				</view>
				<view class="wx-text">
					<text>{{usering.nickName}}</text>
				</view>
			</view>
			<!-- </block> -->
			<!-- 未登录 -->
			<view class="wx-button" v-if="!wxlogin">
				<view class="wx-button-view">登录美团外卖，开启吃货旅程</view>
				<view>
					<button plain="true" open-type="getUserInfo" @getuserinfo="getUserInfo">去登录</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// post请求
	import {publicing} from '../../api/api.js'
	// 请求地址
	import {wxloginurl} from '../../api/request.js'
	export default {
		onShow() {
			this.ifUser()
			// console.log(this.usering.nickName);
		},
		methods: {
			//获取用户头像, 昵称
			getUserInfo(event){
				// console.log(event.detail);
				if(event.detail.userInfo){
					let wxing=event.detail.userInfo
					this.wxCode(wxing.avatarUrl,wxing.nickName)
				}
			},
			
			// 获取code
			wxCode(avatarUrl,nickName){
				uni.login({
					success: (res) => {
						// console.log(res);
						let code =res.code
						const appid = ""
						const secret =""
						this.wxLogin(avatarUrl,nickName,code,appid,secret)
					},
					fail: (err) => {
						console.log(err);
					}
				})
			},
			//发送请求
			wxLogin(avatarUrl,nickName,code,appid,secret){
				let data ={
					avatarUrl,
					nickName,
					code,
					appid,
					secret
				}
				console.log(data);
				publicing(wxloginurl,data)
				.then((res)=>{
					// console.log(res);
					if(res.data.msg==='success')
					//存在本地
					uni.setStorageSync('usermen',res.data.datas)
					this.ifUser()
				})
				.catch((err)=>{
					console.log(err);
				})
			},
			// 是否已登录
			ifUser(){
				let setdata = uni.getStorageSync('usermen')
				console.log(setdata);
				if(!setdata){
					this.wxlogin = false
				}else{
					this.wxlogin = true
					this.usering = setdata
				}
			}
		},
		data() {
			return {
				wxlogin:true,
				usering:{}
			};

		},
	}
</script>

<style scoped>
	.myhome {
		background: linear-gradient(to top, #ffe566 10%, #ffd300 100%);
		height: 350rpx;
		display: flex;
		align-items: center;
	}

	.wx-name image {
		width: 120rpx !important;
		height: 120rpx !important;
		border-radius: 50%;
		margin-right: 20rpx;
		border: 10rpx solid #999999;
	}

	text {
		display: block;
		margin: 10rpx 0;
		color: #999999;
	}

	.wx-name {
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		align-content: center;
		height: 200rpx;
	}

	.wx-text text {
		font-size: 35rpx;
	}

	/* 登录 */
	.wx-button button {
		border: none;
		font-size: 30rpx;
		background: linear-gradient(to right, #28a6f1 10%, #0e8dd7 80%);
		border-radius: 50rpx;
		color: #FFFFFF;
	}

	.wx-button-view {
		font-size: 35rpx;
		color: #FFFFFF;
		margin-bottom: 25rpx;
	}

	.wx-button {
		margin: 0 auto;
	}
</style>
