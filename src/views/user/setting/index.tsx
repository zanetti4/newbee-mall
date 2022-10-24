import {CellGroup, Field, Button, Toast} from 'vant';
import {ref} from 'vue';
import md5 from 'js-md5';
import {useRouter} from 'vue-router';
import Navbar from '@/components/Navbar';
import {getUserInfoApi, editUserInfoApi, logoutApi} from '@/Apis/user';
import './index.less';

export default {
  name: 'setting',
  setup(){
    const router = useRouter();

    const userInfo = ref({
      introduceSign: '',
      loginName: '',
      nickName: '',
      passwordMd5: '',
    });

    const saving = ref(false);
    const exiting = ref(false);

    //获取用户信息
    const fetchUserInfo = async () => {
      try {
        const res = await getUserInfoApi();
        const data = res.data;

        if(data){
          //用户信息存在
          userInfo.value = Object.assign(userInfo.value, data, {passwordMd5: ''});
        }
      } catch(err){
        console.error('获取用户信息失败', err);
      }
    }

    //保存
    const onSave = async () => {
      const {introduceSign, nickName, passwordMd5} = userInfo.value;

      try {
        saving.value = true;

        await editUserInfoApi({
          introduceSign,
          nickName,
          passwordMd5: passwordMd5.trim() !== '' ? md5(passwordMd5) : undefined,
        });

        Toast.success('保存成功');
      } catch(err){
        console.error('保存失败', err);
      } finally {
        saving.value = false;
      }
    }

    //退出登录
    const onExit = async () => {
      try {
        exiting.value = true;

        await logoutApi();
        router.push('/login')
      } catch(err){
        console.error('退出登录失败', err);
      } finally {
        exiting.value = false;
      }
    }

    fetchUserInfo();

    return () => {
      return (
        <div class="setting-page">
          <Navbar title="账号管理" leftArrow></Navbar>
          <CellGroup inset>
            <Field label="昵称" v-model={userInfo.value.nickName} />
            <Field label="个性签名" v-model={userInfo.value.introduceSign} />
            <Field label="修改密码" v-model={userInfo.value.passwordMd5} />
          </CellGroup>
          <div class="setting-action">
            <Button
              block
              round
              type="primary"
              native-type="submit"
              loading={saving.value}
              onClick={onSave}
            >保存</Button>
            <Button
              block
              round
              type="danger"
              native-type="submit"
              loading={exiting.value}
              onClick={onExit}
            >退出登录</Button>
          </div>
        </div>
      );
    }
  },
}
