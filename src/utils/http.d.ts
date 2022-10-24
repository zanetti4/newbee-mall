import {AxiosInstance, AxiosRequestConfig} from 'axios';

//重写 axios 实例，将返回数据改为 Response.Data<T>
export interface httpInstance extends AxiosInstance {
  request<T = any, R = Res.Data<T>>(
    config: AxiosRequestConfig
  ): Promise<R>;
  get<T = any, R = Res.Data<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;
  delete<T = any, R = Res.Data<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;
  head<T = any, R = Res.Data<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;
  options<T = any, R = Res.Data<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;
  post<T = any, R = Res.Data<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R>;
  put<T = any, R = Res.Data<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R>;
  patch<T = any, R = Res.Data<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R>;
}