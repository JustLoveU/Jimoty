"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      id: ""
    };
  },
  onLoad({
    id
  }) {
    this.id = id;
  },
  methods: {
    publish() {
      if (!this.id) {
        common_vendor.index.showModal({
          content: "页面出错，请返回重进",
          showCancel: false,
          success(res) {
            common_vendor.index.redirectTo({
              url: "/pages/system/app/list"
            });
          }
        });
        return;
      }
      this.$request("createPublishHtml", {
        id: this.id
      }, {
        functionName: "uni-portal",
        showModal: false
      }).then((res) => {
      }).catch((res) => {
        common_vendor.index.showModal({
          content: res.errMsg,
          showCancel: false
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.publish && $options.publish(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
