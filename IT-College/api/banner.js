import request from '@/utils/request'

export default{
    getList(){
        return request({
            url: '/cmsservice/bannerFront/getAllBanner',
            method: 'get'
        })
    }
}