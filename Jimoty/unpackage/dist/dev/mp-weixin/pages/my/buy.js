"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_list_chat2 = common_vendor.resolveComponent("uni-list-chat");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_list_chat2 + _easycom_uni_dateformat2 + _easycom_uni_section2 + _easycom_uni_load_more2)();
}
const _easycom_uni_list_chat = () => "../../uni_modules/uni-list/components/uni-list-chat/uni-list-chat.js";
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_list_chat + _easycom_uni_dateformat + _easycom_uni_section + _easycom_uni_load_more)();
}
const avatar = "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/商品不存在(1).png";
const _sfc_main = {
  __name: "buy",
  setup(__props) {
    const Pageloading = common_vendor.ref("loading");
    const localData = common_vendor.ref([]);
    let db = common_vendor.Zs.database();
    db.command;
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    async function loadData() {
      Pageloading.value = "loading";
      const temp1 = db.collection("jimoty-buy").where({ buyId: uid }).getTemp();
      const temp2 = db.collection("jimoty-post").field("_id,noteTitle,photos").getTemp();
      const temp3 = db.collection("uni-id-users").field("_id,nickname,avatar_file.url").getTemp();
      const res = await db.collection(temp1, temp2, temp3).orderBy("create_date desc").skip(localData.value.length).limit(10).get();
      console.log(res.result.data, "aaaaaaaaaaaaaaaaaaaaaaa");
      localData.value = [...localData.value, ...res.result.data];
      Pageloading.value = "noMore";
    }
    common_vendor.onMounted(() => {
      loadData();
    });
    common_vendor.onPullDownRefresh(() => {
      localData.value = [];
      loadData();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      loadData();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(localData.value, (item, index, i0) => {
          return {
            a: "16481d71-1-" + i0 + ",16481d71-0",
            b: common_vendor.p({
              ["avatar-circle"]: true,
              title: item.sellId[0] ? item.sellId[0].nickname : "未知用户",
              avatar: item.sellId[0].avatar_file.url
            }),
            c: item.goodId[0] && item.goodId[0].photos[0] ? item.goodId[0].photos[0] : avatar,
            d: common_vendor.t(item.goodId[0] ? item.goodId[0].noteTitle : "该帖已删除"),
            e: "16481d71-2-" + i0 + ",16481d71-0",
            f: common_vendor.p({
              date: item.create_date,
              format: "yyyy-MM-dd hh:mm:ss",
              threshold: [0, 0]
            }),
            g: index
          };
        }),
        b: common_vendor.p({
          title: "我的收获",
          type: "line"
        }),
        c: common_vendor.p({
          status: Pageloading.value
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
