<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="active"
      finish-status="success"
      simple
      style="margin-bottom: 40px; margin-left: 20px; margin-right: 20px"
    >
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>
    <info v-show="active == 0" ref="info" v-on:increment="incrementTotal" @getCourseInfo="getCourseInfo"/>
    
    <chapter v-show="active == 1" ref="chapter" v-on:increment="incrementTotal" v-on:decrement="decrementTotal" @getChapterInfo="getChapterInfo" />
    
    <publish v-show="active == 2" ref="chapter" :info="courseInfo" />
    <el-form v-show="active==2" :inline="true" label-width="120px" align="center">
      <el-form-item style="text-align: center">
        <el-button type="primary" @click="decrementTotal">返回上一步</el-button>
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button type="primary" @click="submit">保存发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import info from './info.vue'
import chapter from './chapter.vue'
import publish from './publish.vue'
import course from '@/api/edu/course'


export default {
  components: {
    info, chapter,publish
  },
  data() {
    return {
      courseInfo: {},
      chapterInfo:{},
      param:{courseInfo:'',chapterInfo:''},
      active: 0,
      saveBtnDisabled: false // 保存按钮是否禁用
    }
  },

  created() {
    console.log('info created')
  },

  methods: {
    next() {
      console.log('next')
      console.log(this.$refs.info.courseInfo.title);
    },
    incrementTotal() {
      this.active = this.active + 1
    },
    decrementTotal(){
      this.active = this.active - 1

    },
    getCourseInfo(data){
      this.courseInfo=data
    },
    getChapterInfo(data){
      this.chapterInfo=data
    },
    submit(){
      console.log(this);
      this.param.courseInfo=this.courseInfo
      this.param.chapterInfo=this.chapterInfo
      course.addCourseInfo(this.param).then(res=>{
        this.$message({
            type: 'success',
            message: '添加课程' + this.courseInfo.title + '成功!'
          })
          this.$router.push({ path: '/course/list' })
      })
    }

    
  }
}
</script>