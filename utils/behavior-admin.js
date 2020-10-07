// utils/behavior-admin.js
const ADMIN = require('./admin')

module.exports = Behavior({
  methods: {
    goHome() {
      wx.switchTab({
        url: '/pages/home/index',
      })
    },
    goLogin() {
      wx.navigateTo({
        url: '/pages/admin/index',
      })
    },
    goDashboard(e) {
      wx.navigateTo({
        url: '/pages/dashboard/index?current=' + e.currentTarget.dataset.current,
      })
    },
    adminLogout() {
      wx.removeStorageSync('x-token')
      wx.removeStorageSync('aid')
      this.setData({
        adminUserInfoMap: null
      })
    },
    getAdminUserInfo() {
      ADMIN.userInfo().then(res => {
        if (res.code === 0) {
          this.setData({
            adminUserInfoMap: res.data
          })
        }
      })
    }
  }
})