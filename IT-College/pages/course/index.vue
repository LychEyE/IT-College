<template>  
  <div id="aCoursesList" class="bg-fa of" >
    <!-- /课程列表 开始 -->
    <section class="container">
      <header class="comm-title">
        <h2 class="fl tac">
          <span class="c-333">全部课程</span>
        </h2>
      </header>
      <section class="c-sort-box">
        <section class="c-s-dl">
          <dl>
            <dt>
              <span class="c-999 fsize14">课程类别</span>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li>
                  <a title="全部" href="#" @click="allSubjectCourse">全部</a>
                </li>
                <li
                  v-for="(firstSubject, index) in firstSubjectList"
                  :key="index"
                  :class="{ active: index == first }"
                >
                  <a
                    :title="firstSubject.title"
                    href="#"
                    @click="getSecondSubject(index)"
                    >{{ firstSubject.title }}</a
                  >
                </li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt>
              <span class="c-999 fsize14"></span>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li
                  v-for="(secondSubject, index) in secondSubjectList"
                  :key="index"
                  :class="{ active: index == second }"
                >
                  <a
                    :title="secondSubject.title"
                    href="#"
                    @click="getSubjectCourse(index)"
                  >
                    {{ secondSubject.title }}
                  </a>
                </li>
              </ul>
            </dd>
          </dl>
          <div class="clear"></div>
        </section>
        <div class="js-wrap">
          <section class="fr">
            <span class="c-ccc">
              <i class="c-master f-fM">1</i>/
              <i class="c-666 f-fM">1</i>
            </span>
          </section>
          <section class="fl">
            <ol class="js-tap clearfix">
              <li
                :class="{ 'current bg-orange': courseQuery.buyCountSort != '' }"
              >
                <a
                  title="销量"
                  href="javascript:void(0);"
                  @click="searchBuyCount()"
                  >销量&nbsp;
                  <span :class="courseQuery.buyCountSort == 1 ? 'show' : 'hide'"
                    >↓</span
                  >
                  <span :class="courseQuery.buyCountSort == 2 ? 'show' : 'hide'"
                    >↑</span
                  >
                </a>
              </li>
              <li
                :class="{
                  'current bg-orange': courseQuery.gmtCreateSort != '',
                }"
              >
                <a
                  title="最新"
                  href="javascript:void(0);"
                  @click="searchGmtCreate()"
                  >最新&nbsp;
                  <span
                    :class="courseQuery.gmtCreateSort == 1 ? 'show' : 'hide'"
                    >↓</span
                  >
                  <span
                    :class="courseQuery.gmtCreateSort == 2 ? 'show' : 'hide'"
                    >↑</span
                  >
                </a>
              </li>
              <li :class="{ 'current bg-orange': courseQuery.priceSort != '' }">
                <a
                  title="价格"
                  href="javascript:void(0);"
                  @click="searchPrice()"
                  >价格&nbsp;
                  <span :class="courseQuery.priceSort == 1 ? 'show' : 'hide'"
                    >↓</span
                  >
                  <span :class="courseQuery.priceSort == 2 ? 'show' : 'hide'"
                    >↑</span
                  >
                </a>
              </li>
            </ol>
          </section>
        </div>
        <div class="mt40">
          <!-- /无数据提示 开始-->
          <section class="no-data-wrap" v-if="courseList.length == 0">
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam"
              >没有相关数据，正在努力整理中...</span
            >
          </section>
          <!-- /无数据提示 结束-->
          <article class="comm-course-list" v-else>
            <ul class="of" id="bna">
              <li
                v-for="course in courseList.items"
                :key="course.id"
                style="height: 270px"
              >
                <div class="cc-l-wrap">
                  <section class="course-img">
                    <img
                      :src="course.cover"
                      class="img-responsive"
                      :alt="course.title"
                    />
                    <div class="cc-mask">
                      <a
                        :href="'/course/' + course.id"
                        title="开始学习"
                        class="comm-btn c-btn-1"
                        >开始学习</a
                      >
                    </div>
                  </section>
                  <h3 class="hLh30 txtOf mt10">
                    <a
                      :href="'/course/' + course.id"
                      :title="course.title"
                      class="course-title fsize18 c-333"
                      >{{ course.title }}</a
                    >
                  </h3>
                  <section class="mt10 hLh20 of">
                    <span class="fr jgTag bg-green">
                      <i class="c-fff fsize12 f-fA">
                        {{
                          Number(course.price) === 0
                            ? "免费"
                            : "￥" + course.price
                        }}
                      </i>
                    </span>
                    <span class="fl jgAttr c-ccc f-fA">
                      <i class="c-999 f-fA">{{ course.buyCount }}人购买</i>
                      |
                      <i class="c-999 f-fA">{{ course.viewCount }}观看</i>
                    </span>
                  </section>
                </div>
              </li>
            </ul>
            <div class="clear"></div>
          </article>
        </div>
        <!-- 公共分页 开始 -->
        <div>
          <div class="paging">
            <!-- undisable这个class是否存在，取决于数据属性hasPrevious -->
            <a
              :class="{ undisable: !courseList.hasPrevious }"
              href="#"
              title="首页"
              @click.prevent="gotoPage(1)"
              >首页</a
            >
            <a
              :class="{ undisable: !courseList.hasPrevious }"
              href="#"
              title="前一页"
              @click.prevent="gotoPage(courseList.current - 1)"
              >&lt;</a
            >
            <a
              v-for="page in courseList.pages"
              :key="page"
              :class="{
                current: courseList.current == page,
                undisable: courseList.current == page,
              }"
              :title="'第' + page + '页'"
              href="#"
              @click.prevent="gotoPage(page)"
              >{{ page }}</a
            >
            <a
              :class="{ undisable: !courseList.hasNext }"
              href="#"
              title="后一页"
              @click.prevent="gotoPage(courseList.current + 1)"
              >&gt;</a
            >
            <a
              :class="{ undisable: !courseList.hasNext }"
              href="#"
              title="末页"
              @click.prevent="gotoPage(courseList.pages)"
              >末页</a
            >
            <div class="clear" />
          </div>
        </div>
        <!-- 公共分页 结束 -->
      </section>
    </section>
    <!-- /课程列表 结束 -->
  </div>
</template>
  <script>
import course from '@/api/course'
export default {
  data() {
    return {
      current: 1,
      courseList: [],
      firstSubjectList: [],
      secondSubjectList: [],
      courseQuery: {
        title:'',
        buyCountSort: 0,
        gmtCreateSort: 0,
        priceSort: 0,
      },
      courseTitle:'',
      firstIndex: -1,
      secondIndex: -1,
      first: -1,
      second: -1,
    }
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) { 
    return {
      courseTitle: query.courseTitle
    }
  },
  created() {
    this.initCourse()
    this.getFirstSubject()
  },
  beforeRouteUpdate(to,from,next){
    this.courseTitle=to.query.courseTitle
    this.initCourse()
    next()
  },
  // watchQuery: true,
  methods: {
    initCourse() {
      this.courseQuery.title = this.courseTitle
      course.getList(1, 8, this.courseQuery).then(res => {
        this.courseList = res.data.data
      })
    },
    getFirstSubject() {
      course.getAllSubject().then(res => {
        this.firstSubjectList = res.data.data.subject
      })
    },
    getSecondSubject(index) {
      this.courseQuery.firstSubjectId = this.firstSubjectList[index].id
      this.courseQuery.secondSubjectId = null
      this.first = index
      this.second = -1
      this.secondSubjectList = this.firstSubjectList[index].children
      this.gotoPage(1)
    },
    getSubjectCourse(index) {
      this.courseQuery.secondSubjectId = this.secondSubjectList[index].id
      this.second = index
      this.gotoPage(1)
    },
    allSubjectCourse() {
      this.first = -1
      this.second = -1
      this.courseQuery.secondSubjectId = ''
      this.courseQuery.firstSubjectId = ''
      this.secondSubjectList = ''
      this.gotoPage(1)
    },
    gotoPage(current) {
      if (this.courseList.pages == 0 || (current != 0 && current != this.courseList.pages + 1))
        course.getList(current, 8, this.courseQuery).then(res => {
          this.courseList = res.data.data
          console.log(this.courseList);
        })
    },
    searchBuyCount() {
      this.courseQuery.buyCountSort = (this.courseQuery.buyCountSort + 1) % 3
      this.courseQuery.gmtCreateSort = 0
      this.courseQuery.priceSort = 0
      this.gotoPage(1)
    },
    searchGmtCreate() {
      this.courseQuery.buyCountSort = 0
      this.courseQuery.gmtCreateSort = (this.courseQuery.gmtCreateSort + 1) % 3
      this.courseQuery.priceSort = 0
      this.gotoPage(1)
    },
    searchPrice() {
      this.courseQuery.buyCountSort = 0
      this.courseQuery.gmtCreateSort = 0
      this.courseQuery.priceSort = (this.courseQuery.priceSort + 1) % 3
      this.gotoPage(1)
    }
  
  }
}
  </script>

<style scoped>
.active {
  background: #bdbdbd;
}
.hide {
  display: none;
}
.undisable {
  pointer-events: none;
}
.show {
  display: contents;
}
</style>