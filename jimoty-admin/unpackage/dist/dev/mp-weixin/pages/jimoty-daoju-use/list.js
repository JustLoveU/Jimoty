"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyDaojuUse = require("../../js_sdk/validator/jimoty-daoju-use.js");
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
      collectionList: "jimoty-daoju-use",
      query: "",
      where: "",
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      options: {
        pageSize,
        pageCurrent,
        filterData: {},
        ...js_sdk_validator_jimotyDaojuUse.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "jimoty-daoju-use.xls",
        "type": "xls",
        "fields": {
          "道具使用者": "daojuUserId",
          "被使用的投稿": "daojuPostId",
          "道具类型": "daojuType",
          "end_date": "end_date",
          "delete": "delete",
          "create_date": "create_date",
          "update_date": "update_date"
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
      let newWhere = js_sdk_validator_jimotyDaojuUse.filterToWhere(this._filter, db.command);
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
        a: "f14804b6-4-" + i0 + "," + ("f14804b6-3-" + i0),
        b: "f14804b6-5-" + i0 + "," + ("f14804b6-3-" + i0),
        c: "f14804b6-6-" + i0 + "," + ("f14804b6-3-" + i0),
        d: "f14804b6-7-" + i0 + "," + ("f14804b6-3-" + i0),
        e: "f14804b6-8-" + i0 + "," + ("f14804b6-3-" + i0),
        f: "f14804b6-9-" + i0 + "," + ("f14804b6-3-" + i0),
        g: "f14804b6-10-" + i0 + "," + ("f14804b6-3-" + i0),
        h: "f14804b6-11-" + i0 + "," + ("f14804b6-3-" + i0),
        i: "f14804b6-3-" + i0 + "," + ("f14804b6-2-" + i0),
        j: common_vendor.f(data, (item, index, i1) => {
          return {
            a: common_vendor.t(item.daojuUserId),
            b: "f14804b6-13-" + i0 + "-" + i1 + "," + ("f14804b6-12-" + i0 + "-" + i1),
            c: common_vendor.t(item.daojuPostId),
            d: "f14804b6-14-" + i0 + "-" + i1 + "," + ("f14804b6-12-" + i0 + "-" + i1),
            e: common_vendor.t(item.daojuType),
            f: "f14804b6-15-" + i0 + "-" + i1 + "," + ("f14804b6-12-" + i0 + "-" + i1),
            g: "f14804b6-17-" + i0 + "-" + i1 + "," + ("f14804b6-16-" + i0 + "-" + i1),
            h: common_vendor.p({
              threshold: [0, 0],
              date: item.end_date
            }),
            i: "f14804b6-16-" + i0 + "-" + i1 + "," + ("f14804b6-12-" + i0 + "-" + i1),
            j: common_vendor.t(item.delete == true ? "✅" : "❌"),
            k: "f14804b6-18-" + i0 + "-" + i1 + "," + ("f14804b6-12-" + i0 + "-" + i1),
            l: "f14804b6-20-" + i0 + "-" + i1 + "," + ("f14804b6-19-" + i0 + "-" + i1),
            m: common_vendor.p({
              threshold: [0, 0],
              date: item.create_date
            }),
            n: "f14804b6-19-" + i0 + "-" + i1 + "," + ("f14804b6-12-" + i0 + "-" + i1),
            o: "f14804b6-22-" + i0 + "-" + i1 + "," + ("f14804b6-21-" + i0 + "-" + i1),
            p: common_vendor.p({
              threshold: [0, 0],
              date: item.update_date
            }),
            q: "f14804b6-21-" + i0 + "-" + i1 + "," + ("f14804b6-12-" + i0 + "-" + i1),
            r: common_vendor.o(($event) => $options.navigateTo("./edit?id=" + item._id, false), index),
            s: common_vendor.o(($event) => $options.confirmDelete(item._id), index),
            t: "f14804b6-23-" + i0 + "-" + i1 + "," + ("f14804b6-12-" + i0 + "-" + i1),
            v: index,
            w: "f14804b6-12-" + i0 + "-" + i1 + "," + ("f14804b6-2-" + i0)
          };
        }),
        k: common_vendor.sr("table", "f14804b6-2-" + i0 + ",f14804b6-1"),
        l: "f14804b6-2-" + i0 + ",f14804b6-1",
        m: common_vendor.p({
          loading,
          emptyText: error.message || "没有更多数据",
          border: true,
          stripe: true,
          type: "selection"
        }),
        n: "f14804b6-24-" + i0 + ",f14804b6-1",
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
      vueId: "f14804b6-1"
    }),
    j: common_vendor.o(($event) => $options.sortChange($event, "daojuUserId")),
    k: common_vendor.p({
      align: "center",
      sortable: true
    }),
    l: common_vendor.o(($event) => $options.sortChange($event, "daojuPostId")),
    m: common_vendor.p({
      align: "center",
      sortable: true
    }),
    n: common_vendor.o(($event) => $options.filterChange($event, "daojuType")),
    o: common_vendor.o(($event) => $options.sortChange($event, "daojuType")),
    p: common_vendor.p({
      align: "center",
      ["filter-type"]: "range",
      sortable: true
    }),
    q: common_vendor.o(($event) => $options.filterChange($event, "end_date")),
    r: common_vendor.o(($event) => $options.sortChange($event, "end_date")),
    s: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    t: common_vendor.o(($event) => $options.sortChange($event, "delete")),
    v: common_vendor.p({
      align: "center",
      sortable: true
    }),
    w: common_vendor.o(($event) => $options.filterChange($event, "create_date")),
    x: common_vendor.o(($event) => $options.sortChange($event, "create_date")),
    y: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    z: common_vendor.o(($event) => $options.filterChange($event, "update_date")),
    A: common_vendor.o(($event) => $options.sortChange($event, "update_date")),
    B: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
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
    K: common_vendor.p({
      align: "center"
    }),
    L: common_vendor.o($options.selectionChange),
    M: common_vendor.o($options.onPageChanged),
    N: common_vendor.sr("udb", "f14804b6-1"),
    O: common_vendor.o($options.onqueryload),
    P: common_vendor.p({
      collection: $data.collectionList,
      field: "daojuUserId,daojuPostId,daojuType,end_date,delete,create_date,update_date",
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
