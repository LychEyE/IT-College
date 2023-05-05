import request from '@/utils/request'


export default {
    getComment(current, limit) {
        return request({
            url: `/eduservice/comment/getAllComment/${current}/${limit}`,
            method: 'get',
        })
    },
    removeCommentById(comment) {
        return request({
            url: `/eduservice/comment/deleteComment`,
            method: 'delete',
            data: comment
        })
    },
    getTeacherComment(current, limit) {
        return request({
            url: `/eduservice/comment/getTeacherComment/${current}/${limit}`,
            method: 'get',
        })
    },
}