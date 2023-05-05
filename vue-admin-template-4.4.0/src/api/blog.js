import request from '@/utils/request'


export default {
    getBlog(current, limit) {
        return request({
            url: `/blogservice/blog/getBlogList/${current}/${limit}`,
            method: 'get',
        })
    },
    getBlogById(id){
        return request({
            url: `/blogservice/blog/getBlog/${id}`,
            method: 'get',
        })
    },
    removeBlog(id) {
        return request({
            url: `/blogservice/blog/removeBlogById/${id}`,
            method: 'delete',
        })
    }
}