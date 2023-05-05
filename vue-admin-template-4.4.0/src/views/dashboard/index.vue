<template>
  <div>
    <el-row style="margin-left: -10px; margin-right: -10px">
      <el-col :span="8" style="padding-left: 10px; padding-right: 10px">
        <el-card shadow="hover" class="mgb20" style="height: 262px">
          <div class="user-info">
            <img class="user-avator" :src="avatar" />
            <div class="user-info-cont">
              <div class="user-info-name">{{name}}</div>
              <div>{{name==='Lychee'? '管理员':'讲师'}}</div>
            </div>
          </div>
          <div class="user-info-list">
            登录时间：
            <span>{{ time }}</span>
          </div>
          <div class="user-info-list">
            登录地址：
            <span>广东省 广州市</span>
          </div>
        </el-card>
        <el-card shadow="hover" style="height: 415px">
          <div slot="header" class="clearfix">
            <span>上架课程分类占比</span>
          </div>
          <div v-for="subject in subjectList" :key="subject.id">
            {{ subject.title }}
            <el-progress
              :percentage="subject.percent"
              :format="format"
            ></el-progress>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16" style="padding-left: 10px; padding-right: 10px">
        <el-row class="mgb20" style="margin-left: -10px; margin-right: -10px">
          <el-col :span="4" style="margin-left: 10px; margin-right: 10px">
            <el-card
              shadow="hover"
              class="el-card"
              :body-style="{ padding: '0px' }"
            >
              <div class="grid-content grid-con-1">
                <i class="el-icon-user-solid grid-con-icon"></i>

                <div class="grid-cont-right">
                  <div class="grid-num">{{staData.login}}</div>
                  <div>用户数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4" style="margin-left: 10px; margin-right: 10px">
            <el-card
              shadow="hover"
              class="el-card"
              :body-style="{ padding: '0px' }"
            >
              <div class="grid-content grid-con-1">
                <i class="el-icon-view grid-con-icon"></i>

                <div class="grid-cont-right">
                  <div class="grid-num">{{ staData.visits }}</div>
                  <div>访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4" style="margin-left: 10px; margin-right: 10px">
            <el-card
              shadow="hover"
              class="el-card"
              :body-style="{ padding: '0px' }"
            >
              <div class="grid-content grid-con-2">
                <i class="el-icon-reading grid-con-icon"></i>

                <div class="grid-cont-right">
                  <div class="grid-num">{{staData.course}}</div>
                  <div>课程数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4" style="margin-left: 10px; margin-right: 10px">
            <el-card
              shadow="hover"
              class="el-card"
              :body-style="{ padding: '0px' }"
            >
              <div class="grid-content grid-con-2">
                <i class="el-icon-s-goods grid-con-icon"></i>

                <div class="grid-cont-right">
                  <div class="grid-num">{{staData.sellCount}}</div>
                  <div>已售</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5" style="margin-left: 10px; margin-right: 10px">
            <el-card
              shadow="hover"
              class="el-card"
              :body-style="{ padding: '0px' }"
            >
              <div class="grid-content grid-con-3">
                <i class="el-icon-bank-card grid-con-icon"></i>

                <div class="grid-cont-right">
                  <div class="grid-num">{{staData.money}}</div>
                  <div>成交</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" class="mgb20" style="height: 400px">
          <div class="chart-container">
            <div id="chart" class="chart" style="height: 400px; width: 100%" />
          </div>
        </el-card>
        <el-card shadow="hover" style="height: 310px">
          <div slot="header" class="clearfix">
            <span>最近加入用户</span>
          </div>
          <el-table :data="userList" style="width: 100%" :show-header="false">
            <el-table-column label="头像" width="180">
              <template slot-scope="scope">
                <img :src="scope.row.avatar" height="50px" />
              </template>
            </el-table-column>
            <el-table-column prop="nickname" label="用户名" width="180">
            </el-table-column>
            <el-table-column label="方式">
              <template slot-scope="scope">
                {{scope.row.mobile?'手机用户':'微信用户'}}
              </template> </el-table-column>
            <el-table-column prop="gmtCreate" label="时间"> </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-left: -10px; margin-right: -10px"> </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import subject from '@/api/edu/subject';
import echarts from 'echarts'
import user from '@/api/edu/user';
import sta from '@/api/edu/sta';


export default {
  name: 'Dashboard',
  created() {
    this.getSubjectRank()
    this.initChartData()
    this.initUserList()
    this.initAllSta()
  },
  mounted() {

  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'time',
    ])
  },
  data() {
    return {
      subjectList: [],
      chart: null,
      loginList: [],
      registerList: [],
      userList: [],
      xData: [],
      staData:{},
    }
  },
  methods: {
    getSubjectRank() {
      subject.getSubjectRank().then(res => {
        this.subjectList = res.data.subjectList
      })
    },
    format(percentage) {
      return percentage + '%'
    },
    showChart() {

    },

    //准备图表数据
    initChartData() {
      user.getDataSta().then(res => {
        this.xData = res.data.date
        this.loginList = res.data.login
        this.registerList = res.data.register
        this.setChart()
      })
    },
    initUserList() {
      user.getUserSta().then(res => {
        this.userList = res.data.userList
      })
    },
    initAllSta(){
      sta.getAllSta().then(res=>{
        this.staData=res.data.sta
      })
    },

    // 设置图标参数
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById('chart'))
      // console.log(this.chart)

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '最近一周用户登陆注册数'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['登陆人数', '注册人数']
        },
        grid: {
          left: '0%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: this.xData
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          data: [0, 5, 10, 15, 20]
        },
        series: [
          {
            name: '登陆人数',
            type: 'line',
            data: this.loginList,
            lineStyle: {
              color: 'skyBlue'
            }
          },
          {
            name: '注册人数',
            type: 'line',
            data: this.registerList,
            lineStyle: {
              color: 'yellow'
            }
          },
        ]
      }
      this.chart.setOption(option)
    }
  },
}
</script>

<style lang="scss" scoped>
.mgb20 {
  margin-bottom: 20px;
}

.el-card {
  border: 1px solid #ebeef5;
  background-color: #fff;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  border-radius: 4px;
  overflow: hidden;
}
.grid-content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 100px;
}
.grid-con-1 .grid-con-icon {
  background: #2d8cf0;
}

.grid-con-2 .grid-con-icon {
  background: #64d572;
}

.grid-con-3 .grid-con-icon {
  background: #f25e43;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}
.grid-cont-right {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-con-1 .grid-num {
  color: #2d8cf0;
}

.grid-con-2 .grid-num {
  color: #64d572;
}
.grid-con-3 .grid-num {
  color: #f25e43;
}

.grid-num {
  font-size: 30px;
  font-weight: 700;
}

.user-info {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}
</style>
