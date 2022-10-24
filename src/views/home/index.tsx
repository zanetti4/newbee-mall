import {Icon, Swipe, SwipeItem, Toast, Grid, GridItem} from 'vant';
import {useRouter} from 'vue-router';
import {ref} from 'vue';
import Navbar from '@/components/Navbar';
import GoodsItem from '@/components/GoodsItem';
import {CarouselRes, HomeResData, getHomeApi} from '@/Apis/home';
import {GoodsRes} from '@/Apis/good';
import './index.less';

//分类项接口
interface categoryItem {
  name: string,
  imgUrl: string,
  categoryId: number
}

export default {
  name: 'home',
  setup(){
    const router = useRouter();
    const carouselList = ref<CarouselRes[]>([]);
    const newGoodsList = ref<GoodsRes[]>([]);
    const hotGoodsList = ref<GoodsRes[]>([]);
    const recommendGoodsList = ref<GoodsRes[]>([]);
    
    const categoryList: categoryItem[] = [
      {
        name: '新蜂超市',
        imgUrl: 'https://s.yezgea02.com/1604041127880/%E8%B6%85%E5%B8%82%402x.png',
        categoryId: 100001,
      },
      {
        name: '新蜂服饰',
        imgUrl: 'https://s.yezgea02.com/1604041127880/%E6%9C%8D%E9%A5%B0%402x.png',
        categoryId: 100003,
      },
      {
        name: '全球购',
        imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%A8%E7%90%83%E8%B4%AD%402x.png',
        categoryId: 100002,
      },
      {
        name: '新蜂生鲜',
        imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%94%9F%E9%B2%9C%402x.png',
        categoryId: 100004,
      },
      {
        name: '新蜂到家',
        imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%88%B0%E5%AE%B6%402x.png',
        categoryId: 100005,
      },
      {
        name: '充值缴费',
        imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%85%E5%80%BC%402x.png',
        categoryId: 100006,
      },
      {
        name: '9.9元拼',
        imgUrl: 'https://s.yezgea02.com/1604041127880/9.9%402x.png',
        categoryId: 100007,
      },
      {
        name: '领券',
        imgUrl: 'https://s.yezgea02.com/1604041127880/%E9%A2%86%E5%88%B8%402x.png',
        categoryId: 100008,
      },
      {
        name: '省钱',
        imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%9C%81%E9%92%B1%402x.png',
        categoryId: 100009,
      },
      {
        name: '全部',
        imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%A8%E9%83%A8%402x.png',
        categoryId: 100010,
      },
    ];
    
    //获取首页数据
    const fetchHomeData = async () => {
      const toast = Toast.loading('加载中……');
      
      try {
        const res = await getHomeApi();
        const data = res.data || {} as HomeResData;
        
        carouselList.value = data.carousels || [];
        newGoodsList.value = data.newGoodses || [];
        hotGoodsList.value = data.hotGoodses || [];
        recommendGoodsList.value = data.recommendGoodses || [];
      } catch(err){
        console.error('首页数据获取失败', err);
      } finally {
        toast.clear();
      }
    }
    
    fetchHomeData();
    
    //跳转到我的页面
    const gotoProfile = () => {
      router.push('/user');
    }
    
    //跳转到商品列表页面
    const gotoSearch = () => {
      router.push('/product/list');
    }
    
    return () => (
      <div class="home-page">
        <Navbar title="新蜂商城">
          {{
            right: () => {
              return (
                <>
                  <Icon 
                    name="contact"
                    size="18"
                    onClick={gotoProfile}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <Icon
                    name="search"
                    size="18"
                    onClick={gotoSearch}
                  />
                </>
              );
            },
          }}
        </Navbar>
        <Swipe 
          class="home-banner"
          autoplay={3000}
        >
          {
            carouselList.value.map((carousel, index) => {
              return <SwipeItem key={index}>
                <a
                  class="home-banner-link"
                  href={carousel.redirectUrl}
                  target="_blank"
                >
                  <img
                    class="home-banner-img"
                    src={carousel.carouselUrl}
                    alt="carouselPic"
                  ></img>
                </a>
              </SwipeItem>
            })
          }
        </Swipe>
        <ul class="home-cate-list">
          {
            categoryList.map(cate => {
              return (
                <li
                  key={cate.categoryId}
                  class="cate-item"
                >
                  <img 
                    alt="cateImg"
                    src={cate.imgUrl}
                    class="cate-item-img"
                  />
                  <p class="cate-item-text ell">{cate.name}</p>
                </li>
              );
            })
          }
        </ul>
        {
          !newGoodsList.value.length ?
            //没有新品
            null :
            //有新品
            <section>
              <h2 class="home-title">新品上线</h2>
              <Grid columnNum={2}>
                {
                  newGoodsList.value.map(good => {
                    return <GridItem key={good.goodsId}>
                      <GoodsItem data={good}></GoodsItem>
                    </GridItem>;
                  })
                }
              </Grid>
            </section>
        }
        {
          !hotGoodsList.value.length ?
            //没有热门商品
            null :
            //有热门商品
            <section>
              <h2 class="home-title">热门商品</h2>
              <Grid columnNum={2}>
                {
                  hotGoodsList.value.map(good => {
                    return <GridItem key={good.goodsId}>
                      <GoodsItem data={good}></GoodsItem>
                    </GridItem>;
                  })
                }
              </Grid>
            </section>
        }
        {
          !recommendGoodsList.value.length ?
            //没有最新推荐
            null :
            //有最新推荐
            <section>
              <h2 class="home-title">最新推荐</h2>
              <Grid columnNum={2}>
                {
                  recommendGoodsList.value.map(good => {
                    return <GridItem key={good.goodsId}>
                      <GoodsItem data={good}></GoodsItem>
                    </GridItem>;
                  })
                }
              </Grid>
            </section>
        }
      </div>
    )
  },
}