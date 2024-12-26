"use strict";
const common_vendor = require("../../common/vendor.js");
const admin_config = require("../../admin.config.js");
const debugOptions = admin_config.config.navBar.debug || {};
const _sfc_main = {
  data() {
    return {
      engines: debugOptions.engine || []
    };
  },
  computed: {
    ...common_vendor.mapState("error", ["logs"])
  },
  methods: {
    search(engine, log) {
    }
  }
};
if (!Array) {
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  (_easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2)();
}
const _easycom_uni_th = () => "../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
if (!Math) {
  (_easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      align: "center"
    }),
    b: common_vendor.p({
      width: "100",
      align: "center"
    }),
    c: common_vendor.p({
      width: "100",
      align: "center"
    }),
    d: common_vendor.p({
      width: "100",
      align: "center"
    }),
    e: common_vendor.f(_ctx.logs, (log, index, i0) => {
      return {
        a: common_vendor.t(log.info),
        b: common_vendor.t(log.err),
        c: "41d0fbe2-7-" + i0 + "," + ("41d0fbe2-6-" + i0),
        d: common_vendor.t(log.route),
        e: log.route,
        f: "41d0fbe2-8-" + i0 + "," + ("41d0fbe2-6-" + i0),
        g: common_vendor.t(log.time),
        h: "41d0fbe2-9-" + i0 + "," + ("41d0fbe2-6-" + i0),
        i: "41d0fbe2-10-" + i0 + "," + ("41d0fbe2-6-" + i0),
        j: index,
        k: "41d0fbe2-6-" + i0 + ",41d0fbe2-0"
      };
    }),
    f: common_vendor.p({
      border: true,
      stripe: true
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
