"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_number_box2 = common_vendor.resolveComponent("uni-number-box");
  (_easycom_uni_icons2 + _easycom_uni_number_box2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_number_box = () => "../../../uni_modules/uni-number-box/components/uni-number-box/uni-number-box.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_number_box)();
}
const _sfc_main = {
  __name: "pointBuy",
  setup(__props) {
    const db = common_vendor.Zs.database();
    db.command;
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const navIndex = common_vendor.ref(0);
    const vModelValue = common_vendor.ref(1);
    const goodType = common_vendor.ref([]);
    common_vendor.onLoad(async () => {
      const res = await db.collection("jimoty-good").get();
      goodType.value = res.result.data;
      console.log(goodType.value, "商品详情");
    });
    function buythis(index) {
      navIndex.value = index;
    }
    function buygood() {
      common_vendor.index.showModal({
        content: `是否确认购买(${goodType.value[navIndex.value].good_name})(${vModelValue.value})个`,
        success: async function(res) {
          if (res.confirm) {
            common_vendor.index.showLoading({
              mask: true
            });
            common_vendor.Zs.callFunction({
              name: "jimoty-buy",
              data: {
                vModelValue: vModelValue.value,
                good_type: goodType.value[navIndex.value].good_type,
                userId: uid
              }
            }).then((res2) => {
              common_vendor.index.hideLoading();
              console.log("购买成功");
              common_vendor.index.showToast({
                title: res2.result.msg,
                icon: "none"
              });
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(goodType.value, (item, index, i0) => {
          return {
            a: item.good_image,
            b: common_vendor.t(item.good_name),
            c: common_vendor.t(item.good_price),
            d: common_vendor.t(item.good_price),
            e: "79f9a71a-0-" + i0,
            f: index,
            g: common_vendor.o(($event) => buythis(index), index),
            h: common_vendor.n(navIndex.value == index ? "active" : "")
          };
        }),
        b: common_vendor.p({
          type: "right",
          size: "20"
        }),
        c: common_vendor.o(($event) => vModelValue.value = $event),
        d: common_vendor.p({
          min: 1,
          max: 9,
          modelValue: vModelValue.value
        }),
        e: goodType.value.length > 0
      }, goodType.value.length > 0 ? {
        f: common_vendor.t(goodType.value[navIndex.value].good_name),
        g: common_vendor.t(vModelValue.value)
      } : {}, {
        h: common_vendor.o(buygood)
      });
    };
  }
};
wx.createPage(_sfc_main);
