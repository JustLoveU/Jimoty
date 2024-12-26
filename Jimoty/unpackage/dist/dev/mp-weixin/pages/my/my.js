"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/verifyName.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
if (!Array) {
  const _easycom_cloud_image2 = common_vendor.resolveComponent("cloud-image");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_cloud_image2 + _easycom_uni_icons2)();
}
const _easycom_cloud_image = () => "../../uni_modules/uni-id-pages/components/cloud-image/cloud-image.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_cloud_image + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "my",
  setup(__props) {
    common_vendor.Zs.database();
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const isApple = common_vendor.ref(false);
    common_vendor.onLoad(() => {
      let brand = common_vendor.index.getDeviceInfo().deviceBrand;
      console.log("########获取设备", brand);
      if (brand == "iphone") {
        isApple.value = true;
      }
    });
    const userInfo = common_vendor.computed(() => {
      return uni_modules_uniIdPages_common_store.store.userInfo;
    });
    const hasLogin = common_vendor.computed(() => {
      return uni_modules_uniIdPages_common_store.store.hasLogin;
    });
    const ucenterList1 = common_vendor.ref([
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/tiezi.png",
        text: "帖子列表",
        to: `/pages/my/draft?index=${0}`
      },
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/caogao.png",
        text: "我的草稿",
        to: `/pages/my/draft?index=${1}`
      }
    ]);
    const ucenterList2 = common_vendor.ref([
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/shoucang.png",
        text: "收藏夹",
        to: "/pages/my/collect"
      },
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/lishi.png",
        text: "浏览记录",
        to: `/pages/my/draft?index=${2}`
      },
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/mysearch.png",
        text: "设置保存的新通知",
        to: "/pages/my/notice"
      }
    ]);
    const ucenterList3 = common_vendor.ref([
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/购物车空.png",
        text: "我的收获",
        to: "/pages/my/buy"
      },
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/bi.png",
        text: "市级特权",
        to: "/pages/my/member"
      },
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/p.png",
        text: "我的积分",
        to: "/pages/my/point"
      },
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/zhanghu.png",
        text: "账户设置",
        to: "/uni_modules/uni-id-pages/pages/userinfo/userinfo"
      },
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/pingjia.png",
        text: "我的评价",
        to: "/pages/my/comment"
      },
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/guanzhu.png",
        text: "关注列表",
        to: "/pages/my/follow"
      }
    ]);
    const ucenterList5 = common_vendor.ref([
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/购物车空.png",
        text: "我的收获",
        to: "/pages/my/buy"
      },
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/bi.png",
        text: "市级特权",
        to: "/pages/my/member"
      },
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/zhanghu.png",
        text: "账户设置",
        to: "/uni_modules/uni-id-pages/pages/userinfo/userinfo"
      },
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/pingjia.png",
        text: "我的评价",
        to: "/pages/my/comment"
      },
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/guanzhu.png",
        text: "关注列表",
        to: "/pages/my/follow"
      }
    ]);
    const ucenterList4 = common_vendor.ref([
      {
        icon: "https://mp-67be408c-9398-4e3f-bf46-1df6dcf05919.cdn.bspapp.com/systemStorage/feedBack.png",
        text: "意见反馈",
        to: "/pages/my/feedBack"
      }
    ]);
    const toUserInfo = () => {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
      });
    };
    const toMyDetail = () => {
      common_vendor.index.navigateTo({
        url: `/pages/my/myDetail?userId=${uid}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: hasLogin.value && userInfo.value.avatar_file && userInfo.value.avatar_file.url
      }, hasLogin.value && userInfo.value.avatar_file && userInfo.value.avatar_file.url ? {
        b: common_vendor.o(toMyDetail),
        c: common_vendor.p({
          width: "150rpx",
          height: "150rpx",
          src: userInfo.value.avatar_file.url
        })
      } : {
        d: common_vendor.p({
          color: "#ffffff",
          size: "50",
          type: "person-filled"
        })
      }, {
        e: hasLogin.value
      }, hasLogin.value ? {
        f: common_vendor.t(userInfo.value.nickname)
      } : {
        g: common_vendor.o(toUserInfo)
      }, {
        h: common_vendor.f(ucenterList1.value, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.text),
            c: "1bd6b491-2-" + i0,
            d: item.to,
            e: index
          };
        }),
        i: common_vendor.p({
          type: "right",
          size: "26"
        }),
        j: common_vendor.f(ucenterList2.value, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.text),
            c: "1bd6b491-3-" + i0,
            d: item.to,
            e: index
          };
        }),
        k: common_vendor.p({
          type: "right",
          size: "26"
        }),
        l: common_vendor.f(isApple.value ? ucenterList5.value : ucenterList3.value, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.text),
            c: "1bd6b491-4-" + i0,
            d: item.to,
            e: index
          };
        }),
        m: common_vendor.p({
          type: "right",
          size: "26"
        }),
        n: common_vendor.f(ucenterList4.value, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.text),
            c: "1bd6b491-5-" + i0,
            d: index
          };
        }),
        o: common_vendor.p({
          type: "right",
          size: "26"
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
