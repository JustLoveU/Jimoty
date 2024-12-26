"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const admin_config = require("./admin.config.js");
const store_constants = require("./store/constants.js");
const js_sdk_extStorage_uploadFileForExtStorage = require("./js_sdk/ext-storage/uploadFileForExtStorage.js");
const store_index = require("./store/index.js");
const js_sdk_uniAdmin_plugin = require("./js_sdk/uni-admin/plugin.js");
const i18n_index = require("./i18n/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/demo/icons/icons.js";
  "./pages/demo/table/table.js";
  "./uni_modules/uni-id-pages/pages/login/login-withpwd.js";
  "./pages/error/404.js";
  "./uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd.js";
  "./uni_modules/uni-upgrade-center/pages/version/list.js";
  "./uni_modules/uni-upgrade-center/pages/version/add.js";
  "./uni_modules/uni-upgrade-center/pages/version/detail.js";
  "./uni_modules/uni-id-pages/pages/userinfo/deactivate/deactivate.js";
  "./uni_modules/uni-id-pages/pages/userinfo/userinfo.js";
  "./uni_modules/uni-id-pages/pages/userinfo/bind-mobile/bind-mobile.js";
  "./uni_modules/uni-id-pages/pages/userinfo/cropImage/cropImage.js";
  "./uni_modules/uni-id-pages/pages/login/login-smscode.js";
  "./uni_modules/uni-id-pages/pages/login/login-withoutpwd.js";
  "./uni_modules/uni-id-pages/pages/register/register.js";
  "./uni_modules/uni-id-pages/pages/register/register-admin.js";
  "./uni_modules/uni-id-pages/pages/register/register-by-email.js";
  "./uni_modules/uni-id-pages/pages/retrieve/retrieve.js";
  "./uni_modules/uni-id-pages/pages/retrieve/retrieve-by-email.js";
  "./uni_modules/uni-id-pages/pages/common/webview/webview.js";
  "./uni_modules/uni-id-pages/pages/userinfo/set-pwd/set-pwd.js";
  "./uni_modules/uni-id-pages/pages/userinfo/realname-verify/realname-verify.js";
  "./pages/jimoty-post/add.js";
  "./pages/jimoty-post/edit.js";
  "./pages/jimoty-post/list.js";
  "./pages/jimoty-category/add.js";
  "./pages/jimoty-category/edit.js";
  "./pages/jimoty-category/list.js";
  "./pages/jimoty-chat-message/add.js";
  "./pages/jimoty-chat-message/edit.js";
  "./pages/jimoty-chat-message/list.js";
  "./pages/jimoty-chat/add.js";
  "./pages/jimoty-chat/edit.js";
  "./pages/jimoty-chat/list.js";
  "./pages/jimoty-comment/add.js";
  "./pages/jimoty-comment/edit.js";
  "./pages/jimoty-comment/list.js";
  "./pages/jimoty-daoju/add.js";
  "./pages/jimoty-daoju/edit.js";
  "./pages/jimoty-daoju/list.js";
  "./pages/jimoty-daoju-use/add.js";
  "./pages/jimoty-daoju-use/edit.js";
  "./pages/jimoty-daoju-use/list.js";
  "./pages/jimoty-sec-check-img-log/add.js";
  "./pages/jimoty-sec-check-img-log/edit.js";
  "./pages/jimoty-sec-check-img-log/list.js";
  "./pages/jimoty-pay-order/add.js";
  "./pages/jimoty-pay-order/edit.js";
  "./pages/jimoty-pay-order/list.js";
  "./pages/jimoty-notice/add.js";
  "./pages/jimoty-notice/edit.js";
  "./pages/jimoty-notice/list.js";
  "./pages/system/menu/list.js";
  "./pages/system/menu/add.js";
  "./pages/system/menu/edit.js";
  "./pages/system/permission/list.js";
  "./pages/system/permission/add.js";
  "./pages/system/permission/edit.js";
  "./pages/system/role/add.js";
  "./pages/system/role/edit.js";
  "./pages/system/role/list.js";
  "./pages/system/user/add.js";
  "./pages/system/user/edit.js";
  "./pages/system/user/list.js";
  "./pages/system/app/add.js";
  "./pages/system/app/list.js";
  "./pages/system/app/uni-portal/uni-portal.js";
  "./pages/system/tag/add.js";
  "./pages/system/tag/edit.js";
  "./pages/system/tag/list.js";
  "./pages/system/safety/list.js";
  "./pages/uni-stat/page-res/page-res.js";
  "./pages/uni-stat/page-ent/page-ent.js";
  "./pages/uni-stat/page-content/page-content.js";
  "./pages/uni-stat/page-rule/page-rule.js";
  "./pages/uni-stat/scene/scene.js";
  "./pages/uni-stat/channel/channel.js";
  "./pages/uni-stat/error/js/detail.js";
  "./pages/uni-stat/error/app/app.js";
  "./pages/uni-stat/event/event.js";
  "./pages/uni-stat/device/overview/overview.js";
  "./pages/uni-stat/device/activity/activity.js";
  "./pages/uni-stat/device/trend/trend.js";
  "./pages/uni-stat/device/retention/retention.js";
  "./pages/uni-stat/device/comparison/comparison.js";
  "./pages/uni-stat/device/stickiness/stickiness.js";
  "./pages/uni-stat/user/overview/overview.js";
  "./pages/uni-stat/user/activity/activity.js";
  "./pages/uni-stat/user/trend/trend.js";
  "./pages/uni-stat/user/retention/retention.js";
  "./pages/uni-stat/user/comparison/comparison.js";
  "./pages/uni-stat/user/stickiness/stickiness.js";
  "./pages/uni-stat/pay-order/overview/overview.js";
  "./pages/uni-stat/pay-order/list/list.js";
  "./pages/uni-stat/pay-order/funnel/funnel.js";
  "./pages/uni-stat/pay-order/ranking/ranking.js";
}
const _sfc_main = {
  created() {
    this.clear = void 0;
  },
  methods: {
    ...common_vendor.mapMutations("app", ["SET_THEME"]),
    ...common_vendor.mapActions({
      init: "app/init"
    }),
    clearPlatform() {
      const keysOfPlatform = common_vendor.index.getStorageInfoSync().keys.filter((key) => key.indexOf("platform") > -1);
      keysOfPlatform.length && keysOfPlatform.forEach((key) => common_vendor.index.removeStorageSync(key));
    }
  },
  onPageNotFound(msg) {
    common_vendor.index.redirectTo({
      url: admin_config.config.error.url
    });
  },
  onLaunch: function() {
    console.log("App Launch");
    if (this.$uniIdPagesStore.store.hasLogin) {
      this.init();
    }
    common_vendor.index.$on("uni-id-pages-login-success", () => {
      this.init();
    });
    this.SET_THEME(common_vendor.index.getStorageSync(store_constants.uniAdminCacheKey.theme) || "default");
    js_sdk_extStorage_uploadFileForExtStorage.uploadFileForExtStorage.init({
      provider: "unicloud",
      // provider代表默认上传到哪，可选项 "unicloud" 内置存储; "extStorage" 扩展存储;
      domain: "cdn.example.com",
      //【重要】这里需要改成你开通扩展存储时绑定的自定义域名）
      fileID2fileURL: true,
      // 将fileID转成fileURL，方便兼容老项目
      // 获取上传参数的函数
      uploadFileOptions: async (event) => {
        const uniCloudStorageExtCo = common_vendor.Vs.importObject("ext-storage-co");
        return await uniCloudStorageExtCo.getUploadFileOptions(event);
      }
    });
  },
  onShow: function() {
    console.log("App Show");
    this.clear = setInterval(() => this.clearPlatform(), 15 * 60 * 1e3);
  },
  onHide: function() {
    console.log("App Hide");
    this.clear && clearInterval(this.clear);
  }
};
const lang = common_vendor.index.getLocale();
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  const i18n = common_vendor.createI18n({
    locale: lang,
    messages: i18n_index.messages
  });
  app.use(i18n);
  app.use(js_sdk_uniAdmin_plugin.plugin);
  app.use(store_index.store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
