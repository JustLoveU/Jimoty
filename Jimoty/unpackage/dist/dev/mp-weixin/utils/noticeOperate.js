"use strict";
const common_vendor = require("../common/vendor.js");
const db = common_vendor.Zs.database();
db.command;
common_vendor.Zs.getCurrentUserInfo().uid;
function makeNotice(sendPeople, receive, type = 0, message = "", otherMessage = "") {
  try {
    db.collection("jimoty-notice").add({
      sendPeople,
      receive,
      message,
      otherMessage,
      type
    });
  } catch (e) {
    console.log("参数错误");
  }
}
function removeNotice(sendPeople, receive, type = 0, message = "") {
  db.collection("jimoty-notice").where({
    sendPeople,
    receive,
    type,
    message
  }).remove();
}
exports.makeNotice = makeNotice;
exports.removeNotice = removeNotice;
