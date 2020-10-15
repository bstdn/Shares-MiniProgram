// pages/coupon/index.js
const WXAPI = require('apifm-wxapi')
const behavior = require('../../utils/behavior')
const AUTH = require('../../utils/auth')

Component({
  behaviors: [behavior],
  data: {
    bannerList: []
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
      this.getBannerList()
    }
  },
  methods: {
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      AUTH.checkHasLoggedIn().then(loggedIn => {
        if (loggedIn) {
          this.getUserApiInfo()
        } else {
          this.setData({
            apiUserInfoMap: null
          })
        }
      })
    },
    /**
     * 用户点击右上角转发
     */
    onShareAppMessage: function () {
      return {
        title: wx.getStorageSync('couponShareTitle'),
        imageUrl: wx.getStorageSync('imageShare')
      }
    },
    getBannerList: function () {
      const params = {
        type: 'coupon'
      }
      WXAPI.banners(params).then(res => {
        if (res.code === 0) {
          this.setData({
            bannerList: res.data
          })
        }
      })
    },
    tapShare: function (e) {
      const item = this.data.bannerList[e.currentTarget.id]
      const content = {
        appId: item.remark,
        path: item.linkUrl
      }
      wx.navigateToMiniProgram({
        ...content,
        success: () => {
          this.saveJson(content)
        }
      })
    },
    saveJson: function (content) {
      if (this.data.apiUserInfoMap) {
        const params = {
          content: JSON.stringify(content),
          token: wx.getStorageSync('token'),
          type: 'coupon'
        }
        WXAPI.jsonSet(params)
      }
    }
  }
})