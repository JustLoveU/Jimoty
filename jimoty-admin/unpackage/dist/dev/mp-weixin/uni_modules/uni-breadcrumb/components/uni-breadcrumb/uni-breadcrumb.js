"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  options: {
    virtualHost: true
  },
  props: {
    separator: {
      type: String,
      default: "/"
    },
    separatorClass: {
      type: String,
      default: ""
    }
  },
  provide() {
    return {
      uniBreadcrumb: this
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
