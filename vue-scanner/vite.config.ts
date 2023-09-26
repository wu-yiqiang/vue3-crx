import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import webExtension from '@samrum/vite-plugin-web-extension'
import viteCompression from 'vite-plugin-compression'
import svgLoader from 'vite-svg-loader'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import manifest from './src/manifest'

//const __dirname = dirname(fileURLToPath(''))
const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir)
}
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    svgLoader(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [pathResolve('src/assets/svg/')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]'
    }),
    webExtension({
      manifest: {
        ...manifest,
      },
    }),
    viteCompression({
      verbose: true, // 是否在控制台中输出压缩结果
      disable: true,
      threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
      algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
      ext: '.gz',
      deleteOriginFile: true // 源文件压缩后是否删除(我为了看压缩后的效果，先选择了true)
    })
  ],
  server: {
    hmr: true,
    host: '0.0.0.0',
    port: 9999,
  },
  build: {
    // 最终构建的浏览器兼容目标
    target: 'es2015',
    // 是否自动注入module preload的polyfill
    polyfillModulePreload: true,
    // 指定混淆器
    minify: 'esbuild',
    // 启用css代码拆分
    cssCodeSplit: true,
    // 允许用户为css的压缩设置一个不同的浏览器target, 与build esbuild一致
    cssTarget: '',
    // 清空输入文件夹
    emptyOutDir: false,
    // 取消计算文件大小，加快打包速度
    reportCompressedSize: false,
    // 启用压缩大小报告,
    // brotliSize: false,
    // chunk大小警告的限制
    chunkSizeWarningLimit: 500,
    // 取消sourceMap， 加快打包速度,
    sourcemap: false,
    rollupOptions: {
      // input: ['index.html', 'src/background.ts', 'src/contentScript.ts'],
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules'))
            return id.toString().split('node_modules')[1].split('/')[0].toString()
        },
        entryFileNames: 'js/[name].hash.js',
        chunkFileNames: 'js/[name].hash.js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name
          if (fileName?.endsWith('.svg')) return 'img/svg/[name]-[hash][extname]'
          return 'css/[name]-[hash][extname]'
        }
      }
    }
  }
},
)
