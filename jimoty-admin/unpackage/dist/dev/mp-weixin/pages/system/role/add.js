"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_uniIdRoles = require("../../../js_sdk/validator/uni-id-roles.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "uni-id-roles";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_uniIdRoles.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_uniIdRoles.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "role_id": "",
      "role_name": "",
      "permission": [],
      "comment": "",
      "create_date": null
    };
    return {
      formData,
      formOptions: {},
      rules: {
        ...getValidator(Object.keys(formData))
      }
    };
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  methods: {
    /**
     * 触发表单提交
     */
    submit() {
      common_vendor.index.showLoading({
        mask: true
      });
      this.$refs.form.validate().then((res) => {
        this.submitForm(res);
      }).catch(() => {
        common_vendor.index.hideLoading();
      });
    },
    submitForm(value) {
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
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_checkbox2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_checkbox = () => "../../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_checkbox + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.formData.role_id = $event),
    b: common_vendor.p({
      placeholder: "角色唯一标识，不可修改，不允许重复",
      trim: "both",
      modelValue: $data.formData.role_id
    }),
    c: common_vendor.p({
      name: "role_id",
      label: "唯一ID",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.role_name = $event),
    e: common_vendor.p({
      placeholder: "角色名称",
      trim: "both",
      modelValue: $data.formData.role_name
    }),
    f: common_vendor.p({
      name: "role_name",
      label: "名称",
      required: true
    }),
    g: common_vendor.o(($event) => $data.formData.permission = $event),
    h: common_vendor.p({
      multiple: true,
      collection: "uni-id-permissions",
      ["page-size"]: 500,
      field: "permission_name as text, permission_id as value",
      modelValue: $data.formData.permission
    }),
    i: common_vendor.p({
      name: "permission",
      label: "权限"
    }),
    j: common_vendor.o(($event) => $data.formData.comment = $event),
    k: common_vendor.p({
      type: "textarea",
      placeholder: "备注",
      trim: "both",
      modelValue: $data.formData.comment
    }),
    l: common_vendor.p({
      name: "comment",
      label: "备注"
    }),
    m: common_vendor.t(_ctx.$t("common.button.submit")),
    n: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    o: common_vendor.t(_ctx.$t("common.button.back")),
    p: common_vendor.sr("form", "0430fea0-0"),
    q: common_vendor.p({
      value: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
