"use strict";
const components_uniNavMenu_mixins_rootParent = require("../uni-nav-menu/mixins/rootParent.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "uniMenuItem",
  mixins: [components_uniNavMenu_mixins_rootParent.rootParent],
  props: {
    // 唯一标识
    index: {
      type: [String, Object],
      default() {
        return "";
      }
    },
    // TODO 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: false,
      activeTextColor: "#42B983",
      textColor: "#303133",
      activeBackgroundColor: ""
    };
  },
  computed: {
    paddingLeft() {
      let subMenu = this.rootMenu && this.rootMenu.SubMenu && this.rootMenu.SubMenu.length || 0;
      return 20 + 20 * subMenu + "px";
    }
  },
  created() {
    this.init();
  },
  destroyed() {
    if (this.$menuParent) {
      const menuIndex = this.$menuParent.itemChildrens.findIndex((item) => item === this);
      this.$menuParent.itemChildrens.splice(menuIndex, 1);
    }
  },
  methods: {
    init() {
      this.rootMenu = {
        NavMenu: [],
        SubMenu: []
      };
      this.indexPath = [];
      this.getParentAll("SubMenu", this);
      this.$menuParent = this.getParent("uniNavMenu", this);
      this.$subMenu = this.rootMenu.SubMenu;
      this.activeTextColor = this.$menuParent.activeTextColor;
      this.textColor = this.$menuParent.textColor;
      this.activeBackgroundColor = this.$menuParent.activeBackgroundColor;
      if (this.$menuParent) {
        this.$menuParent.itemChildrens.push(this);
        this.$menuParent.isActive(this);
      }
    },
    // 点击 menuItem
    onClickItem(e) {
      if (this.disabled)
        return;
      this.$menuParent.closeOtherActive(this);
      this.active = true;
      this.indexPath.unshift(this.index);
      this.indexPath.reverse();
      if (e !== "init") {
        this.$menuParent.select(this.index, this.indexPath);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.active ? 1 : "",
    b: $props.disabled ? 1 : "",
    c: $options.paddingLeft,
    d: $data.active ? $data.activeBackgroundColor : "",
    e: common_vendor.o((...args) => $options.onClickItem && $options.onClickItem(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
