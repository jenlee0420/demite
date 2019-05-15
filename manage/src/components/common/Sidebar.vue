<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" @open="handleOpen" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                handleOpen:true,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '药品管理',
                        subs: [
                            {
                                index: 'drugCategory',
                                title: '药品分类列表'
                            },
                            {
                                 index: 'medicine',
                                title: '药品列表'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '3',
                        title: '设备管理',
                        subs: [
                            {
                                index: 'equipment',
                                title: '设备列表'
                            },
                            {
                                index:'equipmentAdd',
                                title:'新增设备'
                            }
                        ]
                    },
                    // {
                    //     icon: 'el-icon-lx-copy',
                    //     index: 'appcenter',
                    //     title: '应用中心',
                    //     subs: [
                    //         {
                    //             index: 'appcenter',
                    //             title: '视频中心'
                    //         },
                    //         {
                    //             index:'equipmentAdd',
                    //             title:'资料中心'
                    //         },
                    //         {
                    //             index:'documentlist?type=case',
                    //             title:'解决方案'
                    //         },
                    //         {
                    //             index:'document',
                    //             title:'资质认证'
                    //         },
                    //         {
                    //             index:'document',
                    //             title:'科学项目'
                    //         },
                    //         {
                    //             index:'equipmentAdd',
                    //             title:'软件下载'
                    //         },
                    //         {
                    //             index:'equipmentAdd',
                    //             title:'应用问答'
                    //         }
                    //     ]
                    // },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'repairapply',
                        title: '报修列表'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'remoteapply',
                        title: '远程支持列表'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'applylist',
                        title: '用户申请列表'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'delayguaranteeapply',
                        title: '用户续保申请'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'wxuserlist',
                        title: '微信用户列表'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'userlist',
                        title: '管理员列表'
                    },
                   /*   {
                        icon: 'el-icon-lx-sort',
                        index: 'catelist',
                        title: '商品分类管理'
                    },*/
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'stafflist',
                        title: '维修组员管理'
                    }, 
                    /* {
                        icon: 'el-icon-lx-calendar',
                        index: '3',
                        title: '表单相关',
                        subs: [
                            {
                                index: 'form',
                                title: '基本表单'
                            },
                            {
                                index: '3-2',
                                title: '三级菜单',
                                subs: [
                                    {
                                        index: 'editor',
                                        title: '富文本编辑器'
                                    },
                                    {
                                        index: 'markdown',
                                        title: 'markdown编辑器'
                                    },
                                ]
                            },
                            {
                                index: 'upload',
                                title: '文件上传'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-emoji',
                        index: 'icon',
                        title: '自定义图标'
                    },
                    {
                        icon: 'el-icon-lx-favor',
                        index: 'charts',
                        title: 'schart图表'
                    },
                    {
                        icon: 'el-icon-rank',
                        index: '6',
                        title: '拖拽组件',
                        subs: [
                            {
                                index: 'drag',
                                title: '拖拽列表',
                            },
                            {
                                index: 'dialog',
                                title: '拖拽弹框',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-warn',
                        index: '7',
                        title: '错误处理',
                        subs: [
                            {
                                index: 'permission',
                                title: '权限测试'
                            },
                            {
                                index: '404',
                                title: '404页面'
                            }
                        ]
                    } */
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            // bus.$on('collapse', msg => {
            //     this.collapse = msg;
            // })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 160px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
