"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyCategory = require("../../js_sdk/validator/jimoty-category.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "jimoty-category";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_jimotyCategory.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_jimotyCategory.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "name": "",
      "parent_id": "",
      "create_time": null
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
     * 验证表单并提交
     */
    submit() {
      common_vendor.index.showLoading({
        mask: true
      });
      this.$refs.form.validate().then((res) => {
        return this.submitForm(res);
      }).catch(() => {
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    /**
     * 提交表单
     */
    submitForm(value) {
      return db.collection(dbCollectionName).add(value).then((res) => {
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
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_datetime_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_datetime_picker + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.formData.name = $event),
    b: common_vendor.p({
      placeholder: "类目名称",
      modelValue: $data.formData.name
    }),
    c: common_vendor.p({
      name: "name",
      label: ""
    }),
    d: common_vendor.o(($event) => $data.formData.parent_id = $event),
    e: common_vendor.p({
      placeholder: "父id",
      modelValue: $data.formData.parent_id
    }),
    f: common_vendor.p({
      name: "parent_id",
      label: ""
    }),
    g: common_vendor.o(($event) => $data.formData.create_time = $event),
    h: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.create_time
    }),
    i: common_vendor.p({
      name: "create_time",
      label: ""
    }),
    j: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    k: common_vendor.sr("form", "6238f242-0"),
    l: common_vendor.p({
      model: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
