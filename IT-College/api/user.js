import request from '@/utils/request'

export default {

  getMyInfo() {
    return request({
      url: `/userservice/user/getMyInfo`,
      method: 'get'
    })
  },
  updateAvatar(user){
    return request({
      url: `/userservice/user/updateAvatar`,
      method: 'put',
      data: user
    })
  },
  updateMyInfo(user){
    return request({
      url: `/userservice/user/updateMyInfo`,
      method: 'put',
      data: user
    })
  },
  updatePassword(password){
    return request({
      url: `/userservice/user/updatePassword`,
      method: 'put',
      data: password
    })
  }

}