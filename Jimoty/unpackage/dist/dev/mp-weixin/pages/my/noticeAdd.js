"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "noticeAdd",
  setup(__props) {
    const categeryData = common_vendor.ref([]);
    const categeryStr = common_vendor.ref("");
    const categeryId = common_vendor.ref("");
    const db = common_vendor.Zs.database();
    common_vendor.onMounted(() => {
      common_vendor.index.$on("categerySearchData", (res) => {
        categeryData.value = res.categery;
        categeryId.value = res.id;
        categeryData.value.forEach((res2) => {
          categeryStr.value = categeryStr.value + res2;
        });
      });
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.$off("categerySearchData");
      common_vendor.index.$off("refashHome");
    });
    function openCategery() {
      common_vendor.index.navigateTo({
        url: `/pages/submit/datapage?index=1`
      });
    }
    function addNotice() {
      if (categeryId.value == "") {
        common_vendor.index.showToast({
          title: "请选择类别",
          icon: "none"
        });
        return;
      }
      let position = common_vendor.index.getStorageSync("HistoryCity");
      db.collection("jimoty-search").add({
        positon_condition: {
          address: position.city,
          point: [position.longitude, position.latitude],
          length: position.length
        },
        category_condition: categeryId.value
      });
      common_vendor.index.showToast({
        title: "添加成功",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 800);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: categeryData.value.length > 0
      }, categeryData.value.length > 0 ? {
        b: common_vendor.f(categeryData.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        })
      } : {}, {
        c: common_vendor.p({
          type: "right",
          size: "22"
        }),
        d: common_vendor.o(openCategery),
        e: common_vendor.o(addNotice)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ba4e4122"]]);
wx.createPage(MiniProgramPage);
