import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    proxy:{
      '/api':{                                       // /api 字符串前缀匹配，不是关键字
        target:'http://127.0.0.1:3000',             // 跨域解决：转发到目标服务器地址 127.0.0.1 是本地服务器地址
        changeOrigin:true,                            // 改变源服务器地址，将 /api 前缀去掉
        rewrite:(path)=>path.replace(/^\/api/,'')    // 重写路径，正则表达 /表达式/，^/api 表示以 /api 开头的路径，注意 \ 转义
      }
    }
  }
})
