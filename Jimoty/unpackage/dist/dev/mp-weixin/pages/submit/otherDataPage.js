"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + sRegionSlider)();
}
const sRegionSlider = () => "../../components/s-region-slider/s-region-slider.js";
const _sfc_main = {
  __name: "otherDataPage",
  setup(__props) {
    const type = common_vendor.ref(0);
    const minValue = common_vendor.ref(18);
    const maxValue = common_vendor.ref(40);
    common_vendor.onLoad((e) => {
      console.log(e);
      type.value = e.index;
    });
    const chooseText = common_vendor.ref("没有限定");
    const chooseAge = common_vendor.ref(false);
    function cheack(text) {
      if (text == "男") {
        common_vendor.index.$emit("condition", "男");
        common_vendor.index.navigateBack();
      } else if (text == "女") {
        common_vendor.index.$emit("condition", "女");
        common_vendor.index.navigateBack();
      } else if (text == "没有限定") {
        common_vendor.index.$emit("condition", "没有限定");
        common_vendor.index.navigateBack();
      }
      chooseText.value = text;
    }
    function cheackage(text) {
      if (text == "限定") {
        chooseAge.value = true;
      } else {
        chooseAge.value = false;
        common_vendor.index.$emit("conditionAge", "没有限定");
        common_vendor.index.navigateBack();
      }
      chooseText.value = text;
    }
    function up(e) {
      minValue.value = e.custom.minValue;
      maxValue.value = e.custom.maxValue;
      console.log(e, "ooo");
    }
    function choooseMyage() {
      console.log(minValue.value, "aaaaaaaaaa", maxValue.value);
      common_vendor.index.$emit("conditionAge", [minValue.value, maxValue.value]);
      common_vendor.index.navigateBack();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: type.value == 1
      }, type.value == 1 ? {
        b: common_vendor.p({
          type: "right",
          size: "24"
        }),
        c: common_vendor.o(($event) => cheack("男")),
        d: common_vendor.p({
          type: "right",
          size: "24"
        }),
        e: common_vendor.o(($event) => cheack("女")),
        f: common_vendor.p({
          type: "right",
          size: "24"
        }),
        g: common_vendor.o(($event) => cheack("没有限定"))
      } : type.value == 2 ? common_vendor.e({
        i: common_vendor.p({
          type: "right",
          size: "24"
        }),
        j: common_vendor.o(($event) => cheackage("限定")),
        k: common_vendor.p({
          type: "right",
          size: "24"
        }),
        l: common_vendor.o(($event) => cheackage("没有限定")),
        m: chooseAge.value
      }, chooseAge.value ? {
        n: common_vendor.o(up),
        o: common_vendor.p({
          fillValue: 100,
          minValue: minValue.value,
          maxValue: maxValue.value,
          step: 1
        }),
        p: common_vendor.o(choooseMyage)
      } : {}) : {}, {
        h: type.value == 2
      });
    };
  }
};
wx.createPage(_sfc_main);
