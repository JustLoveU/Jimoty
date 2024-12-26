"use strict";
const common_vendor = require("../../../../common/vendor.js");
const indexedListItem = () => "./uni-city-list-item.js";
const _sfc_main = {
  name: "UniIndexedList",
  components: {
    indexedListItem
  },
  emits: ["click"],
  props: {
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    showSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lists: [],
      winHeight: 0,
      itemHeight: 0,
      winOffsetY: 0,
      touchmove: false,
      touchmoveIndex: -1,
      scrollViewId: "",
      touchmovable: true,
      loaded: false,
      isPC: false,
      top: 165
    };
  },
  watch: {
    options: {
      handler: function() {
        this.setList();
      },
      deep: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.setList();
    }, 50);
    setTimeout(() => {
      this.loaded = true;
    }, 300);
  },
  methods: {
    setList() {
      this.lists = [];
      this.options.forEach((value, index) => {
        if (value.data.length === 0) {
          return;
        }
        let indexBefore = index;
        let items = value.data.map((item) => {
          let obj = {};
          obj["key"] = value.letter;
          obj["name"] = item;
          obj["itemIndex"] = index;
          index++;
          obj.checked = item.checked ? item.checked : false;
          return obj;
        });
        this.lists.push({
          title: value.letter,
          key: value.letter,
          items,
          itemIndex: indexBefore
        });
      });
      common_vendor.index.createSelectorQuery().in(this).select("#list").boundingClientRect().exec((ret) => {
        this.winOffsetY = 0;
        this.winHeight = ret[0].height;
        this.itemHeight = this.winHeight / this.lists.length;
      });
    },
    touchStart(e) {
      this.touchmove = true;
      let pageY = this.isPC ? e.pageY : e.touches[0].pageY;
      pageY -= this.top;
      let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight);
      let item = this.lists[index];
      if (item) {
        this.scrollViewId = "uni-city-list-" + index;
        this.touchmoveIndex = index;
      }
    },
    touchMove(e) {
      let pageY = this.isPC ? e.pageY : e.touches[0].pageY;
      pageY -= this.top;
      let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight);
      if (this.touchmoveIndex === index) {
        return false;
      }
      let item = this.lists[index];
      if (item) {
        this.scrollViewId = "uni-city-list-" + index;
        this.touchmoveIndex = index;
      }
    },
    touchEnd() {
      this.touchmove = false;
    },
    /**
     * 兼容 PC @tian
     */
    mousedown(e) {
      if (!this.isPC)
        return;
      this.touchStart(e);
    },
    mousemove(e) {
      if (!this.isPC)
        return;
      this.touchMove(e);
    },
    mouseleave(e) {
      if (!this.isPC)
        return;
      this.touchEnd(e);
    },
    onClick(e) {
      let {
        idx,
        index
      } = e;
      let obj = {};
      for (let key in this.lists[idx].items[index]) {
        obj[key] = this.lists[idx].items[index][key];
      }
      let select = [];
      if (this.showSelect) {
        this.lists[idx].items[index].checked = !this.lists[idx].items[index].checked;
        this.lists.forEach((value, idx2) => {
          value.items.forEach((item, index2) => {
            if (item.checked) {
              let obj2 = {};
              for (let key in this.lists[idx2].items[index2]) {
                obj2[key] = this.lists[idx2].items[index2][key];
              }
              select.push(obj2);
            }
          });
        });
      }
      this.$emit("click", {
        item: obj,
        select
      });
    }
  }
};
if (!Array) {
  const _component_indexed_list_item = common_vendor.resolveComponent("indexed-list-item");
  _component_indexed_list_item();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.lists, (list, idx, i0) => {
      return {
        a: common_vendor.o($options.onClick, idx),
        b: "50674666-0-" + i0,
        c: common_vendor.p({
          list,
          loaded: $data.loaded,
          idx,
          showSelect: $props.showSelect
        }),
        d: idx,
        e: "uni-city-list-" + idx
      };
    }),
    b: $data.scrollViewId,
    c: common_vendor.f($data.lists, (list, key, i0) => {
      return {
        a: common_vendor.t(list.key),
        b: common_vendor.n($data.touchmoveIndex == key ? "uni-city-list__menu-text--active" : ""),
        c: key,
        d: common_vendor.n($data.touchmoveIndex == key ? "uni-city-list__menu--active" : "")
      };
    }),
    d: common_vendor.o((...args) => $options.touchStart && $options.touchStart(...args)),
    e: common_vendor.o((...args) => $options.touchMove && $options.touchMove(...args)),
    f: common_vendor.o((...args) => $options.touchEnd && $options.touchEnd(...args)),
    g: common_vendor.o((...args) => $options.mousedown && $options.mousedown(...args)),
    h: common_vendor.o((...args) => $options.mousemove && $options.mousemove(...args)),
    i: common_vendor.o((...args) => $options.mouseleave && $options.mouseleave(...args)),
    j: $data.touchmove
  }, $data.touchmove ? {
    k: common_vendor.t($data.lists[$data.touchmoveIndex].key)
  } : {}, {
    l: common_vendor.s("--top: " + $data.top + "px")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-50674666"]]);
wx.createComponent(Component);
