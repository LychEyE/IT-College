import request from '@/utils/request'

export default {
    //获取小节
    getVideo(id) {
        return request({
            url: `/eduservice/video/getVideoInfo/${id}`,
            method: 'get'
        })
    },
    //更新小节的信息
    updateSubsection(video) {
        return request({
            url: '/eduservice/video/updateVideoInfo',
            method: 'put',
            data: video
        })
    },
    //添加小节
    addVideo(video) {
        return request({
            url: '/eduservice/video/addVideo',
            method: 'post',
            data: video
        })
    },
    //更新小节顺序
    updateSort(chapter){
        return request({
            url: '/eduservice/video/updateVideoSort',
            method: 'post',
            data: chapter
        })
    },

    //删除小节
    deleteById(id){
        return request({
            url: `/eduservice/video/deleteVideoById/${id}`,
            method: 'delete'
        })
    },
    //删除视频
    deleteAliVod(id){
        return request({
            url: `/VOD/video/removeAliVideo/${id}`,
            method: 'delete'
        })
    }

}