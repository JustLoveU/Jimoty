"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../../../js_sdk/uni-stat/util.js");
require("../../../../../js_sdk/uni-stat/timeUtil.js");
const pages_uniStat_payOrder_overview_fieldsMap = require("../fieldsMap.js");
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
      panelData: pages_uniStat_payOrder_overview_fieldsMap.fieldsGroupMap,
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
      const where = js_sdk_uniStat_util.stringifyQuery({
        ...query,
        start_time: [js_sdk_uniStat_util.getTimeOfSomeDayAgo(0), Date.now()]
      }, true, ["uni_platform"]);
      const db = common_vendor.Vs.database();
      db.collection(this.tableName).where(where).field(`${js_sdk_uniStat_util.stringifyField(pages_uniStat_payOrder_overview_fieldsMap.fieldsMap)}, dimension, stat_date.date_str as stat_time, start_time`).groupBy(`stat_time, dimension`).groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_payOrder_overview_fieldsMap.fieldsMap)).orderBy("stat_time", "desc").get().then((res) => {
        let data = res.result.data;
        data = js_sdk_uniStat_util.formatterData({
          fieldsMap: pages_uniStat_payOrder_overview_fieldsMap.fieldsMap,
          data
        });
        let today = data.find((item) => {
          return item.dimension === "day" && item.stat_time === js_sdk_uniStat_util.parseDateTime(js_sdk_uniStat_util.getTimeOfSomeDayAgo(0), "");
        });
        if (!today) {
          today = data.find((item) => {
            return item.dimension === "hour" && item.stat_time === js_sdk_uniStat_util.parseDateTime(js_sdk_uniStat_util.getTimeOfSomeDayAgo(0), "");
          }) || {};
        }
        this.loading = false;
        this.panelData = this.setPanelData(today);
      });
    },
    // 设置面板数据
    setPanelData(data) {
      let panelData = this.panelData;
      panelData.map((item1, index1) => {
        item1.list.map((item2, index2) => {
          item2.value = data[item2.field] || 0;
        });
      });
      return panelData;
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
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_tooltip2 = common_vendor.resolveComponent("uni-tooltip");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  (_easycom_uni_th2 + _easycom_uni_icons2 + _easycom_uni_tooltip2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2)();
}
const _easycom_uni_th = () => "../../../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_icons = () => "../../../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_tooltip = () => "../../../../../uni_modules/uni-tooltip/components/uni-tooltip/uni-tooltip.js";
const _easycom_uni_tr = () => "../../../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../../../uni_modules/uni-table/components/uni-table/uni-table.js";
if (!Math) {
  (_easycom_uni_th + _easycom_uni_icons + _easycom_uni_tooltip + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      align: "center"
    }),
    b: common_vendor.f($data.panelData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: "e54c9d4a-5-" + i0 + "," + ("e54c9d4a-4-" + i0),
        c: common_vendor.f(item.list, (item2, index2, i1) => {
          return {
            a: common_vendor.t(item2.tooltip),
            b: index2
          };
        }),
        d: "e54c9d4a-4-" + i0 + "," + ("e54c9d4a-3-" + i0),
        e: index,
        f: "e54c9d4a-3-" + i0 + ",e54c9d4a-1"
      };
    }),
    c: common_vendor.p({
      type: "help",
      color: "#666"
    }),
    d: common_vendor.p({
      align: "center"
    }),
    e: common_vendor.p({
      align: "center"
    }),
    f: common_vendor.f($data.panelData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.list[0].value),
        b: index,
        c: "e54c9d4a-8-" + i0 + ",e54c9d4a-6"
      };
    }),
    g: common_vendor.p({
      align: "center"
    }),
    h: common_vendor.p({
      align: "center"
    }),
    i: common_vendor.f($data.panelData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.list[1].value),
        b: index,
        c: "e54c9d4a-11-" + i0 + ",e54c9d4a-9"
      };
    }),
    j: common_vendor.p({
      align: "center"
    }),
    k: common_vendor.p({
      align: "center"
    }),
    l: common_vendor.f($data.panelData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.list[2].value),
        b: index,
        c: "e54c9d4a-14-" + i0 + ",e54c9d4a-12"
      };
    }),
    m: common_vendor.p({
      align: "center"
    }),
    n: common_vendor.p({
      loading: $data.loading,
      border: true,
      stripe: true,
      emptyText: "暂无更多数据"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e54c9d4a"]]);
wx.createComponent(Component);
