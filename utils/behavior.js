// utils/behavior.js
const WXAPI = require('apifm-wxapi')
const AUTH = require('./auth')

module.exports = Behavior({
  data: {
    wxLogin: true
  },
  methods: {
    cancelLogin() {
      this.setData({
        wxLogin: true
      })
    },
    goLogin() {
      this.setData({
        wxLogin: false
      })
    },
    logout() {
      wx.showModal({
        title: '提示',
        content: '确定要退出登录？',
        success: res => {
          if (res.confirm) {
            AUTH.logout()
            this.setData({
              apiUserInfoMap: null
            })
          }
        }
      })
    },
    processLogin(e) {
      if (!e.detail.userInfo) {
        wx.showToast({
          title: '已取消',
          icon: 'none'
        })
        return
      }
      AUTH.register(this)
    },
    getUserApiInfo() {
      WXAPI.userDetail(wx.getStorageSync('token')).then(res => {
        if (res.code === 0) {
          this.setData({
            apiUserInfoMap: res.data
          })
        }
      })
    }
  }
})