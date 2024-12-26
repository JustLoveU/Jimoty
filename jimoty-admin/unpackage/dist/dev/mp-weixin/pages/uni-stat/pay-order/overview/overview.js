"use strict";
const js_sdk_uniStat_util = require("../../../../js_sdk/uni-stat/util.js");
const common_vendor = require("../../../../common/vendor.js");
const statPanelTotal = () => "./components/statPanelTotal.js";
const statPanelToday = () => "./components/statPanelToday.js";
const trendChart = () => "./components/trendChart.js";
const _sfc_main = {
  components: {
    statPanelTotal,
    statPanelToday,
    trendChart
  },
  data() {
    return {
      query: {
        appid: "",
        platform_id: "",
        uni_platform: "",
        version_id: "",
        channel_id: ""
      }
    };
  },
  onLoad(option) {
    const {
      appid
    } = option;
    if (appid) {
      this.query.appid = appid;
    }
  },
  computed: {
    versionQuery() {
      const {
        appid,
        uni_platform
      } = this.query;
      const query = js_sdk_uniStat_util.stringifyQuery({
        appid,
        uni_platform
      });
      return query;
    },
    channelQuery() {
      const {
        appid,
        platform_id
      } = this.query;
      const query = js_sdk_uniStat_util.stringifyQuery({
        appid,
        platform_id
      });
      return query;
    }
  },
  created() {
  },
  methods: {
    platformChange(id, index, name, item) {
      this.query.version_id = 0;
      this.query.uni_platform = item.code;
    }
  },
  watch: {
    // versionQuery(){
    // 	if (this.$refs["version-select"]) {
    // 		this.$refs["version-select"].mixinDatacomEasyGet();
    // 	}
    // }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _component_statPanelTotal = common_vendor.resolveComponent("statPanelTotal");
  const _component_statPanelToday = common_vendor.resolveComponent("statPanelToday");
  const _component_trendChart = common_vendor.resolveComponent("trendChart");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_data_select2 + _easycom_uni_stat_tabs2 + _component_statPanelTotal + _component_statPanelToday + _component_trendChart + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_data_select = () => "../../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_stat_tabs = () => "../../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_fix_window = () => "../../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $data.query.appid = $event),
    b: common_vendor.p({
      collection: "opendb-app-list",
      field: "appid as value, name as text",
      orderby: "text asc",
      defItem: 1,
      label: "应用选择",
      clear: false,
      modelValue: $data.query.appid
    }),
    c: common_vendor.o(($event) => $data.query.version_id = $event),
    d: common_vendor.p({
      collection: "opendb-app-versions",
      where: $options.versionQuery,
      field: "_id as value, version as text, uni_platform as label, create_date as date",
      format: "{label} - {text}",
      orderby: "date desc",
      label: "版本选择",
      modelValue: $data.query.version_id
    }),
    e: common_vendor.o($options.platformChange),
    f: common_vendor.o(($event) => $data.query.platform_id = $event),
    g: common_vendor.p({
      label: "平台选择",
      type: "boldLine",
      mode: "platform",
      modelValue: $data.query.platform_id
    }),
    h: $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1
  }, $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1 ? {
    i: common_vendor.o(($event) => $data.query.channel_id = $event),
    j: common_vendor.p({
      collection: "uni-stat-app-channels",
      where: $options.channelQuery,
      field: "_id as value, channel_name as text",
      orderby: "text asc",
      label: "渠道/场景值选择",
      modelValue: $data.query.channel_id
    })
  } : {}, {
    k: common_vendor.p({
      query: $data.query
    }),
    l: common_vendor.p({
      query: $data.query
    }),
    m: common_vendor.p({
      query: $data.query
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
