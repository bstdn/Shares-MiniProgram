// pages/sign/index.js
const WXAPI = require('apifm-wxapi')
const util = require('../../utils/util')

Component({
  data: {
    loading: false,
    sign_tips: '',
    currentId: undefined,
    firstSign: '',
    secondSign: '',
    signLog: []
  },
  lifetimes: {
    /**
     * 在组件实例进入页面节点树时执行
     */
    attached: function () {
      this.setSignTips()
    }
  },
  methods: {
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      this.getDetail()
    },
    getDetail: function () {
      WXAPI.jsonList({
        page: 1,
        pageSIze: 1,
        type: 'sign',
        token: wx.getStorageSync('token')
      }).then(res => {
        if (res.code === 0) {
          const id = res.data[0].id
          const dateAdd = util.parseTime(res.data[0].dateAdd, '{y}-{m}-{d}')
          const currentTime = util.parseTime(new Date(), '{y}-{m}-{d}')
          if (dateAdd === currentTime) {
            this.setData({
              ...res.data[0].jsonData,
              currentId: id
            })
          }
        }
      })
    },
    setSignTips: function () {
      const sign_tips = wx.getStorageSync('sign_tips')
      if (sign_tips) {
        this.setData({
          sign_tips
        })
      } else {
        WXAPI.queryConfigValue('sign_tips').then(res => {
          if (res.code === 0) {
            this.setData({
              sign_tips: res.data
            })
            wx.setStorageSync('sign_tips', res.data)
          }
        })
      }
    },
    handleSign: function () {
      const token = wx.getStorageSync('token')
      if (!token) {
        wx.showModal({
          title: '提示',
          content: '请先登录',
          success: res => {
            if (res.confirm) {
              wx.switchTab({
                url: '../about/index',
              })
            }
          }
        })
        return
      }
      this.setData({
        loading: true
      })
      const signLogLength = wx.getStorageSync('signLog_length') || 20
      const currentTime = new Date()
      const signLog = [...this.data.signLog]
      signLog.unshift(util.parseTime(currentTime))
      if (signLog.length >= signLogLength) {
        signLog.pop()
      }
      const content = {
        firstSign: this.data.currentId ? this.data.firstSign : util.parseTime(currentTime, '{h}:{i}'),
        secondSign: this.data.currentId ? util.parseTime(currentTime, '{h}:{i}') : this.data.secondSign,
        signLog
      }
      let params = {
        content: JSON.stringify(content),
        type: 'sign',
        token
      }
      if (this.data.currentId) {
        params.id = this.data.currentId
      }
      WXAPI.jsonSet(params).then(res => {
        if (res.code === 0) {
          wx.showToast({
            title: '打卡成功',
            icon: 'none'
          })
          this.setData({
            loading: false,
            currentId: res.data,
            ...content
          })
        }
      })
    }
  }
})