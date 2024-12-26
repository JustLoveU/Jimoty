"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../js_sdk/uni-stat/util.js");
const pages_uniStat_pageContent_fieldsMap = require("./fieldsMap.js");
const _sfc_main = {
  data() {
    return {
      fieldsMap: pages_uniStat_pageContent_fieldsMap.fieldsMap,
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
      currentDateTab: 1,
      tableData: [],
      panelData: pages_uniStat_pageContent_fieldsMap.fieldsMap.filter((f) => f.hasOwnProperty("value")),
      queryId: "",
      updateValue: "",
      channelData: [],
      errorMessage: ""
    };
  },
  computed: {
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
    this.debounceGet = js_sdk_uniStat_util.debounce(() => this.getAllData());
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
    pageTo(url) {
      common_vendor.index.redirectTo({
        url
      });
    },
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
      const start = js_sdk_uniStat_util.getTimeOfSomeDayAgo(id), end = js_sdk_uniStat_util.getTimeOfSomeDayAgo(0) - 1;
      this.query.start_time = [start, end];
    },
    changePageCurrent(e) {
      this.options.pageCurrent = e.current;
      this.getTableData(this.query);
    },
    changePageSize(pageSize) {
      this.options.pageSize = pageSize;
      this.options.pageCurrent = 1;
      this.getTableData();
    },
    getAllData() {
      this.getPanelData();
      this.getTableData();
    },
    getTableData(query) {
      if (!this.query.appid) {
        this.errorMessage = "请先选择应用";
        return;
      }
      this.errorMessage = "";
      query = js_sdk_uniStat_util.stringifyQuery(this.query, null, ["uni_platform"]);
      const {
        pageCurrent
      } = this.options;
      this.loading = true;
      const db = common_vendor.Vs.database();
      const filterAppid = js_sdk_uniStat_util.stringifyQuery({
        appid: this.query.appid
      });
      const mainTableTemp = db.collection("uni-stat-page-details").where(filterAppid).getTemp();
      const subTableTemp = db.collection("uni-stat-page-detail-result").where(query).getTemp();
      db.collection(subTableTemp, mainTableTemp).field(
        `${js_sdk_uniStat_util.stringifyField(pages_uniStat_pageContent_fieldsMap.fieldsMap)}, stat_date, page_detail_id`
      ).groupBy("page_detail_id").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_pageContent_fieldsMap.fieldsMap)).orderBy("visit_times desc").skip((pageCurrent - 1) * this.options.pageSize).limit(this.options.pageSize).get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        this.options.total = count;
        this.tableData = [];
        for (const item of data) {
          const lines = item.page_detail_id;
          if (Array.isArray(lines)) {
            delete item.page_detail_id;
            const line = lines[0];
            if (line && Object.keys(line).length) {
              for (const key in line) {
                if (key !== "_id") {
                  item[key] = line[key];
                }
              }
            }
          }
          js_sdk_uniStat_util.mapfields(pages_uniStat_pageContent_fieldsMap.fieldsMap, item, item);
          this.tableData.push(item);
        }
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    getPanelData(query = js_sdk_uniStat_util.stringifyQuery(this.query, null, ["uni_platform"])) {
      let myFieldsMap = JSON.parse(JSON.stringify(pages_uniStat_pageContent_fieldsMap.fieldsMap));
      myFieldsMap = myFieldsMap.filter((item) => item.field !== "visit_devices");
      const db = common_vendor.Vs.database();
      db.collection("uni-stat-page-detail-result").where(query).field(js_sdk_uniStat_util.stringifyField(myFieldsMap)).groupBy("appid").groupField(js_sdk_uniStat_util.stringifyGroupField(myFieldsMap)).orderBy("start_time desc").get().then((res) => {
        const items = res.result.data[0];
        this.panelData = [];
        this.panelData = js_sdk_uniStat_util.mapfields(myFieldsMap, items);
      });
    },
    inputDialogToggle(url, title) {
      this.queryId = url;
      this.updateValue = title;
      this.$refs.inputDialog.open();
    },
    // 修改页面名称
    editName(value = "") {
      const db = common_vendor.Vs.database();
      common_vendor.index.showLoading({
        title: "请求中..."
      });
      db.collection("uni-stat-page-details").where({
        page_link: this.queryId
      }).update({
        page_title: value.trim()
      }).then((res) => {
        if (res.result.updated) {
          common_vendor.index.showToast({
            title: "修改成功"
          });
          this.getTableData();
        } else {
          common_vendor.index.showToast({
            title: "修改失败",
            icon: "none"
          });
        }
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "请求服务失败",
          showCancel: false
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
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
      db.collection(channelTemp, platformTemp).orderBy("platform_id asc").get().then((res) => {
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
  const _easycom_uni_stat_panel2 = common_vendor.resolveComponent("uni-stat-panel");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_data_select2 + _easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_uni_stat_panel2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_icons2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_data_select = () => "../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_stat_tabs = () => "../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_stat_panel = () => "../../../components/uni-stat-panel/uni-stat-panel.js";
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
  (_easycom_uni_stat_breadcrumb + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_uni_stat_panel + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_icons + _easycom_uni_td + _easycom_uni_table + _easycom_uni_pagination + _easycom_uni_popup_dialog + _easycom_uni_popup + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
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
    c: common_vendor.o(($event) => $data.query.version_id = $event),
    d: common_vendor.p({
      collection: "opendb-app-versions",
      where: $options.versionQuery,
      field: "_id as value, version as text, uni_platform as label, create_date as date",
      format: "{label} - {text}",
      orderby: "date desc",
      label: "版本选择",
      modelValue: $data.query.version_id
    }),
    e: common_vendor.o($options.changeTimeRange),
    f: common_vendor.p({
      label: "日期选择",
      current: $data.currentDateTab,
      mode: "date"
    }),
    g: $data.currentDateTab < 0 && !!$data.query.start_time.length ? 1 : "",
    h: common_vendor.o($options.useDatetimePicker),
    i: common_vendor.o(($event) => $data.query.start_time = $event),
    j: common_vendor.p({
      type: "datetimerange",
      end: (/* @__PURE__ */ new Date()).getTime(),
      returnType: "timestamp",
      clearIcon: false,
      modelValue: $data.query.start_time
    }),
    k: common_vendor.o($options.changePlatform),
    l: common_vendor.o(($event) => $data.query.platform_id = $event),
    m: common_vendor.p({
      label: "平台选择",
      type: "boldLine",
      mode: "platform",
      modelValue: $data.query.platform_id
    }),
    n: $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1
  }, $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1 ? {
    o: common_vendor.sr("version-select", "d0bf390e-6"),
    p: common_vendor.o(($event) => $data.query.channel_id = $event),
    q: common_vendor.p({
      collection: "uni-stat-app-channels",
      where: $options.channelQuery,
      field: "_id as value, channel_name as text",
      orderby: "text asc",
      label: "渠道/场景值选择",
      modelValue: $data.query.channel_id
    })
  } : {}, {
    r: common_vendor.p({
      items: $data.panelData
    }),
    s: common_vendor.o(($event) => $options.pageTo("/pages/uni-stat/page-rule/page-rule")),
    t: common_vendor.f($data.fieldsMap, (mapper, index, i0) => {
      return common_vendor.e({
        a: mapper.title
      }, mapper.title ? {
        b: common_vendor.t(mapper.title),
        c: index,
        d: "d0bf390e-10-" + i0 + ",d0bf390e-9",
        e: common_vendor.p({
          align: "center"
        })
      } : {}, {
        f: index
      });
    }),
    v: common_vendor.f($data.tableData, (item, i, i0) => {
      return {
        a: common_vendor.f($data.fieldsMap, (mapper, index, i1) => {
          return common_vendor.e({
            a: index === 1
          }, index === 1 ? {
            b: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            c: common_vendor.o(($event) => $options.inputDialogToggle(item.page_link, item.page_title), index),
            d: "d0bf390e-13-" + i0 + "-" + i1 + "," + ("d0bf390e-12-" + i0 + "-" + i1),
            e: common_vendor.p({
              type: "compose",
              color: "#2979ff",
              size: "25"
            }),
            f: mapper.field,
            g: "d0bf390e-12-" + i0 + "-" + i1 + "," + ("d0bf390e-11-" + i0)
          } : {
            h: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            i: mapper.field,
            j: "d0bf390e-14-" + i0 + "-" + i1 + "," + ("d0bf390e-11-" + i0),
            k: common_vendor.p({
              align: index === 0 ? "left" : "center"
            })
          }, {
            l: index
          });
        }),
        b: i,
        c: "d0bf390e-11-" + i0 + ",d0bf390e-8"
      };
    }),
    w: common_vendor.p({
      loading: $data.loading,
      border: true,
      stripe: true,
      emptyText: $data.errorMessage || _ctx.$t("common.empty")
    }),
    x: common_vendor.o($options.changePageCurrent),
    y: common_vendor.o($options.changePageSize),
    z: common_vendor.p({
      ["show-icon"]: true,
      ["show-page-size"]: true,
      ["page-size"]: $data.options.pageSize,
      current: $data.options.pageCurrent,
      total: $data.options.total
    }),
    A: common_vendor.sr("inputClose", "d0bf390e-17,d0bf390e-16"),
    B: common_vendor.o($options.editName),
    C: common_vendor.o(($event) => $data.updateValue = $event),
    D: common_vendor.p({
      mode: "input",
      title: "请编辑名称",
      placeholder: "请输入内容",
      modelValue: $data.updateValue
    }),
    E: common_vendor.sr("inputDialog", "d0bf390e-16"),
    F: common_vendor.p({
      type: "dialog",
      maskClick: true
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
