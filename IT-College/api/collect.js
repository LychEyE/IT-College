import request from '@/utils/request'

export default{
    addCollect(courseId){
        return request({
            url: `/eduservice/collect/addCollect/${courseId}`,
            method: 'get'
        })
    },
    removeCollect(courseId){
        return request({
            url: `/eduservice/collect/removeCollect/${courseId}`,
            method: 'delete'
        })
    },
    getCollect(){
        return request({
            url: `/eduservice/collect/getCollect`,
            method: 'get'
        })
    }
}