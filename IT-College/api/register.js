import request from '@/utils/request'

export default {
    //发送验证码
    sendCode(phone) {
        return request({
            url: `/SMS/send/${phone}`,
            method: 'get'
        })
    },
    //用户注册
    submitRegister(register) {
        return request({
            url: '/userservice/user/register',
            method: 'post',
            data: register
        })
    }
}