"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
const _sfc_main = {
  __name: "submit",
  setup(__props) {
    let bool = uni_modules_uniIdPages_common_store.store.hasLogin;
    const gotoDetail1 = (index) => {
      if (!bool) {
        common_vendor.index.navigateTo({
          url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        });
      }
      common_vendor.index.navigateTo({
        url: "/pages/submit/resubmit/detailpage1"
      });
    };
    const gotoDetail2 = (index) => {
      if (!bool) {
        common_vendor.index.navigateTo({
          url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        });
      }
      common_vendor.index.navigateTo({
        url: "/pages/submit/resubmit/detailpage2"
      });
    };
    const gotoDetail3 = (index) => {
      if (!bool) {
        common_vendor.index.navigateTo({
          url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        });
      }
      common_vendor.index.navigateTo({
        url: "/pages/submit/resubmit/detailpage3"
      });
    };
    const gotoDetail4 = (index) => {
      if (!bool) {
        common_vendor.index.navigateTo({
          url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        });
      }
      common_vendor.index.navigateTo({
        url: "/pages/submit/resubmit/detailpage4"
      });
    };
    const gotoDetail5 = (index) => {
      if (!bool) {
        common_vendor.index.navigateTo({
          url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        });
      }
      common_vendor.index.navigateTo({
        url: "/pages/submit/resubmit/detailpage5"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(gotoDetail5),
        b: common_vendor.o(gotoDetail1),
        c: common_vendor.o(gotoDetail2),
        d: common_vendor.o(gotoDetail3),
        e: common_vendor.o(gotoDetail4),
        f: common_assets._imports_0,
        g: common_vendor.o(gotoDetail5)
      };
    };
  }
};
wx.createPage(_sfc_main);
