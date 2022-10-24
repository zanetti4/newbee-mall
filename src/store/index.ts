import {createStore} from 'vuex';

export interface State {
  cartCount: number
}

export default createStore<State>({
  state(){
    return {
      cartCount: 0,
    }
  },
  mutations: {
    //设置购物车商品数
    setCartCount(state, value: number){
      state.cartCount = value;
    },
  },
  actions: {},
  getters: {},
});