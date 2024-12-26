"use strict";
const common_vendor = require("../../common/vendor.js");
let db = common_vendor.Zs.database();
let dbCmd = db.command;
const searchLogDbName = "opendb-search-log";
const mallGoodsDbName = "jimoty-post";
const localSearchListKey = "__local_search_history";
const arrUnique = (arr) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const curIndex = arr.indexOf(arr[i]);
    const lastIndex = arr.lastIndexOf(arr[i]);
    curIndex != lastIndex && arr.splice(lastIndex, 1);
  }
  return arr;
};
function debounce(fn, interval, isFirstAutoRun) {
  var _self = fn;
  var timer = null;
  var first = true;
  if (isFirstAutoRun) {
    _self();
  }
  return function() {
    var args = arguments;
    var _me = this;
    if (first) {
      first = false;
      _self.apply(_me, args);
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      clearTimeout(timer);
      timer = null;
      _self.apply(_me, args);
    }, interval || 300);
  };
}
const _sfc_main = {
  data() {
    return {
      mallGoodsDbName,
      searchLogDbName,
      statusBarHeight: "0px",
      localSearchList: common_vendor.index.getStorageSync(localSearchListKey),
      localSearchListDel: false,
      netHotListIsHide: false,
      searchText: "",
      iconColor: "#999999",
      keyBoardPopup: false,
      hotWorld: "无聊的日子刷刷~",
      //	搜索热词，如果没有输入即回车，则搜索热词，但是不会加入搜索记录
      focus: true,
      //	是否自动聚焦
      speechEngine: "iFly",
      //	语音识别引擎 iFly 讯飞 baidu 百度
      commentData: [],
      //搜索结果
      Inoperation1: false,
      categeryData: [],
      categeryStr: "",
      categeryId: "",
      //类目条件
      userId: common_vendor.Zs.getCurrentUserInfo().uid,
      longitude: 113.03853,
      //搜索的基点
      latitude: 28.135795,
      searchLength: 1e4,
      //范围
      searchAddress: "",
      //搜索的基地址
      searchConditons: [],
      NoticeConditons: [],
      categoryArr: [],
      //相关的子类目
      ifTimer: null,
      ifOperate: false
    };
  },
  created() {
    this.searchLogDb = db.collection(this.searchLogDbName);
    this.mallGoodsDb = db.collection(this.mallGoodsDbName);
    this.searchText = getApp().globalData.searchText;
  },
  computed: {
    associativeShow() {
      return this.searchText && this.commentData.length > 0;
    }
  },
  onShow() {
    let historyCity = common_vendor.index.getStorageSync("HistoryCity");
    if (historyCity) {
      this.longitude = Number(historyCity.longitude);
      this.latitude = Number(historyCity.latitude);
      this.searchLength = Number(historyCity.length);
      this.searchAddress = historyCity.city;
      console.log(typeof this.longitude, this.latitude, "nnnnnnn");
    } else {
      common_vendor.index.showToast({
        title: "暂未设置地理位置，请去首页设置",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.switchTab({
          url: "/pages/home/home"
        });
      }, 500);
    }
  },
  onLoad() {
    this.handleNotice();
    common_vendor.index.$on("categerySearchData", (res) => {
      this.categeryData = res.categery;
      this.categeryId = res.id;
      this.categeryData.forEach((res2) => {
        this.categeryStr = this.categeryStr + res2;
      });
      this.getCatogoryData(this.categeryId);
    });
    common_vendor.index.$on("refashHome", (data) => {
      let index = this.commentData.findIndex((obj) => obj._id._value == data.post_id);
      common_vendor.nextTick$1(() => {
        if (this.commentData[index].isCollect) {
          this.commentData[index].isCollect = false;
        } else {
          this.commentData[index].isCollect = true;
        }
      });
    });
  },
  onUnload() {
    common_vendor.index.$off("categerySearchData");
    common_vendor.index.$off("refashHome");
  },
  methods: {
    handleNotice() {
      let localSearchNotice = common_vendor.index.getStorageSync("localSearchNotice");
      if (!localSearchNotice) {
        common_vendor.index.setStorageSync("localSearchNotice", []);
      } else {
        localSearchNotice = localSearchNotice.slice(0, 20);
        this.NoticeConditons = localSearchNotice;
      }
      if (this.NoticeConditons.length > 0) {
        this.NoticeConditons.forEach(async (item) => {
          const res = await db.collection("jimoty-category").doc(item.category_condition).field(
            "name"
          ).get({ getOne: true });
          item.name = res.result.data.name;
        });
      }
    },
    async getCatogoryData(categeryId) {
      await db.collection("jimoty-category").field("_id,name").get({
        getTree: {
          limitLevel: 2,
          startWith: `_id=="${categeryId}"`
        }
      }).then((res) => {
        if (res.result.data.length > 0) {
          this.categoryArr = this.getAllValues(res.result.data[0]);
        }
      });
    },
    getAllValues(tree) {
      try {
        let traverse = function(node) {
          values.push(node._id);
          if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
              traverse(node.children[i]);
            }
          }
        };
        let values = [];
        traverse(tree);
        return values;
      } catch (e) {
      }
    },
    // 打开类目
    openCategery() {
      common_vendor.index.navigateTo({
        url: `/pages/submit/datapage?index=1`
      });
    },
    // 将获得的最新最热的关键词传给hotword
    handleHot(res) {
      this.searchConditons = res;
    },
    clear(res) {
      console.log("res: ", res);
      this.searchText = "";
      this.commentData = [];
    },
    confirm(res) {
      if (this.ifOperate)
        return;
      this.ifOperate = true;
      if (this.searchText === "")
        res.value = this.hotWorld;
      if (this.categeryId != "") {
        console.log("保存通知", res.value);
        this.addSearchNotice(res.value);
      }
      this.search(res.value);
    },
    input(e) {
      if (this.ifOperate)
        return;
      this.ifOperate = false;
      if (this.ifTimer != null)
        return;
      if (this.searchText == "")
        return;
      console.log("watch");
      this.getCommentDate(e);
      setTimeout(() => {
        clearTimeout(this.ifTimer);
        this.ifTimer = null;
      }, 2e3);
    },
    localSearchListManage(word) {
      let list = common_vendor.index.getStorageSync(localSearchListKey);
      if (list.length) {
        this.localSearchList.unshift(word);
        arrUnique(this.localSearchList);
        if (this.localSearchList.length > 6) {
          this.localSearchList.pop();
        }
      } else {
        this.localSearchList = [word];
      }
      common_vendor.index.setStorageSync(localSearchListKey, this.localSearchList);
    },
    LocalSearchListClear() {
      common_vendor.index.showModal({
        content: "确认清空搜索历史吗",
        confirmText: "删除",
        confirmColor: "red",
        cancelColor: "#808080",
        success: (res) => {
          if (res.confirm) {
            this.localSearchListDel = false;
            this.localSearchList = [];
            common_vendor.index.removeStorageSync(localSearchListKey);
          }
        }
      });
    },
    LocalSearchlistItemClick(word, index) {
      if (this.localSearchListDel) {
        this.localSearchList.splice(index, 1);
        common_vendor.index.setStorageSync(localSearchListKey, this.localSearchList);
        if (!this.localSearchList.length) {
          this.localSearchListDel = false;
        }
        return;
      }
      if (word) {
        if (this.searchText !== word) {
          this.searchText = word;
        }
        this.localSearchListManage(word);
        this.searchLogDbAdd(word);
      }
    },
    cancel(res) {
    },
    search(value) {
      if (!value && !this.hotWorld) {
        return;
      }
      if (value) {
        if (this.searchText !== value) {
          this.searchText = value;
        }
        this.localSearchListManage(value);
        this.searchLogDbAdd(value);
      } else if (this.hotWorld) {
        this.searchText = this.hotWorld;
      }
      this.getCommentDate(value);
      common_vendor.index.hideKeyboard();
    },
    searchHotRefresh() {
      this.$refs.udb.refresh();
      this.$refs.udbNotice.refresh();
    },
    speech() {
    },
    setNotice(data) {
      console.log(data);
      common_vendor.index.showModal({
        content: "是否添加为设置保留的通知",
        success: async function(res) {
          if (res.confirm) {
            const count = await db.collection("jimoty-search").where({
              userId: this.userId,
              category_condition: data.category_condition,
              text_condition: data.text_condition,
              positon_condition: {
                address: data.positon_condition.address,
                point: [
                  data.positon_condition.longitude,
                  data.positon_condition.latitude
                ],
                length: data.positon_condition.length
              }
            }).count();
            if (count.result.total == 0) {
              db.collection("jimoty-search").add({
                positon_condition: {
                  address: data.positon_condition.address,
                  point: [
                    data.positon_condition.longitude,
                    data.positon_condition.latitude
                  ],
                  length: data.positon_condition.length
                },
                category_condition: data.category_condition,
                text_condition: data.text_condition
              });
              common_vendor.index.showToast({
                title: "添加成功",
                icon: "none"
              });
            } else {
              common_vendor.index.showToast({
                title: "已添加",
                icon: "error"
              });
            }
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    // 获取数据
    async getCommentDate(text) {
      this.commentData = [];
      console.log("搜索关键字：", text);
      common_vendor.index.showLoading({
        title: "加载中"
      });
      try {
        let postArr;
        if (this.categoryArr.length > 0) {
          postArr = await db.collection("jimoty-post").where({
            category: dbCmd.in(this.categoryArr),
            point: dbCmd.geoNear({
              geometry: new db.Geo.Point(this.longitude, this.latitude),
              maxDistance: this.searchLength,
              minDistance: 0
            })
          }).field("_id").get();
          postArr = postArr.result.data.map((item) => {
            return item._id;
          });
        } else {
          postArr = await db.collection("jimoty-post").where({
            point: dbCmd.geoNear({
              geometry: new db.Geo.Point(this.longitude, this.latitude),
              maxDistance: this.searchLength,
              minDistance: 0
            })
          }).field("_id").get();
          postArr = postArr.result.data.map((item) => {
            return item._id;
          });
        }
        const temp1 = db.collection("jimoty-post").where({
          _id: dbCmd.in(postArr),
          delete: 1,
          status: dbCmd.in([2, 5])
        }).getTemp();
        const temp2 = db.collection("uni-id-users").field("_id,nickname,avatar_file.url").getTemp();
        const temp3 = db.collection("jimoty-collect").field("_id,post_id,user_id,clickTime").getTemp();
        const temp4 = db.collection("jimoty-category").field("_id,name,parent_id").getTemp();
        db.collection(temp1, temp2, temp3, temp4).where({
          noteTitle: new RegExp(text, "g")
        }).orderBy(
          "weight desc,browse desc,create_date desc"
        ).skip(this.commentData.length).limit(15).get().then(async (res) => {
          let arr1 = await this.handleSuccess(res.result.data);
          this.commentData = [...this.commentData, ...Array.from(arr1)];
          if (this.commentData.length < 1) {
            common_vendor.index.showToast({
              title: "没有搜索到结果",
              icon: "none"
            });
          }
          common_vendor.index.hideLoading();
          this.ifOperate = false;
        });
      } catch (e) {
        common_vendor.index.showToast({
          title: "搜索失败",
          icon: "none"
        });
        console.log(e);
        common_vendor.index.hideLoading();
        this.ifOperate = false;
      }
    },
    async addSearchNotice(text) {
      let bool = true;
      let position = {
        address: this.searchAddress,
        point: [this.longitude, this.latitude],
        length: this.searchLength
      };
      const localSearchNotice = common_vendor.index.getStorageSync("localSearchNotice");
      if (localSearchNotice) {
        localSearchNotice.forEach((item) => {
          if (item.text_condition == text && item.category_condition == this.categeryId && item.positon_condition.address == this.searchAddress && item.positon_condition.length == this.searchLength && item.positon_condition.point[0] == this.longitude && item.positon_condition.point[1] == this.latitude) {
            bool = false;
          }
        });
        console.log("boollll", bool);
        if (bool) {
          localSearchNotice.push({
            text_condition: text,
            category_condition: this.categeryId,
            positon_condition: position
          });
          this.$nextTick(() => {
            common_vendor.index.setStorageSync("localSearchNotice", localSearchNotice);
            this.handleNotice();
          });
        }
      } else {
        console.log("localSearchNotice不存在");
      }
    },
    noticeSearch() {
    },
    getDeviceId() {
      return new Promise((resolve, reject) => {
        const uniId = common_vendor.index.getStorageSync("uni_id");
        if (!uniId) {
          resolve(common_vendor.index.getSystemInfoSync().system + "_" + Math.random().toString(36).substr(2));
        } else {
          resolve(uniId);
        }
      });
    },
    searchLogDbAdd(value) {
      this.getDeviceId().then((device_id) => {
        this.searchLogDb.add({
          // user_id: device_id,
          device_id,
          content: value,
          create_date: Date.now()
        });
      });
    },
    // 数据处理
    async handleSuccess(arr) {
      let collectArr = arr.map((item) => {
        return item._id._value;
      });
      let likeArr = await db.collection("jimoty-collect").where({
        post_id: dbCmd.in(collectArr),
        user_id: common_vendor.Zs.getCurrentUserInfo().uid
      }).get();
      arr.forEach((item, index) => {
        let localIndex = likeArr.result.data.findIndex((find) => {
          return item._id._value == find.post_id;
        });
        if (localIndex !== -1) {
          item.isCollect = true;
        }
      });
      return arr;
    }
  },
  watch: {
    searchText: debounce(function(value) {
      if (value) {
        if (this.ifOperate)
          return;
        this.ifOperate = true;
        if (this.ifTimer != null)
          return;
        if (this.searchText == "")
          return;
        console.log("watch");
        this.getCommentDate(value);
      } else {
        this.commentData.length = 0;
        getApp().globalData.searchText = "";
      }
    }, 200)
  }
};
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_homeGoods2 = common_vendor.resolveComponent("homeGoods");
  (_easycom_uni_search_bar2 + _easycom_uni_icons2 + _easycom_homeGoods2)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_homeGoods = () => "../../components/homeGoods/homeGoods.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_icons + _easycom_homeGoods)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sr("searchBar", "c10c040c-0"),
    b: common_vendor.o($options.clear),
    c: common_vendor.o($options.confirm),
    d: common_vendor.o(($event) => $data.searchText = $event),
    e: common_vendor.p({
      radius: "100",
      focus: $data.focus,
      placeholder: $data.hotWorld,
      clearButton: "auto",
      cancelButton: "always",
      cancelText: $data.keyBoardPopup ? "取消" : "搜索",
      modelValue: $data.searchText
    }),
    f: $data.categeryData.length > 0
  }, $data.categeryData.length > 0 ? {
    g: common_vendor.f($data.categeryData, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    })
  } : {}, {
    h: common_vendor.p({
      type: "right",
      size: "22"
    }),
    i: common_vendor.o((...args) => $options.openCategery && $options.openCategery(...args)),
    j: !$options.associativeShow
  }, !$options.associativeShow ? common_vendor.e({
    k: $data.localSearchList.length
  }, $data.localSearchList.length ? common_vendor.e({
    l: !$data.localSearchListDel
  }, !$data.localSearchListDel ? {
    m: common_vendor.o(($event) => $data.localSearchListDel = true),
    n: common_vendor.p({
      color: $data.iconColor,
      size: "18",
      type: "trash"
    })
  } : {
    o: common_vendor.o((...args) => $options.LocalSearchListClear && $options.LocalSearchListClear(...args)),
    p: common_vendor.o(($event) => $data.localSearchListDel = false)
  }, {
    q: common_vendor.f($data.localSearchList, (word, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(word),
        b: word
      }, $data.localSearchListDel ? {
        c: "c10c040c-3-" + i0,
        d: common_vendor.p({
          size: "12",
          type: "closeempty"
        })
      } : {}, {
        e: index,
        f: common_vendor.o(($event) => $options.LocalSearchlistItemClick(word, index), index)
      });
    }),
    r: $data.localSearchListDel
  }) : {}, {
    s: common_vendor.f($data.NoticeConditons, (item, index, i0) => {
      return {
        a: common_vendor.t(item.text_condition),
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.positon_condition.address),
        d: common_vendor.t(item.positon_condition.length / 1e3),
        e: "c10c040c-4-" + i0,
        f: common_vendor.o(($event) => $options.setNotice(item), index),
        g: index
      };
    }),
    t: common_vendor.p({
      type: "more-filled",
      size: "24",
      color: "rgb(159, 159, 159)"
    })
  }) : {
    v: common_vendor.p({
      data: $data.commentData
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c10c040c"]]);
wx.createPage(MiniProgramPage);
