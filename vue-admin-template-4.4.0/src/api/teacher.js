import request from '@/utils/request'


export default {
    getMyInfo() {
        return request({
            url: '/eduservice/teacher/getMyInfo',
            method: 'get',
        })
    },
    updateMyInfo(teacher){
        return request({
            url: '/eduservice/teacher/updateMyInfo',
            method: 'post',
            data: teacher
        })

    }
    
}