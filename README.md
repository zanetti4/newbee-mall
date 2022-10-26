# newbee-mall

## 前言
本项目仿照 [vue3-jsx-shop](https://github.com/xiaocheng555/vue3-jsx-shop) 项目进行开发，仅用来学习如何应用 vue 3和 typescript。

## 技术栈
``` bash
Vue 3.2.6: 构建项目，属于底层框架。
Vue-Router: 路径和视图是一一映射的，配置映射的规则。
Vuex: Vue官方提供的状态管理模式。
Axios: http请求模块。
ES6: 较新的Javascript语法。
vant: 轻量、可靠的移动端 Vue 组件库。
less: 动态样式表语言。
less-loader: 将 less 编译为 css。
js-md5: 一个简单的 javascript MD5 哈希函数，支持 utf-8 编码。
typescript: javascript 的超集。
vite: 下一代前端开发与构建工具。
```

## 路由设计及功能
- Home: 首页，焦点图展示主推商品，用图标展示各个子功能。又有3个主题：新品上线、热门商品、最新推荐，每个主题展示几款有代表性的商品。底部有标签栏，由首页、分类、购物车、我的组成。
- Login: 登录页，输入用户名、密码登录，也能去原项目注册。
- User: 用户页，显示已登录的用户信息，以及我的订单、账号管理、地址管理、关于我们的路由入口。
    - Address: 地址管理页，显示已保存的地址列表，可以新增地址，在地址编辑界面可以对地址进行编辑、删除。
    - Setting: 账号管理页，可以修改昵称、个性签名、密码，还能在此退出登录。
    - About: 关于我们页，对该项目的简单介绍。
- Cart: 购物车页，显示其中的商品列表，可对每款商品的购买数量进行修改。显示勾选商品的总价，然后提交订单。
- OrderCreate: 订单创建页，显示默认收货地址，可以选择其它地址。展示该订单的每款商品，还有总价。生成订单时可以进行模拟支付。
- OrderDetail: 订单详情页，显示订单信息，根据状态的不同，有支付和取消按钮。还有该订单的商品列表。
- OrderList: 订单列表页，根据订单状态分别显示订单长列表。共有6种状态：待付款、待确认、待发货、已发货、交易完成、手动关闭，还能查看全部订单。
- Category: 分类页，展示商品分类，有3级类别，点击第三级分类，跳转至该分类下的商品列表页。
- ProductList: 商品列表页，根据推荐、新品、价格3种排序，展示商品长列表。可在顶部输入关键字，进行搜索。
- ProductDetail: 商品详情页，展示商品大图、名称、快递信息、单价、详细介绍。可将商品加入购物车，并前去查看。

## 项目结构
``` bash
│  App.vue // 组件总入口
│  env.d.ts // 声明 vue 模块
│  main.ts // 项目的总入口
│  tree.txt // 项目结构
│  
├─@types
│      res.d.ts // 声明命名空间
│      
├─Apis // 封装接口
│      address.ts // 地址
│      cart.ts // 购物车
│      good.ts // 商品
│      home.ts // 首页
│      order.ts // 订单
│      user.ts // 用户
│      
├─assets // 静态文件
│  └─styles // 样式文件
│          common.less // 自定义样式
│          index.less // 汇总样式
│          reset.less // 默认样式
│          
├─components // 自定义组件
│  ├─GoodsItem // 某款商品
│  │      index.less
│  │      index.tsx
│  │      
│  ├─Navbar // 顶部导航
│  │      index.less
│  │      index.tsx
│  │      
│  ├─OrderItem // 某个订单
│  │      index.vue
│  │      
│  └─Tabbar // 底部标签栏
│          index.less
│          index.tsx
│          
├─config // 配置基础请求地址
│      index.ts
│      
├─router // 路由信息
│      index.ts
│      
├─store // vuex
│      index.ts
│      
├─utils // 通用文件
│      http.d.ts // 重写 axios 实例
│      http.ts // 设置 axios
│      index.ts // 自定义方法
│      
└─views // 视图
    ├─cart // 购物车
    │      index.vue
    │      
    ├─category // 分类
    │      index.vue
    │      
    ├─home // 首页
    │      index.less
    │      index.tsx
    │      
    ├─login // 登录
    │      index.vue
    │      
    ├─order // 订单
    │  ├─create // 订单创建
    │  │      index.vue
    │  │      
    │  ├─detail // 订单详情
    │  │      index.vue
    │  │      
    │  └─list // 订单列表
    │          index.vue
    │          OrderList.vue
    │          
    ├─product // 商品
    │  ├─detail // 商品详情
    │  │      index.vue
    │  │      
    │  └─list // 商品列表
    │          index.vue
    │          
    └─user // 用户
        ├─about // 关于我们
        │      index.tsx
        │      
        ├─address // 地址管理
        │  │  index.tsx // 地址列表
        │  │  
        │  └─AddressEdit // 添加、编辑地址
        │          index.tsx
        │          
        ├─main // 我的
        │      index.less
        │      index.tsx
        │      
        └─setting // 账号管理
                index.less
                index.tsx
```

## 心得体会&技术难点
> 这是我第一次在 vue 项目中使用 typescript，因为之前已经用 js 写了一遍该项目，所以这次感觉容易一些。同时我是参照别人的已有项目开发的，降低了开发难度，也让我在实践技术过程中少走了很多弯路。更多的是在 vue、vant、ts、vite 官网查看相关文档，这能让我很快熟悉那些常用技术。我在遇到问题时还能向人家请教，非常感谢前人们的辛苦付出！
1. 在用 NavBar 组件制作顶部导航时，右侧的图标不能显示。  
**解决办法：**  
```javascript
<NavBar {...navProps}>
  {toRaw(context.slots)}
</NavBar>
```
NavBar 组件里的插槽需要从 Proxy 转为原始值。  
2. 在订单创建页选择地址。  
**解决办法：**  
没有真正切换路由，而是通过 route.query.page 进行判断，显示页面内容。
```javascript
//点击地址
const openAddressPage = () => {
  router.replace({
    query: {
      ...route.query,
      page: 'address',
    },
  });
}
```
3. 代码中多处用到 Res.Data 类型，一开始不清楚是从哪儿来的。  
**解决办法：**  
res.d.ts 中进行了声明，声明命名空间 Res。
```typescript
declare namespace Res {
  //响应数据
  export interface Data <T> {
    data?: T;
    message: string | undefined;
    resultCode: number;
  }
}
```
4. 订单创建页中，类似于信封上的重复线性渐变如何实现？  
**解决办法：**  
```less
&::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: -webkit-repeating-linear-gradient(135deg,#ff6c6c 0,#ff6c6c 20%,transparent 0,transparent 25%,#1989fa 0,#1989fa 45%,transparent 0,transparent 50%);
    background: repeating-linear-gradient(-45deg,#ff6c6c 0,#ff6c6c 20%,transparent 0,transparent 25%,#1989fa 0,#1989fa 45%,transparent 0,transparent 50%);
    background-size: 80px;
}
```
5. 在地址管理页的地址编辑界面，地址信息中需要 areaCode，如何得来？  
**解决办法：**  
需要自己封装函数，通过已知的省市区中文和地区数据，筛选出唯一对应的地区代码。
---
## 安装

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```