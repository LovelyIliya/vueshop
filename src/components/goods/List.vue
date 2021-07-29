<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>
            <!--table表格区域-->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格（元）" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="150px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click="editById(scope.row.goods_id)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click="removeById(scope.row.goods_id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="queryInfo.pagenum" :page-sizes="[10, 20, 30, 40]"
                           :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total" background>
            </el-pagination>
            <!--修改窗口区域-->
            <el-dialog title="修改商品信息" :visible.sync="editlogVisible" width="30%">
                <el-form :model="editForm" :rules="goodsRules" ref="goodsFormRef" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="商品名称">
                        <el-input v-model="editForm.goods_name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="editForm.goods_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="editForm.goods_weight" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="editForm.goods_number" type="number"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
    <el-button @click="editlogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editListInfo">确 定</el-button>
  </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "List",
        data() {
            return {
                // 查询参数对象
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                // 商品列表
                goodslist: [],
                // 修改窗口获取的商品信息
                editForm: [],
                // 总数据条数
                total: 0,
                // 修改窗口的显示与隐藏
                editlogVisible: false,
                // 修改参数验证规则
                goodsRules: {
                    goods_price: [{
                        required: true,
                        message: '请输入商品价格',
                        trigger: 'blur'
                    }],
                    goods_weight: [{
                        required: true,
                        message: '请输入商品重量',
                        trigger: 'blur'
                    }],
                    goods_number: [{
                        required: true,
                        message: '请输入商品数量',
                        trigger: 'blur'
                    }]
                }
            }
        },
        created() {
            this.getGoodsList()
        },
        methods: {
            //根据分页获取对应的商品列表
            async getGoodsList() {
                const {data: res} = await this.$http.get('goods', {params: this.queryInfo})
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品列表失败！')
                }
                this.$message.success('获取商品列表成功！')
                this.goodslist = res.data.goods
                this.total = res.data.total
            },
            //当前显示多少数据
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getGoodsList()
            },
            //显示第几页
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            },
            //删除商品列表
            async removeById(id) {
                const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                const {data: res} = await this.$http.delete('goods/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除失败！')
                }
                this.$message.success('删除成功！')
                this.getGoodsList()
            },
            // 添加商品
            goAddpage() {
                this.$router.push('/goods/add')
            },
            // 显示修改表单窗口
            async editById(id) {
                const {data: res} = await this.$http.get('goods/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('查询商品信息失败！')
                }
                this.editForm = res.data
                this.editlogVisible = true
                console.log(this.editForm.goods_id)
            },
            // 确定修改
            editListInfo() {
                this.$refs.goodsFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.put('goods/' + this.editForm.goods_id, {
                        goods_name:this.editForm.goods_name,
                        goods_price:this.editForm.goods_price,
                        goods_number:this.editForm.goods_number,
                        goods_weight:this.editForm.goods_weight,
                        goods_introduce:this.editForm.goods_introduce,
                        pics:this.editForm.pics,
                        attrs:this.editForm.attrs,
                        goods_cat:this.editForm.goods_cat
                    })
                    if (res.meta.status !== 200) {
                        return this.$message.error('修改商品信息失败！')
                    }
                    this.$message.success('修改商品信息成功！')
                    this.getGoodsList()
                    this.editlogVisible = false
                })
            }
        }
    }
</script>

<style scoped>

</style>