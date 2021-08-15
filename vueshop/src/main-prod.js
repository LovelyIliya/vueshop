import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
import axios from "axios";

//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入进度条效果
import nprogress from 'nprogress'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求拦截
axios.interceptors.request.use(config => {
    nprogress.start() //展示进度条
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

axios.interceptors.response.use(config => {
    nprogress.done() //隐藏进度条
    return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

//时间转换过滤器
Vue.filter('dateFormat', function (originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
