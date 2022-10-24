import {GoodsRes} from './good';
import http from '@/utils/http';

export interface CarouselRes {
  carouselUrl: string,
  redirectUrl: string,
}

export interface HomeResData {
  carousels: CarouselRes[],
  hotGoodses: GoodsRes[],
  newGoodses: GoodsRes[],
  recommendGoodses: GoodsRes[],
}

//获取首页数据
export function getHomeApi(){
  return http.get<HomeResData>('index-infos');
}