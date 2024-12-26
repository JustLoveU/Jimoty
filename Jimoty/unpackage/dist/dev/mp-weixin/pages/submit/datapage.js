"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_load_more2 + _easycom_uni_icons2)();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_load_more + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "datapage",
  setup(__props) {
    let db = common_vendor.Zs.database();
    const breadcrumbArr = common_vendor.ref([]);
    const needShow = common_vendor.ref([]);
    const ifLoding = common_vendor.ref(true);
    const rebackData = common_vendor.ref([]);
    const topclass = common_vendor.ref(false);
    const overId = common_vendor.ref();
    common_vendor.onLoad(async (e) => {
      console.log(e.index, "llllllllllllllllLLLLLLLLLLLLL", e.parentId);
      if (e.index == "1") {
        console.log("地图获取数据");
        topclass.value = true;
      } else {
        console.log("投稿获取数据");
        topclass.value = false;
      }
      if (topclass.value) {
        db.collection("jimoty-category").field("_id,name").get({
          getTree: {
            limitLevel: 1
          }
        }).then((res) => {
          needShow.value = [...res.result.data];
          let nowData = {
            name: "首页",
            data: [...needShow.value]
          };
          breadcrumbArr.value.push(nowData);
        });
      } else {
        const res = await db.collection("jimoty-category").field("_id,name").get({ getTree: { startWith: `_id=="${e.parentId}"`, limitLevel: 10 } });
        needShow.value = res.result.data[0].children;
        let nowData = {
          name: "首页",
          data: [...needShow.value]
        };
        breadcrumbArr.value.push(nowData);
      }
      ifLoding.value = false;
    });
    function getOver() {
      let data = {
        categery: rebackData.value,
        id: overId.value
      };
      if (topclass.value) {
        common_vendor.index.$emit("categerySearchData", data);
      } else {
        common_vendor.index.$emit("categeryData", data);
      }
      common_vendor.index.navigateBack();
    }
    const ifoperate2 = common_vendor.ref(false);
    const toggleChildren = (data, name, id) => {
      if (ifoperate2.value)
        return;
      ifoperate2.value = true;
      overId.value = id;
      if (data.length > 0) {
        needShow.value = data;
        let nowData = {
          name,
          data: [...data]
        };
        rebackData.value.push(name);
        breadcrumbArr.value.push(nowData);
        console.log(rebackData.value, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      } else {
        rebackData.value.push(name);
        let data2 = {
          categery: rebackData.value,
          id
        };
        if (topclass.value) {
          common_vendor.index.$emit("categerySearchData", data2);
        } else {
          common_vendor.index.$emit("categeryData", data2);
        }
        common_vendor.index.navigateBack();
      }
      ifoperate2.value = false;
    };
    const ifoperate = common_vendor.ref(false);
    const navBack = (index) => {
      if (ifoperate.value)
        return;
      ifoperate.value = true;
      breadcrumbArr.value.splice(index + 1, breadcrumbArr.value.length - index - 1);
      rebackData.value.splice(index, rebackData.value.length);
      needShow.value = breadcrumbArr.value[index].data;
      ifoperate.value = false;
      console.log(index, "oooo", rebackData.value);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: ifLoding.value
      }, ifLoding.value ? {
        b: common_vendor.p({
          status: "loading"
        })
      } : common_vendor.e({
        c: common_vendor.f(breadcrumbArr.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index,
            c: common_vendor.o(($event) => navBack(index), index)
          };
        }),
        d: topclass.value
      }, topclass.value ? {
        e: common_vendor.o(getOver)
      } : {}, {
        f: common_vendor.f(needShow.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: "1097401c-1-" + i0,
            c: index,
            d: common_vendor.o(($event) => toggleChildren(item.children ? item.children : [], item.name, item._id), index)
          };
        }),
        g: common_vendor.p({
          type: "right",
          size: "24"
        })
      }));
    };
  }
};
wx.createPage(_sfc_main);
