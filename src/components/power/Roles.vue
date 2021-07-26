<template>
    <div>
        <!-- 面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图-->
        <el-card>
            <!--添加角色按钮区域-->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addrolelog=true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域-->
            <el-table :data="rolelist" border stripe>
                <!--展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!--动态绑定样式 全都绑定bdbottom样式，然后三元判断是不是第一个，如果是再加上bdtop样式-->
                        <el-row :class="['bdbottom', i1===0 ? 'bdtop':'','vcenter']"
                                v-for="(item1,i1) in scope.row.children"
                                :key="item1.id">
                            <!--渲染一级权限-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightByid(scope.row,item1.id)">{{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限-->
                            <el-col :span="19">
                                <!--渲染二级权限-->
                                <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children"
                                        :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightByid(scope.row,item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id"
                                                closable @close="removeRightByid(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delect"
                                   @click="removeRoleById(scope.row.id)">删除
                        </el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting"
                                   @click="showSetRightDialog(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--添加角色窗口-->
            <el-dialog title="添加角色" :visible.sync="addrolelog" width="30%" @close="addRoleClosed">
                <!--内容主体区域-->
                <span>
                    <el-form :model="addForm" :rules="FormRoles" ref="addFormRef" label-width="90px">
                          <el-form-item label="角色名" prop="roleName">
                            <el-input v-model="addForm.roleName"></el-input>
                          </el-form-item>
                          <el-form-item label="角色描述" prop="roleDesc">
                            <el-input v-model="addForm.roleDesc"></el-input>
                          </el-form-item>
                    </el-form>
                </span>
                <!--                底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addrolelog = false">取 消</el-button>
                    <el-button type="primary" @click="addRole">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 修改角色窗口-->
            <el-dialog title="修改角色" :visible.sync="editrolelogVisible" width="30%">
                <span>
                    <el-form :model="editForm" :rules="FormRoles" ref="editFormRef" label-width="90px">
                        <el-form-item label="用户名" prop="roleName">
                            <el-input v-model="editForm.roleName"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" prop="roleDesc">
                            <el-input v-model="editForm.roleDesc"></el-input>
                        </el-form-item>
                    </el-form>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editrolelogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
        <!--         分配权限的对话框   -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="40%" @close="setRightDialogClosed">
            <!--                树形控件-->
            <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                     :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
             </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Roles",
        data() {
            return {
                // 所有角色列表数据
                rolelist: [],
                //当前行的角色信息
                editForm: {},
                //控制添加角色窗口显示隐藏
                addrolelog: false,
                //控制修改角色信息窗口显示与隐藏
                editrolelogVisible: false,
                //控制分配权限对话框的显示隐藏
                setRightDialogVisible: false,
                //保存当前行的角色权限
                rightList: [],
                //默认选择的节点id值
                defKeys: [],
                //树形控件的属性绑定对象
                treeProps: {
                    children: 'children',
                    label: 'authName'
                },
                //添加角色的默认数据（双向绑定）
                addForm: {
                    roleName: '',
                    roleDesc: ''
                },
                //添加角色的校验规则
                FormRoles: {
                    roleName: [
                        {
                            required: true,
                            message: '请输入角色名',
                            trigger: 'blur'
                        }],
                    roleDesc: [{
                        required: true,
                        message: '请输入角色描述',
                        trigger: 'blur'
                    }]
                },
                // 当前即将分配权限的角色id
                roleId: '',
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            // 获取所有角色的列表
            async getRolesList() {
                const {data: res} = await this.$http.get('roles');
                if (res.meta.status !== 200) {
                    return this.$message.error('获取角色列表失败！');
                }
                this.rolelist = res.data
            },
            // 添加角色按钮
            addRole() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.post('roles', this.addForm)
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加角色失败！');
                    }
                    this.$message.success('添加角色成功！');
                    this.addrolelog = false;
                    this.getRolesList()
                })
            },
            //清空添加角色窗口中的内容
            addRoleClosed() {
                this.$refs.addFormRef.resetFields()
            },
            //编辑角色窗口
            async showEditDialog(id) {
                const {data: res} = await this.$http.get('roles/' + id);
                if (res.meta.status !== 200) {
                    return this.$message.error('查询用户信息失败！')
                }
                this.editForm = res.data
                this.editrolelogVisible = true
            },
            //取消编辑角色窗口事件
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            //确定修改用户信息
            editRoleInfo() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.put('roles/' + this.editForm.roleId, {
                        roleName: this.editForm.roleName,
                        roleDesc: this.editForm.roleDesc
                    });
                    if (res.meta.status !== 200) {
                        return this.$message.error('编辑角色失败！');
                    }
                    this.editrolelogVisible = false;
                    this.getRolesList()
                    this.$message.success('编辑角色成功！');
                })
            },
            async removeRoleById(id) {
                // 弹框询问用户是否删除数据
                const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                const {data: res} = await this.$http.delete('roles/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除角色失败！')
                }
                this.$message.success('删除角色成功！');
                this.getRolesList();
            },
            // 根据id删除对应的权限
            async removeRightByid(role, rightId) {
                const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消了删除');
                }
                const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除权限失败！')
                }
                //防止删除权限后列表合上，使用重新赋值的方式刷新权限列表
                role.children = res.data;
            },
            // 展示分配权限的对话框
            async showSetRightDialog(role) {
                this.roleId = role.id
                // 获取所有权限的数据
                const {data: res} = await this.$http.get('rights/tree')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取权限数据失败！')
                }
                //把获取到的权限数据保存到data中
                this.rightList = res.data
                // 递归获取三级节点的id
                this.getLeafKeys(role, this.defKeys)
                this.setRightDialogVisible = true
            },
            //通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
            getLeafKeys(node, arr) {
                //如果当前node节点不包含children属性，则是三级节点
                if (!node.children) {
                    return arr.push(node.id)
                } else {
                    node.children.forEach(item => this.getLeafKeys(item, arr))
                }
            },
            // 监听分配权限对话框的关闭事件
            setRightDialogClosed() {
                this.defKeys = []
            },
            //点击为角色分配权限
            async allotRights() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(), //通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性
                    ...this.$refs.treeRef.getHalfCheckedKeys()//若节点可被选择，则返回目前半选中的节点的 key 所组成的数组
                ]
                const idStr = keys.join(',')
                const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
                if (res.meta.status !== 200) {
                    return this.$message.error('分配权限失败！')
                }
                this.$message.success('分配权限成功！')
                this.getRolesList()
                this.setRightDialogVisible = false
            },
        }
    }
</script>

<style scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>