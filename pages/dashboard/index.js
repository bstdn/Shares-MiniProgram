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
    }, {
      "text": "审核",
      "iconPath": "/images/icon_examine.png",
      "selectedIconPath": "/images/icon_examine_active.png"
    }],
    loading: false,
    defaultTitle: '积分答题 招行答题',
    formData: {
      title: '',
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
      text: '编辑'
    }, {
      type: 'warn',
      text: '拒绝',
      status: 1
    }, {
      text: '通过',
      status: 2
    }],
    statusArr: ['待审核', '不通过', '已通过'],
    status: 0,
    newsResult: [],
    dialogShow: false,
    dialogButtons: [{
      text: '取消'
    }, {
      text: '保存'
    }],
    formDataEdit: {
      title: '',
      categoryId: wx.getStorageSync('answerCategoryId'),
      content: '1',
      descript: '1',
      keywords: '1'
    }
  },
  lifetimes: {
    /**
     * 在组件实例进入页面节点树时执行
     */
    attached: function () {
      this.setData({
        [`formData.title`]: this.data.defaultTitle
      })
    }
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
              [`formData.title`]: this.data.defaultTitle,
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
    formInputChangeEdit(e) {
      const {
        field
      } = e.currentTarget.dataset
      this.setData({
        [`formDataEdit.${field}`]: e.detail.value
      })
    },
    showDialog: function () {
      this.setData({
        dialogShow: true
      })
    },
    hideDialog: function () {
      this.setData({
        dialogShow: false
      })
    },
    tapDialogButton: function (e) {
      if (e.detail.index === 0) {
        this.hideDialog()
        return
      }
      this.selectComponent('#formEdit').validate((valid, errors) => {
        if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
            this.setData({
              error: errors[firstError[0]].message
            })
          }
        } else {
          const params = {
            ...this.data.formDataEdit
          }
          wx.showToast({
            title: '保存中',
            mask: true
          })
          ADMIN.apiExtNewsSave(params).then(res => {
            if (res.code !== 0) {
              this.setData({
                error: res.msg
              })
              wx.hideToast()
              return
            }
            wx.showToast({
              title: '保存成功',
              icon: 'none'
            })
            this.hideDialog()
            this.getList()
          }).catch(() => {
            wx.hideToast()
          })
        }
      })
    },
    slideButtonTap: function (e) {
      const item = this.data.newsResult.result[e.currentTarget.id]
      if (e.detail.index === 0) {
        this.setData({
          formDataEdit: item
        })
        this.showDialog()
        return
      }
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