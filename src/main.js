import 'vue-toast-notification/dist/theme-bootstrap.css';
import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Antd from "ant-design-vue";
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import * as MdIcons from 'oh-vue-icons/icons/md';
import ToastPlugin from 'vue-toast-notification';

const Md = Object.values({ ...MdIcons })
addIcons(...Md)

const app = createApp(App)
app.use(Antd);

app.use(router)
app.use(ToastPlugin,{
    position:'bottom-right'
})
app.component('v-icon', OhVueIcon)
app.mount('#app')
