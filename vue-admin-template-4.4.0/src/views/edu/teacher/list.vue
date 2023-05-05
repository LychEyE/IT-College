<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline" >
      <el-form-item>
        <el-input v-model="teacherQueryVo.name" placeholder="讲师名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="teacherQueryVo.level"
          placeholder="讲师头衔"
          clearable
        >
          <el-option label="高级讲师" :value="1"></el-option>
          <el-option label="首席讲师" :value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="datepicker"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="dateChange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getTeacherListPage(1)"
          >查询</el-button
        >
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%;text-align: center;"
      :header-cell-style="{background:'#FAFAFA',color:'#515A6E'}"
      border
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="头像">
              <span><img :src="props.row.avatar" height="100px" /> </span>
            </el-form-item>
            <el-form-item label="名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="头衔">
              <span>{{ props.row.level === 1 ? "高级讲师" : "首席讲师" }}</span>
            </el-form-item>
            <el-form-item label="资历">
              <span>{{ props.row.intro }}</span>
            </el-form-item>
            <el-form-item label="加入时间">
              <span>{{ props.row.gmtCreate }}</span>
            </el-form-item>
            <el-form-item label="修改时间">
              <span>{{ props.row.gmtModified }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="序号" width="70">
        <template slot-scope="scope">
          {{ (current - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name"> </el-table-column>
      <el-table-column label="头衔">
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? "高级讲师" : "首席讲师" }}
        </template>
      </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" height="100px" /> </template
      ></el-table-column>
      <el-table-column label="加入日期">
        <template slot-scope="scope">
          {{ (scope.row.gmtCreate || "").split(" ")[0] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showDialog(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block" align="center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 对话框 修改教师信息 -->
    <el-dialog
      title="修改讲师信息"
      :visible.sync="dialogFormVisible"
      v-if="dialogFormVisible"
    >
    <!-- v-if="dialogFormVisible" 每次打开dialog都先销毁之前的dialog 这样重置表单的时候才能获取到新的数据 -->
      <el-form :model="tempTeacher" ref="ruleForm" class="demo-ruleForm">
        <el-form-item
          label="讲师名称"
          :rules="[
            { required: true, message: '姓名不能为空', trigger: 'blur' },
          ]"
          prop="name"
        >
          <el-col :span="8">
            <el-input v-model="tempTeacher.name" placeholder="输入名字" />
          </el-col>
        </el-form-item>

        <el-form-item label="讲师排序" prop="sort">
          <el-input-number
            v-model="tempTeacher.sort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>

        <el-form-item label="讲师头衔" prop="level">
          <el-select v-model="tempTeacher.level" clearable placeholder="请选择">
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
            v-model="tempTeacher.career"
            :rows="2"
            type="textarea"
            placeholder="例如：2019.7-现在，华南农业大学数学与信息学院、软件学院，院长"
          />
        </el-form-item>
        <el-form-item label="讲师简介" prop="intro">
          <el-input
            v-model="tempTeacher.intro"
            :rows="8"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引用调用teacher.js
import teacher from "@/api/edu/teacher"
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  //定义变量与初始值
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      imageCropperShow: false,
      imageCropperKey: 0,
      BASE_API: process.env.VUE_APP_BASE_API,//获取配置文件中的base_api
      tempTeacher: {},
      loading: true,
      datepicker: '',
      list: [], //调用方法查询后，接口返回的集合
      total: 0, //总记录数
      current: 1, //页码
      limit: 10, //每页记录数
      teacherQueryVo: {}, //条件封装的对象
      dialogFormVisible: false,//模态框默认不显示 触发后显示
      formLabelWidth: '120px',//模态框的表格宽度
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  components:{
    ImageCropper,PanThumb
  },
  //页面渲染之前执行，一般调用methods定义方法
  created() {
    this.getTeacherListPage(this.current);
  },
  //创建具体的方法，调用teacher.js的方法
  methods: {
    //获取讲师列表
    getTeacherListPage(val) {
      this.loading = true
      teacher
        .getTeacherListPage(val, this.limit, this.teacherQueryVo)
        .then((response) => {
          //请求成功
          //response接口返回的数据
          
          this.list = response.data.page.records
          this.total = response.data.page.total
          console.log(this.list)
        })
        .catch((error) => {
          //请求失败
          console.log(error)
        })
      this.loading = false
    },
    removeDataById(val) {
      const h = this.$createElement;
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '此操作将永久删除讲师'),
          h('i', { style: 'color: teal' }, val.name),
          h('span', null, '，是否继续？')
        ]),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(action => {
        teacher.deleteTeacherById(val.id)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除讲师' + val.name + '成功'
            });
            this.getTeacherListPage(this.current)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '删除失败'
            })
          })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      });

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val
      this.getTeacherListPage(this.current)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getTeacherListPage(this.current)
    },
    resetData() {
      this.teacherQueryVo = {}
      this.datepicker = ''
      this.getTeacherListPage(this.current)

    },
    dateChange(val) {
      this.teacherQueryVo.begin = val.toString().split(",")[0]
      this.teacherQueryVo.end = val.toString().split(",")[1]
    },
    showDialog(val) {
      this.dialogFormVisible = true
      this.teacher = val
      this.tempTeacher = JSON.parse(JSON.stringify(val))
    },
    saveOrUpdate() {
      this.saveBtnDisabled = true
      this.saveTeacher()
      
    },
    // 保存
    saveTeacher() {
      teacher.save(this.tempTeacher)
        .then(resp => {
          this.$message({
            type: 'success',
            message: '修改讲师' + this.tempTeacher.name + '成功!'
          })
          this.teacher={}
          this.tempTeacher={}
          this.getTeacherListPage(this.current)
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveOrUpdate()
          this.dialogFormVisible = false
          
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
      this.imageCropperKey = this.imageCropperKey+1
    },
    cropSuccess(data) {//上传成功
      this.imageCropperShow = false
      this.teacher.avatar = data.url
      this.tempTeacher.avatar = data.url
      this.imageCropperKey = this.imageCropperKey+1

    },
  },
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>

