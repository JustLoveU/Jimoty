"use strict";
const fieldsMap = [
  { title: "活跃设备数", field: "activity_device_count", tooltip: "统计时间内，访问设备数，一台设备多次访问被计为一台（包含未登录的用户）。", formatter: ",", value: 0, contrast: 0, stat: "sum" },
  { title: "活跃用户数", field: "activity_user_count", tooltip: "活跃用户数：统计时间内，访问人数，一人多次访问被计为一人（只统计已登录的用户）。", formatter: ",", value: 0, contrast: 0, stat: "sum" },
  { title: "支付用户数", field: "pay_user_count", tooltip: "统计时间内，成功支付的人数（不剔除退款订单）（只统计已登录的用户）。", formatter: ",", value: 0, contrast: 0, stat: "sum" }
];
exports.fieldsMap = fieldsMap;
