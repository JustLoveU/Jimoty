"use strict";
const common_vendor = require("../../common/vendor.js");
const createSelectorQuery = (that) => {
  let query = common_vendor.index.createSelectorQuery().in(that);
  return query;
};
const _sfc_main = {
  name: "s-region-slider",
  props: {
    fillValue: {
      type: Number,
      default: 1e3
    },
    fillMinValue: {
      type: Number,
      default: 0
    },
    minValue: {
      type: Number,
      default: 0
    },
    maxValue: {
      type: Number,
      default: 1e3
    },
    step: {
      type: Number,
      default: 50
    }
  },
  watch: {
    minValue(newVal, oldVla) {
      if (newVal < this.fillMinValue || this.maxValue > this.fillValue) {
        console.error(`请在${this.fillMinValue}-${this.fillValue}范围中设置`);
        return;
      }
      this.sMinValue = newVal - this.fillMinValue;
      this.showMinNum = newVal;
      this.minLeft = this.sMinValue / this.percentage;
    },
    maxValue(newVal, oldVla) {
      if (this.minValue < this.fillMinValue || newVal > this.fillValue) {
        console.error(`请在${this.fillMinValue}-${this.fillValue}范围中设置`);
        return;
      }
      this.sMaxValue = newVal - this.fillMinValue;
      this.showMaxNum = newVal;
      this.maxLeft = this.sMaxValue / this.percentage;
    },
    fillValue(newVal, oldVla) {
      this.sFillValue = this.fillValue;
    }
  },
  data() {
    return {
      tipShow: false,
      tipLeft: 0,
      minLeft: 0,
      maxLeft: 0,
      touchWidth: 30,
      lineWidth: 0,
      lineLeft: 0,
      showMinNum: 0,
      showMaxNum: 0,
      curValue: 0,
      sMinValue: 0,
      sMaxValue: 0,
      sFillValue: 0,
      sFillMinValue: 0,
      percentage: 0
    };
  },
  mounted() {
    this.$nextTick().then(() => {
      this.envir({
        classname: ".fj-touch-left",
        refname: this.$refs.fjtouchleft,
        fn: (ret) => {
          this.touchWidth = ret.width;
        }
      });
      this.envir({
        classname: ".fj-line",
        refname: this.$refs["fj-line"],
        fn: (ret) => {
          this.lineWidth = ret.width;
          this.lineLeft = ret.left;
          this.sMinValue = this.minValue - this.fillMinValue > 0 ? this.minValue - this.fillMinValue : 0;
          this.sMaxValue = this.maxValue - this.fillMinValue > 0 ? this.maxValue - this.fillMinValue : 0;
          this.sFillValue = this.fillValue - this.fillMinValue > 0 ? this.fillValue - this.fillMinValue : 0;
          this.percentage = this.sFillValue / this.lineWidth;
          this.minLeft = this.sMinValue / this.percentage;
          this.maxLeft = this.sMaxValue / this.percentage;
          this.showMaxNum = this.sMaxValue + this.fillMinValue;
          this.showMinNum = this.sMinValue + this.fillMinValue;
        }
      });
    });
  },
  methods: {
    envir(opt) {
      setTimeout(() => {
        createSelectorQuery(this).select(opt.classname).boundingClientRect().exec((data) => {
          const option = data[0];
          opt.fn({
            width: option.width,
            height: option.height,
            top: option.top,
            bottom: option.bottom,
            left: option.left,
            right: option.right
          });
        });
      }, 200);
    },
    touchstart(e, type) {
      this.$emit("down", {
        ...e,
        custom: {
          type,
          minValue: this.showMinNum,
          maxValue: this.showMaxNum
        }
      });
    },
    touchmove(e, type) {
      const disX = e.touches[0].clientX - this.lineLeft;
      if (disX < 0 || disX > this.lineWidth) {
        return;
      }
      if (type === "min") {
        this.minLeft = Math.floor(disX);
        if (this.minLeft < 0) {
          this.minLeft = 0;
          return;
        }
        if (this.maxLeft > this.lineWidth) {
          this.maxLeft = this.lineWidth;
          return;
        }
        this.curValue = Math.floor(this.minLeft * this.percentage);
      }
      if (type === "max") {
        this.maxLeft = Math.ceil(disX);
        if (this.minLeft < 0) {
          this.minLeft = 0;
          return;
        }
        if (this.maxLeft > this.lineWidth) {
          this.maxLeft = this.lineWidth;
          return;
        }
        this.curValue = Math.round(this.maxLeft * this.percentage);
      }
      this.tipShow = true;
      this.tipLeft = Math.round(this.curValue / this.percentage);
      this.tipLeft = this.tipLeft >= this.lineWidth ? this.lineWidth : this.tipLeft;
      this.tipLeft = this.tipLeft <= 0 ? 0 : this.tipLeft;
      this.curValue = this.curValue + this.fillMinValue;
      this.$emit("move", {
        ...e,
        custom: {
          type,
          minValue: this.showMinNum,
          maxValue: this.showMaxNum,
          curValue: this.curValue
        }
      });
    },
    touchend(e, type) {
      if (type === "min") {
        if (this.step === 1) {
          this.sMinValue = this.curValue - this.fillMinValue;
        } else {
          const stepnum = Math.round(this.minLeft * this.percentage / this.step);
          this.sMinValue = stepnum * this.step;
          this.minLeft = this.sMinValue / this.percentage;
        }
      }
      if (type === "max") {
        if (this.step === 1) {
          this.sMaxValue = this.curValue - this.fillMinValue;
        } else {
          const stepnum = Math.round(this.maxLeft * this.percentage / this.step);
          this.sMaxValue = stepnum * this.step;
          if (this.sFillValue - this.sMaxValue < this.step) {
            this.sMaxValue = this.sFillValue;
          }
          this.maxLeft = this.sMaxValue / this.percentage;
        }
      }
      this.tipShow = false;
      if (this.sMinValue <= this.sMaxValue) {
        this.showMaxNum = this.sMaxValue + this.fillMinValue;
        this.showMinNum = this.sMinValue + this.fillMinValue;
      } else {
        this.showMaxNum = this.sMinValue + this.fillMinValue;
        this.showMinNum = this.sMaxValue + this.fillMinValue;
      }
      this.$emit("up", {
        ...e,
        custom: {
          type,
          minValue: this.showMinNum < this.fillMinValue ? this.fillMinValue : this.showMinNum,
          maxValue: this.showMaxNum > this.fillValue ? this.fillValue : this.showMaxNum
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.lineLeft === 0 ? "1" : "0",
    b: common_vendor.t($props.fillMinValue),
    c: $data.showMinNum === $props.fillMinValue ? "#333" : "#999",
    d: common_vendor.t($props.fillValue),
    e: $data.showMaxNum === $props.fillValue ? "#333" : "#999",
    f: common_vendor.t($data.curValue),
    g: `${$data.tipLeft}px`,
    h: $data.tipShow ? "1" : "0",
    i: $data.maxLeft - $data.minLeft >= 0
  }, $data.maxLeft - $data.minLeft >= 0 ? {
    j: `${$data.minLeft + $data.touchWidth / 2}px`,
    k: `${Math.abs($data.maxLeft - $data.minLeft)}px`
  } : {
    l: `${$data.minLeft + $data.touchWidth / 2 - Math.abs($data.maxLeft - $data.minLeft)}px`,
    m: `${Math.abs($data.maxLeft - $data.minLeft)}px`
  }, {
    n: common_vendor.o(($event) => $options.touchstart($event, "min")),
    o: common_vendor.o(($event) => $options.touchmove($event, "min")),
    p: common_vendor.o(($event) => $options.touchend($event, "min")),
    q: `${$data.minLeft}px`,
    r: common_vendor.o(($event) => $options.touchstart($event, "max")),
    s: common_vendor.o(($event) => $options.touchmove($event, "max")),
    t: common_vendor.o(($event) => $options.touchend($event, "max")),
    v: `${$data.maxLeft}px`,
    w: $data.lineLeft !== 0 ? "1" : "0"
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-269803ce"]]);
wx.createComponent(Component);
