import {defineComponent, ref, watch, computed} from 'vue';
import {useRoute} from 'vue-router';
import {useStore} from 'vuex';
import {Tabbar, TabbarItem, Badge} from 'vant';
import router from '@/router';
import './index.less';

export default defineComponent({
  name: 'tabbar',
  setup(){
    const visible = ref(true);
    const active = ref(0);
    const route = useRoute();
    const store = useStore();
    
    const cartCount = computed(() => {
      return store.state.cartCount;
    });

    const tabs = [
      {
        name: '首页',
        icon: 'wap-home-o',
        path: '/home',
      },
      {
        name: '分类',
        icon: 'points',
        path: '/category',
      },
      {
        name: '购物车',
        icon: 'shopping-cart-o',
        path: '/cart',
        isCart: true,
      },
      {
        name: '我的',
        icon: 'user-o',
        path: '/user',
      },
    ];

    //设置标签栏可见性和激活项
    const setActiveTab = (path: String) => {
      const index = tabs.findIndex(tab => tab.path === path);

      if(index > -1){
        //是标签栏中的路由
        visible.value = true;
        active.value = index;
      }else{
        //不是标签栏中的路由
        visible.value = false;
      }
    }
    
    watch(
      () => route.path,
      (path) => {
        setActiveTab(path);
      },
      {
        immediate: true,
      }
    );

    return () => {
      return (
        visible.value ?
          //显示标签栏
          (
            <div class="tabbar-wrap">
              <Tabbar v-model={active.value}>
                {
                  tabs.map(tab => {
                    return <TabbarItem
                      icon={tab.icon}
                      onClick={() => router.push(tab.path)}
                    >
                      {
                        tab.isCart && cartCount.value > 0 ?
                          //是购物车，且其中有商品
                          <Badge
                            content={cartCount.value}
                            offset={[-5, -23]}
                          >{tab.name}</Badge> :
                          //不是购物车，或者购物车中没有商品
                          tab.name
                      }
                    </TabbarItem>;
                  })
                }
              </Tabbar>
            </div>
          ) :
          //不显示标签栏
          undefined
      );
    }
  },
});