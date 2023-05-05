<template>
  <div class="Page Confirm">
    <div class="Title">
      <h1 class="fl f18">支付成功</h1>
      <div class="clear"></div>
    </div>
    <form name="flowForm" id="flowForm" method="post" action="">
      <table class="GoodList">
        <tbody>
          <tr>
            <th>订单号</th>
            <th>课程</th>
            <th>讲师</th>
            <th>购买人</th>
            <th>价格</th>
          </tr>
        </tbody>
        <tbody>
          <!-- <tr>
              <td colspan="3" class="Title red f18 fb"><p>限时折扣</p></td>
            </tr> -->
          <tr class="good">
            <td>
                <p>{{order.orderNo}}</p>
            </td>
            <td>
              <a target="_blank" href="#">
                <img :src="order.courseCover" height="40px" />
              </a>
              <!-- <div class="goodInfo">
                <input type="hidden" class="ids ids_14502" value="14502" />
                <a target="_blank" href="#">{{order.title}}</a>
              </div> -->
            </td>
            <td>
                <p>{{order.teacherName}}</p>
            </td>
            <td>
                <p>{{order.nickname}}</p>
            </td>
            <td class="price">
              <p>￥<strong>{{order.totalFee }}</strong></p>
              <!-- <span class="discName red">限时8折</span> -->
            </td>
          </tr>
          <tr>
            <td class="Billing tr" colspan="5">
              <div class="tr">
                <p>
                  共 <strong class="red">1</strong> 个课程，合计<span
                    class="red f20"
                    >￥<strong>{{order.totalFee }}</strong></span
                  >
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="Finish">
        <div class="fr" id="AgreeDiv">
          <label for="Agree"
            ><p class="on">
              
            </p></label
          >
        </div>
        <div class="clear"></div>
        <div class="Main fl">
          
          <div class="fr">
            <p>
              <strong class="red">支付成功</strong> 
              
            </p>
          </div>
        </div>
        <button class="fr redb" type="button" id="submitPay" @click="toStudy()">
          去学习
        </button>
        <div class="clear"></div>
      </div>
    </form>
    <div ref="alipayWap" v-html="alipay"></div>
  </div>
</template>
  
  <script>
import order from '@/api/order'
export default {
  //根据订单id获取订单信息
  asyncData({ params, error,query }) {
    return order.getOrderInfo(query.out_trade_no).then(response => {
      return {
        order: response.data.data.order
      }
    })
  },
  data() {
    return {
      alipay:''
    }
  },
  methods: {
    toStudy(){
      window.location.href = "/course/"+this.order.courseId;
    }

  }
}
  </script>