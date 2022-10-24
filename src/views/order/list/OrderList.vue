<script lang="tsx">
import {defineComponent, ref} from 'vue';
import {PullRefresh, List} from 'vant';
import {useRouter} from 'vue-router';
import {OrderRes, getOrderListApi} from '@/Apis/order';
import OrderItem from '@/components/OrderItem/index.vue';

const OrderList = defineComponent({
  name: 'OrderList',
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  setup(props){
    const router = useRouter();
    const refreshing = ref(false);
    const listError = ref(false);
    const listFinished = ref(false);
    const listLoading = ref(false);
    const pageNumber = ref(0);
    const orderList = ref<OrderRes[]>([]);

    //载入订单列表
    const loadOrderList = async (isRefresh = false) => {
      pageNumber.value++;
      listLoading.value = true;

      try {
        const res = await getOrderListApi({
          pageNumber: pageNumber.value,
          status: props.status,
        });

        if(res.data){
          //有返回数据
          const data = res.data;
          const list = res.data?.list || [];

          isRefresh && (orderList.value = []);
          orderList.value.push(...list);
          listFinished.value = data.currPage >= data.totalPage;
        }else{
          //没有返回数据
          listFinished.value = true;
        }
      } catch(err){
        listError.value = true;
        console.error('载入订单列表失败', err);
      } finally {
        refreshing.value = false;
        listLoading.value = false;
      }
    }

    //下拉刷新时触发
    const onRefresh = () => {
      pageNumber.value = 0;
      listError.value = false;
      listFinished.value = false;
      refreshing.value = true;
      loadOrderList(true);
    }

    //点击订单
    const onOrderClick = (order: OrderRes) => {
      router.push(`/order/detail?orderNo=${order.orderNo}`);
    }

    return () => {
      return (
        <div>
          <PullRefresh v-model={refreshing.value} onRefresh={onRefresh}>
            <List
              class="search-list"
              loading={listLoading.value}
              error={listError.value}
              error-text="请求失败，点击重新加载"
              finished={listFinished.value}
              finished-text="没有更多了"
              onUpdate:error={(val: boolean) => listError.value = val}
              onUpdate:loading={(val: boolean) => listLoading.value = val}
              onLoad={loadOrderList}
              offset={10}
            >
              {
                orderList.value.map(order => {
                  return <OrderItem
                    key={order.orderId}
                    data={order}
                    onClick={() => onOrderClick(order)}
                  ></OrderItem>;
                })
              }
            </List>
          </PullRefresh>
        </div>
      );
    }
  },
});

export default OrderList;
</script>

<style lang="less" scoped>
</style>
