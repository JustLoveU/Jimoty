"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    max: {
      type: Number,
      default: 10
    },
    min: {
      type: Number,
      default: 0
    },
    defaultValue: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      slideBarWidth: 0,
      minScore: this.min ? this.min : 0,
      maxScore: this.max ? this.max : 10,
      x: 0,
      y: 0,
      score: this.min || 0
    };
  },
  mounted() {
    var that = this;
    let el = common_vendor.index.createSelectorQuery().in(this);
    this.$nextTick(() => {
      el.select(".slider-container").boundingClientRect(function(res) {
        that.slideBarWidth = res.width;
        if (that.defaultValue) {
          that.score = that.defaultValue || that.minScore;
          that.x = (that.defaultValue - that.minScore) / (that.maxScore - that.minScore) * that.slideBarWidth;
          that.score = that.defaultValue;
        }
      }).exec();
    });
  },
  methods: {
    onChange: function(e, i) {
      if (!e.detail.source)
        return;
      let newX = e.detail.x;
      if (newX < 0) {
        newX = 0;
      } else if (newX > this.slideBarWidth) {
        newX = this.slideBarWidth;
      }
      if (newX < (this.minScore - this.min) / (this.max - this.min) * this.slideBarWidth) {
        newX = (this.minScore - this.min) / (this.max - this.min) * this.slideBarWidth;
      } else if (newX > (this.max - this.minScore) / (this.max - this.min) * this.slideBarWidth) {
        newX = (this.max - this.minScore) / (this.max - this.min) * this.slideBarWidth;
      }
      this.x = newX;
      this.score = parseInt(this.x / this.slideBarWidth * (this.maxScore - this.minScore) + this.minScore);
      this.$emit("change", this.score);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.x + "px",
    b: common_vendor.t($data.score),
    c: $data.x,
    d: common_vendor.o((...args) => $options.onChange && $options.onChange(...args)),
    e: "100%"
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
