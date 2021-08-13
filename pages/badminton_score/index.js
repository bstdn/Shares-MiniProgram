// pages/badminton_score/index.js
Component({
  data: {
    teamRed: 0,
    teamBlue: 1,
    name: ['红队', '蓝队'],
    score: [0, 0],
    heightLight: ['', ''],
    logs: [],
    slideLogsButtons: [{
      type: 'warn',
      text: '删除'
    }]
  },
  lifetimes: {
    /**
     * 在组件实例进入页面节点树时执行
     */
    attached: function () {
      this.setData({
        logs: wx.getStorageSync('badmintonScoreLogs') || []
      })
    }
  },
  methods: {
    /**
     * 用户点击右上角转发
     */
    onShareAppMessage: function () {
      return {
        title: '羽毛球比分记录'
      }
    },
    /**
     * 设置队名
     */
    setName: function (e) {
      this.setData({
        [`name[${e.currentTarget.id}]`]: e.detail.value
      })
    },
    /**
     * 加分
     */
    addScore: function (e) {
      const item = e.currentTarget.id
      const other = +item === 0 ? 1 : 0
      this.setData({
        [`score[${item}]`]: this.data.score[item] + 1,
        [`heightLight[${item}]`]: 'height-light',
        [`heightLight[${other}]`]: ''
      })
    },
    /**
     * 减分
     */
    reduceScore: function (e) {
      const item = e.currentTarget.id
      if (this.data.score[item] === 0) {
        return
      }
      this.setData({
        [`score[${item}]`]: this.data.score[item] - 1
      })
    },
    /**
     * 清空
     */
    clearScore: function () {
      this.setData({
        score: [0, 0],
        heightLight: ['', '']
      })
    },
    /**
     * 换场
     */
    switchCourt: function () {
      this.setData({
        teamRed: this.data.teamRed === 0 ? 1 : 0,
        teamBlue: this.data.teamBlue === 0 ? 1 : 0,
      })
    },
    /**
     * 结果
     */
    settlement: function () {
      const {
        teamRed,
        teamBlue,
        name,
        score,
        logs
      } = this.data
      logs.unshift(`${name[teamRed]} ${score[teamRed]} VS ${score[teamBlue]} ${name[teamBlue]}`)
      this.setData({
        logs
      })
      wx.setStorageSync('badmintonScoreLogs', logs)
      this.clearScore()
    },
    /**
     * 删除日志
     */
    slideLogsButtonTap: function (e) {
      const index = e.currentTarget.id
      const logs = this.data.logs
      if (e.detail.index === 0) {
        logs.splice(index, 1)
        this.setData({
          logs
        })
        wx.setStorageSync('badmintonScoreLogs', logs)
      }
    }
  }
})