"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "JJ-protocol",
  setup(__props, { expose: __expose }) {
    const ifConfirm = common_vendor.ref(true);
    function comfirm() {
      ifConfirm.value = !ifConfirm.value;
    }
    function gotoUser() {
      common_vendor.index.navigateTo({
        url: "/doc/userProtocol/userProtocol"
      });
    }
    __expose({
      ifConfirm
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(comfirm),
        b: common_vendor.n(ifConfirm.value ? "active" : ""),
        c: common_vendor.o(gotoUser)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-900831e0"]]);
wx.createComponent(Component);
