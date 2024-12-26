"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyChatMessage = require("../../js_sdk/validator/jimoty-chat-message.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "jimoty-chat-message";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_jimotyChatMessage.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_jimotyChatMessage.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "chatBoxId": "",
      "userId": "",
      "friendId": "",
      "status": null,
      "message": "",
      "type": null,
      "delete": null,
      "time": null
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
    a: common_vendor.o(($event) => $data.formData.chatBoxId = $event),
    b: common_vendor.p({
      placeholder: "消息所在的消息框",
      modelValue: $data.formData.chatBoxId
    }),
    c: common_vendor.p({
      name: "chatBoxId",
      label: "消息框id",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.userId = $event),
    e: common_vendor.p({
      placeholder: "消息发送方 UserID（用于指定发送消息方帐号）",
      modelValue: $data.formData.userId
    }),
    f: common_vendor.p({
      name: "userId",
      label: "消息发送方",
      required: true
    }),
    g: common_vendor.o(($event) => $data.formData.friendId = $event),
    h: common_vendor.p({
      placeholder: "消息接收方 UserID",
      modelValue: $data.formData.friendId
    }),
    i: common_vendor.p({
      name: "friendId",
      label: "消息接收方",
      required: true
    }),
    j: common_vendor.o(($event) => _ctx.binddata("status", $event.detail.value)),
    k: $data.formData.status,
    l: common_vendor.p({
      name: "status",
      label: "是否已读"
    }),
    m: common_vendor.o(($event) => $data.formData.message = $event),
    n: common_vendor.p({
      placeholder: "消息内容",
      modelValue: $data.formData.message
    }),
    o: common_vendor.p({
      name: "message",
      label: "消息内容"
    }),
    p: common_vendor.o(($event) => $data.formData.type = $event),
    q: common_vendor.p({
      placeholder: "消息内容（0文字，1图片链接，2音频链接，3地图）",
      type: "number",
      modelValue: $data.formData.type
    }),
    r: common_vendor.p({
      name: "type",
      label: "消息类型"
    }),
    s: common_vendor.o(($event) => _ctx.binddata("delete", $event.detail.value)),
    t: $data.formData.delete,
    v: common_vendor.p({
      name: "delete",
      label: "是否删除"
    }),
    w: common_vendor.o(($event) => $data.formData.time = $event),
    x: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.time
    }),
    y: common_vendor.p({
      name: "time",
      label: "消息创建时间"
    }),
    z: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    A: common_vendor.sr("form", "66fca0f3-0"),
    B: common_vendor.p({
      model: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
