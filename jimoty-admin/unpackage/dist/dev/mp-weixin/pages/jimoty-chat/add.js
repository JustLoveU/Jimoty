"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyChat = require("../../js_sdk/validator/jimoty-chat.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "jimoty-chat";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_jimotyChat.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_jimotyChat.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "userId": "",
      "friendId": "",
      "postId": "",
      "delete": null,
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
    a: common_vendor.o(($event) => $data.formData.userId = $event),
    b: common_vendor.p({
      placeholder: "消息发送方 UserID（用于指定发送消息方帐号）",
      modelValue: $data.formData.userId
    }),
    c: common_vendor.p({
      name: "userId",
      label: "消息框创建者",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.friendId = $event),
    e: common_vendor.p({
      placeholder: "消息接收方 UserID",
      modelValue: $data.formData.friendId
    }),
    f: common_vendor.p({
      name: "friendId",
      label: "消息框接收方",
      required: true
    }),
    g: common_vendor.o(($event) => $data.formData.postId = $event),
    h: common_vendor.p({
      placeholder: "讨论的商品 postId",
      modelValue: $data.formData.postId
    }),
    i: common_vendor.p({
      name: "postId",
      label: "讨论的商品",
      required: true
    }),
    j: common_vendor.o(($event) => _ctx.binddata("delete", $event.detail.value)),
    k: $data.formData.delete,
    l: common_vendor.p({
      name: "delete",
      label: "是否删除"
    }),
    m: common_vendor.o(($event) => $data.formData.create_date = $event),
    n: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.create_date
    }),
    o: common_vendor.p({
      name: "create_date",
      label: "消息框创建时间"
    }),
    p: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    q: common_vendor.sr("form", "5339d28e-0"),
    r: common_vendor.p({
      model: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
