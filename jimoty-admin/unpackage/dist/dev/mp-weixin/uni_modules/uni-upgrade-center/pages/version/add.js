"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniUpgradeCenter_pages_mixin_version_add_detail_mixin = require("../mixin/version_add_detail_mixin.js");
const uni_modules_uniUpgradeCenter_pages_utils = require("../utils.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = uni_modules_uniUpgradeCenter_pages_utils.appVersionListDbName;
const platform_Android = "Android";
function compare(v1 = "0", v2 = "0") {
  v1 = String(v1).split(".");
  v2 = String(v2).split(".");
  const minVersionLens = Math.min(v1.length, v2.length);
  let result = 0;
  for (let i = 0; i < minVersionLens; i++) {
    const curV1 = Number(v1[i]);
    const curV2 = Number(v2[i]);
    if (curV1 > curV2) {
      result = 1;
      break;
    } else if (curV1 < curV2) {
      result = -1;
      break;
    }
  }
  if (result === 0 && v1.length !== v2.length) {
    const v1BiggerThenv2 = v1.length > v2.length;
    const maxLensVersion = v1BiggerThenv2 ? v1 : v2;
    for (let i = minVersionLens; i < maxLensVersion.length; i++) {
      const curVersion = Number(maxLensVersion[i]);
      if (curVersion > 0) {
        v1BiggerThenv2 ? result = 1 : result = -1;
        break;
      }
    }
  }
  return result;
}
const _sfc_main = {
  mixins: [uni_modules_uniUpgradeCenter_pages_mixin_version_add_detail_mixin.addAndDetail],
  data() {
    return {
      latestVersion: "0.0.0",
      lastVersionId: "",
      uniFilePickerProvider: "unicloud",
      domain: ""
    };
  },
  async onLoad({
    appid,
    name,
    type
  }) {
    let { domain, provider } = this.getCloudStorageConfig();
    if (domain)
      this.domain = domain;
    if (provider)
      this.uniFilePickerProvider = provider;
    if (appid && type && name) {
      const store_list = await this.getStoreList(appid);
      this.formData = {
        ...this.formData,
        ...{
          appid,
          name,
          type,
          store_list
        }
      };
      this.latestStableData = await this.getDetail(appid, type);
      if (!this.isWGT && this.latestStableData.length) {
        this.setFormData(platform_Android);
      }
      if (this.isWGT) {
        this.rules.min_uni_version.rules.push({
          "required": true
        });
      }
    }
  },
  onUnload() {
    this.setCloudStorage({
      provider: null
    });
  },
  watch: {
    isiOS(val) {
      if (!val && this.hasPackage) {
        this.formData.url = this.appFileList.url;
        return;
      }
      this.formData.url = "";
    },
    "formData.platform"(val) {
      this.setFormData(val);
    },
    "domain"(val) {
      this.setCloudStorage({
        domain: val
      });
      if (this.formData.url) {
        if (!val)
          val = "请输入自定义域名";
        this.formData.url = this.formData.url.replace(/^(https?:\/\/)[^\/]+/, `$1${val}`);
      }
    },
    uniFilePickerProvider: {
      immediate: true,
      handler(val) {
        this.setCloudStorage({
          provider: val
        });
      }
    }
  },
  methods: {
    setFormData(os) {
      common_vendor.index.showLoading({
        mask: true
      });
      this.latestVersion = "0.0.0";
      this.lastVersionId = "";
      const data = this.getData(this.latestStableData, os)[0];
      if (data) {
        const {
          _id,
          version,
          name,
          platform,
          min_uni_version,
          url
        } = data;
        this.lastVersionId = _id;
        this.latestVersion = version;
        this.formData.name = name;
        if (!this.isWGT) {
          delete this.formData.min_uni_version;
          this.formData.platform = platform[0];
          if (this.isiOS) {
            this.formData.url = url;
          }
        } else {
          this.formData.min_uni_version = min_uni_version;
        }
      } else if (this.isWGT) {
        this.formData.min_uni_version = "";
      }
      common_vendor.index.hideLoading();
    },
    /**
     * 触发表单提交
     */
    submit() {
      common_vendor.index.showLoading({
        mask: true
      });
      this.$refs.form.validate(["store_list"]).then((res) => {
        if (compare(this.latestVersion, res.version) >= 0) {
          common_vendor.index.showModal({
            content: `版本号必须大于当前已上线版本（${this.latestVersion}）`,
            showCancel: false
          });
          throw new Error("版本号必须大于已上线版本（${this.latestVersion}）");
        }
        if (!this.isWGT) {
          res.platform = [res.platform];
        }
        if (this.isiOS || this.isWGT)
          delete res.store_list;
        if (res.store_list) {
          res.store_list.forEach((item) => {
            item.priority = parseFloat(item.priority);
          });
        }
        this.submitForm(res);
      }).catch((errors) => {
        common_vendor.index.hideLoading();
      });
    },
    async submitForm(value) {
      value = this.createCenterRecord(value);
      const collectionDB = db.collection(dbCollectionName);
      let recordCreateByUniStat = [];
      if (!this.isWGT) {
        recordCreateByUniStat = await this.getDetail(value.appid, value.type, this.createStatQuery(value));
      }
      let dbOperate;
      if (!recordCreateByUniStat.length) {
        dbOperate = collectionDB.add(value);
      } else {
        value.create_date = Date.now();
        dbOperate = collectionDB.doc(recordCreateByUniStat[0]._id).update(value);
      }
      dbOperate.then(async (res) => {
        if (value.stable_publish && this.lastVersionId) {
          await collectionDB.doc(this.lastVersionId).update({
            stable_publish: false
          });
        }
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
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
      this.setCloudStorageConfig({
        provider: this.uniFilePickerProvider,
        domain: this.domain
      });
    },
    /**
     * 获取表单数据
     * @param {Object} id
     */
    getDetail(appid, type, args = {}) {
      common_vendor.index.showLoading({
        mask: true
      });
      return db.collection(dbCollectionName).where(
        Object.assign({
          appid,
          type,
          stable_publish: true
        }, args)
      ).field(uni_modules_uniUpgradeCenter_pages_mixin_version_add_detail_mixin.fields).get().then((res) => res.result.data).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "请求服务失败",
          showCancel: false
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    getData(data = [], platform) {
      if (typeof platform === "string") {
        return data.filter((item) => item.platform.includes(platform));
      } else {
        return data.filter((item) => item.platform.toString() === platform.toString());
      }
    },
    back() {
      common_vendor.index.showModal({
        title: "取消发布",
        content: this.hasPackage ? "将会删除已上传的包" : void 0,
        success: (res) => {
          if (res.confirm) {
            if (this.hasPackage) {
              this.deleteFile([this.appFileList.url]);
            }
            common_vendor.index.navigateBack();
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_show_info2 = common_vendor.resolveComponent("show-info");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_checkbox2 + _easycom_show_info2 + _easycom_uni_file_picker2 + _easycom_uni_card2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_checkbox = () => "../../../uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_show_info = () => "../../../../components/show-info/show-info.js";
const _easycom_uni_file_picker = () => "../../../uni-file-picker/components/uni-file-picker/uni-file-picker.js";
const _easycom_uni_card = () => "../../../uni-card/components/uni-card/uni-card.js";
const _easycom_uni_forms = () => "../../../uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_checkbox + _easycom_show_info + _easycom_uni_file_picker + _easycom_uni_card + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(_ctx.type_valuetotext[_ctx.formData.type]),
    b: common_vendor.o(($event) => _ctx.formData.appid = $event),
    c: common_vendor.p({
      disabled: true,
      trim: "both",
      modelValue: _ctx.formData.appid
    }),
    d: common_vendor.p({
      name: "appid",
      label: "AppID",
      required: true
    }),
    e: common_vendor.o(($event) => _ctx.formData.name = $event),
    f: common_vendor.p({
      disabled: true,
      trim: "both",
      modelValue: _ctx.formData.name
    }),
    g: common_vendor.p({
      name: "name",
      label: "应用名称"
    }),
    h: common_vendor.o(($event) => _ctx.formData.title = $event),
    i: common_vendor.p({
      placeholder: "更新标题",
      modelValue: _ctx.formData.title
    }),
    j: common_vendor.p({
      name: "title",
      label: "更新标题"
    }),
    k: -1,
    l: common_vendor.o(($event) => _ctx.binddata("contents", $event.detail.value)),
    m: _ctx.formData.contents,
    n: common_vendor.o((val) => _ctx.formData.contents = val),
    o: common_vendor.p({
      name: "contents",
      label: "更新内容",
      required: true
    }),
    p: common_vendor.o(($event) => _ctx.formData.platform = $event),
    q: common_vendor.p({
      multiple: _ctx.isWGT,
      localdata: _ctx.platformLocaldata,
      modelValue: _ctx.formData.platform
    }),
    r: common_vendor.p({
      name: "platform",
      label: "平台",
      required: true
    }),
    s: common_vendor.o(($event) => _ctx.formData.version = $event),
    t: common_vendor.p({
      placeholder: "当前包版本号，必须大于当前线上发行版本号",
      modelValue: _ctx.formData.version
    }),
    v: common_vendor.p({
      name: "version",
      label: "版本号",
      required: true
    }),
    w: _ctx.isWGT
  }, _ctx.isWGT ? {
    x: common_vendor.o(($event) => _ctx.formData.min_uni_version = $event),
    y: common_vendor.p({
      placeholder: "原生App最低版本",
      modelValue: _ctx.formData.min_uni_version
    }),
    z: common_vendor.p({
      content: _ctx.minUniVersionContent
    }),
    A: common_vendor.p({
      name: "min_uni_version",
      label: "原生App最低版本",
      required: _ctx.isWGT
    })
  } : {}, {
    B: $data.uniFilePickerProvider === "unicloud",
    C: $data.uniFilePickerProvider === "extStorage",
    D: common_vendor.o((e) => $data.uniFilePickerProvider = e.detail.value),
    E: common_vendor.o(($event) => _ctx.toUrl("https://doc.dcloud.net.cn/uniCloud/ext-storage/service.html")),
    F: common_vendor.p({
      label: "存储选择"
    }),
    G: $data.uniFilePickerProvider === "extStorage"
  }, $data.uniFilePickerProvider === "extStorage" ? {
    H: common_vendor.o(($event) => $data.domain = $event),
    I: common_vendor.p({
      placeholder: "请输入扩展存储自定义域名",
      maxlength: -1,
      modelValue: $data.domain
    }),
    J: common_vendor.p({
      label: "自定义域名"
    })
  } : {}, {
    K: !_ctx.isiOS
  }, !_ctx.isiOS ? common_vendor.e({
    L: common_vendor.o((...args) => _ctx.selectFile && _ctx.selectFile(...args)),
    M: common_vendor.t(_ctx.fileExtname[0]),
    N: common_vendor.o(_ctx.packageUploadSuccess),
    O: common_vendor.o(_ctx.packageDelete),
    P: common_vendor.o(($event) => _ctx.appFileList = $event),
    Q: common_vendor.p({
      ["file-extname"]: _ctx.fileExtname,
      disabled: _ctx.hasPackage,
      returnType: "object",
      ["file-mediatype"]: "all",
      limit: "1",
      provider: $data.uniFilePickerProvider,
      modelValue: _ctx.appFileList
    }),
    R: _ctx.hasPackage
  }, _ctx.hasPackage ? {
    S: common_vendor.t(Number(_ctx.appFileList.size / 1024 / 1024).toFixed(2))
  } : {}, {
    T: common_vendor.p({
      label: "上传" + _ctx.fileExtname[0] + "包"
    })
  }) : {}, {
    U: common_vendor.o(($event) => _ctx.formData.url = $event),
    V: common_vendor.p({
      placeholder: "链接",
      maxlength: -1,
      modelValue: _ctx.formData.url
    }),
    W: _ctx.formData.url
  }, _ctx.formData.url ? {
    X: common_vendor.o(($event) => _ctx.toUrl(_ctx.formData.url))
  } : {}, {
    Y: _ctx.formData.url
  }, _ctx.formData.url ? {} : {}, {
    Z: common_vendor.p({
      name: "url",
      label: _ctx.isiOS ? "AppStore" : "下载链接",
      required: true
    }),
    aa: !_ctx.isiOS && !_ctx.isWGT && _ctx.formData.store_list.length
  }, !_ctx.isiOS && !_ctx.isWGT && _ctx.formData.store_list.length ? {
    ab: common_vendor.f(_ctx.formData.store_list, (item, k0, i0) => {
      return {
        a: item.enable,
        b: common_vendor.o(({
          detail: {
            value
          }
        }) => {
          item.enable = !!value.length;
        }, item.id),
        c: "13402967-25-" + i0 + "," + ("13402967-24-" + i0),
        d: common_vendor.o(($event) => item.name = $event, item.id),
        e: common_vendor.p({
          disabled: true,
          trim: "both",
          modelValue: item.name
        }),
        f: "13402967-24-" + i0 + "," + ("13402967-23-" + i0),
        g: "13402967-27-" + i0 + "," + ("13402967-26-" + i0),
        h: common_vendor.o(($event) => item.scheme = $event, item.id),
        i: common_vendor.p({
          disabled: true,
          trim: "both",
          modelValue: item.scheme
        }),
        j: "13402967-26-" + i0 + "," + ("13402967-23-" + i0),
        k: "13402967-29-" + i0 + "," + ("13402967-28-" + i0),
        l: common_vendor.o(($event) => item.priority = $event, item.id),
        m: common_vendor.p({
          type: "number",
          modelValue: item.priority
        }),
        n: "13402967-30-" + i0 + "," + ("13402967-28-" + i0),
        o: "13402967-28-" + i0 + "," + ("13402967-23-" + i0),
        p: "13402967-23-" + i0 + ",13402967-22",
        q: item.id
      };
    }),
    ac: common_vendor.p({
      label: "商店名称"
    }),
    ad: common_vendor.p({
      label: "Scheme"
    }),
    ae: common_vendor.p({
      top: -100,
      left: -180,
      content: _ctx.priorityContent
    }),
    af: common_vendor.p({
      label: "优先级"
    }),
    ag: common_vendor.p({
      label: "Android应用市场",
      labelWidth: "125px",
      name: "store_list"
    })
  } : {}, {
    ah: _ctx.isWGT
  }, _ctx.isWGT ? {
    ai: common_vendor.o(($event) => _ctx.binddata("is_silently", $event.detail.value)),
    aj: _ctx.formData.is_silently,
    ak: common_vendor.p({
      top: -80,
      content: _ctx.silentlyContent
    }),
    al: common_vendor.p({
      name: "is_silently",
      label: "静默更新"
    })
  } : {}, {
    am: !_ctx.isiOS
  }, !_ctx.isiOS ? {
    an: common_vendor.o(($event) => _ctx.binddata("is_mandatory", $event.detail.value)),
    ao: _ctx.formData.is_mandatory,
    ap: common_vendor.p({
      content: _ctx.mandatoryContent
    }),
    aq: common_vendor.p({
      name: "is_mandatory",
      label: "强制更新"
    })
  } : {}, {
    ar: common_vendor.o(($event) => _ctx.binddata("stable_publish", $event.detail.value)),
    as: _ctx.formData.stable_publish,
    at: common_vendor.p({
      top: -40,
      content: _ctx.stablePublishContent2
    }),
    av: common_vendor.p({
      name: "stable_publish",
      label: "上线发行"
    }),
    aw: common_vendor.o(($event) => _ctx.formData.type = $event),
    ax: common_vendor.p({
      localdata: _ctx.formOptions.type_localdata,
      modelValue: _ctx.formData.type
    }),
    ay: common_vendor.p({
      name: "type",
      label: "安装包类型"
    }),
    az: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    aA: common_vendor.o((...args) => $options.back && $options.back(...args)),
    aB: common_vendor.sr("form", "13402967-0"),
    aC: common_vendor.p({
      value: _ctx.formData,
      validateTrigger: "bind",
      labelWidth: _ctx.labelWidth
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
