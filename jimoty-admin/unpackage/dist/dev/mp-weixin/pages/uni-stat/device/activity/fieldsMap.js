"use strict";
const fieldsMap = [{
  title: "日期",
  field: "start_time",
  tooltip: "",
  formatter: "-"
}, {
  title: "日活",
  field: "active_device_count",
  tooltip: "选中日期当天的访问用户数"
}, {
  title: "周活",
  field: "week_active_device_count",
  tooltip: "选中日期所在自然周（包括选中日期在内）的访问用户数"
}, {
  title: "日活/周活",
  field: "active_device_count/week_active_device_count",
  computed: "active_device_count/week_active_device_count",
  tooltip: "选中日期的访问用户数占周访问用户数的百分比",
  formatter: "%"
}, {
  title: "月活",
  field: "month_active_device_count",
  tooltip: "选中日期所在自然月（包括选中日期在内）的访问用户数"
}, {
  title: "日活/月活",
  field: "active_device_count/month_active_device_count",
  computed: "active_device_count/month_active_device_count",
  tooltip: "选中日期的访问用户数占月访问用户数的百分比",
  formatter: "%"
}];
exports.fieldsMap = fieldsMap;
