"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  name: "uni-stat-breadcrumb",
  data() {
    return {};
  },
  computed: {
    ...common_vendor.mapState("app", ["routes"])
  }
};
if (!Array) {
  const _easycom_uni_breadcrumb_item2 = common_vendor.resolveComponent("uni-breadcrumb-item");
  const _easycom_uni_breadcrumb2 = common_vendor.resolveComponent("uni-breadcrumb");
  (_easycom_uni_breadcrumb_item2 + _easycom_uni_breadcrumb2)();
}
const _easycom_uni_breadcrumb_item = () => "./uni_modules/uni-breadcrumb/components/uni-breadcrumb-item/uni-breadcrumb-item.js";
const _easycom_uni_breadcrumb = () => "./uni_modules/uni-breadcrumb/components/uni-breadcrumb/uni-breadcrumb.js";
if (!Math) {
  (_easycom_uni_breadcrumb_item + _easycom_uni_breadcrumb)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(_ctx.routes, (route, index, i0) => {
      return {
        a: common_vendor.t(route.name),
        b: index,
        c: "4386ec73-1-" + i0 + ",4386ec73-0",
        d: common_vendor.p({
          to: route.to && route.to.path || ""
        })
      };
    }),
    b: common_vendor.p({
      separator: "/"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
exports.Component = Component;
