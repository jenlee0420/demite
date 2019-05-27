<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 药品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="输入药品名称" class="handle-input mr10"></el-input>
                <label class="mr10">分类筛选</label>
                <el-cascader class="mr10"
                    :options="category"
                    v-model="search_cate"
                    :props="defaultProps"
                    :value="search_cate"
                    clearable
                    change-on-select
                    >
                </el-cascader>
                <!-- <el-select v-model="search_cate" placeholder="请选择" class="mr10">
                        <el-option label="全部" value = "" ></el-option>
                        <el-option
                        v-for="item in category"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        >
                        </el-option>
                    </el-select> -->
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" plain icon="search" @click="addprop">新增药品</el-button>
            </div>
            <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="id" label="编号">
                </el-table-column>
                <el-table-column prop="name" label="药品名称" >
                </el-table-column>
                <el-table-column prop="classname" label="分类" >
                </el-table-column>
                <el-table-column prop="reagent" label="试剂" >
                </el-table-column>
                <el-table-column prop="chromatographiccolumn" label="色谱柱" >
                </el-table-column>
                <el-table-column prop="controls" label="质控品" >
                </el-table-column>
                <el-table-column prop="testmethod" label="检测方法" >
                </el-table-column>
                <el-table-column prop="preprocessing" label="样品预处理" >
                </el-table-column>
                <el-table-column prop="range" label="治疗浓度范围" >
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="limit" :total="totalcount">
                </el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog :title="propTitle" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :rules="rules" :model="form" label-width="110px">
                <el-form-item prop="name" label="药品名称">
                    <el-input v-model="form.name" placeholder="药品名称"></el-input>
                </el-form-item>
                <el-form-item prop="category" label="所属分类">
                    <el-cascader class="mr10"
                        :options="category"
                        :props="defaultProps"
                        v-model="form.category"
                        >
                    </el-cascader>
                    <!-- <el-select class="mr10" v-model="form.category" @change="setSub" placeholder="请选择">
                        <el-option
                        v-for="item in category"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        >
                        </el-option>
                    </el-select> -->
                   
                </el-form-item>
                <el-form-item prop="reagent" label="试剂">
                    <el-input placeholder="试剂" v-model="form.reagent"></el-input>
                </el-form-item>
                <el-form-item prop="column" label="色谱柱">
                    <el-input placeholder="色谱柱" v-model="form.column"></el-input>
                </el-form-item>
                <el-form-item prop="controls" label="质控品">
                    <el-input placeholder="质控品" v-model="form.controls"></el-input>
                </el-form-item>
                <el-form-item prop="testmethod" label="检测方法">
                    <el-input placeholder="检测方法" v-model="form.testmethod"></el-input>
                </el-form-item>
                <el-form-item prop="preprocessing" label="样品预处理">
                    <el-input placeholder="样品预处理" v-model="form.preprocessing"></el-input>
                </el-form-item>
                <el-form-item prop="range" label="治疗浓度范围">
                    <el-input placeholder="治疗浓度范围" v-model="form.range"></el-input>
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
        name: 'medicine',
        data() {
            return {
                propTitle:'新增药品',
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
                    category: [],
                    column: '',
                    controls:'',
                    testmethod:'',
                    range:'',
                    preprocessing:''
                },
                category:[],
                subcategory:[],
                search_cate:[],
                defaultProps: {
                    children: 'data',
                    label: 'name',
                    value:'id'
                },
                idx: -1,
                rules: {
                    name: [
                        { required: true, message: '请输入药品名称', trigger: 'blur' }
                    ],
                    category: [
                        { required: true, message: '请选择所属分类', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.getData();
            this.getCategory()
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
            addprop(){
                this.editVisible = true
                this.propTitle = '新增药品'
                this.clearForm()
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val - 1;
                this.getData();
            },
            getData() {
                this.loading = true
                this.$axios.post('/drug/list', {
                    page: this.cur_page,
                    key: this.select_word,
                    limit: this.limit,
                    offset: this.limit * this.cur_page,
                    classid:this.search_cate == '' ? 0 : this.search_cate[this.search_cate.length-1]
                }).then((res) => {
                    this.loading=false
                    if(res.status.haserror){
                        this.$message.error(res.status.errorshowdesc)
                    }else{
                        this.tableData = res.data;
                        this.totalcount = res.count
                    }
                })
            },
            getCategory(){
                this.$axios.post('/druclass/list', {}).then((res)=>{
                    if(res.status.haserror){
                        this.$message.error(res.status.errorshowdesc)
                    }else{
                        this.category = res.data;
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
            handleEdit(index, row) {
                this.propTitle = '编辑药品'
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id:item.id,
                    name: item.name,
                    category:this.getparentID(item.classid),
                    reagent:item.reagent,
                    column:item.chromatographiccolumn,
                    controls:item.controls,
                    testmethod:item.testmethod,
                    preprocessing:item.preprocessing,
                    range:item.range
                }
                // console.log(this.form,item)
                this.editVisible = true;
            },
            handleDelete(index, row) {
                const item = this.tableData[index];
                this.idx = item.id;
                this.$confirm('确认删除该药品信息？').then((res)=>{
                    this.delItem()
                }).catch(_ => {});
            },
            getparentID(target){
                let re = []
                this.category.forEach(e => {
                    if(e.data){
                        e.data.forEach(data => {
                            if(data.id == target){
                                re= [e.id, target]
                            }
                        });
                    }
                });
                return re
            },
            delItem(){
                this.$loading()
                this.$axios.post('drug/del', {id:this.idx}).then((res) => {
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
            //新增药品
            addUser(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$loading()
                        let url = '/drug/add'
                        let data = {
                            name: this.form.name,
                            classid: this.form.category?this.form.category[this.form.category.length-1]:'',
                            reagent:this.form.reagent,
                            chromatographiccolumn:this.form.column,
                            controls:this.form.controls,
                            testmethod:this.form.testmethod,
                            range:this.form.range,
                            preprocessing:this.form.preprocessing
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
                                this.clearForm()
                                this.getData()
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            clearForm(){
                Object.keys(this.form).map((key)=>{
                    this.form[key] = ''
                })
                this.form.category=[]
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
