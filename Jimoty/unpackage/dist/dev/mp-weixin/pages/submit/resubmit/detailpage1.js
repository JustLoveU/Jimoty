"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_upLoadImage = require("../../../utils/upLoadImage.js");
const utils_verifyName = require("../../../utils/verifyName.js");
const utils_addXiSocre = require("../../../utils/addXiSocre.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_JJ_protocol2 = common_vendor.resolveComponent("JJ-protocol");
  (_easycom_uni_icons2 + _easycom_JJ_protocol2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_JJ_protocol = () => "../../../components/JJ-protocol/JJ-protocol.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_JJ_protocol)();
}
const _sfc_main = {
  __name: "detailpage1",
  setup(__props) {
    let db = common_vendor.Zs.database();
    const secCheckObj = common_vendor.Zs.importObject("secCheckContent", { customUI: true });
    const previewList = common_vendor.ref([]);
    const categeryData = common_vendor.ref([]);
    const categeryStr = common_vendor.ref("");
    const categeryId = common_vendor.ref("");
    const mapData = common_vendor.ref({});
    const condition = common_vendor.ref("");
    const conditionAge = common_vendor.ref("");
    const protocol = common_vendor.ref(null);
    const titleText = common_vendor.ref("");
    const mainText = common_vendor.ref("");
    const draftPostId = common_vendor.ref("");
    common_vendor.onShow(() => {
      utils_verifyName.verifyName();
    });
    common_vendor.onLoad(async (e) => {
      if (e.postId) {
        draftPostId.value = e.postId;
      }
      if (draftPostId.value != "") {
        const res = await db.collection("jimoty-post").doc(draftPostId.value).get({ getOne: true });
        let data = res.result.data;
        const res2 = await db.collection("jimoty-category").doc(data.category).get({ getOne: true });
        previewList.value = data.photos;
        categeryId.value = data.category;
        postStatus.value = data.status;
        categeryData.value.push(res2.result.data.name);
        titleText.value = data.noteTitle;
        mainText.value = data.mainText;
        mapData.value = {
          address: data.location.address,
          province: data.location.province,
          longitude: data.point[0],
          latitude: data.point[1]
        };
        conditionAge.value = data.recruitAge;
        condition.value = data.sex;
      }
    });
    common_vendor.onMounted(() => {
      common_vendor.index.$on("cameraPhotos", (res) => {
        previewList.value = res;
      });
      common_vendor.index.$on("categeryData", (res) => {
        categeryData.value = res.categery;
        categeryId.value = res.id;
        categeryData.value.forEach((res2) => {
          categeryStr.value = categeryStr.value + res2;
        });
      });
      common_vendor.index.$on("mapData", (res) => {
        mapData.value = res;
      });
      common_vendor.index.$on("condition", (res) => {
        condition.value = res;
      });
      common_vendor.index.$on("conditionAge", (res) => {
        if (res == "没有限定") {
          conditionAge.value = res;
        } else {
          conditionAge.value = res[0] + "-" + res[1];
        }
      });
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.$off("mapData");
      common_vendor.index.$off("categeryData");
      common_vendor.index.$off("condition");
      common_vendor.index.$off("conditionAge");
    });
    function opencamera() {
      const images = JSON.stringify(previewList.value);
      common_vendor.index.navigateTo({
        url: `/pages/submit/camera?images=${images}`
      });
    }
    function openmap() {
      common_vendor.index.navigateTo({
        url: `/pages/submit/map?index=-1`
      });
    }
    function gotochoose(index) {
      common_vendor.index.navigateTo({
        url: `/pages/submit/otherDataPage?index=${index}`
      });
    }
    const Inoperation = common_vendor.ref(false);
    function submit() {
      if (Inoperation.value)
        return;
      Inoperation.value = true;
      if (!protocol.value.ifConfirm) {
        common_vendor.index.showToast({
          title: "请阅读并同意投稿协议",
          icon: "none"
        });
        Inoperation.value = false;
        return;
      }
      if (previewList.value.length <= 0) {
        common_vendor.index.showToast({
          title: "请添加至少一张图片",
          icon: "none"
        });
        Inoperation.value = false;
        return;
      }
      if (categeryData.value.length < 1 || titleText.value == "" || mainText.value == "" || !mapData.value.address) {
        common_vendor.index.showToast({
          title: "请填写必须",
          icon: "none"
        });
        Inoperation.value = false;
        return;
      } else {
        common_vendor.index.showModal({
          content: postStatus.value == 1 ? "是否保存为草稿" : "是否确认投稿",
          success: async function(res) {
            if (res.confirm) {
              common_vendor.index.showLoading({
                mask: true,
                title: "上传中"
              });
              let sec = await secCheckObj.textSecCheck({ content: titleText.value });
              if (sec.errCode != 0) {
                common_vendor.index.showModal({
                  title: sec.errMsg,
                  content: `输入的内容违规，涉及“${sec.result.label}”，请重新编辑！`,
                  showCancel: false
                });
                titleText.value = "";
                Inoperation.value = false;
                common_vendor.index.hideLoading();
                return;
              }
              let sec2 = await secCheckObj.textSecCheck({ content: mainText.value });
              if (sec2.errCode != 0) {
                common_vendor.index.showModal({
                  title: sec2.errMsg,
                  content: `输入的内容违规，涉及“${sec2.result.label}”，请重新编辑！`,
                  showCancel: false
                });
                mainText.value = "";
                Inoperation.value = false;
                common_vendor.index.hideLoading();
                return;
              }
              if (draftPostId.value != "") {
                if (postStatus.value == 4) {
                  db.collection("jimoty-post").doc(draftPostId.value).update({
                    photos: previewList.value,
                    category: categeryId.value,
                    noteTitle: titleText.value,
                    mainText: mainText.value,
                    location: {
                      address: mapData.value.address,
                      province: mapData.value.province
                    },
                    point: new db.Geo.Point(
                      Number(mapData.value.longitude),
                      Number(
                        mapData.value.latitude
                      )
                    ),
                    point: [Number(mapData.value.longitude), Number(mapData.value.latitude)],
                    sex: condition.value,
                    recruitAge: conditionAge.value,
                    create_date: Date.now(),
                    update_date: Date.now(),
                    status: 0
                  }).then(
                    async (res2) => {
                      await utils_upLoadImage.upLoadImage(draftPostId.value, previewList.value);
                      common_vendor.index.showToast({
                        title: "审核完成后,自动上传",
                        icon: "none"
                      });
                      setTimeout(() => {
                        common_vendor.index.navigateBack();
                      }, 800);
                    }
                  );
                } else {
                  db.collection("jimoty-post").doc(draftPostId.value).update({
                    photos: previewList.value,
                    category: categeryId.value,
                    noteTitle: titleText.value,
                    mainText: mainText.value,
                    location: {
                      address: mapData.value.address,
                      province: mapData.value.province
                    },
                    point: new db.Geo.Point(
                      Number(mapData.value.longitude),
                      Number(
                        mapData.value.latitude
                      )
                    ),
                    point: [Number(mapData.value.longitude), Number(mapData.value.latitude)],
                    sex: condition.value,
                    recruitAge: conditionAge.value,
                    status: 0
                  }).then(
                    async (res2) => {
                      await utils_upLoadImage.upLoadImage(draftPostId.value, previewList.value);
                      common_vendor.index.showToast({
                        title: "审核完成后,自动上传",
                        icon: "none"
                      });
                      setTimeout(() => {
                        common_vendor.index.navigateBack();
                      }, 800);
                    }
                  );
                }
              } else {
                console.log("用户点击确定");
                let data = {
                  type: 1,
                  photos: previewList.value,
                  category: categeryId.value,
                  noteTitle: titleText.value,
                  mainText: mainText.value,
                  location: {
                    address: mapData.value.address,
                    province: mapData.value.province
                  },
                  point: new db.Geo.Point(Number(mapData.value.longitude), Number(mapData.value.latitude)),
                  point: [Number(mapData.value.longitude), Number(mapData.value.latitude)],
                  sex: condition.value,
                  recruitAge: conditionAge.value,
                  status: postStatus.value
                };
                db.collection("jimoty-post").add(data).then(async (res2) => {
                  console.log(res2);
                  await utils_upLoadImage.upLoadImage(res2.result.id, previewList.value);
                  if (postStatus.value == 0) {
                    common_vendor.index.showToast({
                      title: "审核完成后,自动上传",
                      icon: "none"
                    });
                    utils_addXiSocre.addXiSocre();
                  } else {
                    common_vendor.index.showToast({
                      title: "已保存为草稿",
                      icon: "none"
                    });
                  }
                  setTimeout(() => {
                    common_vendor.index.navigateBack();
                  }, 1e3);
                });
              }
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      }
      common_vendor.index.hideLoading();
      Inoperation.value = false;
    }
    function openCategery() {
      common_vendor.index.navigateTo({
        url: `/pages/submit/datapage?index=0&parentId=66f045f8337a9f907ceb9001`
      });
    }
    const postStatus = common_vendor.ref(0);
    function save() {
      postStatus.value = 1;
      submit();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(5, (item, index, i0) => {
          return common_vendor.e({
            a: previewList.value[index]
          }, previewList.value[index] ? {
            b: previewList.value[index]
          } : {
            c: "6c934106-0-" + i0,
            d: common_vendor.p({
              type: "camera-filled",
              color: "rgb(33,159,98)",
              size: "32"
            })
          }, {
            e: index,
            f: common_vendor.o(opencamera, index)
          });
        }),
        b: categeryData.value.length > 0
      }, categeryData.value.length > 0 ? {
        c: common_vendor.f(categeryData.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        })
      } : {}, {
        d: common_vendor.p({
          type: "right",
          size: "22"
        }),
        e: common_vendor.o(openCategery),
        f: titleText.value,
        g: common_vendor.o(($event) => titleText.value = $event.detail.value),
        h: mainText.value,
        i: common_vendor.o(($event) => mainText.value = $event.detail.value),
        j: mapData.value.address
      }, mapData.value.address ? {
        k: common_vendor.t(mapData.value.address)
      } : {}, {
        l: common_vendor.p({
          type: "right",
          size: "22"
        }),
        m: common_vendor.o(openmap),
        n: common_vendor.t(condition.value),
        o: common_vendor.p({
          type: "right",
          size: "22"
        }),
        p: common_vendor.o(($event) => gotochoose(1)),
        q: common_vendor.t(conditionAge.value == [1, 99] ? "没有限定" : conditionAge.value),
        r: common_vendor.p({
          type: "right",
          size: "22"
        }),
        s: common_vendor.o(($event) => gotochoose(2)),
        t: common_vendor.sr(protocol, "6c934106-5", {
          "k": "protocol"
        }),
        v: common_vendor.t(draftPostId.value == "" ? "投稿" : "重新投稿"),
        w: common_vendor.o(submit),
        x: draftPostId.value == ""
      }, draftPostId.value == "" ? {
        y: common_vendor.o(save)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
