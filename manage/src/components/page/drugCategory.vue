<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 药品分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" plain icon="search" @click="editVisible = true">新增分类</el-button>
            </div>
            <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="name" label="名称" >
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增药品分类" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item prop="name" label="分类名称">
                    <el-input v-model="form.name" placeholder="分类名称" maxlength="10"></el-input>
                </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
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
                delVisible: false,
                totalcount:1,
                loading:false,
                form: {
                    name: '',
                },
                idx: -1,
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
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    id: item.id
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.idx = item.id;
                this.$confirm('确认删除该条信息？').then((res)=>{
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
                            classid: this.form.id
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
</style>
