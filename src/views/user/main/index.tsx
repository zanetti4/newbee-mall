import {ref, onBeforeMount} from 'vue';
import {Skeleton, Cell} from 'vant';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {getUserInfoApi, UserInfo} from '@/Apis/user';
import {getCartApi} from '@/Apis/cart';
import Navbar from '@/components/Navbar';
import './index.less';

export default {
  name: 'user',
  setup(){
    const router = useRouter();
    const loading = ref(false);
    const store = useStore();

    const userInfo = ref({
      introduceSign: '',
      loginName: '',
      nickName: '',
    } as UserInfo);

    //获取用户信息
    const fetchUserInfo = async () => {
      try {
        loading.value = true;

        const res = await getUserInfoApi();
        const data = res.data;

        if(data){
          //用户信息存在
          userInfo.value = Object.assign(userInfo.value, data);
        }
      } catch(err){
        console.error('获取用户信息失败', err);
      } finally {
        loading.value = false;
      }
    }

    fetchUserInfo();

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

    onBeforeMount(() => {
      fetchCartList();
    });

    return () => {
      const Card = (
        <div class="user-info">
          <Skeleton
            avatar
            avatar-size={60}
            row={2}
            loading={loading.value}
          >
            <div class="user-info-inner">
              <img
                alt="avatar"
                class="user-info-avatar"
                src="https://s.yezgea02.com/1604040746310/aaaddd.png"
              />
              <div class="user-info-main">
                <p>昵称:{userInfo.value.nickName}</p>
                <p>登录名:{userInfo.value.loginName}</p>
                <p>个性签名:{userInfo.value.introduceSign}</p>
              </div>
            </div>
          </Skeleton>
        </div>
      );

      return (
        <div>
          <Navbar title="我的"></Navbar>
          {Card}
          <Cell
            title="我的订单"
            is-link
            onClick={() => {router.push('/order/list')}}
          />
          <Cell
            title="账号管理"
            is-link
            onClick={() => {router.push('/user/setting')}}
          />
          <Cell
            title="地址管理"
            is-link
            onClick={() => {router.push('/user/address')}}
          />
          <Cell
            title="关于我们"
            is-link
            onClick={() => {router.push('/user/about')}}
          />
        </div>
      );
    }
  },
}
