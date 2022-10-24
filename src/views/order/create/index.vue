<script lang="tsx">
import {ref, computed, onBeforeMount} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {Icon, Card, Button, Popup, Toast, AddressListAddress} from 'vant';
import Navbar from '@/components/Navbar';
import Address from '@/views/user/address';
import {getDefaultAddressApi, getAddressDetailApi} from '@/Apis/address';
import {CartItemRes, getByCartItemIdsApi} from '@/Apis/cart';
import {createOrderApi, payOrderApi} from '@/Apis/order';
import {handleImg} from '@/utils';

interface OrderAddress {
  address?: string;
  addressId?: string | number;
  userPhone?: string | number;
}

export default {
  name: 'OrderCreate',
  setup(){
    const route = useRoute();
    const router = useRouter();
    const orderAddress = ref({} as OrderAddress);
    const cartList = ref<CartItemRes[]>([]);
    const totalPrice = ref(0);
    const creating = ref(false);
    const payPopupVisible = ref(false);

    const showAddressPage = computed(() => {
      return String(route.query.page) === 'address';
    });

    const addressId = computed(() => {
      return String(route.query.orderAddressId || '');
    });

    const cartItemIds = computed(() => {
      return String(route.query.cartItemIds || '');
    });

    //点击地址
    const openAddressPage = () => {
      router.replace({
        query: {
          ...route.query,
          page: 'address',
        },
      });
    }

    //获取订单页地址
    const fetchOrderAddress = async () => {
      try {
        let res;

        if(addressId.value){
          //有指定的地址 id
          res = await getAddressDetailApi(addressId.value);
        }else{
          //没有指定的地址 id
          res = await getDefaultAddressApi();
        }

        const {addressId: id, userPhone, provinceName, cityName, regionName, detailAddress} = res.data || {}

        orderAddress.value = {
          addressId: id,
          userPhone,
          address: [provinceName, cityName, regionName, detailAddress].join(' '),
        }
      } catch(err){
        console.error('获取订单页地址失败', err);
      }
    }

    //计算总价
    const calcTotalPrice = () => {
      let price: number = 0;

      cartList.value.forEach(item => {
        price = price + (item.sellingPrice || 0) * (item.goodsCount || 0);
      });

      totalPrice.value = price;
    }

    //获取结算商品列表
    const fetchCartList = async () => {
      try {
        const res = await getByCartItemIdsApi({
          cartItemIds: cartItemIds.value,
        });

        cartList.value = res.data || [];
        calcTotalPrice();
      } catch(err){
        console.error('获取结算商品列表失败', err);
      }
    }

    //获取初始信息
    const initData = () => {
      fetchOrderAddress();
      fetchCartList();
    }

    //从地址列表页返回
    const onAddressBack = () => {
      router.replace({
        query: {
          ...route.query,
          page: undefined,
        },
      });
    }

    let orderNo: string | undefined

    //生成订单
    const createOrder = async () => {
      try {
        creating.value = true;

        const res = await createOrderApi({
          addressId: orderAddress.value.addressId as number,
          cartItemIds: cartItemIds.value.split(','),
        });

        orderNo = res.data;
        payPopupVisible.value = true;
      } catch(err){
        console.error('生成订单失败', err);
      } finally {
        creating.value = false;
      }
    }

    //到订单详情页
    const goToOrderDetail = () => {
      // router.replace('/order/index');

      router.replace({
        path: `/order/${orderNo}`,
        query: {
          orderNo,
        },
      });
    }

    //支付
    const payOrder = async () => {
      const toast = Toast.loading('支付中……');

      try {
        await payOrderApi({
          orderNo,
          payType: 1,
        });

        Toast.success('支付成功');
        // goToOrderDetail();
      } catch(err){
        toast.clear();
        console.error('支付失败', err);
      } finally {
        goToOrderDetail();
      }
    }

    //地址列表页选择地址
    const onAddressSelect = (address: AddressListAddress) => {
      orderAddress.value = {
        addressId: address.id,
        userPhone: address.tel,
        address: address.address,
      }

      router.replace({
        query: {
          ...route.query,
          page: undefined,
          orderAddressId: address.id,
        },
      });
    }

    onBeforeMount(() => {
      initData();
    });

    return () => {
      return (
        <>
          {
            showAddressPage.value ?
              //显示地址列表
              (
                <Address
                  navBack={onAddressBack}
                  switchable
                  defaultId={Number(addressId.value || orderAddress.value.addressId)}
                  onSelect={onAddressSelect}
                ></Address>
              ) :
              //不显示地址列表
              (
                <div>
                  <Navbar
                    title="生成订单"
                    leftArrow
                  ></Navbar>
                  <div class="order-address" onClick={openAddressPage}>
                    <div class="order-address-main">
                      <p>{orderAddress.value.userPhone}</p>
                      <p>{orderAddress.value.address}</p>
                    </div>
                    <div class="order-address-right">
                      <Icon name="arrow"></Icon>
                    </div>
                  </div>
                  {
                    cartList.value.map(cart => {
                      return <Card
                            title={cart.goodsName}
                            thumb={handleImg(cart.goodsCoverImg)}
                            num={cart.goodsCount}
                            price={cart.sellingPrice}
                      />;
                    })
                  }
                  <div class="order-footer-wrap">
                    <div class="order-footer">
                      <div class="order-footer-content">
                        <span>商品金额</span>
                        <span class="order-price">￥{totalPrice.value}</span>
                      </div>
                      <Button
                        round
                        block
                        type="primary"
                        loading={creating.value}
                        onClick={createOrder}
                      >生成订单</Button>
                    </div>
                  </div>
                  <Popup
                    class="order-pay-popup"
                    show={payPopupVisible.value}
                    position="bottom"
                    closeOnClickOverlay={false}
                    closeable
                    teleport="body"
                    onClose={goToOrderDetail}
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
              )
          }
        </>
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
.order-address {
  display: flex;
  align-items: center;
  position: relative;
  padding: 15px;
  margin-bottom: 20px;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: -webkit-repeating-linear-gradient(135deg,#ff6c6c 0,#ff6c6c 20%,transparent 0,transparent 25%,#1989fa 0,#1989fa 45%,transparent 0,transparent 50%);
    background: repeating-linear-gradient(-45deg,#ff6c6c 0,#ff6c6c 20%,transparent 0,transparent 25%,#1989fa 0,#1989fa 45%,transparent 0,transparent 50%);
    background-size: 80px;
  }
}
.order-address-main {
  flex: 1;
  line-height: 30px;
  font-size: 14px;
  color: #6C7880;
}
.order-address-right {
  font-size: 20px;
  font-weight: 600;
}
.order-footer-wrap {
  height: 150px;
}
.order-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 15px 5px;
  background-color: white;
  border-top: solid 1px #EEE;
}
.order-footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .order-price {
    color: red;
    font-size: 18px;
  }
}
</style>
