"use strict";
const common_vendor = require("../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../uni_modules/uni-id-pages/common/store.js");
common_vendor.Zs.database();
common_vendor.Zs.getCurrentUserInfo().uid;
function verifyName() {
  let userinfo = common_vendor.index.getStorageSync("uni-id-pages-userInfo");
  let bool = uni_modules_uniIdPages_common_store.store.hasLogin;
  console.log("验证实名", bool);
  if (bool && userinfo.realNameStatus !== 2) {
    common_vendor.index.navigateTo({ url: "/pages/realAuthentication/realAuthentication" });
  } else if (bool && userinfo.realNameStatus === 3) {
    console.log("认证失败");
    common_vendor.index.showToast({
      title: "请重新实名认证",
      icon: "none"
    });
    common_vendor.index.navigateTo({ url: "/pages/realAuthentication/realAuthentication" });
  } else if (!bool) {
    common_vendor.index.navigateTo({ url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd" });
  }
}
exports.verifyName = verifyName;
