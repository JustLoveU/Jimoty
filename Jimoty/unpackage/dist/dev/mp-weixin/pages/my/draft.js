"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_dateformat2 + _easycom_uni_load_more2)();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_load_more)();
}
const defalutImage = "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png";
const _sfc_main = {
  __name: "draft",
  setup(__props) {
    const navIndex = common_vendor.ref(0);
    let db = common_vendor.Zs.database();
    let dbcmd = db.command;
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const Pageloading = common_vendor.ref("loading");
    const pageData1 = common_vendor.ref([]);
    const pageData2 = common_vendor.ref([]);
    const pageData3 = common_vendor.ref([]);
    const statusType = common_vendor.ref({
      1: "草稿",
      2: "发布中",
      4: "结束"
    });
    common_vendor.onLoad((e) => {
      navIndex.value = e.index;
      loadData();
    });
    common_vendor.onPullDownRefresh(() => {
      pageData1.value = [];
      pageData2.value = [];
      pageData3.value = [];
      loadData();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      loadData();
    });
    async function changeNav(index) {
      navIndex.value = index;
    }
    async function loadData() {
      Pageloading.value = "loading";
      const temp1 = db.collection("jimoty-post").where({ userId: uid, status: dbcmd.in([2, 4, 5]), delete: 1 }).getTemp();
      const temp2 = db.collection("jimoty-category").field("_id,name,parent_id").getTemp();
      const res = await db.collection(temp1, temp2).skip(pageData1.value.length).limit(10).get();
      pageData1.value = [...pageData1.value, ...res.result.data];
      const temp3 = db.collection("jimoty-post").where({ userId: uid, status: 1, delete: 1 }).getTemp();
      const temp4 = db.collection("jimoty-category").field("_id,name,parent_id").getTemp();
      const res2 = await db.collection(temp3, temp4).skip(pageData2.value.length).limit(10).get();
      console.log(res2.result.data, "llllllllllll");
      pageData2.value = [...pageData2.value, ...res2.result.data];
      let broseArr = common_vendor.index.getStorageSync("history-browse");
      if (broseArr) {
        const temp5 = db.collection("jimoty-post").where({
          status: 2,
          delete: 1,
          _id: dbcmd.in(
            broseArr
          )
        }).getTemp();
        const temp6 = db.collection("jimoty-category").field("_id,name,parent_id").getTemp();
        const res3 = await db.collection(temp5, temp6).get();
        pageData3.value = res3.result.data;
      }
      Pageloading.value = "noMore";
    }
    function gotoDetail(postId) {
      common_vendor.index.navigateTo({
        url: `/pages/home/detail?postId=${postId}`
      });
    }
    async function gotoDetail2(postId) {
      const res = await db.collection("jimoty-post").doc(postId).field("type").get({ getOne: true });
      console.log(res.result.data);
      switch (res.result.data.type) {
        case 1:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage1?postId=${postId}`
          });
          break;
        case 2:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage2?postId=${postId}`
          });
          break;
        case 3:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage3?postId=${postId}`
          });
          break;
        case 4:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage4?postId=${postId}`
          });
          break;
        case 5:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage5?postId=${postId}`
          });
          break;
      }
    }
    function cancleHistory(postId) {
      common_vendor.index.showModal({
        content: "是否确认删除该历史",
        success: function(res) {
          if (res.confirm) {
            console.log(pageData3.value, "aaaaaa");
            let findIndex = pageData3.value.findIndex((item) => {
              item._id = postId;
            });
            if (findIndex != -1) {
              pageData3.value.splice(findIndex, 1);
              let broseArr = common_vendor.index.getStorageSync("history-browse");
              let index = broseArr.findIndex((item) => item == postId);
              if (index != -1) {
                broseArr.splice(index, 1);
                common_vendor.index.setStorageSync("history-browse", broseArr);
              } else {
                common_vendor.index.showToast({
                  title: "删除失败",
                  icon: "none"
                });
              }
            } else {
              common_vendor.index.showToast({
                title: "该记录不存在",
                icon: "none"
              });
            }
          }
        }
      });
    }
    function cancleCaogao(postId, index) {
      common_vendor.index.showModal({
        content: "是否确认删除草稿，删除则不可被找回",
        success: function(res) {
          if (res.confirm) {
            pageData2.value.splice(index, 1);
            db.collection("jimoty-post").doc(postId).remove();
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
    async function edit(postId) {
      const res = await db.collection("jimoty-post").doc(postId).field("type").get({ getOne: true });
      console.log(res.result.data);
      switch (res.result.data.type) {
        case 1:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage1?postId=${postId}`
          });
          break;
        case 2:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage2?postId=${postId}`
          });
          break;
        case 3:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage3?postId=${postId}`
          });
          break;
        case 4:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage4?postId=${postId}`
          });
          break;
        case 5:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage5?postId=${postId}`
          });
          break;
      }
    }
    function cancel(postId, index) {
      common_vendor.index.showModal({
        content: "是否确认删除投稿",
        success: function(res) {
          if (res.confirm) {
            pageData1.value.splice(index, 1);
            common_vendor.Zs.callFunction({
              name: "jimoty-cancle-post",
              data: {
                postId,
                bool: "true"
              }
            }).then((res2) => {
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
        a: common_vendor.n(navIndex.value == 0 ? "active" : ""),
        b: common_vendor.o(($event) => changeNav(0)),
        c: common_vendor.n(navIndex.value == 1 ? "active" : ""),
        d: common_vendor.o(($event) => changeNav(1)),
        e: common_vendor.n(navIndex.value == 2 ? "active" : ""),
        f: common_vendor.o(($event) => changeNav(2)),
        g: navIndex.value == 0
      }, navIndex.value == 0 ? {
        h: common_vendor.f(pageData1.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.photos && item.photos[0] ? item.photos[0] : defalutImage,
            b: item.category && item.category[0]
          }, item.category && item.category[0] ? {
            c: common_vendor.t(item.category[0].name)
          } : {}, {
            d: common_vendor.t(item.status == 5 ? "交易中" : statusType.value[item.status]),
            e: common_vendor.t(item.noteTitle),
            f: "014ceb68-0-" + i0,
            g: common_vendor.p({
              date: item.create_date,
              format: "MM/dd hh:mm"
            }),
            h: common_vendor.t(item.collect),
            i: common_vendor.t(item.browse),
            j: common_vendor.o(($event) => edit(item._id), index),
            k: common_vendor.o(($event) => cancel(item._id, index), index),
            l: index,
            m: common_vendor.o(($event) => gotoDetail(item._id), index)
          });
        }),
        i: common_vendor.p({
          status: Pageloading.value
        })
      } : navIndex.value == 1 ? {
        k: common_vendor.f(pageData2.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.photos && item.photos[0] ? item.photos[0] : defalutImage,
            b: item.category && item.category[0]
          }, item.category && item.category[0] ? {
            c: common_vendor.t(item.category[0].name)
          } : {}, {
            d: common_vendor.t(statusType.value[item.status]),
            e: common_vendor.t(item.noteTitle),
            f: common_vendor.o(($event) => cancleCaogao(item._id, index), index),
            g: index,
            h: common_vendor.o(($event) => gotoDetail2(item._id), index)
          });
        }),
        l: common_vendor.p({
          status: Pageloading.value
        })
      } : navIndex.value == 2 ? {
        n: common_vendor.f(pageData3.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.photos && item.photos[0] ? item.photos[0] : defalutImage,
            b: item.category && item.category[0]
          }, item.category && item.category[0] ? {
            c: common_vendor.t(item.category[0].name)
          } : {}, {
            d: common_vendor.t(statusType.value[item.status]),
            e: common_vendor.t(item.noteTitle),
            f: item.postPrice
          }, item.postPrice ? {
            g: common_vendor.t(item.postPrice)
          } : {}, {
            h: common_vendor.o(($event) => cancleHistory(item._id), index),
            i: index,
            j: common_vendor.o(($event) => gotoDetail(item._id), index)
          });
        }),
        o: common_vendor.p({
          status: Pageloading.value
        })
      } : {}, {
        j: navIndex.value == 1,
        m: navIndex.value == 2
      });
    };
  }
};
wx.createPage(_sfc_main);
