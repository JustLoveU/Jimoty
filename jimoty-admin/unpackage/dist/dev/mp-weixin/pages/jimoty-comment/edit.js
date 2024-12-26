"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyComment = require("../../js_sdk/validator/jimoty-comment.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "jimoty-comment";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_jimotyComment.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_jimotyComment.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "send_user_id": "",
      "re_user_id": "",
      "post_id": "",
      "type": null,
      "content": "",
      "read_over": null,
      "create_date": null,
      "publish_ip": ""
    };
    return {
      formData,
      formOptions: {},
      rules: {
        ...getValidator(Object.keys(formData))
      }
    };
  },
  onLoad(e) {
    if (e.id) {
      const id = e.id;
      this.formDataId = id;
      this.getDetail(id);
    }
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
      return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
        common_vendor.index.showToast({
          title: "修改成功"
        });
        this.getOpenerEventChannel().emit("refreshData");
        setTimeout(() => common_vendor.index.navigateBack(), 500);
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "请求服务失败",
          showCancel: false
        });
      });
    },
    /**
     * 获取表单数据
     * @param {Object} id
     */
    getDetail(id) {
      common_vendor.index.showLoading({
        mask: true
      });
      db.collection(dbCollectionName).doc(id).field("send_user_id,re_user_id,post_id,type,content,read_over,create_date,publish_ip").get().then((res) => {
        const data = res.result.data[0];
        if (data) {
          this.formData = data;
        }
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
    a: common_vendor.o(($event) => $data.formData.send_user_id = $event),
    b: common_vendor.p({
      placeholder: "评论者的uid，参考 uni-id-users 表",
      modelValue: $data.formData.send_user_id
    }),
    c: common_vendor.p({
      name: "send_user_id",
      label: "评论者的uid"
    }),
    d: common_vendor.o(($event) => $data.formData.re_user_id = $event),
    e: common_vendor.p({
      placeholder: "被评论者的uid，参考 uni-id-users 表",
      modelValue: $data.formData.re_user_id
    }),
    f: common_vendor.p({
      name: "re_user_id",
      label: "被评论者的uid",
      required: true
    }),
    g: common_vendor.o(($event) => $data.formData.post_id = $event),
    h: common_vendor.p({
      placeholder: "被评论的帖子",
      modelValue: $data.formData.post_id
    }),
    i: common_vendor.p({
      name: "post_id",
      label: "被评论的帖子",
      required: true
    }),
    j: common_vendor.o(($event) => $data.formData.type = $event),
    k: common_vendor.p({
      placeholder: "评论类型(0好评1一般2差评)",
      type: "number",
      modelValue: $data.formData.type
    }),
    l: common_vendor.p({
      name: "type",
      label: "评论类型",
      required: true
    }),
    m: common_vendor.o(($event) => $data.formData.content = $event),
    n: common_vendor.p({
      placeholder: "评论内容",
      trim: "both",
      modelValue: $data.formData.content
    }),
    o: common_vendor.p({
      name: "content",
      label: "评论内容",
      required: true
    }),
    p: common_vendor.o(($event) => _ctx.binddata("read_over", $event.detail.value)),
    q: $data.formData.read_over,
    r: common_vendor.p({
      name: "read_over",
      label: "是否已阅"
    }),
    s: common_vendor.o(($event) => $data.formData.create_date = $event),
    t: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.create_date
    }),
    v: common_vendor.p({
      name: "create_date",
      label: "评论发表时间"
    }),
    w: common_vendor.o(($event) => $data.formData.publish_ip = $event),
    x: common_vendor.p({
      placeholder: "评论发表时，客户端的 IP 地址",
      modelValue: $data.formData.publish_ip
    }),
    y: common_vendor.p({
      name: "publish_ip",
      label: ""
    }),
    z: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    A: common_vendor.sr("form", "0bec9cee-0"),
    B: common_vendor.p({
      model: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
