<script lang="tsx">
import {ref, onBeforeMount, computed} from 'vue';
import {Toast, SwipeCell, Checkbox, Card, Stepper, Button, SubmitBar, Empty} from 'vant';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import Navbar from '@/components/Navbar';
import {CartItemRes, getCartApi, modifyCartApi, deleteCartItemApi} from '@/Apis/cart';
import {handleImg} from '@/utils';

interface CartItem extends CartItemRes {
  _originCount?: number;
  _isCheck: boolean;
}

export default {
  name: 'Cart',
  setup(){
    const cartList = ref<CartItem[]>([]);
    const totalPrice = ref(0);
    const store = useStore();
    const router = useRouter();

    const checkedAll = computed({
      get(){
        if(!cartList.value.length){
          //购物车无商品
          return false;
        }

        return cartList.value.every(cart => cart._isCheck);
      },
      set(val: boolean){
        cartList.value.forEach(cart => {
          cart._isCheck = !!val;
        });
      },
    });

    //计算商品总价
    const updateTotalPrice = () => {
      let price: number = 0;

      cartList.value.forEach(item => {
        if(item._isCheck){
          //已勾选该商品
          price = price + (item.sellingPrice || 0) * (item.goodsCount || 0);
        }
      });

      totalPrice.value = price;
    }

    //操作复选框
    const onCheckboxChange = () => {
      updateTotalPrice();
    }

    //获取购物车商品
    const fetchCartList = async () => {
      const toast = Toast.loading('加载中……');

      try {
        const res = await getCartApi();

        cartList.value = (res.data || []).map((item: CartItemRes) => {
          return {
            ...item,
            _originCount: item.goodsCount,
            _isCheck: true,
          }
        });

        store.commit('setCartCount', cartList.value.length);
        updateTotalPrice();
      } catch(err){
        console.error('购物车商品获取失败', err);
      } finally {
        toast.clear();
      }
    }

    //修改购物车商品
    const modifyCartItem = async (cart: CartItem) => {
      const toast = Toast.loading('加载中……');

      try {
        await modifyCartApi({
          cartItemId: cart.cartItemId,
          goodsCount: cart.goodsCount,
        });

        cart._originCount = cart.goodsCount;
        updateTotalPrice();
      } catch(err){
        console.error('修改购物车商品失败', err);
        cart.goodsCount = cart._originCount;
      } finally {
        toast.clear();
      }
    }

    //删除购物车商品
    const deleteCartItem = async (cart: CartItem, index: number) => {
      const toast = Toast.loading('加载中……');

      try {
        await deleteCartItemApi(cart.cartItemId as number);

        if(typeof index === 'number'){
          //index 是数字
          cartList.value.splice(index, 1);
          store.commit('setCartCount', cartList.value.length);
        }

        updateTotalPrice();
      } catch(err){
        console.error('删除购物车商品失败', err);
      } finally {
        toast.clear();
      }
    }

    //提交订单
    const onSubmit = () => {
      const submitIds = [];

      cartList.value.forEach(cart => {
        if(cart._isCheck){
          //勾选该商品
          submitIds.push(cart.cartItemId);
        }
      });

      if(!submitIds.length){
        //没有勾选任何商品
        Toast.fail('请勾选商品');
        return;
      }

      const cartItemIds = submitIds.join(',');

      router.push({
        path: '/order/create',
        query: {
          cartItemIds,
        },
      });
    }

    //前往选购
    const goToShop = () => {
      router.push('/home');
    }

    onBeforeMount(() => {
      fetchCartList();
    });

    return () => {
      return (
        <div class="cart-page">
          <Navbar
            title="购物车"
          ></Navbar>
          {
            cartList.value.map((cart, index) => {
              return (
                <SwipeCell key={cart.cartItemId}>
                  {{
                    default: () => {
                      return (
                        <div class="cart-item">
                          <Checkbox
                            class="cart-item-checkbox"
                            v-model={cart._isCheck}
                            onChange={onCheckboxChange}
                          ></Checkbox>
                          <Card
                            class="cart-item-card"
                            title={cart.goodsName}
                            thumb={typeof cart.goodsCoverImg === 'string' ? handleImg(cart.goodsCoverImg) : ''}
                          >
                            {{
                              price: () => {
                                return <span class="cart-item-price">￥{cart.sellingPrice}</span>;
                              },
                              num: () => {
                                return (
                                  <Stepper
                                    v-model={cart.goodsCount}
                                    onChange={() => modifyCartItem(cart)}
                                  ></Stepper>
                                );
                              },
                            }}
                          </Card>
                        </div>
                      );
                    },
                    right: () => {
                      return <Button text="删除" square class="cart-item-delete" type="danger" onClick={() => deleteCartItem(cart, index)} />
                    },
                  }}
                </SwipeCell>
              );
            })
          }
          {
            cartList.value.length ?
              //购物车有商品
              (
                <div class="submit-bar-wrap">
                  <SubmitBar price={totalPrice.value * 100} button-text="提交订单" onSubmit={onSubmit} >
                    <Checkbox
                      v-model={checkedAll.value}
                    >全选</Checkbox>
                  </SubmitBar>
                </div>
              ) :
              //购物车无商品
              <Empty description="购物车空空如也">
                <Button text="前往选购" round class="bottom-button" type="danger" onClick={goToShop} />
              </Empty>
          }
        </div>
      );
    }
  },
}
</script>

<style lang="less" scoped>
.cart-item {
  display: flex;
}
.cart-item-checkbox {
  padding: 0 10px;
}
.cart-item-card {
  flex: 1;
  background-color: white;
}
.cart-item-price {
  font-size: 16px;
  font-weight: 300;
  color: red;
}
.cart-item-delete {
  height: 100%;
}
.submit-bar-wrap {
  height: 50px;
  /deep/ .van-submit-bar {
    bottom: 50px;
  }
}
</style>
