"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_title2 = common_vendor.resolveComponent("uni-title");
  _easycom_uni_title2();
}
const _easycom_uni_title = () => "../../uni_modules/uni-title/components/uni-title/uni-title.js";
if (!Math) {
  _easycom_uni_title();
}
const _sfc_main = {
  __name: "feedBack",
  setup(__props) {
    const image = common_vendor.ref(
      "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/gongzhonghaoerweima.png"
    );
    function open() {
      console.log("打开");
      common_vendor.index.previewImage({
        urls: [image.value],
        longPressActions: {
          itemList: ["发送给朋友", "保存图片", "收藏"],
          success: function(data) {
          },
          fail: function(err) {
            console.log(err.errMsg);
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "h2",
          title: "关注下方公众号,即时获得消息通知",
          align: "center"
        }),
        b: image.value,
        c: common_vendor.o(open)
      };
    };
  }
};
wx.createPage(_sfc_main);
