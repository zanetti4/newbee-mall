import {defineConfig} from 'vite';
import {resolve} from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import styleImport from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(), //支持 jsx 语法
    //按需导入组件库样式
    styleImport({
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle(name){
            return `vant/es/${name}/style`;
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  base: './', //打包路径
  server: {
    port: 5000, //开发服务器端口
    open: true, //在开发服务器启动时自动在浏览器中打开应用程序
    cors: true, //允许跨域
  },
});