import request from '@/utils/request'

export default{
    getBlogList(current,limit){
        return request({
            url: `/blogservice/blog/getBlogList/${current}/${limit}`,
            method: 'get'
        })
    },
    getBlog(id){
        return request({
            url: `/blogservice/blog/getBlog/${id}`,
            method: 'get'
        })
    },
    addBlog(blog){
        return request({
            url: `/blogservice/blog/addBlog`,
            method: 'post',
            data: blog
        })
    },
    getMyBlog(){
        return request({
            url: `/blogservice/blog/getMyBlogs`,
            method: 'get',
        })
    }
}