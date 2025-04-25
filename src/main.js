import 'vue-toast-notification/dist/theme-bootstrap.css';
import './assets/main.css';

import { addIcons, OhVueIcon } from 'oh-vue-icons'; // Import OhVueIcon
import * as Icons from 'oh-vue-icons/icons';

import { createApp } from 'vue';
import ToastPlugin from 'vue-toast-notification';

import App from './App.vue';
import router from './router';

const icons = Object.values({ ...Icons })
addIcons(...icons)
const app = createApp(App)

app
  .use(router)
  .use(ToastPlugin, { position: 'bottom-right' })
  .component('v-icon', OhVueIcon)
  .mount('#app') // Removed v-icon registration
