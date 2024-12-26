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
  __name: "detailpage2",
  setup(__props) {
    let db = common_vendor.Zs.database();
    const secCheckObj = common_vendor.Zs.importObject("secCheckContent", { customUI: true });
    const titleText = common_vendor.ref("");
    const mainText = common_vendor.ref("");
    const conpanyName = common_vendor.ref("");
    const salary = common_vendor.ref("");
    const formattedPrice = common_vendor.ref("");
    const salaryAdd = common_vendor.ref("");
    const traffic = common_vendor.ref("");
    const workTime = common_vendor.ref("");
    const workPosition = common_vendor.ref("");
    const categeryData = common_vendor.ref([]);
    const categeryStr = common_vendor.ref("");
    const categeryId = common_vendor.ref("");
    const phone = common_vendor.ref("");
    const otherWay = common_vendor.ref("");
    const mapData = common_vendor.ref({});
    const previewList = common_vendor.ref([]);
    const protocol = common_vendor.ref(null);
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
        conpanyName.value = data.companyName;
        value1.value = range1.value.find((item) => item.text === data.payrollForm).value;
        salary.value = data.salary;
        salaryAdd.value = data.salarySupplement;
        traffic.value = data.traffic;
        workTime.value = data.workTime;
        workPosition.value = data.workPosition;
        phone.value = data.phone;
        if (range2.value.find((item) => item.text === data.employeeForm)) {
          value2.value = data.employeeForm;
        } else {
          value2.value = 2;
          otherWay.value = data.employeeForm;
        }
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
    function openCategery() {
      common_vendor.index.navigateTo({
        url: `/pages/submit/datapage?index=0&parentId=66f0462d7c8de454cff0d229`
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
      if (categeryData.value.length < 1 || titleText.value == "" || mainText.value == "" || !mapData.value.address || conpanyName.value == "" || workTime.value == "" || salary.value == "") {
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
                    companyName: conpanyName.value,
                    payrollForm: range1.value[value1.value].text,
                    salary: salary.value,
                    salarySupplement: salaryAdd.value,
                    traffic: traffic.value,
                    workTime: workTime.value,
                    workPosition: workPosition.value,
                    phone: phone.value,
                    employeeForm: otherWay.value,
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
                    companyName: conpanyName.value,
                    payrollForm: range1.value[value1.value].text,
                    salary: salary.value,
                    salarySupplement: salaryAdd.value,
                    traffic: traffic.value,
                    workTime: workTime.value,
                    workPosition: workPosition.value,
                    phone: phone.value,
                    employeeForm: otherWay.value,
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
                  type: 2,
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
                  companyName: conpanyName.value,
                  payrollForm: range1.value[value1.value].text,
                  salary: salary.value,
                  salarySupplement: salaryAdd.value,
                  traffic: traffic.value,
                  workTime: workTime.value,
                  workPosition: workPosition.value,
                  phone: phone.value,
                  employeeForm: otherWay.value,
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
    const value1 = common_vendor.ref(0);
    const value2 = common_vendor.ref(0);
    const range1 = common_vendor.ref([
      { value: 0, text: "按时" },
      { value: 1, text: "按日" },
      { value: 2, text: "按月" },
      { value: 3, text: "其他" }
    ]);
    const range2 = common_vendor.ref([
      { value: 0, text: "派遣" },
      { value: 1, text: "委托" },
      { value: 2, text: "其他" }
    ]);
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
            c: "6ca15887-0-" + i0,
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
        j: conpanyName.value,
        k: common_vendor.o(($event) => conpanyName.value = $event.detail.value),
        l: common_vendor.o(_ctx.change1),
        m: common_vendor.o(($event) => value1.value = $event),
        n: common_vendor.p({
          localdata: range1.value,
          clear: false,
          modelValue: value1.value
        }),
        o: common_vendor.o([($event) => salary.value = $event.detail.value, formatPrice]),
        p: common_vendor.o(blur),
        q: salary.value,
        r: salaryAdd.value,
        s: common_vendor.o(($event) => salaryAdd.value = $event.detail.value),
        t: traffic.value,
        v: common_vendor.o(($event) => traffic.value = $event.detail.value),
        w: workTime.value,
        x: common_vendor.o(($event) => workTime.value = $event.detail.value),
        y: mapData.value.address
      }, mapData.value.address ? {
        z: common_vendor.t(mapData.value.address)
      } : {}, {
        A: common_vendor.p({
          type: "right",
          size: "22"
        }),
        B: common_vendor.o(openmap),
        C: phone.value,
        D: common_vendor.o(($event) => phone.value = $event.detail.value),
        E: otherWay.value,
        F: common_vendor.o(($event) => otherWay.value = $event.detail.value),
        G: common_vendor.sr(protocol, "6ca15887-4", {
          "k": "protocol"
        }),
        H: common_vendor.t(draftPostId.value == "" ? "投稿" : "重新投稿"),
        I: common_vendor.o(submit),
        J: draftPostId.value == ""
      }, draftPostId.value == "" ? {
        K: common_vendor.o(save)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
