<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 药品分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" plain icon="search" @click="editVisible = true;subCmd =false">新增一级分类</el-button>
            </div>
            
            <!-- <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left">
                            <el-form-item>
                                <span>{{ props.row.name}}</span>
                                <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </el-form-item>
                            <el-form-item>
                                <span>{{ props.row.name}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
            
                <el-table-column prop="name" label="名称" >
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-plus" @click="addSub(scope.row.name)">添加子类</el-button>
                    </template>
                </el-table-column>
            </el-table> -->
            <el-tree
                class="tree"
                :data="tableData"
                :props="defaultProps"
                default-expand-all
                node-key="id"
                :expand-on-click-node="false"
                :render-content="renderContent">
                </el-tree>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增药品分类" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="所属分类" v-if="subCmd">
                    {{subCmd}}
                </el-form-item>
                <el-form-item prop="name" label="分类名称">
                    <el-input v-model="form.name" placeholder="分类名称" maxlength="10"></el-input>
                </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false;subCmd =false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'medicine',
        data() {
            return {
                url: './vuetable.json',
                tableData: [],
                cur_page: 0,
                limit:10,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                subCmd:false,
                delVisible: false,
                totalcount:1,
                loading:false,
                form: {
                    id:'',
                    name: '',
                },
                idx: -1,
                defaultProps: {
          children: 'data',
          label: 'name'
        },
                rules: {
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                }
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            //添加子分类弹窗
            addSub(data){
                this.editVisible = true
                this.subCmd = data.name
                this.form.pid = data.id
            },
            
            renderContent(h, { node, data, store }) {
                let sub=false
                if(typeof(data.data) != 'undefined'){
                    sub=true
                }
                if(sub){
                    return (
                    <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                        <span>
                        <span>{node.label}</span>
                        </span>
                        <span>
                        <el-button style="font-size: 12px;" type="text" on-click={ () => this.addSub(data) }>添加子类</el-button>
                        <el-button style="font-size: 12px;" type="text" on-click={ () => this.handleEdit(data) }>编辑</el-button>
                        <el-button style="font-size: 12px;" type="text" on-click={ () => this.handleDelete(data) }>删除分类</el-button>
                        </span>
                    </span>);
                }else{
                    return (
                    <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                        <span>
                        <span>{node.label}</span>
                        </span>
                        <span>
                        <el-button style="font-size: 12px;" type="text" on-click={ () => this.handleEdit(data) }>编辑</el-button>
                        <el-button style="font-size: 12px;" type="text" on-click={ () => this.handleDelete(data) }>删除分类</el-button>
                        </span>
                        
                    </span>);
                }
                
            },
            getData() {
                this.loading=true
                this.$axios.post('/druclass/list',{}).then((res) => {
                    this.loading=false
                    if(res.status.haserror){
                        this.$message.error(res.status.errorshowdesc)
                    }else{
                        this.tableData = res.data;
                        // this.totalcount = res.count
                    }
                })
            },
            handleEdit(data) {
                this.idx = data.id
                this.form = {
                    name: data.name,
                    id: data.id
                }
                this.editVisible = true;
            },
            handleDelete(data) {
                this.idx = data.id
                this.$confirm('确认删除该分类信息？').then((res)=>{
                    this.deleteRow()
                }).catch(_ => {});
            },
            // 确定删除
            deleteRow(){
                this.$loading()
                this.$axios.post('druclass/del', {classid:this.idx}).then((res) => {
                    this.$loading().close()
                    this.idx = -1
                    if(res.status.haserror){
                        this.$message.error(res.status.errorshowdesc)
                    }else{
                        this.$message({message:'操作成功',type: 'success'})
                        this.getData()
                    }
                })
            },

            //新增分类
            add(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$loading()
                        let url = '/druclass/add'
                        if(this.idx != -1){
                            url = '/druclass/update'
                        }
                        this.$axios.post(url, {
                            name: this.form.name,
                            upclassid: this.form.pid?this.form.pid:0,
                            classid:this.form.id
                        }).then((res) => {
                            this.$loading().close()
                            this.idx = -1
                            // console.log(this.$loading)
                            if(res.status.haserror){
                                this.$message.error(res.status.errorshowdesc)
                            }else{
                                this.$message({message:'添加成功',type: 'success'})
                                this.editVisible = false;
                                this.form.name = ''
                                this.getData()
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // openLoadingbox(){
            //     const loading = this.$loading({
            //         lock: true,
            //         text: 'Loading',
            //         spinner: 'el-icon-loading',
            //     });
            // }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
    .tree{
        border: 1px solid #e5e5e5;
    }
    .el-tree .el-tree-node__content{
        height: 30px;
    }
</style>
