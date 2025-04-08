import 'vue-toast-notification/dist/theme-bootstrap.css';
import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Antd from "ant-design-vue";
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import * as Icons from 'oh-vue-icons/icons';
import ToastPlugin from 'vue-toast-notification';

const icons = Object.values({ ...Icons })
addIcons(...icons)

const app = createApp(App)
app.use(Antd);

app.use(router)
app.use(ToastPlugin,{
    position:'bottom-right'
})
app.component('v-icon', OhVueIcon)
app.mount('#app')
