// utils/admin.js
const util = require('./util')
const ADMIN_API_BASE_URL = 'https://user.api.it120.cc'

const request = function request(url, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: ADMIN_API_BASE_URL + url,
      method,
      data,
      header: {
        'X-Token': wx.getStorageSync('x-token'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.data.code === 100000) {
          const content = '登录超时，请重新登录'
          if (util.getCurrentPageUrl() !== '/pages/admin/index') {
            wx.showModal({
              title: '提示',
              content,
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  wx.removeStorageSync('x-token')
                  wx.navigateTo({
                    url: '/pages/admin/index',
                  })
                }
              }
            })
          } else {
            wx.removeStorageSync('x-token')
            wx.showToast({
              title: content,
              icon: 'none'
            })
          }
          reject('error')
        }
        resolve(res.data)
      },
      fail: error => {
        reject(error)
      }
    })
  })
}

const checkToken = function checkToken() {
  return request('/user/checkToken', 'get', {})
}

async function checkHasLoggedIn() {
  const token = wx.getStorageSync('x-token')
  if (!token) {
    return false
  }
  const res = await checkToken()
  if (res.code !== 0) {
    wx.removeStorageSync('x-token')
    return false
  }
  return true
}

module.exports = {
  request,
  login: data => {
    return request('/login/userName/v2', 'post', data)
  },
  userInfo: () => {
    return request('/user/info', 'get', {})
  },
  apiExtNewsSave: data => {
    return request('/user/apiExtNews/save', 'post', data)
  },
  apiExtNewsList: data => {
    return request('/user/apiExtNews/list', 'post', data)
  },
  checkHasLoggedIn
}