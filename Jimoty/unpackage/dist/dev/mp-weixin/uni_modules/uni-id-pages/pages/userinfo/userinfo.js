"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../common/store.js");
const uniIdCo = common_vendor.Zs.importObject("uni-id-co");
const secCheckObj = common_vendor.Zs.importObject("secCheckContent", { customUI: true });
const db = common_vendor.Zs.database();
const _sfc_main = {
  computed: {
    userInfo() {
      return uni_modules_uniIdPages_common_store.store.userInfo;
    }
  },
  data() {
    return {
      realNameStatus: 0,
      univerifyStyle: {
        authButton: {
          "title": "本机号码一键绑定"
          // 授权按钮文案
        },
        otherLoginButton: {
          "title": "其他号码绑定"
        }
      },
      // userInfo: {
      // 	mobile:'',
      // 	nickname:''
      // },
      hasPwd: false,
      showLoginManage: true,
      //通过页面传参隐藏登录&退出登录按钮
      setNicknameIng: false,
      describe: "这个家伙很神秘，没有个人简介"
    };
  },
  async onShow() {
    this.univerifyStyle.authButton.title = "本机号码一键绑定";
    this.univerifyStyle.otherLoginButton.title = "其他号码绑定";
  },
  async onLoad(e) {
    common_vendor.index.hideKeyboard();
    if (e.showLoginManage) {
      this.showLoginManage = true;
    }
    const data = await db.collection("uni-id-users").doc(common_vendor.Zs.getCurrentUserInfo().uid).field(
      "realname_auth.auth_status as authstatus,describe"
    ).get({ getOne: true });
    this.realNameStatus = data.result.data.authstatus;
    if (data.result.data.describe != "") {
      this.describe = data.result.data.describe;
    }
    let res = await uniIdCo.getAccountInfo();
    this.hasPwd = res.isPasswordSet;
  },
  methods: {
    login() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd",
        complete: (e) => {
        }
      });
    },
    logout() {
      uni_modules_uniIdPages_common_store.mutations.logout();
    },
    bindMobileSuccess() {
      uni_modules_uniIdPages_common_store.mutations.updateUserInfo();
    },
    changePassword() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd",
        complete: (e) => {
        }
      });
    },
    bindMobile() {
      this.$refs["bind-mobile-by-sms"].open();
    },
    univerify() {
      common_vendor.index.login({
        "provider": "univerify",
        "univerifyStyle": this.univerifyStyle,
        success: async (e) => {
          uniIdCo.bindMobileByUniverify(e.authResult).then((res) => {
            uni_modules_uniIdPages_common_store.mutations.updateUserInfo();
          }).catch((e2) => {
            console.log(e2);
          }).finally((e2) => {
            common_vendor.index.closeAuthView();
          });
        },
        fail: (err) => {
          console.log(err);
          if (err.code == "30002" || err.code == "30001") {
            this.bindMobileBySmsCode();
          }
        }
      });
    },
    bindMobileBySmsCode() {
      common_vendor.index.navigateTo({
        url: "./bind-mobile/bind-mobile"
      });
    },
    async setNickname(nickname) {
      if (nickname) {
        common_vendor.index.showLoading({
          mask: true
        });
        let sec = await secCheckObj.textSecCheck({ content: nickname });
        if (sec.errCode != 0) {
          common_vendor.index.showModal({
            title: sec.errMsg,
            content: `输入的内容违规，涉及“${sec.result.label}”，请重新编辑！`,
            showCancel: false
          });
          common_vendor.index.hideLoading();
          return;
        }
        uni_modules_uniIdPages_common_store.mutations.updateUserInfo({
          nickname
        });
        this.setNicknameIng = false;
        this.$refs.dialog.close();
      } else {
        this.$refs.dialog.open();
      }
    },
    openDg() {
      this.$refs.dialog2.open();
    },
    async setDescribe(describe) {
      common_vendor.index.showLoading({
        mask: true
      });
      let sec = await secCheckObj.textSecCheck({ content: describe });
      if (sec.errCode != 0) {
        common_vendor.index.showModal({
          title: sec.errMsg,
          content: `输入的内容违规，涉及“${sec.result.label}”，请重新编辑！`,
          showCancel: false
        });
        common_vendor.index.hideLoading();
        return;
      }
      uni_modules_uniIdPages_common_store.mutations.updateUserInfo({
        describe
      });
      this.describe = describe;
      common_vendor.index.hideLoading();
      this.$refs.dialog2.close();
    },
    deactivate() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/userinfo/deactivate/deactivate"
      });
    },
    async bindThirdAccount(provider) {
      const uniIdCo2 = common_vendor.Zs.importObject("uni-id-co");
      const bindField = {
        weixin: "wx_openid",
        alipay: "ali_openid",
        apple: "apple_openid",
        qq: "qq_openid"
      }[provider.toLowerCase()];
      if (this.userInfo[bindField]) {
        await uniIdCo2["unbind" + provider]();
        await uni_modules_uniIdPages_common_store.mutations.updateUserInfo();
      } else {
        common_vendor.index.login({
          provider: provider.toLowerCase(),
          onlyAuthorize: true,
          success: async (e) => {
            const res = await uniIdCo2["bind" + provider]({
              code: e.code
            });
            if (res.errCode) {
              common_vendor.index.showToast({
                title: res.errMsg || "绑定失败",
                duration: 3e3
              });
            }
            await uni_modules_uniIdPages_common_store.mutations.updateUserInfo();
          },
          fail: async (err) => {
            console.log(err);
            common_vendor.index.hideLoading();
          }
        });
      }
    },
    async realNameVerify() {
      if (this.realNameStatus != 2) {
        common_vendor.index.navigateTo({
          url: "/pages/realAuthentication/realAuthentication"
        });
        await uni_modules_uniIdPages_common_store.mutations.updateUserInfo();
      } else {
        common_vendor.index.showToast({
          title: "实名认证完成",
          icon: "none"
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_id_pages_avatar2 = common_vendor.resolveComponent("uni-id-pages-avatar");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_id_pages_bind_mobile2 = common_vendor.resolveComponent("uni-id-pages-bind-mobile");
  (_easycom_uni_id_pages_avatar2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2 + _easycom_uni_id_pages_bind_mobile2)();
}
const _easycom_uni_id_pages_avatar = () => "../../components/uni-id-pages-avatar/uni-id-pages-avatar.js";
const _easycom_uni_list_item = () => "../../../uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../../uni-list/components/uni-list/uni-list.js";
const _easycom_uni_popup_dialog = () => "../../../uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../../uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_id_pages_bind_mobile = () => "../../components/uni-id-pages-bind-mobile/uni-id-pages-bind-mobile.js";
if (!Math) {
  (_easycom_uni_id_pages_avatar + _easycom_uni_list_item + _easycom_uni_list + _easycom_uni_popup_dialog + _easycom_uni_popup + _easycom_uni_id_pages_bind_mobile)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      width: "260rpx",
      height: "260rpx"
    }),
    b: common_vendor.o(($event) => $options.setNickname("")),
    c: common_vendor.p({
      title: "昵称",
      rightText: $options.userInfo.nickname || "未设置",
      link: true
    }),
    d: common_vendor.o($options.bindMobile),
    e: common_vendor.p({
      title: "手机号",
      rightText: $options.userInfo.mobile || "未绑定",
      link: true
    }),
    f: $options.userInfo.email
  }, $options.userInfo.email ? {
    g: common_vendor.p({
      title: "电子邮箱",
      rightText: $options.userInfo.email
    })
  } : {}, {
    h: common_vendor.o($options.realNameVerify),
    i: common_vendor.p({
      title: "实名认证",
      rightText: $data.realNameStatus !== 2 ? "未认证" : "已认证",
      link: true
    }),
    j: common_vendor.o($options.openDg),
    k: common_vendor.p({
      title: "简介",
      rightText: $data.describe,
      link: true
    }),
    l: $data.hasPwd
  }, $data.hasPwd ? {
    m: common_vendor.o($options.changePassword),
    n: common_vendor.p({
      title: "修改密码",
      link: true
    })
  } : {}, {
    o: common_vendor.o($options.setNickname),
    p: common_vendor.p({
      mode: "input",
      value: $options.userInfo.nickname,
      inputType: $data.setNicknameIng ? "nickname" : "text",
      title: "设置昵称",
      placeholder: "请输入要设置的昵称"
    }),
    q: common_vendor.sr("dialog", "0be2f605-8"),
    r: common_vendor.p({
      type: "dialog"
    }),
    s: common_vendor.o($options.setDescribe),
    t: common_vendor.p({
      mode: "input",
      value: $options.userInfo.describe,
      inputType: $data.describe,
      title: "设置简介",
      placeholder: "请输入您的简介"
    }),
    v: common_vendor.sr("dialog2", "0be2f605-10"),
    w: common_vendor.p({
      type: "dialog"
    }),
    x: common_vendor.sr("bind-mobile-by-sms", "0be2f605-12"),
    y: common_vendor.o($options.bindMobileSuccess),
    z: $data.showLoginManage
  }, $data.showLoginManage ? common_vendor.e({
    A: $options.userInfo._id
  }, $options.userInfo._id ? {
    B: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  } : {
    C: common_vendor.o((...args) => $options.login && $options.login(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0be2f605"]]);
wx.createPage(MiniProgramPage);
