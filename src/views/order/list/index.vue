<script lang="tsx">
import {Tabs, Tab} from 'vant';
import {ref} from 'vue';
import Navbar from '@/components/Navbar';
import OrderList from './OrderList.vue';

const tabList = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '待付款',
    value: '0',
  },
  {
    label: '待确认',
    value: '1',
  },
  {
    label: '待发货',
    value: '2',
  },
  {
    label: '已发货',
    value: '3',
  },
  {
    label: '交易完成',
    value: '4',
  },
  {
    label: '手动关闭',
    value: '-1',
  },
];
  
export default {
  name: 'Order',
  setup(){
    const activeTab = ref('');
    
    return () => {
      return (
        <div>
          <Navbar
            title="我的订单"
            leftArrow
          ></Navbar>
          <Tabs
            active={activeTab.value}
            onUpdate:active={(val) => activeTab.value = val}
          >
            {
              tabList.map(tab => {
                return (
                  <Tab key={tab.value} title={tab.label} name={tab.value}>
                    <OrderList status={tab.value}></OrderList>
                  </Tab>
                );
              })
            }
          </Tabs>
        </div>
      );
    }
  },
}
</script>

<style lang="less" scoped>
/deep/ .van-tabs__wrap {
  position: fixed;
  top: 46px;
  width: 100%;
  background-color: white;
  z-index: 10;
}
/deep/ .van-tabs__content {
  margin-top: 44px;
}
</style>
