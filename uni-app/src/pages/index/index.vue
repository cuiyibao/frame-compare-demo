<template>
<view>
    <view class="date-wrp">
        <view class="layout-flex row" style="background-color: #F5F5F5;">
            <text class="date-week" :style="{width: dayW + 'px', height: '20px'}" v-for="(item, index1) in weekStr">
                <text v-if="item !=='日' && item !=='六'">{{item}}</text>
                <text v-if="item ==='日' || item ==='六'" class="week">{{item}}</text>
            </text>
        </view>
    </view>
    <view style="margin-top:50px"></view>
    <view v-for="(dateItem, index2) in dateList" style="padding:30rpx 0">
        <view class="date-year-month" style="text-align: center;font-size:35rpx;">
            {{dateItem.year}}年{{dateItem.month}}月
        </view>
        <view class="layout-flex row" style="flex-wrap: wrap;margin-top:30rpx;">
            <view 
                :class="['date-day', item.day<=0 ? 'bgwhite' : item.class ]" 
                :style="{width:dayW + 'px', height: systemInfo.windowWidth/7 + 'px'}" 
                :data-year="dateItem.year" 
                :data-month="dateItem.month" 
                :data-day="item.day" 
                v-for="(item, index3) in dateItem.days"
            >
                <view class='item-days'>
                    <text style='font-size:28rpx;'>{{item.day>0?(item.daytext?item.daytext:item.day):''}}</text>
                </view>
            </view>
        </view>
    </view>
</view>
</template>

<script>
import Moment from "../../utils/moment.js"

var DATE_LIST = []
var DATE_YEAR = new Date().getFullYear()
var DATE_MONTH = new Date().getMonth() + 1
var DATE_DAY = new Date().getDate()

export default {
  data() {
    return {
      maxMonth: 7, //最多渲染月数
      dateList: [],
      systemInfo: {},
      dayW: 0,
      weekStr: ["日", "一", "二", "三", "四", "五", "六"],
      markcheckInDate: false, //标记开始时间是否已经选择
      markcheckOutDate: false, //标记结束时间是否已经选择
      sFtv: [
        {
          month: 1,
          day: 1,
          name: "元旦"
        },
        {
          month: 2,
          day: 14,
          name: "情人节"
        },
        {
          month: 3,
          day: 8,
          name: "妇女节"
        },
        {
          month: 3,
          day: 12,
          name: "植树节"
        },
        {
          month: 3,
          day: 15,
          name: "消费者权益日"
        },
        {
          month: 4,
          day: 1,
          name: "愚人节"
        },
        {
          month: 5,
          day: 1,
          name: "劳动节"
        },
        {
          month: 5,
          day: 4,
          name: "青年节"
        },
        {
          month: 5,
          day: 12,
          name: "护士节"
        },
        {
          month: 6,
          day: 1,
          name: "儿童节"
        },
        {
          month: 7,
          day: 1,
          name: "建党节"
        },
        {
          month: 8,
          day: 1,
          name: "建军节"
        },
        {
          month: 9,
          day: 10,
          name: "教师节"
        },
        {
          month: 9,
          day: 28,
          name: "孔子诞辰"
        },
        {
          month: 10,
          day: 1,
          name: "国庆节"
        },
        {
          month: 10,
          day: 6,
          name: "老人节"
        },
        {
          month: 10,
          day: 24,
          name: "联合国日"
        },
        {
          month: 12,
          day: 24,
          name: "平安夜"
        },
        {
          month: 12,
          day: 25,
          name: "圣诞节"
        }
      ]
    }
  },
  onLoad() {
    // 页面初始化 options为页面跳转所带来的参数
    this.createDateListData()

    var _this = this
    // 页面初始化 options为页面跳转所带来的参数

    var checkInDate = Moment(new Date()).format("YYYY-MM-DD")
    var checkOutDate = Moment(new Date())
      .add(1, "day")
      .format("YYYY-MM-DD")
    wx.getSystemInfo({
      success: function(res) {
        _this.dayW = res.windowWidth / 7 - 10
      }
    })
  },
  methods: {
    selectDataMarkLine() {
      let dateList = this.dateList
      let { checkInDate, checkOutDate } = wx.getStorageSync("ROOM_SOURCE_DATE")
      let curreInid =
        checkInDate.substr(0, 4) +
        "-" +
        (checkInDate.substr(5, 2) < 10
          ? checkInDate.substr(6, 1)
          : checkInDate.substr(5, 2)) //选择入住的id
      let curreOutid =
        checkOutDate.substr(0, 4) +
        "-" +
        (checkOutDate.substr(5, 2) < 10
          ? checkOutDate.substr(6, 1)
          : checkOutDate.substr(5, 2)) //选择离店的id
      let dayIn =
        checkInDate.substr(8, 2) >= 10
          ? checkInDate.substr(8, 2)
          : checkInDate.substr(9, 1) //选择入住的天id
      let dayOut =
        checkOutDate.substr(8, 2) >= 10
          ? checkOutDate.substr(8, 2)
          : checkOutDate.substr(9, 1) //选择离店的天id
      let monthIn =
        checkInDate.substr(5, 2) >= 10
          ? checkInDate.substr(5, 2)
          : checkInDate.substr(6, 1) //选择入店的月id
      let monthOut =
        checkOutDate.substr(5, 2) >= 10
          ? checkOutDate.substr(5, 2)
          : checkOutDate.substr(6, 1) //选择离店的月id
      if (curreInid == curreOutid) {
        //入住与离店是当月的情况
        for (let i = 0; i < dateList.length; i++) {
          if (dateList[i].id == curreInid) {
            let days = dateList[i].days
            for (let k = 0; k < days.length; k++) {
              if (days[k].day >= dayIn && days[k].day <= dayOut) {
                days[k].class = days[k].class + " bgitem"
              }
              if (days[k].day == dayIn) {
                days[k].class = days[k].class + " active"
                days[k].inday = true
              }
              if (days[k].day == dayOut) {
                days[k].class = days[k].class + " active"
                days[k].outday = true
              }
            }
          }
        }
      } else {
        //跨月
        for (let j = 0; j < dateList.length; j++) {
          if (dateList[j].month == monthIn) {
            //入住的开始月份
            let days = dateList[j].days
            for (let k = 0; k < days.length; k++) {
              if (days[k].day >= dayIn) {
                days[k].class = days[k].class + " bgitem"
              }
              if (days[k].day == dayIn) {
                days[k].class = days[k].class + " active"
                days[k].inday = true
              }
            }
          } else {
            //入住跨月月份
            if (dateList[j].month < monthOut && dateList[j].month > monthIn) {
              //离店中间的月份
              let days = dateList[j].days
              for (let k = 0; k < days.length; k++) {
                days[k].class = days[k].class + " bgitem"
              }
            } else if (dateList[j].month == monthOut) {
              //离店最后的月份
              let days = dateList[j].days
              for (let k = 0; k < days.length; k++) {
                if (days[k].day <= dayOut) {
                  days[k].class = days[k].class + " bgitem"
                }
                if (days[k].day == dayOut) {
                  days[k].class = days[k].class + " active"
                  days[k].outday = true
                }
              }
            }
          }
        }
      }
      this.setData({
        dateList: dateList
      })
    },

    createDateListData() {
      var dateList = []
      var now = new Date()
      /*
      设置日期为 年-月-01,否则可能会出现跨月的问题
      比如：2017-01-31为now ,月份直接+1（now.setMonth(now.getMonth()+1)），则会直接跳到跳到2017-03-03月份.
        原因是由于2月份没有31号，顺推下去变成了了03-03
    */
      now = new Date(now.getFullYear(), now.getMonth(), 1)
      for (var i = 0; i < this.maxMonth; i++) {
        var momentDate = Moment(now).add(
          this.maxMonth - (this.maxMonth - i),
          "month"
        ).date
        var year = momentDate.getFullYear()
        var month = momentDate.getMonth() + 1

        var days = []
        var totalDay = this.getTotalDayByMonth(year, month)
        var week = this.getWeek(year, month, 1)
        //-week是为了使当月第一天的日期可以正确的显示到对应的周几位置上，比如星期三(week = 2)，
        //则当月的1号是从列的第三个位置开始渲染的，前面会占用-2，-1，0的位置,从1开正常渲染
        for (var j = -week + 1; j <= totalDay; j++) {
          var tempWeek = -1
          if (j > 0) tempWeek = this.getWeek(year, month, j)
          var clazz = ""
          if (tempWeek == 0 || tempWeek == 6) clazz = "week"
          if (j < DATE_DAY && year == DATE_YEAR && month == DATE_MONTH)
            //当天之前的日期不可用
            clazz = "unavailable " + clazz
          else clazz = "" + clazz
          days.push({ day: j, class: clazz })
        }
        var dateItem = {
          id: year + "-" + month,
          year: year,
          month: month,
          days: days
        }

        dateList.push(dateItem)
      }
      this.dateList = dateList
      DATE_LIST = dateList
    },

    /*
	 * 获取月的总天数
	 */
    getTotalDayByMonth(year, month) {
      month = parseInt(month, 10)
      var d = new Date(year, month, 0)
      return d.getDate()
    },
    /*
	 * 获取月的第一天是星期几
	 */
    getWeek(year, month, day) {
      var d = new Date(year, month - 1, day)
      return d.getDay()
    },
    /**
     * 点击日期事件
     */
    onPressDate(e) {
      var { year, month, day } = e.currentTarget.dataset
      //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
      if ((day < DATE_DAY && month == DATE_MONTH) || day <= 0) return

      var tempMonth = month
      var tempDay = day

      if (month < 10) tempMonth = "0" + month
      if (day < 10) tempDay = "0" + day

      var date = year + "-" + tempMonth + "-" + tempDay

      //如果点击选择的日期A小于入住时间，则重新渲染入住时间为A
      if (
        (this.markcheckInDate && Moment(date).before(this.checkInDate)) ||
        this.checkInDate === date
      ) {
        this.setData({
          markcheckInDate: false,
          markcheckOutDate: false,
          dateList: DATE_LIST.concat()
        })
      }

      if (!this.markcheckInDate) {
        this.setData({
          checkInDate: date,
          markcheckInDate: true,
          dateList: DATE_LIST.concat()
        })
      } else if (!this.markcheckOutDate) {
        this.setData({
          checkOutDate: date,
          markcheckOutDate: true
        })
        //设缓存，返回页面时，可在onShow时获取缓存起来的日期
        wx.setStorage({
          key: "ROOM_SOURCE_DATE",
          data: {
            checkInDate: this.checkInDate,
            checkOutDate: this.checkOutDate
          }
        })
        wx.navigateBack({
          delta: 1 // 回退前 delta(默认为1) 页面
        })
      }

      this.renderPressStyle(year, month, day)
    },
    renderPressStyle(year, month, day) {
      this.createDateListData() //重新点击时数据初始化
      var dateList = this.dateList
      //渲染点击样式
      for (var i = 0; i < dateList.length; i++) {
        var dateItem = dateList[i]
        var id = dateItem.id
        if (id === year + "-" + month) {
          var days = dateItem.days
          for (var j = 0; j < days.length; j++) {
            var tempDay = days[j].day
            if (tempDay == day) {
              days[j].class = days[j].class + " active"
              days[j].inday = true
              break
            }
          }
          break
        }
      }
      this.setData({
        dateList: dateList
      })
    }
  }
}
</script>

<style>
.date-wrp {
  position: fixed;
  top: 0;
  width: 100%;
  background: #f5f5f5;
  font-size: 30rpx;
  padding-top: 10rpx;
  padding-bottom: 10rpx;
}
/* pages/dateSelect/dateSelect.wxss */
.date-day {
  display: flex;
  padding: 5px;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.date-day.bgitem {
  background-color: #d8ecf9;
}
.date-day.active {
  background: #099fde;
  color: #fff;
}
.date-day.unavailable {
  color: #aaa;
}

.date-week {
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 5px;
}
.week {
  color: #099fde;
}
.row {
  display: flex;
  flex-direction: row;
}
.item-days {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 35rpx;
}
.bgwhite {
  background-color: #fff;
}
</style>

