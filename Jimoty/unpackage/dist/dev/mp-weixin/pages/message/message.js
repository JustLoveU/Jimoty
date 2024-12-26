"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (page1 + page2 + page3)();
}
const page1 = () => "./components/page1.js";
const page2 = () => "./components/page2.js";
const page3 = () => "./components/page3.js";
const _sfc_main = {
  __name: "message",
  setup(__props) {
    const navIndex = common_vendor.ref(0);
    function changeNav(index) {
      navIndex.value = index;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.n(navIndex.value == 0 ? "active" : ""),
        b: common_vendor.o(($event) => changeNav(0)),
        c: common_vendor.n(navIndex.value == 1 ? "active" : ""),
        d: common_vendor.o(($event) => changeNav(1)),
        e: common_vendor.n(navIndex.value == 2 ? "active" : ""),
        f: common_vendor.o(($event) => changeNav(2)),
        g: navIndex.value == 0
      }, navIndex.value == 0 ? {} : navIndex.value == 1 ? {} : navIndex.value == 2 ? {} : {}, {
        h: navIndex.value == 1,
        i: navIndex.value == 2
      });
    };
  }
};
wx.createPage(_sfc_main);
