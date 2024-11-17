import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

// 设置请求拦截器
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers['token'] = `${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 将axios挂载到Vue的原型上，使其在组件中可用
Vue.prototype.$http = axios;


Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
