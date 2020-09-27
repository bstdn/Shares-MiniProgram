// pages/about/index.js
Component({
  data: {
    star_badge: true,
    author_badge: true
  },
  methods: {
    onShow: function () {
      this.setData({
        star_badge: wx.getStorageSync('star_badge') === false ? false : true,
        author_badge: wx.getStorageSync('author_badge') === false ? false : true
      })
    },
    showStar: function () {
      wx.previewImage({
        urls: [
          wx.getStorageSync('image_star')
        ]
      })
      this.setData({
        star_badge: wx.setStorageSync('star_badge', false)
      })
    },
    showAuthor: function () {
      wx.previewImage({
        urls: [
          wx.getStorageSync('image_author')
        ]
      })
      this.setData({
        author_badge: wx.setStorageSync('author_badge', false)
      })
    },
    showComingSoon: function () {
      wx.showToast({
        title: '开发中，马上来',
        icon: 'none',
        duration: 3000
      })
    }
  }
})