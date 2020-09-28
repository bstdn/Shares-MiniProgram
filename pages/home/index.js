// pages/home/index.js
const WXAPI = require('apifm-wxapi')

Component({
  data: {
    answer_tips: '',
    answer_list: []
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
        title: wx.getStorageSync('share_title') || undefined,
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
      const answer_tips = wx.getStorageSync('answer_tips')
      if (answer_tips) {
        this.setData({
          answer_tips
        })
      } else {
        WXAPI.queryConfigValue('answer_tips').then(res => {
          if (res.code === 0) {
            this.setData({
              answer_tips: res.data
            })
            wx.setStorageSync('answer_tips', res.data)
          }
        })
      }
    },
    async getAnswerList() {
      const params = {
        page: 1,
        pageSize: 20,
        categoryId: wx.getStorageSync('answer_cid')
      }
      wx.showToast({
        title: '数据加载中',
        icon: 'loading'
      })
      const res = await WXAPI.cmsArticles(params)
      console.log('res', res)
      if (res.code === 0) {
        this.setData({
          answer_list: res.data
        })
      }
      wx.stopPullDownRefresh()
      wx.hideToast()
    }
  }
})