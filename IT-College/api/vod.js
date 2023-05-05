import request from '@/utils/request'

export default {

  getPlayAuth(videoId) {
    return request({
      url: `/VOD/video/get-play-auth/${videoId}`,
      method: 'get'
    })
  }

}