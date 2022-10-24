import {defineComponent, toRaw} from 'vue';
import {NavBar} from 'vant';
import {useRouter} from 'vue-router';
import './index.less';

export default defineComponent({
  name: 'Navbar',
  props: {
    title: String,
    border: Boolean,
    leftText: String,
    rightText: String,
    leftArrow: Boolean,
    placeholder: Boolean,
    safeAreaInsetTop: Boolean,
    fixed: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 5,
    },
  },
  setup(props, context){
    const router = useRouter();
    
    const navProps = {
      'onClick-left': () => router.back(),
      ...props,
      ...context.attrs,
    }
    
    return () => (
      <div class="navbar-wrap">
        <NavBar {...navProps}>
          {toRaw(context.slots)}
        </NavBar>
      </div>
    )
  },
});