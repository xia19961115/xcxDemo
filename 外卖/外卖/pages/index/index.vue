<template>
	<view class="contenting">
		<Search></Search>
		<Preference :preferlist='preferlist'></Preference>
		<Title></Title>
		<view @click="poll()" :catchtouchmove="true">
			<Delicacy id='boxFixed' :class="{'is_fixed' : isfixed}"></Delicacy>
		</view>
		<view style="height: 50rpx;"></view>
		<Takeout :takeshop='takeshop'></Takeout>
	</view>
</template>

<script>
	// 引入vuex的mapstate
	import {mapState} from 'vuex'
	//引入组件
	import Search from '@/components/Search.vue'
	import Preference from '@/components/Preference.vue'
	import Title from '@/components/Title.vue'
	import Delicacy from '@/components/Delicacy.vue'
	import Takeout from'@/components/Takeout.vue'


	//引入请求接口
	import {
		listing
	} from '../../api/api.js'
	//引入错误提示
	import {
		errdata
	} from '../../api/errdata.js'
	// 引入请求地址
	import {
		getpreferurl,
		wxshopurl
	} from '../../api/request.js'
	export default {
		components: {
			Search,
			Preference,
			Title,
			Delicacy,
			Takeout

		},
		data() {
			return {
				// 为你优选
				preferlist: '',
				//商家列表
				takeshop:'',
				rect: '',
				menutop: '',
				topdata: '',
				isfixed: false,
			}
		},
		mounted() {
			// 监听筛选组件距离顶部的距离(不同设备去监听)
			const query = uni.createSelectorQuery()
			query.select('#boxFixed').boundingClientRect()
			query.exec((res) => {
				// console.log(res[0].top);
				this.menutop = res[0].top
				this.topdata = res[0].top
			})
		},
		onLoad() {
			//进入页面知道去访问数据
			this.preferdata()
		},
		//监听页面滚蛋距离
		onPageScroll(e) {
			// console.log(e.scrollTop);

			this.rect = e.scrollTop
			this.namepage()

		},
		methods: {
			
			preferdata() {
				// 单数据请求
				// listing(getpreferurl)
				// 	.then((res) => {
				// 		// console.log(res.data);
				// 		this.preferlist = res.data
				// 	}).catch((err) => {
				// 		console.log(err);
				// 	})
				//并发请求(Promise.all)
				Promise.all([listing(getpreferurl),listing(wxshopurl)])
				.then((res)=>{
					// console.log(res[1].data);
					//为你优选
					this.preferlist =res[0].data
					//商家列表
					this.takeshop =res[1].data
				}).catch((err)=>{
					console.log(err);
				})
					
			},
			// 回到顶部
			poll() {
				uni.pageScrollTo({
					scrollTop: this.topdata,
					duration: 300
				})
			},
			namepage() {
				if (this.rect > this.menutop) {
					// console.log('置顶')
					this.isfixed = true
				} else {
					// console.log('不置顶')
					this.isfixed = false
				}
			}
		},
		computed:{
			...mapState(['screendata']),
				count(){
						this.takeshop = this.screendata.screenarr
					}
		},
		// updated() {
		// 	...mapState(['screendata']),
		// 	count(){
		//  			this.takeshop = this.screendata.screenarr
		// 			}
		// }
		//计算属性
		// beforeUpdate:{
		// 	...mapState(['screendata']),
		// 	count(){
		// 			this.takeshop = this.screendata.screenarr
		// 		}
			
		// }
		// {
		// 	...mapState(['screendata']),
		// 	// 筛选来的商家数据
		// 	count(){
		// 		this.takeshop = this.screendata.screenarr
		// 	}
		// },
		// 	//监听筛选组件置顶 和不置顶
		// 	namepage(){
		// 		if(this.rect > this.menutop){
		// 			// console.log('置顶')
		// 			// this.isfixed = true
		// 			return true
		// 		}else{
		// 			// console.log('不置顶')
		// 			// this.isfixed = false
		// 			return false
		// 		}
		// 	}
		 
	}
</script>

<style scoped>
	.contenting {
		margin: 0 15rpx;

	}

	.is_fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
	}
</style>
