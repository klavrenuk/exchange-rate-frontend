import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

export function bootstrap() {
  const app = createApp(App)
  app.use(Antd)
  app.mount('#app')
}
