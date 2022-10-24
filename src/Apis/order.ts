import http from '@/utils/http';

interface CreateOrderParams {
  addressId?: number,
  cartItemIds?: string[] | number[],
}

interface GoodsVosRes {
  goodsCount: number,
  goodsCoverImg: string,
  goodsId: number,
  goodsName: string,
  sellingPrice: number,
}

export interface OrderRes {
  createTime?: string,
  newBeeMallOrderItemVOS?: GoodsVosRes[],
  orderId?: number,
  orderNo?: string,
  orderStatus?: number,
  orderStatusString?: string,
  payType?: number,
  totalPrice?: number,
}

//生成订单
export function createOrderApi(params: CreateOrderParams){
  return http.post('/saveOrder', params);
}

interface PayOrderParams {
  payType?: number,
  orderNo?: string,
}

//支付
export function payOrderApi(params: PayOrderParams){
  return http.get('/paySuccess', {params});
}

export interface GetOrderListParams {
  pageNumber?: number,
  status?: string,
}

//获取订单列表
export function getOrderListApi(params: GetOrderListParams){
  return http.get<Res.Page<OrderRes>>('/order', {params});
}

//获取订单详情
export function getOrderDetailApi(id: string){
  return http.get<OrderRes>(`/order/${id}`);
}

//取消订单
export function cancelOrderApi(id: string){
  return http.put(`/order/${id}/cancel`);
}