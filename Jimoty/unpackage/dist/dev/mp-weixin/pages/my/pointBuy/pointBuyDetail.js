"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_dateformat2 + _easycom_uni_load_more2)();
}
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_load_more)();
}
const defalutImage = "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png";
const _sfc_main = {
  __name: "pointBuyDetail",
  setup(__props) {
    let db = common_vendor.Zs.database();
    const dbcmd = db.command;
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const Pageloading = common_vendor.ref("loading");
    const pageData1 = common_vendor.ref([]);
    const myPostId = common_vendor.ref("");
    const chooseData = common_vendor.ref({});
    const statusType = common_vendor.ref({
      1: "草稿",
      2: "发布中",
      4: "结束"
    });
    const daojuEme = common_vendor.ref({
      0: "置顶",
      1: "高亮",
      2: "刷新",
      3: "定期刷新"
    });
    const daojuType = common_vendor.ref(-1);
    common_vendor.onLoad((e) => {
      daojuType.value = Number(e.daojuType);
      console.log("道具类型", daojuEme.value[daojuType.value]);
      loadData();
    });
    common_vendor.onPullDownRefresh(() => {
      pageData1.value = [];
      loadData();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      loadData();
    });
    async function loadData() {
      Pageloading.value = "loading";
      const temp1 = db.collection("jimoty-post").where({ userId: uid, status: dbcmd.in([2, 5]), delete: 1 }).getTemp();
      const temp2 = db.collection("jimoty-category").field("_id,name,parent_id").getTemp();
      const res = await db.collection(temp1, temp2).skip(pageData1.value.length).limit(10).get();
      console.log(res.result.data, "llllllllllll");
      pageData1.value = [...pageData1.value, ...res.result.data];
      Pageloading.value = "noMore";
    }
    const navIndex = common_vendor.ref(-1);
    const postTpye = common_vendor.ref(1);
    function chooseUse(data, index) {
      navIndex.value = index;
      chooseData.value = data;
      myPostId.value = data._id;
      postTpye.value = data.type;
      console.log(data, "kkkk");
    }
    function submit() {
      if (myPostId.value != "" && myPostId.value) {
        common_vendor.index.showModal({
          content: `是否对稿子(${chooseData.value.noteTitle})使用(${daojuEme.value[daojuType.value]})道具`,
          success: async function(res) {
            if (res.confirm) {
              common_vendor.Zs.callFunction({
                name: "jimoty-dao-use",
                data: {
                  daojuType: daojuType.value,
                  uid,
                  myPostId: myPostId.value,
                  postTpye: postTpye.value
                }
              }).then((res2) => {
                if (res2.result.code == 200) {
                  common_vendor.index.showToast({
                    title: res2.result.msg,
                    icon: "none"
                  });
                } else {
                  common_vendor.index.showToast({
                    title: res2.result.msg,
                    icon: "none"
                  });
                }
                setTimeout(() => {
                  common_vendor.index.navigateBack();
                }, 800);
              }).catch((e) => {
                common_vendor.index.showToast({
                  title: "使用失败！！！",
                  icon: "error"
                });
              });
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "请选择需要使用的投稿",
          icon: "none"
        });
      }
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(pageData1.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.photos && item.photos[0] ? item.photos[0] : defalutImage,
            b: item.category && item.category[0]
          }, item.category && item.category[0] ? {
            c: common_vendor.t(item.category[0].name)
          } : {}, {
            d: common_vendor.t(item.status == 5 ? "交易中" : statusType.value[item.status]),
            e: common_vendor.t(item.noteTitle),
            f: "e27bbcea-0-" + i0,
            g: common_vendor.p({
              date: item.create_date,
              format: "MM/dd hh:mm"
            }),
            h: common_vendor.t(item.collect),
            i: common_vendor.t(item.browse),
            j: index,
            k: common_vendor.o(($event) => chooseUse(item, index), index),
            l: common_vendor.n(navIndex.value == index ? "active" : "")
          });
        }),
        b: common_vendor.p({
          status: Pageloading.value
        }),
        c: common_vendor.o(submit)
      };
    };
  }
};
wx.createPage(_sfc_main);
