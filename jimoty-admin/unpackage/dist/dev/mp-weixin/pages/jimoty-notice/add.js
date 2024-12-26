"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyNotice = require("../../js_sdk/validator/jimoty-notice.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "jimoty-notice";
const uid = common_vendor.Vs.getCurrentUserInfo().uid;
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_jimotyNotice.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_jimotyNotice.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "type": 0,
      "sendPeople": uid,
      "receive": "",
      "message": "",
      "otherMessage": "系统消息",
      "status": false
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
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.formData.type = $event),
    b: common_vendor.p({
      disabled: true,
      placeholder: "通知类型(0系统消息1聊天消息2关注消息,3评论消息,4收藏消息5.关注用户上架商品消息,6商品上架消息)",
      type: "number",
      modelValue: $data.formData.type
    }),
    c: common_vendor.p({
      name: "type",
      label: "通知类型(系统消息)",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.sendPeople = $event),
    e: common_vendor.p({
      disabled: true,
      placeholder: "发送者",
      modelValue: $data.formData.sendPeople
    }),
    f: common_vendor.p({
      name: "sendPeople",
      label: "发送者"
    }),
    g: common_vendor.o(($event) => $data.formData.receive = $event),
    h: common_vendor.p({
      placeholder: "接收者",
      modelValue: $data.formData.receive
    }),
    i: common_vendor.p({
      name: "receive",
      label: "接收者",
      required: true
    }),
    j: common_vendor.o(($event) => $data.formData.message = $event),
    k: common_vendor.p({
      placeholder: "消息",
      modelValue: $data.formData.message
    }),
    l: common_vendor.p({
      name: "message",
      label: "消息",
      required: true
    }),
    m: common_vendor.o(($event) => $data.formData.otherMessage = $event),
    n: common_vendor.p({
      placeholder: "其他消息",
      modelValue: $data.formData.otherMessage
    }),
    o: common_vendor.p({
      name: "otherMessage",
      label: "其他消息"
    }),
    p: common_vendor.o(($event) => _ctx.binddata("status", $event.detail.value)),
    q: $data.formData.status,
    r: common_vendor.p({
      name: "status",
      label: "消息状态"
    }),
    s: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    t: common_vendor.sr("form", "5b248879-0"),
    v: common_vendor.p({
      model: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
