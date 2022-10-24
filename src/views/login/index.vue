<template>
  <div class="login-page">
    <NavBar
      leftArrow
      title="登录"
      @click-left="goBack"
    ></NavBar>
    <div class="login-main">
      <CellGroup inset>
        <Field
          v-model="userForm.username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{
            required: true,
            message: '请填写用户名',
          }]"
        />
        <Field
          v-model="userForm.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{
            required: true,
            message: '请填写密码',
          }]"
        />
      </CellGroup>
      <div class="login-bnt-box">
        <Button
          block
          round
          type="primary"
          native-type="submit"
          :loading="logining"
          @click="handleLogin"
        >登录</Button>
        <br>
        <a href="http://47.99.134.126:5008/#/login">跳转到原项目注册</a>&nbsp;&nbsp;<a href="https://github.com/newbee-ltd/newbee-mall-vue3-app">原项目github</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {NavBar, CellGroup, Field, Button} from 'vant';
import {useRouter} from 'vue-router';
import {ref} from 'vue';
import md5 from 'js-md5';
import {loginApi} from '@/Apis/user';

const router = useRouter();

//后退
const goBack = () => {
  router.back();
}

const userForm = ref({
  username: '',
  password: '',
});

const logining = ref(false);

//登录
const handleLogin = async () => {
  try {
    logining.value = true;

    const {username, password} = userForm.value;

    const res = await loginApi({
      loginName: username,
      passwordMd5: md5(password),
    });

    const token = res.data;

    if(token){
      //token 存在
      window.localStorage.setItem('token', token);
      router.replace('/user');
    }
  } catch(err){
    console.error('登录失败', err);
  } finally {
    logining.value = false;
  }
}
</script>

<style lang="less" scoped>
.login-page {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f7f8fa;
}
.login-main {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.login-bnt-box {
  margin: 20px 16px;
}
</style>
