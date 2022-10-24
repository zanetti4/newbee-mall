//请求响应数据
declare namespace Res {
  //响应数据
  export interface Data <T> {
    data?: T;
    message: string | undefined;
    resultCode: number;
  }
  
  //响应数据分页
  export interface Page <T> {
    currPage: number;
    list: T[];
    pageSize: number;
    totalCount: number;
    totalPage: number;
  }
}