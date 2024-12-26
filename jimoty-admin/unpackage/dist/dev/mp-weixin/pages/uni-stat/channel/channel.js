"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../js_sdk/uni-stat/util.js");
const pages_uniStat_channel_fieldsMap = require("./fieldsMap.js");
const _sfc_main = {
  data() {
    return {
      // 字段映射表
      fieldsMap: pages_uniStat_channel_fieldsMap.fieldsMap,
      // 查询参数
      query: {
        // 统计范围 day:按天统计，hour:按小时统计
        dimension: "day",
        // 应用id
        appid: "",
        // 平台
        uni_platform: "android",
        // 平台id
        platform_id: "",
        // 版本号
        version_id: "",
        // 开始时间
        start_time: []
      },
      // 分页数据
      paginationOptions: {
        pageSize: 20,
        pageCurrent: 1,
        // 当前页
        total: 0
        // 数据总量
      },
      // 加载状态
      loading: false,
      // 日期选择索引
      currentDateTab: 1,
      days: 0,
      // 表格数据
      tableData: [],
      panelData: pages_uniStat_channel_fieldsMap.fieldsMap.filter((f) => f.hasOwnProperty("value")),
      chartData: {},
      chartTab: "new_device_count",
      queryId: "",
      updateValue: "",
      errorMessage: ""
    };
  },
  computed: {
    chartTabs() {
      const tabs = [];
      pages_uniStat_channel_fieldsMap.fieldsMap.forEach((item) => {
        const {
          field: _id,
          title: name
        } = item;
        const isTab = item.hasOwnProperty("value");
        if (_id && name && isTab) {
          tabs.push({
            _id,
            name
          });
        }
      });
      return tabs;
    },
    queryStr() {
      return js_sdk_uniStat_util.stringifyQuery(this.query, true);
    },
    dimension() {
      if (js_sdk_uniStat_util.maxDeltaDay(this.query.start_time, 1)) {
        return "hour";
      } else {
        return "day";
      }
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
    }, 300);
  },
  watch: {
    query: {
      deep: true,
      handler(val) {
        this.paginationOptions.pageCurrent = 1;
        this.debounceGet();
      }
    }
  },
  methods: {
    useDatetimePicker() {
      this.currentDateTab = -1;
    },
    changePlatform(id, index, name, item) {
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
      this.paginationOptions.pageCurrent = e.current;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.paginationOptions.pageSize = pageSize;
      this.paginationOptions.pageCurrent = 1;
      this.getTableData();
    },
    changeChartTab(id, index, name) {
      this.getChartData(id, name);
    },
    getAllData(query) {
      if (!this.query.appid) {
        this.errorMessage = "请先选择应用";
        return;
      }
      this.errorMessage = "";
      this.getPanelData();
      this.getChartData();
      this.getTableData();
    },
    getChartData(field2 = this.chartTab) {
      let querystr = js_sdk_uniStat_util.stringifyQuery(this.query, false, ["uni_platform"]);
      this.paginationOptions;
      const db = common_vendor.Vs.database();
      db.collection("uni-stat-result").where(querystr).field(`${js_sdk_uniStat_util.stringifyField(pages_uniStat_channel_fieldsMap.fieldsMap, field2)}, start_time, channel_id`).groupBy("channel_id,start_time").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_channel_fieldsMap.fieldsMap, field2)).orderBy("start_time", "asc").get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        const options = {
          categories: [],
          series: [{
            name: "暂无数据",
            data: []
          }]
        };
        const xAxis = options.categories;
        if (this.dimension === "hour") {
          for (let i = 0; i < 24; ++i) {
            const hour = i < 10 ? "0" + i : i;
            const x = `${hour}:00 ~ ${hour}:59`;
            xAxis.push(x);
          }
        }
        const hasChannels = [];
        data.forEach((item) => {
          if (hasChannels.indexOf(item.channel_id) < 0) {
            hasChannels.push(item.channel_id);
          }
        });
        let allChannels = [];
        this.getChannels().then((res2) => {
          allChannels = res2.result.data;
        }).finally(() => {
          hasChannels.forEach((channel, index) => {
            const c = allChannels.find((item) => item._id === channel);
            const line = options.series[index] = {
              name: c && c.channel_name || "未知",
              data: []
            };
            if (this.dimension === "hour") {
              for (let i = 0; i < 24; ++i) {
                line.data[i] = 0;
              }
            }
            let mapper = pages_uniStat_channel_fieldsMap.fieldsMap.filter((f) => f.field === field2);
            mapper = JSON.parse(JSON.stringify(mapper));
            delete mapper[0].value;
            mapper[0].formatter = "";
            for (const item of data) {
              js_sdk_uniStat_util.mapfields(mapper, item, item);
              let date = item.start_time;
              const x = js_sdk_uniStat_util.formatDate(date, this.dimension);
              let y = item[field2];
              const dateIndex = xAxis.indexOf(x);
              if (channel === item.channel_id) {
                if (dateIndex < 0) {
                  xAxis.push(x);
                  line.data.push(y);
                } else {
                  line.data[dateIndex] = y;
                }
              }
            }
          });
          options.series = options.series.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          this.chartData = options;
        });
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
      });
    },
    getChannels() {
      const db = common_vendor.Vs.database();
      return db.collection("uni-stat-app-channels").where(js_sdk_uniStat_util.stringifyQuery({
        appid: this.query.appid,
        platform_id: this.query.platform_id
      })).get();
    },
    getTableData() {
      const query = js_sdk_uniStat_util.stringifyQuery(this.query, false, ["uni_platform"]);
      const {
        pageCurrent
      } = this.paginationOptions;
      this.loading = true;
      const db = common_vendor.Vs.database();
      db.collection("uni-stat-result").where(query).field(`${js_sdk_uniStat_util.stringifyField(pages_uniStat_channel_fieldsMap.fieldsMap)},appid, channel_id`).groupBy("appid, channel_id").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_channel_fieldsMap.fieldsMap)).orderBy("new_device_count", "desc").skip((pageCurrent - 1) * this.paginationOptions.pageSize).limit(this.paginationOptions.pageSize).get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        this.getChannels().then((res2) => {
          const channels = res2.result.data;
          for (const item of data) {
            channels.forEach((channel) => {
              if (item.channel_id === channel._id) {
                item.channel_code = channel.channel_code;
                item.channel_name = channel.channel_name;
              }
            });
          }
        }).finally(() => {
          for (const item of data) {
            js_sdk_uniStat_util.mapfields(pages_uniStat_channel_fieldsMap.fieldsMap, item, item, "total_");
          }
          this.tableData = [];
          this.paginationOptions.total = count;
          this.tableData = data;
          this.loading = false;
        });
      }).catch((err) => {
        console.error(err);
        this.loading = false;
      });
    },
    createStr(maps, fn, prefix = "total_") {
      const strArr = [];
      maps.forEach((mapper) => {
        if (field.hasOwnProperty("value")) {
          const fieldName = mapper.field;
          strArr.push(`${fn}(${fieldName}) as ${prefix + fieldName}`);
        }
      });
      return strArr.join();
    },
    getPanelData() {
      let query = JSON.parse(JSON.stringify(this.query));
      query.dimension = "day";
      let querystr = js_sdk_uniStat_util.stringifyQuery(query, false, ["uni_platform"]);
      const db = common_vendor.Vs.database();
      db.collection("uni-stat-result").where(querystr).field(js_sdk_uniStat_util.stringifyField(pages_uniStat_channel_fieldsMap.fieldsMap)).groupBy("appid").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_channel_fieldsMap.fieldsMap)).orderBy("start_time", "desc").get().then((res) => {
        const item = res.result.data[0];
        item && (item.total_devices = 0);
        js_sdk_uniStat_util.getFieldTotal.call(this, query);
        this.panelData = [];
        this.panelData = js_sdk_uniStat_util.mapfields(pages_uniStat_channel_fieldsMap.fieldsMap, item);
      });
    },
    inputDialogToggle(queryId, updateValue) {
      this.queryId = queryId;
      this.updateValue = updateValue;
      this.$refs.inputDialog.open();
    },
    editName(value) {
      const db = common_vendor.Vs.database();
      db.collection("uni-stat-app-channels").where({
        channel_code: this.queryId
      }).update({
        channel_name: value
      }).then((res) => {
        common_vendor.index.showToast({
          title: "修改成功"
        });
        this.getTableData();
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "请求服务失败",
          showCancel: false
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_link2 = common_vendor.resolveComponent("uni-link");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_stat_panel2 = common_vendor.resolveComponent("uni-stat-panel");
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_link2 + _easycom_uni_data_select2 + _easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_uni_stat_panel2 + _easycom_qiun_data_charts2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_icons2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_link = () => "../../../uni_modules/uni-link/components/uni-link/uni-link.js";
const _easycom_uni_data_select = () => "../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_stat_tabs = () => "../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_stat_panel = () => "../../../components/uni-stat-panel/uni-stat-panel.js";
const _easycom_qiun_data_charts = () => "../../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_uni_popup_dialog = () => "../../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_fix_window = () => "../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_link + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_uni_stat_panel + _easycom_qiun_data_charts + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_icons + _easycom_uni_td + _easycom_uni_table + _easycom_uni_pagination + _easycom_uni_popup_dialog + _easycom_uni_popup + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      href: "https://ask.dcloud.net.cn/article/35974",
      text: "支持Android App多渠道统计。设置App渠道包的方法，请参考 https://ask.dcloud.net.cn/article/35974。"
    }),
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
      storage: false,
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
      mode: "platform-channel",
      all: false,
      modelValue: $data.query.platform_id
    }),
    i: common_vendor.o($options.changeTimeRange),
    j: common_vendor.p({
      label: "日期选择",
      current: $data.currentDateTab,
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
    p: common_vendor.o($options.changeChartTab),
    q: common_vendor.o(($event) => $data.chartTab = $event),
    r: common_vendor.p({
      type: "box",
      tabs: $options.chartTabs,
      modelValue: $data.chartTab
    }),
    s: common_vendor.p({
      type: "area",
      chartData: $data.chartData,
      echartsH5: true,
      echartsApp: true,
      tooltipFormat: "tooltipCustom",
      errorMessage: $data.errorMessage
    }),
    t: common_vendor.p({
      color: "",
      href: "https://ask.dcloud.net.cn/article/35974",
      text: "如何自定义渠道包?"
    }),
    v: common_vendor.f($data.fieldsMap.slice(0, $data.fieldsMap.length - 1), (mapper, index, i0) => {
      return common_vendor.e({
        a: mapper.title
      }, mapper.title ? {
        b: common_vendor.t(mapper.title),
        c: index,
        d: "4790e861-13-" + i0 + ",4790e861-12",
        e: common_vendor.p({
          align: "center"
        })
      } : {}, {
        f: index
      });
    }),
    w: common_vendor.f($data.tableData, (item, i, i0) => {
      return {
        a: common_vendor.f($data.fieldsMap.slice(0, $data.fieldsMap.length - 1), (mapper, index, i1) => {
          return common_vendor.e({
            a: mapper.title && index === 1
          }, mapper.title && index === 1 ? {
            b: common_vendor.t(item[mapper.field] ? item[mapper.field] : "-"),
            c: common_vendor.o(($event) => $options.inputDialogToggle(item.channel_code, item.channel_name), index),
            d: "4790e861-16-" + i0 + "-" + i1 + "," + ("4790e861-15-" + i0 + "-" + i1),
            e: common_vendor.p({
              type: "compose",
              color: "#2979ff",
              size: "25"
            }),
            f: mapper.field,
            g: "4790e861-15-" + i0 + "-" + i1 + "," + ("4790e861-14-" + i0)
          } : {
            i: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            j: mapper.field,
            k: "4790e861-17-" + i0 + "-" + i1 + "," + ("4790e861-14-" + i0),
            l: common_vendor.p({
              align: "center"
            })
          }, {
            h: mapper.title,
            m: index
          });
        }),
        b: i,
        c: "4790e861-14-" + i0 + ",4790e861-11"
      };
    }),
    x: common_vendor.p({
      loading: $data.loading,
      border: true,
      stripe: true,
      emptyText: $data.errorMessage || _ctx.$t("common.empty")
    }),
    y: common_vendor.o($options.changePageCurrent),
    z: common_vendor.o($options.changePageSize),
    A: common_vendor.p({
      ["show-icon"]: true,
      ["show-page-size"]: true,
      ["page-size"]: $data.paginationOptions.pageSize,
      current: $data.paginationOptions.pageCurrent,
      total: $data.paginationOptions.total
    }),
    B: common_vendor.sr("inputClose", "4790e861-20,4790e861-19"),
    C: common_vendor.o($options.editName),
    D: common_vendor.o(($event) => $data.updateValue = $event),
    E: common_vendor.p({
      mode: "input",
      title: "请编辑名称",
      placeholder: "请输入内容",
      modelValue: $data.updateValue
    }),
    F: common_vendor.sr("inputDialog", "4790e861-19"),
    G: common_vendor.p({
      type: "dialog",
      maskClick: true
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
