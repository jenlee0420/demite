<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 微信用户详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="头像">
                        <img :src="form.avatarUrl" width="80"/>
                    </el-form-item>
                    <el-form-item label="性别">
                        <label>{{form.gender}}</label>
                    </el-form-item>
                    <el-form-item label="昵称">
                        <label>{{form.nickname}}</label>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="form.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="职位">
                        <el-input v-model="form.position"></el-input>
                    </el-form-item>
                    <el-form-item label="所属医院">
                        <el-input v-model="form.hospital"></el-input>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <!-- <el-button>取消</el-button> -->
                    </el-form-item>
                </el-form>
            </div>
        </div>
        
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
                titleLabel:'微信用户详情',
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
            if(this.$route.query && this.$route.query.id){
                this.id=parseInt(this.$route.query.id) 
                this.getInfo()
            }
        
            
            
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
                data.id=this.id
                // console.log(data)
                // return
                this.$axios.post("/wxuser/update",data).then((res) => {
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
                this.$axios.post('/wxuser/getwxuser',{id:this.id}).then((res) => {
                    this.$loading().close()
                    if (res.status.haserror) {
                        this.$message.error(res.status.errorshowdesc)
                    } else {
                        this.form = res.data 
                    }
                })
                // this.getDrug()
            },
        
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
