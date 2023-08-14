import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
// import router from './router'
global.Buffer = global.Buffer || require('buffer').Buffer
createApp(App).mount('#app')
