<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 微信用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="key" placeholder="输入昵称" class="handle-input mr10"></el-input>  
                 
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                
            </div>
            <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable" >
                <el-table-column prop="" label="头像" >
                    <template slot-scope="scope">
                        <img :src="scope.row.avatarUrl" width="80" />
                        <!-- <img :src="getImgSrc(scope.row.goodpicdata)" width="80" /> -->
                    </template>
                </el-table-column>
                <el-table-column prop="openid" label="openid">
                </el-table-column>                
                <el-table-column prop="nickname" label="昵称" >
                </el-table-column>
                <el-table-column prop="gender" label="性别" >
                </el-table-column>
<!--                 
                
                
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope" v-if="scope.row.applystatus != 'unlock'">
                        <el-button type="text"  @click="dealapply(scope.row.id,true)">同意</el-button>
                        <el-button type="text"  class="red" @click="dealapply(scope.row.id,false)">拒绝</el-button>
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

                key:'',
                nickname:'',
                applystatus:'',        
                statuslist:[
                    {
                    id:'',
                    name:'全部'
                },{
                    id:'applying',
                    name:'申请中'
                },
                {
                    id:'unlock',
                    name:'已解锁'
                },
                {
                    id:'refuse',
                    name:'已拒绝'
                }]       
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
                    key: this.key,
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
            
            dealapply(id,bool){
                console.log(id)
                this.$confirm('确定执行该操作？').then((res)=>{
                    this.deal(id,bool)
                })
            },
            deal(id,bool){
                this.$loading()
                this.$axios.post('/unlockapply/dealapply', {id:id,agree:bool}).then((res) => {
                    this.$loading().close()
                    if(res.status.haserror){
                        this.$message.error(res.status.errorshowdesc)
                    }else{
                        this.$message({message:'操作成功',type: 'success'})
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
