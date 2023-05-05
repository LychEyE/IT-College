<template>
    <div class="guli-player">
      <div class="head">
        <a href="/" title="在线教育">
          <img class="logo" src="~/assets/img/logo.png" lt="在线教育">
      </a></div>
      <div class="body">
        <div class="content"><nuxt/></div>
      </div>
    </div>
  </template>
  <script>
  export default {}
  </script>
  
  <style>
  html,body{
    height:100%;
  }
  </style>
  
  <style scoped>
  .head {
    height: 50px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  
  .head .logo{
    height: 50px;
    margin-left: 50px;
    margin-top: 20px;
  }
  
  .body {
    position: absolute;
    top: 100px;
    left: 10%;
    right: 10%;
    bottom: 0;
    overflow: hidden;
  }
  </style>