"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyPayOrder = require("../../js_sdk/validator/jimoty-pay-order.js");
const db = common_vendor.Vs.database();
const dbOrderBy = "";
const dbSearchFields = [];
const pageSize = 20;
const pageCurrent = 1;
const orderByMapping = {
  "ascending": "asc",
  "descending": "desc"
};
const _sfc_main = {
  data() {
    return {
      collectionList: "jimoty-pay-order",
      query: "",
      where: "",
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      options: {
        pageSize,
        pageCurrent,
        filterData: {
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
        ...js_sdk_validator_jimotyPayOrder.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "jimoty-pay-order.xls",
        "type": "xls",
        "fields": {
          "用户ID": "user_id",
          "订单总金额": "total_fee",
          "自定义数据": "custom",
          "业务系统订单号": "order_no",
          "订单类型": "type",
          "订单状态": "status",
          "创建时间": "create_date",
          "支付时间": "pay_date"
        }
      },
      exportExcelData: []
    };
  },
  onLoad() {
    this._filter = {};
  },
  onReady() {
    this.$refs.udb.loadData();
  },
  methods: {
    onqueryload(data) {
      this.exportExcelData = data;
    },
    getWhere() {
      const query = this.query.trim();
      if (!query) {
        return "";
      }
      const queryRe = new RegExp(query, "i");
      return dbSearchFields.map((name) => queryRe + ".test(" + name + ")").join(" || ");
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
      var dataList = this.$refs.udb.dataList;
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
    confirmDelete(id) {
      this.$refs.udb.remove(id, {
        success: (res) => {
          this.$refs.table.clearSelection();
        }
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
    filterChange(e, name) {
      this._filter[name] = {
        type: e.filterType,
        value: e.filter
      };
      let newWhere = js_sdk_validator_jimotyPayOrder.filterToWhere(this._filter, db.command);
      if (Object.keys(newWhere).length) {
        this.where = newWhere;
      } else {
        this.where = "";
      }
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    }
  }
};
if (!Array) {
  const _easycom_download_excel2 = common_vendor.resolveComponent("download-excel");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  (_easycom_download_excel2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_dateformat2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_unicloud_db2)();
}
const _easycom_download_excel = () => "../../components/download-excel/download-excel.js";
const _easycom_uni_th = () => "../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_unicloud_db = () => "../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
if (!Math) {
  (_easycom_download_excel + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_dateformat + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: $data.query,
    c: common_vendor.o(($event) => $data.query = $event.detail.value),
    d: common_vendor.o((...args) => $options.search && $options.search(...args)),
    e: common_vendor.o(($event) => $options.navigateTo("./add")),
    f: !$data.selectedIndexs.length,
    g: common_vendor.o((...args) => $options.delTable && $options.delTable(...args)),
    h: common_vendor.p({
      fields: $data.exportExcel.fields,
      data: $data.exportExcelData,
      type: $data.exportExcel.type,
      name: $data.exportExcel.filename
    }),
    i: common_vendor.w(({
      data,
      pagination,
      loading,
      error,
      options
    }, s0, i0) => {
      return {
        a: "39b017da-4-" + i0 + "," + ("39b017da-3-" + i0),
        b: "39b017da-5-" + i0 + "," + ("39b017da-3-" + i0),
        c: "39b017da-6-" + i0 + "," + ("39b017da-3-" + i0),
        d: "39b017da-7-" + i0 + "," + ("39b017da-3-" + i0),
        e: "39b017da-8-" + i0 + "," + ("39b017da-3-" + i0),
        f: "39b017da-9-" + i0 + "," + ("39b017da-3-" + i0),
        g: common_vendor.p({
          align: "center",
          ["filter-type"]: "select",
          ["filter-data"]: options.filterData.status_localdata
        }),
        h: "39b017da-10-" + i0 + "," + ("39b017da-3-" + i0),
        i: "39b017da-11-" + i0 + "," + ("39b017da-3-" + i0),
        j: "39b017da-12-" + i0 + "," + ("39b017da-3-" + i0),
        k: "39b017da-3-" + i0 + "," + ("39b017da-2-" + i0),
        l: common_vendor.f(data, (item, index, i1) => {
          return {
            a: common_vendor.t(item.user_id),
            b: "39b017da-14-" + i0 + "-" + i1 + "," + ("39b017da-13-" + i0 + "-" + i1),
            c: common_vendor.t(item.total_fee),
            d: "39b017da-15-" + i0 + "-" + i1 + "," + ("39b017da-13-" + i0 + "-" + i1),
            e: common_vendor.t(item.custom),
            f: "39b017da-16-" + i0 + "-" + i1 + "," + ("39b017da-13-" + i0 + "-" + i1),
            g: common_vendor.t(item.order_no),
            h: "39b017da-17-" + i0 + "-" + i1 + "," + ("39b017da-13-" + i0 + "-" + i1),
            i: common_vendor.t(item.type),
            j: "39b017da-18-" + i0 + "-" + i1 + "," + ("39b017da-13-" + i0 + "-" + i1),
            k: common_vendor.t(options.status_valuetotext[item.status]),
            l: "39b017da-19-" + i0 + "-" + i1 + "," + ("39b017da-13-" + i0 + "-" + i1),
            m: "39b017da-21-" + i0 + "-" + i1 + "," + ("39b017da-20-" + i0 + "-" + i1),
            n: common_vendor.p({
              threshold: [0, 0],
              date: item.create_date
            }),
            o: "39b017da-20-" + i0 + "-" + i1 + "," + ("39b017da-13-" + i0 + "-" + i1),
            p: "39b017da-23-" + i0 + "-" + i1 + "," + ("39b017da-22-" + i0 + "-" + i1),
            q: common_vendor.p({
              threshold: [0, 0],
              date: item.pay_date
            }),
            r: "39b017da-22-" + i0 + "-" + i1 + "," + ("39b017da-13-" + i0 + "-" + i1),
            s: common_vendor.o(($event) => $options.navigateTo("./edit?id=" + item._id, false), index),
            t: common_vendor.o(($event) => $options.confirmDelete(item._id), index),
            v: "39b017da-24-" + i0 + "-" + i1 + "," + ("39b017da-13-" + i0 + "-" + i1),
            w: index,
            x: "39b017da-13-" + i0 + "-" + i1 + "," + ("39b017da-2-" + i0)
          };
        }),
        m: common_vendor.sr("table", "39b017da-2-" + i0 + ",39b017da-1"),
        n: "39b017da-2-" + i0 + ",39b017da-1",
        o: common_vendor.p({
          loading,
          emptyText: error.message || "没有更多数据",
          border: true,
          stripe: true,
          type: "selection"
        }),
        p: "39b017da-25-" + i0 + ",39b017da-1",
        q: common_vendor.o(($event) => pagination.current = $event),
        r: common_vendor.p({
          ["show-icon"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        s: i0,
        t: s0
      };
    }, {
      name: "d",
      path: "i",
      vueId: "39b017da-1"
    }),
    j: common_vendor.o(($event) => $options.sortChange($event, "user_id")),
    k: common_vendor.p({
      align: "center",
      sortable: true
    }),
    l: common_vendor.o(($event) => $options.filterChange($event, "total_fee")),
    m: common_vendor.o(($event) => $options.sortChange($event, "total_fee")),
    n: common_vendor.p({
      align: "center",
      ["filter-type"]: "range",
      sortable: true
    }),
    o: common_vendor.o(($event) => $options.sortChange($event, "custom")),
    p: common_vendor.p({
      align: "center",
      sortable: true
    }),
    q: common_vendor.o(($event) => $options.filterChange($event, "order_no")),
    r: common_vendor.o(($event) => $options.sortChange($event, "order_no")),
    s: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    t: common_vendor.o(($event) => $options.filterChange($event, "type")),
    v: common_vendor.o(($event) => $options.sortChange($event, "type")),
    w: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    x: common_vendor.o(($event) => $options.filterChange($event, "status")),
    y: common_vendor.o(($event) => $options.filterChange($event, "create_date")),
    z: common_vendor.o(($event) => $options.sortChange($event, "create_date")),
    A: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    B: common_vendor.o(($event) => $options.filterChange($event, "pay_date")),
    C: common_vendor.o(($event) => $options.sortChange($event, "pay_date")),
    D: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    E: common_vendor.p({
      align: "center"
    }),
    F: common_vendor.p({
      align: "center"
    }),
    G: common_vendor.p({
      align: "center"
    }),
    H: common_vendor.p({
      align: "center"
    }),
    I: common_vendor.p({
      align: "center"
    }),
    J: common_vendor.p({
      align: "center"
    }),
    K: common_vendor.p({
      align: "center"
    }),
    L: common_vendor.p({
      align: "center"
    }),
    M: common_vendor.p({
      align: "center"
    }),
    N: common_vendor.p({
      align: "center"
    }),
    O: common_vendor.o($options.selectionChange),
    P: common_vendor.o($options.onPageChanged),
    Q: common_vendor.sr("udb", "39b017da-1"),
    R: common_vendor.o($options.onqueryload),
    S: common_vendor.p({
      collection: $data.collectionList,
      field: "user_id,total_fee,custom,order_no,type,status,create_date,pay_date",
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent,
      options: $data.options,
      loadtime: "manual"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
