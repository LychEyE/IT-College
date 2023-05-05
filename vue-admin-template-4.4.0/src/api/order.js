import request from '@/utils/request'


export default {
    getPayOrder(current,limit,orderQuery) {
        return request({
          url: `/orderservice/order/getPayOrder/${current}/${limit}/1`,
          method: 'post',
          data: orderQuery
        })
    },
    getNotPayOrder(current,limit,orderQuery) {
        return request({
          url: `/orderservice/order/getPayOrder/${current}/${limit}/0`,
          method: 'post',
          data: orderQuery
        })
    },
    cancelOrder(orderNo){
        return request({
            url: `/orderservice/order/cancelOrder/${orderNo}`,
            method: 'put',
          })
    }
  }