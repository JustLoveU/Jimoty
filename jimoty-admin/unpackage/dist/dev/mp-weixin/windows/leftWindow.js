"use strict";
const common_vendor = require("../common/vendor.js");
const admin_config = require("../admin.config.js");
const _sfc_main = {
  data() {
    return {
      ...admin_config.config.sideBar,
      field: "url as value, name as text, menu_id, parent_id, sort, icon, permission",
      currentMenu: "/"
    };
  },
  computed: {
    ...common_vendor.mapState("app", ["inited", "navMenu", "active"]),
    userInfo() {
      return this.$uniIdPagesStore.store.userInfo;
    }
  },
  watch: {
    userInfo: {
      // immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.$nextTick(function() {
            this.$refs.menu.load();
          });
        }
      }
    }
  },
  methods: {
    ...common_vendor.mapActions({
      setRoutes: "app/setRoutes"
    }),
    select(e, routes) {
      let url = e.value;
      if (!url) {
        url = this.active;
      }
      this.clickMenuItem(url);
      this.setRoutes(routes);
    },
    clickMenuItem(url) {
      if (url[0] !== "/" && url.indexOf("http") !== 0) {
        url = "/" + url;
      }
      if (url === "/") {
        url = admin_config.config.index.url;
      }
      common_vendor.index.redirectTo({
        url,
        fail: () => {
          common_vendor.index.showModal({
            title: "提示",
            content: "页面 " + url + " 跳转失败",
            showCancel: false
          });
        }
      });
    },
    splitFullPath(path) {
      if (!path) {
        path = "/";
      }
      return path.split("?")[0];
    }
  }
};
if (!Array) {
  const _easycom_uni_data_menu2 = common_vendor.resolveComponent("uni-data-menu");
  _easycom_uni_data_menu2();
}
const _easycom_uni_data_menu = () => "../components/uni-data-menu/uni-data-menu.js";
if (!Math) {
  _easycom_uni_data_menu();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("menu", "3fffa760-0"),
    b: common_vendor.o($options.select),
    c: common_vendor.p({
      value: $data.currentMenu,
      staticMenu: _ctx.staticMenu,
      collection: "opendb-admin-menus",
      ["page-size"]: 500,
      field: $data.field,
      where: "enable==true",
      orderby: "sort asc",
      ["active-text-color"]: "#409eff"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
