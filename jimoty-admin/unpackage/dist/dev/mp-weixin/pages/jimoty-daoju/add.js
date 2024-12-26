"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyDaoju = require("../../js_sdk/validator/jimoty-daoju.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "jimoty-daoju";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_jimotyDaoju.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_jimotyDaoju.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "daoUserId": "",
      "daojuType": null,
      "daojuNum": 0,
      "last_use_date": null,
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
    a: common_vendor.o(($event) => $data.formData.daoUserId = $event),
    b: common_vendor.p({
      placeholder: "道具所属者uid，参考 uni-id-users 表",
      modelValue: $data.formData.daoUserId
    }),
    c: common_vendor.p({
      name: "daoUserId",
      label: "道具所属者uid",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.daojuType = $event),
    e: common_vendor.p({
      placeholder: "0置顶，1高亮，2刷新,3定期刷新",
      type: "number",
      modelValue: $data.formData.daojuType
    }),
    f: common_vendor.p({
      name: "daojuType",
      label: "道具类型",
      required: true
    }),
    g: common_vendor.o(($event) => $data.formData.daojuNum = $event),
    h: common_vendor.p({
      placeholder: "道具数量",
      type: "number",
      modelValue: $data.formData.daojuNum
    }),
    i: common_vendor.p({
      name: "daojuNum",
      label: "道具数量"
    }),
    j: common_vendor.o(($event) => $data.formData.last_use_date = $event),
    k: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.last_use_date
    }),
    l: common_vendor.p({
      name: "last_use_date",
      label: "最后一次使用的时间"
    }),
    m: common_vendor.o(($event) => $data.formData.create_date = $event),
    n: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.create_date
    }),
    o: common_vendor.p({
      name: "create_date",
      label: "创建道具的时间"
    }),
    p: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    q: common_vendor.sr("form", "25a87ba0-0"),
    r: common_vendor.p({
      model: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
