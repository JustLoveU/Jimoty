"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_pay2 = common_vendor.resolveComponent("uni-pay");
  (_easycom_uni_dateformat2 + _easycom_uni_card2 + _easycom_uni_section2 + _easycom_uni_easyinput2 + _easycom_uni_popup2 + _easycom_uni_pay2)();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_pay = () => "../../uni_modules/uni-pay/components/uni-pay/uni-pay.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_card + _easycom_uni_section + _easycom_uni_easyinput + _easycom_uni_popup + _easycom_uni_pay)();
}
const _sfc_main = {
  __name: "point",
  setup(__props) {
    const db = common_vendor.Zs.database();
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const popup = common_vendor.ref(null);
    const navindex = common_vendor.ref(-1);
    const priceValue = common_vendor.ref("");
    const pay = common_vendor.ref(null);
    const total_fee = common_vendor.ref(0);
    const order_no = common_vendor.ref("");
    const out_trade_no = common_vendor.ref("");
    const description = common_vendor.ref("购买point点");
    const type = common_vendor.ref(
      "test"
    );
    const custom = common_vendor.ref({
      des: "用户购买重点"
    });
    const adpid = common_vendor.ref("1000000001");
    const balance = common_vendor.ref(0);
    const status = common_vendor.ref(false);
    common_vendor.onMounted(() => {
      getBalance();
      getorder();
    });
    const orderData = common_vendor.ref([]);
    const getorder = async () => {
      if (uid != "") {
        const res = await db.collection("jimoty-pay-order").where({ user_id: uid, status: 1 }).orderBy(
          "pay_date desc"
        ).get();
        orderData.value = res.result.data;
        console.log(orderData.value);
      } else {
        status.value = true;
        common_vendor.index.showToast({
          title: "您的账号异常",
          icon: "none"
        });
      }
    };
    const getBalance = async () => {
      if (uid != "") {
        const res = await db.collection("uni-id-users").doc(uid).field("balance").get({ getOne: true });
        balance.value = res.result.data.balance / 100;
      } else {
        status.value = true;
        common_vendor.index.showToast({
          title: "您的账号异常",
          icon: "none"
        });
      }
    };
    const changePrice = (e) => {
      navindex.value = -1;
      console.log(e, "lll", typeof e);
    };
    const openBuy = () => {
      popup.value.open();
    };
    const generateRandomSevenDigitNumber = () => {
      let randomNumber = Math.floor(Math.random() * 1e7);
      if (randomNumber < 1e6) {
        randomNumber = "0" + randomNumber;
      }
      return randomNumber;
    };
    const comfirmBuy = () => {
      if (status.value) {
        common_vendor.index.showToast({
          title: "您的账号异常,不能购买!",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showModal({
        content: "是否确认购买",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            if (priceValue.value != "") {
              total_fee.value = Number(priceValue.value) * 100;
              order_no.value = "jimoty" + Date.now() + generateRandomSevenDigitNumber();
              db.collection("jimoty-pay-order").add({
                total_fee: total_fee.value,
                custom: custom.value,
                order_no: order_no.value,
                type: type.value
              }).then((res2) => {
                createOrder();
              });
            } else {
              common_vendor.index.showToast({
                title: "请输入购买的点数",
                icon: "none"
              });
            }
          } else if (res.cancel) {
            console.log("用户点击取消");
            popup.value.close();
          }
        }
      });
    };
    const changeIndex = (index) => {
      navindex.value = index;
      if (navindex.value == 0) {
        priceValue.value = 10;
      } else if (navindex.value == 1) {
        priceValue.value = 20;
      } else if (navindex.value == 2) {
        priceValue.value = 50;
      } else if (navindex.value == 3) {
        priceValue.value = 100;
      }
    };
    const createOrder = () => {
      out_trade_no.value = `${order_no.value}-1`;
      pay.value.createOrder({
        provider: "wxpay",
        // 支付供应商
        total_fee: total_fee.value,
        // 支付金额，单位分 100 = 1元（注意：因为是前端传的，此参数可能会被伪造，回调时需要再校验下是否和自己业务订单金额一致）
        order_no: order_no.value,
        // 业务系统订单号（即你自己业务系统的订单表的订单号）
        out_trade_no: out_trade_no.value,
        // 插件支付单号
        description: description.value,
        // 支付描述
        type: type.value
        // 支付回调类型
        // qr_code: qr_code.value, // 是否强制使用扫码支付
        // openid: openid.value, // 微信公众号需要
      });
    };
    const onCreate = (res) => {
      console.log("create: ", res);
    };
    const onSuccess = (res) => {
      console.log("success: ", res);
      if (res.user_order_success) {
        console.log("支付成功");
      } else {
        common_vendor.index.showToast({
          title: "该订单异常，请联系管理员!",
          icon: "none"
        });
      }
      getBalance();
      getorder();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(balance.value ? balance.value : 0),
        b: common_vendor.o(openBuy),
        c: common_vendor.f(orderData.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.type == "test" ? "充值" : "消费"),
            b: common_vendor.t(item.type == "test" ? item.total_fee / 100 : -(item.total_fee / 100)),
            c: common_vendor.n(item.type == "test" ? "active" : ""),
            d: item.type != "test"
          }, item.type != "test" ? {
            e: common_vendor.t(item.custom.des)
          } : {}, {
            f: "12e7122b-2-" + i0 + "," + ("12e7122b-1-" + i0),
            g: common_vendor.p({
              date: item.pay_date ? item.pay_date : item.create_date,
              format: "yyyy-MM-dd hh:mm:ss",
              threshold: [0, 0]
            }),
            h: "12e7122b-1-" + i0 + ",12e7122b-0",
            i: common_vendor.p({
              title: "交易单号",
              extra: item.order_no
            }),
            j: index
          });
        }),
        d: common_vendor.p({
          title: "交易记录",
          type: "line"
        }),
        e: common_vendor.o(changePrice),
        f: common_vendor.o(($event) => priceValue.value = $event),
        g: common_vendor.p({
          type: "number",
          trim: "all",
          placeholder: "输入购买的积分",
          modelValue: priceValue.value
        }),
        h: common_vendor.p({
          title: "输入购买的积分",
          subTitle: "1元 = 1Pt",
          type: "line",
          padding: true
        }),
        i: common_vendor.n(navindex.value == 0 ? "active" : ""),
        j: common_vendor.o(($event) => changeIndex(0)),
        k: common_vendor.n(navindex.value == 1 ? "active" : ""),
        l: common_vendor.o(($event) => changeIndex(1)),
        m: common_vendor.n(navindex.value == 2 ? "active" : ""),
        n: common_vendor.o(($event) => changeIndex(2)),
        o: common_vendor.n(navindex.value == 3 ? "active" : ""),
        p: common_vendor.o(($event) => changeIndex(3)),
        q: common_vendor.t(priceValue.value ? priceValue.value : 0),
        r: common_vendor.o(comfirmBuy),
        s: common_vendor.sr(popup, "12e7122b-3", {
          "k": "popup"
        }),
        t: common_vendor.o(_ctx.change),
        v: common_vendor.p({
          ["background-color"]: "#fff",
          type: "bottom",
          borderRadius: "10px 10px 0px 0px"
        }),
        w: common_vendor.sr(pay, "12e7122b-6", {
          "k": "pay"
        }),
        x: common_vendor.o(onSuccess),
        y: common_vendor.o(onCreate),
        z: common_vendor.p({
          adpid: adpid.value,
          ["return-url"]: "/pages/order-detail/order-detail",
          logo: "/static/logo.png"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-12e7122b"]]);
wx.createPage(MiniProgramPage);
