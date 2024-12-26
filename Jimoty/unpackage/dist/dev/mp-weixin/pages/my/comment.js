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
const _sfc_main = {
  __name: "comment",
  setup(__props) {
    const db = common_vendor.Zs.database();
    let uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const idLoad = common_vendor.ref(true);
    const Pageloading = common_vendor.ref("loading");
    const pagedata0 = common_vendor.ref([]);
    const pagedata1 = common_vendor.ref([]);
    const pagedata2 = common_vendor.ref([]);
    const pagedata3 = common_vendor.ref([]);
    const commentType = {
      0: "好评",
      1: "一般",
      2: "差评"
    };
    const navIndex = common_vendor.ref(3);
    common_vendor.onPullDownRefresh(() => {
      pagedata0.value = [];
      pagedata1.value = [];
      pagedata2.value = [];
      pagedata3.value = [];
      getData();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      getData();
    });
    common_vendor.onLoad((e) => {
      if (e.userId) {
        uid = e.userId;
      }
      getData();
    });
    function gotoUser(id) {
      common_vendor.index.navigateTo({
        url: `/pages/my/myDetail?userId=${id}`
      });
    }
    function changeNav(index) {
      navIndex.value = index;
    }
    async function getData() {
      Pageloading.value = "loading";
      const temp1 = db.collection("jimoty-post").field("_id,noteTitle").getTemp();
      const temp6 = db.collection("uni-id-users").field("_id,nickname,avatar_file.url").getTemp();
      const temp2 = db.collection("jimoty-comment").where({ re_user_id: uid, type: 0 }).getTemp();
      const res2 = await db.collection(temp2, temp1, temp6).orderBy("create_date desc").skip(pagedata0.value.length).limit(10).get();
      pagedata0.value = [...pagedata0.value, ...res2.result.data];
      console.log(res2.result.data, "aaaaaaaaaaaaaaaaaaaaaaaaaa");
      const temp3 = db.collection("jimoty-comment").where({ re_user_id: uid, type: 1 }).getTemp();
      const res3 = await db.collection(temp3, temp1, temp6).orderBy("create_date desc").skip(pagedata1.value.length).limit(10).get();
      pagedata1.value = [...pagedata1.value, ...res3.result.data];
      const temp4 = db.collection("jimoty-comment").where({ re_user_id: uid, type: 2 }).getTemp();
      const res4 = await db.collection(temp4, temp1, temp6).orderBy("create_date desc").skip(pagedata2.value.length).limit(10).get();
      pagedata2.value = [...pagedata2.value, ...res4.result.data];
      const temp5 = db.collection("jimoty-comment").where({ re_user_id: uid }).getTemp();
      const res5 = await db.collection(temp5, temp1, temp6).orderBy("create_date desc").skip(pagedata3.value.length).limit(10).get();
      pagedata3.value = [...pagedata3.value, ...res5.result.data];
      idLoad.value = false;
      Pageloading.value = "noMore";
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(99 > pagedata3.value.length > 0 ? pagedata3.value.length : 0),
        b: common_vendor.n(navIndex.value == 3 ? "active" : ""),
        c: common_vendor.o(($event) => changeNav(3)),
        d: common_vendor.t(99 > pagedata0.value.length > 0 ? pagedata0.value.length : 0),
        e: common_vendor.n(navIndex.value == 0 ? "active" : ""),
        f: common_vendor.o(($event) => changeNav(0)),
        g: common_vendor.t(99 > pagedata1.value.length > 0 ? pagedata1.value.length : 0),
        h: common_vendor.n(navIndex.value == 1 ? "active" : ""),
        i: common_vendor.o(($event) => changeNav(1)),
        j: common_vendor.t(99 > pagedata2.value.length > 0 ? pagedata2.value.length : 0),
        k: common_vendor.n(navIndex.value == 2 ? "active" : ""),
        l: common_vendor.o(($event) => changeNav(2)),
        m: navIndex.value == 3
      }, navIndex.value == 3 ? {
        n: common_vendor.f(pagedata3.value, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => gotoUser(item.send_user_id[0]._id), index),
            b: item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].avatar_file.url : "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png",
            c: common_vendor.t(item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].nickname : "未知用户"),
            d: common_vendor.t(commentType[item.type]),
            e: common_vendor.t(item.post_id[0] ? item.post_id[0].noteTitle : "该贴已被删除"),
            f: common_vendor.t(item.content),
            g: "3b39174a-0-" + i0,
            h: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 72e5],
              format: "MM-dd"
            }),
            i: index
          };
        })
      } : navIndex.value == 0 ? {
        p: common_vendor.f(pagedata0.value, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => gotoUser(item.send_user_id[0]._id), index),
            b: item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].avatar_file.url : "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png",
            c: common_vendor.t(item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].nickname : "未知用户"),
            d: common_vendor.t(commentType[item.type]),
            e: common_vendor.t(item.post_id[0] ? item.post_id[0].noteTitle : "该贴已被删除"),
            f: common_vendor.t(item.content),
            g: "3b39174a-1-" + i0,
            h: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 72e5],
              format: "MM-dd"
            }),
            i: index
          };
        })
      } : navIndex.value == 1 ? {
        r: common_vendor.f(pagedata1.value, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => gotoUser(item.send_user_id[0]._id), index),
            b: item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].avatar_file.url : "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png",
            c: common_vendor.t(item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].nickname : "未知用户"),
            d: common_vendor.t(commentType[item.type]),
            e: common_vendor.t(item.post_id[0] ? item.post_id[0].noteTitle : "该贴已被删除"),
            f: common_vendor.t(item.content),
            g: "3b39174a-2-" + i0,
            h: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 72e5],
              format: "MM-dd"
            }),
            i: index
          };
        })
      } : {
        s: common_vendor.f(pagedata2.value, (item, index, i0) => {
          return {
            a: item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].avatar_file.url : "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png",
            b: common_vendor.t(item.send_user_id && item.send_user_id[0] ? item.send_user_id[0].nickname : "未知用户"),
            c: common_vendor.t(commentType[item.type]),
            d: common_vendor.t(item.post_id[0] ? item.post_id[0].noteTitle : "该贴已被删除"),
            e: common_vendor.t(item.content),
            f: "3b39174a-3-" + i0,
            g: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 72e5],
              format: "yyyy-MM-dd hh:mm:ss"
            }),
            h: index
          };
        })
      }, {
        o: navIndex.value == 0,
        q: navIndex.value == 1,
        t: common_vendor.p({
          status: Pageloading.value
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
