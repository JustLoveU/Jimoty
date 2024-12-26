"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  name: "uni-stat-tabs",
  data() {
    return {
      currentTab: 0,
      renderTabs: [],
      cacheKey: "uni-admin-statTabsData"
    };
  },
  props: {
    type: {
      type: String,
      default: "line"
    },
    value: {
      type: [String, Number],
      default: ""
    },
    modelValue: {
      type: [String, Number],
      default: ""
    },
    current: {
      type: [String, Number],
      default: 0
    },
    mode: {
      type: String,
      default: ""
    },
    today: {
      type: Boolean,
      default: false
    },
    yesterday: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: Boolean,
      default: false
    },
    all: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "暂无选项"
    },
    tabs: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  created() {
    this.last = `${this.mode.replace("-", "_")}_last_data`;
  },
  mounted() {
    this.init();
  },
  computed: {},
  watch: {
    current: {
      immediate: true,
      handler(val) {
        this.currentTab = val;
      }
    },
    // value(val) {
    // 	this.currentTab = val
    // },
    tabs: {
      immediate: false,
      handler(val) {
        this.init();
      }
    },
    renderTabs(val) {
      const index = this.current;
      if (this.mode && val.length && index >= 0) {
        this.$nextTick(function() {
          const item = this.renderTabs[index];
          this.change(item, index);
        });
      }
    }
  },
  methods: {
    init() {
      if (this.mode.indexOf("platform") > -1) {
        this.renderTabs = this.getCache() || [];
        this.getPlatform();
      } else if (this.mode === "date") {
        const dates = [{
          _id: 7,
          name: "最近七天"
        }, {
          _id: 30,
          name: "最近30天"
        }, {
          _id: 90,
          name: "最近90天"
        }];
        if (this.yesterday) {
          dates.unshift({
            _id: 1,
            name: "昨天"
          });
        }
        if (this.today) {
          dates.unshift({
            _id: 0,
            name: "今天"
          });
        }
        this.renderTabs = dates;
      } else {
        this.renderTabs = this.tabs;
      }
    },
    change(item, index) {
      if (item.disabled)
        return;
      const id = item._id;
      const name = item.name;
      this.currentTab = index;
      this.emit(id, index, name, item);
    },
    emit(id, index, name, item) {
      this.$emit("change", id, index, name, item);
      this.$emit("input", id, index, name);
      this.$emit("update:modelValue", id, index, name);
    },
    getPlatform() {
      const db = common_vendor.Vs.database();
      db.collection("uni-stat-app-platforms").get().then((res) => {
        let platforms = res.result.data;
        platforms = platforms.filter((p) => p.hasOwnProperty("enable") ? p.enable : true);
        platforms.sort((a, b) => a.order - b.order);
        if (this.mode === "platform-channel") {
          platforms = platforms.filter((item) => /^android|ios$/.test(item.code));
          let _id = platforms.map((p) => `platform_id == "${p._id}"`).join(" || ");
          _id = `(${_id})`;
          this.setAllItem(platforms, _id);
        } else if (this.mode === "platform-scene") {
          platforms = platforms.filter((item) => /mp-/.test(item.code));
          let _id = platforms.map((p) => `platform_id == "${p._id}"`).join(" || ");
          _id = `(${_id})`;
          this.setAllItem(platforms, _id);
        } else {
          this.setAllItem(platforms);
        }
        this.setCache(platforms);
        this.renderTabs = platforms;
      });
    },
    setAllItem(platforms, _id = "", name = "全部") {
      this.all && platforms.unshift({
        name,
        _id
      });
    },
    // 获取当前缓存key
    getCurrentCacheKey() {
      return this.mode;
    },
    // 获取缓存
    getCache(name = this.getCurrentCacheKey()) {
      let cacheData = common_vendor.index.getStorageSync(this.cacheKey) || {};
      return cacheData[name];
    },
    // 设置缓存
    setCache(value, name = this.getCurrentCacheKey()) {
      let cacheData = common_vendor.index.getStorageSync(this.cacheKey) || {};
      cacheData[name] = value;
      common_vendor.index.setStorageSync(this.cacheKey, cacheData);
    },
    // 删除缓存
    removeCache(name = this.getCurrentCacheKey()) {
      let cacheData = common_vendor.index.getStorageSync(this.cacheKey) || {};
      delete cacheData[name];
      common_vendor.index.setStorageSync(this.cacheKey, cacheData);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.label
  }, $props.label ? {
    b: common_vendor.t($props.label + "：")
  } : {}, {
    c: !$data.renderTabs.length
  }, !$data.renderTabs.length ? {
    d: common_vendor.t($props.placeholder),
    e: common_vendor.n(`uni-stat--tab-item-${$props.type}`)
  } : {
    f: common_vendor.f($data.renderTabs, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: index,
        c: common_vendor.o(($event) => $options.change(item, index), index),
        d: common_vendor.n(index === $data.currentTab ? `uni-stat--tab-item-${$props.type}-active` : ""),
        e: common_vendor.n(item.disabled ? "uni-stat--tab-item-disabled" : "")
      };
    }),
    g: common_vendor.n(`uni-stat--tab-item-${$props.type}`)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
exports.Component = Component;
