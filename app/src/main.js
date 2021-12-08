import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import CONST from './others/Constants'
import VueAxios from 'vue-axios'
import PrimeVue from 'primevue/config';
import store from './store'
import EqualVue from 'equal-vue'
import 'equal-vue/dist/style.css'
import ToastService from 'primevue/toastservice';
import MessagePlugin from '@/utils/message.plugin';
import api from "@/api";

import locale from "@/utils/ru.primevue.js";//Русский язык для primevue
import Block from './components/Block'


//import 'primevue/resources/themes/lara-light-indigo/theme.css';

let Vue = createApp(App);
Vue.component('block', Block)

Vue.use(store)
.use(router)
.use(CONST)
.use(EqualVue)
.use(PrimeVue, {locale})
.use(ToastService)
.use(VueAxios, axios)
.use(MessagePlugin)
.use(api)
.mount('#app')
