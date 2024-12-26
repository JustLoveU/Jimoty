"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_opendbAdminMenus = require("../../../js_sdk/validator/opendb-admin-menus.js");
const Icons = () => "../../demo/icons/icons2.js";
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "opendb-admin-menus";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_opendbAdminMenus.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_opendbAdminMenus.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  components: {
    Icons
  },
  data() {
    return {
      formData: {
        "menu_id": "",
        "name": "",
        "icon": "",
        "url": "",
        "sort": null,
        "parent_id": "",
        "permission": [],
        "enable": true
      },
      rules: {
        ...getValidator(["menu_id", "name", "icon", "url", "sort", "parent_id", "permission", "enable"])
      }
    };
  },
  onLoad(e) {
    if (e.parent_id) {
      this.formData.parent_id = e.parent_id;
    }
  },
  methods: {
    /**
     * 触发表单提交
     */
    submitForm() {
      this.$refs.form.submit();
    },
    /**
     * 表单提交
     * @param {Object} event 回调参数 Function(callback:{value,errors})
     */
    submit(event) {
      const {
        value,
        errors
      } = event.detail;
      if (errors) {
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中...",
        mask: true
      });
      db.collection(dbCollectionName).add(value).then((res) => {
        common_vendor.index.showToast({
          title: "新增成功"
        });
        this.getOpenerEventChannel().emit("refreshData");
        setTimeout(() => common_vendor.index.navigateBack(), 500);
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "请求服务失败",
          showCancel: false
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    showIconPopup() {
      this.$refs.iconPopup.open();
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_link2 = common_vendor.resolveComponent("uni-link");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _component_Icons = common_vendor.resolveComponent("Icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_link2 + _easycom_uni_data_checkbox2 + _easycom_uni_forms2 + _component_Icons + _easycom_uni_popup2)();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_link = () => "../../../uni_modules/uni-link/components/uni-link/uni-link.js";
const _easycom_uni_data_checkbox = () => "../../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_link + _easycom_uni_data_checkbox + _easycom_uni_forms + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.formData.menu_id = $event),
    b: common_vendor.p({
      clearable: false,
      placeholder: "请输入菜单项的ID，不可重复",
      modelValue: $data.formData.menu_id
    }),
    c: common_vendor.p({
      name: "menu_id",
      label: "标识",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.name = $event),
    e: common_vendor.p({
      clearable: false,
      placeholder: "请输入菜单名称",
      modelValue: $data.formData.name
    }),
    f: common_vendor.p({
      name: "name",
      label: "显示名称",
      required: true
    }),
    g: common_vendor.o((...args) => $options.showIconPopup && $options.showIconPopup(...args)),
    h: common_vendor.o(($event) => $data.formData.icon = $event),
    i: common_vendor.p({
      clearable: false,
      placeholder: "请输入菜单图标css样式类名",
      modelValue: $data.formData.icon
    }),
    j: common_vendor.p({
      ["font-size"]: "12",
      href: "https://uniapp.dcloud.net.cn/uniCloud/admin?id=icon-%e5%9b%be%e6%a0%87",
      text: "如何使用自定义图标？"
    }),
    k: common_vendor.p({
      name: "icon",
      label: "图标class"
    }),
    l: common_vendor.o(($event) => $data.formData.url = $event),
    m: common_vendor.p({
      clearable: false,
      placeholder: "URL必须是/开头，若URL为空代表是目录而不是叶子节点",
      modelValue: $data.formData.url
    }),
    n: common_vendor.p({
      name: "url",
      label: "页面URL"
    }),
    o: common_vendor.o(($event) => $data.formData.sort = $event),
    p: common_vendor.p({
      clearable: false,
      placeholder: "请输入菜单序号（越大越靠后）",
      modelValue: $data.formData.sort
    }),
    q: common_vendor.p({
      name: "sort",
      label: "序号"
    }),
    r: common_vendor.o(($event) => $data.formData.parent_id = $event),
    s: common_vendor.p({
      disabled: true,
      clearable: false,
      placeholder: "新增菜单时自动填充, 一级菜单不需要填写",
      modelValue: $data.formData.parent_id
    }),
    t: common_vendor.p({
      name: "parent_id",
      label: "父菜单标识"
    }),
    v: common_vendor.o(($event) => $data.formData.permission = $event),
    w: common_vendor.p({
      multiple: true,
      collection: "uni-id-permissions",
      ["page-size"]: 500,
      field: "permission_name as text, permission_id as value",
      modelValue: $data.formData.permission
    }),
    x: common_vendor.p({
      name: "permission",
      label: "权限列表"
    }),
    y: common_vendor.o(($event) => _ctx.binddata("enable", $event.detail.value)),
    z: $data.formData.enable,
    A: common_vendor.p({
      name: "enable",
      label: "是否启用"
    }),
    B: common_vendor.t(_ctx.$t("common.button.submit")),
    C: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    D: common_vendor.t(_ctx.$t("common.button.back")),
    E: common_vendor.sr("form", "2e5d46ae-0"),
    F: common_vendor.o($options.submit),
    G: common_vendor.o(($event) => $data.formData = $event),
    H: common_vendor.p({
      labelWidth: "80",
      rules: $data.rules,
      validateTrigger: "bind",
      modelValue: $data.formData
    }),
    I: common_vendor.p({
      tag: false,
      ["fix-window"]: false
    }),
    J: common_vendor.sr("iconPopup", "2e5d46ae-17"),
    K: common_vendor.p({
      type: "center"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2e5d46ae"]]);
wx.createPage(MiniProgramPage);
