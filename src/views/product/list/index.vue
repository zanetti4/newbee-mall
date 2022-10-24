<script lang="tsx">
import {ref, computed, onBeforeMount} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {Tabs, Tab, Empty, PullRefresh, List, Card, Search, Icon} from 'vant';
import {SearchGoodsParams, GoodsRes, searchGoodsApi} from '@/Apis/good';
import {handleImg} from '@/utils';

enum SearchStatus {
  READY = 'ready', //未搜索
  LOADING = 'loading', //搜索中
  DONE = 'done', //搜索完成，有数据
  NoDATA = 'noData', //搜索完成，无数据
  FAIL = 'fail', //搜索失败
  REFRESH = 'refresh', //刷新
}

const tabList = [
  {
    label: '推荐',
    value: '',
  },
  {
    label: '新品',
    value: 'new',
  },
  {
    label: '价格',
    value: 'price',
  },
];

export default {
  name: 'ProductList',
  setup(){
    const router = useRouter();
    const route = useRoute();
    const searchStatus = ref<SearchStatus>(SearchStatus.READY);
    const goodsList = ref<GoodsRes[]>([]);
    const goodsFinish = ref(false);
    const goodsLoading = ref(false);
    const goodsError = ref(false);
    const refreshing = ref(false);

    const goodsParams = ref<SearchGoodsParams>({
      pageNumber: 1,
      keyword: '',
      orderBy: '',
      goodsCategoryId: undefined,
    });

    const keyword = computed(() => {
      return goodsParams.value.keyword?.trim() || '';
    });

    //点击返回
    const goBack = () => {
      router.back();
    }

    //搜索前重置
    const resetData = () => {
      goodsParams.value.pageNumber = 1;
      goodsFinish.value = false;
      goodsError.value = false;
    }

    //搜索商品列表
    const onSearch = async () => {
      if(!keyword.value && !goodsParams.value.goodsCategoryId){
        //没有关键字和分类 id
        searchStatus.value = SearchStatus.READY;
        return;
      }

      resetData();

      if(refreshing.value){
        //刷新中
        searchStatus.value = SearchStatus.REFRESH;
      }else{
        //非刷新中
        searchStatus.value = SearchStatus.LOADING;
      }

      try {
        const res = await searchGoodsApi({
          ...goodsParams.value,
          keyword: keyword.value,
        });

        goodsList.value = res.data?.list || [];
        searchStatus.value = goodsList.value.length ? SearchStatus.DONE : SearchStatus.NoDATA;
        goodsFinish.value = res.data.currPage >= res.data.totalPage;
      } catch(err){
        searchStatus.value = SearchStatus.FAIL;
        console.error('搜索商品列表失败', err);
      } finally {
        refreshing.value = false;
      }
    }

    //改变排序
    const onTabChange = (value: string) => {
      goodsParams.value.orderBy = value;
      onSearch();
    }

    //下拉刷新
    const onRefresh = () => {
      onSearch();
    }

    //滚动条与底部距离小于 offset 时触发
    const loadGoodsList = async () => {
      if(goodsFinish.value){
        //商品列表全部获取完
        return;
      }

      if(searchStatus.value === SearchStatus.REFRESH){
        //正在刷新
        return;
      }

      if(typeof goodsParams.value.pageNumber === 'number'){
        //当前页是数字
        goodsParams.value.pageNumber++;
      }else{
        //当前页不是数字
        goodsError.value = true;
        return;
      }

      goodsLoading.value = true;

      try {
        const res = await searchGoodsApi({
          ...goodsParams.value,
          keyword: keyword.value,
        });

        const data = res.data;

        if(data){
          //有返回数据
          const list = res.data?.list || [];

          goodsList.value.push(...list);
          goodsFinish.value = data.currPage >= data.totalPage;
        }

        // searchStatus.value = goodsList.value.length ? SearchStatus.DONE : SearchStatus.NoDATA;
      } catch(err){
        goodsError.value = true;
        console.error('获取商品列表失败', err);
      } finally {
        goodsLoading.value = false;
      }
    }

    //跳转商品详情页
    const goToGoodDetail = (goods: GoodsRes) => {
      router.push({
        path: `/product/${goods.goodsId}`,
      });
    }

    onBeforeMount(() => {
      goodsParams.value.goodsCategoryId = String(route.query.categoryId || '');
      // onSearch();
    });

    return () => {
      let Content: any = '';
      const NotSearch = <Empty image="search" description="搜索想要的商品" />;
      const Searching = <Empty image="search" description="正在搜索" />;
      const SearchFail = <Empty image="search" description="搜索失败" />;
      const SearchNoDATA = <Empty image="search" description="抱歉，没有找到商品" />;

      const SearchList = (
        <PullRefresh v-model={refreshing.value} onRefresh={onRefresh}>
          <List
            class="search-list"
            loading={goodsLoading.value}
            error={goodsError.value}
            error-text="请求失败，点击重新加载"
            finished={goodsFinish.value}
            finished-text="没有更多了"
            onUpdate:error={(val: boolean) => goodsError.value = val}
            onUpdate:loading={(val: boolean) => goodsLoading.value = val}
            onLoad={loadGoodsList}
            offset={10}
          >
            {
              goodsList.value.map(goods => {
                return <Card
                  title={goods.goodsName}
                  thumb={handleImg(goods.goodsCoverImg)}
                  desc={goods.goodsIntro}
                  price={goods.sellingPrice}
                  key={goods.goodsId}
                  onClick={() => goToGoodDetail(goods)}
                />;
              })
            }
          </List>
        </PullRefresh>
      );

      switch(searchStatus.value){
        case SearchStatus.READY:
          //未搜索
          Content = NotSearch;
          break;
        case SearchStatus.LOADING:
          //搜索中
          Content = Searching;
          break;
        case SearchStatus.FAIL:
          //搜索失败
          Content = SearchFail;
          break;
        case SearchStatus.NoDATA:
          //搜索完成，无数据
          Content = SearchNoDATA;
          break;
        case SearchStatus.DONE:
          //搜索完成，有数据
        case SearchStatus.REFRESH:
          //刷新
          Content = SearchList;
          break;
      }

      return (
        <div class="product-list">
          <div class="product-list-top">
            <div class="product-list-top-fix">
              <Search
                placeholder="请输入搜索关键词"
                v-model={goodsParams.value.keyword}
                show-action
                onSearch={onSearch}
              >
                {{
                  left: () => (
                    <span class="back-icon" onClick={goBack}>
                      <Icon
                        name="arrow-left"
                      />
                    </span>
                  ),
                  action: () => <div onClick={onSearch}>搜索</div>
                }}
              </Search>
              <Tabs
                type="card"
                onChange={onTabChange}
              >
                {
                  tabList.map(tab => {
                    return (
                      <Tab key={tab.value} title={tab.label} name={tab.value}></Tab>
                    );
                  })
                }
              </Tabs>
            </div>
          </div>
          {Content}
        </div>
      );
    }
  },
}
</script>

<style lang="less" scoped>
.product-list {
  .back-icon {
    font-size: 18px;
    padding-right: 10px;
  }
}
.product-list-top {
  height: 84px;
}
.product-list-top-fix {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
}
.search-list {
  margin-top: 10px;
}
</style>
