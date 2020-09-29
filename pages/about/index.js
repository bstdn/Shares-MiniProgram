// pages/about/index.js
Component({
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
    }
  },
  methods: {
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
    onShow: function () {
      for (const key of ['star', 'author', 'feedback', 'share']) {
        this.setData({
          [`badgeData.${key}`]: wx.getStorageSync(key + '_badge') === false ? false : true
        })
      }
    },
    clickBadge: function (e) {
      this.badgeChange(e.currentTarget.id, false)
    },
    badgeChange: function (key, value = false) {
      this.setData({
        [`formData.${key}_badge`]: wx.setStorageSync(key + '_badge', value)
      })
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