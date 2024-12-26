"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_noticeOperate = require("../../utils/noticeOperate.js");
if (!Array) {
  const _easycom_uni_rate2 = common_vendor.resolveComponent("uni-rate");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_homeGoods2 = common_vendor.resolveComponent("homeGoods");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_rate2 + _easycom_uni_icons2 + _easycom_homeGoods2 + _easycom_uni_load_more2)();
}
const _easycom_uni_rate = () => "../../uni_modules/uni-rate/components/uni-rate/uni-rate.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_homeGoods = () => "../../components/homeGoods/homeGoods.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_rate + _easycom_uni_icons + _easycom_homeGoods + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "myDetail",
  setup(__props) {
    const SendMs = common_vendor.Zs.importObject("jimoty-sendMessage", { customUI: true });
    const db = common_vendor.Zs.database();
    const dbCmd = db.command;
    const userID = common_vendor.ref("");
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    common_vendor.onUnmounted(() => {
      common_vendor.wx$1.offCopyUrl();
    });
    const Pageloading = common_vendor.ref("loading");
    common_vendor.onLoad(async (e) => {
      userID.value = e.userId;
      common_vendor.wx$1.onCopyUrl(() => {
        return { query: `userId=${userID.value}` };
      });
      if (userID.value != "") {
        if (userID.value != uid) {
          const follow = await db.collection("jimoty-follow").where({
            friend_uid: userID.value,
            follow_uid: uid
          }).count();
          if (follow.result.total > 0) {
            ifFollow.value = true;
          }
        }
        openshare();
        getUserData();
        loadData();
      } else {
        common_vendor.index.showToast({
          title: "该用户不存在",
          icon: "none"
        });
      }
    });
    common_vendor.onPullDownRefresh(async () => {
      console.log("刷新");
      postData.value = [];
      await loadData();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      loadData();
    });
    const userData = common_vendor.ref({});
    const postData = common_vendor.ref([]);
    const guanzhu = common_vendor.ref(0);
    const fengsi = common_vendor.ref(0);
    const yishou = common_vendor.ref(0);
    const ifFollow = common_vendor.ref(false);
    async function getUserData() {
      const res = await db.collection("uni-id-users").doc(userID.value).field(
        "avatar_file.url,nickname,describe,xiScore"
      ).get({ getOne: true });
      userData.value = res.result.data;
      getScore(res.result.data.xiScore);
      const count = await db.collection("jimoty-follow").where({ friend_uid: userID.value }).count();
      const count2 = await db.collection("jimoty-follow").where({ follow_uid: userID.value }).count();
      fengsi.value = count.result.total;
      guanzhu.value = count2.result.total;
      const count3 = await db.collection("jimoty-post").where({ userId: userID.value, status: 4 }).count();
      yishou.value = count3.result.total;
    }
    async function loadData() {
      Pageloading.value = "loading";
      const temp1 = db.collection("jimoty-post").where({ userId: userID.value, delete: 1, status: dbCmd.in([2, 4]) }).getTemp();
      const temp2 = db.collection("jimoty-collect").field("_id,post_id,user_id,clickTime").getTemp();
      const temp3 = db.collection("jimoty-category").field("_id,name,parent_id").getTemp();
      const res = await db.collection(temp1, temp2, temp3).where("delete == 1").orderBy(
        "create_date desc,weight desc,update_time desc,browse desc"
      ).skip(postData.value.length).limit(10).get();
      handleSuccess(res.result.data);
    }
    async function handleSuccess(e) {
      postData.value = [...postData.value, ...e];
      let collectArr = postData.value.map((item) => {
        return item._id._value;
      });
      let likeArr = await db.collection("jimoty-collect").where({
        post_id: dbCmd.in(collectArr),
        user_id: uid
      }).get();
      postData.value.forEach((item, index) => {
        let localIndex = likeArr.result.data.findIndex((find) => {
          return item._id._value == find.post_id;
        });
        if (localIndex !== -1) {
          item.isCollect = true;
        }
      });
      console.log("@#@@@@", postData.value);
      Pageloading.value = "noMore";
    }
    const goeditor = () => {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/userinfo/userinfo"
      });
    };
    const userScore = common_vendor.ref(3);
    function getScore(score) {
      if (score <= 20) {
        userScore.value = 1;
      } else if (score <= 40) {
        userScore.value = 2;
      } else if (score <= 60) {
        userScore.value = 3;
      } else if (score <= 80) {
        userScore.value = 4;
      } else if (80 < score) {
        userScore.value = 5;
      }
    }
    const attention = () => {
      if (ifFollow.value) {
        common_vendor.index.showModal({
          content: "是否取消关注",
          success: function(res) {
            if (res.confirm) {
              console.log("用户点击确定");
              ifFollow.value = false;
              db.collection("jimoty-follow").where({
                friend_uid: userID.value,
                follow_uid: uid
              }).remove();
              utils_noticeOperate.removeNotice(uid, userID.value, 2, "关注");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else {
        db.collection("jimoty-follow").add({
          friend_uid: userID.value
        }).then((res) => {
          utils_noticeOperate.makeNotice(uid, userID.value, 2, "关注");
          SendMs.sendMessage1(userID.value, "有人关注了你");
        });
        common_vendor.index.showToast({
          title: "感谢您的关注",
          icon: "none"
        });
        ifFollow.value = true;
      }
    };
    function gotoComent() {
      common_vendor.index.navigateTo({
        url: `/pages/my/comment?userId=${userID.value}`
      });
    }
    function openshare() {
      common_vendor.wx$1.showShareMenu({
        menus: ["shareAppMessage", "shareTimeline"],
        title: userData.value.nickname,
        path: `/pages/my/myDetail?userId=${userID.value}`,
        success() {
          console.log("成功");
        },
        fail() {
          common_vendor.index.showToast({
            title: "转发失败",
            icon: "none"
          });
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userData.value.avatar_file && userData.value.avatar_file.url ? userData.value.avatar_file.url : "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png",
        b: common_vendor.t(userData.value.nickname),
        c: common_vendor.unref(uid) != userID.value
      }, common_vendor.unref(uid) != userID.value ? {
        d: common_vendor.t(ifFollow.value ? "已关注" : "关注"),
        e: common_vendor.o(attention),
        f: common_vendor.n(ifFollow.value ? "active" : "")
      } : {}, {
        g: common_vendor.t(guanzhu.value),
        h: common_vendor.t(fengsi.value),
        i: common_vendor.t(yishou.value),
        j: userID.value === common_vendor.unref(uid)
      }, userID.value === common_vendor.unref(uid) ? {
        k: common_vendor.o(goeditor)
      } : {}, {
        l: common_vendor.t(userData.value.describe ? userData.value.describe : "这个家伙很神秘，没有个人简介"),
        m: common_vendor.p({
          readonly: true,
          touchable: false,
          value: userScore.value
        }),
        n: common_vendor.p({
          type: "right",
          size: "16"
        }),
        o: common_vendor.o(gotoComent),
        p: common_vendor.t(postData.value.length),
        q: common_vendor.p({
          data: postData.value
        }),
        r: common_vendor.p({
          status: Pageloading.value
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
