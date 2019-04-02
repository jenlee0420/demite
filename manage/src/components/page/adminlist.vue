<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" plain icon="search" @click="editVisible = true">新增管理员</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="id" label="编号">
                </el-table-column>
                <el-table-column prop="name" label="姓名" >
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="limit" :total="totalcount">
                </el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增管理员" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item prop="name" label="用户名">
                    <el-input v-model="form.name" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="pwd" label="密码">
                    <el-input placeholder="password" type="password" v-model="form.pwd"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'basetable',
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
                form: {
                    name: '',
                    date: '',
                    address: ''
                },
                idx: -1,
                rules: {
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    pwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
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
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val - 1;
                this.getData();
            },
            getData() {
                this.$axios.post('/user/list', {
                    page: this.cur_page,
                    key: this.select_word,
                    limit: this.limit,
                    offset: this.limit * this.cur_page,
                }).then((res) => {
                    if(res.status.haserror){
                        this.$message.error(res.status.errorshowdesc)
                    }else{
                        this.tableData = res.data;
                        this.totalcount = res.count
                    }
                })
            },
            search() {
                this.is_search = true;
                this.cur_page  = 0
                this.getData()
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            //新增管理员
            addUser(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/user/add', {
                            name: this.form.name,
                            pwd: this.form.pwd,
                        }).then((res) => {
                            if(res.status.haserror){
                                this.$message.error(res.status.errorshowdesc)
                            }else{
                                this.$message({message:'添加成功',type: 'success'})
                                this.editVisible = false;
                                this.form.name = ''
                                this.form.pwd = ''
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
