"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_uniIdUsers = require("../../../js_sdk/validator/uni-id-users.js");
const db = common_vendor.Vs.database();
db.command;
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_uniIdUsers.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_uniIdUsers.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    return {
      formData: {
        "username": "",
        "nickname": "",
        "password": "",
        "role": [],
        "authorizedApp": [],
        "tags": [],
        "mobile": void 0,
        "email": void 0,
        "status": true
        //默认启用
      },
      rules: {
        ...getValidator(["username", "password", "role", "mobile", "email"]),
        "status": {
          "rules": [{
            "format": "bool"
          }]
        }
      },
      roles: []
    };
  },
  onLoad() {
    this.loadroles();
  },
  methods: {
    /**
     * 跳转应用管理的 list 页
     */
    gotoAppList() {
      common_vendor.index.navigateTo({
        url: "../app/list"
      });
    },
    gotoTagList() {
      common_vendor.index.navigateTo({
        url: "../tag/list"
      });
    },
    gotoTagAdd() {
      common_vendor.index.navigateTo({
        url: "../tag/add",
        events: {
          refreshCheckboxData: () => {
            this.$refs.checkbox.loadData();
          }
        }
      });
    },
    /**
     * 触发表单提交
     */
    submitForm() {
      this.$refs.form.submit();
    },
    /**
     * 表单提交
     * @param {Object} event 回调参数 Function(callback:{value,errors})
     */
    submit(event) {
      const {
        value,
        errors
      } = event.detail;
      if (errors) {
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中...",
        mask: true
      });
      if (typeof value.status === "boolean") {
        value.status = Number(!value.status);
      }
      this.$request("addUser", value).then(() => {
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
      }).finally((err) => {
        common_vendor.index.hideLoading();
      });
    },
    loadroles() {
      db.collection("uni-id-roles").limit(500).get().then((res) => {
        const roleIds = [];
        this.roles = res.result.data.map((item) => {
          roleIds.push(item.role_id);
          return {
            value: item.role_id,
            text: item.role_name
          };
        });
        if (roleIds.indexOf("admin") === -1) {
          this.roles.unshift({
            value: "admin",
            text: "超级管理员"
          });
        }
      }).catch((err) => {
        common_vendor.index.showModal({
          title: "提示",
          content: err.message,
          showCancel: false
        });
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_checkbox2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_checkbox = () => "../../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_checkbox + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.formData.username = $event),
    b: common_vendor.p({
      clearable: false,
      placeholder: "请输入用户名",
      modelValue: $data.formData.username
    }),
    c: common_vendor.p({
      name: "username",
      label: "用户名",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.nickname = $event),
    e: common_vendor.p({
      clearable: false,
      placeholder: "请输入用户昵称",
      modelValue: $data.formData.nickname
    }),
    f: common_vendor.p({
      name: "nickname",
      label: "用户昵称",
      required: true
    }),
    g: common_vendor.o(($event) => $data.formData.password = $event),
    h: common_vendor.p({
      clearable: false,
      placeholder: "请输入初始密码",
      modelValue: $data.formData.password
    }),
    i: common_vendor.p({
      name: "password",
      label: "初始密码",
      required: true
    }),
    j: common_vendor.o(($event) => $data.formData.role = $event),
    k: common_vendor.p({
      multiple: true,
      localdata: $data.roles,
      modelValue: $data.formData.role
    }),
    l: common_vendor.p({
      name: "role",
      label: "角色列表"
    }),
    m: common_vendor.sr("checkbox", "4206c705-10,4206c705-9"),
    n: common_vendor.o(($event) => $data.formData.tags = $event),
    o: common_vendor.p({
      multiple: true,
      collection: "uni-id-tag",
      field: "tagid as value, name as text",
      modelValue: $data.formData.tags
    }),
    p: common_vendor.o((...args) => $options.gotoTagAdd && $options.gotoTagAdd(...args)),
    q: common_vendor.o((...args) => $options.gotoTagList && $options.gotoTagList(...args)),
    r: common_vendor.p({
      name: "tags",
      label: "用户标签",
      labelWidth: "100"
    }),
    s: common_vendor.o(($event) => $data.formData.authorizedApp = $event),
    t: common_vendor.p({
      multiple: true,
      collection: "opendb-app-list",
      field: "appid as value, name as text",
      modelValue: $data.formData.authorizedApp
    }),
    v: common_vendor.o((...args) => $options.gotoAppList && $options.gotoAppList(...args)),
    w: common_vendor.p({
      name: "authorizedApp",
      label: "可登录应用",
      labelWidth: "100"
    }),
    x: common_vendor.o(($event) => $data.formData.mobile = $event),
    y: common_vendor.p({
      clearable: false,
      placeholder: "请输入手机号",
      modelValue: $data.formData.mobile
    }),
    z: common_vendor.p({
      name: "mobile",
      label: "手机号"
    }),
    A: common_vendor.o(($event) => $data.formData.email = $event),
    B: common_vendor.p({
      clearable: false,
      placeholder: "请输入邮箱",
      modelValue: $data.formData.email
    }),
    C: common_vendor.p({
      name: "email",
      label: "邮箱"
    }),
    D: common_vendor.o(($event) => _ctx.binddata("status", $event.detail.value)),
    E: $data.formData.status,
    F: common_vendor.p({
      name: "status",
      label: "是否启用"
    }),
    G: common_vendor.t(_ctx.$t("common.button.submit")),
    H: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    I: common_vendor.t(_ctx.$t("common.button.back")),
    J: common_vendor.sr("form", "4206c705-0"),
    K: common_vendor.o($options.submit),
    L: common_vendor.o(($event) => $data.formData = $event),
    M: common_vendor.p({
      rules: $data.rules,
      validateTrigger: "bind",
      modelValue: $data.formData
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
