"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_steps2 = common_vendor.resolveComponent("uni-steps");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_steps2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_uni_load_more2)();
}
const _easycom_uni_steps = () => "../../uni_modules/uni-steps/components/uni-steps/uni-steps.js";
const _easycom_uni_list_item = () => "../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../uni_modules/uni-list/components/uni-list/uni-list.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_steps + _easycom_uni_list_item + _easycom_uni_list + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "orderStep",
  setup(__props) {
    const status = common_vendor.ref("loading");
    setTimeout(() => {
      status.value = "noMore";
    }, 500);
    const active = common_vendor.ref(1);
    const list1 = common_vendor.ref([{
      title: "买家下单",
      desc: "2018-11-11"
    }, {
      title: "卖家发货",
      desc: "2018-11-12"
    }, {
      title: "买家签收",
      desc: "2018-11-13"
    }, {
      title: "交易完成",
      desc: "2018-11-14"
    }]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          options: list1.value,
          active: active.value
        }),
        b: common_assets._imports_0$1,
        c: common_vendor.p({
          title: "订单编号",
          rightText: "1111111111111"
        }),
        d: common_vendor.p({
          title: "收货地址",
          rightText: "湖南省长沙市天心区"
        }),
        e: common_vendor.p({
          title: "买家昵称",
          rightText: "小心"
        }),
        f: common_vendor.p({
          title: "下单时间",
          rightText: "2024-08-20 01:18:43"
        }),
        g: common_vendor.p({
          title: "付款时间",
          rightText: "2024-08-20 01:18:43"
        }),
        h: common_vendor.p({
          title: "发货时间",
          rightText: "2024-08-20 01:18:43"
        }),
        i: common_vendor.p({
          status: status.value
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
