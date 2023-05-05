import request from '@/utils/request'

export default {

    addCourseInfo(param) {
        return request({
            url: `/eduservice/course/addCourseInfo`,
            method: 'post',
            data: param
        })
    },

    getCourseListPage(current, limit, courseQuery) {
        return request({
            url: `/eduservice/course/pageCourseCondition/${current}/${limit}`,
            method: 'post',
            data: courseQuery,
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