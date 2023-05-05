import request from '@/utils/request'

export default {

    //根据课程id获取章节和小节数据列表
    getChapterByCourseId(courseId) {
        return request({
            url: `/eduservice/chapter/getChapterList/${courseId}`,
            method: 'get',
        })
    },

    saveChapter(chapterList){
        return request({
            url: '/eduservice/chapter/saveChapterList',
            method: 'post',
            data: chapterList
        })
    },

    updateChapter(chapter){
        return request({
            url: '/eduservice/chapter/updateChapterById',
            method: 'put',
            data: chapter
        })
    },
    
    addChapter(chapter){
        return request({
            url: '/eduservice/chapter/addChapter',
            method: 'post',
            data: chapter
        })
    },

    updateSort(chapterList){
        return request({
            url: '/eduservice/chapter/updateSort',
            method: 'post',
            data: chapterList
        })
    },
    deleteById(id){
        return request({
            url: `/eduservice/chapter/deleteChapterById/${id}`,
            method: 'delete'
        })
    }

}