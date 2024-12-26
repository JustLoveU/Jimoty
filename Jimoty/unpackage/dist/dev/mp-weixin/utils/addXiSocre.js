"use strict";
const common_vendor = require("../common/vendor.js");
const db = common_vendor.Zs.database();
const uid = common_vendor.Zs.getCurrentUserInfo().uid;
async function addXiSocre() {
  console.log("发表一条加2分");
  const res = await db.collection("uni-id-users").doc(uid).field("xiScore").get({ getOne: true });
  let score = res.result.data.xiScore + 2;
  db.collection("uni-id-users").doc(uid).update({ xiScore: score });
}
async function changeXiSocre(type, userId) {
  const res = await db.collection("uni-id-users").doc(userId).field("xiScore").get({ getOne: true });
  if (type === 0) {
    let score = res.result.data.xiScore + 2;
    db.collection("uni-id-users").doc(userId).update({ xiScore: score });
  } else if (type === 1) {
    let score = res.result.data.xiScore + 1;
    db.collection("uni-id-users").doc(userId).update({ xiScore: score });
  } else if (type === 2) {
    let score = res.result.data.xiScore - 3;
    db.collection("uni-id-users").doc(userId).update({ xiScore: score });
  }
}
exports.addXiSocre = addXiSocre;
exports.changeXiSocre = changeXiSocre;
