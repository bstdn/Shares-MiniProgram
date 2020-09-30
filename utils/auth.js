// utils/auth.js
const WXAPI = require('apifm-wxapi')

function checkSession() {
  return new Promise(resolve => {
    wx.checkSession({
      success: () => {
        return resolve(true)
      },
      fail: () => {
        return resolve(false)
      }
    })
  })
}

async function checkHasLoggedIn() {
  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  const loggedIn = await checkSession()
  if (!loggedIn) {
    wx.removeStorageSync('token')
    return false
  }
  const checkToken = await WXAPI.checkToken(token)
  if (checkToken.code !== 0) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

function login(page) {
  wx.login({
    success: res => {
      WXAPI.login_wx(res.code).then(res => {
        if (res.code === 10000) {
          register(page)
          return
        }
        if (res.code !== 0) {
          wx.showModal({
            title: '无法登录',
            content: res.msg,
            showCancel: false
          })
          return
        }
        wx.setStorageSync('token', res.data.token)
        wx.setStorageSync('uid', res.data.uid)
        if (page) {
          page.onShow()
        }
      })
    },
  })
}

function register(page) {
  wx.login({
    success: res => {
      const code = res.code
      wx.getUserInfo({
        success: res => {
          WXAPI.register_complex({
            code,
            encryptedData: res.encryptedData,
            iv: res.iv,
            referrer: wx.getStorageSync('referrer') || ''
          }).then(() => {
            login(page)
          })
        }
      })
    }
  })
}

function logout(){
  wx.removeStorageSync('token')
  wx.removeStorageSync('uid')
}

module.exports = {
  checkHasLoggedIn,
  login,
  register,
  logout
}