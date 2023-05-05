<template>
  <client-only>
  <div>
    <div style="font-size: 14px; margin: 20px 200px;">
      <div style="display: flex; border-radius: 5px">
        <div style="flex: 1; overflow: hidden">
          <div
            v-for="blog in blogList"
            :key="blog.id"
            style="
              background-color: #f5f5f5;
              cursor: pointer;
              overflow: hidden;
              height: 185px;
              display: flex;
              margin-bottom: 20px;
            "
            class="item"
          >
            <div style="margin: 20px 0 20px 20px; width: 200px">
              <div
                style="
                  width: 68px;
                  line-height: 25px;
                  text-align: center;
                  background-color: #00000080;
                  color: #ffffff;
                  position: relative;
                  z-index: 99;
                  border-radius: 3px;
                  top: 5px;
                  left: 5px;
                "
              >
                {{ blog.typeId }}
              </div>
              <el-image
                :src="blog.cover"
                style="
                  height: 145px;
                  width: 200px;
                  object-fit: cover;
                  cursor: pointer;
                  margin-top: -25px;
                "
              ></el-image>
            </div>
            <div style="margin: 20px 20px">
              <div
                style="font-size: 18px; height: 40px; line-height: 40px"
                @click="gotoBlog(blog.id)"
              >
                {{ blog.title }}
              </div>
              <div
                style="
                  overflow: hidden;
                  text-overflow: ellipsis;
                  height: 65px;
                  line-height: 20px;
                  color: gray;
                "
              >
                {{ blog.introduction }}
              </div>
              <div
                style="
                  white-space: nowrap;
                  display: flex;
                  color: #a1a1a1;
                  line-height: 40px;
                "
              >
                <span class="icon-active"
                  ><i class="el-icon-alarm-clock el-icon--right"></i
                  >{{ blog.gmtCreate }}</span
                >
                <span
                  class="icon-active"
                  icon="el-icon-link"
                  style="margin-left: 10px"
                  ><i class="el-icon-view el-icon--right"></i
                  >{{ blog.viewCount }}人围观</span
                >
              </div>
            </div>
          </div>

          <div style="margin: 30px 0; text-align: center; overflow: auto">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :current-page="current"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
        <div style="width: 300px; margin-left: 20px">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="loginInfo.avatar" class="image" />
            <div style="padding: 14px; text-align: center">
              <h1>{{ loginInfo.nickname }}</h1>
              <span>{{ loginInfo.sign }}</span>
              <div class="bottom clearfix">
                <el-button type="text" class="button" @click="createBlog"
                  >我也来发布一篇</el-button
                >
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div>
      <el-dialog title="创建博客" :visible.sync="dialogFormVisible">
        <el-form :model="blog">
          <el-form-item label="标题" :label-width="formLabelWidth">
            <el-input v-model="blog.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="简介" :label-width="formLabelWidth">
            <el-input v-model="blog.introduction" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="分类" :label-width="formLabelWidth">
            <el-input v-model="blog.typeId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="封面" :label-width="formLabelWidth">
            <el-upload
              class="upload-demo"
              :action="BASE_API + '/OSS/fileOss'"
              :on-remove="handleRemove"
              :on-success="handleCoverSuccess"
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

          <el-form-item label="内容" :label-width="formLabelWidth">
            <client-only>
            <tinymce
              :height="300"
              v-model="blog.content"
              class="tinymce-container"
            ></tinymce>
          </client-only>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="commit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</client-only>
</template>

<script>
import tinymce from '@/components/Tinymce'
import cookie from 'js-cookie'
import blog from '@/api/blog'


export default {

  components: {
    tinymce
  },

  data() {
    return {
      value: new Date(),
      current: 1,
      total: 1,
      pages: 1,
      activeName: 'second',
      blog: {
        title: '',
        introduction: '',
        cover: 'https://it-college-katsun.oss-cn-guangzhou.aliyuncs.com/resources/blog.jpeg',
        typeId: '',
        content: '',
      },
      formLabelWidth: '70px',
      dialogFormVisible: false,
      loginInfo: {
        avatar: 'https://it-college-katsun.oss-cn-guangzhou.aliyuncs.com/resources/timo.png',
        name: '游客',
        sign: '欢迎来到在线教育博客',

      },
      blogList: [],
      BASE_API: 'http://localhost',
      fileList: [],
    };
  },
  created() {
    this.getUserInfo()
    this.initBlogList(this.current)
  },
  mounted() {
  },
  methods: {
    getUserInfo() {
      var userStr = cookie.get('IT_user')
      if (userStr) {
        this.loginInfo = JSON.parse(userStr)
      }
    },
    initBlogList(val) {
      blog.getBlogList(val, 6).then(res => {
        this.blogList = res.data.data.page.records
        this.current = res.data.data.page.current
        this.total = res.data.data.page.total
        this.pages = res.data.data.page.pages
      })
    },
    gotoBlog(val) {
      this.$router.push({ path: '/blog/' + val })
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    createBlog() {
      this.dialogFormVisible = true
    },
    handleRemove(file, fileList) {
      this.blog.cover = 'https://it-college-katsun.oss-cn-guangzhou.aliyuncs.com/resources/blog.jpeg'
    },
    handleCoverSuccess(res, file) {
      this.blog.cover = res.data.url
      console.log(res.data.url);
      console.log(this.blog.cover);
    },
    handlePreview(file) {
      console.log(file);
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
    onChange(file, list) {
      if (list.length > 1 && file.status !== "fail") {
        list.splice(0, 1);
      } else if (file.status === "fail") {
        errorMsg("上传失败，请重新上传！")
        list.splice(0, 1);
      }
    },
    commit() {
      blog.addBlog(this.blog).then(res => {
        if (res.data.success)
          this.$message({
            type: 'success',
            message: '发表博客成功'
          })
          this.dialogFormVisible=false
          this.blog.cover= 'https://it-college-katsun.oss-cn-guangzhou.aliyuncs.com/resources/blog.jpeg'
          this.initBlogList(this.current)
      })
    }

  }
};
</script>

<style>
.icon-active:hover {
  color: #585858;
}
.item img {
  width: 100%;
  height: 145px;
  transform: scale(1);
  transition: transform 1s ease 0s;
}

.item:hover img {
  transform: scale(1.1);
}
.face-pic:hover img {
  transform: rotate(360deg);
  -ms-transform: rotate(360deg); /* Internet Explorer */
  -moz-transform: rotate(360deg); /* Firefox */
  -webkit-transform: rotate(360deg); /* Safari 和 Chrome */
  -o-transform: rotate(360deg); /* Opera */
  transition: transform 0.6s ease 0s;
}
.el-calendar-day {
  height: 30px !important;
  text-align: center !important;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: center;
}

.image {
  width: 80%;
  display: block;
  margin-left: 10%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.tinymce-container {
  line-height: 29px;
}
</style>