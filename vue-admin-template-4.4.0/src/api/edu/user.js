import request from '@/utils/request'

export default {
  getDataSta() {
      return request({
        url: '/userservice/user/getLoginAndRegisterOneWeek',
        method: 'get'
      })
  },
  getUserSta() {
      return request({
        url: '/userservice/user/getNewUserList',
        method: 'get'
      })
  },
}


