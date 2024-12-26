"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_noticeOperate = require("../../utils/noticeOperate.js");
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_search_bar2 + _easycom_uni_dateformat2 + _easycom_uni_icons2 + _easycom_uni_load_more2)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_dateformat + _easycom_uni_icons + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "categoryPage",
  setup(__props) {
    const db = common_vendor.Zs.database();
    const dbCmd = db.command;
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const categoryArr = common_vendor.ref([]);
    const localData = common_vendor.ref([]);
    const text_condition = common_vendor.ref("");
    common_vendor.onPullDownRefresh(async () => {
      localData.value = [];
      await getData();
      console.log("加载");
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      getData();
    });
    let HistoryCity;
    common_vendor.onLoad((e) => {
      common_vendor.index.setNavigationBarTitle({
        title: e.name
      });
      HistoryCity = common_vendor.index.getStorageSync("HistoryCity");
      getCategoryArr(e.categoryId);
    });
    const Pageloading = common_vendor.ref("loading");
    const thiswhere = common_vendor.ref("weight desc,browse desc,create_date desc");
    async function getCategoryArr(id) {
      const res = await db.collection("jimoty-category").field("_id,name").get({
        getTree: {
          limitLevel: 10,
          // 最大查询层级（不包含当前层级），可以省略默认10级，最大15，最小1
          startWith: `_id=="${id}"`
          // 末级节点的条件，此初始条件不可以省略
        }
      });
      categoryArr.value = getAllValues(res.result.data[0]);
      getData();
    }
    function getAllValues(tree) {
      let values = [];
      function traverse(node) {
        values.push(node._id);
        for (let i = 0; i < node.children.length; i++) {
          traverse(node.children[i]);
        }
      }
      traverse(tree);
      return values;
    }
    async function getData() {
      Pageloading.value = "loading";
      let postArr = await db.collection("jimoty-post").where({
        category: dbCmd.in(categoryArr.value),
        point: dbCmd.geoNear({
          geometry: new db.Geo.Point(HistoryCity.longitude, HistoryCity.latitude),
          maxDistance: HistoryCity.length,
          minDistance: 0
        })
      }).field("_id").get();
      postArr = postArr.result.data.map((item) => {
        return item._id;
      });
      const temp1 = db.collection("jimoty-post").where({
        status: dbCmd.in([2, 5]),
        delete: 1,
        _id: dbCmd.in(postArr)
      }).getTemp();
      const temp3 = db.collection("jimoty-collect").field("_id,post_id,user_id,clickTime").getTemp();
      const temp4 = db.collection("jimoty-category").field("_id,parent_id,name").getTemp();
      const res = await db.collection(temp1, temp3, temp4).where(
        `${new RegExp(text_condition.value, "i")}.test(noteTitle)`
      ).orderBy(thiswhere.value).skip(
        localData.value.length
      ).limit(15).get();
      await handleSuccess(res.result.data);
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
    function search(e) {
      console.log(e, "搜索条件");
      text_condition.value = e.value;
      localData.value = [];
      getData();
    }
    const gotoDetail = (postId) => {
      common_vendor.index.navigateTo({
        url: `/pages/home/detail?postId=${postId}`
      });
    };
    common_vendor.ref([
      "社交",
      "兼职",
      "教培",
      "领养",
      "闲置"
    ]);
    const Inoperation1 = common_vendor.ref(false);
    async function collect(postId, userId, index, isCollect) {
      if (!uid) {
        common_vendor.index.navigateTo({
          url: "uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        });
        return;
      }
      if (Inoperation1.value)
        return;
      Inoperation1.value = true;
      if (isCollect) {
        prop.data[index].isCollect = !prop.data[index].isCollect;
        collectAdd(postId, -1);
        db.collection("jimoty-collect").where(`post_id=="${postId}" && user_id==$cloudEnv_uid`).remove();
        utils_noticeOperate.removeNotice(uid, userId, 4, postId);
      } else {
        db.collection("jimoty-collect").add({
          post_id: postId
        }).then((res) => {
          if (uid != userId) {
            utils_noticeOperate.makeNotice(uid, userId, 4, postId);
          }
        });
        prop.data[index].like++;
        prop.data[index].isCollect = !prop.data[index].isCollect;
        collectAdd(postId, 1);
      }
      Inoperation1.value = false;
    }
    const collectAdd = async (postId, num) => {
      const data = await db.collection("jimoty-post").where(`_id=="${postId}"`).field("collect").get({ getOne: true });
      let thislike = data.result.data.collect + num;
      await db.collection("jimoty-post").where(`_id=="${postId}"`).update({ collect: thislike });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(search),
        b: common_vendor.p({
          radius: "5",
          placeholder: "请输入搜索内容",
          clearButton: "auto",
          cancelButton: "none"
        }),
        c: common_vendor.f(localData.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.photos && item.photos[0] ? item.photos[0] : "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/moren.png",
            b: common_vendor.t(item.category[0].name),
            c: common_vendor.t(item.noteTitle),
            d: item.postPrice
          }, item.postPrice ? {
            e: common_vendor.t(item.postPrice)
          } : {}, {
            f: common_vendor.t(item.location && item.location.province ? item.location.province : "未知"),
            g: "939b1382-1-" + i0,
            h: common_vendor.p({
              date: item.create_date,
              threshold: [6e4, 864e5],
              format: "MM/dd"
            }),
            i: !item.isCollect
          }, !item.isCollect ? {
            j: "939b1382-2-" + i0,
            k: common_vendor.p({
              type: "star",
              size: "24"
            })
          } : {
            l: "939b1382-3-" + i0,
            m: common_vendor.p({
              type: "star-filled",
              size: "24"
            })
          }, {
            n: common_vendor.o(($event) => collect(item._id._value, item.userId[0]._id ? item.userId[0]._id : item.userId, index, item.isCollect), index),
            o: index,
            p: common_vendor.o(($event) => gotoDetail(item._id._value), index),
            q: common_vendor.n((item == null ? void 0 : item.hightLight) ? "active" : ""),
            r: common_vendor.n((item == null ? void 0 : item.weight) == 200 ? "prActive" : "")
          });
        }),
        d: common_vendor.p({
          status: Pageloading.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-939b1382"]]);
wx.createPage(MiniProgramPage);
