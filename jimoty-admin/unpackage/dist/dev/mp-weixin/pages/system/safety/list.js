"use strict";
const common_vendor = require("../../../common/vendor.js");
const db = common_vendor.Vs.database();
const dbOrderBy = "create_date desc";
const dbSearchFields = ["user_id.username", "user_id.nickname", "type", "ip"];
const pageSize = 20;
const pageCurrent = 1;
const _sfc_main = {
  data() {
    return {
      collectionList: [db.collection("uni-id-log").field("type, ip, create_date, user_id").getTemp(), db.collection("uni-id-users").field("_id, username,nickname").getTemp()],
      query: "",
      where: "",
      orderby: dbOrderBy,
      options: {
        pageSize,
        pageCurrent
      }
    };
  },
  methods: {
    getWhere() {
      const query = this.query.trim();
      if (!query) {
        return "";
      }
      let queryRe;
      try {
        queryRe = new RegExp(query, "i");
      } catch (err) {
        common_vendor.index.showToast({
          title: "请勿输入等不满足正则格式的符号",
          icon: "none"
        });
        return;
      }
      return dbSearchFields.map((name) => queryRe + ".test(" + name + ")").join(" || ");
    },
    search() {
      const newWhere = this.getWhere();
      const isSameWhere = newWhere === this.where;
      this.where = newWhere;
      if (isSameWhere) {
        this.loadData();
      }
    },
    loadData(clear = true) {
      this.$refs.udb.loadData({
        clear
      });
    },
    onPageChanged(e) {
      this.$refs.udb.loadData({
        current: e.current
      });
    },
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url,
        events: {
          refreshData: () => {
            this.loadData();
          }
        }
      });
    },
    // 多选处理
    selectedItems() {
      let dataList = this.$refs.udb.dataList;
      return this.selectedIndexs.map((i) => dataList[i]._id);
    },
    //批量删除
    delTable() {
      this.$refs.udb.remove(this.selectedItems());
    },
    // 多选
    selectionChange(e) {
      this.selectedIndexs = e.detail.index;
    },
    confirmDelete(id) {
      this.$refs.udb.remove(id);
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_dateformat2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_unicloud_db2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_unicloud_db = () => "../../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_dateformat + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: _ctx.$t("common.placeholder.query"),
    c: $data.query,
    d: common_vendor.o(($event) => $data.query = $event.detail.value),
    e: common_vendor.t(_ctx.$t("common.button.search")),
    f: common_vendor.o((...args) => $options.search && $options.search(...args)),
    g: common_vendor.w(({
      data,
      pagination,
      loading,
      error
    }, s0, i0) => {
      return {
        a: "4911c243-4-" + i0 + "," + ("4911c243-3-" + i0),
        b: "4911c243-5-" + i0 + "," + ("4911c243-3-" + i0),
        c: "4911c243-6-" + i0 + "," + ("4911c243-3-" + i0),
        d: "4911c243-7-" + i0 + "," + ("4911c243-3-" + i0),
        e: "4911c243-8-" + i0 + "," + ("4911c243-3-" + i0),
        f: "4911c243-9-" + i0 + "," + ("4911c243-3-" + i0),
        g: "4911c243-3-" + i0 + "," + ("4911c243-2-" + i0),
        h: common_vendor.f(data, (item, index, i1) => {
          return {
            a: common_vendor.t((pagination.current - 1) * pagination.size + (index + 1)),
            b: "4911c243-11-" + i0 + "-" + i1 + "," + ("4911c243-10-" + i0 + "-" + i1),
            c: common_vendor.t(item.user_id[0] && item.user_id[0].username || "-"),
            d: "4911c243-12-" + i0 + "-" + i1 + "," + ("4911c243-10-" + i0 + "-" + i1),
            e: common_vendor.t(item.user_id[0] && item.user_id[0].nickname || "-"),
            f: "4911c243-13-" + i0 + "-" + i1 + "," + ("4911c243-10-" + i0 + "-" + i1),
            g: common_vendor.t(item.type),
            h: "4911c243-14-" + i0 + "-" + i1 + "," + ("4911c243-10-" + i0 + "-" + i1),
            i: common_vendor.t(item.ip),
            j: "4911c243-15-" + i0 + "-" + i1 + "," + ("4911c243-10-" + i0 + "-" + i1),
            k: "4911c243-17-" + i0 + "-" + i1 + "," + ("4911c243-16-" + i0 + "-" + i1),
            l: common_vendor.p({
              date: item.create_date,
              threshold: [0, 0]
            }),
            m: "4911c243-16-" + i0 + "-" + i1 + "," + ("4911c243-10-" + i0 + "-" + i1),
            n: index,
            o: "4911c243-10-" + i0 + "-" + i1 + "," + ("4911c243-2-" + i0)
          };
        }),
        i: "4911c243-2-" + i0 + ",4911c243-1",
        j: common_vendor.p({
          loading,
          emptyText: error.message || "没有更多数据",
          border: true,
          stripe: true
        }),
        k: "4911c243-18-" + i0 + ",4911c243-1",
        l: common_vendor.o(($event) => pagination.current = $event),
        m: common_vendor.p({
          ["show-icon"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        n: i0,
        o: s0
      };
    }, {
      name: "d",
      path: "g",
      vueId: "4911c243-1"
    }),
    h: common_vendor.p({
      align: "center"
    }),
    i: common_vendor.p({
      align: "center"
    }),
    j: common_vendor.p({
      align: "center"
    }),
    k: common_vendor.p({
      align: "center"
    }),
    l: common_vendor.p({
      align: "center"
    }),
    m: common_vendor.p({
      align: "center"
    }),
    n: common_vendor.p({
      align: "center"
    }),
    o: common_vendor.p({
      align: "center"
    }),
    p: common_vendor.p({
      align: "center"
    }),
    q: common_vendor.p({
      align: "center"
    }),
    r: common_vendor.p({
      align: "center"
    }),
    s: common_vendor.p({
      align: "center"
    }),
    t: common_vendor.o($options.onPageChanged),
    v: common_vendor.sr("udb", "4911c243-1"),
    w: common_vendor.p({
      collection: $data.collectionList,
      options: $data.options,
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
