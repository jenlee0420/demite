<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 远程支持列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="筛选提出人" class="handle-input mr10"></el-input>
                <label  class="mr10">状态筛选</label>
                <el-select v-model="applystatus" placeholder="请选择" class="mr10">
                        <el-option
                        v-for="item in statuslist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        >
                        </el-option>
                    </el-select> 
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable">
                <el-table-column prop="name" label="申请人姓名">
                </el-table-column>
                <el-table-column prop="phone" label="申请人电话">
                </el-table-column>
                <el-table-column prop="hospital" label="申请人医院">
                </el-table-column>
                <el-table-column prop="office" label="申请人科室">
                </el-table-column>
                <el-table-column prop="faultdesc" label="故障描述">
                </el-table-column>
                 <el-table-column prop="faultdescself" label="故障自主描述">
                </el-table-column>
                <el-table-column label="图片">
                    <template slot-scope="scope">
                        <label v-if="!scope.row.fileid1 && !scope.row.fileid2">无图片信息</label>
                        <el-button type="text" class="mr10" v-if="scope.row.fileid1" @click="showImg(scope.row.fileid1)"> 查看图片</el-button>
                        <el-button type="text" v-if="scope.row.fileid2" @click="showImg(scope.row.fileid2)"> 查看图片</el-button>
                        
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{scope.row.applystatus | applystatus2}}
                    </template>
                </el-table-column>
                <!-- <el-table-column label="创建时间">
                    <template slot-scope="scope">
                            {{transTime(scope.row.createtime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="applystatus" label="申请状态" >
                <template slot-scope="scope">
                    {{scope.row.applystatus | applystatus2}}
                </template>
                </el-table-column> -->
                <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope" >
                <div v-if="scope.row.applystatus == 'applying'">
                    <el-button type="text" @click="dealapply(scope.row.id,true)"> 确认</el-button>
                    <el-button type="text" @click="dealapply(scope.row.id,false)"> 拒绝</el-button>
                </div>
                
                <!-- <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                <el-button type="text" @click="$router.push({path:'/remoteapplyDetail?id='+scope.row.id})">查看详情</el-button>
            </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="limit" :total="totalcount">
                </el-pagination>
            </div>
        </div>
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
        <!-- 查看图片 -->
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
    export function validatePhone(rule, value, callback) {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (value == '' || value == undefined || value == null) {
            callback();
        } else {
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
                dialogVisible:false,
                dialogImageUrl:'',
                tableData: [],
                cur_page: 0,
                limit: 10,
                del_list: [],
                is_search: false,
                timepicker: false,
                delVisible: false,
                select_word: '',
                totalcount: 1,
                loading: false,
                form: {
                    name: '',
                    staffdesc: '',
                    staffphone: '',
                    staffno: '',
                },
                idx: -1,
                timetime:'',
                staffid:"",
                refuse:false,
                reason:"",
                staffList:[],
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
                    id:'finish',
                    name:'已完成'
                },
                {
                    id:'refuse',
                    name:'已拒绝'
                }]  
                ,
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    },
                }
            }
        },
        created() {
            this.getData();
        },
        computed: {},
        methods: {
            //查看大图
            showImg(src){
                this.$loading()
                this.downloadImg(src).then(res=>{
                    this.$loading().close()
                    this.dialogVisible = true
                    this.dialogImageUrl = this.getImgSrc(res)
                })

            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val - 1;
                this.getData();
            },
            getData() {
                this.loading = true
                this.$axios.post('/remoteapply/list', {
                    page: this.cur_page,
                    name: this.select_word,
                    limit: this.limit,
                    offset: this.limit * this.cur_page,
                    applystatus: this.applystatus
                }).then((res) => {
                    this.loading = false
                    if (res.status.haserror) {
                        this.$message.error(res.status.errorshowdesc)
                    } else {
                        this.tableData = res.data;
                        this.totalcount = res.count
                    }
                })
            },
            search() {
                this.is_search = true;
                this.cur_page = 0
                this.getData()
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
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
                    this.$message.error('请选择维修日期')
                    return
                }

                if(this.staffid==""){
                     this.$message.error('请选择维修人员')
                    return
                }

                this.deal(this.idx, this.timetime,"",true)
                this.timepicker = false
                
            },
            refuseapply(){
                if(this.reason==''){
                    this.$message.error('请输入拒绝理由及建议')
                    return
                }

                
                this.deal(this.idx, 0,this.reason,false)
                this.refuse = false  
            },
           
            deal(id, time,reason,agree) {
                this.$loading()
                this.$axios.post('/remoteapply/deal', {
                    id: id,
                    staffid:parseInt(this.staffid) ,
                    repairtime: parseInt(time),
                    agree:agree,
                    reason:reason,
                }).then((res) => {
                    this.$loading().close()
                    if (res.status.haserror) {
                        this.$message.error(res.status.errorshowdesc)
                    } else {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        })
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
    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
</style>
