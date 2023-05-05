<template>
  <div class="app-container">
    <el-table
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%; text-align: center"
      :header-cell-style="{ background: '#FAFAFA', color: '#515A6E' }"
      border
    >
      <el-table-column label="标题" prop="title" width="150px">
      </el-table-column>
      <el-table-column label="封面" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover" height="100px" /> </template
      ></el-table-column>
      <el-table-column label="作者" prop="author"> </el-table-column>
      <el-table-column label="博客简介" prop="introduction"> </el-table-column>
      <el-table-column label="阅读数量" prop="viewCount"> </el-table-column>
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
            @click="showBlogDialog(scope.row)"
            plain
            >查看</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeBlogById(scope.row)"
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
    <el-dialog
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :title="blog.title"
      :visible.sync="dialogFormVisible"
      v-if="dialogFormVisible"
      width="80%"
      center
      class="roll-dialog"
    >
      <b>正文内容：</b>
      <span v-html="blog.content" style="margin-left: 5%"></span>
    </el-dialog>
  </div>
</template>
      
<script>
import blog from '@/api/blog';

export default {
  data() {
    return {
      list: null,
      blog: {},
      total: 0, //总记录数
      current: 1, //页码
      limit: 10, //每页记录数
      dialogFormVisible: false,
      formLabelWidth: '120px',
      loading: {}
    }
  },
  created() {
    this.getBlogListPage(this.current);
  },
  methods: {
    getBlogListPage(val) {
      blog.getBlog(val, this.limit).then(res => {
        this.list = res.data.page.records
        this.total = res.data.page.total
      })
    },

    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.limit = val
      this.getBlogListPage(this.current)
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      this.current = val
      this.getBlogListPage(this.current)
    },
    showBlogDialog(val) {
      this.dialogFormVisible = true
      this.loading = true
      blog.getBlogById(val.id).then(res => {
        this.blog = res.data.blog
        this.$nextTick(function () { this.loading = false })
      })
      //   this.loading = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)',
      //   target: document.querySelector('.dialog-box-distinguish') // 在指定得到元素上显示loading，要设置下相对定位
      // });
      blog.getBlogById(val.id).then(res => {
        this.blog = res.data.blog
        this.$nextTick(function () { this.loading=false })
      })


    },
    removeBlogById(val) {
      this.$confirm('是否删除该博客?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        blog.removeBlog(val.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getBlogListPage(this.current);
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

  },
}
</script>

<style scoped>
.roll-dialog ::v-deep .el-dialog .el-dialog__body {
  padding: 3px 30px;
  overflow-y: scroll;
  height: 600px;
}

</style>
      