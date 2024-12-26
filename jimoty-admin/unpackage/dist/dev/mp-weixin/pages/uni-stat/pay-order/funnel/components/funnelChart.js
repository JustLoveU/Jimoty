"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../../../js_sdk/uni-stat/util.js");
const js_sdk_uniStat_timeUtil = require("../../../../../js_sdk/uni-stat/timeUtil.js");
const pages_uniStat_payOrder_funnel_fieldsMap = require("../fieldsMap.js");
const _sfc_main = {
  props: {
    // 组件外部查询条件，一般包含 appid version_id platform_id
    query: {
      type: [Object],
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      tableName: "uni-stat-pay-result",
      fieldsMap: pages_uniStat_payOrder_funnel_fieldsMap.fieldsMap,
      chartData: {},
      errorMessage: "",
      notData: false,
      opts: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [15, 15, 0, 15],
        extra: {
          funnel: {
            activeOpacity: 0.3,
            activeWidth: 10,
            border: true,
            borderWidth: 2,
            borderColor: "#FFFFFF",
            fillOpacity: 1,
            labelAlign: "right",
            linearType: "custom",
            minSize: 20
          }
        }
      },
      // 时间选项
      dateTabs: {
        time: Date.now(),
        timeStr: "",
        index: 0,
        list: [
          { _id: "day", name: "日维度" },
          { _id: "week", name: "周维度" },
          { _id: "month", name: "月维度" }
        ]
      }
    };
  },
  created() {
    this.getCloudDataDebounce = js_sdk_uniStat_util.debounce(() => {
      this.getCloudData();
    }, 400);
    this.getCloudDataDebounce();
  },
  methods: {
    calcPercentage(v1, v2) {
      return v2 > 0 ? parseFloat((v1 / v2 * 100).toFixed(2)) : 0;
    },
    // 获取云端数据
    getCloudData() {
      let query = this.query;
      if (!query.appid) {
        this.errorMessage = "请先选择应用";
        return;
      }
      this.errorMessage = "";
      let insideQuery = this.getWhere();
      let where = {
        ...query,
        ...insideQuery
      };
      where = js_sdk_uniStat_util.stringifyQuery(where, false, ["uni_platform"]);
      const db = common_vendor.Vs.database();
      db.collection(this.tableName).where(where).field(`${js_sdk_uniStat_util.stringifyField(pages_uniStat_payOrder_funnel_fieldsMap.fieldsMap)}, dimension, stat_date.date_str as stat_time, start_time`).groupBy(`null`).groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_payOrder_funnel_fieldsMap.fieldsMap)).get().then((res) => {
        let data = res.result.data;
        if (!data.length) {
          this.errorMessage = "暂无数据";
          return;
        }
        this.errorMessage = "";
        data.map((item) => {
          for (let key in item) {
            if (key.indexOf("_amount") > 1) {
              item[key] = Number((item[key] / 100).toFixed(2));
            }
          }
        });
        let {
          activity_device_count = 0,
          activity_user_count = 0,
          pay_user_count = 0
        } = data[0] || {};
        this.notData = !activity_device_count && !activity_user_count && !pay_user_count ? true : false;
        let chartData = {
          series: [{
            data: [
              {
                "name": "活跃设备数量",
                "value": activity_device_count,
                "centerText": `${activity_device_count}`,
                "labelText": `活跃设备数`
              },
              {
                "name": "活跃用户数量",
                "value": activity_user_count,
                "centerText": `${activity_user_count}`,
                "labelText": `活跃用户数（用户转化率：${this.calcPercentage(activity_user_count, activity_device_count)}%）`
              },
              {
                "name": "支付用户数量",
                "value": pay_user_count,
                "centerText": `${pay_user_count}`,
                "labelText": `支付用户数（支付转化率：${this.calcPercentage(pay_user_count, activity_user_count)}%）`
              }
            ]
          }]
        };
        this.chartData = chartData;
      });
    },
    // 监听 - 日期标签更改
    dateTabsChange(id, index) {
      this.dateTabs.index = index;
      this.getCloudData();
    },
    // 监听 - 日期选择更改
    datePickerChange(time) {
      this.dateTabs.time = time;
      this.getCloudData();
    },
    // 获取查询条件
    getWhere() {
      let time = this.dateTabs.time;
      let dimension = this.dateTabs.list[this.dateTabs.index]._id || "day";
      let start_time = [];
      if (dimension === "day") {
        let { startTime, endTime } = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("day", 0, time);
        start_time = [startTime, endTime];
      } else if (dimension === "week") {
        let { startTime, endTime } = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("week", 0, time);
        start_time = [startTime, endTime];
      } else if (dimension === "month") {
        let { startTime, endTime } = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("month", 0, time);
        start_time = [startTime, endTime];
      }
      this.dateTabs.timeStr = `${js_sdk_uniStat_timeUtil.timeUtil.timeFormat(start_time[0])} ~ ${js_sdk_uniStat_timeUtil.timeUtil.timeFormat(start_time[1])}`;
      return {
        dimension,
        // 时间纬度
        start_time
        // 时间范围
      };
    }
  },
  watch: {
    query: {
      deep: true,
      handler(val) {
        this.getCloudDataDebounce();
      }
    }
  },
  computed: {}
};
if (!Array) {
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  (_easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_qiun_data_charts2)();
}
const _easycom_uni_stat_tabs = () => "../../../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_qiun_data_charts = () => "../../../../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
if (!Math) {
  (_easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_qiun_data_charts)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.dateTabsChange),
    b: common_vendor.p({
      type: "box",
      current: $data.dateTabs.index,
      tabs: $data.dateTabs.list
    }),
    c: common_vendor.o($options.datePickerChange),
    d: common_vendor.o(($event) => $data.dateTabs.time = $event),
    e: common_vendor.p({
      type: "date",
      end: Date.now(),
      ["return-type"]: "timestamp",
      ["clear-icon"]: false,
      modelValue: $data.dateTabs.time
    }),
    f: $data.dateTabs.timeStr
  }, $data.dateTabs.timeStr ? {
    g: common_vendor.t($data.dateTabs.timeStr)
  } : {}, {
    h: !$data.notData
  }, !$data.notData ? {
    i: common_vendor.p({
      type: "funnel",
      chartData: $data.chartData,
      opts: $data.opts,
      errorMessage: $data.errorMessage
    })
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5a934e84"]]);
wx.createComponent(Component);
