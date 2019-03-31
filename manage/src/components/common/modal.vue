<template>
    <section class="main">
<el-dialog v-dialogDrag title="拖拽弹框" center :visible.sync="state" :width="width">
    <div slot="main">我是一个可以拖拽的对话框！</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="visible = false">确 定</el-button>
            </span>
</el-dialog>
        </section>

</template>


<script>
    export default {
        props:{
            width:{
                default:'30%'
            },
            state:{
                default:false,
            }
        },
        data(){
        return {
            visible: false
        }
    }
    }
</script>

<style>

</style>