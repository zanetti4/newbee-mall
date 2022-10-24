import http from '@/utils/http';

export interface GoodsRes {
  goodsCoverImg?: string,
  goodsId?: number,
  goodsIntro?: string,
  goodsName?: string,
  sellingPrice?: number,
  tag?: string,
}

export interface CateItemRes {
  categoryId?: number,
  categoryLevel?: number,
  categoryName?: string,
  parentId?: number,
  secondLevelCategoryVOS?: CateItemRes[],
  thirdLevelCategoryVOS?: CateItemRes[],
}

export interface SearchGoodsParams {
  pageNumber?: number,
  keyword?: string,
  orderBy?: string,
  goodsCategoryId?: string | number,
}

export interface GoodsDetailRes extends GoodsRes {
  goodsCarouselList?: string[],
  goodsDetailContent?: string,
  originalPrice: string,
}

//获取商品详情
export function getGoodsApi(id: number){
  return http.get(`/goods/detail/${id}`);
}

//搜索商品列表
export function searchGoodsApi(params: SearchGoodsParams){
  return http.get<Res.Page<GoodsRes>>('/search', {params});
}

//获取分类数据
export function getCategoryApi(){
  return http.get('/categories');
}