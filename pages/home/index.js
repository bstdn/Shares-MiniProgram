// pages/home/index.js
const WXAPI = require('apifm-wxapi')

Component({
  data: {
    answerTips: '',
    answerList: []
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
      this.setAnswerTips()
      this.getAnswerList()
    }
  },
  methods: {
    /**
     * 用户点击右上角转发
     */
    onShareAppMessage: function () {
      return {
        title: wx.getStorageSync('shareTitle') || undefined,
        imageUrl: '/images/shares.png'
      }
    },
    /**
     * 监听用户下拉刷新事件
     */
    onPullDownRefresh: function () {
      this.getAnswerList()
    },
    setAnswerTips: function () {
      const answerTips = wx.getStorageSync('answerTips')
      if (answerTips) {
        this.setData({
          answerTips
        })
      } else {
        WXAPI.queryConfigValue('answerTips').then(res => {
          if (res.code === 0) {
            this.setData({
              answerTips: res.data
            })
            wx.setStorageSync('answerTips', res.data)
          }
        })
      }
    },
    async getAnswerList() {
      const params = {
        page: 1,
        pageSize: wx.getStorageSync('answerPageSize') || 20,
        categoryId: wx.getStorageSync('answerCategoryId')
      }
      wx.showToast({
        title: '数据加载中',
        icon: 'loading'
      })
      const res = await WXAPI.cmsArticles(params)
      if (res.code === 0) {
        this.setData({
          answerList: res.data
        })
      }
      wx.stopPullDownRefresh()
      wx.hideToast()
    }
  }
})