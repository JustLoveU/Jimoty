"use strict";
const common_vendor = require("./common/vendor.js");
const pages_demo_icons_uniIcons = require("./pages/demo/icons/uni-icons.js");
const _sfc_main = {
  // 数据属性
  data() {
    return {
      // 数据属性：icons
      icons: pages_demo_icons_uniIcons.icons
    };
  },
  // 属性
  props: {
    // 属性：tag
    tag: {
      // 类型为布尔型
      type: Boolean,
      // 默认值为 true
      default: true
    },
    // 属性：fixWindow
    fixWindow: {
      // 类型为布尔型
      type: Boolean,
      // 默认值为 true
      default: true
    }
  },
  // 方法
  methods: {
    // 方法：setClipboardData，参数为 type 和 icon
    setClipboardData(type, icon) {
      let data = "uni-icons-" + icon;
      if (this.tag && type === "tag") {
        data = '<view class="' + data + '"></view>';
      }
      common_vendor.index.setClipboardData({
        // 数据为变量 data 的值
        data,
        // 成功回调函数
        success(res) {
          common_vendor.index.showToast({
            // 图标为 'none'
            icon: "none",
            // 提示信息为 '复制 ' 加上 data 的值，再加上 ' 成功！'
            title: "复制 " + data + " 成功！"
          });
        },
        // 失败回调函数
        fail(res) {
          common_vendor.index.showModal({
            // 弹窗内容为 '复制 ' 加上 data 的值，再加上 ' 失败！'
            content: "复制 " + data + " 失败！",
            // 不显示取消按钮
            showCancel: false
          });
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  _easycom_fix_window2();
}
const _easycom_fix_window = () => "./components/fix-window/fix-window.js";
if (!Math) {
  _easycom_fix_window();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(_ctx.$t("demo.icons.title")),
    b: common_vendor.t(_ctx.$t("demo.icons.describle")),
    c: common_vendor.f($data.icons, (icon, index, i0) => {
      return {
        a: common_vendor.o(($event) => $options.setClipboardData("tag", icon), index),
        b: common_vendor.n("uni-icons-" + icon),
        c: common_vendor.t(icon),
        d: common_vendor.o(($event) => $options.setClipboardData("class", icon), index),
        e: index
      };
    }),
    d: $props.fixWindow
  }, $props.fixWindow ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
exports.MiniProgramPage = MiniProgramPage;
