"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_uniStatPages = require("../../../js_sdk/validator/uni-stat-pages.js");
const db = common_vendor.Vs.database();
const dbOrderBy = "";
const dbSearchFields = ["title", "path"];
const pageSize = 20;
const pageCurrent = 1;
const orderByMapping = {
  "ascending": "asc",
  "descending": "desc"
};
const _sfc_main = {
  data() {
    return {
      collectionList: "uni-stat-pages",
      appid: "",
      query: "",
      where: "",
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      errorMessage: "",
      options: {
        pageSize,
        pageCurrent,
        filterData: {},
        ...js_sdk_validator_uniStatPages.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "uni-stat-pages.xls",
        "type": "xls",
        "fields": {
          "title": "title",
          "path": "path"
        }
      },
      exportExcelData: [],
      pageInfo: {
        _id: "",
        page_rules: []
      },
      editRulePopup: {
        loading: false,
        tips: `页面规则说明：
1. 用于生成内容统计 url 的规则。通过设置页面有效参数，通过带参数的 url 对内容进行标识。例如有一个详情页面的请求有三个参数 page/detail/detail?id=1&type=1&t=1565943419，其中 t 为时间戳或随机数，则 id 和 type 为有效参数，需要在页面规则 page/detail/detail 中添加 id,type 这两个参数。
2. 每条规则可以添加多个参数，进行匹配时，每条规则单独生效。
3. 每个页面可以添加多个规则（最多 5 个规则），进行匹配时，后添加的规则优先级较高
4. 目前的匹配规则只能处理通过 url 显式传递参数，且参数形式为上述示例中的键值对格式。`,
        isAddParam: false,
        addParamInfo: {
          index1: "",
          value: ""
        }
      }
    };
  },
  onLoad() {
    this._filter = {};
  },
  onReady() {
    if (this.$refs.appListRef) {
      this.appid = this.$refs.appListRef.getCache();
      this.search();
    }
  },
  methods: {
    onqueryload(data) {
      this.exportExcelData = data;
    },
    getWhere() {
      const query = this.query.trim();
      let queryStr = "";
      if (query) {
        const queryRe = new RegExp(query, "i");
        queryStr = dbSearchFields.map((name) => queryRe + ".test(" + name + ")").join(" || ");
      }
      if (this.appid) {
        if (query) {
          queryStr = `appid=='${this.appid}' && (${queryStr})`;
        } else {
          queryStr = `appid=='${this.appid}'`;
        }
      }
      return queryStr;
    },
    search() {
      this.errorMessage = "";
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
      let newWhere = js_sdk_validator_uniStatPages.filterToWhere(this._filter, db.command);
      if (Object.keys(newWhere).length) {
        this.where = newWhere;
      } else {
        this.where = "";
      }
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    },
    // 编辑规则
    editRule(item) {
      this.$refs.editRulePopup.open();
      if (!item.page_rules || !item.page_rules.length) {
        item.page_rules = [
          []
        ];
      }
      this.pageInfo = {
        _id: item._id,
        page_rules: JSON.parse(JSON.stringify(item.page_rules))
        // 深拷贝，解除引用关系
      };
    },
    // 添加一个规则
    addRulesItem() {
      this.pageInfo.page_rules.unshift([]);
    },
    // 删除一个规则
    deleteRulesItem(index1) {
      this.pageInfo.page_rules.splice(index1, 1);
    },
    // 添加一个参数
    addParamItem(index1) {
      this.editRulePopup.isAddParam = true;
      this.editRulePopup.addParamInfo.value = "";
      this.editRulePopup.addParamInfo.index1 = index1;
    },
    // 确认添加参数
    confirmAddParamItem(index1) {
      if (this.editRulePopup.addParamInfo.value) {
        this.pageInfo.page_rules[index1].push(this.editRulePopup.addParamInfo.value);
      }
      this.editRulePopup.isAddParam = false;
    },
    // 删除某一个参数
    deleteParamItem(index1, index2) {
      this.pageInfo.page_rules[index1].splice(index2, 1);
    },
    // 关闭编辑规则弹窗
    closeEditRulePopup() {
      this.$refs.editRulePopup.close();
    },
    // 保存规则
    saveRule() {
      this.editRulePopup.loading = true;
      let page_rules = JSON.parse(JSON.stringify(this.pageInfo.page_rules));
      page_rules = page_rules.filter((item) => item.length > 0);
      this.$refs.udb.update(this.pageInfo._id, {
        page_rules
      }, {
        showToast: false,
        needLoading: false,
        success: () => {
          this.$refs.udb.dataList.forEach((item) => {
            if (item._id === this.pageInfo._id) {
              item.page_rules = page_rules;
            }
          });
          this.closeEditRulePopup();
        },
        complete: () => {
          this.editRulePopup.loading = false;
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_data_select2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_unicloud_db2 + _easycom_uni_notice_bar2 + _easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_data_select = () => "../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_unicloud_db = () => "../../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
const _easycom_uni_notice_bar = () => "../../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_data_select + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db + _easycom_uni_notice_bar + _easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: $data.query,
    c: common_vendor.o(($event) => $data.query = $event.detail.value),
    d: common_vendor.o((...args) => $options.search && $options.search(...args)),
    e: common_vendor.sr("appListRef", "8c71ac7a-1"),
    f: common_vendor.o($options.search),
    g: common_vendor.o(($event) => $data.appid = $event),
    h: common_vendor.p({
      collection: "opendb-app-list",
      field: "appid as value, name as text",
      orderby: "text asc",
      label: "应用选择",
      modelValue: $data.appid
    }),
    i: common_vendor.w(({
      data,
      pagination,
      loading,
      error,
      options
    }, s0, i0) => {
      return {
        a: "8c71ac7a-5-" + i0 + "," + ("8c71ac7a-4-" + i0),
        b: "8c71ac7a-6-" + i0 + "," + ("8c71ac7a-4-" + i0),
        c: "8c71ac7a-7-" + i0 + "," + ("8c71ac7a-4-" + i0),
        d: "8c71ac7a-8-" + i0 + "," + ("8c71ac7a-4-" + i0),
        e: "8c71ac7a-9-" + i0 + "," + ("8c71ac7a-4-" + i0),
        f: "8c71ac7a-4-" + i0 + "," + ("8c71ac7a-3-" + i0),
        g: common_vendor.f(data, (item, index, i1) => {
          return {
            a: common_vendor.t((pagination.current - 1) * pagination.size + (index + 1)),
            b: "8c71ac7a-11-" + i0 + "-" + i1 + "," + ("8c71ac7a-10-" + i0 + "-" + i1),
            c: common_vendor.t(item.title),
            d: "8c71ac7a-12-" + i0 + "-" + i1 + "," + ("8c71ac7a-10-" + i0 + "-" + i1),
            e: common_vendor.t(item.path),
            f: "8c71ac7a-13-" + i0 + "-" + i1 + "," + ("8c71ac7a-10-" + i0 + "-" + i1),
            g: common_vendor.t(item.appid),
            h: "8c71ac7a-14-" + i0 + "-" + i1 + "," + ("8c71ac7a-10-" + i0 + "-" + i1),
            i: common_vendor.o(($event) => $options.editRule(item), index),
            j: "8c71ac7a-15-" + i0 + "-" + i1 + "," + ("8c71ac7a-10-" + i0 + "-" + i1),
            k: index,
            l: "8c71ac7a-10-" + i0 + "-" + i1 + "," + ("8c71ac7a-3-" + i0)
          };
        }),
        h: common_vendor.sr("table", "8c71ac7a-3-" + i0 + ",8c71ac7a-2"),
        i: "8c71ac7a-3-" + i0 + ",8c71ac7a-2",
        j: common_vendor.p({
          loading,
          emptyText: $data.errorMessage || error.message || "没有更多数据",
          border: true,
          stripe: true
        }),
        k: "8c71ac7a-16-" + i0 + ",8c71ac7a-2",
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
      path: "i",
      vueId: "8c71ac7a-2"
    }),
    j: common_vendor.p({
      align: "center"
    }),
    k: common_vendor.o(($event) => $options.filterChange($event, "title")),
    l: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    m: common_vendor.o(($event) => $options.filterChange($event, "path")),
    n: common_vendor.p({
      align: "left",
      ["filter-type"]: "search"
    }),
    o: common_vendor.o(($event) => $options.filterChange($event, "appid")),
    p: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
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
    t: common_vendor.p({
      align: "left"
    }),
    v: common_vendor.p({
      align: "center"
    }),
    w: common_vendor.p({
      align: "center"
    }),
    x: common_vendor.o($options.onPageChanged),
    y: common_vendor.sr("udb", "8c71ac7a-2"),
    z: common_vendor.o($options.onqueryload),
    A: common_vendor.p({
      collection: $data.collectionList,
      field: "title,path,page_rules,appid",
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent,
      options: $data.options,
      loadtime: "manual"
    }),
    B: common_vendor.p({
      ["font-size"]: 12,
      text: $data.editRulePopup.tips
    }),
    C: common_vendor.f($data.pageInfo.page_rules, (item1, index1, i0) => {
      return common_vendor.e({
        a: common_vendor.t($data.pageInfo.page_rules.length - index1),
        b: common_vendor.f(item1, (item2, index2, i1) => {
          return {
            a: common_vendor.t(item2),
            b: common_vendor.o(($event) => $options.deleteParamItem(index1, index2), index2),
            c: "8c71ac7a-19-" + i0 + "-" + i1 + ",8c71ac7a-17",
            d: index2
          };
        }),
        c: $data.editRulePopup.addParamInfo.index1 === index1 && $data.editRulePopup.isAddParam
      }, $data.editRulePopup.addParamInfo.index1 === index1 && $data.editRulePopup.isAddParam ? {
        d: $data.editRulePopup.addParamInfo.index1 === index1 && $data.editRulePopup.isAddParam,
        e: common_vendor.o(($event) => $options.confirmAddParamItem(index1), index1),
        f: $data.editRulePopup.addParamInfo.value,
        g: common_vendor.o(common_vendor.m(($event) => $data.editRulePopup.addParamInfo.value = $event.detail.value, {
          trim: true
        }), index1)
      } : {
        h: common_vendor.o(($event) => $options.addParamItem(index1), index1)
      }, {
        i: index1 === 0 && $data.pageInfo.page_rules.length < 5
      }, index1 === 0 && $data.pageInfo.page_rules.length < 5 ? {
        j: common_vendor.o($options.addRulesItem, index1),
        k: "8c71ac7a-20-" + i0 + ",8c71ac7a-17",
        l: common_vendor.p({
          type: "plus",
          size: "28",
          color: "#606266"
        })
      } : {
        m: common_vendor.o(($event) => $options.deleteRulesItem(index1), index1),
        n: "8c71ac7a-21-" + i0 + ",8c71ac7a-17",
        o: common_vendor.p({
          type: "minus",
          size: "28",
          color: "#606266"
        })
      }, {
        p: index1
      });
    }),
    D: common_vendor.p({
      type: "closeempty",
      size: "12",
      color: "#42b983"
    }),
    E: $data.editRulePopup.loading,
    F: $data.editRulePopup.loading,
    G: common_vendor.o((...args) => $options.saveRule && $options.saveRule(...args)),
    H: common_vendor.o((...args) => $options.closeEditRulePopup && $options.closeEditRulePopup(...args)),
    I: common_vendor.sr("editRulePopup", "8c71ac7a-17"),
    J: common_vendor.p({
      type: "center"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8c71ac7a"]]);
wx.createPage(MiniProgramPage);
