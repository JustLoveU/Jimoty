"use strict";
const common_vendor = require("../../../../common/vendor.js");
const db = common_vendor.Zs.database();
const _ = db.command;
const $ = _.aggregate;
var cache = {};
const hotCityCacheKey = "uni-city-list.hotCity";
const uniCityList = () => "../../components/uni-city-list/uni-city-list.js";
const _sfc_main = {
  components: {
    uniCityList
  },
  onLoad() {
    this.getCloudData();
    let hotCity = common_vendor.index.getStorageSync(hotCityCacheKey);
    if (hotCity) {
      this.hotCity = hotCity;
    }
    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel.on) {
      eventChannel.on("data", (data) => {
        this.hotCity = data.hotCity;
        common_vendor.index.setStorageSync(hotCityCacheKey, data.hotCity);
      });
    }
  },
  data() {
    return {
      searchValue: "",
      where: {},
      list: [],
      hotCity: []
    };
  },
  methods: {
    _select(cityInfo) {
      const eventChannel = this.getOpenerEventChannel();
      if (eventChannel.emit)
        eventChannel.emit("select", cityInfo);
      common_vendor.index.navigateBack();
    },
    search() {
      if (this.searchValue) {
        this.where = {
          name: new RegExp(this.searchValue),
          type: _.in([1, 2])
        };
      } else {
        this.where = {};
      }
      this.getCloudData();
    },
    getWhere() {
      let {
        where = {}
      } = this;
      return {
        type: 1,
        ...where
      };
    },
    // 获取云端数据
    async getCloudData() {
      let where = this.getWhere();
      if (cache[JSON.stringify(where)]) {
        this.list = cache[JSON.stringify(where)];
      }
      let dbRes = await db.collection("opendb-city-china").aggregate().match(where).group({
        _id: "$first_letter",
        data: $.push("$name"),
        value: $.push({
          code: "$code",
          name: "$name"
        })
      }).addFields({
        letter: "$_id"
      }).sort({
        _id: 1
      }).limit(1e3).end();
      let rows = dbRes.result.data;
      if (rows && rows.length === 0 && !this.searchValue.trim()) {
        common_vendor.index.showModal({
          content: "请右键 uniCloud/database 目录，点击【初始化云函数库】（如果有出现其他表名，不要打勾，直接点覆盖选中的表）",
          showCancel: false
        });
      }
      this.list = rows;
      cache[JSON.stringify(where)] = rows;
    },
    cityClick(e) {
      let name = e.item.name;
      let cityInfo = this.getCityInfo({ name });
      this._select(cityInfo);
    },
    hotCityClick(code) {
      let cityInfo = this.getCityInfo({ code });
      this._select(cityInfo);
    },
    getCityInfo(obj = {}) {
      let { code, name } = obj;
      let list = [];
      this.list.map((item, index) => {
        list = list.concat(item.value);
      });
      let cityInfo = list.find((item) => {
        return code && item.code == code || name && item.name == name;
      });
      return cityInfo;
    }
  },
  computed: {
    popupStyleCom() {
      let systemInfo = common_vendor.index.getSystemInfoSync();
      let top = systemInfo.safeAreaInsets.top || 0;
      return `height: ${systemInfo.windowHeight - top}px`;
    }
  }
};
if (!Array) {
  const _easycom_uni_city_list2 = common_vendor.resolveComponent("uni-city-list");
  _easycom_uni_city_list2();
}
const _easycom_uni_city_list = () => "../../components/uni-city-list/uni-city-list.js";
if (!Math) {
  _easycom_uni_city_list();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: $data.searchValue,
    c: common_vendor.o(($event) => $data.searchValue = $event.detail.value),
    d: common_vendor.f($data.hotCity, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: index,
        c: common_vendor.o(($event) => $options.hotCityClick(item.code), index)
      };
    }),
    e: common_vendor.o($options.cityClick),
    f: common_vendor.p({
      options: $data.list,
      showSelect: false
    }),
    g: common_vendor.s($options.popupStyleCom)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d1d7c0fd"]]);
wx.createPage(MiniProgramPage);
