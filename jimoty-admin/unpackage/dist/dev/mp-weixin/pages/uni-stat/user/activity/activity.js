"use strict";
const common_vendor = require("../../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../../js_sdk/uni-stat/util.js");
const pages_uniStat_user_activity_fieldsMap = require("./fieldsMap.js");
const _sfc_main = {
  data() {
    return {
      tableName: "uni-stat-result",
      fieldsMap: pages_uniStat_user_activity_fieldsMap.fieldsMap,
      query: {
        dimension: "day",
        appid: "",
        platform_id: "",
        uni_platform: "",
        version_id: "",
        channel_id: "",
        start_time: []
      },
      options: {
        pageSize: 20,
        pageCurrent: 1,
        // 当前页
        total: 0
        // 数据总量
      },
      loading: false,
      currentDateTab: 0,
      currentChartTab: "day",
      tableData: [],
      chartData: {},
      defaultChart: {
        field: "new_user_count",
        name: "新增用户"
      },
      channelData: [],
      errorMessage: ""
    };
  },
  computed: {
    chartTabs() {
      const tabs = [{
        _id: "day",
        name: "日活"
      }, {
        _id: "week",
        name: "周活"
      }, {
        _id: "month",
        name: "月活"
      }];
      if (js_sdk_uniStat_util.maxDeltaDay(this.query.start_time, 7)) {
        tabs.forEach((tab, index) => {
          if (tab._id === "month") {
            tab.disabled = true;
          } else {
            tab.disabled = false;
          }
        });
      }
      return tabs;
    },
    channelQuery() {
      const platform_id = this.query.platform_id;
      return js_sdk_uniStat_util.stringifyQuery({
        platform_id
      });
    },
    versionQuery() {
      const {
        appid,
        uni_platform
      } = this.query;
      const query = js_sdk_uniStat_util.stringifyQuery({
        appid,
        uni_platform
      });
      return query;
    }
  },
  created() {
    this.debounceGet = js_sdk_uniStat_util.debounce(() => {
      this.getAllData(this.query);
    }, 300);
    this.getChannelData();
  },
  watch: {
    query: {
      deep: true,
      handler(val) {
        this.options.pageCurrent = 1;
        this.debounceGet();
      }
    }
  },
  methods: {
    useDatetimePicker() {
      this.currentDateTab = -1;
    },
    changeAppid(id) {
      this.getChannelData(id, false);
    },
    changePlatform(id, index, name, item) {
      this.getChannelData(null, id);
      this.query.version_id = 0;
      this.query.uni_platform = item.code;
    },
    changeTimeRange(id, index) {
      this.currentDateTab = index;
      const day = 24 * 60 * 60 * 1e3;
      let start, end;
      start = js_sdk_uniStat_util.getTimeOfSomeDayAgo(id);
      if (!id) {
        end = js_sdk_uniStat_util.getTimeOfSomeDayAgo(0) + day - 1;
      } else {
        end = js_sdk_uniStat_util.getTimeOfSomeDayAgo(0) - 1;
      }
      this.query.start_time = [start, end];
    },
    changePageCurrent(e) {
      this.options.pageCurrent = e.current;
      this.getTabelData(this.query);
    },
    changePageSize(pageSize) {
      this.options.pageSize = pageSize;
      this.options.pageCurrent = 1;
      this.getTabelData(this.query);
    },
    changeChartTab(type, index, name) {
      this.currentChartTab = type;
      this.getChartData(this.query, type, name);
    },
    getAllData(query) {
      if (!query.appid) {
        this.errorMessage = "请先选择应用";
        return;
      }
      this.errorMessage = "";
      this.getChartData(query, this.currentChartTab);
      this.getTabelData(query);
    },
    getChartData(query, type, name = "日活", field = "active_user_count") {
      const options = {
        categories: [],
        series: [{
          name,
          data: []
        }]
      };
      query = js_sdk_uniStat_util.stringifyQuery(query, null, ["uni_platform"]);
      const db = common_vendor.Vs.database();
      if (type === "day") {
        db.collection(this.tableName).where(query).field(`${js_sdk_uniStat_util.stringifyField(pages_uniStat_user_activity_fieldsMap.fieldsMap, field)}, start_time`).groupBy("start_time").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_user_activity_fieldsMap.fieldsMap, field)).orderBy("start_time", "asc").get({
          getCount: true
        }).then((res) => {
          const {
            count,
            data
          } = res.result;
          this.chartData = [];
          for (const item of data) {
            const x = js_sdk_uniStat_util.formatDate(item.start_time, "day");
            const y = item[field];
            options.series[0].data.push(y);
            options.categories.push(x);
          }
          this.chartData = options;
        }).catch((err) => {
          console.error(err);
        });
      } else {
        this.getRangeCountData(query, type).then((res) => {
          const oldType = type;
          if (type === "week")
            type = "isoWeek";
          const {
            count,
            data
          } = res.result;
          this.chartData = [];
          const wunWeekTime = 7 * 24 * 60 * 60 * 1e3;
          for (const item of data) {
            const date = +new Date(item.year, 0) + (Number(item[type]) * wunWeekTime - 1);
            const x = js_sdk_uniStat_util.formatDate(date, oldType);
            const y = item[type + "_" + field];
            if (y) {
              options.series[0].data.push(y);
              options.categories.push(x);
            }
          }
          this.chartData = options;
        });
      }
    },
    getTabelData(query, field = "active_user_count") {
      const {
        pageCurrent
      } = this.options;
      query = js_sdk_uniStat_util.stringifyQuery(query, null, ["uni_platform"]);
      this.loading = true;
      const db = common_vendor.Vs.database();
      db.collection(this.tableName).where(query).field(`${js_sdk_uniStat_util.stringifyField(pages_uniStat_user_activity_fieldsMap.fieldsMap, field)}, start_time`).groupBy("start_time").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_user_activity_fieldsMap.fieldsMap, field)).orderBy("start_time", "desc").skip((pageCurrent - 1) * this.options.pageSize).limit(this.options.pageSize).get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        let daysData = data, daysCount = count, weeks = [], months = [];
        this.getRangeCountData(query, "week").then((res2) => {
          const {
            count: count2,
            data: data2
          } = res2.result;
          weeks = data2;
          this.getRangeCountData(query, "month").then((res3) => {
            const {
              count: count3,
              data: data3
            } = res3.result;
            months = data3;
            const allData = this.mapWithWeekAndMonth(daysData, weeks, months);
            for (const item of allData) {
              js_sdk_uniStat_util.mapfields(pages_uniStat_user_activity_fieldsMap.fieldsMap, item, item);
            }
            this.tableData = [];
            this.options.total = daysCount;
            this.tableData = allData;
          }).finally(() => {
            this.loading = false;
          });
        });
      }).catch((err) => {
        console.error(err);
      });
    },
    getRangeCountData(query, type, field = "active_user_count") {
      if (type === "week")
        type = "isoWeek";
      this.options;
      const db = common_vendor.Vs.database();
      return db.collection(this.tableName).where(query).field(
        `${field}, start_time, ${type}(add(new Date(0),start_time), "Asia/Shanghai") as ${type},year(add(new Date(0),start_time), "Asia/Shanghai") as year`
      ).groupBy(`year, ${type}`).groupField(`sum(${field}) as ${type}_${field}`).orderBy(`year asc, ${type} asc`).get({
        getCount: true
      });
    },
    // 周、月范围的处理
    mapWithWeekAndMonth(data, weeks, months, field = "active_user_count") {
      for (const item of data) {
        const date = new Date(item.start_time);
        const year = date.getUTCFullYear();
        const month = date.getMonth() + 1;
        const week = this.getWeekNumber(date);
        for (const w of weeks) {
          if (w.isoWeek === week && w.year === year) {
            item[`isoWeek_${field}`] = w[`week_${field}`];
          }
        }
        for (const m of months) {
          if (m.month === month && m.year === year) {
            item[`month_${field}`] = m[`month_${field}`];
          }
        }
      }
      return data;
    },
    //日期所在的周（一年中的第几周）
    getWeekNumber(d) {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil(((d - yearStart) / 864e5 + 1) / 7);
    },
    //获取渠道信息
    getChannelData(appid, platform_id) {
      this.query.channel_id = "";
      const db = common_vendor.Vs.database();
      const condition = {};
      appid = appid ? appid : this.query.appid;
      if (appid) {
        condition.appid = appid;
      }
      platform_id = platform_id ? platform_id : this.query.platform_id;
      if (platform_id) {
        condition.platform_id = platform_id;
      }
      let platformTemp = db.collection("uni-stat-app-platforms").field("_id, name").getTemp();
      let channelTemp = db.collection("uni-stat-app-channels").where(condition).field("_id, channel_name, create_time, platform_id").getTemp();
      db.collection(channelTemp, platformTemp).orderBy("platform_id", "asc").get().then((res) => {
        let data = res.result.data;
        let channels = [];
        if (data.length > 0) {
          let channelName;
          for (let i in data) {
            channelName = data[i].channel_name ? data[i].channel_name : "默认";
            if (data[i].platform_id.length > 0) {
              channelName = data[i].platform_id[0].name + "-" + channelName;
            }
            channels.push({
              value: data[i]._id,
              text: channelName
            });
          }
        }
        this.channelData = channels;
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  const _easycom_uni_stat_table2 = common_vendor.resolveComponent("uni-stat-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_data_select2 + _easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_qiun_data_charts2 + _easycom_uni_stat_table2 + _easycom_uni_pagination2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_data_select = () => "../../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_stat_tabs = () => "../../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_qiun_data_charts = () => "../../../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
const _easycom_uni_stat_table = () => "../../../../components/uni-stat-table/uni-stat-table.js";
const _easycom_uni_pagination = () => "../../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_fix_window = () => "../../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_qiun_data_charts + _easycom_uni_stat_table + _easycom_uni_pagination + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.changeAppid),
    b: common_vendor.o(($event) => $data.query.appid = $event),
    c: common_vendor.p({
      collection: "opendb-app-list",
      field: "appid as value, name as text",
      orderby: "text asc",
      defItem: 1,
      label: "应用选择",
      clear: false,
      modelValue: $data.query.appid
    }),
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
    f: common_vendor.o($options.changeTimeRange),
    g: common_vendor.p({
      label: "日期选择",
      current: $data.currentDateTab,
      mode: "date",
      yesterday: false
    }),
    h: $data.currentDateTab < 0 && !!$data.query.start_time.length ? 1 : "",
    i: common_vendor.o($options.useDatetimePicker),
    j: common_vendor.o(($event) => $data.query.start_time = $event),
    k: common_vendor.p({
      type: "datetimerange",
      end: (/* @__PURE__ */ new Date()).getTime(),
      returnType: "timestamp",
      clearIcon: false,
      modelValue: $data.query.start_time
    }),
    l: common_vendor.o($options.changePlatform),
    m: common_vendor.o(($event) => $data.query.platform_id = $event),
    n: common_vendor.p({
      label: "平台选择",
      type: "boldLine",
      mode: "platform",
      modelValue: $data.query.platform_id
    }),
    o: $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1
  }, $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1 ? {
    p: common_vendor.sr("version-select", "01d32451-6"),
    q: common_vendor.o(($event) => $data.query.channel_id = $event),
    r: common_vendor.p({
      collection: "uni-stat-app-channels",
      where: $options.channelQuery,
      field: "_id as value, channel_name as text",
      orderby: "text asc",
      label: "渠道/场景值选择",
      modelValue: $data.query.channel_id
    })
  } : {}, {
    s: common_vendor.o($options.changeChartTab),
    t: common_vendor.p({
      type: "box",
      tabs: $options.chartTabs
    }),
    v: common_vendor.p({
      type: "area",
      chartData: $data.chartData,
      echartsH5: true,
      echartsApp: true,
      errorMessage: $data.errorMessage
    }),
    w: common_vendor.p({
      data: $data.tableData,
      filedsMap: $data.fieldsMap,
      loading: $data.loading,
      tooltip: true
    }),
    x: common_vendor.o($options.changePageCurrent),
    y: common_vendor.o($options.changePageSize),
    z: common_vendor.p({
      ["show-icon"]: true,
      ["show-page-size"]: true,
      ["page-size"]: $data.options.pageSize,
      current: $data.options.pageCurrent,
      total: $data.options.total
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
