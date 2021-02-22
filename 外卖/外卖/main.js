import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// 引入vuex文件
import store from 'store/store.js'
Vue.prototype.$store = store

const app = new Vue({
    ...App,
	store
})
app.$mount()
