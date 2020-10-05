// pages/admin/index.js
const behaviorAdmin = require('../../utils/behavior-admin')
const ADMIN = require('../../utils/admin')

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
    img_key: undefined
  },
  lifetimes: {
    /**
     * 在组件实例进入页面节点树时执行
     */
    attached: function () {
      this.setImgKey()
    }
  },
  methods: {
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      ADMIN.checkHasLoggedIn().then(loggedIn => {
        if (loggedIn) {
          wx.navigateTo({
            url: '../dashboard/index',
          })
        }
      })
    },
    setImgKey: function () {
      this.setData({
        img_key: Math.random()
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
            k: this.data.img_key
          }
          console.log('params', params)
          this.setData({
            loading: true
          })
          ADMIN.login(params).then(res => {
            if (res.code !== 0) {
              this.setImgKey()
              this.setData({
                error: res.code === 404 ? '账号或密码错误' : res.msg,
                [`formData.imgcode`]: '',
                loading: false
              })
              return
            }
            wx.setStorageSync('x-token', res.data.token)
            wx.setStorageSync('aid', res.data.uid)
            this.setData({
              loading: false
            })
            wx.showToast({
              title: '登录成功',
              icon: 'none'
            })
            this.goDashboard()
          })
        }
      })
    }
  }
})