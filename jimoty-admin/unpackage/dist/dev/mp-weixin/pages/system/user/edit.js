"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_uniIdUsers = require("../../../js_sdk/validator/uni-id-users.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "uni-id-users";
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
      showPassword: false,
      formData: {
        "username": "",
        "nickname": "",
        "password": void 0,
        "role": [],
        "tags": [],
        "authorizedApp": [],
        "mobile": void 0,
        "email": void 0,
        "status": false
        //默认禁用
      },
      rules: {
        ...getValidator(["username", "password", "role", "mobile", "email"]),
        "status": {
          "rules": [{
            "format": "bool"
          }]
        }
      },
      roles: [],
      userId: "",
      appList: [],
      unknownAppids: []
    };
  },
  onLoad(e) {
    const id = e.id;
    this.formDataId = id;
    let userInfo = common_vendor.index.getStorageSync("uni-id-pages-userInfo") || {};
    this.userId = userInfo._id;
    this.getDetail(id);
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
            this.$refs.checkboxTags.loadData();
          }
        }
      });
    },
    /**
     * 切换重置密码框显示或隐藏
     */
    trigger() {
      this.showPassword = !this.showPassword;
    },
    /**
     * 触发表单提交
     */
    submitForm(form) {
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
        title: "修改中...",
        mask: true
      });
      if (typeof value.status === "boolean") {
        value.status = Number(!value.status);
      }
      value.uid = this.formDataId;
      this.$request("updateUser", value).then(() => {
        common_vendor.index.showToast({
          title: "修改成功"
        });
        const eventChannel = this.getOpenerEventChannel();
        if (eventChannel.emit)
          eventChannel.emit("refreshData");
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
    resetPWd(resetData) {
      this.$request("system/user/resetPwd", resetData).then().catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "请求服务失败",
          showCancel: false
        });
      }).finally();
    },
    /**
     * 获取表单数据
     * @param {Object} id
     */
    getDetail(id) {
      common_vendor.index.showLoading({
        mask: true
      });
      db.collection(dbCollectionName).doc(id).field("username,nickname,role,dcloud_appid as authorizedApp,tags,mobile,email,status").get().then((res) => {
        const data = res.result.data[0];
        if (data) {
          if (data.status === void 0) {
            data.status = true;
          }
          if (data.status === 0) {
            data.status = true;
          }
          if (data.status === 1) {
            data.status = false;
          }
          this.formData = Object.assign(this.formData, data);
          this.loadAppList(this.formData.authorizedApp);
        }
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "请求服务失败",
          showCancel: false
        });
      }).finally(() => {
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
    },
    loadAppList(authorizedApp) {
      db.collection("opendb-app-list").limit(500).get().then((res) => {
        let list = res.result.data.map((item, index) => {
          return {
            value: item.appid,
            text: item.name
          };
        });
        if (!list)
          list = [];
        authorizedApp.map((appid) => {
          let info = list.find((item) => {
            return item.value === appid;
          });
          if (!info) {
            this.unknownAppids.push(appid);
            list.push({
              value: appid,
              text: `未知应用${appid}`
            });
          }
        });
        this.appList = list;
      }).catch((err) => {
        common_vendor.index.showModal({
          title: "提示",
          content: err.message,
          showCancel: false
        });
      });
    },
    // status 对应文字显示
    parseUserStatus(status) {
      if (status === 0) {
        return "启用";
      } else if (status === 1) {
        return "禁用";
      } else if (status === 2) {
        return "审核中";
      } else if (status === 3) {
        return "审核拒绝";
      } else if (status === 4) {
        return "已注销";
      } else if (typeof status !== "undefined") {
        return "未知";
      } else {
        return "启用";
      }
    }
  },
  computed: {
    unknownAppidsCom() {
      let str = "";
      this.unknownAppids.map((item, index) => {
        str += item;
        if (index !== this.unknownAppids.length - 1) {
          str += "、";
        }
      });
      return str;
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
  return common_vendor.e({
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
    g: $data.showPassword
  }, $data.showPassword ? {
    h: common_vendor.o((...args) => $options.trigger && $options.trigger(...args)),
    i: common_vendor.o(($event) => $data.formData.password = $event),
    j: common_vendor.p({
      clearable: false,
      placeholder: "请输入重置密码",
      modelValue: $data.formData.password
    }),
    k: common_vendor.p({
      name: "password",
      label: "重置密码"
    })
  } : {
    l: common_vendor.o((...args) => $options.trigger && $options.trigger(...args)),
    m: common_vendor.p({
      label: "重置密码"
    })
  }, {
    n: common_vendor.o(($event) => $data.formData.role = $event),
    o: common_vendor.p({
      multiple: true,
      localdata: $data.roles,
      modelValue: $data.formData.role
    }),
    p: common_vendor.p({
      name: "role",
      label: "角色列表"
    }),
    q: common_vendor.sr("checkboxTags", "aace7e54-11,aace7e54-10"),
    r: common_vendor.o(($event) => $data.formData.tags = $event),
    s: common_vendor.p({
      multiple: true,
      collection: "uni-id-tag",
      field: "tagid as value, name as text",
      modelValue: $data.formData.tags
    }),
    t: common_vendor.o((...args) => $options.gotoTagAdd && $options.gotoTagAdd(...args)),
    v: common_vendor.o((...args) => $options.gotoTagList && $options.gotoTagList(...args)),
    w: common_vendor.p({
      name: "tags",
      label: "用户标签",
      labelWidth: "100"
    }),
    x: common_vendor.o(($event) => $data.formData.authorizedApp = $event),
    y: common_vendor.p({
      multiple: true,
      localdata: $data.appList,
      modelValue: $data.formData.authorizedApp
    }),
    z: common_vendor.o((...args) => $options.gotoAppList && $options.gotoAppList(...args)),
    A: _ctx.formDataId === $data.userId
  }, _ctx.formDataId === $data.userId ? {
    B: common_vendor.t($options.unknownAppidsCom)
  } : {}, {
    C: common_vendor.p({
      name: "authorizedApp",
      label: "可登录应用"
    }),
    D: common_vendor.o(($event) => $data.formData.mobile = $event),
    E: common_vendor.p({
      clearable: false,
      placeholder: "请输入手机号",
      modelValue: $data.formData.mobile
    }),
    F: common_vendor.p({
      name: "mobile",
      label: "手机号"
    }),
    G: common_vendor.o(($event) => $data.formData.email = $event),
    H: common_vendor.p({
      clearable: false,
      placeholder: "请输入邮箱",
      modelValue: $data.formData.email
    }),
    I: common_vendor.p({
      name: "email",
      label: "邮箱"
    }),
    J: Number($data.formData.status) < 2
  }, Number($data.formData.status) < 2 ? {
    K: common_vendor.o(($event) => _ctx.binddata("status", $event.detail.value)),
    L: $data.formData.status,
    M: _ctx.formDataId === $data.userId
  } : {
    N: common_vendor.t($options.parseUserStatus($data.formData.status))
  }, {
    O: _ctx.formDataId === $data.userId
  }, _ctx.formDataId === $data.userId ? {} : {}, {
    P: common_vendor.p({
      name: "status",
      label: "用户状态"
    }),
    Q: common_vendor.t(_ctx.$t("common.button.submit")),
    R: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    S: common_vendor.t(_ctx.$t("common.button.back")),
    T: common_vendor.sr("form", "aace7e54-0"),
    U: common_vendor.o($options.submit),
    V: common_vendor.o(($event) => $data.formData = $event),
    W: common_vendor.p({
      rules: $data.rules,
      validateTrigger: "bind",
      modelValue: $data.formData
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
