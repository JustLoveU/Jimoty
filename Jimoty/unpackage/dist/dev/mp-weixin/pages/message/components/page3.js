"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_dateformat2 + _easycom_uni_swipe_action_item2 + _easycom_uni_load_more2)();
}
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_swipe_action_item = () => "../../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_swipe_action_item + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "page3",
  setup(__props) {
    const db = common_vendor.Zs.database();
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const Pageloading = common_vendor.ref("loading");
    const pagedata = common_vendor.ref([]);
    const options = common_vendor.ref([{
      text: "删除",
      style: {
        backgroundColor: "#F56C6C"
      }
    }]);
    function bindClick(chatId, index) {
      common_vendor.index.showModal({
        content: "是否删除",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            pagedata.value.splice(index, 1);
            db.collection("jimoty-comment").doc(chatId).remove();
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
    const commentType = {
      0: "好评",
      1: "一般",
      2: "差评"
    };
    const triggered = common_vendor.ref(false);
    async function onPullDownRefresh() {
      console.log("刷新");
      triggered.value = true;
      pagedata.value = [];
      await getData();
      triggered.value = false;
    }
    function onReachBottom() {
      console.log("触底");
      getData();
    }
    common_vendor.onMounted(() => {
      console.log("加载数据");
      getData();
    });
    async function getData() {
      Pageloading.value = "loading";
      const temp1 = db.collection("jimoty-post").field("_id,noteTitle").getTemp();
      const temp6 = db.collection("uni-id-users").field("_id,nickname,avatar_file.url").getTemp();
      const temp2 = db.collection("jimoty-comment").where({ send_user_id: uid }).getTemp();
      const res2 = await db.collection(temp2, temp1, temp6).orderBy("create_date desc").skip(pagedata.value.length).limit(10).get();
      pagedata.value = [...pagedata.value, ...res2.result.data];
      Pageloading.value = "noMore";
      console.log(pagedata.value);
    }
    function gotoUser(id) {
      common_vendor.index.navigateTo({
        url: `/pages/my/myDetail?userId=${id}`
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(pagedata.value, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => gotoUser(item.send_user_id[0]._id), index),
            b: item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].avatar_file.url : "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png",
            c: common_vendor.t(item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].nickname : "未知用户"),
            d: common_vendor.t(commentType[item.type]),
            e: common_vendor.t(item.post_id[0] ? item.post_id[0].noteTitle : "该贴已被删除"),
            f: common_vendor.t(item.content),
            g: "c27edebe-1-" + i0 + "," + ("c27edebe-0-" + i0),
            h: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 72e5],
              format: "yyyy-MM-dd hh:mm:ss"
            }),
            i: common_vendor.o(($event) => bindClick(item._id, index), index),
            j: "c27edebe-0-" + i0,
            k: index
          };
        }),
        b: common_vendor.p({
          ["right-options"]: options.value
        }),
        c: common_vendor.p({
          status: Pageloading.value
        }),
        d: triggered.value,
        e: common_vendor.o(onPullDownRefresh),
        f: common_vendor.o(onReachBottom)
      };
    };
  }
};
wx.createComponent(_sfc_main);
