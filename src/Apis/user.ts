import http from '@/utils/http';

export interface UserInfo {
  introduceSign: string;
  loginName: string;
  nickName: string;
}

//获取用户信息
export function getUserInfoApi(){
  return http.get<UserInfo>('/user/info');
}

//退出登录
export function logoutApi(){
  return http.post('/user/logout');
}

export interface LoginParams {
  loginName: string;
  passwordMd5: string;
}

type token = string;

//登录
export function loginApi(params: LoginParams){
  return http.post<token>('/user/login', params);
}

export interface EditUserParams {
  introduceSign?: string;
  loginName?: string;
  nickName?: string;
  passwordMd5?: string;
}

//保存
export function editUserInfoApi(params: EditUserParams){
  return http.put('/user/info', params);
}
