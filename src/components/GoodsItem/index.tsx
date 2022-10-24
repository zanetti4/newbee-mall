import {defineComponent, PropType} from 'vue';
import {useRouter} from 'vue-router';
import {GoodsRes} from '@/Apis/good';
import './index.less';

export default defineComponent({
  name: 'GoodsItem',
  props: {
    data: {
      type: Object as PropType<GoodsRes>,
      default: () => {},
    },
  },
  setup(props){
    const router = useRouter();
    
    //点击某商品
    const onClick = (goods: GoodsRes) => {
      router.push({
        path: `/product/${goods.goodsId}`,
      });
    }
    
    return () => {
      const goodsItem = props.data;
      let imgSrc = goodsItem.goodsCoverImg;
      
      if(typeof imgSrc === 'string' && imgSrc.indexOf('http') === -1){
        //图片路径是字符串，且不包含 http
        imgSrc = 'http://backend-api-01.newbee.ltd' + imgSrc;
      }
      
      return (
        <div 
          class="goods-item"
          onClick={() => onClick(goodsItem)}
        >
          <img
            alt="goodPic"
            class="goods-item-img"
            src={imgSrc}
          ></img>
          <p class="goods-item-name ell2">{goodsItem.goodsName}</p>
          <p class="goods-item-price">￥{goodsItem.sellingPrice}</p>
        </div>
      );
    }
  },
});