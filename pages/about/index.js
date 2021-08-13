// pages/about/index.js
const behavior = require('../../utils/behavior')
const AUTH = require('../../utils/auth')
const CONFIG = require('../../config')

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
      for (const key of ['star', 'author', 'feedback', 'share']) {
        this.setData({
          [`badgeData.${key}`]: wx.getStorageSync(key + '_badge') !== false
        })
      }
      this.setData({
        version: CONFIG.version
      })
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
        title: wx.getStorageSync('shareTitle') || undefined,
        path: '/pages/home/index',
        imageUrl: '/images/shares.png'
      }
    },
    goAdmin: function () {
      wx.navigateTo({
        url: '../admin/index',
      })
    },
    goBadmintonScore: function () {
      wx.navigateTo({
        url: '../badminton_score/index',
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
          wx.getStorageSync('imageStar')
        ]
      })
      this.badgeChange('star')
    },
    showAuthor: function () {
      wx.previewImage({
        urls: [
          wx.getStorageSync('imageAuthor')
        ]
      })
      this.badgeChange('author')
    },
    aboutMe: function () {
      wx.showModal({
        title: '关于',
        content: wx.getStorageSync('aboutMe'),
        showCancel: false
      })
    }
  }
})