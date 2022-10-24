import {ref, computed, defineComponent} from 'vue';
import {useRoute} from 'vue-router';
import {AddressEdit, AddressEditInfo, Toast} from 'vant';
import { areaList } from '@vant/area-data';
import Navbar from '@/components/Navbar';
import {AddressItemResData, getAddressDetailApi, editAddressApi, deleteAddressApi, addAddressApi} from '@/Apis/address';

export default defineComponent({
  name: 'AddressEdit',
  emits: ['back'],
  setup(props, context){
    const route = useRoute();
    const addressInfo = ref<AddressEditInfo>({} as AddressEditInfo);
    const searchResult = ref([]);
    const saving = ref(false);
    const deleting = ref(false);

    const id = computed(() => {
      return route.query.addressId;
    });

    //通过省市代码前缀，找出对应区代码
    function diffCodes(countiesCode: string[], code: string, count = 2){
      const res: string[] = [];
      const targetPrefix = String(code).slice(0, count);

      for(let i = 0; i < countiesCode.length; i++){
        const currCode = countiesCode[i];
        const currPrefix = String(currCode).slice(0, count);

        if(currPrefix === targetPrefix){
          //前缀相同
          res.push(currCode);
        }
      }

      return res;
    }

    //获取地区代码
    const getAreaCode = (data: AddressItemResData) => {
      const {regionName, cityName, provinceName} = data;
      const {province_list: provinceList, city_list: cityList, county_list: countyList} = areaList;
      let countiesCode: string[] = [];
      let countyCode: keyof any

      for(countyCode in countyList){
        // @ts-ignore
        if(countyList[countyCode] === regionName){
          //区对应的代码
          countiesCode.push(countyCode);
        }
      }

      if(countiesCode.length <= 1){
        //找到唯一的区
        return countiesCode[0];
      }

      //全国有重名区
      for(const provinceCode in provinceList){
        // @ts-ignore
        if(provinceList[provinceCode] === provinceName){
          //省对应的代码
          countiesCode = diffCodes(countiesCode, provinceCode, 2);
        }
      }

      if(countiesCode.length <= 1){
        //找到唯一的区
        return countiesCode[0];
      }

      //该省有重名区
      for(const cityCode in cityList){
        // @ts-ignore
        if(cityList[cityCode] === cityName){
          //市对应的代码
          countiesCode = diffCodes(countiesCode, cityCode, 4);
        }
      }

      return countiesCode[0];
    }

    //获取地址详情
    const fetchAddressDetail = async () => {
      if(!id.value){
        //新增地址
        return;
      }

      const toast = Toast.loading('加载中……');

      try {
        const res = await getAddressDetailApi(id.value as string);
        const data: AddressItemResData = res.data || {};

        addressInfo.value = Object.assign(addressInfo.value, {
          name: data.userName,
          tel: data.userPhone,
          province: data.provinceName,
          city: data.cityName,
          county: data.regionName,
          addressDetail: data.detailAddress,
          areaCode: getAreaCode(data),
          isDefault: !!data.defaultFlag,
        });
      } catch(err){
        console.error('获取地址详情失败', err);
      } finally {
        toast.clear();
      }
    }

    fetchAddressDetail();

    //顶部导航后退
    const onBack = (change: boolean = true) => {
      context.emit('back', change);
    }

    //更新地址
    const updateAddress = async (content: AddressEditInfo) => {
      try {
        saving.value = true;

        await editAddressApi({
          addressId: id.value as string,
          cityName: content.city,
          defaultFlag: content.isDefault ? 1 : 0,
          detailAddress: content.addressDetail,
          provinceName: content.province,
          regionName: content.county,
          userName: content.name,
          userPhone: content.tel,
        });

        onBack();
      } catch(err){
        console.error('更新地址失败', err);
      } finally {
        saving.value = false;
      }
    }

    //新增地址
    const createAddress = async (content: AddressEditInfo) => {
      try {
        saving.value = true;

        await addAddressApi({
          cityName: content.city,
          defaultFlag: content.isDefault ? 1 : 0,
          detailAddress: content.addressDetail,
          provinceName: content.province,
          regionName: content.county,
          userName: content.name,
          userPhone: content.tel,
        });

        onBack();
      } catch(err){
        console.error('新增地址失败', err);
      } finally {
        saving.value = false;
      }
    }

    //点击保存
    const onSave = (content: AddressEditInfo) => {
      id.value ?
        //编辑
        updateAddress(content) :
        //新增
        createAddress(content)
    }

    //点击删除
    const onDelete = async () => {
      try {
        deleting.value = true;
        await deleteAddressApi(id.value as string);
        onBack();
      } catch(err){
        console.error('删除地址失败', err);
      } finally {
        deleting.value = false;
      }
    }

    return () => {
      return (
        <div>
          <Navbar
            title={id.value ? '地址编辑' : '地址新增'}
            leftArrow
            onClick-left={() => onBack(false)}
          ></Navbar>
          <AddressEdit
            address-info={addressInfo.value}
            area-list={areaList}
            show-set-default
            showDelete={id.value ? true : false}
            show-search-result
            search-result={searchResult.value}
            area-columns-placeholder={['请选择', '请选择', '请选择']}
            is-saving={saving.value}
            is-deleting={deleting.value}
            onSave={onSave}
            onDelete={onDelete}
          ></AddressEdit>
        </div>
      );
    }
  },
});
