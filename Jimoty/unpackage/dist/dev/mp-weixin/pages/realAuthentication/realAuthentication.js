"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../uni_modules/uni-id-pages/common/store.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2 + _easycom_uni_data_checkbox2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms + _easycom_uni_data_checkbox)();
}
const _sfc_main = {
  __name: "realAuthentication",
  setup(__props) {
    const db = common_vendor.Zs.database();
    const uid = common_vendor.Zs.getCurrentUserInfo().uid;
    const checkbox1 = common_vendor.ref([]);
    const form = common_vendor.ref(null);
    const formData = common_vendor.ref({
      name: "",
      idcard: ""
    });
    const check = common_vendor.ref([{
      text: "",
      value: 0
    }]);
    common_vendor.onLoad(() => {
    });
    common_vendor.onUnload(() => {
    });
    const rules = common_vendor.ref({
      // 对name字段进行必填验证
      name: {
        rules: [
          {
            required: true,
            errorMessage: "请输入姓名"
          },
          {
            pattern: /^[\u4e00-\u9fa5]{2,4}$/,
            errorMessage: "姓名长度在 2 到 4 个中文字符"
          }
        ]
      },
      // 对idcard字段进行必填验证
      idcard: {
        rules: [
          {
            required: true,
            errorMessage: "请输入身份证号"
          },
          {
            pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])\d{3}(\d|X)$/,
            errorMessage: "请输入正确的身份证"
          }
        ]
      }
    });
    const ifOperation = common_vendor.ref(false);
    function submit() {
      console.log(checkbox1.value);
      if (ifOperation.value)
        return;
      ifOperation.value = true;
      if (checkbox1.value.length > 0) {
        form.value.validate().then((res) => {
          console.log("表单数据信息：", res);
          let data = {
            identity: formData.value.idcard,
            real_name: formData.value.name,
            auth_status: 2
          };
          db.collection("uni-id-users").doc(uid).update({ realname_auth: data });
          let userinfo = common_vendor.index.getStorageSync("uni-id-pages-userInfo");
          userinfo.realNameStatus = 2;
          common_vendor.index.setStorageSync("uni-id-pages-userInfo", userinfo);
          common_vendor.index.showToast({
            title: "已完成实名认证",
            icon: "none"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 800);
        }).catch((err) => {
          console.log("表单错误信息：", err);
        });
      } else {
        common_vendor.index.showToast({
          title: "请勾选并阅读协议",
          icon: "none"
        });
      }
      ifOperation.value = false;
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => formData.value.name = $event),
        b: common_vendor.p({
          type: "text",
          placeholder: "请输入您的真实姓名",
          modelValue: formData.value.name
        }),
        c: common_vendor.p({
          required: true,
          label: "姓名",
          name: "name"
        }),
        d: common_vendor.o(($event) => formData.value.idcard = $event),
        e: common_vendor.p({
          type: "idcard",
          placeholder: "请输入您的真实身份证号码",
          modelValue: formData.value.idcard
        }),
        f: common_vendor.p({
          required: true,
          name: "idcard",
          label: "身份证号"
        }),
        g: common_vendor.sr(form, "7adc335e-0", {
          "k": "form"
        }),
        h: common_vendor.p({
          modelValue: formData.value,
          ["label-position"]: "top",
          rules: rules.value
        }),
        i: common_vendor.o(submit),
        j: common_vendor.o(($event) => checkbox1.value = $event),
        k: common_vendor.p({
          multiple: true,
          localdata: check.value,
          modelValue: checkbox1.value
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
