import request from '@/utils/request'

export default {
    //1、讲师列表(条件查询分页)
    getSubjectList() {
        return request({
            url: `/eduservice/subject/getAllSubject`,
            method: 'get',
        })
    },
    addFirstSubject(firstSubject){
        return request({
            url: `/eduservice/subject/addFirstSubject`,
            method: 'post',
            data: firstSubject
        })
    },
    addSecondSubject(subject){
        return request({
            url: `/eduservice/subject/addSecondSubject`,
            method: 'post',
            data: subject
        })
    },
    updateSubjectTitle(subject){
        return request({
            url: `/eduservice/subject/updateSubject`,
            method: 'put',
            data: subject
        })
    },
    deleteSubject(id){
        return request({
            url: `/eduservice/subject/removeSubject/${id}`,
            method: 'delete',
        })
    },
    getSubjectRank() {
        return request({
            url: `/eduservice/subject/getSubjectRankWithPercent`,
            method: 'get',
        })
    },
}