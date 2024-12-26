"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../../../js_sdk/uni-stat/util.js");
const js_sdk_uniStat_timeUtil = require("../../../../../js_sdk/uni-stat/timeUtil.js");
const pages_uniStat_payOrder_overview_fieldsMap = require("../fieldsMap.js");
let fieldsMap = pages_uniStat_payOrder_overview_fieldsMap.statPanelTodayFieldsMap;
const _sfc_main = {
  props: {
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
      fieldsMap,
      panelData: {
        today: { pay_total_amount: "-", pay_order_count: "-" },
        yesterday: { pay_total_amount: "-", pay_order_count: "-" },
        beforeyesterday: { pay_total_amount: "-", pay_order_count: "-" },
        week: { pay_total_amount: "-", pay_order_count: "-" },
        month: { pay_total_amount: "-", pay_order_count: "-" },
        quarter: { pay_total_amount: "-", pay_order_count: "-" },
        year: { pay_total_amount: "-", pay_order_count: "-" },
        total: { pay_total_amount: "-", pay_order_count: "-" }
      },
      loading: false
    };
  },
  created() {
    this.getCloudDataDebounce = js_sdk_uniStat_util.debounce(() => {
      this.getCloudData();
    }, 300);
    this.getCloudDataDebounce();
  },
  methods: {
    // 获取云端数据
    getCloudData() {
      let query = this.query;
      if (!query.appid)
        return;
      this.loading = true;
      query = js_sdk_uniStat_util.stringifyQuery(query, true, ["uni_platform"]);
      let where = this.getWhere(query);
      if (query) {
        where = `${query} && (${where})`;
      }
      const db = common_vendor.Vs.database();
      db.collection(this.tableName).where(where).field(`${js_sdk_uniStat_util.stringifyField(fieldsMap)}, dimension, stat_date.date_str as stat_time, start_time`).groupBy(`stat_time, dimension`).groupField(js_sdk_uniStat_util.stringifyGroupField(fieldsMap) + ",last(start_time) as start_time").get().then((res) => {
        let data = res.result.data;
        data.map((item, index) => {
          if (!item.actual_total_amount)
            item.actual_total_amount = item.pay_total_amount - item.refund_total_amount;
        });
        data = js_sdk_uniStat_util.formatterData({
          fieldsMap,
          data
        });
        this.loading = false;
        Object.assign(this.panelData, this.setPanelData(data));
      });
      let totalWhere = `${query} && dimension == "year"`;
      db.collection(this.tableName).where(totalWhere).field(`${js_sdk_uniStat_util.stringifyField(fieldsMap)}, dimension`).groupBy(`dimension`).groupField(js_sdk_uniStat_util.stringifyGroupField(fieldsMap)).get().then((res) => {
        let data = res.result.data;
        data.map((item, index) => {
          item.actual_total_amount = item.pay_total_amount - item.refund_total_amount;
        });
        data = js_sdk_uniStat_util.formatterData({
          fieldsMap,
          data
        });
        Object.assign(this.panelData, {
          total: data[0] || { pay_total_amount: 0, pay_order_count: 0, create_total_amount: 0, refund_total_amount: 0, actual_total_amount: 0 }
        });
      });
    },
    // 获取查询条件
    getWhere(query) {
      let where;
      let nowTime = Date.now();
      let today = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("day", 0, nowTime);
      let yesterday = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("day", -1, nowTime);
      let beforeyesterday = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("day", -2, nowTime);
      let week = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("week", 0, nowTime);
      let month = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("month", 0, nowTime);
      let quarter = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("quarter", 0, nowTime);
      let year = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("year", 0, nowTime);
      where = `(dimension=="day" && start_time==${today.startTime} && end_time==${today.endTime}) || (dimension=="day" && start_time==${yesterday.startTime} && end_time==${yesterday.endTime}) || (dimension=="day" && start_time==${beforeyesterday.startTime} && end_time==${beforeyesterday.endTime}) || (dimension=="week" && start_time==${week.startTime} && end_time==${week.endTime}) || (dimension=="month" && start_time==${month.startTime} && end_time==${month.endTime}) || (dimension=="quarter" && start_time==${quarter.startTime} && end_time==${quarter.endTime}) || (dimension=="year" && start_time==${year.startTime} && end_time==${year.endTime})`;
      return where;
    },
    // 设置面板数据
    setPanelData(data) {
      let nowTime = Date.now();
      let todayData = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("day", 0, nowTime);
      let yesterdayData = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("day", -1, nowTime);
      let beforeyesterdayData = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("day", -2, nowTime);
      let today = data.find((item) => {
        return item.dimension === "day" && item.start_time === todayData.startTime;
      });
      let yesterday = data.find((item) => {
        return item.dimension === "day" && item.start_time === yesterdayData.startTime;
      });
      let beforeyesterday = data.find((item) => {
        return item.dimension === "day" && item.start_time === beforeyesterdayData.startTime;
      });
      let week = data.find((item) => {
        return item.dimension === "week";
      });
      let month = data.find((item) => {
        return item.dimension === "month";
      });
      let quarter = data.find((item) => {
        return item.dimension === "quarter";
      });
      let year = data.find((item) => {
        return item.dimension === "year";
      });
      let defaultData = { pay_total_amount: 0, pay_order_count: 0, create_total_amount: 0, refund_total_amount: 0, actual_total_amount: 0 };
      return {
        today: today || defaultData,
        yesterday: yesterday || defaultData,
        beforeyesterday: beforeyesterday || defaultData,
        week: week || defaultData,
        month: month || defaultData,
        quarter: quarter || defaultData,
        year: year || defaultData
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
  }
};
if (!Array) {
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_tooltip2 = common_vendor.resolveComponent("uni-tooltip");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  (_easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_icons2 + _easycom_uni_tooltip2 + _easycom_uni_td2 + _easycom_uni_table2)();
}
const _easycom_uni_th = () => "../../../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_icons = () => "../../../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_tooltip = () => "../../../../../uni_modules/uni-tooltip/components/uni-tooltip/uni-tooltip.js";
const _easycom_uni_td = () => "../../../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../../../uni_modules/uni-table/components/uni-table/uni-table.js";
if (!Math) {
  (_easycom_uni_th + _easycom_uni_tr + _easycom_uni_icons + _easycom_uni_tooltip + _easycom_uni_td + _easycom_uni_table)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      align: "center"
    }),
    b: common_vendor.p({
      align: "center"
    }),
    c: common_vendor.p({
      align: "center"
    }),
    d: common_vendor.p({
      align: "center"
    }),
    e: common_vendor.p({
      align: "center"
    }),
    f: common_vendor.p({
      align: "center"
    }),
    g: common_vendor.p({
      align: "center"
    }),
    h: common_vendor.p({
      align: "center"
    }),
    i: common_vendor.p({
      align: "center"
    }),
    j: common_vendor.f($data.fieldsMap, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.title),
        b: "353e02ea-14-" + i0 + "," + ("353e02ea-13-" + i0),
        c: item.tooltip
      }, item.tooltip ? {
        d: common_vendor.t(item.tooltip)
      } : {}, {
        e: "353e02ea-13-" + i0 + "," + ("353e02ea-12-" + i0),
        f: "353e02ea-12-" + i0 + "," + ("353e02ea-11-" + i0),
        g: common_vendor.t($data.panelData.today[item.field]),
        h: "353e02ea-15-" + i0 + "," + ("353e02ea-11-" + i0),
        i: common_vendor.t($data.panelData.yesterday[item.field]),
        j: "353e02ea-16-" + i0 + "," + ("353e02ea-11-" + i0),
        k: common_vendor.t($data.panelData.beforeyesterday[item.field]),
        l: "353e02ea-17-" + i0 + "," + ("353e02ea-11-" + i0),
        m: common_vendor.t($data.panelData.week[item.field]),
        n: "353e02ea-18-" + i0 + "," + ("353e02ea-11-" + i0),
        o: common_vendor.t($data.panelData.month[item.field]),
        p: "353e02ea-19-" + i0 + "," + ("353e02ea-11-" + i0),
        q: common_vendor.t($data.panelData.quarter[item.field]),
        r: "353e02ea-20-" + i0 + "," + ("353e02ea-11-" + i0),
        s: common_vendor.t($data.panelData.year[item.field]),
        t: "353e02ea-21-" + i0 + "," + ("353e02ea-11-" + i0),
        v: common_vendor.t($data.panelData.total[item.field]),
        w: "353e02ea-22-" + i0 + "," + ("353e02ea-11-" + i0),
        x: index,
        y: "353e02ea-11-" + i0 + ",353e02ea-0"
      });
    }),
    k: common_vendor.p({
      type: "help",
      color: "#666"
    }),
    l: common_vendor.p({
      align: "center"
    }),
    m: common_vendor.p({
      align: "center"
    }),
    n: common_vendor.p({
      align: "center"
    }),
    o: common_vendor.p({
      align: "center"
    }),
    p: common_vendor.p({
      align: "center"
    }),
    q: common_vendor.p({
      align: "center"
    }),
    r: common_vendor.p({
      align: "center"
    }),
    s: common_vendor.p({
      align: "center"
    }),
    t: common_vendor.p({
      align: "center"
    }),
    v: common_vendor.p({
      loading: $data.loading,
      border: true,
      stripe: true,
      emptyText: "暂无更多数据"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-353e02ea"]]);
wx.createComponent(Component);
