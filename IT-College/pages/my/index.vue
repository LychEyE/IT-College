<template>
  <el-container
    style="width: 1200px; height: 700px; margin: 20px auto"
    class="bg-fa of"
  >
    <el-main>
      <el-tabs :tab-position="tabPosition">
        <el-tab-pane label="个人资料">
          <el-descriptions
            title="个人简介"
            direction="horizontal"
            :column="1"
            :border="true"
          >
            <template slot="extra">
              <el-button type="primary" size="small" @click="updateMyInfo"
                >更新</el-button
              >
            </template>
            <el-descriptions-item label="头像">
              <el-tooltip
                class="item"
                effect="dark"
                content="点击修改头像"
                placement="right"
              >
                <img
                  :src="myInfo.avatar"
                  height="60px"
                  @click="imageCropperShow = true"
                />
              </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item
              label="昵称"
              label-class-name="my-label"
              content-class-name="my-content"
            >
              <el-input v-model="myInfo.nickname"> </el-input>
            </el-descriptions-item>

            <el-descriptions-item label="手机号">
              {{ myInfo.mobile }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">
              <el-input v-model="myInfo.email"></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="个性签名">
              <el-input v-model="myInfo.sign"></el-input>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane label="我的订单">
          <!-- <el-button @click="resetDateFilter">清除日期过滤器</el-button>
          <el-button @click="clearFilter">清除所有过滤器</el-button> -->
          <el-table ref="filterTable" :data="myOrder" style="width: 100%">
            <el-table-column
              prop="gmtCreate"
              label="创建日期"
              sortable
              width="180"
              column-key="gmtCreate"
              :filter-method="filterHandler"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="courseTitle" label="课程名称" width="180" align="center">
            </el-table-column>
            <el-table-column
              prop="address"
              label="订单金额"
              :formatter="formatter"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="status"
              label="订单状态"
              width="100"
              :filters="[
                { text: '已支付', value: 1 },
                { text: '未支付', value: 0 },
              ]"
              :filter-method="filterTag"
              filter-placement="bottom-end"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  v-show="scope.row.status == 1 || scope.row.status == 0"
                  :type="scope.row.status === 0 ? 'primary' : 'success'"
                  disable-transitions
                  >{{ scope.row.status === 1 ? "已支付" : "未支付" }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="操作"  align="center">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  size="small"
                  round
                  plain
                  v-show="scope.row.status == 1"
                  @click="toStudy(scope.row.courseId)"
                  >现在学习</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  round
                  plain
                  v-show="scope.row.status == 0"
                  @click="cancelOrder(scope.row.orderNo)"
                  >取消订单</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  round
                  plain
                  v-show="scope.row.status == 0"
                  @click="createOrders(scope.row.courseId)"
                  >去付款</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="我的收藏" style="text-align: center">
          <el-table :data="myCollect" height="250" border style="width: 100%">
            <el-table-column prop="title" label="标题" width="180" align="center">
            </el-table-column>
            <el-table-column prop="cover" label="封面" width="180" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.cover" height="60px" />
              </template>
            </el-table-column>
            <el-table-column prop="lessonNum" label="课时" align="center"> </el-table-column>
            <el-table-column prop="price" label="价格" align="center"> </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  round
                  plain
                  size="small"
                  @click="toStudy(scope.row.id)"
                  >现在学习</el-button
                >
                <el-button
                  type="danger"
                  round
                  plain
                  size="small"
                  @click="removeCollect(scope.row.id)"
                  >取消收藏</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="我的文章">
          <el-table
      :data="blogList"
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
        </el-tab-pane>
        <el-tab-pane label="修改密码">
          <el-descriptions
            title="修改密码"
            direction="horizontal"
            :column="1"
            :border="true"
          >
            <template slot="extra">
              <el-button type="primary" size="small" @click="updatePassword"
                >更新密码</el-button
              >
            </template>
            <el-descriptions-item label="原密码">
              <el-input
                type="password"
                prefix-icon="el-icon-lock"
                v-model="password.oldPassword"
                show-password
                aria-placeholder="微信注册默认密码为123456"
              ></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="新密码">
              <el-input
                type="password"
                prefix-icon="el-icon-lock"
                v-model="password.newPassword"
                show-password
              ></el-input>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <client-only>
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
    </client-only>
  </el-container>
</template>
<script>
import user from '@/api/user'
import order from '@/api/order'
import collect from '@/api/collect'
// import ImageCropper from '@/components/ImageCropper'
// import PanThumb from '@/components/PanThumb'
export default {
  // components: {
  //   ImageCropper,
  //   PanThumb
  // },
  data() {
    return {
      tabPosition: 'left',
      myInfo: {
        mobile: '',
        nickname: '',
        email: '',
        avatar: '',
        sign: '',
      },
      password: {
        newPassword: '',
        oldPassword: ''
      },
      myOrder: [{
        // orderNo: '',
        // courseTitle: '',
        // courseCover: '',
        // teacherName: '',
        // nickname: '',
        // totalFee: '',
        // payType: '',
        // status: '',
        // gmtCreate: ''
      }],
      blogList:[],
      myCollect: [],
      BASE_API: 'http://localhost',
      imageCropperShow: false,
      imageCropperKey: 0,
    };
  },
  created() {
    this.initMyInfo()
    this.initMyOrder()
    this.initMyCollect()
    this.initMyBlog()
  },

  methods: {
    initMyInfo() {
      user.getMyInfo().then(res => {
        this.myInfo = res.data.data.myInfo
      })
    },
    initMyOrder() {
      order.getMyOrder().then(res => {
        this.myOrder = res.data.data.MyOrder
      })
    },
    initMyCollect() {
      collect.getCollect().then(res => {
        this.myCollect = res.data.data.myCollect
      })
    },
    initMyBlog(){

    },

    toStudy(val) {
      this.$router.push({ path: '/course/' + val })
    },
    removeCollect(val) {
      collect.removeCollect(val).then(res => {
        this.$message({
          type: "success",
          message: "取消收藏成功"
        })
      })
    },
    cancelOrder(val){
      console.log(val);
      order.cancelOrder(val).then(res=>{
        this.$message({
          type: "success",
          message: "取消订单成功"
        })
        this.initMyOrder()
      })
    },
    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date');
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.totalFee;
    },
    filterTag(value, row) {
      console.log(value);
      console.log(row);
      return row.status === value;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    close() {//关闭图片上传弹框
      this.imageCropperShow = false
      this.imageCropperKey = this.imageCropperKey + 1
    },
    cropSuccess(data) {//上传成功
      this.imageCropperShow = false
      this.myInfo.avatar = data.data.url
      this.imageCropperKey = this.imageCropperKey + 1

      user.updateAvatar(this.myInfo).then(res => {
        this.$message({
          type: "success",
          message: "更新头像成功"
        })
      })

    },
    updateMyInfo() {
      user.updateMyInfo(this.myInfo).then(res => {
        this.$message({
          type: "success",
          message: "更新信息成功"
        })
      })
    },
    updatePassword() {
        console.log('2313');
        user.updatePassword(this.password).then(res=>{
          console.log(res);
          if(res.data.success){
            this.$message({
              type: "success",
              message: "修改成功",
            });
          }else{
            this.$message({
              type: "error",
              message: "修改失败,"+res.data.message+'!',
            });
          }
          this.password={newPassword:'',oldPassword:''}
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
    createOrders(val) {
      // if (this.userIsLogin() == "no") return;
      order.createOrders(val).then(res => {
        this.$router.push({ path: '/orders/' + res.data.data.orderNo })
      })
    },
  },
};
</script>