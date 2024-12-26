"use strict";
const common_vendor = require("./common/vendor.js");
const topWindow = () => "./windows/topWindow.js";
const leftWindow = () => "./windows/leftWindow.js";
const _sfc_main = {
  components: {
    topWindow,
    leftWindow
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    tiggerWindow() {
      this.visible = !this.visible;
    }
  }
};
if (!Array) {
  const _component_top_window = common_vendor.resolveComponent("top-window");
  const _component_left_window = common_vendor.resolveComponent("left-window");
  (_component_top_window + _component_left_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.tiggerWindow && $options.tiggerWindow(...args)),
    b: $data.visible,
    c: common_vendor.o((...args) => $options.tiggerWindow && $options.tiggerWindow(...args)),
    d: $data.visible
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
exports.Component = Component;
