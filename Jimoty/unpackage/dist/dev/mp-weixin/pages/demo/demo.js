"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/sendMessage.js");
const _sfc_main = {
  __name: "demo",
  setup(__props) {
    const db = common_vendor.Zs.database();
    common_vendor.Zs.importObject("secCheckContent", { customUI: true });
    const a = common_vendor.ref();
    const b = common_vendor.ref();
    const stsss = common_vendor.ref("aa");
    function send() {
      db.collection("jimoty-notice").add({
        sendPeople: "66f190b0286f7cec14cf4f62",
        type: 7,
        receive: "67429178bd0220786db0810b",
        message: "673b35ddf2949ce0c7f7fefb",
        otherMessage: "您的帖子超过3个月未出售,已被自动下架,详情请点击...",
        status: false
      });
    }
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(a.value),
        b: common_vendor.t(b.value),
        c: common_vendor.t(stsss.value),
        d: common_vendor.o(send)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d10efb47"]]);
wx.createPage(MiniProgramPage);
