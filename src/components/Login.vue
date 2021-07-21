<template>
    <div class="login_container">
        <div class="login_box">
            <!--            头像区域-->
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!--            登录表单区域-->
            <el-form ref="loginFormRef" label-width="0px" :model="loginFrom" :rules="loginFormrules" class="login_form">
                <!--                用户名-->
                <el-form-item prop="username">
                    <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!--                密码-->
                <el-form-item prop="password">
                    <el-input v-model="loginFrom.password" prefix-icon="iconfont icon-3702mima"
                              type="password" prop="name"></el-input>
                </el-form-item>
                <!--                按钮-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetloginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="footer">
            <p>作者社交主页</p>
            <p>CSDN：&nbsp;&nbsp;<a href="https://blog.csdn.net/zzz18789">https://blog.csdn.net/zzz18789 </a></p>
            <p>GitHub：<a href="https://github.com/LovelyIliya/">https://github.com/LovelyIliya/</a></p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                // 登录表单的数据绑定对象
                loginFrom: {
                    username: 'admin',
                    password: '123456'
                },
                // 表单验证规则对象
                loginFormrules: {
                    // 验证用户名是否合法
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    // 验证密码是否合法
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods:{
            // 重置按钮
            resetloginForm(){
                this.$refs.loginFormRef.resetFields();
            },
            login(){
                this.$refs.loginFormRef.validate(async valid=> {
                    if (!valid)return;
                    //解构赋值获取data命名为res   async await异步执行
                    const {data : res} = await this.$http.post('login',this.loginFrom);
                    if (res.meta.status !== 200) return this.$message.error('登录失败');
                    this.$message.success('登录成功');
                    //token 身份码
                    //将登录成功之后的token保存到客户端的sessionStorage中
                    //项目中除了登录之外的API接口，必须在登录之后才能访问
                    //token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
                    window.sessionStorage.setItem('token',res.data.token);
                    this.$router.push('/home')
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .avatar_box {
            height: 130px;
            width: 130px;
            border: 1px #eee solid;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #cccccc;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }

    .footer{
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        color: white;
        text-align: center;
        a{
            color: white;
        }
    }
</style>