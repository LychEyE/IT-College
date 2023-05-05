<template>
    <div ref="alipayWap" v-html="alipay"></div>
</template>

<script>
import order from '@/api/order'
export default {
    asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
        return order.gotoPay(params.orderNo).then(res=>{
            return {
                alipay: res.data.data.pay
            }
            
        })
    },
    mounted() {
        this.$refs.alipayWap.children[0].submit()
    },
}
</script>