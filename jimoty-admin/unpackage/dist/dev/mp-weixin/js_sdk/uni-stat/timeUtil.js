"use strict";
let timeUtil = {};
timeUtil.getDateObject = function(date) {
  if (!date)
    return "";
  let nowDate;
  if (typeof date === "string" && !isNaN(date))
    date = Number(date);
  if (typeof date === "number") {
    if (date.toString().length === 10)
      date *= 1e3;
    nowDate = new Date(date);
  } else if (typeof date === "object") {
    nowDate = new Date(date.getTime());
  }
  return nowDate;
};
timeUtil.timeFormat = function(date, fmt = "yyyy-MM-dd hh:mm:ss") {
  try {
    if (!date)
      return "";
    let nowDate = timeUtil.getDateObject(date);
    let opt = {
      "M+": nowDate.getMonth() + 1,
      //月份
      "d+": nowDate.getDate(),
      //日
      "h+": nowDate.getHours(),
      //小时
      "m+": nowDate.getMinutes(),
      //分
      "s+": nowDate.getSeconds(),
      //秒
      //"w+": nowDate.getDay(), //周
      "q+": Math.floor((nowDate.getMonth() + 3) / 3),
      //季度
      "S": nowDate.getMilliseconds()
      //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (nowDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in opt) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? opt[k] : ("00" + opt[k]).substr(("" + opt[k]).length));
      }
    }
    return fmt;
  } catch (err) {
    return time;
  }
};
timeUtil.getDateInfo = function(date = /* @__PURE__ */ new Date()) {
  let nowDate = timeUtil.getDateObject(date);
  let year = nowDate.getFullYear() + "";
  let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
  let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
  let hour = nowDate.getHours() < 10 ? "0" + nowDate.getHours() : nowDate.getHours();
  let minute = nowDate.getMinutes() < 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
  let second = nowDate.getSeconds() < 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
  let millisecond = nowDate.getMilliseconds();
  let week = nowDate.getDay();
  let quarter = Math.floor((nowDate.getMonth() + 3) / 3);
  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
    millisecond: Number(millisecond),
    week: Number(week),
    quarter: Number(quarter)
  };
};
timeUtil.getOffsetStartAndEnd = function(type = "day", count = 0, date = /* @__PURE__ */ new Date()) {
  let startTime, endTime;
  let nowDate = timeUtil.getDateObject(date);
  if (type === "hour") {
    let offsetMillisecond = 1e3 * 60 * 60;
    let dateInfo = timeUtil.getDateInfo(new Date(nowDate.getTime() + offsetMillisecond * 1 * count));
    startTime = (/* @__PURE__ */ new Date(`${dateInfo.year}/${dateInfo.month}/${dateInfo.day} ${dateInfo.hour}:00:00`)).getTime();
    endTime = (/* @__PURE__ */ new Date(`${dateInfo.year}/${dateInfo.month}/${dateInfo.day} ${dateInfo.hour}:00:00`)).getTime() + (offsetMillisecond - 1);
  } else if (type === "day") {
    let offsetMillisecond = 1e3 * 60 * 60 * 24;
    let dateInfo = timeUtil.getDateInfo(new Date(nowDate.getTime() + offsetMillisecond * 1 * count));
    startTime = (/* @__PURE__ */ new Date(`${dateInfo.year}/${dateInfo.month}/${dateInfo.day}`)).getTime();
    endTime = (/* @__PURE__ */ new Date(`${dateInfo.year}/${dateInfo.month}/${dateInfo.day}`)).getTime() + (offsetMillisecond - 1);
  } else if (type === "week") {
    nowDate.setDate(nowDate.getDate() - nowDate.getDay() + 1 + count * 7);
    let dateInfo1 = timeUtil.getDateInfo(nowDate);
    nowDate.setDate(nowDate.getDate() + 7);
    let dateInfo2 = timeUtil.getDateInfo(nowDate);
    startTime = (/* @__PURE__ */ new Date(`${dateInfo1.year}/${dateInfo1.month}/${dateInfo1.day}`)).getTime();
    endTime = (/* @__PURE__ */ new Date(`${dateInfo2.year}/${dateInfo2.month}/${dateInfo2.day}`)).getTime() - 1;
  } else if (type === "month") {
    let dateInfo = timeUtil.getDateInfo(nowDate);
    let month = dateInfo.month + count;
    let year = dateInfo.year;
    if (month > 12) {
      year = year + Math.floor(month / 12);
      month = Math.abs(month) % 12;
    } else if (month <= 0) {
      year = year - 1 - Math.floor(Math.abs(month) / 12);
      month = 12 - Math.abs(month) % 12;
    }
    let month_last_day = new Date(year, month, 0).getDate();
    startTime = (/* @__PURE__ */ new Date(`${year}/${month}/1`)).getTime();
    endTime = (/* @__PURE__ */ new Date(`${year}/${month}/${month_last_day}`)).getTime() + (24 * 60 * 60 * 1e3 - 1);
  } else if (type === "quarter") {
    nowDate.setMonth(nowDate.getMonth() + count * 3);
    let dateInfo = timeUtil.getDateInfo(nowDate);
    let month = dateInfo.month;
    if ([1, 2, 3].indexOf(month) > -1) {
      month = 1;
    } else if ([4, 5, 6].indexOf(month) > -1) {
      month = 4;
    } else if ([7, 8, 9].indexOf(month) > -1) {
      month = 7;
    } else if ([10, 11, 12].indexOf(month) > -1) {
      month = 10;
    }
    nowDate.setMonth(month - 1);
    let dateInfo1 = timeUtil.getDateInfo(nowDate);
    nowDate.setMonth(nowDate.getMonth() + 3);
    let dateInfo2 = timeUtil.getDateInfo(nowDate);
    startTime = (/* @__PURE__ */ new Date(`${dateInfo1.year}/${dateInfo1.month}/1`)).getTime();
    endTime = (/* @__PURE__ */ new Date(`${dateInfo2.year}/${dateInfo2.month}/1`)).getTime() - 1;
  } else if (type === "year") {
    let dateInfo = timeUtil.getDateInfo(nowDate);
    let year = dateInfo.year + count;
    startTime = (/* @__PURE__ */ new Date(`${year}/1/1`)).getTime();
    endTime = (/* @__PURE__ */ new Date(`${year}/12/31`)).getTime() + (24 * 60 * 60 * 1e3 - 1);
  }
  return {
    startTime,
    endTime
  };
};
exports.timeUtil = timeUtil;
