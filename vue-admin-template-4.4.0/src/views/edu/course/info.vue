<template>
  <div>
    <el-form
      :model="courseInfo"
      label-width="120px"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-form-item
        label="课程标题"
        :rules="[{ required: true, message: '标题不能为空', trigger: 'blur' }]"
        prop="title"
      >
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="所属分类">
        <div class="block">
          <el-cascader
            ref="cascader"
            v-model="subjectIds"
            placeholder="试试搜索：Java"
            :options="subjectList"
            filterable
            @change="optionChange"
            :props="{
              expandTrigger: 'hover',
              value: 'id',
              label: 'title',
              children: 'children',
            }"
          ></el-cascader>
        </div>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择讲师" @change="changeTeacher">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时" prop="lessonNum">
        <el-input-number
          :min="1"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          class="upload-demo"
          :action="BASE_API + '/OSS/fileOss'"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleAcatarSuccess"
          :before-upload="beforeCoverUpload"
          :file-list="fileList"
          :on-change="onChange"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过2MB
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格" prop="price">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="next('ruleForm')"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>

    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
      higth="50%"
      align="center"
    >
      <img :src="courseInfo.cover" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import teacher from '@/api/edu/teacher'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'
export default {
  components: {
    ImageCropper,
    PanThumb,
    Tinymce
  },
  data() {
    return {
      courseInfo: {
        title: '',
        subjectId: '',
        subjectName: '',
        subjectParentId: '',
        subjectParentName: '',
        teacherId: '',
        teacherName: '',
        lessonNum: 1,
        description: '',
        cover: 'https://it-college-katsun.oss-cn-guangzhou.aliyuncs.com/resources/CourseDefultCover.jpg',
        price: 0
      },
      previewVisible: false,
      fileList: [],
      subjectIds: [],
      teacherList: '',
      subjectList: [],
      imageCropperShow: false,
      imageCropperKey: 0,
      BASE_API: process.env.VUE_APP_BASE_API,//获取配置文件中的base_api
      saveBtnDisabled: false,
    }
  },

  watch: {
    courseInfo() {
      if (this.$refs.cascader) {
        this.$refs.cascader.dropDownVisible = false;
      }
    },
  },
  //   props: [courseInfo],
  created() {
    this.getTeacherList()
    this.getSubjectList()
  },


  methods: {
    next(formName) {
      console.log(this);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('increment')
        } else {
          this.$message({
            type: 'error',
            message: '提交失败，请检查个人信息格式是否正确！'
          })
          return false;
        }
      });
      this.setCourse()
    },
    getTeacherList() {
      teacher.getAllTeacherList().then(resp => {
        this.teacherList = resp.data.data
      })
    },
    getSubjectList() {
      subject.getSubjectList().then(resp => {
        this.subjectList = resp.data.subject
      })
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
    changeTeacher(){
      const index= this.teacherList.findIndex(d=>d.id===this.courseInfo.teacherId)
      this.courseInfo.teacherName=this.teacherList[index].name
    },
    optionChange() {
      console.log(this);
      this.courseInfo.subjectParentId = this.subjectIds[0]
      const index1 = this.subjectList.findIndex((d) => d.id === this.subjectIds[0])
      this.courseInfo.subjectName= this.subjectList[index1].title

      this.courseInfo.subjectId = this.subjectIds[1]
      const index2= this.subjectList[index1].children.findIndex((d)=>d.id===this.subjectIds[1])
      this.courseInfo.subjectParentName=this.subjectList[index1].children[index2].title
    },
    handleRemove(file, fileList) {
      this.courseInfo.cover = 'https://it-college-katsun.oss-cn-guangzhou.aliyuncs.com/resources/CourseDefultCover.jpg'
    },
    handlePreview() {
      this.previewVisible = true
    },
    onChange(file, list) {
      if (list.length > 1 && file.status !== "fail") {
        list.splice(0, 1);
      } else if (file.status === "fail") {
        errorMsg("上传失败，请重新上传！")
        list.splice(0, 1);
      }
    },
    beforeCoverUpload(file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleAcatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url
    },
    setCourse() {
      this.$emit("getCourseInfo", this.courseInfo)
    }
  },
}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>