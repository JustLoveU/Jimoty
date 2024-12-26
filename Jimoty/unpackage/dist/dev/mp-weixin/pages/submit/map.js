"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_yichan_movable_area2 = common_vendor.resolveComponent("yichan-movable-area");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  (_easycom_yichan_movable_area2 + _easycom_uni_easyinput2)();
}
const _easycom_yichan_movable_area = () => "../../components/yichan-movable-area/yichan-movable-area.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  (_easycom_yichan_movable_area + _easycom_uni_easyinput)();
}
const GDkey = "5a1b7f0c30df0aac815403ea512b3d32";
const _sfc_main = {
  __name: "map",
  setup(__props) {
    common_vendor.ref(0);
    const latitude = common_vendor.ref(28.135795);
    const longitude = common_vendor.ref(113.03853);
    const covers = common_vendor.ref([{
      id: 187220,
      latitude: latitude.value,
      longitude: longitude.value,
      iconPath: "/static/submit/location.png",
      width: 30,
      height: 30
    }]);
    common_vendor.ref([{
      iconPath: "../../static/my/dingwei.png",
      clickable: true
    }]);
    const cityText = common_vendor.ref("");
    const locationName = common_vendor.ref("");
    const FromIndex = common_vendor.ref(false);
    const searchLong = common_vendor.ref(0);
    common_vendor.onLoad((e) => {
      console.log(e, e.index == "1");
      if (e.index == "1") {
        FromIndex.value = true;
      } else {
        FromIndex.value = false;
      }
      let location = common_vendor.index.getStorageSync("HistoryCity");
      if (location) {
        latitude.value = location.latitude;
        longitude.value = location.longitude;
        searchLong.value = location.length / 1e3;
        covers.value[0].latitude = latitude.value;
        covers.value[0].longitude = longitude.value;
      }
    });
    function rebackLocation() {
      console.log("####");
      common_vendor.wx$1.getLocation({
        type: "wgs84",
        success: function(data) {
          console.log("当前位置的经度：" + data.longitude);
          console.log("当前位置的纬度：" + data.latitude);
          longitude.value = Number(data.longitude.toFixed(6));
          latitude.value = Number(data.latitude.toFixed(6));
          common_vendor.index.request({
            url: `https://restapi.amap.com/v3/geocode/regeo?location=${longitude.value},${latitude.value}&key=5a1b7f0c30df0aac815403ea512b3d32&extensions=base`,
            success(res) {
              cityText.value = res.data.regeocode.addressComponent.province;
              locationName.value = res.data.regeocode.formatted_address;
              covers.value[0].latitude = latitude.value;
              covers.value[0].longitude = longitude.value;
            }
          });
        }
      });
    }
    function homesearch(e) {
      searchLong.value = e;
    }
    function markerclick(e) {
      console.log(e.detail, "oooooooooo");
    }
    function searchAddress() {
      if (locationName.value == "") {
        common_vendor.index.showToast({
          title: "请输入搜索的地址",
          icon: "none"
        });
      } else {
        common_vendor.index.request({
          url: `https://restapi.amap.com/v3/geocode/geo?key=${GDkey}&address=${locationName.value}&city=`,
          success(res) {
            console.log(res, "pppp");
            let arr = res.data.geocodes[0].location.split(",");
            latitude.value = arr[1];
            longitude.value = arr[0];
            cityText.value = res.data.geocodes[0].city;
            covers.value[0].latitude = latitude.value;
            covers.value[0].longitude = longitude.value;
          }
        });
      }
    }
    function getLocation(e) {
      common_vendor.index.showLoading({
        mask: true,
        title: "获取位置中"
      });
      latitude.value = e.detail.latitude;
      longitude.value = e.detail.longitude;
      let location = e.detail.longitude + "," + e.detail.latitude;
      common_vendor.index.request({
        url: `https://restapi.amap.com/v3/geocode/regeo?key=${GDkey}&location=${location}&extensions=base&roadlevel=0`,
        success(res) {
          console.log(res, "aa");
          locationName.value = res.data.regeocode.formatted_address;
          cityText.value = res.data.regeocode.addressComponent.city;
          covers.value[0].latitude = latitude.value;
          covers.value[0].longitude = longitude.value;
        },
        fail(e2) {
          common_vendor.index.showToast({
            title: "获取位置失败",
            icon: "none"
          });
          common_vendor.index.hideLoading();
        }
      });
      common_vendor.index.hideLoading();
    }
    function setLocation() {
      if (locationName.value != "") {
        common_vendor.index.showLoading({
          mask: true,
          title: "获取位置中"
        });
        common_vendor.index.request({
          url: `https://restapi.amap.com/v3/geocode/geo?key=${GDkey}&address=${locationName.value}&city=`,
          success(res) {
            let arr = res.data.geocodes[0].location.split(",");
            cityText.value = res.data.geocodes[0].city;
            let data = {
              latitude: arr[1],
              longitude: arr[0],
              address: locationName.value,
              province: cityText.value,
              length: searchLong.value * 1e3
            };
            if (FromIndex.value) {
              console.log("主页");
              common_vendor.index.$emit("mapDataHome", data);
            } else {
              console.log("投稿页");
              common_vendor.index.$emit("mapData", data);
            }
            common_vendor.index.navigateBack();
          },
          fail(e) {
            common_vendor.index.showToast({
              title: "获取位置失败",
              icon: "none"
            });
            common_vendor.index.hideLoading();
          }
        });
        common_vendor.index.hideLoading();
      } else {
        common_vendor.index.showToast({
          title: "请填写城市和地址",
          icon: "none"
        });
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: longitude.value,
        b: latitude.value,
        c: covers.value,
        d: common_vendor.o(getLocation),
        e: common_vendor.o(markerclick),
        f: common_assets._imports_0$4,
        g: common_vendor.o(rebackLocation),
        h: FromIndex.value
      }, FromIndex.value ? {
        i: common_vendor.o(homesearch),
        j: common_vendor.p({
          min: 1,
          max: 30,
          defaultValue: searchLong.value
        })
      } : {}, {
        k: common_vendor.o(searchAddress),
        l: common_vendor.o(searchAddress),
        m: common_vendor.o(($event) => locationName.value = $event),
        n: common_vendor.p({
          suffixIcon: "search",
          modelValue: locationName.value
        }),
        o: common_vendor.o(setLocation)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-686fc972"]]);
wx.createPage(MiniProgramPage);
