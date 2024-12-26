"use strict";
const common_vendor = require("../../../common/vendor.js");
const components_uniDataMenu_util = require("../../../components/uni-data-menu/util.js");
const originalMenuList = [
  {
    menu_id: "index",
    name: "首页",
    icon: "uni-icons-home",
    url: "/",
    sort: 100,
    parent_id: "",
    permission: [],
    enable: true,
    create_date: 1602662469396
  },
  {
    menu_id: "system_management",
    name: "系统管理",
    icon: "admin-icons-fl-xitong",
    url: "",
    sort: 1e3,
    parent_id: "",
    permission: [],
    enable: true,
    create_date: 1602662469396
  },
  {
    menu_id: "system_user",
    name: "用户管理",
    icon: "admin-icons-manager-user",
    url: "/pages/system/user/list",
    sort: 1010,
    parent_id: "system_management",
    permission: [],
    enable: true,
    create_date: 1602662469398
  },
  {
    menu_id: "system_role",
    name: "角色管理",
    icon: "admin-icons-manager-role",
    url: "/pages/system/role/list",
    sort: 1020,
    parent_id: "system_management",
    permission: [],
    enable: true,
    create_date: 1602662469397
  },
  {
    menu_id: "system_permission",
    name: "权限管理",
    icon: "admin-icons-manager-permission",
    url: "/pages/system/permission/list",
    sort: 1030,
    parent_id: "system_management",
    permission: [],
    enable: true,
    create_date: 1602662469396
  },
  {
    menu_id: "system_menu",
    name: "菜单管理",
    icon: "admin-icons-manager-menu",
    url: "/pages/system/menu/list",
    sort: 1040,
    parent_id: "system_management",
    permission: [],
    enable: true,
    create_date: 1602662469396
  },
  {
    menu_id: "system_app",
    name: "应用管理",
    icon: "admin-icons-manager-app",
    url: "/pages/system/app/list",
    sort: 1035,
    parent_id: "system_management",
    permission: [],
    enable: true,
    create_date: 1602662469399
  },
  {
    menu_id: "system_update",
    name: "App升级中心",
    icon: "uni-icons-cloud-upload",
    url: "/uni_modules/uni-upgrade-center/pages/version/list",
    sort: 1036,
    parent_id: "system_management",
    permission: [],
    enable: true,
    create_date: 1656491532434
  },
  {
    menu_id: "system_tag",
    name: "标签管理",
    icon: "admin-icons-manager-tag",
    url: "/pages/system/tag/list",
    sort: 1037,
    parent_id: "system_management",
    permission: [],
    enable: true,
    create_date: 1602662479389
  },
  {
    permission: [],
    enable: true,
    menu_id: "safety_statistics",
    name: "安全审计",
    icon: "admin-icons-safety",
    url: "",
    sort: 3100,
    parent_id: "",
    create_date: 1638356430871
  },
  {
    permission: [],
    enable: true,
    menu_id: "safety_statistics_user_log",
    name: "用户日志",
    icon: "",
    url: "/pages/system/safety/list",
    sort: 3101,
    parent_id: "safety_statistics",
    create_date: 1638356430871
  },
  {
    permission: [],
    enable: true,
    menu_id: "uni-stat",
    name: "uni 统计",
    icon: "admin-icons-tongji",
    url: "",
    sort: 2100,
    parent_id: "",
    create_date: 1638356430871
  },
  {
    parent_id: "uni-stat",
    permission: [],
    enable: true,
    menu_id: "uni-stat-device",
    name: "设备统计",
    icon: "admin-icons-shebeitongji",
    url: "",
    sort: 2120,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-device",
    permission: [],
    enable: true,
    menu_id: "uni-stat-device-overview",
    name: "概况",
    icon: "",
    url: "/pages/uni-stat/device/overview/overview",
    sort: 2121,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-device",
    permission: [],
    enable: true,
    menu_id: "uni-stat-device-activity",
    name: "活跃度",
    icon: "",
    url: "/pages/uni-stat/device/activity/activity",
    sort: 2122,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-device",
    permission: [],
    enable: true,
    menu_id: "uni-stat-device-trend",
    name: "趋势分析",
    icon: "",
    url: "/pages/uni-stat/device/trend/trend",
    sort: 2123,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-device",
    permission: [],
    enable: true,
    menu_id: "uni-stat-device-retention",
    name: "留存",
    icon: "",
    url: "/pages/uni-stat/device/retention/retention",
    sort: 2124,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-device",
    permission: [],
    enable: true,
    menu_id: "uni-stat-device-comparison",
    name: "平台对比",
    icon: "",
    url: "/pages/uni-stat/device/comparison/comparison",
    sort: 2125,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-device",
    permission: [],
    enable: true,
    menu_id: "uni-stat-device-stickiness",
    name: "粘性",
    icon: "",
    url: "/pages/uni-stat/device/stickiness/stickiness",
    sort: 2126,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat",
    permission: [],
    enable: true,
    menu_id: "uni-stat-user",
    name: "注册用户统计",
    icon: "admin-icons-yonghutongji",
    url: "",
    sort: 2122,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-user",
    permission: [],
    enable: true,
    menu_id: "uni-stat-user-overview",
    name: "概况",
    icon: "",
    url: "/pages/uni-stat/user/overview/overview",
    sort: 2121,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-user",
    permission: [],
    enable: true,
    menu_id: "uni-stat-user-activity",
    name: "活跃度",
    icon: "",
    url: "/pages/uni-stat/user/activity/activity",
    sort: 2122,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-user",
    permission: [],
    enable: true,
    icon: "",
    menu_id: "uni-stat-user-trend",
    name: "趋势分析",
    url: "/pages/uni-stat/user/trend/trend",
    sort: 2123,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-user",
    permission: [],
    enable: true,
    menu_id: "uni-stat-user-retention",
    name: "留存",
    icon: "",
    url: "/pages/uni-stat/user/retention/retention",
    sort: 2124,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-user",
    permission: [],
    enable: true,
    menu_id: "uni-stat-user-comparison",
    name: "平台对比",
    icon: "",
    url: "/pages/uni-stat/user/comparison/comparison",
    sort: 2125,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-user",
    permission: [],
    enable: true,
    menu_id: "uni-stat-user-stickiness",
    name: "粘性",
    icon: "",
    url: "/pages/uni-stat/user/stickiness/stickiness",
    sort: 2126,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat",
    permission: [],
    enable: true,
    menu_id: "uni-stat-page-analysis",
    name: "页面统计",
    icon: "admin-icons-page-ent",
    url: "",
    sort: 2123,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-page-analysis",
    permission: [],
    enable: true,
    menu_id: "uni-stat-page-res",
    name: "受访页",
    icon: "",
    url: "/pages/uni-stat/page-res/page-res",
    sort: 2131,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-page-analysis",
    permission: [],
    enable: true,
    menu_id: "uni-stat-page-ent",
    name: "入口页",
    icon: "",
    url: "/pages/uni-stat/page-ent/page-ent",
    sort: 2132,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat",
    permission: [],
    enable: true,
    menu_id: "uni-stat-page-content-analysis",
    name: "内容统计",
    icon: "admin-icons-doc",
    url: "",
    sort: 2140,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-page-content-analysis",
    permission: [],
    enable: true,
    menu_id: "uni-stat-page-content",
    name: "内容统计",
    icon: "",
    url: "/pages/uni-stat/page-content/page-content",
    sort: 2141,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-page-content-analysis",
    permission: [],
    enable: true,
    menu_id: "uni-stat-page-rule",
    name: "页面规则",
    icon: "",
    url: "/pages/uni-stat/page-rule/page-rule",
    sort: 2142,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat",
    permission: [],
    enable: true,
    menu_id: "uni-stat-senceChannel",
    name: "渠道/场景值分析",
    icon: "admin-icons-qudaofenxi",
    url: "",
    sort: 2150,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-senceChannel",
    permission: [],
    enable: true,
    menu_id: "uni-stat-senceChannel-scene",
    name: "场景值（小程序）",
    icon: "",
    url: "/pages/uni-stat/scene/scene",
    sort: 2151,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-senceChannel",
    permission: [],
    enable: true,
    menu_id: "uni-stat-senceChannel-channel",
    name: "渠道（app）",
    icon: "",
    url: "/pages/uni-stat/channel/channel",
    sort: 2152,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat",
    permission: [],
    enable: true,
    menu_id: "uni-stat-event-event",
    name: "自定义事件",
    icon: "admin-icons-shijianfenxi",
    url: "/pages/uni-stat/event/event",
    sort: 2160,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat",
    permission: [],
    enable: true,
    menu_id: "uni-stat-error",
    name: "错误统计",
    icon: "admin-icons-cuowutongji",
    url: "",
    sort: 2170,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-error",
    permission: [],
    enable: true,
    menu_id: "uni-stat-error-js",
    name: "js报错",
    icon: "",
    url: "/pages/uni-stat/error/js/js",
    sort: 2171,
    create_date: 1638356902516
  },
  {
    parent_id: "uni-stat-error",
    permission: [],
    enable: true,
    menu_id: "uni-stat-error-app",
    name: "app崩溃",
    icon: "",
    url: "/pages/uni-stat/error/app/app",
    sort: 2172,
    create_date: 1638356902516
  },
  {
    menu_id: "uni-stat-pay",
    name: "支付统计",
    icon: "uni-icons-circle",
    url: "",
    sort: 2122,
    parent_id: "uni-stat",
    permission: [],
    enable: true,
    create_date: 1667386977981
  },
  {
    menu_id: "uni-stat-pay-overview",
    name: "概况",
    icon: "",
    url: "/pages/uni-stat/pay-order/overview/overview",
    sort: 21221,
    parent_id: "uni-stat-pay",
    permission: [],
    enable: true,
    create_date: 1667387038602
  },
  {
    menu_id: "uni-stat-pay-funnel",
    name: "转换漏斗分析",
    icon: "",
    url: "/pages/uni-stat/pay-order/funnel/funnel",
    sort: 21222,
    parent_id: "uni-stat-pay",
    permission: [],
    enable: true,
    create_date: 1668430092890
  },
  {
    menu_id: "uni-stat-pay-ranking",
    name: "价值用户排行",
    icon: "",
    url: "/pages/uni-stat/pay-order/ranking/ranking",
    sort: 21223,
    parent_id: "uni-stat-pay",
    permission: [],
    enable: true,
    create_date: 1668430128302
  },
  {
    menu_id: "uni-stat-pay-order-list",
    name: "订单明细",
    icon: "",
    url: "/pages/uni-stat/pay-order/list/list",
    sort: 21224,
    parent_id: "uni-stat-pay",
    permission: [],
    enable: true,
    create_date: 1667387078947
  }
];
const db = common_vendor.Vs.database();
const dbOrderBy = "create_date asc";
const pageSize = 2e4;
const pageCurrent = 1;
const pluginMenuJsons = [];
{
  const rootModules = /* @__PURE__ */ Object.assign({});
  for (const modulePath in rootModules) {
    const json = modulePath.replace(/^..\/..\/..\//, "");
    let moduleItem = rootModules[modulePath];
    if (typeof moduleItem === "function") {
      moduleItem().then((module) => {
        module = module.default ? module.default : module;
        module.forEach((item) => {
          item.json = json;
          pluginMenuJsons.push(item);
        });
      });
    } else {
      let module = moduleItem.default ? moduleItem.default : moduleItem;
      module.forEach((item) => {
        item.json = json;
        pluginMenuJsons.push(item);
      });
    }
  }
  const pluginModules = /* @__PURE__ */ Object.assign({});
  for (const modulePath in pluginModules) {
    const json = modulePath.replace(/^..\/..\/..\//, "");
    let moduleItem = pluginModules[modulePath];
    if (typeof moduleItem === "function") {
      moduleItem().then((module) => {
        module = module.default ? module.default : module;
        module.forEach((item) => {
          item.json = json;
          pluginMenuJsons.push(item);
        });
      });
    } else {
      let module = moduleItem.default ? moduleItem.default : moduleItem;
      module.forEach((item) => {
        item.json = json;
        pluginMenuJsons.push(item);
      });
    }
  }
}
function getParents(menus, id, depth = 0) {
  menus.forEach((menu) => {
    if (menu.menu_id === id && menu.parent_id) {
      depth = depth + 1 + getParents(menus, menu.parent_id, depth);
    }
  });
  return depth;
}
function getChildren(menus, id, childrenIds = []) {
  if (menus.find((menu) => menu.parent_id === id)) {
    menus.forEach((item) => {
      if (item.parent_id === id) {
        childrenIds.push(item._id);
        getChildren(menus, item.menu_id, childrenIds);
      }
    });
  }
  return childrenIds;
}
const _sfc_main = {
  data() {
    return {
      query: "",
      where: "",
      orderby: dbOrderBy,
      options: {
        pageSize,
        pageCurrent
      },
      selectedIndexs: [],
      //批量选中的项
      loading: true,
      menus: [],
      errMsg: "",
      currentTab: "menus",
      selectedPluginMenuIndexs: []
    };
  },
  computed: {
    pluginMenus() {
      const menus = [];
      if (!this.$hasRole("admin")) {
        return menus;
      }
      const dbMenus = this.menus;
      if (!dbMenus.length) {
        return menus;
      }
      pluginMenuJsons.forEach((menu) => {
        if (!dbMenus.find((item) => item.menu_id === menu.menu_id)) {
          menus.push(menu);
        }
      });
      return menus;
    }
  },
  watch: {
    pluginMenus(val) {
      if (!val.length) {
        this.currentTab = "menus";
      }
    }
  },
  methods: {
    enableChange(item) {
      item.enable = item.enable ? false : true;
      db.collection("opendb-admin-menus").doc(item._id).update({
        enable: item.enable
      });
    },
    getSortMenu(menuList) {
      menuList.map((item) => {
        if (!menuList.some((subMenuItem) => subMenuItem.parent_id === item.menu_id)) {
          item.isLeafNode = true;
        }
      });
      return components_uniDataMenu_util.buildMenus(menuList);
    },
    onqueryload(data) {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        const depth = getParents(data, item.menu_id);
        item.name = (depth ? "　".repeat(depth) + "|-" : "") + item.name;
      }
      const menuTree = this.getSortMenu(data);
      const sortMenus = [];
      this.patTree(menuTree, sortMenus);
      data.length = 0;
      data.push(...sortMenus);
      this.menus = data;
    },
    patTree(tree, sortMenus) {
      tree.forEach((item) => {
        sortMenus.push(item);
        if (item.children.length) {
          this.patTree(item.children, sortMenus);
        }
      });
      return sortMenus;
    },
    switchTab(tab) {
      this.currentTab = tab;
    },
    loadData(clear = true) {
      this.$refs.udb.loadData({
        clear
      });
    },
    navigateTo(url, clear) {
      common_vendor.index.navigateTo({
        url,
        events: {
          refreshData: () => {
            this.loadData(clear);
          }
        }
      });
    },
    confirmDelete(menu) {
      let ids = menu._id;
      let content = "是否删除该菜单？";
      const children = getChildren(this.menus, menu.menu_id);
      if (children.length)
        content = "是否删除该菜单及其子菜单？";
      ids = [ids, ...children];
      common_vendor.index.showModal({
        title: "提示",
        content,
        success: (res) => {
          if (!res.confirm) {
            return;
          }
          this.$refs.udb.remove(ids, {
            needConfirm: false
          });
        }
      });
    },
    pluginMenuSelectChange(e) {
      this.selectedPluginMenuIndexs = e.detail.index;
    },
    addPluginMenus(confirmContent) {
      if (!this.selectedPluginMenuIndexs.length) {
        return common_vendor.index.showModal({
          title: "提示",
          content: "请选择要添加的菜单！",
          showCancel: false
        });
      }
      const pluginMenus = this.pluginMenus;
      const menus = [];
      this.selectedPluginMenuIndexs.forEach((i) => {
        const menu = pluginMenus[i];
        if (menu) {
          const dbMenu = JSON.parse(JSON.stringify(menu));
          dbMenu.enable = true;
          delete dbMenu.json;
          menus.push(dbMenu);
        }
      });
      common_vendor.index.showModal({
        title: "提示",
        content: "您确认要添加已选中的菜单吗？",
        success: (res) => {
          if (!res.confirm) {
            return;
          }
          common_vendor.index.showLoading({
            mask: true
          });
          const checkAll = menus.length === pluginMenus.length;
          common_vendor.Vs.database().collection("opendb-admin-menus").add(menus).then((res2) => {
            common_vendor.index.showModal({
              title: "提示",
              content: "添加菜单成功！",
              showCancel: false,
              success: () => {
                this.$refs.pluginMenusTable.clearSelection();
                if (checkAll) {
                  this.currentTab = "menus";
                }
                this.loadData();
              }
            });
          }).catch((err) => {
            common_vendor.index.showModal({
              title: "提示",
              content: err.message,
              showCancel: false
            });
          }).finally(() => {
            common_vendor.index.hideLoading();
          });
        }
      });
    },
    // 更新内置菜单
    async updateBuiltInMenu() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定更新内置菜单吗？\n（该操作不会影响现有的菜单）",
        success: async (res) => {
          if (res.confirm) {
            const db2 = common_vendor.Vs.database();
            const _ = db2.command;
            let menu_ids = originalMenuList.map((item, index) => {
              return item.menu_id;
            });
            common_vendor.index.showLoading({
              title: "更新中...",
              mask: true
            });
            try {
              let addMenuList = [];
              let oldMenuListRes = await db2.collection("opendb-admin-menus").where({
                menu_id: _.in[menu_ids]
              }).limit(500).get();
              let oldMenuList = oldMenuListRes.result.data;
              originalMenuList.map((item, index) => {
                let oldMenuItem = oldMenuList.find((item2, index2, arr2) => {
                  return item2.menu_id === item.menu_id;
                });
                if (!oldMenuItem) {
                  addMenuList.push({
                    ...item,
                    create_date: void 0
                  });
                }
              });
              if (addMenuList && addMenuList.length > 0) {
                let addRes = await db2.collection("opendb-admin-menus").add(addMenuList);
                common_vendor.index.showToast({
                  title: `新增了${addRes.result.inserted}个菜单，即将刷新`,
                  icon: "none"
                });
                setTimeout(() => {
                  this.loadData(true);
                }, 300);
              } else {
                common_vendor.index.showToast({
                  title: "菜单无变动",
                  icon: "none"
                });
              }
            } catch (err) {
              console.error(err);
            } finally {
              common_vendor.index.hideLoading();
            }
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_badge2 = common_vendor.resolveComponent("uni-badge");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_badge2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_unicloud_db2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_badge = () => "../../../uni_modules/uni-badge/components/uni-badge/uni-badge.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_unicloud_db = () => "../../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
const _easycom_fix_window = () => "../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_badge + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table + _easycom_unicloud_db + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(_ctx.$t("menu.text.menuManager")),
    b: common_vendor.o(($event) => $options.switchTab("menus")),
    c: $data.currentTab === "menus" ? 1 : "",
    d: $options.pluginMenus.length
  }, $options.pluginMenus.length ? {
    e: common_vendor.t(_ctx.$t("menu.text.additiveMenu")),
    f: common_vendor.p({
      text: $options.pluginMenus.length,
      type: "error"
    }),
    g: common_vendor.o(($event) => $options.switchTab("pluginMenus")),
    h: $data.currentTab === "pluginMenus" ? 1 : ""
  } : {}, {
    i: common_vendor.t(_ctx.$t("menu.button.addFirstLevelMenu")),
    j: common_vendor.o(($event) => $options.navigateTo("./add")),
    k: common_vendor.t(_ctx.$t("menu.button.updateBuiltInMenu")),
    l: common_vendor.o((...args) => $options.updateBuiltInMenu && $options.updateBuiltInMenu(...args)),
    m: common_vendor.w(({
      data,
      pagination,
      loading,
      error
    }, s0, i0) => {
      return {
        a: "57301354-5-" + i0 + "," + ("57301354-4-" + i0),
        b: "57301354-6-" + i0 + "," + ("57301354-4-" + i0),
        c: "57301354-7-" + i0 + "," + ("57301354-4-" + i0),
        d: "57301354-8-" + i0 + "," + ("57301354-4-" + i0),
        e: "57301354-9-" + i0 + "," + ("57301354-4-" + i0),
        f: "57301354-10-" + i0 + "," + ("57301354-4-" + i0),
        g: "57301354-4-" + i0 + "," + ("57301354-3-" + i0),
        h: common_vendor.f(data, (item, index, i1) => {
          return common_vendor.e({
            a: common_vendor.t(item.sort),
            b: "57301354-12-" + i0 + "-" + i1 + "," + ("57301354-11-" + i0 + "-" + i1),
            c: common_vendor.t(item.name),
            d: "57301354-13-" + i0 + "-" + i1 + "," + ("57301354-11-" + i0 + "-" + i1),
            e: common_vendor.t(item.menu_id),
            f: "57301354-14-" + i0 + "-" + i1 + "," + ("57301354-11-" + i0 + "-" + i1),
            g: common_vendor.t(item.url),
            h: "57301354-15-" + i0 + "-" + i1 + "," + ("57301354-11-" + i0 + "-" + i1),
            i: item.enable,
            j: common_vendor.o(($event) => $options.enableChange(item), index),
            k: !item.enable ? 1 : "",
            l: "57301354-16-" + i0 + "-" + i1 + "," + ("57301354-11-" + i0 + "-" + i1),
            m: common_vendor.o(($event) => $options.navigateTo("./edit?id=" + item._id, false), index),
            n: item.menu_id !== "system_menu" && item.menu_id !== "system_management"
          }, item.menu_id !== "system_menu" && item.menu_id !== "system_management" ? {
            o: common_vendor.t(_ctx.$t("common.button.delete")),
            p: common_vendor.o(($event) => $options.confirmDelete(item), index)
          } : {}, {
            q: !item.url
          }, !item.url ? {
            r: common_vendor.t(_ctx.$t("menu.button.addChildMenu")),
            s: common_vendor.o(($event) => $options.navigateTo("./add?parent_id=" + item.menu_id, false), index)
          } : {}, {
            t: "57301354-17-" + i0 + "-" + i1 + "," + ("57301354-11-" + i0 + "-" + i1),
            v: index,
            w: "57301354-11-" + i0 + "-" + i1 + "," + ("57301354-3-" + i0)
          });
        }),
        i: "57301354-3-" + i0 + ",57301354-2",
        j: common_vendor.p({
          loading,
          emptyText: $data.errMsg || _ctx.$t("common.empty"),
          border: true,
          stripe: true
        }),
        k: i0,
        l: s0
      };
    }, {
      name: "d",
      path: "m",
      vueId: "57301354-2"
    }),
    n: common_vendor.p({
      align: "center"
    }),
    o: common_vendor.p({
      width: "200",
      align: "center"
    }),
    p: common_vendor.p({
      align: "center"
    }),
    q: common_vendor.p({
      align: "center"
    }),
    r: common_vendor.p({
      width: "100",
      align: "center"
    }),
    s: common_vendor.p({
      align: "center"
    }),
    t: common_vendor.p({
      align: "center"
    }),
    v: common_vendor.p({
      align: "center"
    }),
    w: common_vendor.t(_ctx.$t("common.button.edit")),
    x: common_vendor.p({
      align: "center"
    }),
    y: common_vendor.sr("udb", "57301354-2"),
    z: common_vendor.o($options.onqueryload),
    A: common_vendor.p({
      collection: "opendb-admin-menus",
      options: $data.options,
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent
    }),
    B: $data.currentTab === "menus",
    C: common_vendor.o((...args) => $options.addPluginMenus && $options.addPluginMenus(...args)),
    D: common_vendor.p({
      align: "center"
    }),
    E: common_vendor.p({
      align: "center"
    }),
    F: common_vendor.p({
      align: "center"
    }),
    G: common_vendor.f($options.pluginMenus, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.menu_id),
        c: "57301354-24-" + i0 + "," + ("57301354-23-" + i0),
        d: common_vendor.t(item.url),
        e: "57301354-25-" + i0 + "," + ("57301354-23-" + i0),
        f: common_vendor.t(item.json),
        g: "57301354-26-" + i0 + "," + ("57301354-23-" + i0),
        h: index,
        i: "57301354-23-" + i0 + ",57301354-18"
      };
    }),
    H: common_vendor.sr("pluginMenusTable", "57301354-18"),
    I: common_vendor.o($options.pluginMenuSelectChange),
    J: common_vendor.p({
      type: "selection",
      border: true,
      stripe: true
    }),
    K: $data.currentTab === "pluginMenus"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
