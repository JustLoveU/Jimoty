"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../js_sdk/uni-stat/util.js");
const pages_uniStat_event_fieldsMap = require("./fieldsMap.js");
const _sfc_main = {
  data() {
    return {
      fieldsMap: pages_uniStat_event_fieldsMap.fieldsMap,
      formData: {
        event_key: "",
        device_id: ""
      },
      query: {
        appid: "",
        platform_id: "",
        uni_platform: "",
        platform: "",
        channel_id: "",
        channel: "",
        version_id: "",
        version: "",
        create_time: [],
        event_key: "",
        device_id: ""
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
      panelData: [],
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
    changeFormData(val, key) {
      this.query[key] = val;
    },
    useDatetimePicker() {
      this.currentDateTab = -1;
    },
    changeAppid(id) {
      this.getChannelData(id, false);
    },
    changeTimeRange(id, index) {
      this.currentDateTab = index;
      const start = js_sdk_uniStat_util.getTimeOfSomeDayAgo(id), end = js_sdk_uniStat_util.getTimeOfSomeDayAgo(0) - 1;
      this.query.create_time = [start, end];
    },
    changePageCurrent(e) {
      this.options.pageCurrent = e.current;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.options.pageSize = pageSize;
      this.options.pageCurrent = 1;
      this.getTableData();
    },
    getAllData(query) {
      this.getTableData(query);
    },
    changePlatform(id, index, name, item) {
      this.getChannelData(null, id);
      this.query.version_id = 0;
      this.query.uni_platform = item.code;
      this.query.platform = item.code;
    },
    changeVersion(version) {
      if (!version)
        version = "";
      version.split("---");
      this.query.version = version.split("---")[0];
      this.query.platform = version.split("---")[1];
    },
    changeChannel(channel) {
      if (!channel)
        channel = "";
      channel.split("---");
      this.query.channel = channel.split("---")[0];
    },
    getTableData(query = js_sdk_uniStat_util.stringifyQuery(this.query, null, ["uni_platform", "platform_id", "version_id", "channel_id"])) {
      if (!this.query.appid) {
        this.errorMessage = "请先选择应用";
        return;
      }
      this.errorMessage = "";
      const {
        pageCurrent
      } = this.options;
      this.loading = true;
      const db = common_vendor.Vs.database();
      let collectionList = [
        db.collection("uni-stat-event-logs").where(query).getTemp(),
        db.collection("uni-stat-app-platforms").getTemp()
      ];
      db.collection(...collectionList).orderBy("create_time", "desc").skip((pageCurrent - 1) * this.options.pageSize).limit(this.options.pageSize).get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        this.tableData = [];
        this.options.total = count;
        for (const item of data) {
          item.create_time = js_sdk_uniStat_util.parseDateTime(item.create_time, "dateTime");
          item.platform = item.platform && item.platform[0].name;
          js_sdk_uniStat_util.mapfields(pages_uniStat_event_fieldsMap.fieldsMap, item, item);
          this.tableData.push(item);
        }
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    getChannelData(appid, platform_id) {
      if (!this.query.appid) {
        this.errorMessage = "请先选择应用";
        return;
      }
      this.errorMessage = "";
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
  const _easycom_uni_link2 = common_vendor.resolveComponent("uni-link");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_link2 + _easycom_uni_data_select2 + _easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_uni_easyinput2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_link = () => "../../../uni_modules/uni-link/components/uni-link/uni-link.js";
const _easycom_uni_data_select = () => "../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_stat_tabs = () => "../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_uni_popup_dialog = () => "../../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_fix_window = () => "../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_link + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_uni_easyinput + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table + _easycom_uni_pagination + _easycom_uni_popup_dialog + _easycom_uni_popup + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      href: "https://ask.dcloud.net.cn/article/36304",
      text: "自定义事件说明>>"
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
    d: common_vendor.o($options.changeVersion),
    e: common_vendor.o(($event) => $data.query.version_id = $event),
    f: common_vendor.p({
      collection: "opendb-app-versions",
      where: $options.versionQuery,
      field: "concat(version, '---',uni_platform) as value, version as text, uni_platform as label, create_date as date",
      format: "{label} - {text}",
      orderby: "date desc",
      label: "版本选择",
      modelValue: $data.query.version_id
    }),
    g: common_vendor.o($options.changeTimeRange),
    h: common_vendor.p({
      label: "日期选择",
      current: $data.currentDateTab,
      mode: "date"
    }),
    i: $data.currentDateTab < 0 && !!$data.query.create_time.length ? 1 : "",
    j: common_vendor.o($options.useDatetimePicker),
    k: common_vendor.o(($event) => $data.query.create_time = $event),
    l: common_vendor.p({
      type: "datetimerange",
      end: (/* @__PURE__ */ new Date()).getTime(),
      returnType: "timestamp",
      clearIcon: false,
      modelValue: $data.query.create_time
    }),
    m: common_vendor.o($options.changePlatform),
    n: common_vendor.o(($event) => $data.query.platform_id = $event),
    o: common_vendor.p({
      label: "平台选择",
      type: "boldLine",
      mode: "platform",
      modelValue: $data.query.platform_id
    }),
    p: $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1
  }, $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1 ? {
    q: common_vendor.sr("version-select", "7a54f562-7"),
    r: common_vendor.o($options.changeChannel),
    s: common_vendor.o(($event) => $data.query.channel_id = $event),
    t: common_vendor.p({
      collection: "uni-stat-app-channels",
      where: $options.channelQuery,
      field: "concat(channel_code, '---',channel_name) as value,  channel_name as text",
      orderby: "text asc",
      label: "渠道/场景值选择",
      modelValue: $data.query.channel_id
    })
  } : {}, {
    v: common_vendor.o(($event) => $options.changeFormData($event, "event_key")),
    w: common_vendor.o(($event) => $options.changeFormData("", "event_key")),
    x: common_vendor.o(($event) => $data.formData.event_key = $event),
    y: common_vendor.p({
      placeholder: "事件ID",
      modelValue: $data.formData.event_key
    }),
    z: common_vendor.o(($event) => $options.changeFormData($event, "device_id")),
    A: common_vendor.o(($event) => $options.changeFormData("", "device_id")),
    B: common_vendor.o(($event) => $data.formData.device_id = $event),
    C: common_vendor.p({
      placeholder: "设备标识",
      modelValue: $data.formData.device_id
    }),
    D: common_vendor.f($data.fieldsMap, (mapper, index, i0) => {
      return common_vendor.e({
        a: mapper.title
      }, mapper.title ? {
        b: common_vendor.t(mapper.title),
        c: index,
        d: "7a54f562-12-" + i0 + ",7a54f562-11",
        e: common_vendor.p({
          align: "center"
        })
      } : {}, {
        f: index
      });
    }),
    E: common_vendor.f($data.tableData, (item, i, i0) => {
      return {
        a: common_vendor.f($data.fieldsMap, (mapper, index, i1) => {
          return {
            a: common_vendor.t(item[mapper.field] !== void 0 ? item[mapper.field] : "-"),
            b: index,
            c: "7a54f562-14-" + i0 + "-" + i1 + "," + ("7a54f562-13-" + i0)
          };
        }),
        b: i,
        c: "7a54f562-13-" + i0 + ",7a54f562-10"
      };
    }),
    F: common_vendor.p({
      align: "center"
    }),
    G: common_vendor.p({
      loading: $data.loading,
      border: true,
      stripe: true,
      emptyText: $data.errorMessage || _ctx.$t("common.empty")
    }),
    H: common_vendor.o($options.changePageCurrent),
    I: common_vendor.o($options.changePageSize),
    J: common_vendor.p({
      ["show-icon"]: true,
      ["show-page-size"]: true,
      ["page-size"]: $data.options.pageSize,
      current: $data.options.pageCurrent,
      total: $data.options.total
    }),
    K: common_vendor.sr("inputClose", "7a54f562-17,7a54f562-16"),
    L: common_vendor.o(_ctx.editName),
    M: common_vendor.o(($event) => $data.updateValue = $event),
    N: common_vendor.p({
      mode: "input",
      title: "请编辑名称",
      placeholder: "请输入内容",
      modelValue: $data.updateValue
    }),
    O: common_vendor.sr("inputDialog", "7a54f562-16"),
    P: common_vendor.p({
      type: "dialog",
      maskClick: true
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
