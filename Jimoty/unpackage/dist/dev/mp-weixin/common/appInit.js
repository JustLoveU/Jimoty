"use strict";
const common_vendor = require("./vendor.js");
const uniStarter_config = require("../uni-starter.config.js");
const db = common_vendor.Zs.database();
async function initApp() {
  uniStarter_config.uniStarterConfig.debug;
  setTimeout(() => {
    getApp({ allowDefault: true }).globalData.config = uniStarter_config.uniStarterConfig;
  }, 1);
  function onDBError({
    code,
    // 错误码详见https://uniapp.dcloud.net.cn/uniCloud/clientdb?id=returnvalue
    message
  }) {
    console.log("onDBError", {
      code,
      message
    });
    console.error(code, message);
  }
  db.on("error", onDBError);
  common_vendor.Zs.interceptObject({
    async invoke({
      objectName,
      // 云对象名称
      methodName,
      // 云对象的方法名称
      params
      // 参数列表
    }) {
      if (objectName === "uni-id-co" && (methodName.includes("loginBy") || [
        "login",
        "registerUser"
      ].includes(methodName))) {
        console.log("执行登录相关云对象");
        params[0].inviteCode = await new Promise((callBack) => {
          callBack();
        });
      }
    },
    success(e) {
      console.log(e);
    },
    complete() {
    },
    fail(e) {
      console.error(e);
    }
  });
}
exports.initApp = initApp;
