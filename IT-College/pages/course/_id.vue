<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- /课程详情 开始 -->
    <section class="container">
      <section class="path-wrap txtOf hLh30">
        <a href="/" title class="c-999 fsize14">首页</a>
        \
        <a href="/course" title class="c-999 fsize14">{{
          course.subjectLevelOne
        }}</a>
        \
        <span class="c-333 fsize14">{{ course.subjectLevelTwo }}</span>
      </section>
      <div>
        <article class="c-v-pic-wrap" style="height: 375px">
          <section class="p-h-video-box" id="videoPlay">
            <img
              :src="course.cover"
              :alt="course.title"
              class="dis c-v-pic"
              style="height: 100%"
            />
          </section>
        </article>
        <aside class="c-attr-wrap">
          <section class="ml20 mr15">
            <h2 class="hLh30 txtOf mt15">
              <span class="c-fff fsize24">{{ course.title }}</span>
            </h2>
            <section class="c-attr-jg" v-if="course.price===0">
              <span class="c-yellow">免费</span>
            </section>
            <section class="c-attr-jg" v-else>
              <span class="c-fff">价格：</span>
              <b class="c-yellow" style="font-size: 24px"
                >￥{{ course.price }}</b
              >
            </section>
            <section class="c-attr-mt c-attr-undis">
              <span class="c-fff fsize14"
                >主讲： {{ course.teacherName }}&nbsp;&nbsp;&nbsp;</span
              >
            </section>
            <section class="c-attr-mt of">
              <span class="ml10 vam">
                <div v-if="isCollect">
                  <em class="icon18 sc-end"></em>
                  <a
                    class="c-fff vam"
                    title="取消收藏"
                    href="#"
                    @click="removeCollect"
                    >已收藏</a
                  >
                </div>
                <div v-else>
                  <em class="icon18 scIcon"></em>
                  <a class="c-fff vam" title="收藏" href="#" @click="addCollect"
                    >收藏</a
                  >
                </div>
              </span>
            </section>
            <section class="c-attr-mt" v-if="isBuy || course.price === 0">
              <a href="#" title="立即观看" class="comm-btn c-btn-3">立即观看</a>
            </section>
            <section class="c-attr-mt" v-else>
              <a
                @click="createOrders()"
                href="#"
                title="立即购买"
                class="comm-btn c-btn-3"
                >立即购买</a
              >
            </section>
          </section>
        </aside>
        <aside class="thr-attr-box">
          <ol class="thr-attr-ol">
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">购买数</span>
                <br />
                <h6 class="c-fff f-fM mt10">{{ course.buyCount }}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">课时数</span>
                <br />
                <h6 class="c-fff f-fM mt10">{{ course.lessonNum }}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">浏览数</span>
                <br />
                <h6 class="c-fff f-fM mt10">{{ course.viewCount }}</h6>
              </aside>
            </li>
          </ol>
        </aside>
        <div class="clear"></div>
      </div>
      <!-- /课程封面介绍 -->
      <div class="mt20 c-infor-box">
        <article class="fl col-7">
          <section class="mr30">
            <div class="i-box">
              <div>
                <section id="c-i-tabTitle" class="c-infor-tabTitle c-tab-title">
                  <a name="c-i" class="current" title="课程详情">课程详情</a>
                </section>
              </div>
              <article class="ml10 mr10 pt20">
                <div>
                  <h6 class="c-i-content c-infor-title">
                    <span>课程介绍</span>
                  </h6>
                  <div class="course-txt-body-wrap">
                    <section class="course-txt-body">
                      <p v-html="course.description"></p>
                    </section>
                  </div>
                </div>
                <!-- /课程介绍 -->
                <div class="mt50">
                  <h6 class="c-g-content c-infor-title">
                    <span>课程大纲</span>
                  </h6>
                  <section class="mt20">
                    <div class="lh-menu-wrap">
                      <menu id="lh-menu" class="lh-menu mt10 mr10">
                        <ul>
                          <!-- 文件目录 -->
                          <li
                            class="lh-menu-stair"
                            v-for="(item, index) in chapter"
                            :key="index"
                          >
                            <a
                              href="javascript: void(0)"
                              :title="item.title"
                              class="current-1"
                            >
                              <em class="lh-menu-i-1 icon18 mr10"></em
                              >{{
                                "第" + Number(index + 1) + "章：" + item.title
                              }}
                            </a>
                            <ol class="lh-menu-ol" style="display: block">
                              <li
                                class="lh-menu-second ml30"
                                v-for="(v, index) in item.children"
                                :key="index"
                              >
                                <!-- <a
                                  :href="'/video/' + v.videoSourceId"
                                  :title="v.title"
                                  target="_blank"
                                > -->
                                <a
                                  href="#"
                                  @click="gotoWatch(v)"
                                  :title="v.title"
                                >
                                  <span class="fr" v-if="v.isFree == 1">
                                    <i class="free-icon vam mr10">免费试听</i>
                                  </span>
                                  <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em
                                  >{{
                                    "第" + Number(index + 1) + "节：" + v.title
                                  }}
                                </a>
                              </li>
                            </ol>
                          </li>
                        </ul>
                      </menu>
                    </div>
                  </section>
                </div>
                <!-- /课程大纲 -->
                <!-- 评论 -->
                <div>
                  <div
                    v-clickoutside="hideReplyBtn"
                    @click="inputFocus"
                    class="my-reply"
                  >
                    <el-avatar
                      class="header-img"
                      :size="40"
                      :src="userAvatar"
                    ></el-avatar>
                    <div class="reply-info">
                      <div
                        tabindex="0"
                        contenteditable="true"
                        id="replyInput"
                        spellcheck="false"
                        placeholder="输入评论..."
                        class="reply-input"
                        @focus="showReplyBtn"
                        @input="onDivInput($event)"
                      ></div>
                    </div>
                    <div class="reply-btn-box" v-show="btnShow">
                      <el-button
                        class="reply-btn"
                        size="medium"
                        @click="sendComment"
                        type="primary"
                      >
                        发表评论
                      </el-button>
                    </div>
                  </div>
                  <div v-if="comments.length">
                    <div
                      v-for="(item, i) in comments"
                      :key="i"
                      class="author-title reply-father"
                    >
                      <el-avatar
                        class="header-img"
                        :size="40"
                        :src="item.avatar"
                      ></el-avatar>
                      <div class="author-info">
                        <span class="author-name">{{ item.name }}</span>
                        <span class="author-time">{{ item.time }}</span>
                      </div>
                      <div class="icon-btn">
                        <span
                          v-if="item.memberId != myId"
                          @click="showReplyInput(i, j, item)"
                        >
                          <i class="iconfont el-icon-s-comment"></i>
                          {{ item.commentNum }}
                        </span>
                        <span v-else>
                          <i
                            class="iconfont el-icon-s-comment"
                            @click="noReply()"
                          ></i>
                          {{ item.commentNum }}
                        </span>
                        <span
                          class="xin"
                          @click="countlikeNumber('comment', i, 0, item.id)"
                        >
                          <i
                            class="el-icon-star-on"
                            v-if="item.likeListId.indexOf(myId) != -1"
                          >
                          </i>
                          <i class="el-icon-star-off" v-else></i
                          >{{ item.likeCount }}
                        </span>
                        <span
                          class="el-icon-delete"
                          v-if="item.memberId == myId"
                          @click="deleteCommentById(item)"
                        ></span>
                      </div>
                      <div class="talk-box">
                        <p>
                          <span class="reply">{{ item.content }}</span>
                        </p>
                      </div>
                      <!-- 回复开始 -->
                      <div class="reply-box">
                        <div
                          v-for="(reply, j) in item.reply"
                          :key="j"
                          class="author-title"
                        >
                          <el-avatar
                            class="header-img"
                            :size="40"
                            :src="reply.avatar"
                          ></el-avatar>
                          <div class="author-info">
                            <span class="author-name">{{ reply.name }}</span>
                            <span class="author-time">{{ reply.time }}</span>
                          </div>
                          <div class="icon-btn">
                            <span
                              @click="showReplyInput(i, j, reply)"
                              v-if="reply.memberId != myId"
                            >
                              <i class="iconfont el-icon-s-comment"></i>
                              {{ reply.commentNum }}
                            </span>
                            <span v-else>
                              <i
                                class="iconfont el-icon-s-comment"
                                @click="noReply()"
                              ></i>
                              {{ reply.commentNum }}
                            </span>

                            <span
                              @click="countlikeNumber('reply', i, j, reply.id)"
                            >
                              <i
                                class="el-icon-star-on"
                                v-if="reply.likeListId.indexOf(myId) != -1"
                              >
                              </i>
                              <i class="el-icon-star-off" v-else></i
                              >{{ reply.likeCount }}
                            </span>
                            <span
                              class="el-icon-delete"
                              v-if="reply.memberId == myId"
                              @click="deleteCommentById(reply)"
                            ></span>
                          </div>
                          <div class="talk-box">
                            <p>
                              <b style="color: red"
                                >回复 {{ reply.fromName }}:</b
                              >
                              <span class="reply">{{ reply.content }}</span>
                            </p>
                          </div>
                          <div class="reply-box"></div>
                        </div>
                      </div>
                      <!-- 回复结束 -->
                      <div
                        v-show="_inputShow(i)"
                        class="my-reply my-comment-reply"
                      >
                        <el-avatar
                          class="header-img"
                          :size="40"
                          :src="userAvatar"
                        ></el-avatar>
                        <div class="reply-info">
                          <div
                            tabindex="0"
                            contenteditable="true"
                            spellcheck="false"
                            :placeholder="replyMessage"
                            @input="onDivInput($event)"
                            class="reply-input reply-comment-input"
                          ></div>
                        </div>
                        <div class="reply-btn-box">
                          <el-button
                            class="reply-btn"
                            size="medium"
                            @click="sendCommentReply(i)"
                            type="primary"
                          >
                            发表回复
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </article>
        <aside class="fl col-3">
          <div class="i-box">
            <div>
              <section class="c-infor-tabTitle c-tab-title">
                <a title href="javascript:void(0)">主讲讲师</a>
              </section>
              <section class="stud-act-list">
                <ul style="height: auto">
                  <li>
                    <div class="u-face">
                      <a :href="'/teacher/' + course.teacherId">
                        <img :src="course.avatar" width="50" height="50" alt />
                      </a>
                    </div>
                    <section class="hLh30 txtOf">
                      <a class="c-333 fsize16 fl" href="#">{{
                        course.teacherName
                      }}</a>
                    </section>
                    <section class="hLh20 txtOf">
                      <span class="c-999">{{ course.intro }}</span>
                    </section>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </aside>
        <div class="clear"></div>
      </div>
    </section>
    <!-- /课程详情 结束 -->
    <!-- <iframe src="http://localhost:3000/" frameborder="0"></iframe> -->
  </div>
</template>
  
  <script>
import course from '@/api/course'
import commentApi from "@/api/comment"
import cookie from "js-cookie"
import order from '@/api/order'
import collect from '@/api/collect'

const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.vueClickOutside = documentHandler;
    document.addEventListener("click", documentHandler);
  },
  update() { },
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener("click", el.vueClickOutside);
    delete el.vueClickOutside;
  },
};

Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};

export default {
  created() {
    // 将用户数据从本地cookie获取到
    this.getUserInfo();
    // 获取评论数据
    this.initCommentList(this.courseId);
    this.initCourseInfo()
  },

  asyncData({ isDev, route, store, env, params, query, req, res, redirect, error }) {
    return {
      courseId: params.id
    }
  },
  mounted() { },

  data() {
    return {
      course: {
        id: "",
      },
      chapter: [],
      isBuy: false,
      isCollect: false,
      btnShow: false,
      index: "0",
      replyComment: "",
      subIndex: "0",
      userName: "", // 当前用户name
      userAvatar: "", // 当前用户头像
      myId: null, // 当前用户id
      replyMessage: "",
      comments: [],
      current: {}, // 当前被点击的评论对象 
    };
  },
  methods: {
    //查询课程的详情信息
    initCourseInfo() {
      course.getCourseInfo(this.courseId).then(res => {
        this.course = res.data.data.course
        this.chapter = res.data.data.chapter
        this.isBuy = res.data.data.buyCourse
        this.isCollect = res.data.data.isCollect
      })
    },

    createOrders() {
      if (this.userIsLogin() == "no") return;
      order.createOrders(this.courseId).then(res => {
        this.$router.push({ path: '/orders/' + res.data.data.orderNo })
      })
    },

    // 将cookie的用户信息提取出来
    getUserInfo() {
      let user = cookie.get("IT_user");
      if (user) {
        let userInfo = JSON.parse(user);
        this.userName = userInfo.nickname;
        this.userAvatar = userInfo.avatar;
        this.myId = userInfo.id;
      }
    },
    addCollect() {
      // 判断用户是否登录
      if (this.userIsLogin() == "no") return;
      collect.addCollect(this.courseId).then(res => {
        this.isCollect = res.data.data.isCollect
        this.$message({
          type: 'success',
          message: '收藏课程成功'
        });

      })
    },
    removeCollect() {
      collect.removeCollect(this.courseId).then(res => {
        this.isCollect = res.data.data.isCollect
        this.$message({
          type: 'success',
          message: '取消收藏成功'
        });
      })
    },

    gotoWatch(val) {
      if (val.isFree==1||this.isBuy || this.course.price === 0) {
        let routeData = this.$router.resolve({ path: '/video/' + val.videoSourceId, });
        window.open(routeData.href, '_blank');
      }else{
        this.$confirm('该视频需要购买才能观看', '温馨提示', {
          confirmButtonText: '好的',
          type: 'warning'
        })
      }
    },

    // 获取评论数据
    initCommentList(courseId) {
      commentApi.getCommentList(courseId).then((response) => {
        // 先将获取到的数据进行转换
        let commentList = response.data.data.commentList;
        console.log(commentList);
        for (let i = 0; i < commentList.length; i++) {
          // 先将父级评论转化likeListId为数组
          commentList[i].likeListId = commentList[i].likeListId.split(",");
          // 找到子级评论将likeListId为数组
          for (let j = 0; j < commentList[i].reply.length; j++) {
            commentList[i].reply[j].likeListId =
              commentList[i].reply[j].likeListId.split(",");
          }
        }
        this.comments = commentList;
        console.log('commentList=' + this.comments);
      });
    },
    // 验证用户是否登录
    userIsLogin() {
      let user = cookie.get("IT_user");
      if (user == null) {
        this.$confirm('该操作需要先登录，是否现在跳转到登录页面?', '温馨提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.$router.push({ path: "/login" });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已经为您取消跳转到登录页面'
          });
        });
        return "no"
      }
      return "yes"
    },
    /**
     * 传递一个对象过来，将其深拷贝，不会在共用同一个引用
     * targetObj:需要拷贝的对象
     * 
     */
    copyObject(targetObj, type) {

      let comment = { ...targetObj }
      // 装换为以,号分割的字符串 [因为后台采用的是String进行存储]
      comment.likeListId = comment.likeListId.join(",")
      // 删除掉该属性，不然后台接收会报错
      delete comment.reply
      return comment;


    },
    // 输入框被点击是触发
    inputFocus() {
      var replyInput = document.getElementById("replyInput");
      replyInput.style.padding = "8px 8px";
      replyInput.style.border = "2px solid blue";
      replyInput.focus();
    },
    // 显示回复按钮
    showReplyBtn() {
      this.btnShow = true;
    },
    // 提示不能给自己回复
    noReply() {
      this.$message({
        message: "对不起!暂不支持自己给自己回复",
        type: "warning",
      });
    },
    // 隐藏回复按钮
    hideReplyBtn() {
      this.btnShow = false;
      replyInput.style.padding = "10px";
      replyInput.style.border = "none";
    },
    /**
     * 显示输入框[评论和回复共用]
     * i：顶级评论下标
     * j：子级评论下标
     * current:当前被点击的评论记录
     *
     */
    showReplyInput(i, j, current) {
      this.current = current
      if (current.fatherId === "-1") {
        this.parentId = current.id;
      } else {
        this.parentId = current.fatherId;
      }
      this.replyMessage = "回复:" + current.name;
      this.comments[this.index].inputShow = false;
      this.index = i;
      this.comments[i].inputShow = true;
      this.toName = current.name;
      this.toId = current.id;
      this.subIndex = j == "0" ? "0" : j;
    },
    /**
     * 根据id删除评论(前提是该评论是当前用户所评论的)
     */
    deleteCommentById(current) {
      let comment = this.copyObject(current)
      console.log("current=", current)
      commentApi.deleteCommentById(comment).then((response) => {
        if (response.data.success) {
          this.$message({
            showClose: true,
            type: "success",
            message: "删除成功",
          });
        }
        // 重新获取获取评论数据
        this.initCommentList(this.courseId);


      });
    },

    /**
     *
     * 统计点赞数量
     * type：是回复还是评论
     * i:一级评论
     * j:二级评论
     */
    countlikeNumber(type, i, j, id) {
      // 判断用户是否登录
      if (this.userIsLogin() == "no") return;

      const commentObje = type == "comment" ? this.comments[i] : this.comments[i].reply[j];
      let list = commentObje.likeListId;

      if (list.length === 0 || list.indexOf(this.myId) == -1) {
        //在已经点赞的列表中未找到userId
        commentObje.isLike = true;
        commentObje.likeCount += 1;
        commentObje.likeListId.push(this.myId);

        // 将对象复制一份并且去除掉reply属性,避免后台接收数据出现异常
        let comment = this.copyObject(commentObje)
        // 发送请求到后台修改点赞数量
        commentApi.updateLikeCount(comment).then(response => {

          // 重新获取获取评论数据
          if (response.data.success)
            this.$message({
              type: "success",
              message: "点赞成功"
            })
          this.initCommentList(this.courseId);
        })
        console.log("点赞+1", commentObje.like, commentObje.likeListId);
      } else {
        const index = list.indexOf(this.myId);
        commentObje.isLike = false;
        commentObje.likeCount -= 1;
        commentObje.likeListId.splice(index, 1);
        console.log("点赞-1", commentObje.likeListId);

        let comment = this.copyObject(commentObje)

        // 发送请求到后台修改点赞数量
        commentApi.updateLikeCount(comment).then(response => {

          // 重新获取获取评论数据
          this.initCommentList(this.courseId);
          if (response.data.success)
            this.$message({
              type: "success",
              message: "取消点赞成功"
            })

        })
      }

      console.log("commentObje=", commentObje);

    },
    // 是否显示输入框
    _inputShow(i) {
      return this.comments[i].inputShow;
    },
    // 发送评论
    sendComment() {

      if (this.userIsLogin() == "no") return;

      if (!this.replyComment) {
        this.$message({
          type: "warning",
          message: "评论不能为空",
        });
      } else {
        // 评论内容对象
        let object = {};
        let input = document.getElementById("replyInput");
        object.courseId = this.courseId;
        object.name = this.userName;
        object.content = this.replyComment;
        object.avatar = this.userAvatar;
        object.commentNum = 0;
        object.likeCount = 0;
        object.fromId = "-1"
        object.memberId = this.myId;
        object.isLike = false;
        object.likeListId = "0,0";
        object.parentId = "-1";
        object.time = new Date().format("yyyy-MM-dd hh:mm:ss");
        this.replyComment = "";
        input.innerHTML = "";
        commentApi.addComment(object, this.current).then((response) => {

          // 重新获取获取评论数据
          this.initCommentList(this.courseId);
          if (response.data.success)
            this.$message({
              type: "success",
              message: "评论成功",
            });
          console.log('评论成功');

        });
      }
    },
    // 发送回复
    sendCommentReply(i) {
      if (this.userIsLogin() == "no") return;
      if (!this.replyComment) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "回复不能为空",
        });
      } else {
        // 回复内容对象
        let current = {};
        if (this.current.parentId == "-1") {
          current.parentId = this.current.id
        } else {
          current.parentId = this.current.parentId
        }
        current.courseId = this.courseId;
        current.name = this.userName;
        current.memberId = this.myId;
        current.content = this.replyComment;
        current.avatar = this.userAvatar;
        current.commentNum = 0;
        current.likeCount = 0;
        current.isLike = false;
        current.likeListId = "0,0";
        current.fromName = this.current.name;
        current.fromId = this.current.id;
        current.time = new Date().format("yyyy-MM-dd hh:mm:ss");

        // 得到当前被点击的评论对象，修改他的回复条数
        this.current.commentNum += 1
        let parent = { ...this.current }
        parent.likeListId = parent.likeListId.join(",")
        delete parent.reply  // 删除掉该属性，不然后台接收会报错[后台采用的是String进行存储]
        console.log("current=", current)
        console.log("parent=", parent)
        commentApi.addComment(current, parent).then((response) => {

          // 重新获取获取评论数据
          this.initCommentList(this.courseId);
          if (response.data.success)
            this.$message({
              showClose: true,
              type: "success",
              message: "回复成功",
            });

        });

        // 清空输入框内容
        this.replyComment = "";
        document.getElementsByClassName("reply-comment-input")[i].innerHTML = "";
      }
    },
    onDivInput: function (e) {
      this.replyComment = e.target.innerHTML;
    },


  },


};
  </script>

<style scoped>
.my-reply {
  padding: 10px;
  background-color: #fafbfc;
}
.my-reply .header-img {
  display: inline-block;
  vertical-align: top;
}
.my-reply .reply-info {
  display: inline-block;
  margin-left: 5px;
  width: 75%;
}
@media screen and (max-width: 1200px) {
  .my-reply .reply-info {
    width: 80%;
  }
}
.my-reply .reply-info .reply-input {
  min-height: 20px;
  line-height: 22px;
  padding: 10px 10px;
  color: #ccc;
  background-color: #fff;
  border-radius: 5px;
}
.my-reply .reply-info .reply-input:empty:before {
  content: attr(placeholder);
}
.my-reply .reply-info .reply-input:focus:before {
  content: none;
}
.my-reply .reply-info .reply-input:focus {
  padding: 8px 8px;
  border: 2px solid blue;
  box-shadow: none;
  outline: none;
}
.my-reply .reply-btn-box {
  height: 25px;
  display: inline-block;
}
.my-reply .reply-btn-box .reply-btn {
  position: relative;
  float: right;
  margin-left: 15px;
}
.my-comment-reply {
  margin-left: 50px;
}
.my-comment-reply .reply-input {
  width: flex;
}
.author-title:not(:last-child) {
  border-bottom: 1px solid rgba(74, 136, 199, 0.3);
}
.reply-father {
  padding: 10px;
}
.reply-father .header-img {
  display: inline-block;
  vertical-align: top;
}
.reply-father .author-info {
  display: inline-block;
  margin-left: 5px;
  width: 60%;
  height: 40px;
  line-height: 20px;
}
.reply-father .author-info span {
  display: block;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.reply-father .author-info .author-name {
  color: #000;
  font-size: 18px;
  font-weight: bold;
}
.reply-father .author-info .author-time {
  font-size: 14px;
}
.reply-father .author-info .author-count {
  font-size: 15px;
  color: blue;
}
.reply-father .icon-btn {
  width: 30%;
  padding: 0 !important ;
  float: right;
}
@media screen and (max-width: 1200px) {
  .reply-father .icon-btn {
    width: 20%;
    padding: 7px;
  }
}
.reply-father .icon-btn span {
  cursor: pointer;
}
.reply-father .icon-btn .iconfont {
  margin: 0 5px;
}
.reply-father .talk-box {
  margin: 0 50px;
}
.reply-father .talk-box p {
  margin: 0;
}
.reply-father .talk-box .reply {
  font-size: 16px;
  color: #000;
}
.reply-father .reply-box {
  margin: 10px 0 0 50px;
  background-color: #efefef;
}
</style>