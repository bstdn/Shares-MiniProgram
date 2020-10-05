// pages/about/index.js
const behavior = require('../../utils/behavior')
const AUTH = require('../../utils/auth')

Component({
  behaviors: [behavior],
  data: {
    badgeData: {}
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
      for (const key of ['star', 'sign', 'author', 'feedback', 'share']) {
        this.setData({
          [`badgeData.${key}`]: wx.getStorageSync(key + '_badge') !== false
        })
      }
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
        }
      })
    },
    /**
     * 用户点击右上角转发
     */
    onShareAppMessage: function () {
      return {
        title: wx.getStorageSync('share_title') || undefined,
        path: '/pages/home/index',
        imageUrl: '/images/shares.png'
      }
    },
    goSign: function () {
      this.badgeChange('sign')
      wx.navigateTo({
        url: '../sign/index',
      })
    },
    goAdmin: function () {
      wx.navigateTo({
        url: '../admin/index',
      })
    },
    clickBadge: function (e) {
      this.badgeChange(e.currentTarget.id)
    },
    badgeChange: function (key, value = false) {
      this.setData({
        [`badgeData.${key}`]: value
      })
      wx.setStorageSync(key + '_badge', value)
    },
    showStar: function () {
      wx.previewImage({
        urls: [
          wx.getStorageSync('image_star')
        ]
      })
      this.badgeChange('star')
    },
    showAuthor: function () {
      wx.previewImage({
        urls: [
          wx.getStorageSync('image_author')
        ]
      })
      this.badgeChange('author')
    },
    aboutMe: function () {
      wx.showModal({
        title: '关于',
        content: wx.getStorageSync('about_me'),
        showCancel: false
      })
    }
  }
})