const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:"./",
  pwa:{
    name: 'Music', // 名字
    themeColor: "#ffffff", // 背景颜色
    appleMobileWebAppCapable: true, // 苹果WebApp支持

    // manifest 设置
    manifestOptions: {
      name: 'Music Player',
      short_name: "Music",
      theme_color: "#ffffff",
      start_url: ".",
      display: "standalone",
      background_color: "#000000"
    },

    // 图标
    iconPaths: {
      faviconSVG: '',
      favicon32: 'img/icons/favicon32.ico',
      favicon16: 'img/icons/favicon16.ico',
      appleTouchIcon: 'img/icons/icons_square_medium.png',
      maskIcon: '',
      msTileImage: ''
    }
  }
})
