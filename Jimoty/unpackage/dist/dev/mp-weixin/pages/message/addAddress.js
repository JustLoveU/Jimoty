"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_picker2 = common_vendor.resolveComponent("uni-data-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_picker = () => "../../uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_picker + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "addAddress",
  setup(__props) {
    const ifdefault = common_vendor.ref(false);
    const valiFormData = common_vendor.ref({
      name: "",
      phone: "",
      country: "",
      address: ""
    });
    const choose = () => {
      ifdefault.value = !ifdefault.value;
    };
    const onchange = (e) => {
      const value = e.detail.value;
      console.log(value, "kkkkkkkkkkkkkkkkk");
    };
    const submit = () => {
      form.value.validate().then((res) => {
        console.log("success", res);
        common_vendor.index.showToast({
          title: `已保存`
        });
      }).catch((err) => {
        console.log("err", err);
      });
    };
    const form = common_vendor.ref(null);
    const rules = common_vendor.ref({
      phone: {
        rules: [
          {
            required: true,
            errorMessage: "请输入电话号码"
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            errorMessage: "请输入正确的手机号"
          }
        ]
      },
      name: {
        rules: [{
          required: true,
          errorMessage: "请输入名字"
        }]
      },
      country: {
        rules: [{
          required: true,
          errorMessage: "请选择城市"
        }]
      },
      address: {
        rules: [{
          required: true,
          errorMessage: "请输入详细地址"
        }]
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(choose),
        b: common_vendor.n(ifdefault.value ? "active" : ""),
        c: common_vendor.o(($event) => valiFormData.value.name = $event),
        d: common_vendor.p({
          placeholder: "请输入姓名",
          modelValue: valiFormData.value.name
        }),
        e: common_vendor.p({
          label: "联系人",
          required: true,
          name: "name"
        }),
        f: common_vendor.o(($event) => valiFormData.value.phone = $event),
        g: common_vendor.p({
          placeholder: "请输入手机号",
          modelValue: valiFormData.value.phone
        }),
        h: common_vendor.p({
          label: "手机号",
          required: true,
          name: "phone"
        }),
        i: common_vendor.o(onchange),
        j: common_vendor.p({
          ["clear-icon"]: "false",
          placeholder: "请选择所在地区",
          ["popup-title"]: "请选择城市",
          collection: "opendb-city-china",
          field: "code as value, name as text",
          orderby: "value asc",
          ["step-searh"]: true,
          ["self-field"]: "code",
          ["parent-field"]: "parent_code"
        }),
        k: common_vendor.p({
          label: "所在地区",
          required: true,
          name: "country"
        }),
        l: common_vendor.o(($event) => valiFormData.value.address = $event),
        m: common_vendor.p({
          type: "textarea",
          ["auto-height"]: "true",
          maxlength: "50",
          placeholder: "请输入详细地址",
          modelValue: valiFormData.value.address
        }),
        n: common_vendor.p({
          label: "详细地址",
          required: true,
          name: "address"
        }),
        o: common_vendor.sr(form, "3f2857e9-0", {
          "k": "form"
        }),
        p: common_vendor.p({
          rules: rules.value,
          modelValue: valiFormData.value
        }),
        q: common_vendor.o(submit)
      };
    };
  }
};
wx.createPage(_sfc_main);
