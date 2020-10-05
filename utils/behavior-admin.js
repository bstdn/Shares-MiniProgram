// utils/behavior.js
const ADMIN = require('./admin')

module.exports = Behavior({
  data: {
  },
  methods: {
    goLogin() {
      wx.navigateTo({
        url: '/pages/admin/index',
      })
    },
    goDashboard() {
      wx.navigateTo({
        url: '/pages/dashboard/index',
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