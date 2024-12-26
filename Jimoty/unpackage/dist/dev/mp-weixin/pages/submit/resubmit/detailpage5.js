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
  __name: "detailpage5",
  setup(__props) {
    let db = common_vendor.Zs.database();
    const secCheckObj = common_vendor.Zs.importObject("secCheckContent", { customUI: true });
    const postPrice = common_vendor.ref("");
    const formattedPrice = common_vendor.ref("");
    const mainText = common_vendor.ref("");
    const postName = common_vendor.ref("");
    const previewList = common_vendor.ref([]);
    const protocol = common_vendor.ref(null);
    const categeryData = common_vendor.ref([]);
    const categeryStr = common_vendor.ref("");
    const categeryId = common_vendor.ref("");
    const mapData = common_vendor.ref({});
    const draftPostId = common_vendor.ref("");
    const postStatus = common_vendor.ref(0);
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
        postName.value = data.noteTitle;
        postPrice.value = data.postPrice;
        mainText.value = data.mainText;
        mapData.value = {
          address: data.location.address,
          province: data.location.province,
          longitude: data.point[0],
          latitude: data.point[1]
        };
      }
    });
    common_vendor.onMounted(() => {
      common_vendor.index.$on("cameraPhotos", (res) => {
        console.log(res, "拍摄的照片");
        previewList.value = [...res];
      });
      common_vendor.index.$on("mapData", (res) => {
        mapData.value = res;
        console.log(res);
      });
      common_vendor.index.$on("categeryData", (res) => {
        categeryData.value = res.categery;
        categeryId.value = res.id;
        categeryData.value.forEach((res2) => {
          categeryStr.value = categeryStr.value + res2;
        });
      });
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.$off("mapData");
      common_vendor.index.$off("categeryData");
      common_vendor.index.$off("cameraPhotos");
    });
    function blur() {
      postPrice.value = formattedPrice.value;
    }
    function formatPrice() {
      let numericValue = postPrice.value.replace(/[^0-9.]/g, "");
      numericValue = numericValue.replace(/(\..*)\./g, "$1");
      let parsedValue = parseFloat(numericValue);
      if (!isNaN(parsedValue)) {
        formattedPrice.value = parsedValue.toFixed(2);
      } else {
        formattedPrice.value = "";
      }
    }
    function openCategery() {
      common_vendor.index.navigateTo({
        url: `/pages/submit/datapage?index=0&parentId=66f04609eef9cba934a06332`
      });
    }
    function opencamera() {
      common_vendor.index.navigateTo({
        url: "/pages/submit/camera"
      });
    }
    function openmap() {
      common_vendor.index.navigateTo({
        url: `/pages/submit/map?index=-1`
      });
    }
    const Inoperation = common_vendor.ref(false);
    async function submit() {
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
      if (postPrice.value == "") {
        common_vendor.index.showToast({
          title: "请填写价格",
          icon: "none"
        });
        Inoperation.value = false;
        return;
      }
      if (categeryData.value.length < 1 || postName.value == "" || !mapData.value.address) {
        common_vendor.index.showToast({
          title: "请填写完整",
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
              let sec = await secCheckObj.textSecCheck({ content: postName.value });
              if (sec.errCode != 0) {
                common_vendor.index.showModal({
                  title: sec.errMsg,
                  content: `输入的内容违规，涉及“${sec.result.label}”，请重新编辑！`,
                  showCancel: false
                });
                postName.value = "";
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
                    noteTitle: postName.value,
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
                    payMethod: 0,
                    postPrice: postPrice.value,
                    create_date: Date.now(),
                    update_date: Date.now(),
                    status: 0
                  }).then(async (res2) => {
                    await utils_upLoadImage.upLoadImage(draftPostId.value, previewList.value);
                    common_vendor.index.showToast({
                      title: "审核完成后,自动上传",
                      icon: "none"
                    });
                    setTimeout(() => {
                      common_vendor.index.navigateBack();
                    }, 800);
                  });
                } else {
                  db.collection("jimoty-post").doc(draftPostId.value).update({
                    photos: previewList.value,
                    category: categeryId.value,
                    noteTitle: postName.value,
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
                    payMethod: 0,
                    postPrice: postPrice.value,
                    status: 0
                  }).then(async (res2) => {
                    await utils_upLoadImage.upLoadImage(draftPostId.value, previewList.value);
                    common_vendor.index.showToast({
                      title: "审核完成后,自动上传",
                      icon: "none"
                    });
                    setTimeout(() => {
                      common_vendor.index.navigateBack();
                    }, 800);
                  });
                }
              } else {
                console.log("用户点击确定");
                console.log(postStatus.value, "@@@@#!", draftPostId.value);
                let data = {
                  type: 5,
                  photos: previewList.value,
                  category: categeryId.value,
                  noteTitle: postName.value,
                  mainText: mainText.value,
                  location: {
                    address: mapData.value.address,
                    province: mapData.value.province
                  },
                  point: new db.Geo.Point(Number(mapData.value.longitude), Number(mapData.value.latitude)),
                  point: [Number(mapData.value.longitude), Number(mapData.value.latitude)],
                  payMethod: 0,
                  postPrice: postPrice.value,
                  status: postStatus.value
                };
                db.collection("jimoty-post").add(data).then((res2) => {
                  utils_upLoadImage.upLoadImage(res2.result.id, previewList.value);
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
                  }, 800);
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
            c: "6ccb9f0a-0-" + i0,
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
        f: postName.value,
        g: common_vendor.o(($event) => postName.value = $event.detail.value),
        h: common_vendor.p({
          type: "right",
          size: "22"
        }),
        i: common_vendor.o([($event) => postPrice.value = $event.detail.value, formatPrice]),
        j: common_vendor.o(blur),
        k: postPrice.value,
        l: mainText.value,
        m: common_vendor.o(($event) => mainText.value = $event.detail.value),
        n: mapData.value.address
      }, mapData.value.address ? {
        o: common_vendor.t(mapData.value.address)
      } : {}, {
        p: common_vendor.p({
          type: "right",
          size: "22"
        }),
        q: common_vendor.o(openmap),
        r: common_vendor.sr(protocol, "6ccb9f0a-4", {
          "k": "protocol"
        }),
        s: common_vendor.t(draftPostId.value == "" ? "投稿" : "重新投稿"),
        t: common_vendor.o(submit),
        v: draftPostId.value == ""
      }, draftPostId.value == "" ? {
        w: common_vendor.o(save)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
