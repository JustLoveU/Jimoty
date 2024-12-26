"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_upLoadImage = require("../../../utils/upLoadImage.js");
const utils_verifyName = require("../../../utils/verifyName.js");
const utils_addXiSocre = require("../../../utils/addXiSocre.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_JJ_protocol2 = common_vendor.resolveComponent("JJ-protocol");
  (_easycom_uni_icons2 + _easycom_uni_data_select2 + _easycom_JJ_protocol2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_data_select = () => "../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_JJ_protocol = () => "../../../components/JJ-protocol/JJ-protocol.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_data_select + _easycom_JJ_protocol)();
}
const _sfc_main = {
  __name: "detailpage4",
  setup(__props) {
    let db = common_vendor.Zs.database();
    const secCheckObj = common_vendor.Zs.importObject("secCheckContent", { customUI: true });
    const titleText = common_vendor.ref("");
    const mainText = common_vendor.ref("");
    const releaseReason = common_vendor.ref("");
    const protocol = common_vendor.ref(null);
    const previewList = common_vendor.ref([]);
    const categeryData = common_vendor.ref([]);
    const categeryStr = common_vendor.ref("");
    const categeryId = common_vendor.ref("");
    const mapData = common_vendor.ref({});
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
        value3.value = range3.value.find((item) => item.text === data.sex).value, value4.value = range4.value.find((item) => item.text === data.sterOperation).value, value5.value = range5.value.find((item) => item.text === data.vaccinelnoculation).value;
        releaseReason.value = data.releaseReason;
        let numbers = data.age.match(/\d+/g);
        value1.value = range1.value.find((item) => item.text === numbers[0]).value;
        value2.value = range2.value.find((item) => item.text === numbers[1]).value;
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
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.$off("mapData");
      common_vendor.index.$off("categeryData");
      common_vendor.index.$off("cameraPhotos");
    });
    function openCategery() {
      common_vendor.index.navigateTo({
        url: `/pages/submit/datapage?index=0&parentId=66f04627c3b5c99cfcd65dd0`
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
      if (categeryData.value.length < 1 || titleText.value == "" || mainText.value == "" || !mapData.value.address || releaseReason.value == "") {
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
                    sex: range3.value[value3.value].text,
                    age: range1.value[value1.value].text + "年" + range2.value[value2.value].text + "月",
                    sterOperation: range4.value[value4.value].text,
                    vaccinelnoculation: range5.value[value5.value].text,
                    releaseReason: releaseReason.value,
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
                    sex: range3.value[value3.value].text,
                    age: range1.value[value1.value].text + "年" + range2.value[value2.value].text + "月",
                    sterOperation: range4.value[value4.value].text,
                    vaccinelnoculation: range5.value[value5.value].text,
                    releaseReason: releaseReason.value,
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
                let data = {
                  type: 4,
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
                  sex: range3.value[value3.value].text,
                  age: range1.value[value1.value].text + "年" + range2.value[value2.value].text + "月",
                  sterOperation: range4.value[value4.value].text,
                  vaccinelnoculation: range5.value[value5.value].text,
                  releaseReason: releaseReason.value,
                  status: postStatus.value
                };
                db.collection("jimoty-post").add(data).then((res2) => {
                  console.log(res2);
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
    const postStatus = common_vendor.ref(0);
    function save() {
      postStatus.value = 1;
      submit();
    }
    const value1 = common_vendor.ref(0);
    const value2 = common_vendor.ref(0);
    const value3 = common_vendor.ref(0);
    const value4 = common_vendor.ref(0);
    const value5 = common_vendor.ref(0);
    const range1 = common_vendor.ref([
      { value: 0, text: "0" },
      { value: 1, text: "1" },
      { value: 2, text: "2" },
      { value: 3, text: "3" },
      { value: 4, text: "4" },
      { value: 5, text: "5" },
      { value: 6, text: "6" },
      { value: 7, text: "7" },
      { value: 8, text: "8" },
      { value: 9, text: "8" },
      { value: 10, text: "9" },
      { value: 11, text: "11" },
      { value: 12, text: "12" },
      { value: 13, text: "13" },
      { value: 14, text: "14" },
      { value: 15, text: "15" },
      { value: 16, text: "16" },
      { value: 17, text: "17" },
      { value: 18, text: "18" },
      { value: 19, text: "19" },
      { value: 20, text: "20" },
      { value: 21, text: "21" },
      { value: 22, text: "22" },
      { value: 23, text: "23" },
      { value: 24, text: "24" },
      { value: 25, text: "25" }
    ]);
    const range2 = common_vendor.ref([
      { value: 0, text: "0" },
      { value: 1, text: "1" },
      { value: 2, text: "2" },
      { value: 3, text: "3" },
      { value: 4, text: "4" },
      { value: 5, text: "5" },
      { value: 6, text: "6" },
      { value: 7, text: "7" },
      { value: 8, text: "8" },
      { value: 9, text: "9" },
      { value: 10, text: "10" },
      { value: 11, text: "11" }
    ]);
    const range3 = common_vendor.ref([
      { value: 0, text: "男" },
      { value: 1, text: "女" },
      { value: 2, text: "其他" }
    ]);
    const range4 = common_vendor.ref([
      { value: 0, text: "是" },
      { value: 1, text: "否" }
    ]);
    const range5 = common_vendor.ref([
      { value: 0, text: "是" },
      { value: 1, text: "否" }
    ]);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(5, (item, index, i0) => {
          return common_vendor.e({
            a: previewList.value[index]
          }, previewList.value[index] ? {
            b: previewList.value[index]
          } : {
            c: "6cbd8789-0-" + i0,
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
        j: common_vendor.o(($event) => value1.value = $event),
        k: common_vendor.p({
          localdata: range1.value,
          clear: false,
          modelValue: value1.value
        }),
        l: common_vendor.o(($event) => value2.value = $event),
        m: common_vendor.p({
          localdata: range2.value,
          clear: false,
          modelValue: value2.value
        }),
        n: common_vendor.o(($event) => value3.value = $event),
        o: common_vendor.p({
          localdata: range3.value,
          clear: false,
          modelValue: value3.value
        }),
        p: common_vendor.o(($event) => value4.value = $event),
        q: common_vendor.p({
          localdata: range4.value,
          clear: false,
          modelValue: value4.value
        }),
        r: common_vendor.o(($event) => value5.value = $event),
        s: common_vendor.p({
          localdata: range5.value,
          clear: false,
          modelValue: value5.value
        }),
        t: releaseReason.value,
        v: common_vendor.o(($event) => releaseReason.value = $event.detail.value),
        w: mapData.value.address
      }, mapData.value.address ? {
        x: common_vendor.t(mapData.value.address)
      } : {}, {
        y: common_vendor.p({
          type: "right",
          size: "22"
        }),
        z: common_vendor.o(openmap),
        A: common_vendor.sr(protocol, "6cbd8789-8", {
          "k": "protocol"
        }),
        B: common_vendor.t(draftPostId.value == "" ? "投稿" : "重新投稿"),
        C: common_vendor.o(submit),
        D: draftPostId.value == ""
      }, draftPostId.value == "" ? {
        E: common_vendor.o(save)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
