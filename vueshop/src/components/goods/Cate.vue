<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!--表格-->
            <tree-table class="tree-table" :data="catelist" :columns="columns" :selection-type="false"
                        :expand-type="false"
                        :show-index="true" border>
                <!--是否有效-->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false"
                       style="color: lightgreen;font-size: 20px"></i>
                    <i class="el-icon-error" v-else style="color: red;font-size: 20px"></i>
                </template>
                <!--排序-->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <!--操作-->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showeditForm(scope.row.cat_id)">编辑
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateByid(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!--分页区域-->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]"
                           :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </el-card>
        <!--添加分类的对话框-->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="40%" @close="addCateDialogClosed">
            <!--添加分类的表单-->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <!--:options指定数据源  :props指定配置对象-->
                    <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
                                 @change="parentCateChanged" clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
        </el-dialog>
        <!--编辑对话框-->
        <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="30%">
            <el-form :model="editForm" :rules="addCateFormRules" ref="editForm">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="editForm.cat_name" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCateInfo">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Cate",
        data() {
            return {
                // 查询条件
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                // 商品分类的数据列表
                catelist: [],
                // 总数据条数
                total: 0,
                // 为table指定列的定义
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name'
                    },
                    {
                        label: '是否有效',
                        type: 'template',  //将当前列定义为模板列
                        template: 'isok' //模板名称
                    },
                    {
                        label: '排序',
                        type: 'template',  //将当前列定义为模板列
                        template: 'order' //模板名称
                    },
                    {
                        label: '操作',
                        type: 'template',  //将当前列定义为模板列
                        template: 'opt' //模板名称
                    }
                ],
                //控制添加分类对话框的显示与隐藏
                addCateDialogVisible: false,
                // 添加分类的表单数据对象
                addCateForm: {
                    // 将要添加的分类的名称
                    cat_name: '',
                    // 父级分类id（0默认没有父级）
                    // (和谁的pid对应，谁就是这个分类的父级，比如大家电的id是1，指定这个分类的pid为1，那这个分类的父级就是大家电)
                    cat_pid: 0,
                    // 分类的等级，默认要添加的是一级分类（0是一级，1是二级，2是三级）
                    cat_level: 0
                },
                // 添加分类表单的验证规则对象
                addCateFormRules: {
                    cat_name: [{
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur'
                    }],
                },
                //父级分类的列表
                parentCateList: [],
                // 指定级联选择器的配置对象
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    expandTrigger: 'hover',
                    checkStrictly: 'true'
                },
                // 选择的父级分类的id数组
                selectedKeys: [],
                // 编辑窗口的显示与隐藏
                editDialogVisible: false,
                //获取当前行的分类
                editForm: {}
            }
        },
        created() {
            this.getCatelist()
        },
        methods: {
            async getCatelist() {
                const {data: res} = await this.$http.get('categories', {params: this.queryInfo});
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败！')
                }
                ;
                // 把数据列表赋值给catelist
                this.catelist = res.data.result;
                // 为总数据条数赋值
                this.total = res.data.total;
            },
            // 监听pagesize改变
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getCatelist()
            },
            // 监听pagenum改变
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getCatelist()
            },
            // 点击按钮，展示添加分类的对话框
            showAddCateDialog() {
                // 先获取父级分类的数据列表
                this.getParentCateList()
                // 再展示对话框
                this.addCateDialogVisible = true
            },
            // 获取父级分类的数据列表
            async getParentCateList() {
                const {data: res} = await this.$http.get('categories', {params: {type: 2}})
                if (res.meta.status !== 200) {
                    return this.$message.error('获取父级分类数据失败！')
                }
                this.parentCateList = res.data
            },
            // 选择项发送变化触发这个函数
            parentCateChanged() {
                //如果selectedKeys数组中的length大于0，证明选中了父级分类，反之说明没有选中任何父级分类
                if (this.selectedKeys.length > 0) {
                    // 指定要添加的分类的父级分类的id（父级分类的id是个数组，数组的长度-1为下标，获取父级id）
                    //例如点击大家电后数组是[1],1是索引0，长度1-1=0，拿到1
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                    // 要添加的分类的等级，父级分类id数组的长度为1，那这个分类的等级就是1，为二级分类
                    this.addCateForm.cat_level = this.selectedKeys.length
                    return
                } else { //没有选中任何父级分类
                    // 父级分类的id和等级都为0，即没有父级
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }
            },
            // 点击按钮，添加新的分类
            addCate() {
                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.post('categories', this.addCateForm)
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加分类失败！')
                    }
                    this.$message.success('添加分类成功！')
                    this.getCatelist()
                    this.addCateDialogVisible = false
                })
            },
            // 监听对话框的关闭事件，重置表单数据
            addCateDialogClosed() {
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0
            },
            // 展示编辑对话框
            async showeditForm(id) {
                const {data: res} = await this.$http.get('categories/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('获取分类名称失败！')
                }
                this.editForm = res.data;
                this.editDialogVisible = true
            },
            // 编辑对话框的提交功能
            editCateInfo() {
                this.$refs.editForm.validate(async valid => {
                    if (!valid) return;
                    const {data:res}=await this.$http.put('categories/'+this.editForm.cat_id,{cat_name:this.editForm.cat_name})
                    if (res.meta.status!==200){
                        return this.$message.error('修改分类名称失败！')
                    }
                    this.editDialogVisible=false
                    this.getCatelist()
                    this.$message.success('修改分类名称成功！')
                })
            },
            // 删除商品分类
            async removeCateByid(id){
                const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消了删除');
                }
                const {data:res}=await this.$http.delete('categories/'+id)
                if (res.meta.status!==200){
                    return this.$message.error('删除分类失败！')
                }
                this.getCatelist()
                this.$message.success('删除分类成功！')
            }
        },
    }
</script>

<style scoped>
    .tree-table {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }

</style>