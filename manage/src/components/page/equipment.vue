<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 设备列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="输入设备名称" class="handle-input mr10"></el-input>  
                <el-input v-model="hospital" placeholder="输入医院名称" class="handle-input mr10"></el-input> 
                <el-select v-model="province" placeholder="请选择省" class="mr10">
                    <el-option
                    v-for="item in provincelist"
                    :key="item.placeid"
                    :label="item.placename"
                    :value="item.placename"
                    >
                    </el-option>
                </el-select> 
                  
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" plain icon="search" @click="$router.push('/equipmentAdd')">新增设备</el-button>
            </div>
            <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="goodsuuid" label="编号">
                </el-table-column>
                <!-- <el-table-column prop="" label="图片" >
                    <template slot-scope="scope">
                        <img :src="getImgSrc(scope.row.goodpicdata)" width="80" />
                    </template>
                </el-table-column> -->
                <el-table-column prop="name" label="设备名称" >
                </el-table-column>
                <el-table-column prop="hospital" label="医院">
                </el-table-column>
                <el-table-column prop="province" label="省">
                </el-table-column>
                <!-- <el-table-column label="属性" >
                    <template slot-scope="scope">
                        <span v-for="(item,index) in displayJSON(scope.row.goodsteplet) " :key="index" v-if="item.key!=''">
                           {{item.key}}:{{item.value}}<br>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="隐藏属性" >
                    <template slot-scope="scope">
                        <span v-for="(item,index) in displayJSON(scope.row.goodstempletlockcontext) " :key="index" v-if="item.key!=''">
                            {{item.key}}:{{item.value}}<br>
                        </span>
                    </template>
                </el-table-column> -->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row.goodsuuid)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.goodsuuid)">删除</el-button>
                    </template>
                </el-table-column>
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
        mounted(){
            this.$axios.post('/place/list',{upplaceid:0}).then((res) => {
                if (res.status.haserror) {
                    this.$message.error(res.status.errorshowdesc)
                } else {

                    this.provincelist=res.data
                    this.provincelist.unshift({
                        "placeid":0,
                        "placename":"请选择"
                    })
                }
            })
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
                hospital:"",
                province:"请选择",
                idx: -1,
               
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.map((d,index) => {
                    if(!d.img && d.goodspic){
                        this.downloadImg(d.goodspic).then(res=>{
                            this.$set(d,'img','data:image/png;base64,'+res)
                        })
                    }
                    return d
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val -1 ;
                this.getData();
            },
            getData() {
                if(this.province=="请选择"){
                    this.province=""
                }
                this.loading = true
                this.$axios.post('/goods/list', {
                    page: this.cur_page,
                    key: this.select_word,
                    limit: this.limit,
                    offset: this.limit * this.cur_page,
                    hospital:this.hospital,
                    province:this.province,
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
            //新增药品
            addUser(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$loading()
                        let url = '/drug/add'
                        let data = {
                            name: this.form.name,
                            classid: this.form.category,
                            reagent:this.form.reagent,
                            chromatographiccolumn:this.form.column,
                            controls:this.form.controls,
                            testmethod:this.form.testmethod
                        }
                        if(this.idx != -1){
                            url = '/drug/update'
                            data.id = this.form.id
                        }
                        this.$axios.post(url, data).then((res) => {
                            this.$loading().close()
                            this.idx = -1
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
