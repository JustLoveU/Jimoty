"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyPost = require("../../js_sdk/validator/jimoty-post.js");
const db = common_vendor.Vs.database();
db.command;
const dbCollectionName = "jimoty-post";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_jimotyPost.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_jimotyPost.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "userId": "",
      "type": null,
      "category": "",
      "photos": [],
      "point": [],
      "recruitAge": "",
      "noteTitle": "",
      "mainText": "",
      "companyName": "",
      "payrollForm": "",
      "salary": "",
      "salarySupplement": "",
      "traffic": "",
      "workTime": "",
      "workPosition": "",
      "phone": "",
      "employeeForm": "",
      "sex": "",
      "age": "",
      "sterOperation": "",
      "vaccinelnoculation": "",
      "releaseReason": "",
      "payMethod": 0,
      "postPrice": "",
      "status": 0,
      "delete": 1,
      "browse": 0,
      "weight": 100,
      "collect": 0,
      "hightLight": false,
      "location": null,
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
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_checkbox2 + _easycom_uni_datetime_picker2 + _easycom_uni_forms2)();
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
    a: common_vendor.o(($event) => $data.formData.userId = $event),
    b: common_vendor.p({
      placeholder: "发布者",
      modelValue: $data.formData.userId
    }),
    c: common_vendor.p({
      name: "userId",
      label: "发布者",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.type = $event),
    e: common_vendor.p({
      placeholder: "类目(1社交，2兼职，3教培，4领养，5闲置)",
      type: "number",
      modelValue: $data.formData.type
    }),
    f: common_vendor.p({
      name: "type",
      label: "类目",
      required: true
    }),
    g: common_vendor.o(($event) => $data.formData.category = $event),
    h: common_vendor.p({
      placeholder: "发布者",
      modelValue: $data.formData.category
    }),
    i: common_vendor.p({
      name: "category",
      label: "类别"
    }),
    j: common_vendor.o(($event) => $data.formData.photos = $event),
    k: common_vendor.p({
      multiple: true,
      modelValue: $data.formData.photos
    }),
    l: common_vendor.p({
      name: "photos",
      label: "图片"
    }),
    m: common_vendor.o(($event) => $data.formData.point = $event),
    n: common_vendor.p({
      multiple: true,
      modelValue: $data.formData.point
    }),
    o: common_vendor.p({
      name: "point",
      label: "地理位置"
    }),
    p: common_vendor.o(($event) => $data.formData.recruitAge = $event),
    q: common_vendor.p({
      placeholder: "招募年龄",
      modelValue: $data.formData.recruitAge
    }),
    r: common_vendor.p({
      name: "recruitAge",
      label: "招募年龄"
    }),
    s: common_vendor.o(($event) => $data.formData.noteTitle = $event),
    t: common_vendor.p({
      placeholder: "标题",
      trim: "both",
      modelValue: $data.formData.noteTitle
    }),
    v: common_vendor.p({
      name: "noteTitle",
      label: "标题"
    }),
    w: common_vendor.o(($event) => $data.formData.mainText = $event),
    x: common_vendor.p({
      placeholder: "正文",
      trim: "both",
      modelValue: $data.formData.mainText
    }),
    y: common_vendor.p({
      name: "mainText",
      label: "正文"
    }),
    z: common_vendor.o(($event) => $data.formData.companyName = $event),
    A: common_vendor.p({
      placeholder: "公司名",
      modelValue: $data.formData.companyName
    }),
    B: common_vendor.p({
      name: "companyName",
      label: "公司名"
    }),
    C: common_vendor.o(($event) => $data.formData.payrollForm = $event),
    D: common_vendor.p({
      placeholder: "工资形式",
      modelValue: $data.formData.payrollForm
    }),
    E: common_vendor.p({
      name: "payrollForm",
      label: "工资形式"
    }),
    F: common_vendor.o(($event) => $data.formData.salary = $event),
    G: common_vendor.p({
      placeholder: "薪资",
      modelValue: $data.formData.salary
    }),
    H: common_vendor.p({
      name: "salary",
      label: "薪资"
    }),
    I: common_vendor.o(($event) => $data.formData.salarySupplement = $event),
    J: common_vendor.p({
      placeholder: "工资补充",
      modelValue: $data.formData.salarySupplement
    }),
    K: common_vendor.p({
      name: "salarySupplement",
      label: "工资补充"
    }),
    L: common_vendor.o(($event) => $data.formData.traffic = $event),
    M: common_vendor.p({
      placeholder: "交通",
      modelValue: $data.formData.traffic
    }),
    N: common_vendor.p({
      name: "traffic",
      label: "交通"
    }),
    O: common_vendor.o(($event) => $data.formData.workTime = $event),
    P: common_vendor.p({
      placeholder: "工作时间",
      modelValue: $data.formData.workTime
    }),
    Q: common_vendor.p({
      name: "workTime",
      label: "工作时间"
    }),
    R: common_vendor.o(($event) => $data.formData.workPosition = $event),
    S: common_vendor.p({
      placeholder: "工作地点",
      modelValue: $data.formData.workPosition
    }),
    T: common_vendor.p({
      name: "workPosition",
      label: "工作地点"
    }),
    U: common_vendor.o(($event) => $data.formData.phone = $event),
    V: common_vendor.p({
      placeholder: "电话",
      modelValue: $data.formData.phone
    }),
    W: common_vendor.p({
      name: "phone",
      label: "电话"
    }),
    X: common_vendor.o(($event) => $data.formData.employeeForm = $event),
    Y: common_vendor.p({
      placeholder: "雇佣形式",
      modelValue: $data.formData.employeeForm
    }),
    Z: common_vendor.p({
      name: "employeeForm",
      label: "雇佣形式"
    }),
    aa: common_vendor.o(($event) => $data.formData.sex = $event),
    ab: common_vendor.p({
      placeholder: "性别(男,女,不限制)",
      modelValue: $data.formData.sex
    }),
    ac: common_vendor.p({
      name: "sex",
      label: "性别"
    }),
    ad: common_vendor.o(($event) => $data.formData.age = $event),
    ae: common_vendor.p({
      placeholder: "年龄（6年7月）",
      modelValue: $data.formData.age
    }),
    af: common_vendor.p({
      name: "age",
      label: "年龄"
    }),
    ag: common_vendor.o(($event) => $data.formData.sterOperation = $event),
    ah: common_vendor.p({
      placeholder: "绝育手术",
      modelValue: $data.formData.sterOperation
    }),
    ai: common_vendor.p({
      name: "sterOperation",
      label: "绝育手术"
    }),
    aj: common_vendor.o(($event) => $data.formData.vaccinelnoculation = $event),
    ak: common_vendor.p({
      placeholder: "疫苗接种",
      modelValue: $data.formData.vaccinelnoculation
    }),
    al: common_vendor.p({
      name: "vaccinelnoculation",
      label: "疫苗接种"
    }),
    am: common_vendor.o(($event) => $data.formData.releaseReason = $event),
    an: common_vendor.p({
      placeholder: "投稿理由",
      modelValue: $data.formData.releaseReason
    }),
    ao: common_vendor.p({
      name: "releaseReason",
      label: "投稿理由"
    }),
    ap: common_vendor.o(($event) => $data.formData.payMethod = $event),
    aq: common_vendor.p({
      placeholder: "支付方式(0线下1线上)",
      type: "number",
      modelValue: $data.formData.payMethod
    }),
    ar: common_vendor.p({
      name: "payMethod",
      label: "支付方式"
    }),
    as: common_vendor.o(($event) => $data.formData.postPrice = $event),
    at: common_vendor.p({
      placeholder: "商品价格",
      modelValue: $data.formData.postPrice
    }),
    av: common_vendor.p({
      name: "postPrice",
      label: "商品价格"
    }),
    aw: common_vendor.o(($event) => $data.formData.status = $event),
    ax: common_vendor.p({
      placeholder: "帖子状态(0待审核1草稿2审核通过3审核不通过4已结束)",
      type: "number",
      modelValue: $data.formData.status
    }),
    ay: common_vendor.p({
      name: "status",
      label: "帖子状态"
    }),
    az: common_vendor.o(($event) => $data.formData.delete = $event),
    aA: common_vendor.p({
      placeholder: "逻辑删除(0删除，1未删除)",
      type: "number",
      modelValue: $data.formData.delete
    }),
    aB: common_vendor.p({
      name: "delete",
      label: "逻辑删除"
    }),
    aC: common_vendor.o(($event) => $data.formData.browse = $event),
    aD: common_vendor.p({
      placeholder: "浏览数",
      type: "number",
      modelValue: $data.formData.browse
    }),
    aE: common_vendor.p({
      name: "browse",
      label: "浏览数"
    }),
    aF: common_vendor.o(($event) => $data.formData.weight = $event),
    aG: common_vendor.p({
      placeholder: "权重",
      type: "number",
      modelValue: $data.formData.weight
    }),
    aH: common_vendor.p({
      name: "weight",
      label: "权重"
    }),
    aI: common_vendor.o(($event) => $data.formData.collect = $event),
    aJ: common_vendor.p({
      placeholder: "收藏数",
      type: "number",
      modelValue: $data.formData.collect
    }),
    aK: common_vendor.p({
      name: "collect",
      label: "收藏数"
    }),
    aL: common_vendor.o(($event) => _ctx.binddata("hightLight", $event.detail.value)),
    aM: $data.formData.hightLight,
    aN: common_vendor.p({
      name: "hightLight",
      label: "高亮"
    }),
    aO: common_vendor.o(($event) => $data.formData.location = $event),
    aP: common_vendor.p({
      modelValue: $data.formData.location
    }),
    aQ: common_vendor.p({
      name: "location",
      label: "地理位置"
    }),
    aR: common_vendor.o(($event) => $data.formData.create_date = $event),
    aS: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.create_date
    }),
    aT: common_vendor.p({
      name: "create_date",
      label: ""
    }),
    aU: common_vendor.o(($event) => $data.formData.update_date = $event),
    aV: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.update_date
    }),
    aW: common_vendor.p({
      name: "update_date",
      label: ""
    }),
    aX: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    aY: common_vendor.sr("form", "79d35401-0"),
    aZ: common_vendor.p({
      model: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
