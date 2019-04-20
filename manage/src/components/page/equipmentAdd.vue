<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 设备</el-breadcrumb-item>
                <el-breadcrumb-item>{{titleLabel}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-button type="primary" class="mb20" v-if="edit" @click="$router.push({path:'/equipmentAdd'})">新增设备</el-button>
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="设备编号">
                        <el-input v-model="form.goodsuuid" :disabled="edit?true:false"></el-input>
                    </el-form-item>
                    <el-form-item label="设备名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="设备型号">
                        <el-input v-model="form.goodsmodel"></el-input>
                    </el-form-item>
                    <el-form-item label="医院">
                        <el-input v-model="form.hospital"></el-input>
                    </el-form-item>
                    <el-form-item label="省">
                        <el-select v-model="form.province" placeholder="请选择省" class="mr10">
                        <el-option
                        v-for="item in provincelist"
                        :key="item.placeid"
                        :label="item.placename"
                        :value="item.placename"
                        >
                        </el-option>
                    </el-select> 
                    </el-form-item>
                    
                    <el-form-item label="保修日期">
                        <el-date-picker
                            v-model="form.guaranteetime"
                            type="date"
                            value-format='timestamp'
                            placeholder="选择日期"
                            :picker-options="pickerOptions1"
                            :disabled="edit?true:false">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="绑定相关药品">
                        <div>
                            <el-tag size="medium" type="success" class="mr10" v-for="(item,index) in checkboxStr" :key="index">
                                {{item}}
                            </el-tag>
                        </div>
                        <el-button @click="getdrugData()" type="primary" plain size="mini">去绑定 / 编辑</el-button>
                    </el-form-item>
                    <el-form-item label="设备图片">
                        <!-- <input type="file" @change="showfile"/> -->
                        <el-upload :file-list="fileList" :limit="1" action="/manage/file/upload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :multiple="false" :on-success="uploadSuccess">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="属性">
                        <div class="flex" v-for="(item,index) in attribute" :key="index">
                            <label class="mr10">key:</label><el-input v-model="item.key" placeholder="属性名" class="mr10"></el-input> <label class="mr10">value:</label><el-input class="mr10" v-model="item.value" placeholder="属性内容"></el-input>
                            <el-button  @click="minusAttrItem('attribute',index)" icon="el-icon-minus" circle></el-button>
                        </div>
                        <div>
                            <el-button @click="addAttrItem" icon="el-icon-plus" circle  type="primary"></el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="隐藏属性">
                        <div class="flex" v-for="(item,index) in attributehide" :key="index">
                            <label class="mr10">key:</label><el-input v-model="item.key" placeholder="属性名" class="mr10"></el-input> <label class="mr10">value:</label><el-input class="mr10" v-model="item.value" placeholder="属性内容"></el-input>
                            <el-button  @click="minusAttrItem('attributehide',index)" icon="el-icon-minus" circle></el-button>
                        </div>
                        <div>
                            <el-button @click="addAttrHide" icon="el-icon-plus" circle  type="primary"></el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" rows="5" v-model="form.goodsdecs"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <!-- <el-button>取消</el-button> -->
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!--选择药品弹出框 -->
        <el-dialog title="药品列表" :visible.sync="druglistshow" width="40%">
            <el-table v-loading="loading" border class="table" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="name" label="药品名称">
                </el-table-column>
                <el-table-column prop="reagent" label="试剂 ">
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :page-size="limit" layout="prev, pager, next" :total="totalcount">
                </el-pagination>
            </div>
            <div slot="footer" class="dialog-footer center">
                <el-button @click="druglistshow = false">取 消</el-button>
                <el-button type="primary" @click="submitMult">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'baseform',
        data: function() {
            return {
                provincelist:[],
                form: {
                    name: '',
                    goodsdecs: '',
                    goodspic: '',
                    druglist: '',
                    goodsteplet: '',
                    goodstempletlockcontext:'',
                    goodsmodel:'',
                    guaranteetime:'',
                    province:"",
                    hospital:"",
                },
                titleLabel:'添加设备',
                loading:false,
                dialogImageUrl: '',
                dialogVisible: false,
                druglistshow: false,
                tableData: [],
                cur_page: 0,
                totalcount:0,
                limit: 15,
                select_word: '',
                search_cate: '',
                multipleSelection:[],
                checkboxlist:[],
                checkboxStr:[],
                rows:[],
                attribute:[{key:'',value:''},{key:'',value:''}],
                attributehide:[{key:'',value:''},{key:'',value:''}],
                edit:false,
                fileList:[],
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    },
                }
            }
        },
        watch:{
            $route(e){
                this.reloadView()
            }
        },
        created() {
          
        },
        mounted(){
            // console.log(this)

            this.$axios.post('/place/list',{upplaceid:0}).then((res) => {
                if (res.status.haserror) {
                    this.$message.error(res.status.errorshowdesc)
                } else {              
                    this.provincelist=res.data
                    this.edit = false
                    if(this.$route.query && this.$route.query.id){
                        this.edit = this.$route.query.id
                        this.titleLabel = '修改设备信息'
                        this.getInfo()
                    }
                }
            })
            
            
        },
        computed: {
    
        },
        methods: {
            reloadView(){
                this.$parent.activeDate = new Date().getTime()
            },
            addAttrItem(){
                this.attribute.push({key:'',value:''})
            },
            addAttrHide(){
                this.attributehide.push({key:'',value:''})
            },
            minusAttrItem(target,index){
                this[target].splice(index,1)
            },
            checkboxFill(){
                this.checkboxlist.forEach((e) => {
                    this.tableData.forEach((v,index) => {
                        if(v.id == e){
                            this.$refs.multipleTable.toggleRowSelection(this.tableData[index],true);   

                        }
                    });
                });
            },
            getdrugData() {
                this.druglistshow = true
                this.loading = true
                this.$axios.post('/drug/list', {
                    page: this.cur_page,
                    key: this.select_word,
                    limit: this.limit,
                    offset: this.limit * this.cur_page,
                    classid: this.search_cate == '' ? 0 : this.search_cate
                }).then((res) => {
                    this.loading = false
                    if (res.status.haserror) {
                        this.$message.error(res.status.errorshowdesc)
                    } else {
                        this.tableData = res.data;
                        this.totalcount = res.count
                        
                        setTimeout(()=>{
                            this.checkboxFill()
                        },200)
                    }
                })
            },
            submitMult(){
                this.druglistshow = false
                this.checkboxlist = []
                this.checkboxStr = []
                this.multipleSelection.forEach(e => {
                    this.checkboxlist.push(e.id)
                    this.checkboxStr.push(e.name)
                });
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val -1;
                this.getdrugData();
            },
            handleRemove(file, fileList) {
                // console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            uploadSuccess(file){
                this.form.goodspic = file.id
            },
            handleSelectionChange(val) {
                // this.multipleSelection = val;
                this.multipleSelection=[]
                Object.keys(val).map((e,index)=>{
                    this.multipleSelection.push({id:val[e].id,name:val[e].name})
                })
                // console.log(this.multipleSelection)
            },
            onSubmit() {
                this.$loading()
                //组装数据
                let data = this.form
                data.goodsteplet = JSON.stringify(this.attribute)
                data.goodstempletlockcontext = JSON.stringify(this.attributehide)
                data.druglist = this.checkboxlist
                data.guaranteetime = this.form.guaranteetime / 1000
                let url = '/goods/add'
                if(this.edit){
                    data.uuid = this.edit
                    url = '/goods/update'
                }
                // console.log(data)
                // return
                this.$axios.post(url,data).then((res) => {
                    this.$loading().close()
                    if (res.status.haserror) {
                        this.$message.error(res.status.errorshowdesc)
                    } else {
                        this.$message.success('提交成功！');
                        if(this.edit){
                            this.getInfo()
                        }else{
                            //刷新页面
                            this.reloadView()
                        }
                    }
                })
            },
            getInfo(){
                this.$loading()
                this.$axios.post('/goods/getgood',{goodsuuid:this.edit}).then((res) => {
                    this.$loading().close()
                    if (res.status.haserror) {
                        this.$message.error(res.status.errorshowdesc)
                    } else {
                        this.form = res.gooddata
                        this.form.guaranteetime = this.form.guaranteetime*1000
                        if(this.form.goodpicdata){
                            this.fileList = [{name:'',url: this.getImgSrc(this.form.goodpicdata)}]
                        }
                        this.attribute = JSON.parse(this.form.goodsteplet)
                        this.attributehide = JSON.parse(this.form.goodstempletlockcontext)
                        this.checkboxlist = [];
                        this.checkboxStr =[]
                        this.form.data.forEach((e)=>{
                            this.checkboxlist.push(e.id)
                            this.checkboxStr.push(e.name)
                        })
                        
                    }
                })
                // this.getDrug()
            },
            //取药物列表
            getDrug(){
                this.$axios.post('/goods/goodgetdrug',{goodsuuid:this.edit}).then((res) => {
                    this.$loading().close()
                    if (res.status.haserror) {
                        this.$message.error(res.status.errorshowdesc)
                    } else {
                        console.log(res)
                        // this.checkboxlist = res
                    }
                })
            }
            // uploadImg(data){
            //     let fd = new FormData();
            //     fd.append('Content-Length', Math.round(data.size * 100 / 1024) / 100);
            //     fd.append('key', 'file');
            //     fd.append('success_action_status','200');
            //     fd.append('file',data);//文件必须声明在最后，否则异常
            //     return new Promise((resolve,reject)=>{
            //         this.$axios.post('/file/upload',fd,{
            //             // headers: {
            //             //     'Content-Type': 'application/x-www-form-urlencoded'
            //             // },
            //             transformRequest:function(data){
            //                 return data;
            //             }
            //         }).then(res=>{
            //             resolve(res);
            //         }).catch(err=>{
            //             reject(err);
            //         });
            //     });
            // },
        },
        
    }
</script>

<style scoped>
.flex{
    display:flex;
    margin-bottom: 10px;
}
.mr10{
        margin-right: 10px;
    }
.mb20{
    margin-bottom: 20px;
}
.center{
    text-align: center
}
</style>
