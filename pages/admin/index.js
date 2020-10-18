// pages/admin/index.js
const behaviorAdmin = require('../../utils/behavior-admin')
const ADMIN = require('../../utils/admin')
const util = require('../../utils/util')

Component({
  behaviors: [behaviorAdmin],
  data: {
    loading: false,
    formData: {},
    rules: [{
      name: 'userName',
      rules: {
        required: true,
        message: '请输入登录账号'
      }
    }, {
      name: 'pwd',
      rules: {
        required: true,
        message: '请输入登录密码'
      }
    }, {
      name: 'imgcode',
      rules: {
        required: true,
        message: '请输入验证码'
      }
    }],
    imgKey: undefined,
    badge: 0
  },
  lifetimes: {
    /**
     * 在组件实例进入页面节点树时执行
     */
    attached: function () {
      this.setImgKey()
      this.setData({
        [`formData.userName`]: wx.getStorageSync('userName')
      })
    }
  },
  methods: {
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      ADMIN.checkHasLoggedIn().then(loggedIn => {
        if (loggedIn) {
          this.getAdminUserInfo()
          this.getVerifyCount()
        }
      })
    },
    setImgKey: function () {
      this.setData({
        [`formData.imgcode`]: '',
        imgKey: Math.random()
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
            ...this.data.formData,
            k: this.data.imgKey
          }
          this.setData({
            loading: true
          })
          ADMIN.login(params).then(res => {
            if (res.code !== 0) {
              this.setImgKey()
              this.setData({
                error: res.code === 404 ? '账号或密码错误' : res.msg,
                loading: false
              })
              return
            }
            wx.setStorageSync('x-token', res.data.token)
            wx.setStorageSync('userName', this.data.formData.userName)
            this.setData({
              loading: false
            })
            wx.showToast({
              title: '登录成功',
              icon: 'none'
            })
            this.onShow()
          })
        }
      })
    },
    getVerifyCount: function () {
      const params = {
        categoryId: wx.getStorageSync('answerCategoryId'),
        dateAddBegin: util.parseTime(new Date(), '{y}-{m}-{d}'),
        status: 0
      }
      ADMIN.apiExtNewsList(params).then(res => {
        this.setData({
          badge: res.code === 0 ? res.data.totalRow : 0
        })
      })
    }
  }
})