"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_uniStat_util = require("../../js_sdk/uni-stat/util.js");
const pages_index_fieldsMap = require("./fieldsMap.js");
const _sfc_main = {
  data() {
    return {
      query: {
        platform_id: "",
        start_time: [js_sdk_uniStat_util.getTimeOfSomeDayAgo(1), (/* @__PURE__ */ new Date()).getTime()]
      },
      deviceTableData: [],
      userTableData: [],
      // panelData: panelOption,
      // 每页数据量
      pageSize: 10,
      // 当前页
      pageCurrent: 1,
      // 数据总量
      total: 0,
      loading: false,
      complete: false,
      statSetting: {
        mode: "",
        day: 7
      },
      statModeList: [
        { "value": "open", "text": "开启" },
        { "value": "close", "text": "关闭" },
        { "value": "auto", "text": "节能" }
      ],
      showAddAppId: false,
      showdbInit: false
    };
  },
  onReady() {
    this.debounceGet = js_sdk_uniStat_util.debounce(() => {
      this.getAllData(this.queryStr);
    }, 300);
    this.debounceGet();
    this.checkAppId();
    this.checkdbInit();
  },
  watch: {
    query: {
      deep: true,
      handler(newVal) {
        this.debounceGet(this.queryStr);
      }
    }
  },
  computed: {
    queryStr() {
      const defQuery = `(dimension == "hour" || dimension == "day")`;
      return js_sdk_uniStat_util.stringifyQuery(this.query) + " && " + defQuery;
    },
    deviceTableFields() {
      return this.tableFieldsMap(pages_index_fieldsMap.deviceFeildsMap);
    },
    userTableFields() {
      return this.tableFieldsMap(pages_index_fieldsMap.userFeildsMap);
    }
  },
  methods: {
    getAllData(queryStr) {
      this.getApps(this.queryStr, pages_index_fieldsMap.deviceFeildsMap, "device");
      this.getApps(this.queryStr, pages_index_fieldsMap.userFeildsMap, "user");
    },
    tableFieldsMap(fieldsMap) {
      let tableFields = [];
      const today = [];
      const yesterday = [];
      const other = [];
      for (const mapper of fieldsMap) {
        if (mapper.field) {
          if (mapper.hasOwnProperty("value")) {
            const t = JSON.parse(JSON.stringify(mapper));
            const y = JSON.parse(JSON.stringify(mapper));
            if (mapper.field !== "total_users" && mapper.field !== "total_devices") {
              t.title = "今日" + mapper.title;
              t.field = mapper.field + "_value";
              y.title = "昨日" + mapper.title;
              y.field = mapper.field + "_contrast";
              today.push(t);
              yesterday.push(y);
            } else {
              t.field = mapper.field + "_value";
              other.push(t);
            }
          } else {
            tableFields.push(mapper);
          }
        }
      }
      tableFields = [...tableFields, ...today, ...yesterday, ...other];
      return tableFields;
    },
    getApps(query, fieldsMap, type = "device") {
      this.loading = true;
      const db = common_vendor.Vs.database();
      const appDaily = db.collection("uni-stat-result").where(query).getTemp();
      const appList = db.collection("opendb-app-list").getTemp();
      db.collection(appDaily, appList).field(
        `${js_sdk_uniStat_util.stringifyField(fieldsMap, "", "value")},stat_date,appid,dimension`
      ).groupBy(`appid,dimension,stat_date`).groupField(js_sdk_uniStat_util.stringifyGroupField(fieldsMap, "", "value")).orderBy(`appid`, "desc").get().then((res) => {
        let {
          data
        } = res.result;
        this[`${type}TableData`] = [];
        if (!data.length)
          return;
        let appids = [], todays = [], yesterdays = [], isToday = js_sdk_uniStat_util.parseDateTime(js_sdk_uniStat_util.getTimeOfSomeDayAgo(0), "", ""), isYesterday = js_sdk_uniStat_util.parseDateTime(js_sdk_uniStat_util.getTimeOfSomeDayAgo(1), "", "");
        for (const item of data) {
          const {
            appid,
            name
          } = item.appid && item.appid[0] || {};
          item.appid = appid;
          item.name = name;
          if (appids.indexOf(item.appid) < 0) {
            appids.push(item.appid);
          }
          if (item.dimension === "hour" && item.stat_date === isToday) {
            todays.push(item);
          }
          if (item.dimension === "day" && item.stat_date === isYesterday) {
            yesterdays.push(item);
          }
        }
        const keys = fieldsMap.map((f) => f.field).filter(Boolean);
        for (const appid of appids) {
          const rowData = {};
          const t = todays.find((item) => item.appid === appid);
          const y = yesterdays.find((item) => item.appid === appid);
          for (const key of keys) {
            if (key === "appid" || key === "name") {
              rowData[key] = t && t[key];
            } else {
              const value = t && t[key];
              const contrast = y && y[key];
              rowData[key + "_value"] = js_sdk_uniStat_util.format(value);
              rowData[key + "_contrast"] = js_sdk_uniStat_util.format(contrast);
            }
          }
          if (appid) {
            rowData[`total_${type}s_value`] = "获取中...";
          }
          this[`${type}TableData`].push(rowData);
          if (appid) {
            t[`total_${type}s`] = 0;
            const query2 = JSON.parse(JSON.stringify(this.query));
            query2.start_time = [js_sdk_uniStat_util.getTimeOfSomeDayAgo(0), (/* @__PURE__ */ new Date()).getTime()];
            query2.appid = appid;
            js_sdk_uniStat_util.getFieldTotal.call(this, query2, `total_${type}s`).then((total) => {
              this[`${type}TableData`].find((item) => item.appid === appid)[`total_${type}s_value`] = total;
            });
          }
        }
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        this.loading = false;
        this.complete = true;
      });
    },
    navTo(url, id) {
      if (url.indexOf("http") > -1) {
        window.open(url);
      } else {
        if (id) {
          url = `${url}?appid=${id}`;
        }
        common_vendor.index.navigateTo({
          url
        });
      }
    },
    toUrl(url) {
    },
    toAddAppId() {
      this.showAddAppId = false;
      common_vendor.index.navigateTo({
        url: "/pages/system/app/list",
        events: {
          // 注册事件，用于在目标页面刷新数据后执行回调
          refreshData: () => {
            this.checkAppId();
          }
        }
      });
    },
    async checkAppId() {
      const db = common_vendor.Vs.database();
      let res = await db.collection("opendb-app-list").count();
      this.showAddAppId = !res.result || res.result.total === 0 ? true : false;
    },
    async checkdbInit() {
      const db = common_vendor.Vs.database();
      let res = await db.collection("opendb-admin-menus").count();
      this.showdbInit = !res.result || res.result.total === 0 ? true : false;
      if (this.showdbInit) {
        common_vendor.index.showModal({
          title: "重要提示",
          content: `检测到您未初始化数据库，请先右键uni-admin项目根目下的 uniCloud/database 目录，执行初始化云数据库，否则左侧无法显示菜单等数据`,
          showCancel: false,
          confirmText: "我知道了"
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_notice_bar2 + _easycom_uni_stat_tabs2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_stat_tabs = () => "../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_th = () => "../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_fix_window = () => "../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_notice_bar + _easycom_uni_stat_tabs + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showdbInit
  }, $data.showdbInit ? {
    b: common_vendor.o($options.toAddAppId),
    c: common_vendor.p({
      showGetMore: true,
      showIcon: true,
      text: "检测到您未初始化db_init.json，请先右键uniCloud/database/db_init.json文件，执行初始化云数据库，否则左侧无法显示菜单等数据",
      ["background-color"]: "#fef0f0",
      color: "#f56c6c"
    })
  } : {}, {
    d: $data.showAddAppId
  }, $data.showAddAppId ? {
    e: common_vendor.o($options.toAddAppId),
    f: common_vendor.p({
      showGetMore: true,
      showIcon: true,
      text: "检测到您还未添加应用，点击前往应用管理添加"
    })
  } : {}, {
    g: !$data.deviceTableData.length && !$data.userTableData.length && !$data.query.platform_id && $data.complete
  }, !$data.deviceTableData.length && !$data.userTableData.length && !$data.query.platform_id && $data.complete ? {
    h: common_vendor.o(($event) => $options.navTo("https://uniapp.dcloud.io/uni-stat-v2.html")),
    i: common_vendor.p({
      showGetMore: true,
      showIcon: true,
      text: "暂无数据, 统计相关功能需开通 uni 统计后才能使用, 如未开通, 点击查看具体流程"
    })
  } : {}, {
    j: common_vendor.o(($event) => $data.query.platform_id = $event),
    k: common_vendor.p({
      label: "平台选择",
      type: "boldLine",
      mode: "platform",
      modelValue: $data.query.platform_id
    }),
    l: common_vendor.f($options.deviceTableFields, (mapper, index, i0) => {
      return common_vendor.e({
        a: mapper.title
      }, mapper.title ? {
        b: common_vendor.t(mapper.title),
        c: index,
        d: "63e5a7c6-7-" + i0 + ",63e5a7c6-6",
        e: common_vendor.p({
          align: "center"
        })
      } : {}, {
        f: index
      });
    }),
    m: common_vendor.f($data.deviceTableData, (item, i, i0) => {
      return {
        a: common_vendor.f($options.deviceTableFields, (mapper, index, i1) => {
          return common_vendor.e({
            a: mapper.field === "appid"
          }, mapper.field === "appid" ? common_vendor.e({
            b: item.appid
          }, item.appid ? {
            c: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            d: common_vendor.o(($event) => $options.navTo("/pages/uni-stat/device/overview/overview", item.appid), index)
          } : {
            e: common_vendor.o(($event) => $options.navTo("/pages/system/app/add"), index)
          }, {
            f: "63e5a7c6-9-" + i0 + "-" + i1 + "," + ("63e5a7c6-8-" + i0),
            g: common_vendor.p({
              align: "center"
            })
          }) : {
            h: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            i: index,
            j: "63e5a7c6-10-" + i0 + "-" + i1 + "," + ("63e5a7c6-8-" + i0),
            k: common_vendor.p({
              align: "center"
            })
          }, {
            l: index
          });
        }),
        b: i,
        c: "63e5a7c6-8-" + i0 + ",63e5a7c6-5"
      };
    }),
    n: common_vendor.p({
      loading: $data.loading,
      border: true,
      stripe: true,
      emptyText: "暂无数据"
    }),
    o: common_vendor.f($options.userTableFields, (mapper, index, i0) => {
      return common_vendor.e({
        a: mapper.title
      }, mapper.title ? {
        b: common_vendor.t(mapper.title),
        c: index,
        d: "63e5a7c6-13-" + i0 + ",63e5a7c6-12",
        e: common_vendor.p({
          align: "center"
        })
      } : {}, {
        f: index
      });
    }),
    p: common_vendor.f($data.userTableData, (item, i, i0) => {
      return {
        a: common_vendor.f($options.userTableFields, (mapper, index, i1) => {
          return common_vendor.e({
            a: mapper.field === "appid"
          }, mapper.field === "appid" ? common_vendor.e({
            b: item.appid
          }, item.appid ? {
            c: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            d: common_vendor.o(($event) => $options.navTo("/pages/uni-stat/user/overview/overview", item.appid), index)
          } : {
            e: common_vendor.o(($event) => $options.navTo("/pages/system/app/add"), index)
          }, {
            f: "63e5a7c6-15-" + i0 + "-" + i1 + "," + ("63e5a7c6-14-" + i0),
            g: common_vendor.p({
              align: "center"
            })
          }) : {
            h: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            i: index,
            j: "63e5a7c6-16-" + i0 + "-" + i1 + "," + ("63e5a7c6-14-" + i0),
            k: common_vendor.p({
              align: "center"
            })
          }, {
            l: index
          });
        }),
        b: i,
        c: "63e5a7c6-14-" + i0 + ",63e5a7c6-11"
      };
    }),
    q: common_vendor.p({
      loading: $data.loading,
      border: true,
      stripe: true,
      emptyText: "暂无数据"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
