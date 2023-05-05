<template>
  <div class="app-container">
    <el-form
      :model="teacher"
      label-width="120px"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-form-item
        label="讲师名称"
        :rules="[{ required: true, message: '姓名不能为空', trigger: 'blur' }]"
        prop="name"
      >
        <el-col :span="8">
          <el-input v-model="teacher.name" placeholder="输入名字" />
        </el-col>
      </el-form-item>

      <el-form-item label="讲师排序" prop="sort">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>

      <el-form-item label="讲师头衔" prop="level">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历" prop="career">
        <el-input
          v-model="teacher.career"
          :rows="2"
          type="textarea"
          placeholder="例如：2019.7-现在，华南农业大学数学与信息学院、软件学院，院长"
        />
      </el-form-item>
      <el-form-item
        label="讲师简介"
        prop="intro"
        :rules="[
          { required: true, message: '课程简介不能为空', trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="teacher.intro"
          :rows="10"
          type="textarea"
          placeholder="例如：广东省自然科学基金杰出青年基金获得者"
        />
      </el-form-item>

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头像缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imageCropperShow = true"
          >更换头像</el-button
        >

        <!-- 
          v-show:是否显示上传组件
          key:类似于id，如果一个页面多个图片上传控件，可以区分
          url:后台上传的url地址
          @close:关闭上传组件
          @crop-upload-success:上传成功后的回调
         -->
        <image-cropper
          v-show="imageCropperShow"
          :width="200"
          :heigh="200"
          :key="imageCropperKey"
          :url="BASE_API + '/OSS/fileOss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="submitForm('ruleForm')"
          >保存</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script>

import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: 'https://it-college-katsun.oss-cn-guangzhou.aliyuncs.com/resources/timo.png'
      },
      imageCropperShow: false,
      imageCropperKey: 0,
      BASE_API: process.env.VUE_APP_BASE_API,//获取配置文件中的base_api
      saveBtnDisabled: false, // 保存按钮是否禁用,
    }
  },

  components: {
    ImageCropper,
    PanThumb
  },
  methods: {
    saveOrUpdate() {
      this.saveBtnDisabled = true
      this.saveTeacher()
    },
    // 保存
    saveTeacher() {
      teacherApi.save(this.teacher)
        .then(resp => {
          this.$message({
            type: 'success',
            message: '添加讲师' + this.teacher.name + '成功!'
          })
          //回到列表页面 路由跳转
          this.$router.push({ path: '/teacher/table' })
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveOrUpdate()
        } else {
          console.log('error submit!!');
          this.$message({
            type: 'error',
            message: '提交失败，请检查个人信息格式是否正确！'
          })
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    close() {//关闭图片上传弹框
      this.imageCropperShow = false
      this.imageCropperKey = this.imageCropperKey + 1
    },
    cropSuccess(data) {//上传成功
      this.imageCropperShow = false
      this.teacher.avatar = data.url
      this.imageCropperKey = this.imageCropperKey + 1

    },
  }
}
</script>

<style>
</style>
  
  