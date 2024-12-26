"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/verifyName.js");
const utils_getLocalMap = require("../../utils/getLocalMap.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_homeGoods2 = common_vendor.resolveComponent("homeGoods");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_icons2 + _easycom_homeGoods2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_homeGoods = () => "../../components/homeGoods/homeGoods.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_homeGoods + _easycom_uni_load_more + homeSkeleton)();
}
const homeSkeleton = () => "./skeleton/homeSkeleton.js";
const _sfc_main = {
  __name: "home",
  setup(__props) {
    const localData = common_vendor.ref([]);
    let db = common_vendor.Zs.database();
    let dbCmd = db.command;
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const mapData = common_vendor.ref({});
    const ifLoad = common_vendor.ref(false);
    const newNotice = common_vendor.ref(0);
    const navIndex = common_vendor.ref(0);
    const Pageloading = common_vendor.ref("loading");
    const data = common_vendor.ref([
      {
        image: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/xianzhi.png",
        name: "闲置",
        id: "66f04609eef9cba934a06332",
        isShow: true
      },
      {
        image: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/social.png",
        name: "社交",
        id: "66f045f8337a9f907ceb9001",
        isShow: true
      },
      {
        image: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/adopt.png",
        name: "领养",
        id: "66f04627c3b5c99cfcd65dd0",
        isShow: true
      },
      {
        image: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/teach.png",
        name: "兴趣",
        id: "66f0461f6e5d2d42f9a67f3a",
        isShow: true
      },
      {
        image: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/concurrent.png",
        name: "互助",
        id: "66f0462d7c8de454cff0d229",
        isShow: true
      }
    ]);
    let HistoryCity;
    common_vendor.onMounted(() => {
      HistoryCity = common_vendor.index.getStorageSync("HistoryCity");
      if (!HistoryCity) {
        utils_getLocalMap.getLocalMap();
        HistoryCity = common_vendor.index.getStorageSync("HistoryCity");
      }
      mapData.value = HistoryCity;
      getData();
      ifLoad.value = true;
      console.log(uid);
      common_vendor.index.$on("refashHome", (data2) => {
        let index = localData.value.findIndex((obj) => obj._id._value == data2.post_id);
        common_vendor.nextTick$1(() => {
          if (localData.value[index].isCollect) {
            localData.value[index].isCollect = false;
          } else {
            localData.value[index].isCollect = true;
          }
        });
      });
      common_vendor.index.$on("mapDataHome", (res) => {
        let data2 = {
          city: res.address,
          latitude: Number(res.latitude),
          length: res.length,
          longitude: Number(res.longitude),
          time: Date.now()
        };
        mapData.value = data2;
        common_vendor.index.setStorageSync("HistoryCity", data2);
        HistoryCity = data2;
        reset();
      });
    });
    let timer = null;
    common_vendor.onShow(() => {
      getNewNotice();
      timer = setInterval(() => {
        getNewNotice();
      }, 3e3);
    });
    common_vendor.onHide(() => {
      clearInterval(timer);
      timer = null;
    });
    async function getNewNotice() {
      db.collection("jimoty-notice").where({ receive: uid, status: false }).count().then((count) => {
        newNotice.value = count.result.total;
      });
    }
    const thiswhere = common_vendor.ref("weight desc,browse desc,create_date desc");
    async function getData() {
      Pageloading.value = "loading";
      let postArr = await db.collection("jimoty-post").where({
        point: dbCmd.geoNear({
          geometry: new db.Geo.Point(HistoryCity.longitude, HistoryCity.latitude),
          maxDistance: HistoryCity.length,
          minDistance: 0
        })
      }).field("_id").get();
      postArr = postArr.result.data.map((item) => {
        return item._id;
      });
      if (navIndex.value == 2) {
        const temp1 = db.collection("jimoty-post").where({
          status: db.command.in([2, 5]),
          delete: 1,
          _id: dbCmd.in(postArr),
          type: 5,
          postPrice: "0.00"
        }).getTemp();
        if (navIndex.value == 0) {
          thiswhere.value = "browse desc,create_date desc";
        } else if (navIndex.value == 1) {
          thiswhere.value = "weight desc,update_date desc,create_date desc,browse desc";
        }
        const temp3 = db.collection("jimoty-collect").field("_id,post_id,user_id,clickTime").getTemp();
        const res = await db.collection(temp1, temp3).orderBy(thiswhere.value).skip(
          localData.value.length
        ).limit(15).get();
        await handleSuccess(res.result.data);
      } else {
        const temp1 = db.collection("jimoty-post").where({
          status: db.command.in([2, 5]),
          delete: 1,
          _id: dbCmd.in(
            postArr
          )
        }).getTemp();
        if (navIndex.value == 0) {
          thiswhere.value = "browse desc,create_date desc";
        } else if (navIndex.value == 1) {
          thiswhere.value = "weight desc,update_date desc,create_date desc,browse desc";
        }
        const temp3 = db.collection("jimoty-collect").field("_id,post_id,user_id,clickTime").getTemp();
        if (navIndex.value == 0) {
          const res = await db.collection(temp1, temp3).where("weight != 200").orderBy(thiswhere.value).skip(
            localData.value.length
          ).limit(15).get();
          await handleSuccess(res.result.data);
        } else if (navIndex.value == 1) {
          const res = await db.collection(temp1, temp3).orderBy(thiswhere.value).skip(
            localData.value.length
          ).limit(15).get();
          await handleSuccess(res.result.data);
        }
      }
    }
    async function handleSuccess(e) {
      if (e.length > 0) {
        Pageloading.value = "";
      } else {
        Pageloading.value = "noMore";
      }
      localData.value = [...localData.value, ...e];
      let collectArr = localData.value.map((item) => {
        return item._id._value;
      });
      let likeArr = await db.collection("jimoty-collect").where({
        post_id: dbCmd.in(collectArr),
        user_id: uid
      }).get();
      for (var i = 0; i < localData.value.length; i++) {
        let localIndex = likeArr.result.data.findIndex((find) => {
          return localData.value[i]._id._value == find.post_id;
        });
        if (localIndex !== -1) {
          localData.value[i].isCollect = true;
        }
      }
    }
    common_vendor.onPullDownRefresh(() => {
      reset();
    });
    function reset() {
      localData.value = [];
      gridIndex.value = -1;
      getData();
      console.log("加载");
      common_vendor.index.stopPullDownRefresh();
    }
    common_vendor.onReachBottom(() => {
      getData();
    });
    function openmap() {
      common_vendor.index.navigateTo({
        url: `/pages/submit/map?index=1`
      });
    }
    function opennotice() {
      common_vendor.index.navigateTo({
        url: "/pages/home/notice"
      });
    }
    const gridIndex = common_vendor.ref(-1);
    async function search(categoryId, name) {
      common_vendor.index.navigateTo({
        url: `/pages/home/categoryPage?categoryId=${categoryId}&name=${name}`
      });
    }
    function changeNav(index) {
      navIndex.value = index;
      localData.value = [];
      gridIndex.value = -1;
      if (navIndex.value == 0) {
        getData();
      } else if (navIndex.value == 1) {
        getData();
      } else {
        getData();
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: ifLoad.value
      }, ifLoad.value ? common_vendor.e({
        b: common_vendor.t(mapData.value.city ? mapData.value.city + ` 周边${mapData.value.length / 1e3}Km` : "请选择您的位置"),
        c: common_vendor.o(openmap),
        d: common_vendor.p({
          type: "right",
          size: "18"
        }),
        e: newNotice.value != 0
      }, newNotice.value != 0 ? {
        f: common_vendor.t(newNotice.value > 99 ? "99+" : newNotice.value)
      } : {}, {
        g: common_vendor.o(opennotice),
        h: common_vendor.f(data.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.isShow
          }, item.isShow ? {
            b: item.image,
            c: common_vendor.t(item.name)
          } : {}, {
            d: index,
            e: common_vendor.o(($event) => search(item.id, item.name), index),
            f: common_vendor.n(gridIndex.value === index ? "grid_active" : "")
          });
        }),
        i: common_vendor.n(navIndex.value == 0 ? "active" : ""),
        j: common_vendor.o(($event) => changeNav(0)),
        k: common_vendor.n(navIndex.value == 1 ? "active" : ""),
        l: common_vendor.o(($event) => changeNav(1)),
        m: common_vendor.n(navIndex.value == 2 ? "active" : ""),
        n: common_vendor.o(($event) => changeNav(2)),
        o: common_vendor.p({
          data: localData.value
        }),
        p: common_vendor.p({
          status: Pageloading.value
        })
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-07e72d3c"]]);
wx.createPage(MiniProgramPage);
