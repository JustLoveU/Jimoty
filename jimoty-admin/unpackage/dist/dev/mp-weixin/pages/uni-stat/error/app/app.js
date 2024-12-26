"use strict";
const common_vendor = require("../../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../../js_sdk/uni-stat/util.js");
const pages_uniStat_error_app_fieldsMap = require("./fieldsMap.js");
const js_sdk_validator_uniStatAppCrashLogs = require("../../../../js_sdk/validator/uni-stat-app-crash-logs.js");
const uniStatBreadcrumb = require("../../../../uni-stat-breadcrumb.js");
const uniDataSelect = require("../../../../uni-data-select.js");
const uniStatTabs = require("../../../../uni-stat-tabs.js");
const uniDatetimePicker = require("../../../../uni-datetime-picker.js");
const uniStatPanel = require("../../../../uni-stat-panel.js");
const qiunDataCharts = require("../../../../qiun-data-charts.js");
const uniTh = require("../../../../uni-th.js");
const uniTr = require("../../../../uni-tr.js");
const uniTd = require("../../../../uni-td.js");
const uniDateformat = require("../../../../uni-dateformat.js");
const uniTable = require("../../../../uni-table.js");
const uniPagination = require("../../../../uni-pagination.js");
const unicloudDb = require("../../../../unicloud-db.js");
const fixWindow = require("../../../../fix-window.js");
const panelOption = [{
  title: "崩溃总数",
  field: "count",
  value: 0,
  formatter: ",",
  tooltip: "指原生应用在某个时间段内出现崩溃的总数"
}, {
  title: "崩溃率",
  field: "count/app_launch_count",
  computed: "count/app_launch_count",
  formatter: "%",
  value: 0,
  tooltip: "时间范围内的总崩溃数/原生应用启动次数，如果小于0.01%，默认显示为0"
}];
const db = common_vendor.Vs.database();
const dbOrderBy = "create_time desc";
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
      fieldsMap: pages_uniStat_error_app_fieldsMap.fieldsMap,
      //todo：要与schema 生成页面一起工作，stringifyQuery 需要与 schema 查询逻辑相容
      query: {
        type: "crash",
        dimension: "day",
        appid: "",
        platform_id: "",
        uni_platform: "",
        version_id: "",
        start_time: []
      },
      loading: false,
      popupLoading: false,
      currentDateTab: 0,
      // currentChartTab: ,
      tableData: [],
      popupTableData: [],
      panelData: JSON.parse(JSON.stringify(panelOption)),
      chartData: {},
      chartTab: "errorCount",
      chartTabs: [{
        _id: "errorCount",
        name: "崩溃次数"
      }, {
        _id: "errorRate",
        name: "崩溃率"
      }],
      collectionList: "uni-stat-app-crash-logs",
      schemaQuery: "",
      where: this.tableData,
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      options: {
        pageCurrent: 1,
        // 当前页
        total: 0,
        // 数据总量
        pageSizeIndex: 0,
        // 与 pageSizeRange 一起计算得出 pageSize
        pageSizeRange: [10, 20, 50, 100],
        pageSize,
        pageCurrent,
        filterData: {},
        ...js_sdk_validator_uniStatAppCrashLogs.enumConverter
      },
      errorMessage: "",
      exportExcel: {
        "filename": "uni-stat-app-crash-logs.xls",
        "type": "xls",
        "fields": {
          "appid": "appid",
          "version": "version",
          "platform": "platform",
          "channel": "channel",
          "sdk_version": "sdk_version",
          "device_id": "device_id",
          "device_net": "device_net",
          "device_os": "device_os",
          "device_os_version": "device_os_version",
          "device_vendor": "device_vendor",
          "device_model": "device_model",
          "device_is_root": "device_is_root",
          "device_os_name": "device_os_name",
          "device_batt_level": "device_batt_level",
          "device_batt_temp": "device_batt_temp",
          "device_memory_use_size": "device_memory_use_size",
          "device_memory_total_size": "device_memory_total_size",
          "device_disk_use_size": "device_disk_use_size",
          "device_disk_total_size": "device_disk_total_size",
          "device_abis": "device_abis",
          "app_count": "app_count",
          "app_use_memory_size": "app_use_memory_size",
          "app_webview_count": "app_webview_count",
          "app_use_duration": "app_use_duration",
          "app_run_fore": "app_run_fore",
          "package_name": "package_name",
          "package_version": "package_version",
          "page_url": "page_url",
          "error_msg": "error_msg",
          "create_time": "create_time"
        }
      },
      exportExcelData: []
    };
  },
  computed: {
    queryStr() {
      return js_sdk_uniStat_util.stringifyQuery(this.query);
    },
    tableQuery() {
      const {
        appid,
        platform_id,
        version_id,
        start_time
      } = this.query;
      const platform = this.getPlatform(platform_id);
      const version = this.getVersion(version_id);
      const query = js_sdk_uniStat_util.stringifyQuery({
        appid,
        create_time: start_time,
        platform,
        version
      });
      return query;
    },
    versionQuery() {
      const {
        appid,
        uni_platform
      } = this.query;
      const query = js_sdk_uniStat_util.stringifyQuery({
        appid,
        uni_platform,
        type: "native_app"
      });
      return query;
    }
  },
  created() {
    this.debounceGet = js_sdk_uniStat_util.debounce(() => {
      this.getAllData(this.queryStr);
      this.where = this.tableQuery;
      this.$nextTick(() => {
        this.$refs.udb && this.$refs.udb.loadData();
      }, 200);
    }, 300);
    this.debounceGet();
  },
  watch: {
    query: {
      deep: true,
      handler(val) {
        this.options.pageCurrent = 1;
        this.debounceGet();
      }
    },
    chartTab(val) {
      this.getChartData(this.queryStr);
    }
  },
  onLoad() {
    this._filter = {};
  },
  methods: {
    onqueryload(data) {
      this.exportExcelData = data;
      this.tableData = data;
    },
    getWhere() {
      const query = this.schemaQuery.trim();
      if (!query) {
        return "";
      }
      const queryRe = new RegExp(query, "i");
      return dbSearchFields.map((name) => queryRe + ".test(" + name + ")").join(" || ");
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
      let newWhere = js_sdk_validator_uniStatAppCrashLogs.filterToWhere(this._filter, db.command);
      if (Object.keys(newWhere).length) {
        this.where = newWhere;
      } else {
        this.where = "";
      }
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    },
    useDatetimePicker() {
      this.currentDateTab = -1;
    },
    changePlatform(id, index, name, item) {
      this.query.version_id = 0;
      this.query.uni_platform = item.code;
    },
    changeTimeRange(id, index) {
      this.currentDateTab = index;
      const start = js_sdk_uniStat_util.getTimeOfSomeDayAgo(id), end = js_sdk_uniStat_util.getTimeOfSomeDayAgo(0) - 1;
      this.query.start_time = [start, end];
    },
    getPlatform(platform_id) {
      const statTabsData = common_vendor.index.getStorageSync("uni-admin-statTabsData");
      const platforms = statTabsData["platform-channel"];
      const p = Array.isArray(platforms) && platforms.find((p2) => p2._id === platform_id);
      return p && p.code || "";
    },
    getVersion(version_id) {
      let versions = [];
      if (this.$refs["app-versions"] && typeof this.$refs["app-versions"].getLoadData === "function") {
        versions = this.$refs["app-versions"].getLoadData();
      }
      const v = Array.isArray(versions) && versions.find((v2) => v2._id === version_id);
      return v && v.text || "";
    },
    getAllData(query) {
      if (query.indexOf("appid") === -1) {
        this.errorMessage = "请先选择应用";
        return;
      }
      this.errorMessage = "";
      this.getPanelData(query);
      this.getChartData(query);
    },
    getPanelData(query) {
      let querystr = js_sdk_uniStat_util.stringifyQuery(this.query, false, ["uni_platform"]);
      const db2 = common_vendor.Vs.database();
      db2.collection("uni-stat-error-result").where(querystr).field("count as temp_count, app_launch_count as temp_app_launch_count, appid").groupBy("appid").groupField("sum(temp_count) as count, sum(temp_app_launch_count) as app_launch_count").get({
        getCount: true
      }).then((res) => {
        res.result;
        const item = res.result.data[0] || { count: 0, app_launch_count: 0 };
        let queryTemp = Object.assign({}, this.query);
        delete queryTemp.type;
        this.getTotalLaunch(js_sdk_uniStat_util.stringifyQuery(queryTemp, false, ["uni_platform"])).then((res2) => {
          const total = res2.result.data[0];
          if (item) {
            let launch_count = total && total.total_app_launch_count;
            item.app_launch_count = launch_count;
            this.panelData = js_sdk_uniStat_util.mapfields(panelOption, item);
          }
        });
      });
    },
    getTotalLaunch(query) {
      const db2 = common_vendor.Vs.database();
      return db2.collection("uni-stat-result").where(query).groupBy("appid").groupField("sum(app_launch_count) as total_app_launch_count").get();
    },
    getChartData(query, field = "day_count") {
      let querystr = js_sdk_uniStat_util.stringifyQuery(this.query, false, ["uni_platform"]);
      this.chartData = {};
      this.options;
      const db2 = common_vendor.Vs.database();
      const [start_time, end_tiem] = this.query.start_time;
      const timeAll = js_sdk_uniStat_util.getAllDateCN(new Date(start_time), new Date(end_tiem));
      db2.collection("uni-stat-error-result").where(querystr).field("count as temp_count, app_launch_count as temp_app_launch_count, start_time").groupBy("start_time").groupField("sum(temp_count) as count, sum(temp_app_launch_count) as app_launch_count").orderBy("start_time", "asc").get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        let dataAll = [];
        timeAll.forEach((v) => {
          let item = data.find((item2) => item2.start_time === v);
          if (item) {
            dataAll.push(item);
          } else {
            dataAll.push({
              app_launch_count: 0,
              count: 0,
              start_time: v
            });
          }
        });
        const options = {
          categories: [],
          series: [{
            name: "暂无数据",
            data: []
          }]
        };
        if (this.chartTab === "errorCount") {
          const countLine = options.series[0] = {
            name: "崩溃次数",
            data: []
          };
          const xAxis = options.categories;
          for (const item of dataAll) {
            let date = item.start_time;
            const x = js_sdk_uniStat_util.formatDate(date, "day");
            const countY = item.count;
            xAxis.push(x);
            countLine.data.push(countY);
          }
          this.chartData = options;
        } else {
          const rateLine = options.series[0] = {
            name: "崩溃率(%)",
            data: [],
            lineStyle: {
              color: "#EE6666",
              width: 1
            },
            itemStyle: {
              borderWidth: 1,
              borderColor: "#EE6666",
              color: "#EE6666"
            },
            areaStyle: {
              color: {
                colorStops: [{
                  offset: 0,
                  color: "#EE6666"
                  // 0% 处的颜色
                }, {
                  offset: 1,
                  color: "#FFFFFF"
                  // 100% 处的颜色
                }]
              }
            }
          };
          const xAxis = options.categories;
          for (const item of dataAll) {
            const {
              count: count2,
              app_launch_count
            } = item;
            let date = item.start_time;
            const x = js_sdk_uniStat_util.formatDate(date, "day");
            xAxis.push(x);
            let y = count2 / app_launch_count;
            y = !y ? 0 : y.toFixed(2);
            rateLine.data.push(y);
          }
          this.chartData = options;
        }
      }).finally(() => {
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_data_select = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_stat_tabs = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_datetime_picker = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_stat_panel = common_vendor.resolveComponent("uni-stat-panel");
  const _easycom_qiun_data_charts = common_vendor.resolveComponent("qiun-data-charts");
  const _easycom_uni_th = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_dateformat = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_table = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination = common_vendor.resolveComponent("uni-pagination");
  const _easycom_unicloud_db = common_vendor.resolveComponent("unicloud-db");
  const _easycom_fix_window = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_uni_stat_panel + _easycom_qiun_data_charts + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_dateformat + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db + _easycom_fix_window)();
}
if (!Math) {
  (uniStatBreadcrumb.Component + uniDataSelect.Component + uniStatTabs.Component + uniDatetimePicker.Component + uniStatPanel.Component + qiunDataCharts.Component + uniTh.Component + uniTr.Component + uniTd.Component + uniDateformat.Component + uniTable.Component + uniPagination.Component + unicloudDb.Component + fixWindow.Component)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.query.appid = $event),
    b: common_vendor.p({
      collection: "opendb-app-list",
      field: "appid as value, name as text",
      orderby: "text asc",
      defItem: 1,
      label: "应用选择",
      clear: false,
      modelValue: $data.query.appid
    }),
    c: common_vendor.sr("app-versions", "92e362d4-2"),
    d: common_vendor.o(($event) => $data.query.version_id = $event),
    e: common_vendor.p({
      collection: "opendb-app-versions",
      where: $options.versionQuery,
      field: "_id as value, version as text, uni_platform as label, create_date as date",
      format: "{label} - {text}",
      orderby: "date desc",
      label: "版本选择",
      modelValue: $data.query.version_id
    }),
    f: common_vendor.o($options.changePlatform),
    g: common_vendor.o(($event) => $data.query.platform_id = $event),
    h: common_vendor.p({
      label: "平台选择",
      type: "boldLine",
      all: false,
      mode: "platform-channel",
      modelValue: $data.query.platform_id
    }),
    i: common_vendor.o($options.changeTimeRange),
    j: common_vendor.p({
      label: "日期选择",
      current: $data.currentDateTab,
      yesterday: false,
      mode: "date"
    }),
    k: $data.currentDateTab < 0 && !!$data.query.start_time.length ? 1 : "",
    l: common_vendor.o($options.useDatetimePicker),
    m: common_vendor.o(($event) => $data.query.start_time = $event),
    n: common_vendor.p({
      type: "datetimerange",
      end: (/* @__PURE__ */ new Date()).getTime(),
      returnType: "timestamp",
      clearIcon: false,
      modelValue: $data.query.start_time
    }),
    o: common_vendor.p({
      items: $data.panelData
    }),
    p: common_vendor.o(($event) => $data.chartTab = $event),
    q: common_vendor.p({
      type: "box",
      tabs: $data.chartTabs,
      modelValue: $data.chartTab
    }),
    r: common_vendor.p({
      type: "area",
      chartData: $data.chartData,
      eopts: {
        notMerge: true
      },
      echartsH5: true,
      echartsApp: true,
      tooltipFormat: "tooltipCustom",
      errorMessage: $data.errorMessage
    }),
    s: common_vendor.w(({
      data,
      pagination,
      loading,
      error,
      options
    }, s0, i0) => {
      return {
        a: common_vendor.f($data.fieldsMap, (mapper, index, i1) => {
          return common_vendor.e({
            a: mapper.title
          }, mapper.title ? {
            b: common_vendor.t(mapper.title),
            c: index,
            d: `${mapper.title.length * 15 + 80}px`,
            e: "92e362d4-12-" + i0 + "-" + i1 + "," + ("92e362d4-11-" + i0),
            f: common_vendor.p({
              align: "center"
            })
          } : {}, {
            g: index
          });
        }),
        b: "92e362d4-11-" + i0 + "," + ("92e362d4-10-" + i0),
        c: common_vendor.f($data.tableData, (item, i, i1) => {
          return {
            a: common_vendor.f($data.fieldsMap, (mapper, index, i2) => {
              return common_vendor.e({
                a: mapper.field === "error_msg"
              }, mapper.field === "error_msg" ? {
                b: common_vendor.t(item.error_msg ? item.error_msg.substring(0, 100) + "..." : "-"),
                c: mapper.field,
                d: "92e362d4-14-" + i0 + "-" + i1 + "-" + i2 + "," + ("92e362d4-13-" + i0 + "-" + i1),
                e: common_vendor.p({
                  align: "left"
                })
              } : mapper.field === "create_time" ? {
                g: "92e362d4-16-" + i0 + "-" + i1 + "-" + i2 + "," + ("92e362d4-15-" + i0 + "-" + i1 + "-" + i2),
                h: common_vendor.p({
                  threshold: [0, 0],
                  date: item.create_time
                }),
                i: mapper.field,
                j: "92e362d4-15-" + i0 + "-" + i1 + "-" + i2 + "," + ("92e362d4-13-" + i0 + "-" + i1),
                k: common_vendor.p({
                  align: "center"
                })
              } : {
                l: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
                m: mapper.field,
                n: "92e362d4-17-" + i0 + "-" + i1 + "-" + i2 + "," + ("92e362d4-13-" + i0 + "-" + i1),
                o: common_vendor.p({
                  align: "center"
                })
              }, {
                f: mapper.field === "create_time",
                p: index
              });
            }),
            b: i,
            c: "92e362d4-13-" + i0 + "-" + i1 + "," + ("92e362d4-10-" + i0)
          };
        }),
        d: common_vendor.sr("table", "92e362d4-10-" + i0 + ",92e362d4-9"),
        e: "92e362d4-10-" + i0 + ",92e362d4-9",
        f: common_vendor.p({
          loading,
          border: true,
          stripe: true,
          emptyText: $data.errorMessage || _ctx.$t("common.empty")
        }),
        g: "92e362d4-18-" + i0 + ",92e362d4-9",
        h: common_vendor.o(($event) => pagination.current = $event),
        i: common_vendor.p({
          ["show-icon"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        j: i0,
        k: s0
      };
    }, {
      name: "d",
      path: "s",
      vueId: "92e362d4-9"
    }),
    t: common_vendor.o($options.onPageChanged),
    v: common_vendor.sr("udb", "92e362d4-9"),
    w: common_vendor.o($options.onqueryload),
    x: common_vendor.p({
      collection: $data.collectionList,
      field: "appid,version,platform,channel,sdk_version,device_id,device_net,device_os,device_os_version,device_vendor,device_model,device_is_root,device_os_name,device_batt_level,device_batt_temp,device_memory_use_size,device_memory_total_size,device_disk_use_size,device_disk_total_size,device_abis,app_count,app_use_memory_size,app_webview_count,app_use_duration,app_run_fore,package_name,package_version,page_url,error_msg,create_time",
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent,
      loadtime: "manual",
      options: $data.options
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
