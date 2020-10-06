// pages/answer/index.js
const WXAPI = require('apifm-wxapi')
const behavior = require('../../utils/behavior')
const AUTH = require('../../utils/auth')

Component({
  behaviors: [behavior],
  data: {
    loading: false,
    defaultTitle: '积分答题 招行答题',
    formData: {
      title: '',
      categoryId: wx.getStorageSync('answer_cid'),
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
    }]
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
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      AUTH.checkHasLoggedIn().then(loggedIn => {
        this.setData({
          wxLogin: loggedIn
        })
        if (loggedIn) {
          this.getUserApiInfo()
        }
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
          if (!this.data.apiUserInfoMap) {
            this.showLogin()
            return
          }
          const params = {
            ...this.data.formData,
            token: wx.getStorageSync('token')
          }
          this.setData({
            loading: true
          })
          WXAPI.cmsArticleCreate(params).then(res => {
            if (res.code !== 0) {
              this.setData({
                error: res.msg,
                loading: false
              })
              return
            }
            wx.showModal({
              title: '提交成功',
              content: '感谢你的分享，请耐心等待审核通过，或联系作者处理~(*^_^*)~',
              showCancel: false
            })
            this.setData({
              [`formData.title`]: this.data.defaultTitle,
              loading: false
            })
          })
        }
      })
    }
  }
})