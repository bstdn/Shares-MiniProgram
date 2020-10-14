// pages/coupon/index.js
const WXAPI = require('apifm-wxapi')

Component({
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
      wx.navigateToMiniProgram({
        appId: item.remark,
        path: item.linkUrl
      })
    }
  }
})