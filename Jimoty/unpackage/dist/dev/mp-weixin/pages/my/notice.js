"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  (_easycom_uni_icons2 + _easycom_uni_load_more2 + _easycom_unicloud_db2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_unicloud_db = () => "../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more + _easycom_unicloud_db)();
}
const _sfc_main = {
  __name: "notice",
  setup(__props) {
    const Pageloading = common_vendor.ref("loading");
    const userId = common_vendor.Zs.getCurrentUserInfo().uid;
    const db = common_vendor.Zs.database();
    common_vendor.ref(null);
    const searchConditons = common_vendor.ref([]);
    common_vendor.onPullDownRefresh(() => {
      console.log("刷新");
      udb.value.loadData({
        clear: true
      }, () => {
        common_vendor.index.stopPullDownRefresh();
      });
    });
    common_vendor.onReachBottom(() => {
      udb.value.loadMore();
    });
    common_vendor.onMounted(() => {
      udb.value.loadData();
    });
    const udb = common_vendor.ref(null);
    function makeNotice() {
      common_vendor.index.navigateTo({
        url: "/pages/my/noticeAdd"
      });
    }
    function handleHot(e) {
      console.log(e);
      if (e.length > 0) {
        Pageloading.value = "";
      } else {
        Pageloading.value = "noMore";
      }
      searchConditons.value = [...e];
    }
    function setNotice(data, index) {
      console.log(data);
      common_vendor.index.showModal({
        content: "是否确认删除",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            searchConditons.value.splice(index, 1);
            db.collection("jimoty-search").doc(data._id).remove();
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.w(({
          data,
          loading,
          error,
          options
        }, s0, i0) => {
          return common_vendor.e({
            a: error
          }, error ? {
            b: common_vendor.t(error.message)
          } : {
            c: common_vendor.o(makeNotice),
            d: common_vendor.f(searchConditons.value, (item, index, i1) => {
              return {
                a: common_vendor.t(item.text_condition),
                b: common_vendor.t((item == null ? void 0 : item.category_condition[0]) ? item.category_condition[0].name : ""),
                c: common_vendor.t(item.positon_condition.address),
                d: common_vendor.t(item.positon_condition.length / 1e3),
                e: "17944d86-1-" + i0 + "-" + i1 + ",17944d86-0",
                f: common_vendor.o(($event) => setNotice(item, index), index),
                g: index
              };
            }),
            e: common_vendor.p({
              type: "more-filled",
              size: "24",
              color: "rgb(159, 159, 159)"
            })
          }, {
            f: "17944d86-2-" + i0 + ",17944d86-0",
            g: i0,
            h: s0
          });
        }, {
          name: "d",
          path: "a",
          vueId: "17944d86-0"
        }),
        b: common_vendor.p({
          status: Pageloading.value
        }),
        c: common_vendor.sr(udb, "17944d86-0", {
          "k": "udb"
        }),
        d: common_vendor.o(handleHot),
        e: common_vendor.p({
          collection: "jimoty-search,jimoty-category",
          orderby: "create_date desc",
          ["page-size"]: 15,
          where: `userId == '${common_vendor.unref(userId)}'`,
          manual: true
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
