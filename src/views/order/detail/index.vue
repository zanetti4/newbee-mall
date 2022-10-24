<script lang="tsx">
import {ref, computed, onBeforeMount} from 'vue';
import {Button, Popup, Toast, Dialog, Card} from 'vant';
import {useRoute} from 'vue-router';
import Navbar from '@/components/Navbar';
import {OrderRes, getOrderDetailApi, payOrderApi, cancelOrderApi} from '@/Apis/order';
import {handleImg} from '@/utils';

export default {
  name: 'OrderDetail',
  setup(){
    const route = useRoute();
    const orderData = ref<OrderRes>({} as OrderRes);
    const payPopupVisible = ref(false);

    const orderNo = computed(() => {
      return String(route.query.orderNo);
    });

    //获取订单详情
    const fetchOrderDetail = async () => {
      const toast = Toast.loading('加载中……');

      try {
        const res = await getOrderDetailApi(orderNo.value);

        orderData.value = res.data || {}
      } catch(err){
        console.error('获取订单详情失败', err);
      } finally {
        toast.clear();
      }
    }

    //去支付
    const openPayPopup = () => {
      payPopupVisible.value = true;
    }

    //支付
    const payOrder = async () => {
      Toast.loading('支付中……');

      try {
        await payOrderApi({
          orderNo: orderNo.value,
          payType: 1,
        });

        Toast.success('支付成功');
        orderData.value.orderStatus = 1;
        payPopupVisible.value = false;
        fetchOrderDetail();
      } catch(err){
        console.error('支付失败', err);
      }
    }

    //取消订单
    const cancelOrder = async () => {
      const toast = Toast.loading('取消中……');

      try {
        await cancelOrderApi(orderNo.value);
        orderData.value.orderStatus = -1;
        fetchOrderDetail();
      } catch(err){
        console.error('取消订单失败', err);
      } finally {
        toast.clear();
      }
    }

    //点击取消订单
    const onCancelOrder = () => {
      Dialog.confirm({
        title: '确定取消订单？',
      }).then(() => {
        cancelOrder();
      });
    }

    onBeforeMount(() => {
      fetchOrderDetail();
    });

    return () => {
      const {orderStatusString, orderNo, createTime, orderStatus, totalPrice, newBeeMallOrderItemVOS} = orderData.value;
      const goodsList = newBeeMallOrderItemVOS || [];
      let Action: any

      if(orderStatus === 0){
        //未支付
        Action = <>
          <Button
            block
            type="primary"
            onClick={openPayPopup}
          >去支付</Button>
          <Button
            block
            onClick={onCancelOrder}
          >取消订单</Button>
        </>;
      }else if(orderStatus === 1){
        //已支付
        Action = <>
          <Button
            block
            onClick={onCancelOrder}
          >取消订单</Button>
        </>;
      }

      return (
        <div class="order-detail">
          <Navbar
            title="订单详情"
            leftArrow
          ></Navbar>
          <div class="order-content">
            <p>
              订单状态:<b>{orderStatusString}</b>
            </p>
            <p>
              订单编号:<b>{orderNo}</b>
            </p>
            <p>
              下单时间:<b>{createTime}</b>
            </p>
            {Action}
          </div>
          <div class="order-content">
            <p>
              商品金额:￥{totalPrice}
            </p>
            <p>
              配送方式:普通快递
            </p>
          </div>
          {
            goodsList.map(good => {
              return (
                <Card
                  key={good.goodsId}
                  title={good.goodsName}
                  thumb={handleImg(good.goodsCoverImg)}
                  num={good.goodsCount}
                  price={good.sellingPrice}
                />
              );
            })
          }
          <Popup
            class="order-pay-popup"
            show={payPopupVisible.value}
            position="bottom"
            closeOnClickOverlay={false}
            closeable
            teleport="body"
            onUpdate:show={() => payPopupVisible.value = !payPopupVisible.value}
          >
            <Button
              block
              type="primary"
              onClick={payOrder}
            >支付宝支付</Button>
            <Button
              block
              type="success"
              onClick={payOrder}
            >微信支付</Button>
          </Popup>
        </div>
      );
    }
  },
}
</script>

<style lang="less">
.order-pay-popup {
  box-sizing: border-box;
  padding: 50px 10px 15px;
  border-radius: 6px;
  .van-button {
    margin-bottom: 5px;
  }
}
</style>

<style lang="less" scoped>
.order-detail {
  min-height: 100%;
  background-color: #F7F7F7;
}
.order-content {
  background-color: white;
  margin-bottom: 20px;
  padding: 15px;
  color: #999;
  line-height: 40px;
  font-size: 14px;
  b {
    color: #333;
    font-weight: 400;
  }
  /deep/ .van-button {
    margin-top: 10px;
  }
}
</style>
