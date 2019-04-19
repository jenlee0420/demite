<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 维修组员管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" plain icon="search" @click="editVisible = true">新增员工</el-button>
            </div>
            <el-table v-loading="loading"   :data="tableData" border class="table" ref="multipleTable">
                <el-table-column prop="staffno" label="工号">
                </el-table-column>
                <el-table-column prop="name" label="姓名" >
                </el-table-column>
                <el-table-column prop="staffphone" label="手机" >
                </el-table-column>
                <el-table-column prop="staffdesc" label="描述" >
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <!-- <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="limit" :total="totalcount">
                </el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增员工" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item prop="staffno" label="工号">
                    <el-input v-model="form.staffno" placeholder="工号"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="姓名">
                    <el-input v-model="form.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item prop="staffphone" label="手机">
                    <el-input placeholder="手机" v-model="form.staffphone"></el-input>
                </el-form-item>
                <el-form-item prop="staffdesc" label="描述">
                    <el-input placeholder="描述" v-model="form.staffdesc"></el-input>
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
    export function validatePhone(rule, value,callback) {
        const reg =/^[1][3,4,5,7,8][0-9]{9}$/;
        if(value==''||value==undefined||value==null){
            callback();
        }else {
            if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的电话号码'));
            } else {
            callback();
            }
        }
    }
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 0,
                limit:10,
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                select_word:'',
                totalcount:1,
                loading:false,
                form: {
                    name: '',
                    staffdesc: '',
                    staffphone: '',
                    staffno:'',
                },
                idx: -1,
                rules: {
                    staffno: [
                        { required: true, message: '请输入工号', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    staffphone: [
                        { required: true, message: '请输入手机', trigger: 'blur' },
                        { validator: validatePhone, trigger: 'blur' },
                    ],
                }
            }
        },
        created() {
            this.getData();
        },
        computed: {
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val - 1;
                this.getData();
            },
            getData() {
                this.loading = true 
                this.$axios.post('/staff/list', {
                    page: this.cur_page,
                    key: this.select_word,
                    limit: this.limit,
                    offset: this.limit * this.cur_page,
                }).then((res) => {
                    this.loading = false
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
            //新增员工
            addUser(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$loading()
                        let url = '/staff/add'
                        let data = this.form
                        if(this.idx != -1){
                            url = '/staff/update'
                            // data.id = this.form.id
                        }
                        this.$axios.post(url, data).then((res) => {
                            this.$loading().close()
                            if(res.status.haserror){
                                this.$message.error(res.status.errorshowdesc)
                            }else{
                                this.$message({message:'操作成功',type: 'success'})
                                this.editVisible = false;
                                Object.keys(this.form).map((key)=>{
                                    this.form[key] = ''
                                })
                                this.getData()
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = item
                this.editVisible = true;
            },
            handleDelete(index, row) {
                const item = this.tableData[index];
                this.idx = item.id;
                this.$confirm('确认删除该条信息？').then((res)=>{
                    this.delItem()
                }).catch(_ => {});
            },
            delItem(){
                this.$loading()
                this.$axios.post('staff/del', {id:this.idx}).then((res) => {
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
