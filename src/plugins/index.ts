/**
 * 用于指引入第三方插件
 */
import { App } from 'vue'
import VueMarkdownEditor from './mdEditor'

const pluginList = [
  VueMarkdownEditor
  // 如果还有其它插件，可以一并写在这里
]

const plugins = {
  install(app: App<Element>) {
    // 批量注册插件
    Object.entries(pluginList).forEach(([, v]) => {
      app.use(v)
    })
  }
}

export default plugins
