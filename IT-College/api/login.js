
import request from '@/utils/request'
export default {
  //登录
  submitLogin(user) {
    return request({
      url: `/userservice/user/login`,
      method: 'post',
      data: user
    })
  },
  //根据token获取用户信息
  getLoginInfo() {
    return request({
      url: `/userservice/user/getUserInfo`,
      method: 'get',
     // headers: {'token': cookie.get('guli_token')}
    })
    //headers: {'token': cookie.get('guli_token')} 
  }
}