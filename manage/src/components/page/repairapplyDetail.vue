<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 故障详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <label>状态：{{data.status | applystatus2}}</label><br/>
                <div  v-if="data.status == 'applying'">
                    <label>操作：</label>
                    <el-button type="primary" class="mb20" @click="dealapply(id,true)">确认</el-button>
                    <el-button type="danger" @click="dealapply(id,false)">拒绝</el-button>
                </div>
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="设备名">
                        <label>{{data.goodname}}</label>
                    </el-form-item>
                    <el-form-item label="设备型号">
                        <label>{{data.goodmodel}}</label>
                    </el-form-item>
                    <el-form-item label="申请人姓名">
                        <label>{{data.name}}</label>
                    </el-form-item>
                    <el-form-item label="申请人电话">
                        <label>{{data.phone}}</label>
                    </el-form-item>
                    <el-form-item label="申请人医院">
                        <label>{{data.hospital}}</label>
                    </el-form-item>
                    <el-form-item label="申请人科室">
                        <label>{{data.office}}</label>
                    </el-form-item>
                    <el-form-item label="故障类型">
                        <label>{{data.faulttype}}</label>
                    </el-form-item>
                    <el-form-item label="图片">
                        <template slot-scope="scope">
                        <label v-if="!data.fileid1&& !data.fileid2">无图片信息</label>
                            <el-button type="text" class="mr10" v-if="data.fileid1" @click="showImg(data.fileid1)"> 查看图片</el-button>
                            <el-button type="text" v-if="data.fileid2" @click="showImg(data.fileid2)"> 查看图片</el-button>
                        </template>
                    </el-form-item>
                    <el-form-item label="故障描述">
                        <el-input type="textarea" readonly="" rows="5" v-model="data.faultdesc"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="panel ">
                <div class="timeline">
                    <div class="timeItem" v-for="item in datalist">
                        <span class="dot"></span>
                        <div class="r_text">
                            <span>{{item.text}}</span>
                            <span>{{item.createtime}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         <!-- 查看图片 -->
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-dialog title="维修人员和时间" :visible.sync="timepicker" width="30%">
            <el-select v-model="staffid" placeholder="请选择维修人员" class="mr10">
                <el-option
                v-for="item in staffList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                >
                </el-option>
            </el-select> 
            <el-date-picker
                            v-model="timetime"
                            type="date"
                            value-format='timestamp'
                            placeholder="选择日期"
                            :picker-options="pickerOptions1">
             </el-date-picker>
            <span slot="footer" class="dialog-footer">
                <el-button @click="timepicker = false">取 消</el-button>
                <el-button type="primary" @click="agreeapply">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="拒绝理由及建议" :visible.sync="refuse" width="30%">
            <el-input type="textarea" rows="5" v-model="reason"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="refuse = false">取 消</el-button>
                <el-button type="primary" @click="refuseapply">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'repairapplyDetail',
        data: function() {
            return {
                dialogImageUrl:"",
                id:0,
                data:{},
                datalist:[],
                form:{},
                titleLabel:'添加设备',
                loading:false,
                timepicker: false,
                refuse: false,
                timetime:'',
                staffid:"",
                dialogVisible:false,
                staffList:[],
                reason:'',
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
            if(this.$route.query && this.$route.query.id){
                this.id=parseInt(this.$route.query.id) 
                this.getInfo()
            }
            
        },
        computed: {
    
        },
        methods: {
            dealapply(id,agree) {
                this.idx = id
                if(agree){
                    this.$axios.post('/staff/list', {
                        limit: 99999,
                        offset: 0,
                        key: ""
                    }).then((res) => {
                        this.$loading().close()
                        if (res.status.haserror) {
                            this.$message.error(res.status.errorshowdesc)
                        } else {
                            this.staffList=[]
                            for(var i=0;i<res.data.length;i++){
                                this.staffList.push({
                                    id:res.data[i].id,
                                    name:"工号:"+res.data[i].staffno+" 姓名:"+res.data[i].name,
                                })
                            }
                            
                            this.timepicker = true 
                        }
                    })
                }else{
                    this.refuse = true
                }   
            },
            agreeapply(){
                if(this.timetime==''){
                    this.$message.error('请选择续保日期')
                    return
                }

                if(this.staffid==""){
                     this.$message.error('请选择维修人员')
                    return
                }

                this.deal(this.id, this.timetime,"",true)
                this.timepicker = false  
            },

            refuseapply(){
                if(this.reason==''){
                    this.$message.error('请输入拒绝理由及建议')
                    return
                }

                
                this.deal(this.id, 0,this.reason,false)
                this.refuse = false  
            },

            //查看大图
            showImg(src){
                this.$loading()
                this.downloadImg(src).then(res=>{
                    this.$loading().close()
                    this.dialogVisible = true
                    this.dialogImageUrl = this.getImgSrc(res)
                })
            },
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
            
            handleSelectionChange(val) {
                // this.multipleSelection = val;
                this.multipleSelection=[]
                Object.keys(val).map((e,index)=>{
                    this.multipleSelection.push({id:val[e].id,name:val[e].name})
                })
                // console.log(this.multipleSelection)
            },
            
            getInfo(){
                this.$loading()
                this.$axios.post('/repairapply/get',{id:this.id}).then((res) => {
                    this.$loading().close()
                    if (res.status.haserror) {
                        this.$message.error(res.status.errorshowdesc)
                    } else {
                        this.data=res.data;
                        for (var i=0;i<res.data.data.length;i++){
                            var text=""
                            if(res.data.data[i].currentstatus=="applying"){
                                text="微信用户："+res.data.data[i].wxusername+"提出申请于"+
                                this.transTime(res.data.data[i].remotetime,"yyyy-MM-dd")+"报修"
                            }else if(res.data.data[i].currentstatus=="comfirm"){
                                text="后台用户:"+res.data.data[i].username+"确认，指派"+
                                res.data.data[i].staffname+"维修"
                            }else if(res.data.data[i].currentstatus=="finish"){
                                text="微信用户:"+res.data.data[i].wxusername+"确认完成"
                            }else if(res.data.data[i].currentstatus=="refuse"){
                                text="后台用户:"+res.data.data[i].username+"拒绝,拒绝理由:"+res.data.data[i].reason

                            }

                            this.datalist.unshift({
                                text:text,
                                createtime:this.transTime(res.data.data[i].createtime)
                            })
                        }
                    }
                })
                // this.getDrug()
            }
        }
        
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
.panel {
    border-top: 1px solid #b4b4b4;
    padding: 40px 30px;
    display: flex;
    align-items: center;
    color: #333;
    font-size: 32px;
    background-color: #fff;
    margin-bottom: 20px;
    line-height: 50px; 
}
.panel .image{
    width: 136px;
    height: 86px;
    border-radius: 10px;
    border:1px #ececec solid;
}
.timeline{
    margin-left: 30px;
    border-left: 1px #ddd solid;
}
.timeline .timeItem{
        display: flex;
        margin-bottom:35px;
        line-height:24px;
} 
.timeline .timeItem:last-child{
    margin-bottom:0px;
}
.timeline .timeItem:first-child .dot{
    background-color:#66b1ff;
    margin-left: -8px;
    width:16px;
    height:16px;
}

.timeline .timeItem .dot{
    width:10px;
    height:10px;
    background-color: #a5a5a5;
    border-radius: 50%;
    margin-right: 20px;
    margin-left: -5px;
}
.timeline .r_text{
                margin-top: -3px;
                display: flex;
                flex-direction: column;
                
            }
.timeline .r_text span{
                    display: inline-block;
                    font-size: 16px;
                }
.timeline .r_text span:last-child{
                        font-size:14px;
                        color:#a5a5a5;
                    }

</style>
