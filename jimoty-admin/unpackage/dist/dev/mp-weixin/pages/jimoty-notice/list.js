"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyNotice = require("../../js_sdk/validator/jimoty-notice.js");
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
      collectionList: "jimoty-notice",
      query: "",
      where: "",
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      options: {
        pageSize,
        pageCurrent,
        filterData: {},
        ...js_sdk_validator_jimotyNotice.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "jimoty-notice.xls",
        "type": "xls",
        "fields": {
          "通知类型": "type",
          "发送者": "sendPeople",
          "接收者": "receive",
          "消息": "message",
          "其他消息": "otherMessage",
          "消息状态": "status",
          "create_date": "create_date"
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
      let newWhere = js_sdk_validator_jimotyNotice.filterToWhere(this._filter, db.command);
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
        a: "b429f314-4-" + i0 + "," + ("b429f314-3-" + i0),
        b: "b429f314-5-" + i0 + "," + ("b429f314-3-" + i0),
        c: "b429f314-6-" + i0 + "," + ("b429f314-3-" + i0),
        d: "b429f314-7-" + i0 + "," + ("b429f314-3-" + i0),
        e: "b429f314-8-" + i0 + "," + ("b429f314-3-" + i0),
        f: "b429f314-9-" + i0 + "," + ("b429f314-3-" + i0),
        g: "b429f314-10-" + i0 + "," + ("b429f314-3-" + i0),
        h: "b429f314-11-" + i0 + "," + ("b429f314-3-" + i0),
        i: "b429f314-3-" + i0 + "," + ("b429f314-2-" + i0),
        j: common_vendor.f(data, (item, index, i1) => {
          return {
            a: common_vendor.t(item.type),
            b: "b429f314-13-" + i0 + "-" + i1 + "," + ("b429f314-12-" + i0 + "-" + i1),
            c: common_vendor.t(item.sendPeople),
            d: "b429f314-14-" + i0 + "-" + i1 + "," + ("b429f314-12-" + i0 + "-" + i1),
            e: common_vendor.t(item.receive),
            f: "b429f314-15-" + i0 + "-" + i1 + "," + ("b429f314-12-" + i0 + "-" + i1),
            g: common_vendor.t(item.message),
            h: "b429f314-16-" + i0 + "-" + i1 + "," + ("b429f314-12-" + i0 + "-" + i1),
            i: common_vendor.t(item.otherMessage),
            j: "b429f314-17-" + i0 + "-" + i1 + "," + ("b429f314-12-" + i0 + "-" + i1),
            k: common_vendor.t(item.status == true ? "✅" : "❌"),
            l: "b429f314-18-" + i0 + "-" + i1 + "," + ("b429f314-12-" + i0 + "-" + i1),
            m: "b429f314-20-" + i0 + "-" + i1 + "," + ("b429f314-19-" + i0 + "-" + i1),
            n: common_vendor.p({
              threshold: [0, 0],
              date: item.create_date
            }),
            o: "b429f314-19-" + i0 + "-" + i1 + "," + ("b429f314-12-" + i0 + "-" + i1),
            p: common_vendor.o(($event) => $options.navigateTo("./edit?id=" + item._id, false), index),
            q: common_vendor.o(($event) => $options.confirmDelete(item._id), index),
            r: "b429f314-21-" + i0 + "-" + i1 + "," + ("b429f314-12-" + i0 + "-" + i1),
            s: index,
            t: "b429f314-12-" + i0 + "-" + i1 + "," + ("b429f314-2-" + i0)
          };
        }),
        k: common_vendor.sr("table", "b429f314-2-" + i0 + ",b429f314-1"),
        l: "b429f314-2-" + i0 + ",b429f314-1",
        m: common_vendor.p({
          loading,
          emptyText: error.message || "没有更多数据",
          border: true,
          stripe: true,
          type: "selection"
        }),
        n: "b429f314-22-" + i0 + ",b429f314-1",
        o: common_vendor.o(($event) => pagination.current = $event),
        p: common_vendor.p({
          ["show-icon"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        q: i0,
        r: s0
      };
    }, {
      name: "d",
      path: "i",
      vueId: "b429f314-1"
    }),
    j: common_vendor.o(($event) => $options.filterChange($event, "type")),
    k: common_vendor.o(($event) => $options.sortChange($event, "type")),
    l: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    m: common_vendor.o(($event) => $options.sortChange($event, "sendPeople")),
    n: common_vendor.p({
      align: "center"
    }),
    o: common_vendor.o(($event) => $options.sortChange($event, "receive")),
    p: common_vendor.p({
      align: "center"
    }),
    q: common_vendor.o(($event) => $options.filterChange($event, "message")),
    r: common_vendor.o(($event) => $options.sortChange($event, "message")),
    s: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    t: common_vendor.o(($event) => $options.sortChange($event, "otherMessage")),
    v: common_vendor.p({
      align: "center"
    }),
    w: common_vendor.o(($event) => $options.sortChange($event, "status")),
    x: common_vendor.p({
      align: "center"
    }),
    y: common_vendor.o(($event) => $options.filterChange($event, "create_date")),
    z: common_vendor.o(($event) => $options.sortChange($event, "create_date")),
    A: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp"
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
    K: common_vendor.o($options.selectionChange),
    L: common_vendor.o($options.onPageChanged),
    M: common_vendor.sr("udb", "b429f314-1"),
    N: common_vendor.o($options.onqueryload),
    O: common_vendor.p({
      collection: $data.collectionList,
      field: "type,sendPeople,receive,message,otherMessage,status,create_date",
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
