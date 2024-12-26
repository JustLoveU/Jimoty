"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_icons2 + _easycom_uni_swipe_action_item2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_swipe_action_item = () => "../../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_swipe_action_item + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "page1",
  setup(__props) {
    const Pageloading = common_vendor.ref("loading");
    const options = common_vendor.ref([{
      text: "删除",
      style: {
        backgroundColor: "#F56C6C"
      }
    }]);
    let db = common_vendor.Zs.database();
    let uid = common_vendor.Zs.getCurrentUserInfo().uid;
    function bindClick(chatId, index) {
      common_vendor.index.showModal({
        content: "是否删除",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            pageData.value.splice(index, 1);
            db.collection("jimoty-chat").doc(chatId).update({ delete: true });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
    const triggered = common_vendor.ref(false);
    async function onPullDownRefresh() {
      triggered.value = true;
      pageData.value = [];
      await getData();
      common_vendor.index.stopPullDownRefresh();
      triggered.value = false;
    }
    function onReachBottom() {
      getData();
    }
    const pageData = common_vendor.ref([]);
    common_vendor.onMounted(async () => {
      getData();
    });
    function formatTimestamp(timestamp) {
      const now = /* @__PURE__ */ new Date();
      const inputDate = new Date(timestamp);
      const daysDifference = Math.floor((now - inputDate) / (1e3 * 60 * 60 * 24));
      if (daysDifference === 0) {
        const hours = inputDate.getHours().toString().padStart(2, "0");
        const minutes = inputDate.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      } else if (daysDifference === 1) {
        const hours = inputDate.getHours().toString().padStart(2, "0");
        const minutes = inputDate.getMinutes().toString().padStart(2, "0");
        return `昨天 ${hours}:${minutes}`;
      } else if (daysDifference === 2) {
        const hours = inputDate.getHours().toString().padStart(2, "0");
        const minutes = inputDate.getMinutes().toString().padStart(2, "0");
        return `前天 ${hours}:${minutes}`;
      } else {
        const month = inputDate.getMonth() + 1;
        const day = inputDate.getDate();
        const hours = inputDate.getHours().toString().padStart(2, "0");
        const minutes = inputDate.getMinutes().toString().padStart(2, "0");
        return `${month}月${day}日 ${hours}:${minutes}`;
      }
    }
    async function getData() {
      Pageloading.value = "loading";
      const temp1 = db.collection("jimoty-chat").where(`friendId == "${uid}" && delete == false`).getTemp();
      const temp2 = db.collection("jimoty-post").where("delete != 0").field("_id,photos,noteTitle").getTemp();
      const temp3 = db.collection("uni-id-users").field("_id,nickname,avatar_file.url").getTemp();
      const res = await db.collection(temp1, temp2, temp3).orderBy("update_date desc").skip(pageData.value.length).limit(10).get();
      let data = res.result.data;
      for (let i = 0; i < data.length; i++) {
        data[i].hasNew = false;
        const count = await db.collection("jimoty-chat-message").where({
          chatBoxId: data[i]._id,
          friendId: uid,
          status: false
        }).count();
        if (count.result.total > 0) {
          data[i].hasNew = true;
        }
      }
      pageData.value = [...pageData.value, ...data];
      console.log("@@@@@@", pageData.value);
      if (res.result.data.length > 0) {
        Pageloading.value = "";
      } else {
        Pageloading.value = "noMore";
      }
    }
    function gotochat(item) {
      console.log(chatId, "aaaaaaaa");
      item.hasNew = false;
      let chatId = item._id;
      if (chatId != "" && chatId) {
        common_vendor.index.navigateTo({
          url: `/pages/message/chatPage?chatId=${chatId}`
        });
      } else {
        common_vendor.index.showToast({
          title: "该聊天记录不存在",
          icon: "none"
        });
      }
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(pageData.value, (item, index, i0) => {
          return {
            a: common_vendor.n(item.hasNew ? "active" : ""),
            b: item.postId[0] && item.postId[0].photos[0] ? item.postId[0].photos[0] : "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/商品不存在(1).png",
            c: common_vendor.t(item.postId && item.postId[0] ? item.postId[0].noteTitle : "暂无详情"),
            d: common_vendor.t(item.userId && item.userId[0] ? item.userId[0].nickname : "未知用户"),
            e: common_vendor.t(formatTimestamp(item.update_date)),
            f: "c2b73cc2-1-" + i0 + "," + ("c2b73cc2-0-" + i0),
            g: common_vendor.o(($event) => bindClick(item._id, index), index),
            h: "c2b73cc2-0-" + i0,
            i: index,
            j: common_vendor.o(($event) => gotochat(item), index)
          };
        }),
        b: common_vendor.p({
          type: "right",
          size: "24"
        }),
        c: common_vendor.p({
          ["right-options"]: options.value
        }),
        d: common_vendor.p({
          status: Pageloading.value
        }),
        e: triggered.value,
        f: common_vendor.o(onPullDownRefresh),
        g: common_vendor.o(onReachBottom)
      };
    };
  }
};
wx.createComponent(_sfc_main);
