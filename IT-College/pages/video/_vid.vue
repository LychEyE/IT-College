<template>
  <div>
    <!-- 阿里云视频播放器样式 -->
    <link
      rel="stylesheet"
      href="https://g.alicdn.com/de/prismplayer/2.15.2/skins/default/aliplayer-min.css"
    />
    <!-- 阿里云视频播放器脚本 -->

    <component
      :is="'script'"
      charset="utf-8"
      type="text/javascript"
      src="https://g.alicdn.com/de/prismplayer/2.15.2/aliplayer-min.js"
    >
    </component>
    <component
  
      :is="'script'"
      charset="utf-8"
      src="https://player.alicdn.com/aliplayer/presentation/js/aliplayercomponents.min.js"
    >
    </component>

    <!-- 定义播放器dom -->
    <div id="J_prismPlayer" class="prism-player" />

  </div>
</template>

<script>
import vod from '@/api/vod'

export default {
  layout: 'video',
  asyncData({ isDev, route, store, env, params, query, req, res, redirect, error }) {
    return vod.getPlayAuth(params.vid).then(res => {
      return {
        playAuth: res.data.data.playAuth,
        vid: params.vid
      }
    })
  },
  data() {
    return {
      danmu:{},
      danmukuList: [{
        "mode": 1,
        "text": "test",
        "stime": 1000,
        "size": 25,
        "color": 0xffffff
      }]
    }
  },
  mounted() {
    
    new Aliplayer({
      id: 'J_prismPlayer',
      // source: "https://player.alicdn.com/file/official-video/aliyun-sample.m3u8",
      vid: this.vid, // 视频id
      playauth: this.playAuth, // 播放凭证
      encryptType: '1', // 如果播放加密视频，则需设置encryptType=1，非加密视频无需设置此项
      width: '100%',
      height: '700px',
      autoplay: false,
      //   cover: 'http://guli.shop/photo/banner/1525939573202.jpg', // 封面
      qualitySort: 'asc', // 清晰度排序
      mediaType: 'video', // 返回音频还是视频
      autoplay: false, // 自动播放
      isLive: false, // 直播
      rePlay: false, // 循环播放
      preload: true,
      controlBarVisibility: 'hover', // 控制条的显示方式：鼠标悬停
      useH5Prism: true, // 播放器类型：html5

      components: [{
        name: 'AliplayerDanmuComponent',
        type: AliPlayerComponent.AliplayerDanmuComponent,
        args: [this.danmukuList]
      }]
    }, function (player) {
      // this.$player=player.getComponent('AliplayerDanmuComponent')
      // console.log(player.getComponent('AliplayerDanmuComponent'))
      console.log('播放器创建成功')
    })
    // var dom = document.querySelector('.danmu-input-enter')
    
    // dom.addEventListener('click',this.createDanmu)
  },
  methods: {
  },
}
</script>