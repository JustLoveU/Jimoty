"use strict";
const common_vendor = require("../common/vendor.js");
const prefix = "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919";
const secCheckObj = common_vendor.Zs.importObject("secCheckContent", { customUI: true });
const db = common_vendor.Zs.database();
async function upLoadImage(postId, previewList) {
  let userInfo = common_vendor.index.getStorageSync("uni-id-pages-userInfo");
  const userData = await db.collection("uni-id-users").doc(userInfo._id).field("wx_openid.mp").get({ getOne: true });
  let openId = userData.result.data.wx_openid.mp;
  let needArr = previewList.filter((str) => !str.startsWith(prefix));
  let noNeedArr = previewList.filter((str) => str.startsWith(prefix));
  let images = [];
  if (needArr.length > 0) {
    for (var i = 0; i < needArr.length; i++) {
      const res = await common_vendor.Zs.uploadFile({
        filePath: needArr[i],
        cloudPath: (/* @__PURE__ */ new Date()).getTime() + "" + Math.floor(1e4 + Math.random() * 9e4)
      });
      images.push(res.fileID);
      if (i === needArr.length - 1) {
        let imagesArr = [...noNeedArr, ...images];
        console.log("####", imagesArr);
        secCheckObj.imgSecCheckP({
          picurls: imagesArr,
          verify_id: postId,
          openid: openId
        });
        await db.collection("jimoty-post").doc(postId).update({
          photos: [
            ...noNeedArr,
            ...images
          ]
        });
      }
    }
  } else {
    db.collection("jimoty-post").doc(postId).update({ status: 2 });
  }
}
exports.upLoadImage = upLoadImage;
