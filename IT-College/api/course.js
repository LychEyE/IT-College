import request from '@/utils/request'

export default {
    getList(current, limit, courseQuery) {
        return request({
            url: `/eduservice/course/getCourseList/${current}/${limit}`,
            method: 'post',
            data: courseQuery
        })
    },

    getAllSubject() {
        return request({
            url: '/eduservice/subject/getAllSubject',
            method: 'get'
        })
    },

    getCourseInfo(courseId) {
        return request({
            url: `/eduservice/course/${courseId}`,
            method: 'get'
        })
    }
}