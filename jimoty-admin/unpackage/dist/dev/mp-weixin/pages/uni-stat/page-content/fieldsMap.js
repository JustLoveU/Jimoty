"use strict";
const fieldsMap = [
  {
    title: "内容统计页面",
    field: "page_link",
    stat: -1
  },
  {
    title: "页面名称",
    field: "page_title",
    stat: -1
  },
  {
    title: "访问次数",
    field: "visit_times",
    tooltip: "访问过应用内任意页面总次数，多个页面之间跳转、同一页面的重复访问计为多次访问；",
    value: 0
  },
  {
    title: "访问设备数",
    field: "visit_devices",
    tooltip: "访问过应用内任意页面总次数，多个页面之间跳转、同一页面的重复访问计为多次访问；",
    value: 0
  },
  {
    title: "次均停留时长",
    field: "avg_device_session_time",
    computed: "duration/visit_times",
    formatter: ":",
    tooltip: "平均每次打开应用停留在应用内的总时长，即应用停留总时长/启动次数",
    value: 0
  },
  {
    title: "设备平均停留时长",
    field: "avg_user_time",
    computed: "duration/visit_devices",
    formatter: ":",
    tooltip: "平均每个设备停留在应用内的总时长，即应用停留总时长/访问设备数",
    value: 0
  },
  {
    title: "分享次数",
    field: "share_count",
    tooltip: "页面被分享成功的次数",
    value: 0
  }
];
exports.fieldsMap = fieldsMap;
