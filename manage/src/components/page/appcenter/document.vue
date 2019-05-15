<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form ref="form" label-width="80px">
                <el-form-item label="标题：">
                    <el-input v-model="title"></el-input>
                </el-form-item>
            </el-form>
            <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {
        quillEditor
    } from 'vue-quill-editor';
    export default {
        name: 'editor',
        data: function() {
            return {
                title: '',
                content: '',
                editorOption: {
                    modules: {
                        toolbar: [
                            [{
                                'size': ['small', false, 'large']
                            }],
                            [{ 'font': [] }],
                            ['bold', 'italic','underline', 'strike'],
                            [{
                                'list': 'ordered'
                            }, {
                                'list': 'bullet'
                            }],
                            [{ 'script': 'sub' }, { 'script': 'super' }],
                            ['link', 'image']
                        ],
                    },
                    placeholder: '请在此输入内容'
                }
            }
        },
        components: {
            quillEditor
        },
        methods: {
            onEditorChange({
                editor,
                html,
                text
            }) {
                this.content = html;
            },
            submit() {
                console.log(this.content);
                this.$message.success('提交成功！');
            }
        }
    }
</script>
<style scoped>
    .editor-btn {
        margin-top: 20px;
    }
    .ql-editor {
        min-height: 300px;
    }
</style>