<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="输入用户名称" class="handle-input mr10"></el-input>  
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                
            </div>
            <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable" >
                <el-table-column prop="id" label="编号">
                </el-table-column>
                <el-table-column prop="" label="头像" >
                    <template slot-scope="scope">
                        <img :src="getImgSrc(scope.row.avatarUrl)" width="80" />
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="昵称">
                </el-table-column>
                <el-table-column prop="gender" label="性别" >
                   <template slot-scope="scope">
                        {{scope.row.gender | gender}}
                    </template>
                </el-table-column>
                <el-table-column prop="province" label="省" >
                </el-table-column>
                <el-table-column prop="city" label="城市" >
                </el-table-column>
                
                <!-- <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row.goodsuuid)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.goodsuuid)">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="limit" :total="totalcount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import vAdd from './equipmentAdd.vue';
    export default {
        name: 'medicine',
        components:{
            vAdd
        },        
        data() {
            return {
                loading:false,
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
                    category: '',
                    column: '',
                    controls:'',
                    testmethod:''
                },
                category:[],
                search_cate:'',
                idx: -1,
               
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
                this.cur_page = val -1 ;
                this.getData();
            },
            getData() {
                this.loading = true
                this.$axios.post('/wxuser/list', {
                    page: this.cur_page,
                    key: this.select_word,
                    limit: this.limit,
                    offset: this.limit * this.cur_page,
                }).then((res) => {
                    this.loading=false
                    if(res.status.haserror){
                        this.$message.error(res.status.errorshowdesc)
                    }else{
                        this.tableData = res.data?res.data:[];
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
            handleEdit(uid) {
                this.$router.push('/equipmentAdd?id='+uid)
            },
            handleDelete(uid) {
                this.$confirm('确认删除该条信息？').then((res)=>{
                    this.delItem(uid)
                })
                // this.delVisible = true;
            },
            delItem(uid){
                this.$loading()
                this.$axios.post('drug/del', {id:this.idx}).then((res) => {
                    this.$loading().close()
                    this.idx = -1
                    if(res.status.haserror){
                        this.$message.error(res.status.errorshowdesc)
                    }else{
                        this.$message({message:'操作成功',type: 'success'})
                        Object.keys(this.form).map((key)=>{
                            this.form[key] = ''
                        })
                        this.getData()
                    }
                })
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
