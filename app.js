//app.js
const WXAPI = require('apifm-wxapi')
const CONFIG = require('./config')

App({
  onLaunch: function () {
    WXAPI.init(CONFIG.subDomain)
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: res => {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success: res => {
        if (res.networkType === 'none') {
          this.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    })
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(res => {
      if (!res.isConnected) {
        this.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000
        })
      } else {
        this.globalData.isConnected = true
        wx.hideToast()
      }
    })

    /**
     * 获取系统参数
     */
    WXAPI.queryConfigBatch('answer_cid,answer_tips,about_me,share_title,image_author,image_star').then(res => {
      if (res.code === 0) {
        res.data.forEach(config => {
          wx.setStorageSync(config.key, config.value)
        })
      }
    })
  },
  globalData: {
    isConnected: true
  }
})