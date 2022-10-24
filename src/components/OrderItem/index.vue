<script lang="tsx">
import {defineComponent, PropType} from 'vue';
import {Card} from 'vant';
import {OrderRes} from '@/Apis/order';
import {handleImg} from '@/utils';

export default defineComponent({
  name: 'OrderItem',
  props: {
    data: {
      type: Object as PropType<OrderRes>,
      default: {},
    },
  },
  emits: ['click'],
  setup(props, context){
    const {data} = props;
    const goodsList = data.newBeeMallOrderItemVOS || [];

    //点击订单
    const onClick = (e: any) => {
      context.emit('click', e);
    }

    return () => {
      return (
        <div class="order-item" onClick={onClick}>
          <div class="order-item-top">
            <div>订单时间:{data.createTime}</div>
            <div>{data.orderStatusString}</div>
          </div>
          {
            goodsList.map(goods => {
              return <Card
                title={goods.goodsName}
                thumb={handleImg(goods.goodsCoverImg)}
                num={goods.goodsCount}
                price={goods.sellingPrice}
              />;
            })
          }
        </div>
      );
    }
  },
});
</script>

<style lang="less" scoped>
.order-item {
  margin-top: 30px;
  &:first-child {
    margin-top: 10px;
  }
}
.order-item-top {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 12px;
  color: #646566;
}
/deep/ .van-card {
  margin-top: 0;
  background-color: white;
}
</style>
