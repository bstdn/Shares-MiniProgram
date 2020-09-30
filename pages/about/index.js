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
    },
    /**
     * 在组件实例进入页面节点树时执行
     */
    attached: function () {
      for (const key of ['star', 'author', 'feedback', 'share']) {
        this.setData({
          [`badgeData.${key}`]: wx.getStorageSync(key + '_badge') === false ? false : true
        })
      }
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