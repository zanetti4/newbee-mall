import axios, {AxiosRequestConfig, AxiosError, AxiosResponse} from 'axios';
import {Toast} from 'vant';
import appConfig from '@/config/index';
import {httpInstance} from './http.d';
import router from '@/router/index';

//创建 axios 实例
const http: httpInstance = axios.create({
  baseURL: appConfig.baseUrl,
  timeout: 5000,
});

//请求拦截
http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    //请求之前做些什么
    config.headers.token = window.localStorage.getItem('token');
    return config;
  },
  (error: AxiosError) => {
    //对请求的错误做些什么
    console.error('[接口请求错误]: ', error);
    return Promise.reject(error);
  }
);

//响应拦截
http.interceptors.response.use(
  (response: AxiosResponse) => {
    const res: Res.Data<any> = response.data;
    
    if(res.resultCode === 200){
      //响应正常
      return res;
    }else{
      //响应异常
      if(res.resultCode === 416){
        //处理登录失效
        Toast.fail('登录失效');
        router.push('/login');
      }else if(res.message && res.resultCode){
        //统一错误处理
        Toast.fail(res.message);
      }
      
      return Promise.reject(createAxiosError(response));
    }
  },
  (error: AxiosError) => {
    if(error.message === 'Network Error'){
      //网络错误
      Toast('请检查网络连接');
    }
    
    console.error('[接口响应错误]：', error);
    return Promise.reject(error);
  }
);

//创建 axios 错误
function createAxiosError(response: AxiosResponse){
  const error = new Error() as AxiosError;
  
  error.isAxiosError = true;
  error.response = response;
  error.config = response.config;
  error.toJSON = () => ({});
  return error;
}

//处理错误响应
export function resolveResError<T = any>(error: any): Res.Data<T> | undefined{
  return error?.response?.data;
}

export default http;