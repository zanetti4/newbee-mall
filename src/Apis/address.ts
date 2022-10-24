import http from '@/utils/http';

export interface AddressItemResData {
  addressId?: string | number;
  defaultFlag?: number;
  userId?: number;
  userPhone?: string;
  userName?: string;
  cityName?: string;
  detailAddress?: string;
  provinceName?: string;
  regionName?: string;
}

//获取默认地址
export function getDefaultAddressApi(){
  return http.get<AddressItemResData>('/address/default');
}

//更新地址
export function editAddressApi(params: AddressItemResData){
  return http.put('/address', params);
}

//新增地址
export function addAddressApi(params: AddressItemResData){
  return http.post('/address', params);
}

//获取地址列表
export function getAddressListApi(){
  return http.get<AddressItemResData[]>('/address', {
    params: {
      pageNumber: 1,
      pageSize: 1000,
    },
  });
}

//获取指定地址
export function getAddressDetailApi(id: string | number){
  return http.get<AddressItemResData>(`/address/${id}`);
}

//删除地址
export function deleteAddressApi(id: string | number){
  return http.delete(`/address/${id}`);
}
