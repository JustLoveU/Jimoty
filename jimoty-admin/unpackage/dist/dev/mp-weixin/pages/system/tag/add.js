"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_uniIdTag = require("../../../js_sdk/validator/uni-id-tag.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "uni-id-tag";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_uniIdTag.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_uniIdTag.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "tagid": "",
      "name": "",
      "description": ""
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
        this.getOpenerEventChannel().emit("refreshCheckboxData");
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
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.formData.tagid = $event),
    b: common_vendor.p({
      placeholder: "标签的tagid",
      modelValue: $data.formData.tagid
    }),
    c: common_vendor.p({
      name: "tagid",
      label: "标签tagid",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.name = $event),
    e: common_vendor.p({
      placeholder: "标签名称",
      modelValue: $data.formData.name
    }),
    f: common_vendor.p({
      name: "name",
      label: "标签名称",
      required: true
    }),
    g: common_vendor.o([($event) => $data.formData.description = $event.detail.value, ($event) => _ctx.binddata("description", $event.detail.value)]),
    h: $data.formData.description,
    i: common_vendor.p({
      name: "description",
      label: "标签描述"
    }),
    j: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    k: common_vendor.sr("form", "35800698-0"),
    l: common_vendor.p({
      value: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
