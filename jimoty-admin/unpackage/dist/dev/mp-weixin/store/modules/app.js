"use strict";
const common_vendor = require("../../common/vendor.js");
const store_constants = require("../constants.js");
const app = {
  namespaced: true,
  state: {
    inited: false,
    navMenu: [],
    routes: [],
    theme: common_vendor.index.getStorageSync(store_constants.uniAdminCacheKey.theme) || "default",
    appName: "jimoty-admin",
    appid: "__UNI__EFAF570"
  },
  mutations: {
    SET_APP_NAME: (state, appName) => {
      state.appName = appName;
    },
    SET_NAV_MENU: (state, navMenu) => {
      state.inited = true;
      state.navMenu = navMenu;
    },
    SET_ROUTES: (state, routes) => {
      state.routes = routes;
    },
    SET_THEME: (state, theme) => {
      common_vendor.index.setStorageSync(store_constants.uniAdminCacheKey.theme, theme);
      state.theme = theme;
    }
  },
  actions: {
    init({
      commit,
      dispatch
    }) {
      dispatch("user/getUserInfo", null, {
        root: true
      });
    },
    setAppName({
      commit
    }, appName) {
      commit("SET_APP_NAME", appName);
    },
    setRoutes({
      commit
    }, routes) {
      commit("SET_ROUTES", routes);
    }
  }
};
exports.app = app;
