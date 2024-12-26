"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "address",
  setup(__props) {
    const ifcontral = common_vendor.ref(false);
    const controlAddress = () => {
      ifcontral.value = !ifcontral.value;
    };
    common_vendor.onMounted(() => {
    });
    common_vendor.ref(null);
    const open = () => {
      common_vendor.index.navigateTo({
        url: "/pages/message/addAddress"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(3, (item, index, i0) => {
          return common_vendor.e(ifcontral.value ? {
            a: "22d96a8e-0-" + i0,
            b: common_vendor.p({
              type: "trash",
              size: "14"
            })
          } : {}, {
            c: index
          });
        }),
        b: common_assets._imports_0$2,
        c: ifcontral.value,
        d: common_vendor.t(ifcontral.value ? "退出管理" : "管理"),
        e: common_vendor.o(controlAddress),
        f: common_vendor.o(open)
      };
    };
  }
};
wx.createPage(_sfc_main);
