"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_noticeOperate = require("../../utils/noticeOperate.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_rate2 = common_vendor.resolveComponent("uni-rate");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_dateformat2 + _easycom_uni_rate2 + _easycom_uni_easyinput2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_rate = () => "../../uni_modules/uni-rate/components/uni-rate/uni-rate.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_dateformat + _easycom_uni_rate + _easycom_uni_easyinput + _easycom_uni_popup + detailSkeleton)();
}
const detailSkeleton = () => "./skeleton/detailSkeleton.js";
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const secCheckObj = common_vendor.Zs.importObject("secCheckContent", { customUI: true });
    const SendMs = common_vendor.Zs.importObject("jimoty-sendMessage", { customUI: true });
    let db = common_vendor.Zs.database();
    const loading = common_vendor.ref(true);
    const indicatorDots = common_vendor.ref(true);
    const autoplay = common_vendor.ref(true);
    const interval = common_vendor.ref(2e3);
    const duration = common_vendor.ref(1e3);
    let uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const userId = common_vendor.ref("");
    const userAllData = common_vendor.ref([]);
    const postId = common_vendor.ref("");
    const postType = common_vendor.ref(-1);
    const pageData = common_vendor.ref([]);
    const popup = common_vendor.ref(null);
    const commentIndex = common_vendor.ref(0);
    const commentText = common_vendor.ref("");
    function AddHistoryBrowse() {
      if (uid != userId.value) {
        if (common_vendor.index.getStorageSync("history-browse")) {
          let broseArr = common_vendor.index.getStorageSync("history-browse");
          if (broseArr.includes(postId.value)) {
            return;
          } else {
            broseArr.unshift(postId.value);
            broseArr.splice(30);
            common_vendor.index.setStorageSync("history-browse", broseArr);
          }
        } else {
          common_vendor.index.setStorageSync("history-browse", [postId.value]);
        }
      }
    }
    const isNotLogin = common_vendor.ref(true);
    common_vendor.onShow(() => {
      let token = common_vendor.index.getStorageSync("uni_id_token");
      if (!token) {
        isNotLogin.value = false;
      }
    });
    common_vendor.onLoad(async (e) => {
      postId.value = e.postId;
      common_vendor.wx$1.onCopyUrl(() => {
        return { query: `postId=${postId.value}` };
      });
      if (postId.value != "") {
        await loadData();
        AddHistoryBrowse();
        if (uid != userId.value) {
          browseAdd(postId.value, 1);
        }
      } else {
        common_vendor.index.showToast({
          title: "该帖子已下架",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 800);
      }
    });
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
    common_vendor.onUnmounted(() => {
      common_vendor.wx$1.offCopyUrl();
    });
    async function loadData() {
      const temp1 = db.collection("jimoty-post").where(`_id=="${postId.value}"`).getTemp();
      const temp2 = db.collection("uni-id-users").field("_id,nickname,avatar_file.url,xiScore").getTemp();
      const temp3 = db.collection("jimoty-collect").field("_id,post_id,user_id,clickTime").getTemp();
      const temp4 = db.collection("jimoty-category").field("_id,name,parent_id").getTemp();
      let res = await db.collection(temp1, temp2, temp3, temp4).get({ getOne: true });
      if (res.result.data) {
        postType.value = res.result.data.type;
        userId.value = res.result.data.userId[0]._id;
        pageData.value = res.result.data;
        getScore(res.result.data.userId[0].xiScore);
        await handleSuccess();
        db.collection("jimoty-post").where({
          userId: userId.value,
          status: db.command.in([2, 5]),
          delete: 1
        }).get().then(
          (res2) => {
            userAllData.value = res2.result.data;
          }
        );
        loading.value = false;
        openshare();
      } else {
        common_vendor.index.showToast({
          title: "该帖子不存在",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 800);
      }
    }
    const handleSuccess = async () => {
      let count = await db.collection("jimoty-collect").where({
        post_id: postId.value,
        user_id: uid
      }).count();
      console.log("count", count);
      if (count.result.total > 0) {
        pageData.value.isCollect = true;
      }
      const follow = await db.collection("jimoty-follow").where({
        friend_uid: userId.value,
        follow_uid: uid
      }).count();
      if (follow.result.total > 0) {
        pageData.value.ifFollow = true;
      }
    };
    const attention = () => {
      if (pageData.value.ifFollow) {
        common_vendor.index.showModal({
          content: "是否取消关注",
          success: function(res) {
            if (res.confirm) {
              console.log("用户点击确定");
              pageData.value.ifFollow = false;
              db.collection("jimoty-follow").where({
                friend_uid: userId.value,
                follow_uid: uid
              }).remove();
              utils_noticeOperate.removeNotice(uid, userId.value, 2, "关注");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else {
        db.collection("jimoty-follow").add({
          friend_uid: userId.value
        }).then((res) => {
          utils_noticeOperate.makeNotice(uid, userId.value, 2, "关注");
          SendMs.sendMessage1(userId.value, "有人关注了你");
        });
        common_vendor.index.showToast({
          title: "感谢您的关注",
          icon: "none"
        });
        pageData.value.ifFollow = true;
      }
    };
    const previewImage = (index) => {
      common_vendor.index.previewImage({
        current: index,
        urls: pageData.value.photos,
        longPressActions: {
          itemList: ["发送给朋友", "保存图片", "收藏"],
          success: function(data) {
            console.log("选中了第" + (data.tapIndex + 1) + "个按钮,第" + (data.index + 1) + "张图片");
          },
          fail: function(err) {
            console.log(err.errMsg);
          }
        }
      });
    };
    const Inoperation1 = common_vendor.ref(false);
    async function collect() {
      if (!uid) {
        common_vendor.index.navigateTo({
          url: "uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        });
        return;
      }
      if (Inoperation1.value)
        return;
      Inoperation1.value = true;
      if (pageData.value.isCollect) {
        pageData.value.isCollect = !pageData.value.isCollect;
        db.collection("jimoty-collect").where(`post_id=="${postId.value}" && user_id==$cloudEnv_uid`).remove();
        pageData.value.collect--;
        collectAdd(postId.value, -1);
        utils_noticeOperate.removeNotice(uid, userId.value, 4, postId.value);
      } else {
        db.collection("jimoty-collect").add({
          post_id: postId.value
        }).then((res) => {
          if (uid != userId.value) {
            utils_noticeOperate.makeNotice(uid, userId.value, 4, postId.value, pageData.value.mainText);
            SendMs.sendMessage1(userId.value, `有人收藏了你的帖子(${pageData.value.noteTitle})`);
          }
        });
        pageData.value.collect++;
        pageData.value.isCollect = !pageData.value.isCollect;
        collectAdd(postId.value, 1);
      }
      common_vendor.index.$emit("refashHome", { msg: "详情页操作", post_id: postId.value });
      Inoperation1.value = false;
    }
    const collectAdd = async (postId2, num) => {
      const data = await db.collection("jimoty-post").where(`_id=="${postId2}"`).field("collect").get({ getOne: true });
      let thislike = data.result.data.collect + num;
      await db.collection("jimoty-post").where(`_id=="${postId2}"`).update({ collect: thislike });
    };
    function browseAdd(postId2, num) {
      db.collection("jimoty-post").where(`_id=="${postId2}"`).field("browse").get({ getOne: true }).then((data) => {
        if (data.result.data) {
          let thislike = data.result.data.browse + num;
          db.collection("jimoty-post").where(`_id=="${postId2}"`).update({ browse: thislike });
        }
      });
    }
    function gotoChat() {
      common_vendor.index.navigateTo({
        url: `/pages/message/chatPage?friendId=${userId.value}&postId=${postId.value}`
      });
    }
    function gotoDetail(postId2) {
      common_vendor.index.navigateTo({
        url: `/pages/home/detail?postId=${postId2}`
      });
    }
    function chooseType(index) {
      commentIndex.value = index;
    }
    async function sendComent() {
      if (commentText.value == "") {
        common_vendor.index.showToast({
          title: "请输入评价",
          icon: "none"
        });
      } else {
        try {
          common_vendor.index.showLoading({
            mask: true,
            title: "发送中"
          });
          let sec = await secCheckObj.textSecCheck({ content: commentText.value });
          if (sec.errCode != 0) {
            common_vendor.index.showModal({
              title: sec.errMsg,
              content: `输入的内容违规，涉及“${sec.result.label}”，请重新编辑！`,
              showCancel: false
            });
            commentText.value = "";
            common_vendor.index.hideLoading();
            return;
          }
          db.collection("jimoty-comment").add({
            re_user_id: userId.value,
            post_id: postId.value,
            type: commentIndex.value,
            content: commentText.value
          }).then((res) => {
            utils_noticeOperate.makeNotice(uid, userId.value, 3, res.result.id, pageData.value.mainText);
          });
          changeScore(commentIndex.value);
          common_vendor.index.hideLoading();
          commentText.value == "";
          popup.value.close();
          common_vendor.index.showToast({
            title: "评价成功",
            icon: "none"
          });
        } catch (e) {
          console.log(e);
          commentText.value == "";
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "发送失败",
            icon: "none"
          });
          popup.value.close();
        }
      }
    }
    async function changeScore(type) {
      const res = await db.collection("uni-id-users").doc(userId.value).field("xiScore").get({ getOne: true });
      let score = res.result.data.xiScore;
      if (type == 0) {
        score += 5;
      } else if (type == 1) {
        score += 2;
      } else if (type == 2) {
        score -= 5;
      }
      db.collection("uni-id-users").doc(userId.value).update({ xiScore: score });
    }
    async function editPost() {
      const res = await db.collection("jimoty-post").doc(postId.value).field("type").get({ getOne: true });
      console.log(res.result.data);
      switch (res.result.data.type) {
        case 1:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage1?postId=${postId.value}`
          });
          break;
        case 2:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage2?postId=${postId.value}`
          });
          break;
        case 3:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage3?postId=${postId.value}`
          });
          break;
        case 4:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage4?postId=${postId.value}`
          });
          break;
        case 5:
          common_vendor.index.navigateTo({
            url: `/pages/submit/resubmit/detailpage5?postId=${postId.value}`
          });
          break;
      }
    }
    function cancelPost() {
      common_vendor.index.showModal({
        content: "是否确认删除",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            common_vendor.Zs.callFunction({
              name: "jimoty-cancle-post",
              data: {
                postId: postId.value,
                bool: true
              }
            }).then((res2) => {
              common_vendor.index.showToast({
                title: res2.result.msg,
                icon: "none"
              });
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 500);
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
    const toMyDetail = () => {
      common_vendor.index.navigateTo({
        url: `/pages/my/myDetail?userId=${userId.value}`
      });
    };
    function openshare() {
      common_vendor.wx$1.showShareMenu({
        menus: ["shareAppMessage", "shareTimeline"],
        title: pageData.value.noteTitle,
        path: `/pages/home/detail?postId=${pageData.value._id}`,
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
        a: !loading.value
      }, !loading.value ? common_vendor.e({
        b: common_vendor.f(pageData.value.photos, (item, index, i0) => {
          return {
            a: item,
            b: common_vendor.o(($event) => previewImage(index), index),
            c: index
          };
        }),
        c: indicatorDots.value,
        d: autoplay.value,
        e: interval.value,
        f: duration.value,
        g: !pageData.value.isCollect
      }, !pageData.value.isCollect ? {
        h: common_vendor.p({
          type: "star",
          color: "#fff",
          size: "26"
        })
      } : {
        i: common_vendor.p({
          type: "star-filled",
          size: "26"
        })
      }, {
        j: !pageData.value.isCollect
      }, !pageData.value.isCollect ? {
        k: common_vendor.t(pageData.value.collect)
      } : {
        l: common_vendor.t(pageData.value.collect)
      }, {
        m: common_vendor.o(collect),
        n: common_vendor.t(pageData.value.noteTitle),
        o: common_vendor.t(pageData.value.userId ? pageData.value.userId[0].nickname : "未知用户"),
        p: common_vendor.p({
          date: pageData.value.create_date,
          threshold: [0, 0],
          format: "yyyy年MM月dd日"
        }),
        q: common_vendor.t(pageData.value.mainText),
        r: pageData.value.location && pageData.value.location.address
      }, pageData.value.location && pageData.value.location.address ? {
        s: common_vendor.t(pageData.value.location.address)
      } : {}, {
        t: pageData.value.workTime
      }, pageData.value.workTime ? {
        v: common_vendor.t(pageData.value.workTime)
      } : {}, {
        w: pageData.value.category && pageData.value.category[0] && pageData.value.category[0].name
      }, pageData.value.category && pageData.value.category[0] && pageData.value.category[0].name ? {
        x: common_vendor.t(pageData.value.category[0].name)
      } : {}, {
        y: pageData.value.companyName
      }, pageData.value.companyName ? {
        z: common_vendor.t(pageData.value.companyName)
      } : {}, {
        A: pageData.value.payrollForm
      }, pageData.value.payrollForm ? {
        B: common_vendor.t(pageData.value.payrollForm)
      } : {}, {
        C: pageData.value.salary
      }, pageData.value.salary ? {
        D: common_vendor.t(pageData.value.salary)
      } : {}, {
        E: pageData.value.salarySupplement
      }, pageData.value.salarySupplement ? {
        F: common_vendor.t(pageData.value.salarySupplement)
      } : {}, {
        G: pageData.value.traffic
      }, pageData.value.traffic ? {
        H: common_vendor.t(pageData.value.traffic)
      } : {}, {
        I: pageData.value.phone
      }, pageData.value.phone ? {
        J: common_vendor.t(pageData.value.phone)
      } : {}, {
        K: pageData.value.employeeForm
      }, pageData.value.employeeForm ? {
        L: common_vendor.t(pageData.value.employeeForm)
      } : {}, {
        M: pageData.value.sex
      }, pageData.value.sex ? {
        N: common_vendor.t(pageData.value.sex)
      } : {}, {
        O: pageData.value.recruitAge
      }, pageData.value.recruitAge ? {
        P: common_vendor.t(pageData.value.recruitAge)
      } : {}, {
        Q: pageData.value.age
      }, pageData.value.age ? {
        R: common_vendor.t(pageData.value.age)
      } : {}, {
        S: pageData.value.sterOperation
      }, pageData.value.sterOperation ? {
        T: common_vendor.t(pageData.value.sterOperation)
      } : {}, {
        U: pageData.value.vaccinelnoculation
      }, pageData.value.vaccinelnoculation ? {
        V: common_vendor.t(pageData.value.vaccinelnoculation)
      } : {}, {
        W: pageData.value.releaseReason
      }, pageData.value.releaseReason ? {
        X: common_vendor.t(pageData.value.releaseReason)
      } : {}, {
        Y: pageData.value.postPrice
      }, pageData.value.postPrice ? {
        Z: common_vendor.t(pageData.value.postPrice)
      } : {}, {
        aa: pageData.value.userId && pageData.value.userId[0] ? pageData.value.userId[0].avatar_file.url : "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png",
        ab: common_vendor.o(toMyDetail),
        ac: common_vendor.t(pageData.value.userId && pageData.value.userId[0] ? pageData.value.userId[0].nickname : "未知用户"),
        ad: common_vendor.t(userAllData.value.length),
        ae: common_vendor.p({
          readonly: true,
          touchable: false,
          value: userScore.value
        }),
        af: common_vendor.unref(uid) != userId.value
      }, common_vendor.unref(uid) != userId.value ? {
        ag: common_vendor.t(pageData.value.ifFollow ? "已关注" : "关注"),
        ah: common_vendor.o(attention),
        ai: common_vendor.n(pageData.value.ifFollow ? "active" : "")
      } : {}, {
        aj: userAllData.value.length > 0
      }, userAllData.value.length > 0 ? {
        ak: common_vendor.f(userAllData.value, (item, index, i0) => {
          return {
            a: item.photos[0],
            b: common_vendor.t(item.noteTitle),
            c: index,
            d: common_vendor.o(($event) => gotoDetail(item._id), index)
          };
        })
      } : {}, {
        al: common_vendor.unref(uid) && common_vendor.unref(uid) == userId.value
      }, common_vendor.unref(uid) && common_vendor.unref(uid) == userId.value ? {
        am: common_vendor.o(editPost),
        an: common_vendor.o(cancelPost)
      } : {
        ao: common_vendor.p({
          type: "email",
          color: "#fff",
          size: "24"
        }),
        ap: common_vendor.o(gotoChat)
      }, {
        aq: common_vendor.o(($event) => chooseType(0)),
        ar: common_vendor.n(commentIndex.value == 0 ? "comentActive" : ""),
        as: common_vendor.o(($event) => chooseType(1)),
        at: common_vendor.n(commentIndex.value == 1 ? "comentActive" : ""),
        av: common_vendor.o(($event) => chooseType(2)),
        aw: common_vendor.n(commentIndex.value == 2 ? "comentActive" : ""),
        ax: common_vendor.o(sendComent),
        ay: common_vendor.o(sendComent),
        az: common_vendor.o(($event) => commentText.value = $event),
        aA: common_vendor.p({
          trim: "all",
          suffixIcon: "paperplane",
          placeholder: "请输入评论",
          modelValue: commentText.value
        }),
        aB: common_vendor.sr(popup, "431a10b7-5", {
          "k": "popup"
        }),
        aC: common_vendor.p({
          type: "bottom",
          ["border-radius"]: "10px 10px 0 0",
          ["background-color"]: "#fff"
        })
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-431a10b7"]]);
wx.createPage(MiniProgramPage);
