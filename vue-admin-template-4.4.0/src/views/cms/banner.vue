<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline" >
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-edit"
          @click="addBannerDialog()"
          >新建轮播图</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%; text-align: center"
      :header-cell-style="{ background: '#FAFAFA', color: '#515A6E' }"
      border
    >
      <el-table-column label="图片名称" prop="title" width="100px"> </el-table-column>
      <el-table-column label="封面" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" height="80px" /> </template
      ></el-table-column>
      <el-table-column label="链接" prop="linkUrl"> </el-table-column>
      <el-table-column label="排序" prop="sort"> </el-table-column>
      <el-table-column label="创建日期">
        <template slot-scope="scope">
          {{ (scope.row.gmtCreate || "").split(" ")[0] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-edit"
            @click="showBannerDialog(scope.row)"
            plain
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeBannerById(scope.row)"
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
    
    <el-dialog title="修改轮播图" :visible.sync="dialogFormVisible">
      <el-form :model="tempBanner">
        <el-form-item label="轮播图名称" :label-width="formLabelWidth">
          <el-input v-model="tempBanner.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="轮播图地址" :label-width="formLabelWidth">
          <el-input v-model="tempBanner.linkUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="轮播图排序" :label-width="formLabelWidth">
          <el-input v-model="tempBanner.sort" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="封面" :label-width="formLabelWidth">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="updateBanner">确 定</el-button>
      </div>
    </el-dialog>



    <el-dialog title="修改轮播图" :visible.sync="addDialogFormVisible">
      <el-form :model="banner">
        <el-form-item label="轮播图名称" :label-width="formLabelWidth">
          <el-input v-model="banner.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="轮播图地址" :label-width="formLabelWidth">
          <el-input v-model="banner.linkUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="轮播图排序" :label-width="formLabelWidth">
          <el-input v-model="banner.sort" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="封面" :label-width="formLabelWidth">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBanner">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
    
<script>
import banner from '@/api/banner'

export default {
  data() {
    return {
      list: null,
      banner:{},
      tempBanner:{},
      total: 0, //总记录数
      current: 1, //页码
      limit: 10, //每页记录数
      datepicker: '',
      dialogFormVisible: false,
      addDialogFormVisible: false,
      formLabelWidth:'120px',
      fileList:[],
      oldImageUrl:'',
      BASE_API: process.env.VUE_APP_BASE_API,//获取配置文件中的base_api

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
    }
  },
  created() {
    this.getBannerListPage(this.current);
  },
  methods: {
    getBannerListPage(val) {
      banner.getBanner(val, this.limit).then(res => {
        console.log(res)
        this.list = res.data.items
        this.total = res.data.total
      })
    },
    updateBanner(){
        banner.updateBanner(this.tempBanner).then(res=>{
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.dialogFormVisible=false
          this.tempBanner={}
          this.getBannerListPage(this.current);
        })
    },
    addBanner(){
      banner.addBanner(this.banner).then(res=>{
        this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.addDialogFormVisible=false
          this.banner={}
          this.getBannerListPage(this.current);
      })
    },
    handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
      this.limit = val
      this.getBannerListPage(this.current)
    },
    handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`);
      this.current = val
      this.getBannerListPage(this.current)
    },
    showBannerDialog(val){
      this.tempBanner = JSON.parse(JSON.stringify(val))
      this.oldImageUrl=JSON.parse(JSON.stringify(val.imageUrl))
      this.dialogFormVisible = true
      console.log(val);
    },
    removeBannerById(val){
      this.$confirm('是否删除该轮播图?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          banner.removeBanner(val.id).then(res=>{
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getBannerListPage(this.current);
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleRemove(file, fileList) {
      this.tempBanner.imageUrl = this.oldImageUrl
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
      this.tempBanner.imageUrl = res.data.url
      this.banner.imageUrl = res.data.url
    },
    addBannerDialog(){
      this.addDialogFormVisible=true
    }
  },
}
</script>
    