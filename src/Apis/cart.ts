import http from '@/utils/http';

export interface CartItemRes {
  goodsCoverImg?: string,
  goodsId?: number,
  goodsName?: string,
  sellingPrice?: number,
  cartItemId?: number,
  goodsCount?: number,
}

//获取购物车商品
export function getCartApi(){
  return http.get<CartItemRes []>('/shop-cart');
}

export interface GetCartItemsParams {
  cartItemIds?: string,
}

//获取结算商品列表
export function getByCartItemIdsApi(params: GetCartItemsParams){
  return http.get<CartItemRes []>('/shop-cart/settle', {params});
}

export interface AddCartParams extends CartItemRes {}

//加入购物车
export function addCartApi(params: AddCartParams){
  return http.post('/shop-cart', params);
}

export interface ModifyCartParams extends CartItemRes {}

//修改购物车商品
export function modifyCartApi(params: ModifyCartParams){
  return http.put('/shop-cart', params);
}

//删除购物车商品
export function deleteCartItemApi(id: number){
  return http.delete(`/shop-cart/${id}`);
}