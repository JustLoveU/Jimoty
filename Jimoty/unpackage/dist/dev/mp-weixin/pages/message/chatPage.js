"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_noticeOperate = require("../../utils/noticeOperate.js");
const utils_addXiSocre = require("../../utils/addXiSocre.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_easyinput2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_easyinput + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "chatPage",
  setup(__props) {
    const SendMs = common_vendor.Zs.importObject("jimoty-sendMessage", { customUI: true });
    common_vendor.index.getSystemInfoSync();
    common_vendor.index.getSystemInfoSync();
    common_vendor.ref(null);
    let db = common_vendor.Zs.database();
    let dbP = common_vendor.Zs.databaseForJQL();
    let uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const postId = common_vendor.ref("");
    const friendId = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const postUserId = common_vendor.ref("");
    const myUserData = common_vendor.ref([]);
    const otherUserData = common_vendor.ref([]);
    const ifSendMessage = common_vendor.ref(true);
    const secCheckObj = common_vendor.Zs.importObject("secCheckContent", { customUI: true });
    common_vendor.ref("");
    const dialogData = common_vendor.ref([]);
    const postData = common_vendor.ref({});
    const chatId = common_vendor.ref("");
    common_vendor.onMounted(async () => {
      db.collection("uni-id-users").doc(uid).field("_id,nickname,avatar_file.url").get().then((res) => {
        myUserData.value = res.result.data;
      });
    });
    const stepId = common_vendor.ref(0);
    const ifSendOne = common_vendor.ref(false);
    common_vendor.onLoad(async (e) => {
      console.log(e);
      if (e.chatId && e.chatId != null) {
        chatId.value = e.chatId;
        const chatData = await db.collection("jimoty-chat").doc(chatId.value).get({ getOne: true });
        postId.value = chatData.result.data.postId;
        friendId.value = chatData.result.data.friendId;
        userId.value = chatData.result.data.userId;
        stepId.value = chatData.result.data.step;
      } else {
        friendId.value = e.friendId;
        postId.value = e.postId;
        const res = await db.collection("jimoty-chat").where({
          userId: uid,
          friendId: e.friendId,
          postId: e.postId
        }).get();
        if (res.result.data.length > 0) {
          console.log(" 判断从详情页进入,聊天框存在", res.result.data);
          chatId.value = res.result.data[0]._id;
          userId.value = res.result.data[0].userId;
          stepId.value = res.result.data[0].step;
        } else {
          console.log(" 判断从详情页进入,聊天框不存在", res.result.data);
          ifSendOne.value = true;
        }
      }
      getPostData();
      if (ifSendOne.value)
        return;
      await getData();
      uptoBottom();
      timer = setInterval(async () => {
        console.log("刷新");
        await getData();
      }, 2e3);
    });
    async function createMessageBox() {
      const res = await db.collection("jimoty-chat").add({
        userId: uid,
        friendId: friendId.value,
        postId: postId.value
      });
      chatId.value = res.result.id;
      ifSendOne.value = false;
      timer = setInterval(async () => {
        getData();
      }, 2e3);
    }
    async function getPostData() {
      const temp1 = db.collection("jimoty-post").where(`_id=="${postId.value}"`).field(
        "_id,userId,type,photos,location,noteTitle,mainText,postPrice,status,delete,collect,create_date,employeeForm,category"
      ).getTemp();
      const temp2 = db.collection("uni-id-users").field("_id,nickname,avatar_file.url").getTemp();
      const temp3 = db.collection("jimoty-category").field("_id,name,parent_id").getTemp();
      let pageData = await db.collection(temp1, temp2, temp3).get({ getOne: true });
      if (!pageData.result.data) {
        console.log("商品不存在");
        ifSendMessage.value = false;
      } else {
        postData.value = pageData.result.data;
        postUserId.value = postData.value.userId[0]._id;
        db.collection("uni-id-users").doc(friendId.value == uid ? userId.value : friendId.value).field(
          "_id,nickname,avatar_file.url"
        ).get().then((res) => {
          otherUserData.value = res.result.data;
          common_vendor.index.setNavigationBarTitle({
            title: otherUserData.value && otherUserData.value[0].nickname ? otherUserData.value[0].nickname : "未知用户"
          });
        });
      }
    }
    async function getData() {
      const temp1 = await db.collection("jimoty-chat-message").where({ chatBoxId: chatId.value }).getTemp();
      const temp2 = db.collection("uni-id-users").field("_id,nickname,avatar_file.url").getTemp();
      const res = await db.collection(temp1, temp2).orderBy("create_date desc").get();
      if (dialogData.value.length != res.result.data.length) {
        imgarr.value = [];
        res.result.data.forEach((item) => {
          if (item.type == 1) {
            imgarr.value.push(item.message);
          }
        });
      }
      const resData = await db.collection("jimoty-chat").doc(chatId.value).field("step").get({ getOne: true });
      stepId.value = resData.result.data.step;
      if (res.result.data.length > dialogData.value.length) {
        uptoBottom();
      }
      dialogData.value = reconstructArray(res.result.data);
      dbP.collection("jimoty-chat-message").where({ chatBoxId: chatId.value, friendId: uid }).update({ status: true });
      dbP.collection("jimoty-notice").where({ message: postId.value, receive: uid }).update({ status: true });
    }
    function reconstructArray(timestamps) {
      timestamps.sort((a2, b) => a2.time - b.time);
      let newArr = [];
      let a = timestamps[0].time;
      for (let i = 0; i < timestamps.length; i++) {
        if (timestamps[i].time > a + 6e5) {
          a = timestamps[i].time;
          newArr.push(timestamps[i]);
        } else {
          newArr.push({
            chatBoxId: timestamps[i].chatBoxId,
            delete: timestamps[i].delete,
            friendId: timestamps[i].friendId,
            message: timestamps[i].message,
            status: timestamps[i].status,
            type: timestamps[i].type,
            userId: timestamps[i].userId,
            _id: timestamps[i]._id,
            time: ""
          });
        }
      }
      return newArr;
    }
    let timer = null;
    common_vendor.onUnmounted(() => {
      clearInterval(timer);
      timer = null;
    });
    common_vendor.onHide(() => {
      clearInterval(timer);
      timer = null;
    });
    function scrolltoupper(e) {
    }
    const imgarr = common_vendor.ref([]);
    const previewImage = (image) => {
      let index = 0;
      for (let i = 0; i < imgarr.value.length; i++) {
        if (imgarr.value[i] == image)
          index = i;
      }
      common_vendor.index.previewImage({
        current: index,
        urls: imgarr.value,
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
    const sendText = common_vendor.ref("");
    const ifOperate = common_vendor.ref(false);
    async function sendMessage() {
      if (!ifSendMessage.value)
        return;
      if (ifOperate.value)
        return;
      ifOperate.value = true;
      console.log(sendText.value);
      if (sendText.value == "") {
        common_vendor.index.showToast({
          title: "请输入消息",
          icon: "none"
        });
      } else {
        try {
          if (ifSendOne.value) {
            await createMessageBox();
          }
          common_vendor.index.showLoading({
            mask: true,
            title: "发送中"
          });
          let sec = await secCheckObj.textSecCheck({ content: sendText.value });
          if (sec.errCode != 0) {
            common_vendor.index.showModal({
              title: sec.errMsg,
              content: `输入的内容违规，涉及“${sec.result.label}”，请重新编辑！`,
              showCancel: false
            });
            sendText.value = "";
            common_vendor.index.hideLoading();
            ifOperate.value = false;
            return;
          } else {
            let data = {
              chatBoxId: chatId.value,
              userId: myUserData.value,
              friendId: friendId.value == uid ? userId.value : friendId.value,
              message: sendText.value,
              type: 0,
              status: false,
              time: Date.now()
            };
            dialogData.value.push(data);
            db.collection("jimoty-chat-message").add({
              chatBoxId: chatId.value,
              userId: uid,
              friendId: friendId.value == uid ? userId.value : friendId.value,
              message: sendText.value,
              type: 0
            }).then((res) => {
              db.collection("jimoty-chat").doc(chatId.value).update({
                update_date: Date.now(),
                delete: false
              });
              setTimeout(() => {
                db.collection("jimoty-chat-message").doc(res.result.id).get({ getOne: true }).then(async (item) => {
                  if (!item.result.data.status) {
                    utils_noticeOperate.makeNotice(uid, friendId.value == uid ? userId.value : friendId.value, 1, chatId.value, postData.value.noteTitle);
                    let UserName = myUserData.value[0].nickname + "给你发来了一条的消息";
                    await SendMs.sendMessage1(friendId.value == uid ? userId.value : friendId.value, UserName);
                  }
                });
              }, 6e3);
            });
            ifOperate.value = false;
            sendText.value = "";
            uptoBottom();
          }
        } catch (e) {
          console.log(e, "发送失败");
          sendText.value == "";
          ifOperate.value = false;
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "发送失败",
            icon: "none"
          });
        }
        sendText.value = "";
      }
      ifOperate.value = false;
      common_vendor.index.hideLoading();
    }
    async function sendPhoto(arr) {
      if (!ifSendMessage.value)
        return;
      console.log(arr);
      try {
        common_vendor.index.showLoading({
          mask: true,
          title: "发送中"
        });
        arr.forEach(async (image) => {
          await common_vendor.Zs.uploadFile({
            filePath: image,
            cloudPath: (/* @__PURE__ */ new Date()).getTime() + "" + Math.floor(1e4 + Math.random() * 9e4)
          }).then(async (res) => {
            if (ifSendOne.value) {
              await createMessageBox();
            }
            let data = {
              chatBoxId: chatId.value,
              userId: myUserData.value,
              friendId: friendId.value == uid ? userId.value : friendId.value,
              message: res.fileID,
              type: 1,
              status: false,
              time: Date.now()
            };
            dialogData.value.push(data);
            db.collection("jimoty-chat-message").add({
              chatBoxId: chatId.value,
              userId: uid,
              friendId: friendId.value == uid ? userId.value : friendId.value,
              message: res.fileID,
              type: 1
            }).then((res2) => {
              db.collection("jimoty-chat").doc(chatId.value).update({ update_date: Date.now(), delete: false });
              setTimeout(() => {
                db.collection("jimoty-chat-message").doc(res2.result.id).get({ getOne: true }).then(async (item) => {
                  if (!item.result.data.status) {
                    utils_noticeOperate.makeNotice(
                      uid,
                      friendId.value == uid ? userId.value : friendId.value,
                      1,
                      chatId.value,
                      postData.value.noteTitle
                    );
                    let UserName = myUserData.value[0].nickname + "给你发来了一条的消息";
                    await SendMs.sendMessage1(
                      friendId.value == uid ? userId.value : friendId.value,
                      UserName
                    );
                  }
                });
              }, 6e3);
            });
            uptoBottom();
            common_vendor.index.hideLoading();
          });
        });
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "发送失败",
          icon: "none"
        });
      }
      common_vendor.index.hideLoading();
    }
    function opencamera() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["camera"],
        success: function(res) {
          console.log(JSON.stringify(res.tempFilePaths));
          sendPhoto(res.tempFilePaths);
        }
      });
    }
    function openalbum() {
      common_vendor.index.chooseImage({
        count: 3,
        //默认3
        sizeType: ["compressed"],
        //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"],
        //从相册选择
        success: function(res) {
          sendPhoto(res.tempFilePaths);
        }
      });
    }
    function handleLongPress(item, index) {
      if (Date.now() - item.time > 1e3 * 60 * 2)
        return;
      if (item.userId[0]._id === uid) {
        console.log(item, "该聊天记录的id");
        common_vendor.index.showModal({
          content: "是否撤回",
          success: function(res) {
            if (res.confirm) {
              console.log("用户点击确定");
              dialogData.value.splice(index, 1);
              db.collection("jimoty-chat-message").doc(item._id).remove();
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      }
    }
    async function changeStep(index) {
      let message = "";
      if (index == 0) {
        const resData = await db.collection("jimoty-post").doc(postId.value).field("status").get({ getOne: true });
        if (resData.result.data.status == 5) {
          common_vendor.index.showToast({
            title: "当前有已经确认的用户",
            icon: "none"
          });
          return;
        }
        message = "已将您设置为买家";
        common_vendor.index.showModal({
          content: `是否${typeStatus.value[postData.value.type - 1].sell[0]}`,
          success: async function(res) {
            if (res.confirm) {
              stepId.value = 1;
              db.collection("jimoty-chat").doc(chatId.value).update({ step: 1 });
              db.collection("jimoty-post").doc(postId.value).update({ status: 5 });
              db.collection("jimoty-buy").add({
                buyId: friendId.value == uid ? userId.value : friendId.value,
                goodId: postId.value
              });
              if (message != "") {
                let data = {
                  chatBoxId: chatId.value,
                  userId: myUserData.value,
                  friendId: friendId.value == uid ? userId.value : friendId.value,
                  message,
                  type: 4,
                  status: true,
                  time: Date.now()
                };
                dialogData.value.push(data);
                db.collection("jimoty-chat-message").add({
                  chatBoxId: chatId.value,
                  userId: uid,
                  friendId: friendId.value == uid ? userId.value : friendId.value,
                  message,
                  type: 4,
                  status: true
                });
                uptoBottom();
                await SendMs.sendMessage5(
                  friendId.value == uid ? userId.value : friendId.value,
                  "你有交易状态发生变化"
                );
              }
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else if (index == 1) {
        message = "完成";
        common_vendor.index.showModal({
          content: typeStatus.value[postData.value.type - 1].sell[8],
          success: async function(res) {
            if (res.confirm) {
              const resData = await db.collection("jimoty-chat").doc(chatId.value).get({ getOne: true });
              if (resData.result.data.step != 1) {
                common_vendor.index.showToast({
                  title: "当前非协商状态",
                  icon: "none"
                });
                return;
              } else {
                stepId.value = 3;
                db.collection("jimoty-chat").doc(chatId.value).update({ step: 3 });
                db.collection("jimoty-post").doc(postId.value).update({ status: 4 });
                resetPost();
                if (message != "") {
                  let data = {
                    chatBoxId: chatId.value,
                    userId: myUserData.value,
                    friendId: friendId.value == uid ? userId.value : friendId.value,
                    message,
                    type: 4,
                    status: true,
                    time: Date.now()
                  };
                  dialogData.value.push(data);
                  db.collection("jimoty-chat-message").add({
                    chatBoxId: chatId.value,
                    userId: uid,
                    friendId: friendId.value == uid ? userId.value : friendId.value,
                    message,
                    type: 4,
                    status: true
                  });
                  uptoBottom();
                  await SendMs.sendMessage5(
                    friendId.value == uid ? userId.value : friendId.value,
                    "你有交易状态发生变化"
                  );
                }
              }
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else if (index == 2) {
        message = "交易取消";
        common_vendor.index.showModal({
          content: typeStatus.value[postData.value.type - 1].sell[10],
          success: async function(res) {
            if (res.confirm) {
              const resData = await db.collection("jimoty-chat").doc(chatId.value).get({ getOne: true });
              if (resData.result.data.step != 1) {
                common_vendor.index.showToast({
                  title: "取消失败",
                  icon: "none"
                });
                return;
              } else {
                stepId.value = 0;
                db.collection("jimoty-chat").doc(chatId.value).update({ step: 0 });
                db.collection("jimoty-post").doc(postId.value).update({ status: 2 });
                db.collection("jimoty-buy").where({
                  buyId: friendId.value == uid ? userId.value : friendId.value,
                  goodId: postId.value
                }).remove();
                if (message != "") {
                  let data = {
                    chatBoxId: chatId.value,
                    userId: myUserData.value,
                    friendId: friendId.value == uid ? userId.value : friendId.value,
                    message,
                    type: 4,
                    status: true,
                    time: Date.now()
                  };
                  dialogData.value.push(data);
                  db.collection("jimoty-chat-message").add({
                    chatBoxId: chatId.value,
                    userId: uid,
                    friendId: friendId.value == uid ? userId.value : friendId.value,
                    message,
                    type: 4,
                    status: true
                  });
                  await SendMs.sendMessage5(
                    friendId.value == uid ? userId.value : friendId.value,
                    "你有交易状态发生变化"
                  );
                }
                uptoBottom();
              }
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      }
    }
    function resetPost() {
      common_vendor.Zs.callFunction({
        name: "jimoty-cancle-post",
        data: {
          postId: postId.value,
          bool: false
        }
      });
    }
    function openComent() {
      if (stepId.value == 3) {
        popup.value.open();
      } else {
        common_vendor.index.showToast({
          title: "您已经评价过了",
          icon: "none"
        });
      }
    }
    const popup = common_vendor.ref(null);
    const commentIndex = common_vendor.ref(0);
    const commentText = common_vendor.ref("");
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
            re_user_id: postUserId.value,
            post_id: postId.value,
            type: commentIndex.value,
            content: commentText.value
          }).then((res) => {
            utils_noticeOperate.makeNotice(uid, postUserId.value, 3, res.result.id, postData.value.noteTitle);
            utils_addXiSocre.changeXiSocre(commentIndex.value, friendId.value == uid ? userId.value : friendId.value);
            sendMessage3(friendId.value == uid ? userId.value : friendId.value);
          });
          common_vendor.index.hideLoading();
          commentText.value == "";
          popup.value.close();
          stepId.value == 0;
          db.collection("jimoty-chat").doc(chatId.value).update({ step: 5 });
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
    function gotoUser(id) {
      common_vendor.index.navigateTo({
        url: `/pages/my/myDetail?userId=${id}`
      });
    }
    const changeHeigh = common_vendor.ref(false);
    const inputHeigh = common_vendor.ref(0);
    function addHeight(e) {
      inputHeigh.value = e.detail.height;
      changeHeigh.value = true;
    }
    function cancelHeigh(e) {
      changeHeigh.value = false;
    }
    function formatTimestamp(timestamp) {
      const now = /* @__PURE__ */ new Date();
      const inputDate = new Date(timestamp);
      const daysDifference = Math.floor((now - inputDate) / (1e3 * 60 * 60 * 24));
      if (daysDifference === 0) {
        const hours = inputDate.getHours().toString().padStart(2, "0");
        const minutes = inputDate.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      } else if (daysDifference === 1) {
        const hours = inputDate.getHours().toString().padStart(2, "0");
        const minutes = inputDate.getMinutes().toString().padStart(2, "0");
        return `昨天 ${hours}:${minutes}`;
      } else if (daysDifference === 2) {
        const hours = inputDate.getHours().toString().padStart(2, "0");
        const minutes = inputDate.getMinutes().toString().padStart(2, "0");
        return `前天 ${hours}:${minutes}`;
      } else {
        const month = inputDate.getMonth() + 1;
        const day = inputDate.getDate();
        const hours = inputDate.getHours().toString().padStart(2, "0");
        const minutes = inputDate.getMinutes().toString().padStart(2, "0");
        return `${month}月${day}日 ${hours}:${minutes}`;
      }
    }
    const uptoBottom = () => {
      scrollTop.value = scrollNumber.value;
      common_vendor.nextTick$1(() => {
        scrollTop.value = 9999 * dialogData.value.length;
      });
    };
    const scrollTop = common_vendor.ref(0);
    const scrollNumber = common_vendor.ref(0);
    const scroll = (e) => {
      scrollNumber.value = e.detail.scrollTop;
    };
    const gotoDetail = (postId2) => {
      common_vendor.index.navigateTo({
        url: `/pages/home/detail?postId=${postId2}`
      });
    };
    const typeStatus = common_vendor.ref([
      {
        sell: [
          "确认对方加入活动",
          "参与取消",
          "参与结束",
          "该活动还在进行中",
          "请联系参与",
          "对方已经同意您参与",
          "已确定对方为成员",
          "你已经被确定为该活动的参与者",
          "是否确认已参与结束",
          "已结束参与",
          "是否确定取消结束"
        ]
      },
      {
        sell: [
          "确定对方参与互助",
          "互助取消",
          "互助结束",
          "此互助还在",
          "请联系商家进行互助",
          "对方已经将您设为互助",
          "已确定对方为互助",
          "你已经被确定为该活动的参与者",
          "是否确认完成互助",
          "已完成互助",
          "是否确定参与结束"
        ]
      },
      {
        sell: [
          "确定对方加入课堂",
          "试课取消",
          "试课结束",
          "该课堂还在进行中",
          "请联系进行试课",
          "对方已经将您设为学员",
          "已确定对方为学员",
          "你已经被确定为该活动的参与者",
          "是否确定取消试课",
          "已结束参与",
          "是否确定参与结束"
        ]
      },
      {
        sell: [
          "确定将宠物交给对方",
          "领养取消",
          "领养成功",
          "领养还在进行中",
          "请联系商家进行领养",
          "对方已确认您的领养资格",
          "已确认对方的领养资格",
          "对方已确认您的领养资格",
          "是否确认领养",
          "确认领养",
          "是否取消对方的领养资格"
        ]
      },
      {
        sell: [
          "确定对方为买家",
          "交易取消",
          "交易已完成",
          "还没有购买这个商品",
          "请联系商家进行购买",
          "对方已经将您设为买家",
          "已确定对方为买家",
          "对方已确定您为买家",
          "是否确认交易完成!(买家收货后点击确定)",
          "确认收货",
          "中断这笔交易?(确保已与买家沟通好)"
        ]
      }
    ]);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: postData.value && postData.value.type
      }, postData.value && postData.value.type ? common_vendor.e({
        b: postUserId.value == common_vendor.unref(uid)
      }, postUserId.value == common_vendor.unref(uid) ? common_vendor.e({
        c: stepId.value == 0 || stepId.value == 4
      }, stepId.value == 0 || stepId.value == 4 ? {
        d: common_vendor.t(typeStatus.value[postData.value.type - 1].sell[0]),
        e: common_vendor.o(($event) => changeStep(0))
      } : {}, {
        f: stepId.value == 1
      }, stepId.value == 1 ? {
        g: common_vendor.t(typeStatus.value[postData.value.type - 1].sell[1]),
        h: common_vendor.o(($event) => changeStep(2))
      } : {}, {
        i: stepId.value == 3
      }, stepId.value == 3 ? {
        j: common_vendor.t(typeStatus.value[postData.value.type - 1].sell[2])
      } : {}, {
        k: stepId.value == 5
      }, stepId.value == 5 ? {} : {}) : common_vendor.e({
        l: stepId.value == 0 || stepId.value == 4
      }, stepId.value == 0 || stepId.value == 4 ? {
        m: common_vendor.t(typeStatus.value[postData.value.type - 1].sell[3]),
        n: common_vendor.t(typeStatus.value[postData.value.type - 1].sell[4])
      } : {}, {
        o: stepId.value == 1
      }, stepId.value == 1 ? {
        p: common_vendor.t(typeStatus.value[postData.value.type - 1].sell[5]),
        q: common_vendor.t(typeStatus.value[postData.value.type - 1].sell[9]),
        r: common_vendor.o(($event) => changeStep(1))
      } : {}, {
        s: stepId.value == 3
      }, stepId.value == 3 ? {
        t: common_vendor.o(openComent)
      } : {}, {
        v: stepId.value == 5
      }, stepId.value == 5 ? {} : {})) : {}, {
        w: postData.value.photos ? postData.value.photos[0] : "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/商品不存在(1).png",
        x: common_vendor.t(postData.value.noteTitle),
        y: postData.value.postPrice
      }, postData.value.postPrice ? {
        z: common_vendor.t(postData.value.postPrice)
      } : {}, {
        A: common_vendor.o(($event) => gotoDetail(postData.value._id)),
        B: common_vendor.f(dialogData.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.type === 4
          }, item.type === 4 ? common_vendor.e({
            b: item.message == "已将您设置为买家"
          }, item.message == "已将您设置为买家" ? {
            c: common_vendor.t(item.userId[0]._id === common_vendor.unref(uid) ? typeStatus.value[postData.value.type - 1].sell[6] : typeStatus.value[postData.value.type - 1].sell[7])
          } : {
            d: common_vendor.t(item.message)
          }) : common_vendor.e({
            e: item.userId[0]._id !== common_vendor.unref(uid)
          }, item.userId[0]._id !== common_vendor.unref(uid) ? {
            f: item.userId[0] && item.userId[0].avatar_file ? item.userId[0].avatar_file.url : "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/默认头像.png",
            g: common_vendor.o(($event) => gotoUser(item.userId[0]._id), index)
          } : {}, {
            h: item.type === 0
          }, item.type === 0 ? common_vendor.e({
            i: common_vendor.t(item.message),
            j: common_vendor.o(($event) => handleLongPress(item, index), index),
            k: item.time != ""
          }, item.time != "" ? {
            l: common_vendor.t(formatTimestamp(item.time)),
            m: common_vendor.n(item.userId[0]._id === common_vendor.unref(uid) ? "time-right" : "time-left")
          } : {}) : common_vendor.e({
            n: item.message,
            o: common_vendor.o(($event) => previewImage(item.message), index),
            p: common_vendor.o(($event) => handleLongPress(item, index), index),
            q: item.time != ""
          }, item.time != "" ? {
            r: common_vendor.t(formatTimestamp(item.time)),
            s: common_vendor.n(item.userId[0]._id === common_vendor.unref(uid) ? "img-right" : "img-left")
          } : {}), {
            t: common_vendor.n(item.userId[0]._id === common_vendor.unref(uid) ? "msg-right" : "msg-left")
          }), {
            v: index
          });
        }),
        C: scrollTop.value,
        D: common_vendor.o(scrolltoupper),
        E: common_vendor.o(scroll),
        F: common_vendor.o(sendMessage),
        G: common_vendor.o((...args) => _ctx.changeInputHeigh && _ctx.changeInputHeigh(...args)),
        H: common_vendor.o(addHeight),
        I: common_vendor.o(cancelHeigh),
        J: sendText.value,
        K: common_vendor.o(($event) => sendText.value = $event.detail.value),
        L: common_vendor.o(opencamera),
        M: common_vendor.p({
          type: "camera-filled",
          size: "26"
        }),
        N: common_vendor.o(openalbum),
        O: common_vendor.p({
          type: "image-filled",
          size: "26"
        }),
        P: common_vendor.o(sendMessage),
        Q: changeHeigh.value ? inputHeigh.value - 10 + "px" : "",
        R: common_vendor.o(($event) => chooseType(0)),
        S: common_vendor.n(commentIndex.value == 0 ? "comentActive" : ""),
        T: common_vendor.o(($event) => chooseType(1)),
        U: common_vendor.n(commentIndex.value == 1 ? "comentActive" : ""),
        V: common_vendor.o(($event) => chooseType(2)),
        W: common_vendor.n(commentIndex.value == 2 ? "comentActive" : ""),
        X: common_vendor.o(sendComent),
        Y: common_vendor.o(sendComent),
        Z: common_vendor.o(($event) => commentText.value = $event),
        aa: common_vendor.p({
          trim: "all",
          suffixIcon: "paperplane",
          placeholder: "请输入评论",
          modelValue: commentText.value
        }),
        ab: common_vendor.sr(popup, "9e88ffa0-2", {
          "k": "popup"
        }),
        ac: common_vendor.p({
          type: "bottom",
          ["border-radius"]: "10px 10px 0 0",
          ["background-color"]: "#fff"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9e88ffa0"]]);
wx.createPage(MiniProgramPage);
