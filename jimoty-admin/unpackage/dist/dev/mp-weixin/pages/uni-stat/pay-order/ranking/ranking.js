"use strict";
const common_vendor = require("../../../../common/vendor.js");
const js_sdk_validator_uniPayOrders = require("../../../../js_sdk/validator/uni-pay-orders.js");
const js_sdk_uniStat_util = require("../../../../js_sdk/uni-stat/util.js");
const js_sdk_uniStat_timeUtil = require("../../../../js_sdk/uni-stat/timeUtil.js");
const db = common_vendor.Vs.database();
const dbOrderBy = "total_fee desc";
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
        pay_date: [],
        channel_code: ""
      },
      where: "",
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      options: {
        pageSize,
        pageCurrent,
        filterData: {},
        ...js_sdk_validator_uniPayOrders.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "价值用户排行.xls",
        "type": "xls",
        "fields": {
          "用户ID": "user_id",
          "用户昵称": "nickname",
          "支付金额": "total_fee",
          "订单数量": "count"
        }
      },
      exportExcelData: [],
      // 时间选项
      dateTabs: {
        time: [],
        timeStr: "",
        index: null,
        list: [
          { _id: 0, name: "今天" },
          { _id: 1, name: "昨天" },
          { _id: 7, name: "最近七天" },
          { _id: 30, name: "最近30天" },
          { _id: 90, name: "最近90天" }
        ]
      }
    };
  },
  onLoad() {
    this._filter = {};
  },
  onReady() {
  },
  methods: {
    payDatePicker(val) {
      this.query.pay_date = val;
      this.search();
    },
    onqueryload(data) {
      this.exportExcelData = data;
    },
    getWhere() {
      let where = "status>0";
      let {
        pay_date,
        appid,
        version,
        uni_platform,
        channel_code
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
      if (channel_code) {
        where += ` && stat_data.channel=='${channel_code}'`;
      }
      where = where.trim();
      console.log("where: ", where);
      return where;
    },
    search() {
      if (!this.query.appid)
        return;
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
    filterChange(e, name) {
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
    },
    pageToOrder(item) {
      let { user_id } = item;
      common_vendor.index.navigateTo({
        url: `/pages/uni-stat/pay-order/list/list?user_id=${user_id}`
      });
    },
    // 监听 - 日期选择更改
    dateTabsChange(id, index) {
      this.dateTabs.index = index;
      let start = js_sdk_uniStat_util.getTimeOfSomeDayAgo(id);
      let end = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("day", 0).endTime;
      if (id == 1) {
        end = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("day", 0, start).endTime;
      }
      this.query.pay_date = [start, end];
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
    },
    channelQuery() {
      const {
        appid,
        platform_id
      } = this.query;
      const query = js_sdk_uniStat_util.stringifyQuery({
        appid,
        platform_id
      });
      return query;
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_download_excel2 = common_vendor.resolveComponent("download-excel");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  (_easycom_uni_stat_breadcrumb2 + _easycom_download_excel2 + _easycom_uni_data_select2 + _easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_unicloud_db2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_download_excel = () => "../../../../components/download-excel/download-excel.js";
const _easycom_uni_data_select = () => "../../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_stat_tabs = () => "../../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_th = () => "../../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_unicloud_db = () => "../../../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_download_excel + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: common_vendor.p({
      fields: $data.exportExcel.fields,
      data: $data.exportExcelData,
      type: $data.exportExcel.type,
      name: $data.exportExcel.filename
    }),
    c: common_vendor.o(($event) => $data.query.appid = $event),
    d: common_vendor.p({
      collection: "opendb-app-list",
      field: "appid as value, name as text",
      orderby: "text asc",
      defItem: 1,
      label: "应用选择",
      clear: false,
      modelValue: $data.query.appid
    }),
    e: common_vendor.o(($event) => $data.query.version_id = $event),
    f: common_vendor.p({
      collection: "opendb-app-versions",
      where: $options.versionQuery,
      field: "_id as value, version as text, uni_platform as label, create_date as date",
      format: "{label} - {text}",
      orderby: "date desc",
      label: "版本选择",
      modelValue: $data.query.version_id
    }),
    g: common_vendor.o($options.platformChange),
    h: common_vendor.o(($event) => $data.query.platform_id = $event),
    i: common_vendor.p({
      label: "平台选择",
      type: "boldLine",
      mode: "platform",
      modelValue: $data.query.platform_id
    }),
    j: $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1
  }, $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1 ? {
    k: common_vendor.sr("version-select", "9ccebdfd-5"),
    l: common_vendor.o(($event) => $data.query.channel_code = $event),
    m: common_vendor.p({
      collection: "uni-stat-app-channels",
      where: $options.channelQuery,
      field: "channel_code as value, channel_name as text",
      orderby: "text asc",
      label: "渠道/场景值选择",
      modelValue: $data.query.channel_code
    })
  } : {}, {
    n: common_vendor.o($options.dateTabsChange),
    o: common_vendor.p({
      type: "box",
      current: $data.dateTabs.index,
      tabs: $data.dateTabs.list
    }),
    p: common_vendor.o(($event) => $data.dateTabs.index = null),
    q: common_vendor.o(($event) => $data.query.pay_date = $event),
    r: common_vendor.p({
      type: "datetimerange",
      end: Date.now(),
      ["return-type"]: "timestamp",
      ["clear-icon"]: true,
      modelValue: $data.query.pay_date
    }),
    s: common_vendor.w(({
      data,
      pagination,
      loading,
      error,
      options
    }, s0, i0) => {
      return {
        a: "9ccebdfd-11-" + i0 + "," + ("9ccebdfd-10-" + i0),
        b: "9ccebdfd-12-" + i0 + "," + ("9ccebdfd-10-" + i0),
        c: "9ccebdfd-13-" + i0 + "," + ("9ccebdfd-10-" + i0),
        d: "9ccebdfd-14-" + i0 + "," + ("9ccebdfd-10-" + i0),
        e: "9ccebdfd-10-" + i0 + "," + ("9ccebdfd-9-" + i0),
        f: common_vendor.f(data, (item, index, i1) => {
          return {
            a: common_vendor.t(parseInt(index + 1 + (pagination.current - 1) * pagination.size)),
            b: "9ccebdfd-16-" + i0 + "-" + i1 + "," + ("9ccebdfd-15-" + i0 + "-" + i1),
            c: common_vendor.t($options.nameFormat(item)),
            d: common_vendor.o(($event) => $options.pageToUser(item), index),
            e: "9ccebdfd-17-" + i0 + "-" + i1 + "," + ("9ccebdfd-15-" + i0 + "-" + i1),
            f: common_vendor.t((item.reality_fee / 100).toFixed(2)),
            g: "9ccebdfd-18-" + i0 + "-" + i1 + "," + ("9ccebdfd-15-" + i0 + "-" + i1),
            h: common_vendor.t(item.count),
            i: common_vendor.o(($event) => $options.pageToOrder(item), index),
            j: "9ccebdfd-19-" + i0 + "-" + i1 + "," + ("9ccebdfd-15-" + i0 + "-" + i1),
            k: index,
            l: "9ccebdfd-15-" + i0 + "-" + i1 + "," + ("9ccebdfd-9-" + i0)
          };
        }),
        g: common_vendor.sr("table", "9ccebdfd-9-" + i0 + ",9ccebdfd-8"),
        h: "9ccebdfd-9-" + i0 + ",9ccebdfd-8",
        i: common_vendor.p({
          loading,
          emptyText: error.message || loading ? "请求中..." : "没有更多数据",
          border: true,
          stripe: true,
          type: ""
        }),
        j: "9ccebdfd-20-" + i0 + ",9ccebdfd-8",
        k: common_vendor.o(($event) => pagination.current = $event),
        l: common_vendor.p({
          ["show-icon"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        m: i0,
        n: s0
      };
    }, {
      name: "d",
      path: "s",
      vueId: "9ccebdfd-8"
    }),
    t: common_vendor.p({
      align: "center"
    }),
    v: common_vendor.o(($event) => $options.sortChange($event, "user_id")),
    w: common_vendor.p({
      align: "center",
      sortable: true
    }),
    x: common_vendor.o(($event) => $options.sortChange($event, "reality_fee")),
    y: common_vendor.p({
      align: "center",
      sortable: true
    }),
    z: common_vendor.o(($event) => $options.sortChange($event, "count")),
    A: common_vendor.p({
      align: "center",
      sortable: true
    }),
    B: common_vendor.p({
      align: "center"
    }),
    C: common_vendor.p({
      align: "center"
    }),
    D: common_vendor.p({
      align: "center"
    }),
    E: common_vendor.p({
      align: "center"
    }),
    F: common_vendor.o($options.selectionChange),
    G: common_vendor.o($options.onPageChanged),
    H: common_vendor.sr("udb", "9ccebdfd-8"),
    I: common_vendor.o($options.onqueryload),
    J: common_vendor.p({
      collection: $data.collectionList,
      field: "user_id,nickname,uni_platform,status,total_fee,refund_fee,appid,pay_date",
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent,
      groupby: "user_id",
      ["group-field"]: "sum(total_fee) as total_fee,sum(refund_fee) as refund_fee, sum(subtract(total_fee,refund_fee)) as reality_fee, sum(1) as count,last(nickname) as nickname",
      options: $data.options,
      loadtime: "manual"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9ccebdfd"]]);
wx.createPage(MiniProgramPage);
