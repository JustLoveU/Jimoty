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
      db.collection(dbCollectionName).doc(id).field(
        "userId,type,category,photos,point,recruitAge,noteTitle,mainText,companyName,payrollForm,salary,salarySupplement,traffic,workTime,workPosition,phone,employeeForm,sex,age,sterOperation,vaccinelnoculation,releaseReason,payMethod,postPrice,status,delete,browse,weight,collect,hightLight,location,location,create_date,update_date"
      ).get().then((res) => {
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
    a: common_vendor.o(($event) => $data.formData.userId = $event),
    b: common_vendor.p({
      disabled: true,
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
    j: common_vendor.o(($event) => $data.formData.recruitAge = $event),
    k: common_vendor.p({
      placeholder: "招募年龄",
      modelValue: $data.formData.recruitAge
    }),
    l: common_vendor.p({
      name: "recruitAge",
      label: "招募年龄"
    }),
    m: common_vendor.o(($event) => $data.formData.noteTitle = $event),
    n: common_vendor.p({
      placeholder: "标题",
      trim: "both",
      modelValue: $data.formData.noteTitle
    }),
    o: common_vendor.p({
      name: "noteTitle",
      label: "标题"
    }),
    p: common_vendor.o(($event) => $data.formData.mainText = $event),
    q: common_vendor.p({
      placeholder: "正文",
      trim: "both",
      modelValue: $data.formData.mainText
    }),
    r: common_vendor.p({
      name: "mainText",
      label: "正文"
    }),
    s: common_vendor.o(($event) => $data.formData.companyName = $event),
    t: common_vendor.p({
      placeholder: "公司名",
      modelValue: $data.formData.companyName
    }),
    v: common_vendor.p({
      name: "companyName",
      label: "公司名"
    }),
    w: common_vendor.o(($event) => $data.formData.payrollForm = $event),
    x: common_vendor.p({
      placeholder: "工资形式",
      modelValue: $data.formData.payrollForm
    }),
    y: common_vendor.p({
      name: "payrollForm",
      label: "工资形式"
    }),
    z: common_vendor.o(($event) => $data.formData.salary = $event),
    A: common_vendor.p({
      placeholder: "薪资",
      modelValue: $data.formData.salary
    }),
    B: common_vendor.p({
      name: "salary",
      label: "薪资"
    }),
    C: common_vendor.o(($event) => $data.formData.salarySupplement = $event),
    D: common_vendor.p({
      placeholder: "工资补充",
      modelValue: $data.formData.salarySupplement
    }),
    E: common_vendor.p({
      name: "salarySupplement",
      label: "工资补充"
    }),
    F: common_vendor.o(($event) => $data.formData.traffic = $event),
    G: common_vendor.p({
      placeholder: "交通",
      modelValue: $data.formData.traffic
    }),
    H: common_vendor.p({
      name: "traffic",
      label: "交通"
    }),
    I: common_vendor.o(($event) => $data.formData.workTime = $event),
    J: common_vendor.p({
      placeholder: "工作时间",
      modelValue: $data.formData.workTime
    }),
    K: common_vendor.p({
      name: "workTime",
      label: "工作时间"
    }),
    L: common_vendor.o(($event) => $data.formData.workPosition = $event),
    M: common_vendor.p({
      placeholder: "工作地点",
      modelValue: $data.formData.workPosition
    }),
    N: common_vendor.p({
      name: "workPosition",
      label: "工作地点"
    }),
    O: common_vendor.o(($event) => $data.formData.phone = $event),
    P: common_vendor.p({
      placeholder: "电话",
      modelValue: $data.formData.phone
    }),
    Q: common_vendor.p({
      name: "phone",
      label: "电话"
    }),
    R: common_vendor.o(($event) => $data.formData.employeeForm = $event),
    S: common_vendor.p({
      placeholder: "雇佣形式",
      modelValue: $data.formData.employeeForm
    }),
    T: common_vendor.p({
      name: "employeeForm",
      label: "雇佣形式"
    }),
    U: common_vendor.o(($event) => $data.formData.sex = $event),
    V: common_vendor.p({
      placeholder: "性别(男,女,不限制)",
      modelValue: $data.formData.sex
    }),
    W: common_vendor.p({
      name: "sex",
      label: "性别"
    }),
    X: common_vendor.o(($event) => $data.formData.age = $event),
    Y: common_vendor.p({
      placeholder: "年龄（6年7月）",
      modelValue: $data.formData.age
    }),
    Z: common_vendor.p({
      name: "age",
      label: "年龄"
    }),
    aa: common_vendor.o(($event) => $data.formData.sterOperation = $event),
    ab: common_vendor.p({
      placeholder: "绝育手术",
      modelValue: $data.formData.sterOperation
    }),
    ac: common_vendor.p({
      name: "sterOperation",
      label: "绝育手术"
    }),
    ad: common_vendor.o(($event) => $data.formData.vaccinelnoculation = $event),
    ae: common_vendor.p({
      placeholder: "疫苗接种",
      modelValue: $data.formData.vaccinelnoculation
    }),
    af: common_vendor.p({
      name: "vaccinelnoculation",
      label: "疫苗接种"
    }),
    ag: common_vendor.o(($event) => $data.formData.releaseReason = $event),
    ah: common_vendor.p({
      placeholder: "投稿理由",
      modelValue: $data.formData.releaseReason
    }),
    ai: common_vendor.p({
      name: "releaseReason",
      label: "投稿理由"
    }),
    aj: common_vendor.o(($event) => $data.formData.payMethod = $event),
    ak: common_vendor.p({
      placeholder: "支付方式(0线下1线上)",
      type: "number",
      modelValue: $data.formData.payMethod
    }),
    al: common_vendor.p({
      name: "payMethod",
      label: "支付方式"
    }),
    am: common_vendor.o(($event) => $data.formData.postPrice = $event),
    an: common_vendor.p({
      placeholder: "商品价格",
      modelValue: $data.formData.postPrice
    }),
    ao: common_vendor.p({
      name: "postPrice",
      label: "商品价格"
    }),
    ap: common_vendor.o(($event) => $data.formData.status = $event),
    aq: common_vendor.p({
      placeholder: "帖子状态(0待审核1草稿2审核通过3审核不通过4已结束)",
      type: "number",
      modelValue: $data.formData.status
    }),
    ar: common_vendor.p({
      name: "status",
      label: "帖子状态"
    }),
    as: common_vendor.o(($event) => $data.formData.delete = $event),
    at: common_vendor.p({
      placeholder: "逻辑删除(0删除，1未删除)",
      type: "number",
      modelValue: $data.formData.delete
    }),
    av: common_vendor.p({
      name: "delete",
      label: "逻辑删除"
    }),
    aw: common_vendor.o(($event) => $data.formData.browse = $event),
    ax: common_vendor.p({
      placeholder: "浏览数",
      type: "number",
      modelValue: $data.formData.browse
    }),
    ay: common_vendor.p({
      name: "browse",
      label: "浏览数"
    }),
    az: common_vendor.o(($event) => $data.formData.weight = $event),
    aA: common_vendor.p({
      placeholder: "权重",
      type: "number",
      modelValue: $data.formData.weight
    }),
    aB: common_vendor.p({
      name: "weight",
      label: "权重"
    }),
    aC: common_vendor.o(($event) => $data.formData.collect = $event),
    aD: common_vendor.p({
      placeholder: "收藏数",
      type: "number",
      modelValue: $data.formData.collect
    }),
    aE: common_vendor.p({
      name: "collect",
      label: "收藏数"
    }),
    aF: common_vendor.o(($event) => _ctx.binddata("hightLight", $event.detail.value)),
    aG: $data.formData.hightLight,
    aH: common_vendor.p({
      name: "hightLight",
      label: "高亮"
    }),
    aI: common_vendor.o(($event) => $data.formData.location.address = $event),
    aJ: common_vendor.p({
      disabled: true,
      modelValue: $data.formData.location.address
    }),
    aK: common_vendor.p({
      name: "location",
      label: "地理位置"
    }),
    aL: common_vendor.o(($event) => $data.formData.create_date = $event),
    aM: common_vendor.p({
      disabled: true,
      ["return-type"]: "timestamp",
      modelValue: $data.formData.create_date
    }),
    aN: common_vendor.p({
      name: "create_date",
      label: "创建时间"
    }),
    aO: common_vendor.o(($event) => $data.formData.update_date = $event),
    aP: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.update_date
    }),
    aQ: common_vendor.p({
      name: "update_date",
      label: "更新时间"
    }),
    aR: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    aS: common_vendor.sr("form", "6c5dd35a-0"),
    aT: common_vendor.p({
      model: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
