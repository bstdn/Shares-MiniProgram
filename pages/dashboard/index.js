// pages/dashboard/index.js
const behaviorAdmin = require('../../utils/behavior-admin')
const ADMIN = require('../../utils/admin')

Component({
  behaviors: [behaviorAdmin],
  data: {
    current: 0,
    tabbarList: [{
        "text": "答题",
        "iconPath": "/images/icon_answer.png",
        "selectedIconPath": "/images/icon_answer_active.png"
      },
      {
        "text": "审核",
        "iconPath": "/images/icon_examine.png",
        "selectedIconPath": "/images/icon_examine_active.png"
      }
    ],
    loading: false,
    formData: {
      title: '积分答题 招行答题',
      categoryId: wx.getStorageSync('answerCategoryId'),
      content: '1',
      descript: '1',
      keywords: '1'
    },
    rules: [{
      name: 'title',
      rules: {
        required: true,
        message: '请输入答案'
      }
    }],
    slideButtons: [{
      type: 'warn',
      text: '拒绝',
      status: 1
    }, {
      text: '通过',
      status: 2
    }],
    statusArr: ['待审核', '不通过'],
    status: 0,
    newsResult: []
  },
  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
      if (e && e.current) {
        this.setData({
          current: +e.current
        })
      }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      ADMIN.checkHasLoggedIn().then(loggedIn => {
        if (!loggedIn) {
          this.goLogin()
        }
      })
      this.changeNavBarTitle()
      if (this.data.current === 1) {
        this.getList()
      }
    },
    /**
     * 监听用户下拉刷新事件
     */
    onPullDownRefresh: function () {
      this.getList()
    },
    changeNavBarTitle: function () {
      wx.setNavigationBarTitle({
        title: this.data.tabbarList[this.data.current].text,
      })
    },
    formInputChange(e) {
      const {
        field
      } = e.currentTarget.dataset
      this.setData({
        [`formData.${field}`]: e.detail.value
      })
    },
    tabChange(e) {
      this.setData({
        current: e.detail.index
      })
      this.changeNavBarTitle()
      if (this.data.current === 1) {
        this.getList()
      }
    },
    submitForm() {
      this.selectComponent('#form').validate((valid, errors) => {
        if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
            this.setData({
              error: errors[firstError[0]].message
            })
          }
        } else {
          const params = {
            ...this.data.formData
          }
          this.setData({
            loading: true
          })
          ADMIN.apiExtNewsSave(params).then(res => {
            if (res.code !== 0) {
              this.setData({
                error: res.msg,
                loading: false
              })
              return
            }
            this.setData({
              loading: false
            })
            wx.showToast({
              title: '提交成功',
              icon: 'none'
            })
          }).catch(() => {
            this.setData({
              loading: false
            })
          })
        }
      })
    },
    bindStatusChange: function (e) {
      this.setData({
        status: +e.detail.value
      })
      this.getList()
    },
    async getList() {
      const parmas = {
        page: 1,
        pageSize: wx.getStorageSync('answerPageSize') || 20,
        categoryId: wx.getStorageSync('answerCategoryId'),
        status: this.data.status
      }
      wx.showToast({
        title: '数据加载中',
        icon: 'loading'
      })
      const res = await ADMIN.apiExtNewsList(parmas)
      if (res.code === 0) {
        this.setData({
          newsResult: res.data
        })
      } else {
        this.setData({
          newsResult: []
        })
      }
      wx.stopPullDownRefresh()
      wx.hideToast()
    },
    slideButtonTap: function (e) {
      const item = this.data.newsResult.result[e.currentTarget.id]
      const params = {
        ...item,
        status: this.data.slideButtons[e.detail.index].status
      }
      wx.showModal({
        title: '提示',
        content: '确定要' + this.data.slideButtons[e.detail.index].text + '该条数据吗?',
        success: async res => {
          if (res.confirm) {
            const saveRes = await ADMIN.apiExtNewsSave(params)
            if (saveRes.code === 0) {
              this.getList()
            }
          }
        }
      })
    }
  }
})