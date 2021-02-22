<template>
	<view class="warp" v-if="modaishow">
		<view class="warp-view">
			<view class="warp-text">请登陆后再操作</view>
			<view class="warp-flex">
				<button @click="messcancel()" plain="true">取消</button>
				<button plain="true" open-type="getUserInfo" @getuserinfo="getUserInfo">登录</button>
			</view>
		</view>
		<!-- 提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
	import {
		publicing
	} from "@/api/api.js"
	import {
		wxloginurl
	} from '@/api/request.js'
	// 引入提示组件
	import HMmessages from "@/common/HM-messages/HM-messages.vue"
	export default {
		components: {
			HMmessages
		},
		data() {
			return {
				modaishow: false
			}
		},
		methods: {
			// 显示
			init() {
				this.modaishow = true
			},
			//取消
			messcancel() {
				this.modaishow = false
			},
			//登录
			getUserInfo(event) {
				this.modaishow = false
				// console.log(event.detail);
				if (event.detail.userInfo) {
					let wxing = event.detail.userInfo
					this.wxCode(wxing.avatarUrl, wxing.nickName)

				}
			},
			// 获取code
			wxCode(avatarUrl, nickName) {
				uni.login({
					success: (res) => {
						// console.log(res);
						let code = res.code
						const appid = ""
						const secret = ""
						this.wxLogin(avatarUrl, nickName, code, appid, secret)
					},
					fail: (err) => {
						console.log(err);
					}
				})
			},
			//发送请求
			wxLogin(avatarUrl, nickName, code, appid, secret) {
				let data = {
					avatarUrl,
					nickName,
					code,
					appid,
					secret
				}
				console.log(data);
				publicing(wxloginurl, data)
					.then((res) => {
						// console.log(res);
						if (res.data.msg === 'success')
							//存在本地
							uni.setStorageSync('usermen', res.data.datas)
						let succ = '登录成功'
						let ico = 'success'
						this.tIps(succ, ico)
					})
					.catch((err) => {
						console.log(err);
						let succ = '登录失败'
						let ico = 'error'
						this.tIps(succ, ico)
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
			}
		},
	}
</script>

<style scoped>
	/* 模态弹窗布局 */
	.warp {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 0;
	}

	.warp-view {
		width: 500rpx;
		height: 200rpx;
		background: #FFFFFF;
		margin: auto;
		position: absolute;
		-webkit-position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		border-radius: 8rpx;
		overflow: hidden;
	}

	.warp-text {
		text-align: center;
		margin-top: 30rpx;
		font-size: 34rpx;
		color: #666666;
	}

	.warp-flex {
		display: flex;
		justify-content: space-around;
		border-top: 1rpx solid #EEEEEE;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 80rpx;
		line-height: 80rpx;
	}

	.warp-flex button {
		border: none;
		font-size: 30rpx;
	}
</style>
