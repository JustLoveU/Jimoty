"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotySecCheckImgLog = require("../../js_sdk/validator/jimoty-sec-check-img-log.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "jimoty-sec-check-img-log";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_jimotySecCheckImgLog.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_jimotySecCheckImgLog.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "verify_id": "",
      "traceId": "",
      "picurl": "",
      "state": null,
      "publish_date": null
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
    a: common_vendor.o(($event) => $data.formData.verify_id = $event),
    b: common_vendor.p({
      modelValue: $data.formData.verify_id
    }),
    c: common_vendor.p({
      name: "verify_id",
      label: "业务id",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.traceId = $event),
    e: common_vendor.p({
      modelValue: $data.formData.traceId
    }),
    f: common_vendor.p({
      name: "traceId",
      label: "唯一标识id"
    }),
    g: common_vendor.o(($event) => $data.formData.picurl = $event),
    h: common_vendor.p({
      modelValue: $data.formData.picurl
    }),
    i: common_vendor.p({
      name: "picurl",
      label: "图片",
      required: true
    }),
    j: common_vendor.o(($event) => $data.formData.state = $event),
    k: common_vendor.p({
      placeholder: "0待审核 1通过 2未通过",
      type: "number",
      modelValue: $data.formData.state
    }),
    l: common_vendor.p({
      name: "state",
      label: "图片状态",
      required: true
    }),
    m: common_vendor.o(($event) => $data.formData.publish_date = $event),
    n: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.publish_date
    }),
    o: common_vendor.p({
      name: "publish_date",
      label: "提交审核时间"
    }),
    p: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    q: common_vendor.sr("form", "23bfc368-0"),
    r: common_vendor.p({
      model: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
