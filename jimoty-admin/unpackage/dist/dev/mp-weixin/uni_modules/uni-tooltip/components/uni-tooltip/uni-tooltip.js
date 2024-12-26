"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "uni-tooltip",
  data() {
    return {};
  },
  methods: {},
  computed: {
    initPlacement() {
      let style = {};
      switch (this.placement) {
        case "left":
          style = {
            top: "50%",
            transform: "translateY(-50%)",
            right: "100%",
            "margin-right": "10rpx"
          };
          break;
        case "right":
          style = {
            top: "50%",
            transform: "translateY(-50%)",
            left: "100%",
            "margin-left": "10rpx"
          };
          break;
        case "top":
          style = {
            bottom: "100%",
            transform: "translateX(-50%)",
            left: "50%",
            "margin-bottom": "10rpx"
          };
          break;
        case "bottom":
          style = {
            top: "100%",
            transform: "translateX(-50%)",
            left: "50%",
            "margin-top": "10rpx"
          };
          break;
      }
      return style;
    }
  },
  props: {
    content: {
      type: String,
      default: ""
    },
    placement: {
      type: String,
      default: "bottom"
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.content || _ctx.$slots.content
  }, $props.content || _ctx.$slots.content ? {
    b: common_vendor.t($props.content),
    c: common_vendor.s($options.initPlacement)
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
