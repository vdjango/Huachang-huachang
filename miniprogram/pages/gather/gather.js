// miniprogram/pages/gather/gather.js 
import Toast from '@vant/weapp/toast/toast';
import Notify from '@vant/weapp/notify/notify';
import Dialog from '@vant/weapp/dialog/dialog';
var event = require('../../utils/event.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    actions: [
      { name: '获取用户信息', color: '#07c160', openType: 'getUserInfo' },
    ],
    res: null,
    skeleton_loading: true,
    from_data: [],
    from_statas: false, // 用户选择完整，可以提交
    from_loading: false, // 提交状态，
    avatarUrl: null,
    userInfo: null
  },
  onClose() {
    this.setData({ show: false });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log('已经授权', res.authSetting['scope.userInfo'])
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        } else {
          this.setData({show: true})
        }
      }
    })

    // 1. 获取数据库引用
    const db = wx.cloud.database()
    var _this = this
    db.collection('gather').get({
      success: function (res) {
        if (res.data) {
          let option_data = []
          for (const key in res.data[0].option[options.index].listing) {
            // console.log(key)
            option_data.push({
              index: key,
              value: null
            })
          }
          _this.setData({
            res: res.data[0].option[options.index],
            from_data: option_data,
            skeleton_loading: false
          })
        }
      }
    })
  },
  onGetUserInfo(e) {
    console.log(e.detail);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    event.remove('DataChanged', this);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onChange(event) {
    console.log(event)
    this.setData({
      current: event.detail,
    });
  },
  onClick(event) {
    const { index, name } = event.currentTarget.dataset;
    console.log(index, name)
    // this.from_data[index] = name

    this.setData({
      ['from_data[' + index + '].value']: name,
    });
  },
  onPut() {
    let count = 0
    // console.log(this.data.from_data)
    for (const key in this.data.from_data) {
      if (this.data.from_data[key].value === null) {
        count++
      }
    }
    if (count <= 0) {
      // 提交数据 ...
      this.setData({
        from_statas: true,
        from_loading: true,
      })
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        message: '提交中...',
        forbidClick: true,
      });
    } else {
      Notify({ type: 'warning', message: '好像遗忘了什么～' });
    }
  }
})