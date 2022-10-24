import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: {
      name: 'Home',
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '@/views/home/index'),
  },
  {
    path: '/user',
    name: 'user',
    component: () => import(/* webpackChunkName: "User" */ '@/views/user/main/index'),
  },
  {
    path: '/user/address',
    name: 'address',
    component: () => import(/* webpackChunkName: "Address" */ '@/views/user/address/index'),
  },
  {
    path: '/user/setting',
    name: 'setting',
    component: () => import(/* webpackChunkName: "Setting" */ '@/views/user/setting/index'),
  },
  {
    path: '/user/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "About" */ '@/views/user/about/index'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/login/index.vue'),
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import(/* webpackChunkName: "Cart" */ '@/views/cart/index.vue'),
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: () => import(/* webpackChunkName: "ProductDetail" */ '@/views/product/detail/index.vue'),
  },
  {
    path: '/product/list',
    name: 'product-list',
    component: () => import(/* webpackChunkName: "ProductList" */ '@/views/product/list/index.vue'),
  },
  {
    path: '/order/create',
    name: 'order-create',
    component: () => import(/* webpackChunkName: "OrderCreate" */ '@/views/order/create/index.vue'),
  },
  {
    path: '/order/list',
    name: 'order-list',
    component: () => import(/* webpackChunkName: "OrderList" */ '@/views/order/list/index.vue'),
  },
  {
    path: '/order/:id',
    name: 'order-detail',
    component: () => import(/* webpackChunkName: "OrderDetail" */ '@/views/order/detail/index.vue'),
  },
  {
    path: '/category',
    name: 'category',
    component: () => import(/* webpackChunkName: "Category" */ '@/views/category/index.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
