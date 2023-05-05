<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <div class="ccInfo">
      <img :src="info.cover" />
      <div class="main">
        <h2>{{ info.title }}</h2>
        <p class="gray">
          <span>共{{ info.lessonNum }}课时</span>
        </p>
        <p>
          <span
            >所属分类：{{ info.subjectName }} —
            {{ info.subjectParentName }}</span
          >
        </p>
        <p>课程讲师：{{ info.teacherName }}</p>
        <h3 class="red">￥{{ info.price }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['info'],
  data() {
    return {

    }
  },
  methods: {

  },

}
</script>

<style scoped>
.ccInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
}
.ccInfo img {
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;
    float: left;
    border: none;
}
.ccInfo .main {
    margin-left: 520px;
}

.ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
}
.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}

.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
}
</style>