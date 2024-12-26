"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyPayOrder = require("../../js_sdk/validator/jimoty-pay-order.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "jimoty-pay-order";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_jimotyPayOrder.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_jimotyPayOrder.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "user_id": "",
      "total_fee": null,
      "custom": null,
      "order_no": "",
      "type": "",
      "status": 0,
      "create_date": null,
      "pay_date": null
    };
    return {
      formData,
      formOptions: {
        "status_localdata": [
          {
            "text": "已关闭",
            "value": -1
          },
          {
            "text": "未支付",
            "value": 0
          },
          {
            "text": "已支付",
            "value": 1
          },
          {
            "text": "已部分退款",
            "value": 2
          },
          {
            "text": "已全额退款",
            "value": 3
          }
        ]
      },
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
      db.collection(dbCollectionName).doc(id).field("user_id,total_fee,custom,order_no,type,status,create_date,pay_date").get().then((res) => {
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
  const _component_undefined = common_vendor.resolveComponent("undefined");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _component_undefined + _easycom_uni_data_checkbox2 + _easycom_uni_datetime_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_checkbox + _easycom_uni_datetime_picker + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.formData.user_id = $event),
    b: common_vendor.p({
      placeholder: "用户id，参考uni-id-users表",
      modelValue: $data.formData.user_id
    }),
    c: common_vendor.p({
      name: "user_id",
      label: "用户ID"
    }),
    d: common_vendor.o(($event) => $data.formData.total_fee = $event),
    e: common_vendor.p({
      placeholder: "订单总金额，单位为分，100等于1元",
      type: "number",
      modelValue: $data.formData.total_fee
    }),
    f: common_vendor.p({
      name: "total_fee",
      label: "订单总金额"
    }),
    g: common_vendor.o(($event) => $data.formData.custom = $event),
    h: common_vendor.p({
      modelValue: $data.formData.custom
    }),
    i: common_vendor.p({
      name: "custom",
      label: "自定义数据"
    }),
    j: common_vendor.o(($event) => $data.formData.order_no = $event),
    k: common_vendor.p({
      placeholder: "业务系统订单号，控制在20-28位（不可以是24位,24位在阿里云空间可能会有问题，可重复，代表1个业务订单会有多次付款的情况）",
      trim: "both",
      modelValue: $data.formData.order_no
    }),
    l: common_vendor.p({
      name: "order_no",
      label: "业务系统订单号"
    }),
    m: common_vendor.o(($event) => $data.formData.type = $event),
    n: common_vendor.p({
      placeholder: "订单类型 test：订单付款  等等，可自定义",
      trim: "both",
      modelValue: $data.formData.type
    }),
    o: common_vendor.p({
      name: "type",
      label: "订单类型"
    }),
    p: common_vendor.o(($event) => $data.formData.status = $event),
    q: common_vendor.p({
      localdata: $data.formOptions.status_localdata,
      modelValue: $data.formData.status
    }),
    r: common_vendor.p({
      name: "status",
      label: "订单状态"
    }),
    s: common_vendor.o(($event) => $data.formData.create_date = $event),
    t: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.create_date
    }),
    v: common_vendor.p({
      name: "create_date",
      label: "创建时间"
    }),
    w: common_vendor.o(($event) => $data.formData.pay_date = $event),
    x: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.pay_date
    }),
    y: common_vendor.p({
      name: "pay_date",
      label: "支付时间"
    }),
    z: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    A: common_vendor.sr("form", "1b1fc902-0"),
    B: common_vendor.p({
      model: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
