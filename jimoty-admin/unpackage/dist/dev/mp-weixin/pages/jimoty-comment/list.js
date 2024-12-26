"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyComment = require("../../js_sdk/validator/jimoty-comment.js");
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
      collectionList: "jimoty-comment",
      query: "",
      where: "",
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      options: {
        pageSize,
        pageCurrent,
        filterData: {},
        ...js_sdk_validator_jimotyComment.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "jimoty-comment.xls",
        "type": "xls",
        "fields": {
          "评论者的uid": "send_user_id",
          "被评论者的uid": "re_user_id",
          "被评论的帖子": "post_id",
          "评论类型": "type",
          "评论内容": "content",
          "是否已阅": "read_over",
          "评论发表时间": "create_date",
          "publish_ip": "publish_ip"
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
      let newWhere = js_sdk_validator_jimotyComment.filterToWhere(this._filter, db.command);
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
        a: "2a7cebc6-4-" + i0 + "," + ("2a7cebc6-3-" + i0),
        b: "2a7cebc6-5-" + i0 + "," + ("2a7cebc6-3-" + i0),
        c: "2a7cebc6-6-" + i0 + "," + ("2a7cebc6-3-" + i0),
        d: "2a7cebc6-7-" + i0 + "," + ("2a7cebc6-3-" + i0),
        e: "2a7cebc6-8-" + i0 + "," + ("2a7cebc6-3-" + i0),
        f: "2a7cebc6-9-" + i0 + "," + ("2a7cebc6-3-" + i0),
        g: "2a7cebc6-10-" + i0 + "," + ("2a7cebc6-3-" + i0),
        h: "2a7cebc6-11-" + i0 + "," + ("2a7cebc6-3-" + i0),
        i: "2a7cebc6-12-" + i0 + "," + ("2a7cebc6-3-" + i0),
        j: "2a7cebc6-3-" + i0 + "," + ("2a7cebc6-2-" + i0),
        k: common_vendor.f(data, (item, index, i1) => {
          return {
            a: common_vendor.t(item.send_user_id),
            b: "2a7cebc6-14-" + i0 + "-" + i1 + "," + ("2a7cebc6-13-" + i0 + "-" + i1),
            c: common_vendor.t(item.re_user_id),
            d: "2a7cebc6-15-" + i0 + "-" + i1 + "," + ("2a7cebc6-13-" + i0 + "-" + i1),
            e: common_vendor.t(item.post_id),
            f: "2a7cebc6-16-" + i0 + "-" + i1 + "," + ("2a7cebc6-13-" + i0 + "-" + i1),
            g: common_vendor.t(item.type),
            h: "2a7cebc6-17-" + i0 + "-" + i1 + "," + ("2a7cebc6-13-" + i0 + "-" + i1),
            i: common_vendor.t(item.content),
            j: "2a7cebc6-18-" + i0 + "-" + i1 + "," + ("2a7cebc6-13-" + i0 + "-" + i1),
            k: common_vendor.t(item.read_over == true ? "✅" : "❌"),
            l: "2a7cebc6-19-" + i0 + "-" + i1 + "," + ("2a7cebc6-13-" + i0 + "-" + i1),
            m: "2a7cebc6-21-" + i0 + "-" + i1 + "," + ("2a7cebc6-20-" + i0 + "-" + i1),
            n: common_vendor.p({
              threshold: [0, 0],
              date: item.create_date
            }),
            o: "2a7cebc6-20-" + i0 + "-" + i1 + "," + ("2a7cebc6-13-" + i0 + "-" + i1),
            p: common_vendor.t(item.publish_ip),
            q: "2a7cebc6-22-" + i0 + "-" + i1 + "," + ("2a7cebc6-13-" + i0 + "-" + i1),
            r: common_vendor.o(($event) => $options.navigateTo("./edit?id=" + item._id, false), index),
            s: common_vendor.o(($event) => $options.confirmDelete(item._id), index),
            t: "2a7cebc6-23-" + i0 + "-" + i1 + "," + ("2a7cebc6-13-" + i0 + "-" + i1),
            v: index,
            w: "2a7cebc6-13-" + i0 + "-" + i1 + "," + ("2a7cebc6-2-" + i0)
          };
        }),
        l: common_vendor.sr("table", "2a7cebc6-2-" + i0 + ",2a7cebc6-1"),
        m: "2a7cebc6-2-" + i0 + ",2a7cebc6-1",
        n: common_vendor.p({
          loading,
          emptyText: error.message || "没有更多数据",
          border: true,
          stripe: true,
          type: "selection"
        }),
        o: "2a7cebc6-24-" + i0 + ",2a7cebc6-1",
        p: common_vendor.o(($event) => pagination.current = $event),
        q: common_vendor.p({
          ["show-icon"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        r: i0,
        s: s0
      };
    }, {
      name: "d",
      path: "i",
      vueId: "2a7cebc6-1"
    }),
    j: common_vendor.o(($event) => $options.sortChange($event, "send_user_id")),
    k: common_vendor.p({
      align: "center",
      sortable: true
    }),
    l: common_vendor.o(($event) => $options.sortChange($event, "re_user_id")),
    m: common_vendor.p({
      align: "center",
      sortable: true
    }),
    n: common_vendor.o(($event) => $options.sortChange($event, "post_id")),
    o: common_vendor.p({
      align: "center",
      sortable: true
    }),
    p: common_vendor.o(($event) => $options.filterChange($event, "type")),
    q: common_vendor.o(($event) => $options.sortChange($event, "type")),
    r: common_vendor.p({
      align: "center",
      ["filter-type"]: "range",
      sortable: true
    }),
    s: common_vendor.o(($event) => $options.filterChange($event, "content")),
    t: common_vendor.o(($event) => $options.sortChange($event, "content")),
    v: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    w: common_vendor.o(($event) => $options.sortChange($event, "read_over")),
    x: common_vendor.p({
      align: "center",
      sortable: true
    }),
    y: common_vendor.o(($event) => $options.filterChange($event, "create_date")),
    z: common_vendor.o(($event) => $options.sortChange($event, "create_date")),
    A: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    B: common_vendor.o(($event) => $options.filterChange($event, "publish_ip")),
    C: common_vendor.o(($event) => $options.sortChange($event, "publish_ip")),
    D: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
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
    Q: common_vendor.sr("udb", "2a7cebc6-1"),
    R: common_vendor.o($options.onqueryload),
    S: common_vendor.p({
      collection: $data.collectionList,
      field: "send_user_id,re_user_id,post_id,type,content,read_over,create_date,publish_ip",
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
