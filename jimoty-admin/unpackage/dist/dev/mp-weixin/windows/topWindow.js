"use strict";
const common_vendor = require("../common/vendor.js");
const admin_config = require("../admin.config.js");
const errorLog = () => "./components/error-log.js";
const _sfc_main = {
  components: {
    errorLog
  },
  props: {
    navigationBarTitleText: {
      type: String
    },
    matchLeftWindow: {
      type: Boolean
    },
    showLeftWindow: {
      type: Boolean
    }
  },
  data() {
    return {
      ...admin_config.config.navBar,
      popupMenuOpened: false,
      mpCapsule: 0,
      langIndex: 0
    };
  },
  computed: {
    ...common_vendor.mapState("app", ["appName", "routes", "theme"]),
    ...common_vendor.mapState("error", ["logs"]),
    userInfo() {
      return this.$uniIdPagesStore.store.userInfo;
    },
    themeIndex() {
      let i = 0;
      this.themes.forEach((theme, index) => {
        if (theme.value === this.theme)
          i = index;
      });
      return i;
    }
  },
  mounted() {
    let menuButtonInfo = common_vendor.index.getMenuButtonBoundingClientRect();
    this.mpCapsule = menuButtonInfo.width;
  },
  methods: {
    ...common_vendor.mapMutations("app", ["SET_THEME"]),
    showErrorLogs() {
      if (this.popupMenuOpened) {
        this.popupMenuOpened = false;
      }
      this.$refs.errorLogsPopup.open();
    },
    showPasswordPopup() {
      if (this.popupMenuOpened) {
        this.popupMenuOpened = false;
      }
      this.$refs.passwordPopup.open();
    },
    logout() {
      this.popupMenuOpened = false;
      this.$uniIdPagesStore.mutations.logout();
    },
    toggleSidebar() {
      if (!this.showLeftWindow) {
        common_vendor.index.showLeftWindow();
      } else {
        common_vendor.index.hideLeftWindow();
      }
    },
    togglePopupMenu() {
      this.popupMenuOpened = !this.popupMenuOpened;
    },
    changePassword() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd",
        complete: () => {
          this.popupMenuOpened = false;
        }
      });
    },
    changeLanguage(e) {
      let index = typeof e === "object" ? e.detail.value : e;
      if (!index || index < 0)
        index = 0;
      const lang = this.langs[index].lang || "zh-Hans";
      const platform = common_vendor.index.getSystemInfoSync().platform;
      if (platform === "android") {
        common_vendor.index.showToast({
          icon: "error",
          title: "暂不支持",
          duration: 2e3
        });
        return;
      }
      this.$i18n.locale = lang;
      this.langIndex = index;
      common_vendor.index.setLocale(lang);
    },
    linkTo() {
      common_vendor.index.reLaunch({
        url: "/"
      });
    },
    changeTheme(e) {
      const index = typeof e === "object" ? e.detail.value : e;
      const theme = this.themes[index].value || "default";
      if (this.theme !== theme)
        this.SET_THEME(theme);
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_error_log = common_vendor.resolveComponent("error-log");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _component_error_log + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.logo,
    b: common_vendor.t(_ctx.appName),
    c: common_vendor.o((...args) => $options.linkTo && $options.linkTo(...args)),
    d: common_vendor.o($options.toggleSidebar),
    e: common_vendor.p({
      type: "bars",
      size: "30",
      color: "#999"
    }),
    f: common_vendor.t($props.navigationBarTitleText),
    g: common_vendor.p({
      type: "color-filled",
      size: "24",
      color: "#999"
    }),
    h: _ctx.themes,
    i: $options.themeIndex,
    j: common_vendor.o((...args) => $options.changeTheme && $options.changeTheme(...args)),
    k: _ctx.langs,
    l: common_vendor.o((...args) => $options.changeLanguage && $options.changeLanguage(...args)),
    m: $data.langIndex,
    n: common_vendor.t($options.userInfo.nickname || $options.userInfo.username || $options.userInfo.mobile || $options.userInfo.email),
    o: common_vendor.p({
      type: "arrowdown",
      color: "#666",
      size: "13"
    }),
    p: $options.userInfo.nickname || $options.userInfo.username || $options.userInfo.mobile || $options.userInfo.email,
    q: common_vendor.o((...args) => $options.togglePopupMenu && $options.togglePopupMenu(...args)),
    r: common_vendor.o((...args) => $options.togglePopupMenu && $options.togglePopupMenu(...args)),
    s: $options.userInfo.nickname || $options.userInfo.username || $options.userInfo.mobile || $options.userInfo.email
  }, $options.userInfo.nickname || $options.userInfo.username || $options.userInfo.mobile || $options.userInfo.email ? {
    t: common_vendor.t(_ctx.$t("topwindow.text.changePwd")),
    v: common_vendor.o((...args) => $options.changePassword && $options.changePassword(...args)),
    w: common_vendor.t(_ctx.$t("topwindow.text.signOut")),
    x: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  } : {}, {
    y: !$props.matchLeftWindow ? 1 : "",
    z: $data.popupMenuOpened ? 1 : "",
    A: common_vendor.sr("errorLogsPopup", "24352a2c-3"),
    B: common_vendor.p({
      type: "center"
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
