import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/*webpackChunkName:"login_home_welcome"*/ '../components/Login')
const Home = () => import(/*webpackChunkName:"login_home_welcome"*/ '../components/Home')
const Welcome = () => import(/*webpackChunkName:"login_home_welcome"*/ '../components/Welcome')

const Users = () => import(/*webpackChunkName:"Users_Rights_Roles"*/ '../components/user/Users')
const Right = () => import(/*webpackChunkName:"Users_Rights_Roles"*/ '../components/power/Right')
const Roles = () => import(/*webpackChunkName:"Users_Rights_Roles"*/ '../components/power/Roles')

const Cate = () => import(/*webpackChunkName:"Cate_Params"*/ '../components/goods/Cate')
const Params = () => import(/*webpackChunkName:"Cate_Params"*/ '../components/goods/Params')


const GoodsList = () => import(/*webpackChunkName:"GoodsList_Add"*/ '../components/goods/List')
const Add = () => import(/*webpackChunkName:"GoodsList_Add"*/ '../components/goods/Add')


const Order = () => import(/*webpackChunkName:"Order_Report"*/ '../components/order/Order')
const Report = () => import(/*webpackChunkName:"Order_Report"*/ '../components/report/Report')

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },

    {
        path: '/login',
        component: Login
    },

    {
        path: '/Home',
        component: Home,
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/rights',
                component: Right
            },
            {
                path: '/roles',
                component: Roles
            },
            {
                path: '/categories',
                component: Cate
            },
            {
                path: '/params',
                component: Params
            },
            {
                path: '/goods',
                component: GoodsList
            },
            {
                path: '/goods/add',
                component: Add
            },
            {
                path: '/orders',
                component: Order
            },
            {
                path: '/reports',
                component: Report
            }
        ]
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login');
    next()
})

export default router
