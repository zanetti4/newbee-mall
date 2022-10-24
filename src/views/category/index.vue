<script lang="tsx">
import {Search, Tag} from 'vant';
import {useRouter} from 'vue-router';
import {ref, onBeforeMount} from 'vue';
import {CateItemRes, getCategoryApi} from '@/Apis/good';

export default {
  name: 'category',
  setup(){
    const router = useRouter();
    const cateList = ref<CateItemRes[]>([]);
    const activeCate = ref<CateItemRes>({} as CateItemRes);

    //激活类别改变
    const onCateChange = (cate: CateItemRes) => {
      if(cate){
        //传入了某类别
        activeCate.value = cate;
      }
    }

    //获取分类数据
    const fetchCateList = async () => {
      try {
        const res = await getCategoryApi();

        cateList.value = res.data || [];
        onCateChange(cateList.value[0]);
      } catch(err){
        console.error('获取分类数据失败', err);
      }
    }

    //点击搜索栏
    const goToProductList = () => {
      router.push('/product/list');
    }

    //点击3级分类
    const onChildCateChange = (childCate: CateItemRes) => {
      router.push(`/product/list?categoryId=${childCate.categoryId}`);
    }

    onBeforeMount(() => {
      fetchCateList();
    });

    return () => {
      const subCateList = activeCate.value.secondLevelCategoryVOS || [];

      return (
        <div class="cate-page">
          <Search
            class="cate-search"
            readonly
            placeholder="请输入搜索关键词"
            onClick={goToProductList}
          />
          <section class="cate-content">
            <aside class="cate-side">
              {
                cateList.value.map(cate => {
                  return <div
                    key={cate.categoryId}
                    class={[
                      'cate-nav',
                      cate.categoryId === activeCate.value.categoryId ? 'active' : ''
                    ]}
                    onClick={() => onCateChange(cate)}
                  >{cate.categoryName}</div>;
                })
              }
            </aside>
            <main class="cate-main">
              {
                subCateList.map(subCate => {
                  return (
                    <div class="cate-item">
                      <h3 class="cate-list-title">{subCate.categoryName}</h3>
                      <div class="cate-subItem" key={subCate.categoryId}>
                        {
                          (subCate?.thirdLevelCategoryVOS || []).map(thirdCate => {
                            return <Tag
                              class="cate-item-tag"
                              type="primary"
                              key={thirdCate.categoryId}
                              onClick={() => onChildCateChange(thirdCate)}
                            >{thirdCate.categoryName}</Tag>;
                          })
                        }
                      </div>
                    </div>
                  );
                })
              }
            </main>
          </section>
        </div>
      );
    }
  },
}
</script>

<style lang="less" scoped>
.cate-search {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.cate-content {
  position: absolute;
  top: 50px;
  bottom: 50px;
  left: 0;
  display: flex;
  overflow: hidden;
}
.cate-side {
  width: 120px;
  height: 100%;
  background-color: #F8F8F8;
  overflow: auto;
}
.cate-nav {
  line-height: 55px;
  color: #666;
  font-size: 14px;
  padding: 0 10px;
  &.active {
    background-color: white;
    color: #1baeae;
  }
}
.cate-main {
  flex: 1;
  height: 100%;
  padding: 10px 15px;
  box-sizing: border-box;
  overflow: auto;
  background-color: white;
}
.cate-list-title {
  font-size: 16px;
  margin: 20px 0;
}
.cate-item-tag {
  margin: 5px 12px;
}
</style>
