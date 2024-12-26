"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_noticeOperate = require("../../utils/noticeOperate.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  _easycom_uni_load_more();
}
const defalutImage = "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png";
const _sfc_main = {
  __name: "follow",
  setup(__props) {
    let db = common_vendor.Zs.database();
    let dbcmd = db.command;
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const navIndex = common_vendor.ref(0);
    const Pageloading = common_vendor.ref("loading");
    const ifLoad = common_vendor.ref(false);
    const index1data = common_vendor.ref([]);
    const index2data = common_vendor.ref([]);
    const havefollow = common_vendor.ref([]);
    const myFollowId = common_vendor.ref({});
    common_vendor.onLoad(async (e) => {
      if (e.myFollowId) {
        navIndex.value = 1;
        myFollowId.value = e.myFollowId;
      }
      await loadData();
      ifLoad.value = true;
    });
    common_vendor.onPullDownRefresh(() => {
      reset();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      loadData();
    });
    function reset() {
      index1data.value = [];
      index2data.value = [];
      havefollow.value = [];
      loadData();
    }
    function check(id) {
      if (havefollow.value.includes(id)) {
        return true;
      }
      return false;
    }
    function gotoUser(id) {
      common_vendor.index.navigateTo({
        url: `/pages/my/myDetail?userId=${id}`
      });
    }
    async function loadData() {
      Pageloading.value = "loading";
      try {
        const temp1 = db.collection("jimoty-follow").where({ follow_uid: uid }).getTemp();
        const temp2 = db.collection("uni-id-users").field("_id,nickname,avatar_file.url").getTemp();
        const res = await db.collection(temp1, temp2).orderBy("create_date desc").skip(index1data.value.length).limit(
          10
        ).get();
        index1data.value = [...index1data.value, ...res.result.data];
        await checkIfMutualFollow();
        const temp3 = db.collection("jimoty-follow").where({
          friend_uid: uid
        }).getTemp();
        const temp4 = db.collection("uni-id-users").field("_id,nickname,avatar_file.url").getTemp();
        const res2 = await db.collection(temp3, temp4).orderBy("create_date desc").skip(index2data.value.length).limit(
          10
        ).get();
        index2data.value = [...index2data.value, ...res2.result.data];
        if (myFollowId.value !== "") {
          index2data.value = findAndMoveToFront(index2data.value, myFollowId.value);
        }
        console.log("###", index2data.value);
        Pageloading.value = "noMore";
      } catch (e) {
        Pageloading.value = "noMore";
      }
    }
    function changeNav(index) {
      navIndex.value = index;
    }
    function findAndMoveToFront(arr, targetId) {
      let foundIndex = -1;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].follow_uid && arr[i].follow_uid[0]._id === targetId) {
          foundIndex = i;
          break;
        }
      }
      if (foundIndex !== -1) {
        const foundObj = arr.splice(foundIndex, 1)[0];
        arr.unshift(foundObj);
      }
      return arr;
    }
    async function checkIfMutualFollow() {
      let followArr = index1data.value.map((item) => {
        return item.friend_uid[0]._id;
      });
      let havefollowArr = await db.collection("jimoty-follow").where({
        follow_uid: dbcmd.in(followArr),
        friend_uid: uid
      }).get();
      index1data.value.forEach((item) => {
        let localIndex = havefollowArr.result.data.findIndex((find) => {
          return item.friend_uid[0]._id == find.follow_uid;
        });
        if (localIndex !== -1) {
          item.isfollow = true;
          havefollow.value.push(item.friend_uid[0]._id);
        }
      });
    }
    function cancleFD(userId, index) {
      common_vendor.index.showModal({
        content: "是否取消关注",
        success: async function(res) {
          if (res.confirm) {
            index1data.value.splice(index, 1);
            let find = havefollow.value.findIndex((item) => item == userId);
            if (find != -1) {
              console.log(find, "移除", havefollow.value, "%%%", userId);
              havefollow.value.splice(find, 1);
            }
            await db.collection("jimoty-follow").where({
              friend_uid: userId,
              follow_uid: uid
            }).remove();
            utils_noticeOperate.removeNotice(uid, userId, 2, "互相关注");
          } else if (res.cancel)
            ;
        }
      });
    }
    async function withFD(followUid, index) {
      if (havefollow.value.includes(followUid)) {
        common_vendor.index.showModal({
          content: "是否取消关注",
          success: async function(res) {
            if (res.confirm) {
              let find = havefollow.value.findIndex((item) => item == followUid);
              if (find != -1) {
                console.log("移除");
                havefollow.value.splice(find, 1);
              }
              await db.collection("jimoty-follow").where({
                friend_uid: followUid,
                follow_uid: uid
              }).remove();
              utils_noticeOperate.removeNotice(uid, followUid, 2, "互相关注");
              reset();
            } else if (res.cancel)
              ;
          }
        });
      } else {
        await db.collection("jimoty-follow").add({
          friend_uid: followUid
        }).then(async (res) => {
          havefollow.value.push(followUid);
          utils_noticeOperate.makeNotice(uid, followUid, 2, "互相关注");
          console.log("&&&&", havefollow.value);
        });
        common_vendor.index.showToast({
          title: "已关注",
          icon: "none"
        });
        reset();
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.n(navIndex.value == 0 ? "active" : ""),
        b: common_vendor.o(($event) => changeNav(0)),
        c: common_vendor.n(navIndex.value == 1 ? "active" : ""),
        d: common_vendor.o(($event) => changeNav(1)),
        e: ifLoad.value
      }, ifLoad.value ? common_vendor.e({
        f: navIndex.value == 0
      }, navIndex.value == 0 ? {
        g: common_vendor.f(index1data.value, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => gotoUser(item.friend_uid[0]._id), index),
            b: item.friend_uid && item.friend_uid[0].avatar_file ? item.friend_uid[0].avatar_file.url : defalutImage,
            c: common_vendor.t(item.friend_uid && item.friend_uid[0] ? item.friend_uid[0].nickname : "未知用户"),
            d: common_vendor.t(item.isfollow ? "已互相关注" : "取消关注"),
            e: common_vendor.n(item.isfollow ? "other" : ""),
            f: common_vendor.o(($event) => cancleFD(item.friend_uid[0]._id, index), index),
            g: index
          };
        })
      } : {
        h: common_vendor.f(index2data.value, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => gotoUser(item.follow_uid[0]._id), index),
            b: item.follow_uid && item.follow_uid[0].avatar_file ? item.follow_uid[0].avatar_file.url : defalutImage,
            c: common_vendor.t(item.follow_uid && item.follow_uid[0] ? item.follow_uid[0].nickname : "未知用户"),
            d: common_vendor.t(check(item.follow_uid[0]._id) ? "已互相关注" : "点击互关"),
            e: common_vendor.n(check(item.follow_uid[0]._id) ? "other" : ""),
            f: common_vendor.o(($event) => withFD(item.follow_uid[0]._id), index),
            g: index
          };
        })
      }) : {}, {
        i: common_vendor.p({
          status: Pageloading.value
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
