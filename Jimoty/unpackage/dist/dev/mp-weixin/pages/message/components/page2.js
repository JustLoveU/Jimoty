"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_swipe_action_item2 + _easycom_uni_load_more2)();
}
const _easycom_uni_swipe_action_item = () => "../../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_swipe_action_item + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "page2",
  setup(__props) {
    const Pageloading = common_vendor.ref("loading");
    const options = common_vendor.ref([{
      text: "删除",
      style: {
        backgroundColor: "#F56C6C"
      }
    }]);
    let db = common_vendor.Zs.database();
    db.command;
    let uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const hideArr = common_vendor.ref([]);
    function changeMesaageType(bool, data, index) {
      if (bool) {
        pageData.value[index].isShow = 0;
        hideArr.value.push(data);
        pageData.value.splice(index, 1);
      } else {
        hideArr.value.map((item) => {
          return item._id._value;
        });
        hideArr.value.forEach((item) => {
          item.isShow = 1;
          pageData.value.unshift(item);
        });
        hideArr.value = [];
        console.log("$$$$", pageData.value);
      }
    }
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
      hideArr.value = [];
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
    async function getData() {
      Pageloading.value = "loading";
      const temp1 = db.collection("jimoty-chat").where(`userId == "${uid}" && delete == false`).field(
        "_id as message,userId,friendId,postId,delete,create_date,isShow,update_date"
      ).getTemp();
      const temp2 = db.collection("jimoty-post").where("delete != 0").field("_id,photos,noteTitle").getTemp();
      const res = await db.collection(temp1, temp2).orderBy("update_date desc").skip(pageData.value.length).limit(10).get();
      let data = res.result.data;
      for (var i = 0; i < data.length; i++) {
        data[i].hasNew = false;
        data[i].isShow = 1;
        const count = await db.collection("jimoty-chat-message").where({
          chatBoxId: data[i]._id,
          friendId: uid,
          status: false
        }).count();
        if (count.result.total > 0) {
          data[i].hasNew = true;
        }
        if (i == data.length - 1) {
          pageData.value = [...pageData.value, ...data];
          console.log(pageData.value, "oooooooo");
          Pageloading.value = "noMore";
        }
      }
      Pageloading.value = "noMore";
    }
    function gotochat(item) {
      item.hasNew = false;
      if (!item.postId[0]) {
        common_vendor.index.showToast({
          title: "该贴已删除",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/message/chatPage?userId=${item.userId}&friendId=${item.friendId}&postId=${item.postId[0]._id}`
      });
    }
    function formatDate(timestamp) {
      const now = /* @__PURE__ */ new Date();
      const inputDate = new Date(timestamp);
      const daysDifference = Math.floor((now - inputDate) / (1e3 * 60 * 60 * 24));
      if (daysDifference === 0) {
        return "今日";
      } else if (daysDifference === 1) {
        return "昨天";
      } else if (daysDifference === 2) {
        return "前天";
      } else {
        return `${daysDifference}日前`;
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: hideArr.value.length > 0
      }, hideArr.value.length > 0 ? {
        b: common_vendor.t(hideArr.value.length),
        c: common_vendor.o(($event) => changeMesaageType(false))
      } : {}, {
        d: common_vendor.f(pageData.value, (item, index, i0) => {
          return {
            a: common_vendor.n(item.hasNew ? "newActive" : ""),
            b: item.postId[0] ? item.postId[0].photos[0] : "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/商品不存在(1).png",
            c: common_vendor.t(item.postId[0] ? item.postId[0].noteTitle : "该贴已删除"),
            d: common_vendor.t(formatDate(item.create_date)),
            e: common_vendor.o(($event) => changeMesaageType(true, item, index), index),
            f: common_vendor.o(($event) => bindClick(item._id, index), index),
            g: "c29b0dc0-0-" + i0,
            h: index,
            i: common_vendor.o(($event) => gotochat(item), index)
          };
        }),
        e: common_vendor.p({
          ["right-options"]: options.value
        }),
        f: common_vendor.p({
          status: Pageloading.value
        }),
        g: triggered.value,
        h: common_vendor.o(onPullDownRefresh),
        i: common_vendor.o(onReachBottom)
      });
    };
  }
};
wx.createComponent(_sfc_main);
