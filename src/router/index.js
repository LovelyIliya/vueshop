import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import Home from "../components/Home";
import Welcome from "../components/Welcome";
import Users from "../components/user/Users";
import Right from "../components/power/Right";
import Roles from "../components/power/Roles";
import Cate from "../components/goods/Cate";

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
