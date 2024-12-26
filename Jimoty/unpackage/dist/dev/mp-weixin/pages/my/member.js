"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "member",
  setup(__props) {
    const db = common_vendor.Zs.database();
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const navIndex = common_vendor.ref(-1);
    const goodName = common_vendor.ref("");
    const pageData1 = common_vendor.ref({});
    const pageData2 = common_vendor.ref({});
    const pageData3 = common_vendor.ref({});
    const pageData4 = common_vendor.ref({});
    const isApple = common_vendor.ref(false);
    common_vendor.onLoad(() => {
      let brand = common_vendor.index.getDeviceInfo().deviceBrand;
      console.log("########获取设备", brand);
      if (brand == "iphone") {
        isApple.value = true;
      }
    });
    common_vendor.onPullDownRefresh(() => {
      getdData();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onShow(() => {
      getdData();
    });
    function changethis(index) {
      navIndex.value = index;
      if (index == 0) {
        goodName.value = "置顶";
      } else if (index == 1) {
        goodName.value = "高亮";
      } else if (index == 2) {
        goodName.value = "刷新";
      } else {
        goodName.value = "定期刷新";
      }
    }
    async function getdData() {
      const res = await db.collection("jimoty-daoju").where({ daoUserId: uid }).get();
      groupByType(res.result.data);
    }
    function groupByType(arr) {
      arr.forEach((item) => {
        if (item.daojuType === 0) {
          pageData1.value = item;
        } else if (item.daojuType === 1) {
          pageData2.value = item;
        } else if (item.daojuType === 2) {
          pageData3.value = item;
        } else if (item.daojuType === 3) {
          pageData4.value = item;
        }
      });
    }
    function gotoBuy() {
      common_vendor.index.navigateTo({
        url: "/pages/my/pointBuy/pointBuy"
      });
    }
    function useMember() {
      if (goodName.value != "") {
        common_vendor.index.showModal({
          content: `是否前往使用(${goodName.value})`,
          success: async function(res) {
            if (res.confirm) {
              const data = await db.collection("jimoty-daoju").where({
                daoUserId: uid,
                daojuType: navIndex.value
              }).field("daojuNum").get({ getOne: true });
              if (data.result.data && data.result.data.daojuNum > 0) {
                common_vendor.index.navigateTo({
                  url: `/pages/my/pointBuy/pointBuyDetail?daojuType=${navIndex.value}`
                });
              } else {
                common_vendor.index.showToast({
                  title: "已经没有道具了，请您购买！",
                  icon: "none"
                });
              }
              getdData();
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "请选择使用的道具",
          icon: "none"
        });
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(pageData1.value.daojuNum && pageData1.value.daojuNum != 0 ? pageData1.value.daojuNum : "0"),
        b: common_vendor.o(($event) => changethis(0)),
        c: common_vendor.n(navIndex.value == 0 ? "active" : ""),
        d: common_vendor.t(pageData2.value.daojuNum && pageData2.value.daojuNum != 0 ? pageData2.value.daojuNum : "0"),
        e: common_vendor.o(($event) => changethis(1)),
        f: common_vendor.n(navIndex.value == 1 ? "active" : ""),
        g: common_vendor.t(pageData3.value.daojuNum && pageData3.value.daojuNum != 0 ? pageData3.value.daojuNum : "0"),
        h: common_vendor.o(($event) => changethis(2)),
        i: common_vendor.n(navIndex.value == 2 ? "active" : ""),
        j: common_vendor.t(pageData4.value.daojuNum && pageData4.value.daojuNum != 0 ? pageData4.value.daojuNum : "0"),
        k: common_vendor.o(($event) => changethis(3)),
        l: common_vendor.n(navIndex.value == 3 ? "active" : ""),
        m: isApple.value
      }, isApple.value ? {} : {}, {
        n: !isApple.value
      }, !isApple.value ? {
        o: common_vendor.o(gotoBuy)
      } : {}, {
        p: common_vendor.o(useMember)
      });
    };
  }
};
wx.createPage(_sfc_main);
