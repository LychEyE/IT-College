<template>
  <div style="margin-top: 20px;">
    <el-row class="main" type="flex" justify="space-around">
      <el-col :span="16">
        <div id="artcle-info">
          <h2 style="text-align: center; font-size: large">
            <strong>{{blog.title}}</strong>
          </h2>
          <!-- 描述：文章信息 -->
          <div class="timeAndView" style="text-align: center; font-size: small">
            <span class="article-time">
              <i class="el-icon-time" />
              发表于：<span>{{blog.gmtCreate}}</span>
            </span>
            &nbsp;|&nbsp;
            <span class="article-views">
              <i class="el-icon-view" />
              阅读量：<span>{{blog.viewCount}}</span>
            </span>
          </div>
          <p class="abstract">
            前言：{{blog.introduction}}
          </p>
        </div>
        <hr />
        <div id="artcle-content">
          <div v-html="blog.content"></div>
        </div>
        <div id="statement">
          <div class="item">作者：{{blog.author}}</div>

          <div class="item">
            copyright：本博客所有文章除特别声明外,转载请注明出处!
          </div>
        </div>
      </el-col>
      <!-- <el-col id="side" :span="6" class="hidden-sm-and-down">
        <div class="item">
        </div>
        <div class="item">
        </div>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import blog from '@/api/blog'

export default {

    asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
        return blog.getBlog(params.id).then(res=>{
            return {
                blog: res.data.data.blog
            }
        })
    },
}

</script>


<style scoped>
#artcle-info {
  padding: 20px;
  /* background-image: url(../assets/vue.jpg); */
  background-color: cornflowerblue;
  margin-bottom: 40px;
}

#artcle-info .abstract {
  color: #ffffff;
  border-left: 3px solid #f56c6c;
  padding: 10px;
  background-color: rgba(126, 129, 135, 0.3);
}

#artcle-info .timeAndView {
  padding: 20px;
  line-height: 30px;
  font-size: 16px;
  color: #ffffff;
}

#statement {
  border-left: 3px solid #f56c6c;
  padding: 20px;
  background-color: #ebeef5;
  margin-bottom: 20px;
}
</style>