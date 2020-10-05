// pages/dashboard/index.js
const behaviorAdmin = require('../../utils/behavior-admin')
const ADMIN = require('../../utils/admin')

Component({
  behaviors: [behaviorAdmin],
  data: {
    current: 0,
    list: [{
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
  methods: {
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
    },
    changeNavBarTitle: function () {
      wx.setNavigationBarTitle({
        title: this.data.list[this.data.current].text,
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
          console.log('params', params)
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
    }
  }
})