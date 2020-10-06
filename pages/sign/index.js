// pages/sign/index.js
const behavior = require('../../utils/behavior')
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const util = require('../../utils/util')

Component({
  behaviors: [behavior],
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
     * 在组件实例刚刚被创建时执行
     */
    created: function () {
      wx.showShareMenu({
        withShareTicket: true
      })
    },
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
      AUTH.checkHasLoggedIn().then(loggedIn => {
        this.setData({
          wxLogin: loggedIn
        })
        if (loggedIn) {
          this.getUserApiInfo()
          this.getDetail()
        }
      })
    },
    /**
     * 用户点击右上角转发
     */
    onShareAppMessage: function () {
      let title = wx.getStorageSync('MiniProgram_name') || undefined
      if (title) {
        title += '-打卡'
      }
      return {
        title
      }
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
      if (!this.data.apiUserInfoMap) {
        this.showLogin()
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
        token: wx.getStorageSync('token'),
        type: 'sign'
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