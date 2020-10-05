// utils/admin.js
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
  checkHasLoggedIn
}