"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_dateformat2 + _easycom_uni_swipe_action_item2 + _easycom_uni_load_more2 + _easycom_uni_icons2)();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_swipe_action_item = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_swipe_action_item + _easycom_uni_load_more + _easycom_uni_icons)();
}
const defaultAvatar = "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png";
const xitong = "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/系统.png";
const _sfc_main = {
  __name: "notice",
  setup(__props) {
    const db = common_vendor.Zs.database();
    const dbcmd = db.command;
    const userId = common_vendor.Zs.getCurrentUserInfo().uid;
    const Pageloading = common_vendor.ref("loading");
    const pagedata1 = common_vendor.ref([]);
    const pagedata2 = common_vendor.ref([]);
    const pagedata3 = common_vendor.ref([]);
    const pageArr1 = common_vendor.ref([]);
    common_vendor.ref([]);
    common_vendor.ref([]);
    const options = common_vendor.ref([{
      text: "删除",
      style: {
        backgroundColor: "#F56C6C"
      }
    }]);
    function bindClick(noticeId, index, type) {
      common_vendor.index.showModal({
        content: "是否删除",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            if (type == 1) {
              pagedata1.value.splice(index, 1);
            } else if (type == 2) {
              pagedata2.value.splice(index, 1);
            } else {
              pagedata3.value.splice(index, 1);
            }
            db.collection("jimoty-notice").doc(noticeId).remove();
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
    const navIndex = common_vendor.ref(0);
    common_vendor.onMounted(() => {
    });
    function changeNav(index) {
      navIndex.value = index;
      if (navIndex.value == 1) {
        pagedata2.value.forEach((item) => {
          db.collection("jimoty-notice").doc(item._id).update({ status: true });
          item.status = true;
        });
      }
    }
    common_vendor.onPullDownRefresh(async () => {
      pagedata1.value = [];
      pagedata2.value = [];
      pagedata3.value = [];
      await getData();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      getData();
    });
    common_vendor.onLoad(async () => {
      await getData();
    });
    async function getData(index) {
      Pageloading.value = "loading";
      const temp2 = db.collection("uni-id-users").field("_id,nickname,avatar_file.url").getTemp();
      const temp1 = db.collection("jimoty-notice").where({ receive: userId, type: dbcmd.in([1, 2, 3, 4]) }).getTemp();
      const res1 = await db.collection(temp1, temp2).orderBy("create_date desc").skip(pagedata1.value.length).limit(
        10
      ).get();
      pageArr1.value = [...res1.result.data];
      pagedata1.value = [...pagedata1.value, ...res1.result.data];
      console.log(pagedata1.value, "@@@@@");
      const temp3 = db.collection("jimoty-notice").where({ receive: userId, type: dbcmd.in([0, 7]) }).getTemp();
      const res2 = await db.collection(temp3, temp2).orderBy("create_date desc").skip(pagedata2.value.length).limit(
        10
      ).get();
      pagedata2.value = [...pagedata2.value, ...res2.result.data];
      console.log(pagedata2.value, "@@@@@");
      const temp4 = db.collection("jimoty-notice").where({ receive: userId, type: dbcmd.in([5, 6]) }).getTemp();
      const temp5 = db.collection("jimoty-category").getTemp();
      const res3 = await db.collection(temp4, temp2, temp5).orderBy("create_date desc").skip(pagedata3.value.length).limit(
        10
      ).get();
      pagedata3.value = [...pagedata3.value, ...res3.result.data];
      console.log(pagedata3.value, "@@@@@");
      Pageloading.value = "noMore";
    }
    function gotopage1(data, index) {
      pagedata1.value[index].status = true;
      db.collection("jimoty-notice").doc(data._id).update({ status: true });
      common_vendor.index.navigateTo({
        url: `/pages/home/detail?postId=${data.message}`
      });
    }
    function gotopage2(data, index) {
      pagedata1.value[index].status = true;
      db.collection("jimoty-notice").doc(data._id).update({ status: true });
      common_vendor.index.navigateTo({
        url: `/pages/message/chatPage?chatId=${data.message}`
      });
    }
    function gotopage3(data, index) {
      pagedata1.value[index].status = true;
      db.collection("jimoty-notice").doc(data._id).update({ status: true });
      common_vendor.index.navigateTo({
        url: "/pages/my/comment"
      });
    }
    function gotopage4(data, index) {
      pagedata1.value[index].status = true;
      db.collection("jimoty-notice").doc(data._id).update({ status: true });
      common_vendor.index.navigateTo({
        url: `/pages/my/follow?myFollowId=${data.sendPeople[0]._id}`
      });
    }
    function gotopage5(data, index) {
      pagedata3.value[index].status = true;
      db.collection("jimoty-notice").doc(data._id).update({ status: true });
      common_vendor.index.navigateTo({
        url: `/pages/home/detail?postId=${data.message}`
      });
    }
    function gotopage6(data, index) {
      db.collection("jimoty-notice").doc(data._id).update({ status: true });
      common_vendor.index.navigateTo({
        url: `/pages/my/myDetail?userId=${data.sendPeople[0]._id}`
      });
    }
    function gotopage7(data, index) {
      db.collection("jimoty-notice").doc(data._id).update({ status: true });
      common_vendor.index.navigateTo({
        url: `/pages/home/reback_notice?postId=${data.message}`
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
        h: common_vendor.f(pagedata1.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.type == 4
          }, item.type == 4 ? common_vendor.e({
            b: !item.status
          }, !item.status ? {} : {}, {
            c: item.sendPeople.length > 0 ? item.sendPeople[0].avatar_file.url : defaultAvatar,
            d: common_vendor.t(item.sendPeople.length > 0 ? item.sendPeople[0].nickname : "有人"),
            e: "4251c9aa-1-" + i0 + "," + ("4251c9aa-0-" + i0),
            f: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 72e5],
              format: "MM月dd日"
            }),
            g: common_vendor.o(($event) => gotopage1(item, index), index)
          }) : item.type == 1 ? common_vendor.e({
            i: !item.status
          }, !item.status ? {} : {}, {
            j: item.sendPeople.length > 0 ? item.sendPeople[0].avatar_file.url : defaultAvatar,
            k: common_vendor.t(item.sendPeople.length > 0 ? item.sendPeople[0].nickname : "有人"),
            l: common_vendor.t(item.otherMessage),
            m: common_vendor.t(item.total ? item.total + "条" : ""),
            n: "4251c9aa-2-" + i0 + "," + ("4251c9aa-0-" + i0),
            o: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 72e5],
              format: "MM月dd日"
            }),
            p: common_vendor.o(($event) => gotopage2(item, index), index)
          }) : item.type == 3 ? common_vendor.e({
            r: !item.status
          }, !item.status ? {} : {}, {
            s: item.sendPeople.length > 0 ? item.sendPeople[0].avatar_file.url : defaultAvatar,
            t: common_vendor.t(item.sendPeople.length > 0 ? item.sendPeople[0].nickname : "有人"),
            v: common_vendor.t(item.otherMessage),
            w: "4251c9aa-3-" + i0 + "," + ("4251c9aa-0-" + i0),
            x: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 72e5],
              format: "MM月dd日"
            }),
            y: common_vendor.o(($event) => gotopage3(item, index), index)
          }) : item.type == 2 ? common_vendor.e({
            A: !item.status
          }, !item.status ? {} : {}, {
            B: item.sendPeople.length > 0 ? item.sendPeople[0].avatar_file.url : defaultAvatar,
            C: common_vendor.t(item.sendPeople.length > 0 ? item.sendPeople[0].nickname : "有人"),
            D: "4251c9aa-4-" + i0 + "," + ("4251c9aa-0-" + i0),
            E: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 72e5],
              format: "MM月dd日"
            }),
            F: common_vendor.o(($event) => gotopage4(item, index), index)
          }) : {}, {
            h: item.type == 1,
            q: item.type == 3,
            z: item.type == 2,
            G: common_vendor.o(($event) => bindClick(item._id, index, 1), index),
            H: "4251c9aa-0-" + i0,
            I: index
          });
        }),
        i: common_vendor.p({
          ["right-options"]: options.value
        }),
        j: common_vendor.p({
          status: Pageloading.value
        })
      } : navIndex.value == 1 ? {
        l: common_vendor.f(pagedata2.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.type == 0
          }, item.type == 0 ? common_vendor.e({
            b: !item.status
          }, !item.status ? {} : {}, {
            c: xitong,
            d: common_vendor.t(item.otherMessage),
            e: common_vendor.t(item.message),
            f: "4251c9aa-7-" + i0 + "," + ("4251c9aa-6-" + i0),
            g: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 72e5],
              format: "MM月dd日"
            })
          }) : {}, {
            h: item.type == 7
          }, item.type == 7 ? common_vendor.e({
            i: !item.status
          }, !item.status ? {} : {}, {
            j: xitong,
            k: common_vendor.t(item.otherMessage),
            l: "4251c9aa-8-" + i0 + "," + ("4251c9aa-6-" + i0),
            m: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 72e5],
              format: "MM月dd日"
            }),
            n: common_vendor.o(($event) => gotopage7(item), index)
          }) : {}, {
            o: common_vendor.o(($event) => bindClick(item._id, index, 2), index),
            p: "4251c9aa-6-" + i0,
            q: index
          });
        }),
        m: common_vendor.p({
          ["right-options"]: options.value
        }),
        n: common_vendor.p({
          status: Pageloading.value
        })
      } : navIndex.value == 2 ? {
        p: common_vendor.f(pagedata3.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.type == 6
          }, item.type == 6 ? {
            b: common_vendor.t(item.otherMessage[0].name),
            c: common_vendor.t(item.total ? item.total : "1"),
            d: "4251c9aa-11-" + i0 + "," + ("4251c9aa-10-" + i0),
            e: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 72e5],
              format: "MM月dd日"
            }),
            f: common_vendor.t(item.otherMessage[0].name),
            g: "4251c9aa-12-" + i0 + "," + ("4251c9aa-10-" + i0),
            h: common_vendor.p({
              type: "right",
              size: "18"
            }),
            i: common_vendor.o(($event) => gotopage6(item), index)
          } : common_vendor.e({
            j: !item.status
          }, !item.status ? {} : {}, {
            k: item.sendPeople && item.sendPeople[0] && item.sendPeople[0].avatar_file ? item.sendPeople[0].avatar_file.url : defaultAvatar,
            l: common_vendor.t(item.sendPeople && item.sendPeople[0] ? item.sendPeople[0].nickname : "有人"),
            m: "4251c9aa-13-" + i0 + "," + ("4251c9aa-10-" + i0),
            n: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 72e5],
              format: "MM月dd日"
            }),
            o: common_vendor.o(($event) => gotopage5(item, index), index)
          }), {
            p: common_vendor.o(($event) => bindClick(item._id, index, 3), index),
            q: "4251c9aa-10-" + i0,
            r: index
          });
        }),
        q: common_vendor.p({
          ["right-options"]: options.value
        }),
        r: common_vendor.p({
          status: Pageloading.value
        })
      } : {}, {
        k: navIndex.value == 1,
        o: navIndex.value == 2
      });
    };
  }
};
wx.createPage(_sfc_main);
