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
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" height="80px" /> </template
      ></el-table-column>
      <el-table-column label="用户昵称" prop="name" align="center"> </el-table-column>
      <el-table-column label="评论内容" prop="content" width="300px" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column label="回复数量" prop="commentNum" align="center"> </el-table-column>
      <el-table-column label="点赞数量" prop="likeCount" align="center"> </el-table-column>
      <el-table-column label="创建日期" align="center">
        <template slot-scope="scope">
          {{ (scope.row.time || "").split(" ")[0] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeCommentById(scope.row)"
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
  </div>
</template>
        
  <script>
import comment from '@/api/comment';

export default {
  data() {
    return {
      list: null,
      comment:{},
      total: 0, //总记录数
      current: 1, //页码
      limit: 10, //每页记录数
      formLabelWidth: '120px',
    }
  },
  created() {
    this.getCommentListPage(this.current);
  },
  methods: {
    getCommentListPage(val) {
      comment.getComment(val, this.limit).then(res => {
        this.list = res.data.commentPage.records
        this.total = res.data.commentPage.total
      })
    },

    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.limit = val
      this.getCommentListPage(this.current)
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      this.current = val
      this.getCommentListPage(this.current)
    },
    
    removeCommentById(val) {
      this.comment.id=val.id
      this.comment.parentId=val.parentId
      this.comment.fromId=val.fromId
      console.log(this.comment);
      this.$confirm('是否删除该评论?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        comment.removeCommentById(this.comment).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getCommentListPage(this.current);
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
  
<style>


.el-tooltip__popper{
  max-width:20%
}
</style>
        