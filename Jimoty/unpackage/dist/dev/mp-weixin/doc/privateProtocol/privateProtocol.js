"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {};
if (!Array) {
  const _easycom_uni_title2 = common_vendor.resolveComponent("uni-title");
  _easycom_uni_title2();
}
const _easycom_uni_title = () => "../../uni_modules/uni-title/components/uni-title/uni-title.js";
if (!Math) {
  _easycom_uni_title();
}
function _sfc_render(_ctx, _cache) {
  return {
    a: common_vendor.p({
      title: "请仔细阅读以下内容",
      align: "center"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d382b255"]]);
wx.createPage(MiniProgramPage);
