"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyDaojuUse = require("../../js_sdk/validator/jimoty-daoju-use.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "jimoty-daoju-use";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_jimotyDaojuUse.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_jimotyDaojuUse.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "daojuUserId": "",
      "daojuPostId": "",
      "daojuType": null,
      "end_date": null,
      "delete": false,
      "create_date": null,
      "update_date": null
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
      db.collection(dbCollectionName).doc(id).field("daojuUserId,daojuPostId,daojuType,end_date,delete,create_date,update_date").get().then((res) => {
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
    a: common_vendor.o(($event) => $data.formData.daojuUserId = $event),
    b: common_vendor.p({
      placeholder: "道具使用者",
      modelValue: $data.formData.daojuUserId
    }),
    c: common_vendor.p({
      name: "daojuUserId",
      label: "道具使用者",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.daojuPostId = $event),
    e: common_vendor.p({
      placeholder: "被使用的投稿",
      modelValue: $data.formData.daojuPostId
    }),
    f: common_vendor.p({
      name: "daojuPostId",
      label: "被使用的投稿",
      required: true
    }),
    g: common_vendor.o(($event) => $data.formData.daojuType = $event),
    h: common_vendor.p({
      placeholder: "0置顶，1高亮，2刷新,3定期刷新",
      type: "number",
      modelValue: $data.formData.daojuType
    }),
    i: common_vendor.p({
      name: "daojuType",
      label: "道具类型"
    }),
    j: common_vendor.o(($event) => $data.formData.end_date = $event),
    k: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.end_date
    }),
    l: common_vendor.p({
      name: "end_date",
      label: ""
    }),
    m: common_vendor.o(($event) => _ctx.binddata("delete", $event.detail.value)),
    n: $data.formData.delete,
    o: common_vendor.p({
      name: "delete",
      label: ""
    }),
    p: common_vendor.o(($event) => $data.formData.create_date = $event),
    q: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.create_date
    }),
    r: common_vendor.p({
      name: "create_date",
      label: ""
    }),
    s: common_vendor.o(($event) => $data.formData.update_date = $event),
    t: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.update_date
    }),
    v: common_vendor.p({
      name: "update_date",
      label: ""
    }),
    w: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    x: common_vendor.sr("form", "d2b7b5de-0"),
    y: common_vendor.p({
      model: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
