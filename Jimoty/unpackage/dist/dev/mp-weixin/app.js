"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const common_appInit = require("./common/appInit.js");
require("./common/openApp.js");
const utils_getLocalMap = require("./utils/getLocalMap.js");
require("./utils/verifyName.js");
const uni_modules_uniIdPages_init = require("./uni_modules/uni-id-pages/init.js");
const uni_modules_uniIdPages_common_store = require("./uni_modules/uni-id-pages/common/store.js");
const lang_i18n = require("./lang/i18n.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/search/search.js";
  "./pages/submit/submit.js";
  "./pages/message/message.js";
  "./pages/my/my.js";
  "./pages/message/chatPage.js";
  "./pages/home/detail.js";
  "./pages/message/order.js";
  "./pages/my/myDetail.js";
  "./pages/message/address.js";
  "./uni_modules/unicloud-city-select/pages/uni-city-list/uni-city-list.js";
  "./pages/message/addAddress.js";
  "./uni_modules/uni-pay/pages/success/success.js";
  "./uni_modules/uni-pay/pages/ad-interactive-webview/ad-interactive-webview.js";
  "./uni_modules/uni-pay/pages/pay-desk/pay-desk.js";
  "./pages/submit/resubmit/detailpage1.js";
  "./pages/message/orderStep.js";
  "./pages/submit/resubmit/detailpage2.js";
  "./pages/submit/resubmit/detailpage3.js";
  "./pages/submit/resubmit/detailpage4.js";
  "./pages/submit/resubmit/detailpage5.js";
  "./pages/demo/demo.js";
  "./pages/submit/camera.js";
  "./pages/submit/map.js";
  "./pages/submit/datapage.js";
  "./pages/home/notice.js";
  "./pages/my/draft.js";
  "./pages/my/comment.js";
  "./pages/my/follow.js";
  "./pages/jimoty_category/add.js";
  "./pages/submit/otherDataPage.js";
  "./pages/my/collect.js";
  "./pages/my/member.js";
  "./pages/my/point.js";
  "./pages/order-detail/order-detail.js";
  "./pages/my/pointBuy/pointBuy.js";
  "./pages/my/notice.js";
  "./pages/realAuthentication/realAuthentication.js";
  "./pages/my/pointBuy/pointBuyDetail.js";
  "./pages/my/buy.js";
  "./pages/my/feedBack.js";
  "./pages/home/categoryPage.js";
  "./pages/submit/common/webview/webview.js";
  "./pages/my/noticeAdd.js";
  "./pages/home/reback_notice.js";
  "./doc/userProtocol/userProtocol.js";
  "./doc/privateProtocol/privateProtocol.js";
  "./uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback.js";
  "./uni_modules/uni-id-pages/pages/userinfo/userinfo.js";
  "./uni_modules/uni-id-pages/pages/userinfo/realname-verify/realname-verify.js";
  "./uni_modules/uni-id-pages/pages/login/login-withoutpwd.js";
  "./uni_modules/uni-id-pages/pages/login/login-withpwd.js";
  "./uni_modules/uni-id-pages/pages/userinfo/deactivate/deactivate.js";
  "./uni_modules/uni-id-pages/pages/userinfo/bind-mobile/bind-mobile.js";
  "./uni_modules/uni-id-pages/pages/login/login-smscode.js";
  "./uni_modules/uni-id-pages/pages/register/register.js";
  "./uni_modules/uni-id-pages/pages/retrieve/retrieve.js";
  "./uni_modules/uni-id-pages/pages/common/webview/webview.js";
  "./uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd.js";
  "./uni_modules/uni-id-pages/pages/register/register-by-email.js";
  "./uni_modules/uni-id-pages/pages/retrieve/retrieve-by-email.js";
  "./uni_modules/uni-id-pages/pages/userinfo/set-pwd/set-pwd.js";
}
const _sfc_main = {
  globalData: {
    searchText: "",
    appVersion: {},
    config: {},
    $i18n: {},
    $t: {}
  },
  onLaunch: async function() {
    console.log("App Launch");
    this.globalData.$i18n = this.$i18n;
    this.globalData.$t = (str) => this.$t(str);
    utils_getLocalMap.getLocalMap();
    console.log("获取地理位置");
    if (uni_modules_uniIdPages_common_store.store.hasLogin) {
      const db = common_vendor.Zs.database();
      const res = await db.collection("uni-id-users").doc(common_vendor.Zs.getCurrentUserInfo().uid).field("status").get({ getOne: true });
      if (res.result.data.status && res.result.data.status == 1) {
        common_vendor.index.showToast({
          title: "该账号已被禁用",
          icon: "error"
        });
        setTimeout(() => {
          uni_modules_uniIdPages_common_store.mutations.logout();
        }, 800);
      }
    }
    common_appInit.initApp();
    uni_modules_uniIdPages_init.uniIdPageInit();
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(lang_i18n.i18n);
  return { app };
}
createApp().app.mount("#app");
exports.createApp = createApp;
