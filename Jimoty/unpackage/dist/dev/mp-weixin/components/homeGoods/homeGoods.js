"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_noticeOperate = require("../../utils/noticeOperate.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_dateformat2 + _easycom_uni_icons2)();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "homeGoods",
  props: {
    data: Object,
    default: () => {
    }
  },
  setup(__props) {
    const SendMs = common_vendor.Zs.importObject("jimoty-sendMessage", { customUI: true });
    let db = common_vendor.Zs.database();
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    common_vendor.ref([]);
    const prop = __props;
    const gotoDetail = (postId) => {
      common_vendor.index.navigateTo({
        url: `/pages/home/detail?postId=${postId}`
      });
    };
    const classify = common_vendor.ref([
      "社交",
      "互助",
      "兴趣",
      "领养",
      "闲置"
    ]);
    const Inoperation1 = common_vendor.ref(false);
    async function collect(postId, userId, index, isCollect) {
      if (!uid) {
        common_vendor.index.navigateTo({
          url: "uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        });
        return;
      }
      if (Inoperation1.value)
        return;
      Inoperation1.value = true;
      if (isCollect) {
        prop.data[index].isCollect = !prop.data[index].isCollect;
        collectAdd(postId, -1);
        db.collection("jimoty-collect").where(`post_id=="${postId}" && user_id==$cloudEnv_uid`).remove();
        utils_noticeOperate.removeNotice(uid, userId, 4, postId);
      } else {
        db.collection("jimoty-collect").add({
          post_id: postId
        }).then((res) => {
          if (uid != userId) {
            utils_noticeOperate.makeNotice(uid, userId, 4, postId);
            SendMs.sendMessage1(userId, "有人收藏了你的帖子");
          }
        });
        prop.data[index].like++;
        prop.data[index].isCollect = !prop.data[index].isCollect;
        collectAdd(postId, 1);
      }
      Inoperation1.value = false;
    }
    const collectAdd = async (postId, num) => {
      const data = await db.collection("jimoty-post").where(`_id=="${postId}"`).field("collect").get({ getOne: true });
      let thislike = data.result.data.collect + num;
      await db.collection("jimoty-post").where(`_id=="${postId}"`).update({ collect: thislike });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(prop.data, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.n(item.status == 4 ? "overActive" : ""),
            b: item.photos && item.photos[0] ? item.photos[0] : "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/moren.png",
            c: common_vendor.t(classify.value[item.type - 1]),
            d: common_vendor.t(item.noteTitle),
            e: item.postPrice
          }, item.postPrice ? {
            f: common_vendor.t(item.postPrice)
          } : {}, {
            g: common_vendor.t(item.location && item.location.province ? item.location.province : "未知"),
            h: "8caa596e-0-" + i0,
            i: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 864e5],
              format: "MM/dd"
            }),
            j: !item.isCollect
          }, !item.isCollect ? {
            k: "8caa596e-1-" + i0,
            l: common_vendor.p({
              type: "star",
              size: "24"
            })
          } : {
            m: "8caa596e-2-" + i0,
            n: common_vendor.p({
              type: "star-filled",
              size: "24"
            })
          }, {
            o: common_vendor.o(($event) => collect(item._id._value, item.userId[0]._id ? item.userId[0]._id : item.userId, index, item.isCollect), index),
            p: index,
            q: common_vendor.o(($event) => gotoDetail(item._id._value), index),
            r: common_vendor.n((item == null ? void 0 : item.hightLight) ? "active" : ""),
            s: common_vendor.n((item == null ? void 0 : item.weight) == 200 ? "prActive" : "")
          });
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
