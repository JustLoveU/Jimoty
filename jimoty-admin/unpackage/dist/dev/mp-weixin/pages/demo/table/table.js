"use strict";
const pages_demo_table_tableData = require("./tableData.js");
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  // 数据属性
  data() {
    return {
      // 搜索值
      searchVal: "",
      // 表格数据
      tableData: [],
      // 每页数据量
      pageSize: 10,
      // 当前页
      pageCurrent: 1,
      // 数据总量
      total: 0,
      // 加载状态
      loading: false
    };
  },
  // 页面加载时的处理函数
  onLoad() {
    this.selectedIndexs = [];
    this.getData(1);
  },
  // 方法
  methods: {
    // 多选处理
    selectedItems() {
      return this.selectedIndexs.map((i) => this.tableData[i]);
    },
    // 多选事件处理函数
    selectionChange(e) {
      this.selectedIndexs = e.detail.index;
    },
    // 批量删除函数
    delTable() {
      this.selectedItems();
    },
    // 分页触发事件处理函数
    change(e) {
      this.getData(e.current);
    },
    // 搜索函数
    search() {
      this.getData(1, this.searchVal);
    },
    // 获取数据函数
    getData(pageCurrent, value = "") {
      this.loading = true;
      this.pageCurrent = pageCurrent;
      this.request({
        pageSize: this.pageSize,
        pageCurrent,
        value,
        success: (res) => {
          this.tableData = res.data;
          this.total = res.total;
          this.loading = false;
        }
      });
    },
    // 伪request请求函数
    request(options) {
      const {
        pageSize,
        pageCurrent,
        success,
        value
      } = options;
      let total = pages_demo_table_tableData.tableData.length;
      let data = pages_demo_table_tableData.tableData.filter((item, index) => {
        const idx = index - (pageCurrent - 1) * pageSize;
        return idx < pageSize && idx >= 0;
      });
      if (value) {
        data = [];
        pages_demo_table_tableData.tableData.forEach((item) => {
          if (item.name.indexOf(value) !== -1) {
            data.push(item);
          }
        });
        total = data.length;
      }
      setTimeout(() => {
        typeof success === "function" && success({
          data,
          total
        });
      }, 500);
    }
  }
};
if (!Array) {
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_fix_window2)();
}
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_fix_window = () => "../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table + _easycom_uni_pagination + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t(_ctx.$t("demo.table.title")),
    b: common_vendor.o((...args) => $options.search && $options.search(...args)),
    c: _ctx.$t("common.placeholder.query"),
    d: $data.searchVal,
    e: common_vendor.o(($event) => $data.searchVal = $event.detail.value),
    f: common_vendor.t(_ctx.$t("common.button.search")),
    g: common_vendor.o((...args) => $options.search && $options.search(...args)),
    h: common_vendor.t(_ctx.$t("common.button.add")),
    i: common_vendor.t(_ctx.$t("common.button.batchDelete")),
    j: common_vendor.o((...args) => $options.delTable && $options.delTable(...args)),
    k: common_vendor.p({
      width: "150",
      align: "center"
    }),
    l: common_vendor.p({
      width: "150",
      align: "center"
    }),
    m: common_vendor.p({
      align: "center"
    }),
    n: common_vendor.p({
      width: "204",
      align: "center"
    }),
    o: common_vendor.f($data.tableData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.date),
        b: "238894ee-7-" + i0 + "," + ("238894ee-6-" + i0),
        c: common_vendor.t(item.name),
        d: "238894ee-8-" + i0 + "," + ("238894ee-6-" + i0),
        e: common_vendor.t(item.address),
        f: "238894ee-9-" + i0 + "," + ("238894ee-6-" + i0),
        g: "238894ee-10-" + i0 + "," + ("238894ee-6-" + i0),
        h: index,
        i: "238894ee-6-" + i0 + ",238894ee-0"
      };
    }),
    p: common_vendor.t(_ctx.$t("common.button.edit")),
    q: common_vendor.t(_ctx.$t("common.button.delete")),
    r: common_vendor.o($options.selectionChange),
    s: common_vendor.p({
      loading: $data.loading,
      border: true,
      stripe: true,
      type: "selection",
      emptyText: _ctx.$t("common.empty")
    }),
    t: common_vendor.o($options.change),
    v: common_vendor.p({
      ["show-icon"]: true,
      ["page-size"]: $data.pageSize,
      current: $data.pageCurrent,
      total: $data.total
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
