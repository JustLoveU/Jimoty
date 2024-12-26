"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  (_easycom_uni_section2 + _easycom_uni_list_item2)();
}
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_list_item = () => "../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
if (!Math) {
  (_easycom_uni_section + _easycom_uni_list_item)();
}
const _sfc_main = {
  __name: "reback_notice",
  setup(__props) {
    const db = common_vendor.Zs.database();
    common_vendor.onLoad((e) => {
      if (e) {
        getData(e.postId);
      } else {
        common_vendor.index.navigateBack();
      }
    });
    const forData = common_vendor.ref();
    async function getData(postId) {
      const res = await db.collection("jimoty-post").doc(postId).get({ getOne: true });
      const res2 = await db.collection("jimoty-category").get({
        getTreePath: {
          limitLevel: 10,
          "startWith": `_id == "${res.result.data.category}"`
        }
      });
      forData.value = res.result.data;
      forData.value.time = formatTime(res.result.data.create_date);
      forData.value.categoryNmae = res2.result.data[0].name;
    }
    function formatTime(timestamp) {
      let date = new Date(timestamp);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      date.getHours();
      date.getMinutes();
      return year + "-" + month + "-" + day + " ";
    }
    function handleLongPress() {
      let data = "标题：" + forData.value.noteTitle + "\n投稿ID：" + forData.value._id + "\n初次投稿日期：" + forData.value.time + "\n内容：" + forData.value.mainText + "\n上传地点：" + forData.value.location.province + "\n类别：" + forData.value.categoryNmae;
      common_vendor.index.setClipboardData({
        data,
        success: () => {
          common_vendor.index.showToast({
            title: "复制成功",
            icon: "success"
          });
        },
        fail: (err) => {
          console.error("复制失败", err);
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: forData.value
      }, forData.value ? {
        b: common_vendor.p({
          title: "本平台依据投稿协议中，对已满3个月期限的下述帖子进行了自动删除，无法恢复。",
          type: "line"
        }),
        c: common_vendor.p({
          title: `标题：${forData.value.noteTitle}`
        }),
        d: common_vendor.p({
          title: `投稿ID：${forData.value._id}`
        }),
        e: common_vendor.p({
          title: `初次投稿日期：${forData.value.time}`
        }),
        f: common_vendor.p({
          title: `内容：${forData.value.mainText}`
        }),
        g: common_vendor.p({
          title: `上传地点：${forData.value.location.province}`
        }),
        h: common_vendor.p({
          title: `类别：${forData.value.categoryNmae}`
        }),
        i: common_vendor.o(handleLongPress),
        j: common_vendor.p({
          title: "若您同意通过本平台进行公益捐赠，请复制上述帖子信息联系客服(HyperLink 跳转客服页面)。",
          type: "line"
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d88ef7fb"]]);
wx.createPage(MiniProgramPage);
