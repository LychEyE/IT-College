<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input
          v-model="orderQuery.nickname"
          placeholder="用户昵称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="orderQuery.courseTitle"
          placeholder="课程名称"
        ></el-input>
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
          @click="getOrderListPage(1)"
          >查询</el-button
        >
        <el-button type="default" @click="resetData()">清空</el-button>
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
      <el-table-column label="订单号" prop="orderNo"> </el-table-column>
      <el-table-column label="课程名称" prop="courseTitle"> </el-table-column>
      <el-table-column label="课程封面" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.courseCover" height="80px" /> </template
      ></el-table-column>
      <el-table-column label="用户" prop="nickname"> </el-table-column>
      <el-table-column label="讲师名称" prop="teacherName"> </el-table-column>
      <el-table-column label="金额" prop="totalFee"> </el-table-column>
      <el-table-column label="创建日期">
        <template slot-scope="scope">
          {{ (scope.row.gmtCreate || "").split(" ")[0] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="cancelOrderById(scope.row)"
            >取消订单</el-button
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
import order from '@/api/order'

export default {
  data() {
    return {
      list: null,
      orderQuery: {},
      total: 0, //总记录数
      current: 1, //页码
      limit: 10, //每页记录数
      datepicker: '',
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
    this.getOrderListPage(this.current);
  },
  methods: {
    getOrderListPage(val) {
      order.getNotPayOrder(val, this.limit, this.orderQuery).then(res => {
        this.list = res.data.page.records
        console.log(this.list);
        this.total = res.data.page.total
      })
    },
    cancelOrderById(val) {
      console.log(val);
      this.$confirm('是否取消该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        order.cancelOrder(val.orderNo).then(res => {
          this.$message({
            type: 'success',
            message: '取消成功!'
          });
        this.getOrderListPage(this.current);
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    dateChange(val) {
      this.orderQuery.begin = val.toString().split(",")[0]
      this.orderQuery.end = val.toString().split(",")[1]
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val
      this.getOrderListPage(this.current)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getOrderListPage(this.current)
    },
    resetData() {
      this.orderQuery = {}
      this.datepicker = ''
      this.getOrderListPage(this.current)
    },
  },
}
  </script>
  