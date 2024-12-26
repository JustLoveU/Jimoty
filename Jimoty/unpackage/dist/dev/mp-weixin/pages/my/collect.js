"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_homeGoods2 = common_vendor.resolveComponent("homeGoods");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_homeGoods2 + _easycom_uni_load_more2)();
}
const _easycom_homeGoods = () => "../../components/homeGoods/homeGoods.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_homeGoods + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "collect",
  setup(__props) {
    const localData = common_vendor.ref([]);
    let collectArr = [];
    const loading = common_vendor.ref(true);
    let db = common_vendor.Zs.database();
    let dbCmd = db.command;
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    common_vendor.onReady(async () => {
      const res = await db.collection("jimoty-collect").where({ user_id: uid }).field("post_id").get();
      collectArr = res.result.data.map((item) => {
        return item.post_id;
      });
      console.log(collectArr, "mmmmmmmmmmm", uid);
      loadData();
    });
    async function loadData() {
      const temp1 = db.collection("jimoty-post").where({ _id: dbCmd.in(collectArr) }).field(
        "_id,userId,type,photos,location,noteTitle,mainText,postPrice,status,delete,collect,create_date,workTime,workPosition,employeeForm,category,browse"
      ).getTemp();
      const temp2 = db.collection("jimoty-collect").field("_id,post_id,user_id,clickTime").getTemp();
      const temp3 = db.collection("jimoty-category").field("_id,name,parent_id").getTemp();
      const res = await db.collection(temp1, temp2, temp3).where({
        status: db.command.in([2, 5]),
        delete: 1
      }).skip(localData.value.length).limit(10).get();
      console.log(res.result.data, "aaaaaaaaaaaaaaaaaaaaaaa");
      handleSuccess(res.result.data);
    }
    common_vendor.onMounted(() => {
      common_vendor.index.$on("refashHome", (data) => {
        let index = localData.value.findIndex((obj) => obj._id._value == data.post_id);
        common_vendor.nextTick$1(() => {
          if (localData.value[index].isCollect) {
            localData.value[index].isCollect = false;
          } else {
            localData.value[index].isCollect = true;
          }
        });
      });
    });
    async function handleSuccess(e) {
      localData.value = [...localData.value, ...e];
      let collectArr2 = localData.value.map((item) => {
        return item._id._value;
      });
      let likeArr = await db.collection("jimoty-collect").where({
        post_id: dbCmd.in(collectArr2),
        user_id: uid
      }).get();
      localData.value.forEach((item, index) => {
        let localIndex = likeArr.result.data.findIndex((find) => {
          return item._id._value == find.post_id;
        });
        if (localIndex !== -1) {
          item.isCollect = true;
        }
      });
      console.log(localData.value, "kkkkkkkkkkkkkkkkk");
      loading.value = false;
    }
    common_vendor.onPullDownRefresh(() => {
      localData.value = [];
      loadData();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      loadData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !loading.value
      }, !loading.value ? {
        b: common_vendor.p({
          data: localData.value
        })
      } : {
        c: common_vendor.p({
          status: "loading"
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
