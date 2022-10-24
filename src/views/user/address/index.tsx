import {ref, computed, defineComponent} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {AddressList, AddressListAddress, Toast} from 'vant';
import Navbar from '@/components/Navbar';
import {getAddressListApi, AddressItemResData} from '@/Apis/address';
import AddressEdit from './AddressEdit';

export default defineComponent({
  name: 'address',
  props: {
    navBack: {
      type: Function,
    },
    switchable: {
      type: Boolean,
      default: false,
    },
    defaultId: {
      type: Number,
    },
  },
  setup(props, context){
    const route = useRoute();
    const router = useRouter();
    const chosenAddressId = ref(props.defaultId);
    const addressList = ref<AddressListAddress[]>([]);

    const showEditAddress = computed(() => {
      return ['add', 'edit'].includes(String(route.query.addressType));
    });

    //返回
    const onBack = () => {
      if(props.navBack){
        //有 navBack 属性
        props.navBack?.();
      }else{
        //没有 navBack 属性
        router.back();
      }
    }

    //调整地址数据格式
    const adapterAddressList = (data: AddressItemResData[]) => {
      return data.map(item => {
        const {provinceName, cityName, regionName, detailAddress} = item;
        const address = [provinceName, cityName, regionName, detailAddress].join(' ');

        return {
          address,
          id: item.addressId,
          name: item.userName,
          tel: item.userPhone,
          isDefault: item.defaultFlag === 1,
        } as AddressListAddress
      });
    }

    //获取地址列表
    const fetchAddressList = async () => {
      const toast = Toast.loading('加载中……');

      try {
        const res = await getAddressListApi();
        const data = res.data || [];

        addressList.value = adapterAddressList(data);
      } catch(err){
        console.error('获取地址列表失败', err);
      } finally {
        toast.clear();
      }
    }

    fetchAddressList();

    //切换选中的地址时触发
    const onSelectItem = (address: AddressListAddress) => {
      context.emit('select', address);
    }

    //点击新增按钮时触发
    const onAdd = () => {
      router.replace({
        query: {
          ...route.query,
          addressType: 'add',
        },
      });
    }

    //点击编辑按钮时触发
    const onEdit = (item: AddressListAddress) => {
      router.replace({
        query: {
          ...route.query,
          addressType: 'edit',
          addressId: item.id,
        },
      });
    }
    
    //从编辑地址页返回
    const showCurrPage = (change: boolean) => {
      router.replace({
        query: {
          ...route.query,
          addressType: undefined,
          addressId: undefined,
        },
      });
      
      change && fetchAddressList();
    }

    return () => {
      return (
        <>
          {
            !showEditAddress.value ?
              //地址列表
              (
                <div>
                  <Navbar
                    title="地址管理"
                    leftArrow
                    onClick-left={onBack}
                  ></Navbar>
                  <AddressList
                    v-model={chosenAddressId.value}
                    list={addressList.value}
                    default-tag-text="默认"
                    switchable={props.switchable}
                    onSelect={onSelectItem}
                    onAdd={onAdd}
                    onEdit={onEdit}
                  ></AddressList>
                </div>
              )
              :
              //编辑地址
              (
                <AddressEdit onBack={showCurrPage}></AddressEdit>
              )
          }
        </>
      );
    }
  },
});
