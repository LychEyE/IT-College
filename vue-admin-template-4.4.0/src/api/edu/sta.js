import request from '@/utils/request'

export default {
  getDataSta(searchObj) {
      return request({
        url: `/statisticsservice/statistics/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
        method: 'get'
      })
  },
  getAllSta(){
    return request({
      url: '/statisticsservice/statistics/getAllSta',
      method: 'get'
    })
  }
}
