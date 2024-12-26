"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "camera",
  setup(__props) {
    const previewList = common_vendor.ref([]);
    const back = common_vendor.ref("back");
    const off = common_vendor.ref("off");
    const ifLook = common_vendor.ref(false);
    const lookImage = common_vendor.ref("");
    common_vendor.onLoad((e) => {
      if (e.images) {
        previewList.value = JSON.parse(e.images);
      }
    });
    function takePhoto() {
      const ctx = common_vendor.index.createCameraContext();
      ctx.takePhoto({
        quality: "normal",
        success: (res) => {
          if (previewList.value.length < 5) {
            previewList.value.push(res.tempImagePath);
          } else {
            common_vendor.index.showToast({ title: "最多只能拍摄五张照片", icon: "none" });
          }
          console.log(previewList.value, "拍摄中");
        }
      });
    }
    const imageIndex = common_vendor.ref(0);
    function lookImagefun(image, index) {
      if (image) {
        lookImage.value = image;
        imageIndex.value = index;
        ifLook.value = true;
      }
    }
    function edit() {
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["album"],
        sizeType: ["compressed"],
        success: (res) => {
          lookImage.value = res.tempFilePaths[0];
          previewList.value[imageIndex.value] = res.tempFilePaths[0];
        }
      });
    }
    function reback() {
      console.log("@@@");
      if (ifLook.value) {
        ifLook.value = false;
      }
    }
    function complete() {
      common_vendor.index.$emit("cameraPhotos", previewList.value);
      common_vendor.index.navigateBack();
    }
    function deleteImage() {
      const index = previewList.value.findIndex((item) => lookImage.value);
      previewList.value.splice(index, 1);
      lookImage.value = "";
      ifLook.value = false;
    }
    function toggleFlash() {
      if (off.value == "off") {
        off.value = "on";
      } else {
        off.value = "off";
      }
    }
    function flipCamera() {
      if (back.value == "front") {
        back.value = "back";
      } else {
        back.value = "front";
      }
    }
    function openGallery() {
      let num = 5 - previewList.value.length;
      common_vendor.index.chooseImage({
        count: num,
        sourceType: ["album"],
        sizeType: ["compressed"],
        success: (res) => {
          if (previewList.value.length < 5) {
            res.tempFilePaths.forEach((item) => {
              previewList.value.push(item);
            });
          } else {
            common_vendor.index.showToast({ title: `最多只能选择${num}张照片`, icon: "none" });
          }
        }
      });
    }
    function error(e) {
      common_vendor.index.showToast({ title: "摄像头错误：" + e.detail.errMsg, icon: "none" });
    }
    function stop() {
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: ifLook.value
      }, ifLook.value ? {
        b: lookImage.value
      } : {
        c: back.value,
        d: off.value,
        e: common_vendor.o(error),
        f: common_vendor.o(stop)
      }, {
        g: common_vendor.f(5, (item, index, i0) => {
          return common_vendor.e({
            a: previewList.value[index]
          }, previewList.value[index] ? {
            b: previewList.value[index] ? previewList.value[index] : "",
            c: common_vendor.o(($event) => lookImagefun(previewList.value[index], index), index)
          } : {}, {
            d: index,
            e: common_vendor.o(reback, index)
          });
        }),
        h: !ifLook.value
      }, !ifLook.value ? {
        i: common_assets._imports_0$3,
        j: common_vendor.o(toggleFlash),
        k: common_vendor.o(takePhoto),
        l: common_assets._imports_1,
        m: common_vendor.o(flipCamera)
      } : {
        n: common_assets._imports_2,
        o: common_vendor.o(deleteImage),
        p: common_vendor.o(edit)
      }, {
        q: common_assets._imports_3,
        r: common_vendor.o(openGallery),
        s: common_assets._imports_4,
        t: common_vendor.o(complete)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4e46caf1"]]);
wx.createPage(MiniProgramPage);
