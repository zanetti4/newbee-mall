<script lang="tsx">
import {ref, computed, onBeforeMount} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {Toast, Divider, ActionBar, ActionBarIcon, ActionBarButton, Badge} from 'vant';
import Navbar from '@/components/Navbar';
import {handleImg} from '@/utils';
import {resolveResError} from '@/utils/http';
import {GoodsDetailRes, getGoodsApi} from '@/Apis/good';
import {getCartApi, addCartApi} from '@/Apis/cart';

export default {
  name: 'ProductDetail',
  setup(){
    const route = useRoute();
    const store = useStore();
    const router = useRouter();

    const goodsId = computed(() => {
      return route.params.id;
    });

    const cartCount = computed(() => {
      return store.state.cartCount;
    });

    const goodsData = ref<GoodsDetailRes>({} as GoodsDetailRes);
    const adding = ref(false);

    //获取商品详情
    const fetchGoodsData = async () => {
      const toast = Toast.loading('加载中……');

      try {
        const res = await getGoodsApi(Number(goodsId.value));

        goodsData.value = res.data || {};
      } catch(err){
        console.error('商品详情获取失败', err);
      } finally {
        toast.clear();
      }
    }

    //获取购物车商品
    const fetchCartList = async () => {
      try {
        const res = await getCartApi();

        if(res.data?.length){
          //购物车有商品
          store.commit('setCartCount', res.data?.length);
        }
      } catch(err){
        console.error('购物车商品获取失败', err);
      }
    }

    //加入购物车
    const addCart = async () => {
      try {
        adding.value = true;

        const {goodsId} = goodsData.value;

        await addCartApi({
          goodsCount: 1,
          goodsId,
        });

        Toast.success('添加成功');
        store.commit('setCartCount', cartCount.value + 1);
      } catch(err){
        const res = resolveResError(err);

        console.log(res?.message, res?.resultCode, 'message, resultCode');
        console.error('商品加入购物车失败', err);
      } finally {
        adding.value = false;
      }
    }

    onBeforeMount(() => {
      fetchGoodsData();
      fetchCartList();
    });

    //点击购物车
    const goToCart = () => {
      router.push('/cart');
    }

    return () => {
      const {goodsCoverImg, goodsName, sellingPrice, goodsDetailContent} = goodsData.value;

      return (
        <div class="goods-detail">
          <Navbar
            title="商品详情"
            leftArrow
          ></Navbar>
          <img
            alt="productPic"
            class="goods-detail-img"
            src={handleImg(goodsCoverImg)}
          />
          <div class="goods-detail-card">
            <h2 class="goods-detail-title">{goodsName}</h2>
            <p class="goods-detail-post">免邮费 顺丰快递</p>
            <div class="goods-detail-price">￥{sellingPrice}</div>
          </div>
          <Divider>
            <h3 class="goods-detail-subtitle">商品介绍</h3>
          </Divider>
          <div class="goods-detail-content">
            <div v-html={goodsDetailContent}></div>
          </div>
          <div style="height: 50px;">
            <ActionBar>
              <ActionBarIcon icon="chat-o" text="客服" color="#ee0a24" />
              <Badge content={cartCount.value} offset={[-14, 0]}>
                <ActionBarIcon icon="cart-o" text="购物车" onClick={goToCart} />
              </Badge>
              <ActionBarButton
                text="加入购物车"
                type="warning"
                loading={adding.value}
                onClick={addCart}
              />
              <ActionBarButton
                text="立即购买"
                type="danger"
              />
            </ActionBar>
          </div>
        </div>
      );
    }
  },
}
</script>

<style lang="less" scoped>
.goods-detail {
  padding-bottom: 20px;
}
.goods-detail-img {
  display: inline-block;
  width: 100%;
}
.goods-detail-card {
  padding: 0 16px;
  margin-bottom: 30px;
}
.goods-detail-title {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 5px;
}
.goods-detail-post {
  color: #AAA;
  font-size: 14px;
  margin-bottom: 10px;
}
.goods-detail-price {
  color: red;
  font-size: 22px;
  font-weight: 300;
}
.goods-detail-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.goods-detail-content {
  padding: 0 15px;
  /deep/ img {
    display: inline-block;
    max-width: 100%;
  }
}
</style>
