"use strict";
const common_vendor = require("../../common/vendor.js");
const components_uniDataMenu_util = require("./util.js");
const _sfc_main = {
  data() {
    return {
      menus: [],
      userMenu: [],
      famliy: []
    };
  },
  mixins: [common_vendor.Vs.mixinDatacom],
  props: {
    // 当前激活菜单的 url
    value: {
      type: String,
      default: ""
    },
    // 当前激活菜单的文字颜色
    activeTextColor: {
      type: String,
      default: "#42B983"
    },
    // 是否只保持一个子菜单的展开
    uniqueOpened: {
      type: Boolean,
      default: false
    },
    staticMenu: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    localdata: {
      handler(newval) {
        if (this.hasLocalData(newval)) {
          this.userMenu = newval;
        }
      },
      immediate: true
    },
    // TODO 暂时无需监听，需要看后面会出现什么问题
    $route: {
      immediate: false,
      handler(val, old) {
        if (val.fullPath !== old.fullPath) {
          this.famliy = [];
          const menu = this.menus.find((m) => m.value === val.path);
          const menu_id = menu && menu.menu_id;
          this.getMenuAncestor(menu_id, this.menus);
          this.setRoutes && this.setRoutes(this.famliy);
        }
      }
    }
  },
  created() {
    if (this.hasLocalData(this.localdata))
      return;
    this.load();
  },
  // computed:{
  // 	userMenu() {
  // 		return this.getUserMenu(this.menus)
  // 	}
  // },
  methods: {
    ...common_vendor.mapActions({
      setRoutes: "app/setRoutes"
    }),
    getUserMenu(menuList) {
      const {
        permission,
        role
      } = common_vendor.Vs.getCurrentUserInfo();
      menuList.map((item) => {
        if (!menuList.some((subMenuItem) => subMenuItem.parent_id === item.menu_id)) {
          item.isLeafNode = true;
        }
      });
      if (!role.includes("admin")) {
        menuList = menuList.filter((item) => {
          if (item.isLeafNode) {
            if (item.permission && item.permission.length) {
              return item.permission.some((item2) => permission.indexOf(item2) > -1);
            }
            return false;
          }
          return true;
        });
      }
      return components_uniDataMenu_util.buildMenus(menuList);
    },
    onSelect(menu) {
      this.famliy = [];
      this.getMenuAncestor(menu.menu_id, this.menus);
      this.emit(menu);
    },
    emit(menu) {
      this.$emit("select", menu, this.famliy);
      this.$emit("input", menu.value);
    },
    hasLocalData(value) {
      return Array.isArray(value) && value.length > 0;
    },
    load() {
      if (this.mixinDatacomLoading == true) {
        return;
      }
      this.mixinDatacomLoading = true;
      this.mixinDatacomGet().then((res) => {
        this.mixinDatacomLoading = false;
        const {
          data,
          count
        } = res.result;
        this.menus = data;
        this.userMenu = this.getUserMenu(this.menus);
      }).catch((err) => {
        this.mixinDatacomLoading = false;
        this.mixinDatacomErrorMessage = err;
      });
    },
    getMenuAncestor(menuId, menus) {
      menus.forEach((item) => {
        if (item.menu_id === menuId) {
          const route = {
            name: item.text
          };
          const path = item.value;
          if (path) {
            route.to = {
              path
            };
          }
          this.famliy.unshift(route);
          const parent_id = item.parent_id;
          if (parent_id) {
            this.getMenuAncestor(parent_id, menus);
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_menu_sidebar2 = common_vendor.resolveComponent("uni-menu-sidebar");
  const _easycom_uni_nav_menu2 = common_vendor.resolveComponent("uni-nav-menu");
  (_easycom_uni_menu_sidebar2 + _easycom_uni_nav_menu2)();
}
const _easycom_uni_menu_sidebar = () => "../uni-menu-sidebar/uni-menu-sidebar.js";
const _easycom_uni_nav_menu = () => "../uni-nav-menu/uni-nav-menu.js";
if (!Math) {
  (_easycom_uni_menu_sidebar + _easycom_uni_nav_menu)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      data: $data.userMenu
    }),
    b: common_vendor.p({
      data: $props.staticMenu
    }),
    c: common_vendor.o($options.onSelect),
    d: common_vendor.p({
      active: $props.value,
      activeKey: "value",
      activeTextColor: $props.activeTextColor,
      uniqueOpened: $props.uniqueOpened
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
