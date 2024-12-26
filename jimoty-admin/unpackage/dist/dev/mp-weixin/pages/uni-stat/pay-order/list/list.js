"use strict";
const common_vendor = require("../../../../common/vendor.js");
const js_sdk_validator_uniPayOrders = require("../../../../js_sdk/validator/uni-pay-orders.js");
const js_sdk_uniStat_util = require("../../../../js_sdk/uni-stat/util.js");
const uniPayCo = common_vendor.Vs.importObject("uni-pay-co");
const db = common_vendor.Vs.database();
const dbOrderBy = "create_date desc";
const pageSize = 20;
const pageCurrent = 1;
const orderByMapping = {
  "ascending": "asc",
  "descending": "desc"
};
const _sfc_main = {
  data() {
    return {
      collectionList: "uni-pay-orders",
      query: {
        appid: "",
        platform_id: "",
        uni_platform: "",
        version: "",
        pay_date: []
      },
      where: "",
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      filterDefaultValueUserId: "",
      refundFormData: {
        out_trade_no: "",
        max_refund_fee: "",
        refund_fee: "",
        refund_desc: ""
      },
      refundFormRules: {
        refund_fee: {
          rules: [
            // 校验 name 不能为空
            { required: true, errorMessage: "退款金额必须>0" },
            // 对name字段进行长度验证
            {
              minimum: 0.01,
              maximum: 0,
              errorMessage: "最大可退 {maximum} 元"
            }
          ]
        },
        refund_desc: {
          rules: [
            // 校验 name 不能为空
            { required: true, errorMessage: "请输入退款原因" }
          ]
        }
      },
      options: {
        pageSize,
        pageCurrent,
        filterData: {
          "provider_localdata": [
            {
              "text": "微信支付",
              "value": "wxpay"
            },
            {
              "text": "支付宝",
              "value": "alipay"
            },
            {
              "text": "苹果应用内支付",
              "value": "appleiap"
            }
          ],
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
        ...js_sdk_validator_uniPayOrders.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "uni-pay-orders.xls",
        "type": "xls",
        "fields": {
          "用户ID": "user_id",
          "用户昵称": "nickname",
          "支付供应商": "provider",
          "支付方式": "provider_pay_type",
          "应用平台": "uni_platform",
          "订单状态": "status",
          "支付失败原因": "err_msg",
          "订单类型": "type",
          "业务系统订单号": "order_no",
          "支付插件订单号": "out_trade_no",
          "交易单号": "transaction_id",
          "支付描述": "description",
          "订单支付金额": "total_fee",
          "订单退款金额": "refund_fee",
          "当前退款笔数": "refund_count",
          "退款详情": "refund_list",
          "回调状态": "user_order_success",
          "创建时间": "create_date",
          "支付时间": "pay_date",
          "异步通知时间": "notify_date",
          "取消时间": "cancel_date",
          "开放平台appid": "provider_appid",
          "DCloud AppId": "appid",
          "设备ID": "device_id",
          "客户端IP": "client_ip",
          "openid": "openid"
        }
      },
      exportExcelData: []
    };
  },
  onLoad(e) {
    this._filter = {};
    if (e.user_id) {
      this.filterDefaultValueUserId = e.user_id;
      this.filterChange({
        filterType: "search",
        filter: e.user_id
      }, "user_id");
    }
  },
  onReady() {
    this.$refs.udb.loadData();
  },
  methods: {
    onqueryload(data) {
      this.exportExcelData = data;
    },
    getWhere() {
      let where = "";
      let {
        pay_date,
        appid,
        version,
        uni_platform
        //query, // 模糊查询
      } = this.query;
      if (pay_date && pay_date.length == 2) {
        where += ` && pay_date>=${pay_date[0]} && pay_date<=${pay_date[1]}`;
      }
      if (appid) {
        where += ` && appid=='${appid}'`;
      }
      if (version) {
        where += ` && stat_data.app_version=='${version}'`;
      }
      if (uni_platform) {
        where += ` && stat_data.platform=='${uni_platform}'`;
      }
      where = where.substring(3).trim();
      return where;
    },
    search() {
      const newWhere = this.getWhere();
      this.where = newWhere;
      this.$nextTick(() => {
        this.loadData();
      });
    },
    loadData(clear = true) {
      this.$refs.udb.loadData({
        clear
      });
    },
    onPageChanged(e) {
      this.selectedIndexs.length = 0;
      this.$refs.table.clearSelection();
      this.$refs.udb.loadData({
        current: e.current
      });
    },
    navigateTo(url, clear) {
      common_vendor.index.navigateTo({
        url,
        events: {
          refreshData: () => {
            this.loadData(clear);
          }
        }
      });
    },
    // 多选处理
    selectedItems() {
      let dataList = this.$refs.udb.dataList;
      return this.selectedIndexs.map((i) => dataList[i]._id);
    },
    // 批量删除
    delTable() {
      this.$refs.udb.remove(this.selectedItems(), {
        success: (res) => {
          this.$refs.table.clearSelection();
        }
      });
    },
    // 多选
    selectionChange(e) {
      this.selectedIndexs = e.detail.index;
    },
    refundPopup(key, item) {
      if (key) {
        let {
          total_fee = 0,
          refund_fee = 0,
          out_trade_no
        } = item;
        let max_refund_fee = Number(((total_fee - refund_fee) / 100).toFixed(2));
        this.refundFormData.max_refund_fee = max_refund_fee;
        this.refundFormData.refund_fee = max_refund_fee;
        this.refundFormData.out_trade_no = out_trade_no;
        this.refundFormRules.refund_fee.rules[1].maximum = max_refund_fee;
        this.$refs.popup.open();
      } else {
        this.refundFormData.max_refund_fee = "";
        this.refundFormData.refund_fee = "";
        this.refundFormData.out_trade_no = "";
        this.refundFormRules.refund_fee.rules[1].maximum = 0;
        this.$refs.popup.close();
      }
    },
    // 主动退款
    async confirmRefund(item) {
      let {
        total_fee = 0,
        refund_fee = 0,
        out_trade_no,
        refund_desc
      } = item;
      item.refund_fee = Number(item.refund_fee.toFixed(2));
      this.$refs.refundForm.validate().then(async (formData) => {
        let apply_refund_fee = Number(refund_fee);
        if (isNaN(apply_refund_fee) || apply_refund_fee <= 0) {
          common_vendor.index.showToast({
            title: "请输入正确的退款金额",
            icon: "none",
            success: () => {
              setTimeout(() => {
                this.confirmRefund(item);
              }, 500);
            }
          });
          return;
        }
        let refundData = {
          out_trade_no,
          refund_fee: parseInt(apply_refund_fee * 100),
          // 金额已分为单位，100 = 1元
          refund_desc
        };
        let res = await uniPayCo.refund(refundData);
        if (!res.errCode) {
          this.refundPopup(false);
          this.loadData(false);
        }
      }).catch((err) => {
      });
    },
    sortChange(e, name) {
      this.orderByFieldName = name;
      if (e.order) {
        this.orderby = name + " " + orderByMapping[e.order];
      } else {
        this.orderby = "";
      }
      this.$refs.table.clearSelection();
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    },
    filterChange(e, name, k) {
      if (k && e.filter) {
        if (typeof e.filter == "object") {
          if (typeof e.filter[0] === "number")
            e.filter[0] = e.filter[0] / k;
          if (typeof e.filter[1] === "number")
            e.filter[1] = e.filter[1] / k;
        }
      }
      this._filter[name] = {
        type: e.filterType,
        value: e.filter
      };
      let newWhere = js_sdk_validator_uniPayOrders.filterToWhere(this._filter, db.command);
      if (Object.keys(newWhere).length) {
        this.where = newWhere;
      } else {
        this.where = "";
      }
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    },
    platformChange(id, index, name, item) {
      this.query.version = 0;
      this.query.uni_platform = item.code;
    },
    nameFormat(item) {
      if (!item.user_id) {
        return "匿名用户";
      } else if (item.nickname) {
        return `${item.user_id}（${item.nickname}）`;
      } else {
        return item.user_id;
      }
    },
    pageToUser(item) {
      let { user_id } = item;
      common_vendor.index.navigateTo({
        url: `/pages/system/user/list?id=${user_id}`
      });
    }
  },
  watch: {
    query: {
      deep: true,
      handler(val) {
        this.search();
      }
    }
  },
  computed: {
    versionQuery() {
      const {
        appid,
        uni_platform
      } = this.query;
      const query = js_sdk_uniStat_util.stringifyQuery({
        appid,
        uni_platform
      });
      return query;
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_download_excel2 = common_vendor.resolveComponent("download-excel");
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_stat_breadcrumb2 + _easycom_download_excel2 + _easycom_uni_stat_tabs2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_dateformat2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_unicloud_db2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2 + _easycom_uni_popup2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_download_excel = () => "../../../../components/download-excel/download-excel.js";
const _easycom_uni_stat_tabs = () => "../../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_th = () => "../../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_dateformat = () => "../../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_table = () => "../../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_unicloud_db = () => "../../../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
const _easycom_uni_easyinput = () => "../../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_popup = () => "../../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_download_excel + _easycom_uni_stat_tabs + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_dateformat + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: common_vendor.p({
      fields: $data.exportExcel.fields,
      data: $data.exportExcelData,
      type: $data.exportExcel.type,
      name: $data.exportExcel.filename
    }),
    c: common_vendor.o($options.platformChange),
    d: common_vendor.o(($event) => $data.query.platform = $event),
    e: common_vendor.p({
      label: "平台选择",
      type: "boldLine",
      mode: "platform",
      modelValue: $data.query.platform
    }),
    f: common_vendor.w(({
      data,
      pagination,
      loading,
      error,
      options
    }, s0, i0) => {
      return {
        a: "6408b0dd-6-" + i0 + "," + ("6408b0dd-5-" + i0),
        b: common_vendor.sr("user_id", "6408b0dd-7-" + i0 + "," + ("6408b0dd-5-" + i0)),
        c: "6408b0dd-7-" + i0 + "," + ("6408b0dd-5-" + i0),
        d: "6408b0dd-8-" + i0 + "," + ("6408b0dd-5-" + i0),
        e: common_vendor.p({
          align: "center",
          ["filter-type"]: "select",
          ["filter-data"]: options.filterData.provider_localdata
        }),
        f: "6408b0dd-9-" + i0 + "," + ("6408b0dd-5-" + i0),
        g: "6408b0dd-10-" + i0 + "," + ("6408b0dd-5-" + i0),
        h: "6408b0dd-11-" + i0 + "," + ("6408b0dd-5-" + i0),
        i: common_vendor.p({
          align: "center",
          ["filter-type"]: "select",
          ["filter-data"]: options.filterData.status_localdata
        }),
        j: "6408b0dd-12-" + i0 + "," + ("6408b0dd-5-" + i0),
        k: "6408b0dd-13-" + i0 + "," + ("6408b0dd-5-" + i0),
        l: "6408b0dd-14-" + i0 + "," + ("6408b0dd-5-" + i0),
        m: "6408b0dd-15-" + i0 + "," + ("6408b0dd-5-" + i0),
        n: "6408b0dd-16-" + i0 + "," + ("6408b0dd-5-" + i0),
        o: "6408b0dd-17-" + i0 + "," + ("6408b0dd-5-" + i0),
        p: "6408b0dd-18-" + i0 + "," + ("6408b0dd-5-" + i0),
        q: "6408b0dd-19-" + i0 + "," + ("6408b0dd-5-" + i0),
        r: "6408b0dd-20-" + i0 + "," + ("6408b0dd-5-" + i0),
        s: "6408b0dd-21-" + i0 + "," + ("6408b0dd-5-" + i0),
        t: "6408b0dd-22-" + i0 + "," + ("6408b0dd-5-" + i0),
        v: "6408b0dd-23-" + i0 + "," + ("6408b0dd-5-" + i0),
        w: "6408b0dd-24-" + i0 + "," + ("6408b0dd-5-" + i0),
        x: "6408b0dd-25-" + i0 + "," + ("6408b0dd-5-" + i0),
        y: "6408b0dd-26-" + i0 + "," + ("6408b0dd-5-" + i0),
        z: "6408b0dd-27-" + i0 + "," + ("6408b0dd-5-" + i0),
        A: "6408b0dd-28-" + i0 + "," + ("6408b0dd-5-" + i0),
        B: "6408b0dd-5-" + i0 + "," + ("6408b0dd-4-" + i0),
        C: common_vendor.f(data, (item, index, i1) => {
          return common_vendor.e({
            a: common_vendor.t(parseInt(index + 1 + (pagination.current - 1) * pagination.size)),
            b: "6408b0dd-30-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            c: common_vendor.t($options.nameFormat(item)),
            d: common_vendor.o(($event) => $options.pageToUser(item), index),
            e: "6408b0dd-31-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            f: common_vendor.t(options.provider_valuetotext[item.provider]),
            g: "6408b0dd-32-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            h: common_vendor.t(item.provider_pay_type),
            i: "6408b0dd-33-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            j: common_vendor.t(item.uni_platform),
            k: "6408b0dd-34-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            l: common_vendor.t(options.status_valuetotext[item.status]),
            m: "6408b0dd-35-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            n: common_vendor.t(item.type),
            o: "6408b0dd-36-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            p: common_vendor.t(item.order_no),
            q: "6408b0dd-37-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            r: common_vendor.t(item.out_trade_no),
            s: "6408b0dd-38-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            t: common_vendor.t(item.transaction_id),
            v: "6408b0dd-39-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            w: common_vendor.t(item.description),
            x: "6408b0dd-40-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            y: common_vendor.t((item.total_fee * 0.01).toFixed(2)),
            z: "6408b0dd-41-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            A: common_vendor.t((item.refund_fee * 0.01).toFixed(2)),
            B: "6408b0dd-42-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            C: common_vendor.t(item.refund_count),
            D: "6408b0dd-43-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            E: item.user_order_success === true
          }, item.user_order_success === true ? {} : [-1, 0].indexOf(item.status) > -1 ? {} : {}, {
            F: [-1, 0].indexOf(item.status) > -1,
            G: "6408b0dd-44-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            H: "6408b0dd-46-" + i0 + "-" + i1 + "," + ("6408b0dd-45-" + i0 + "-" + i1),
            I: common_vendor.p({
              threshold: [0, 0],
              date: item.create_date
            }),
            J: "6408b0dd-45-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            K: "6408b0dd-48-" + i0 + "-" + i1 + "," + ("6408b0dd-47-" + i0 + "-" + i1),
            L: common_vendor.p({
              threshold: [0, 0],
              date: item.pay_date
            }),
            M: "6408b0dd-47-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            N: "6408b0dd-50-" + i0 + "-" + i1 + "," + ("6408b0dd-49-" + i0 + "-" + i1),
            O: common_vendor.p({
              threshold: [0, 0],
              date: item.cancel_date
            }),
            P: "6408b0dd-49-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            Q: common_vendor.t(item.provider_appid),
            R: "6408b0dd-51-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            S: common_vendor.t(item.appid),
            T: "6408b0dd-52-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            U: common_vendor.t(item.device_id),
            V: "6408b0dd-53-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            W: common_vendor.t(item.client_ip),
            X: "6408b0dd-54-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            Y: common_vendor.t(item.openid),
            Z: "6408b0dd-55-" + i0 + "-" + i1 + "," + ("6408b0dd-29-" + i0 + "-" + i1),
            aa: index,
            ab: "6408b0dd-29-" + i0 + "-" + i1 + "," + ("6408b0dd-4-" + i0)
          });
        }),
        D: common_vendor.sr("table", "6408b0dd-4-" + i0 + ",6408b0dd-3"),
        E: "6408b0dd-4-" + i0 + ",6408b0dd-3",
        F: common_vendor.p({
          loading,
          emptyText: error.message || loading ? "请求中..." : "没有更多数据",
          border: true,
          stripe: true,
          type: ""
        }),
        G: "6408b0dd-56-" + i0 + ",6408b0dd-3",
        H: common_vendor.o(($event) => pagination.current = $event),
        I: common_vendor.p({
          ["show-icon"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        J: i0,
        K: s0
      };
    }, {
      name: "d",
      path: "f",
      vueId: "6408b0dd-3"
    }),
    g: common_vendor.p({
      align: "center"
    }),
    h: common_vendor.o(($event) => $options.filterChange($event, "user_id")),
    i: common_vendor.o(($event) => $options.sortChange($event, "user_id")),
    j: common_vendor.p({
      align: "center",
      filterDefaultValue: $data.filterDefaultValueUserId,
      ["filter-type"]: "search",
      sortable: true
    }),
    k: common_vendor.o(($event) => $options.filterChange($event, "provider")),
    l: common_vendor.o(($event) => $options.filterChange($event, "provider_pay_type")),
    m: common_vendor.o(($event) => $options.sortChange($event, "provider_pay_type")),
    n: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    o: common_vendor.o(($event) => $options.filterChange($event, "uni_platform")),
    p: common_vendor.o(($event) => $options.sortChange($event, "uni_platform")),
    q: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    r: common_vendor.o(($event) => $options.filterChange($event, "status")),
    s: common_vendor.o(($event) => $options.filterChange($event, "type")),
    t: common_vendor.o(($event) => $options.sortChange($event, "type")),
    v: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    w: common_vendor.o(($event) => $options.filterChange($event, "order_no")),
    x: common_vendor.o(($event) => $options.sortChange($event, "order_no")),
    y: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    z: common_vendor.o(($event) => $options.filterChange($event, "out_trade_no")),
    A: common_vendor.o(($event) => $options.sortChange($event, "out_trade_no")),
    B: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    C: common_vendor.o(($event) => $options.filterChange($event, "transaction_id")),
    D: common_vendor.o(($event) => $options.sortChange($event, "transaction_id")),
    E: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    F: common_vendor.o(($event) => $options.filterChange($event, "description")),
    G: common_vendor.o(($event) => $options.sortChange($event, "description")),
    H: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    I: common_vendor.o(($event) => $options.filterChange($event, "total_fee", 0.01)),
    J: common_vendor.o(($event) => $options.sortChange($event, "total_fee")),
    K: common_vendor.p({
      align: "center",
      ["filter-type"]: "range",
      sortable: true
    }),
    L: common_vendor.o(($event) => $options.filterChange($event, "refund_fee", 0.01)),
    M: common_vendor.o(($event) => $options.sortChange($event, "refund_fee")),
    N: common_vendor.p({
      align: "center",
      ["filter-type"]: "range",
      sortable: true
    }),
    O: common_vendor.o(($event) => $options.filterChange($event, "refund_count")),
    P: common_vendor.o(($event) => $options.sortChange($event, "refund_count")),
    Q: common_vendor.p({
      align: "center",
      ["filter-type"]: "range",
      sortable: true
    }),
    R: common_vendor.o(($event) => $options.sortChange($event, "user_order_success")),
    S: common_vendor.p({
      align: "center",
      sortable: true
    }),
    T: common_vendor.o(($event) => $options.filterChange($event, "create_date")),
    U: common_vendor.o(($event) => $options.sortChange($event, "create_date")),
    V: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    W: common_vendor.o(($event) => $options.filterChange($event, "pay_date")),
    X: common_vendor.o(($event) => $options.sortChange($event, "pay_date")),
    Y: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    Z: common_vendor.o(($event) => $options.filterChange($event, "cancel_date")),
    aa: common_vendor.o(($event) => $options.sortChange($event, "cancel_date")),
    ab: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    ac: common_vendor.o(($event) => $options.filterChange($event, "provider_appid")),
    ad: common_vendor.o(($event) => $options.sortChange($event, "provider_appid")),
    ae: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    af: common_vendor.o(($event) => $options.filterChange($event, "appid")),
    ag: common_vendor.o(($event) => $options.sortChange($event, "appid")),
    ah: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    ai: common_vendor.o(($event) => $options.filterChange($event, "device_id")),
    aj: common_vendor.o(($event) => $options.sortChange($event, "device_id")),
    ak: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    al: common_vendor.o(($event) => $options.filterChange($event, "client_ip")),
    am: common_vendor.o(($event) => $options.sortChange($event, "client_ip")),
    an: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    ao: common_vendor.o(($event) => $options.filterChange($event, "openid")),
    ap: common_vendor.o(($event) => $options.sortChange($event, "openid")),
    aq: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    ar: common_vendor.p({
      align: "center"
    }),
    as: common_vendor.p({
      align: "center"
    }),
    at: common_vendor.p({
      align: "center"
    }),
    av: common_vendor.p({
      align: "center"
    }),
    aw: common_vendor.p({
      align: "center"
    }),
    ax: common_vendor.p({
      align: "center"
    }),
    ay: common_vendor.p({
      align: "center"
    }),
    az: common_vendor.p({
      align: "center"
    }),
    aA: common_vendor.p({
      align: "center"
    }),
    aB: common_vendor.p({
      align: "center"
    }),
    aC: common_vendor.p({
      align: "center"
    }),
    aD: common_vendor.p({
      align: "center"
    }),
    aE: common_vendor.p({
      align: "center"
    }),
    aF: common_vendor.p({
      align: "center"
    }),
    aG: common_vendor.p({
      align: "center"
    }),
    aH: common_vendor.p({
      align: "center"
    }),
    aI: common_vendor.p({
      align: "center"
    }),
    aJ: common_vendor.p({
      align: "center"
    }),
    aK: common_vendor.p({
      align: "center"
    }),
    aL: common_vendor.p({
      align: "center"
    }),
    aM: common_vendor.p({
      align: "center"
    }),
    aN: common_vendor.p({
      align: "center"
    }),
    aO: common_vendor.p({
      align: "center"
    }),
    aP: common_vendor.o($options.selectionChange),
    aQ: common_vendor.o($options.onPageChanged),
    aR: common_vendor.sr("udb", "6408b0dd-3"),
    aS: common_vendor.o($options.onqueryload),
    aT: common_vendor.p({
      collection: $data.collectionList,
      field: "user_id,nickname,provider,provider_pay_type,uni_platform,status,type,order_no,out_trade_no,transaction_id,device_id,client_ip,openid,description,err_msg,total_fee,refund_fee,refund_count,refund_list,provider_appid,appid,user_order_success,create_date,pay_date,notify_date,cancel_date",
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent,
      options: $data.options,
      loadtime: "manual"
    }),
    aU: common_vendor.o(common_vendor.m(($event) => $data.refundFormData.refund_fee = $event, {
      number: true
    }, true)),
    aV: common_vendor.p({
      type: "text",
      placeholder: "请输入退款金额",
      clearable: false,
      modelValue: $data.refundFormData.refund_fee
    }),
    aW: common_vendor.t($data.refundFormData.max_refund_fee),
    aX: common_vendor.p({
      label: "退款金额",
      name: "refund_fee"
    }),
    aY: common_vendor.o(($event) => $data.refundFormData.refund_desc = $event),
    aZ: common_vendor.p({
      type: "textarea",
      placeholder: "请输入退款原因",
      clearable: false,
      modelValue: $data.refundFormData.refund_desc
    }),
    ba: common_vendor.p({
      label: "退款原因",
      name: "refund_desc"
    }),
    bb: common_vendor.o(($event) => {
      $options.confirmRefund($data.refundFormData);
    }),
    bc: common_vendor.sr("refundForm", "6408b0dd-58,6408b0dd-57"),
    bd: common_vendor.p({
      modelValue: $data.refundFormData,
      ["label-position"]: "left",
      labelWidth: "100px",
      rules: $data.refundFormRules
    }),
    be: common_vendor.sr("popup", "6408b0dd-57"),
    bf: common_vendor.p({
      type: "center",
      animation: false
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6408b0dd"]]);
wx.createPage(MiniProgramPage);
