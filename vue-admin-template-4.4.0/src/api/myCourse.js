import request from '@/utils/request'

export default {
    getMyCourseListPage(current, limit, courseQuery) {
        return request({
            url: `/eduservice/course/pageMyCourseCondition/${current}/${limit}`,
            method: 'post',
            data: courseQuery,
        })
    },
    addMyCourseInfo(param) {
        return request({
            url: `/eduservice/course/addMyCourseInfo`,
            method: 'post',
            data: param
        })
    },
    getDescriptionById(courseId) {
        return request({
            url: `/eduservice/course/description/${courseId}`,
            method: 'get'
        })
    },
    updateCourseInfo(courseInfo) {
        return request({
            url: '/eduservice/course/updateCourseInfo',
            method: 'put',
            data: courseInfo
        })
    },
    deleteCourse(id){
        return request({
            url: `/eduservice/course/${id}`,
            method: 'delete'
        })
    }
}