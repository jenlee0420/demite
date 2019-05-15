<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户续保申请</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="筛选设备名" class="handle-input mr10"></el-input>
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
                <el-table-column prop="goodname" label="设备名">
                </el-table-column>
                <el-table-column prop="nickname" label="微信昵称">
                </el-table-column>
                <el-table-column prop="username" label="操作人">
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">
                            {{transTime(scope.row.createtime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="applystatus" label="申请状态" >
                <template slot-scope="scope">
                    {{scope.row.applystatus | applystatus2}}
                </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope" v-if="scope.row.applystatus == 'applying'">
                <el-button type="text" @click="dealapply(scope.row.id,true)"> 同意</el-button>
                <el-button type="text" class="red" @click="dealapply(scope.row.id,false)">拒绝</el-button>
                <!-- <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="limit" :total="totalcount">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="选择续保时间" :visible.sync="timepicker" width="30%">
            <el-date-picker
                            v-model="guaranteetime"
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
                }],
                applystatus:"",
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
                rules: {
                    staffno: [{
                        required: true,
                        message: '请输入工号',
                        trigger: 'blur'
                    }],
                    name: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }],
                    staffphone: [{
                            required: true,
                            message: '请输入手机',
                            trigger: 'blur'
                        },
                        {
                            validator: validatePhone,
                            trigger: 'blur'
                        },
                    ],
                },
                guaranteetime: '',
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
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val - 1;
                this.getData();
            },
            getData() {
                this.loading = true
                this.$axios.post('/delayguaranteeapply/list', {
                    page: this.cur_page,
                    goodname: this.select_word,
                    nickname: "",
                    applystatus: this.applystatus,
                    limit: this.limit,
                    offset: this.limit * this.cur_page,
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
            dealapply(id, status) {
                this.idx = id
                if (status == true) {
                    this.timepicker = true
                    return
                }
                this.$confirm('确定执行该操作？').then((res) => {
                    this.deal(id, status, 0)
                })
            },
            agreeapply(){
                if(this.guaranteetime==''){
                    this.$message.error('请选择续保日期')
                    return
                }
                this.deal(this.idx, true, this.guaranteetime)
                this.timepicker = false
            },
            deal(id, status, time) {
                this.$loading()
                this.$axios.post('/delayguaranteeapply/dealapply', {
                    id: id,
                    agree: status,
                    delaytime: time
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
