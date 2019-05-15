import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes=[
    {
        path: '/',
        redirect: '/drugCategory'
    },
    {
        path: '/',
        component: resolve => require(['../components/common/Home.vue'], resolve),
        meta: { title: '自述文件' },
        children:[
            {
                path: '/dashboard',
                component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                meta: { title: '系统首页' }
            },
            {
                path: '/icon',
                component: resolve => require(['../components/page/Icon.vue'], resolve),
                meta: { title: '自定义图标' }
            },
            {
                path: '/medicine',
                    component: resolve => require(['../components/page/medicine.vue'], resolve),
                    meta: { title: '药品列表' }
            },
            {
                path: '/drugCategory',
                    component: resolve => require(['../components/page/drugCategory.vue'], resolve),
                    meta: { title: '药品分类列表' }
            },
            {
                path: '/equipment',
                    component: resolve => require(['../components/page/equipment.vue'], resolve),
                    meta: { title: '设备列表' }
            },
             {
                path: '/equipmentAdd',
                component: resolve => require(['../components/page/equipmentAdd.vue'], resolve),
                meta: { title: '新增设备' }
            },
            {
                path: '/adminlist',
                component: resolve => require(['../components/page/adminlist.vue'], resolve),
                meta: { title: '管理员列表' }
            },
            {
                path: '/stafflist',
                component: resolve => require(['../components/page/stafflist.vue'], resolve),
                meta: { title: '申请列表' }
            },
            {
                path: '/applylist',
                component: resolve => require(['../components/page/applylist.vue'], resolve),
                meta: { title: '员工列表' }
            },
            {
                path: '/repairapply',
                component: resolve => require(['../components/page/repairapply.vue'], resolve),
                meta: { title: '报修列表' }
            },
            {
                path: '/repairapplyDetail',
                component: resolve => require(['../components/page/repairapplyDetail.vue'], resolve),
                meta: { title: '报修详情' }
            },
            {
                path: '/remoteapply',
                component: resolve => require(['../components/page/remoteapply.vue'], resolve),
                meta: { title: '远程申请列表' }
            },
            {
                path: '/remoteapplyDetail',
                component: resolve => require(['../components/page/remoteapplyDetail.vue'], resolve),
                meta: { title: '远程申请详情' }
            },
            {
                path: '/wxuserlist',
                component: resolve => require(['../components/page/wxuserlist.vue'], resolve),
                meta: { title: '微信用户列表' }
            },
            {
                path: '/wxuserinfo',
                component: resolve => require(['../components/page/wxUserInfo.vue'], resolve),
                meta: { title: '微信用户列表' }
            },
            {
                path: '/userlist',
                component: resolve => require(['../components/page/userlist.vue'], resolve),
                meta: { title: '用户列表' }
            },
            {
                path: '/catelist',
                component: resolve => require(['../components/page/catelist.vue'], resolve),
                meta: { title: '商品分类管理' }
            },
            {
                path: '/delayguaranteeapply',
                component: resolve => require(['../components/page/delayguaranteeapply.vue'], resolve),
                meta: { title: '商品分类管理' }
            },
            {
                path: '/document',
                component: resolve => require(['../components/page/appcenter/document.vue'], resolve),
                meta: { title: '图文管理' }
            },
            {
                path: '/documentlist',
                component: resolve => require(['../components/page/appcenter/documentlist.vue'], resolve),
                meta: { title: '文档管理' }
            },
            {
                path: '/tabs',
                component: resolve => require(['../components/page/Tabs.vue'], resolve),
                meta: { title: 'tab选项卡' }
            },
            {
                path: '/BaseTable',
                component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                meta: { title: 'tab选项卡' }
            },
            {
                path: '/form',
                component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                meta: { title: '基本表单' }
            },
            {
                // 富文本编辑器组件
                path: '/editor',
                component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                meta: { title: '富文本编辑器' }
            },
            {
                // markdown组件
                path: '/markdown',
                component: resolve => require(['../components/page/Markdown.vue'], resolve),
                meta: { title: 'markdown编辑器' }    
            },
            {
                // 图片上传组件
                path: '/upload',
                component: resolve => require(['../components/page/Upload.vue'], resolve),
                meta: { title: '文件上传' }   
            },
            {
                // vue-schart组件
                path: '/charts',
                component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                meta: { title: 'schart图表' }
            },
            {
                // 拖拽列表组件
                path: '/drag',
                component: resolve => require(['../components/page/DragList.vue'], resolve),
                meta: { title: '拖拽列表' }
            },
            {
                // 拖拽Dialog组件
                path: '/dialog',
                component: resolve => require(['../components/page/DragDialog.vue'], resolve),
                meta: { title: '拖拽弹框' }
            },
            {
                // 权限页面
                path: '/permission',
                component: resolve => require(['../components/page/Permission.vue'], resolve),
                meta: { title: '权限测试', permission: true }
            },
            {
                path: '/404',
                component: resolve => require(['../components/page/404.vue'], resolve),
                meta: { title: '404' }
            },
            {
                path: '/403',
                component: resolve => require(['../components/page/403.vue'], resolve),
                meta: { title: '403' }
            }
        ]
    },
    {
        path: '/login',
        component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/404'
    }
]
var router = new Router({
    routes
})

router.beforeEach((to, from, next) => {
    // console.log(to)
    if(to.meta && to.meta.title){
        document.title = to.meta.title
    }
    if(!localStorage.getItem('ms_username') && to.path!='/login'){
        next({
            path:'/login',
            quety:{redirect: to.fullPath}
        })
    }
    else{
        next()
    }
})

export default router

