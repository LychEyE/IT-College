import request from '@/utils/request'

export default{
    createOrders(courseId){
        return request({
            url: `/orderservice/order/createOrder/${courseId}`,
            method: 'get'
        })
    },
    getOrderInfo(orderNo){
        return request({
            url: `/orderservice/order/getOrderInfo/${orderNo}`,
            method: 'get'
        })
    },
    gotoPay(orderNo){
        return request({
            url: `/orderservice/pay-log/createNative/${orderNo}`,
            method: 'get'
        })
    },
    getMyOrder(){
        return request({
            url:'/orderservice/order/getMyOrder',
            method:'get'
        })
    },
    cancelOrder(orderNo){
        return request({
            url:`/orderservice/order/cancelOrder/${orderNo}`,
            method:'put'
        })
    }

}