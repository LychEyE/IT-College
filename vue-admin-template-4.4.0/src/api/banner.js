import request from '@/utils/request'


export default {
    getBanner(current, limit) {
        return request({
            url: `/cmsservice/bannerAdmin/${current}/${limit}`,
            method: 'get',
        })
    },
    addBanner(banner) {
        return request({
            url: `/cmsservice/bannerAdmin/`,
            method: 'post',
            data: banner
        })
    },
    updateBanner(banner) {
        return request({
            url: `/cmsservice/bannerAdmin/`,
            method: 'put',
            data: banner
        })
    },
    removeBanner(id) {
        return request({
            url: `/cmsservice/bannerAdmin/${id}`,
            method: 'delete',
        })
    }
}