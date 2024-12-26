"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyCategory = require("../../js_sdk/validator/jimoty-category.js");
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
      collectionList: "jimoty-category",
      query: "",
      where: "",
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      options: {
        pageSize,
        pageCurrent,
        filterData: {},
        ...js_sdk_validator_jimotyCategory.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "jimoty-category.xls",
        "type": "xls",
        "fields": {
          "name": "name",
          "parent_id": "parent_id",
          "create_time": "create_time"
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
      let newWhere = js_sdk_validator_jimotyCategory.filterToWhere(this._filter, db.command);
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
        a: "abe85660-4-" + i0 + "," + ("abe85660-3-" + i0),
        b: "abe85660-5-" + i0 + "," + ("abe85660-3-" + i0),
        c: "abe85660-6-" + i0 + "," + ("abe85660-3-" + i0),
        d: "abe85660-7-" + i0 + "," + ("abe85660-3-" + i0),
        e: "abe85660-3-" + i0 + "," + ("abe85660-2-" + i0),
        f: common_vendor.f(data, (item, index, i1) => {
          return {
            a: common_vendor.t(item.name),
            b: "abe85660-9-" + i0 + "-" + i1 + "," + ("abe85660-8-" + i0 + "-" + i1),
            c: common_vendor.t(item.parent_id),
            d: "abe85660-10-" + i0 + "-" + i1 + "," + ("abe85660-8-" + i0 + "-" + i1),
            e: "abe85660-12-" + i0 + "-" + i1 + "," + ("abe85660-11-" + i0 + "-" + i1),
            f: common_vendor.p({
              threshold: [0, 0],
              date: item.create_time
            }),
            g: "abe85660-11-" + i0 + "-" + i1 + "," + ("abe85660-8-" + i0 + "-" + i1),
            h: common_vendor.o(($event) => $options.navigateTo("./edit?id=" + item._id, false), index),
            i: common_vendor.o(($event) => $options.confirmDelete(item._id), index),
            j: "abe85660-13-" + i0 + "-" + i1 + "," + ("abe85660-8-" + i0 + "-" + i1),
            k: index,
            l: "abe85660-8-" + i0 + "-" + i1 + "," + ("abe85660-2-" + i0)
          };
        }),
        g: common_vendor.sr("table", "abe85660-2-" + i0 + ",abe85660-1"),
        h: "abe85660-2-" + i0 + ",abe85660-1",
        i: common_vendor.p({
          loading,
          emptyText: error.message || "没有更多数据",
          border: true,
          stripe: true,
          type: "selection"
        }),
        j: "abe85660-14-" + i0 + ",abe85660-1",
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
      path: "i",
      vueId: "abe85660-1"
    }),
    j: common_vendor.o(($event) => $options.filterChange($event, "name")),
    k: common_vendor.o(($event) => $options.sortChange($event, "name")),
    l: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    m: common_vendor.o(($event) => $options.filterChange($event, "parent_id")),
    n: common_vendor.o(($event) => $options.sortChange($event, "parent_id")),
    o: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    p: common_vendor.o(($event) => $options.filterChange($event, "create_time")),
    q: common_vendor.o(($event) => $options.sortChange($event, "create_time")),
    r: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    s: common_vendor.p({
      align: "center"
    }),
    t: common_vendor.p({
      align: "center"
    }),
    v: common_vendor.p({
      align: "center"
    }),
    w: common_vendor.p({
      align: "center"
    }),
    x: common_vendor.p({
      align: "center"
    }),
    y: common_vendor.o($options.selectionChange),
    z: common_vendor.o($options.onPageChanged),
    A: common_vendor.sr("udb", "abe85660-1"),
    B: common_vendor.o($options.onqueryload),
    C: common_vendor.p({
      collection: $data.collectionList,
      field: "name,parent_id,create_time",
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
