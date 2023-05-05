import request from '@/utils/request'

export default{
    getList(current,limit){
        return request({
            url: `/eduservice/teacher/getTeacherList/${current}/${limit}`,
            method: 'post'
        })
    },
    getTeacherInfo(teacherId){
        return request({
            url: `/eduservice/teacher/getTeacherInfo/${teacherId}`,
            method: 'get'
        })
    }
}