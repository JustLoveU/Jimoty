"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_uniIdUsers = require("../../../js_sdk/validator/uni-id-users.js");
const db = common_vendor.Vs.database();
const dbOrderBy = "last_login_date desc";
const dbSearchFields = ["username", "role.role_name", "mobile", "email"];
const pageSize = 20;
const pageCurrent = 1;
const orderByMapping = {
  "ascending": "asc",
  "descending": "desc"
};
const _sfc_main = {
  data() {
    return {
      collectionList: [db.collection("uni-id-users").field("ali_openid,apple_openid,avatar,avatar_file,comment,dcloud_appid,department_id,email,email_confirmed,gender,invite_time,inviter_uid,last_login_date,last_login_ip,mobile,mobile_confirmed,my_invite_code,nickname,role,score,status,username,wx_unionid,qq_unionid,tags").getTemp(), db.collection("uni-id-roles").field("role_id, role_name").getTemp()],
      query: "",
      where: "",
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      pageSizeIndex: 0,
      pageSizeOption: [20, 50, 100, 500],
      tags: {},
      managerTags: [],
      queryTagid: "",
      queryUserId: "",
      options: {
        pageSize,
        pageCurrent,
        filterData: {
          "status_localdata": [
            {
              "text": "正常",
              "value": 0,
              "checked": true
            },
            {
              "text": "禁用",
              "value": 1
            },
            {
              "text": "审核中",
              "value": 2
            },
            {
              "text": "审核拒绝",
              "value": 3
            }
          ]
        },
        ...js_sdk_validator_uniIdUsers.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "uni-id-users.xls",
        "type": "xls",
        "fields": {
          "用户名": "username",
          "手机号码": "mobile",
          "用户状态": "status",
          "邮箱": "email",
          "角色": "role",
          "last_login_date": "last_login_date"
        }
      },
      exportExcelData: [],
      noAppidWhatShouldIDoLink: "https://uniapp.dcloud.net.cn/uniCloud/uni-id?id=makeup-dcloud-appid",
      smsCondition: {}
    };
  },
  onLoad(e) {
    this._filter = {};
    const tagid = e.tagid;
    const userId = e.id;
    if (tagid) {
      this.queryTagid = tagid;
      const options = {
        filterType: "select",
        filter: [tagid]
      };
      this.filterChange(options, "tags");
    }
    if (userId) {
      this.queryUserId = userId;
      const options = {
        filterType: "select",
        filter: [userId]
      };
      this.filterChange(options, "_id");
    }
  },
  onReady() {
    this.loadTags();
    if (!this.queryTagid && !this.queryUserId) {
      this.$refs.udb.loadData();
    }
  },
  computed: {
    tagsData() {
      const dynamic_data = [];
      for (const key in this.tags) {
        const tag = {
          value: key,
          text: this.tags[key]
        };
        if (key === this.queryTagid) {
          tag.checked = true;
        }
        dynamic_data.push(tag);
      }
      return dynamic_data;
    },
    smsReceiver() {
      if (this.selectedIndexs.length) {
        let dataList = this.$refs.udb.dataList;
        return this.selectedIndexs.map((i) => dataList[i]._id);
      } else {
        return void 0;
      }
    }
  },
  methods: {
    onqueryload(data) {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        const roleArr = item.role.map((item2) => item2.role_name);
        item.role = roleArr.join("、");
        const tagsArr = item.tags && item.tags.map((item2) => this.tags[item2]);
        item.tags = tagsArr;
        if (Array.isArray(item.dcloud_appid)) {
          item.dcloud_appid = item.dcloud_appid.join("、");
        }
        item.last_login_date = this.$formatDate(item.last_login_date);
      }
      this.exportExcelData = data;
    },
    changeSize(pageSize2) {
      this.options.pageSize = pageSize2;
      this.options.pageCurrent = 1;
      this.$nextTick(() => {
        this.loadData();
      });
    },
    openTagsPopup() {
      this.$refs.tagsPopup.open();
    },
    closeTagsPopup() {
      this.$refs.tagsPopup.close();
    },
    getWhere() {
      const query = this.query.trim();
      if (!query) {
        return "";
      }
      const queryRe = new RegExp(query, "i");
      console.log(
        JSON.stringify(
          db.command.or(
            dbSearchFields.map((name) => {
              return {
                [name]: queryRe
              };
            })
          )
        )
      );
      return db.command.or(
        dbSearchFields.map((name) => {
          return {
            [name]: queryRe
          };
        })
      );
    },
    search() {
      const newWhere = this.getWhere();
      this.where = newWhere;
      this.$nextTick(() => {
        this.loadData();
      });
    },
    loadData(clear = true) {
      this.$refs.udb.loadData({
        clear
      });
    },
    onPageChanged(e) {
      this.selectedIndexs.length = 0;
      this.$refs.table.clearSelection();
      this.$refs.udb.loadData({
        current: e.current
      });
    },
    navigateTo(url, clear) {
      common_vendor.index.navigateTo({
        url,
        events: {
          refreshData: () => {
            this.loadTags();
            this.loadData(clear);
          }
        }
      });
    },
    // 多选处理
    selectedItems() {
      let dataList = this.$refs.udb.dataList;
      return this.selectedIndexs.map((i) => dataList[i]._id);
    },
    // 批量删除
    delTable() {
      this.$refs.udb.remove(this.selectedItems(), {
        success: (res) => {
          this.$refs.table.clearSelection();
        }
      });
    },
    // 多选
    selectionChange(e) {
      this.selectedIndexs = e.detail.index;
    },
    confirmDelete(id) {
      this.$refs.udb.remove(id, {
        success: (res) => {
          this.$refs.table.clearSelection();
        }
      });
    },
    sortChange(e, name) {
      this.orderByFieldName = name;
      if (e.order) {
        this.orderby = name + " " + orderByMapping[e.order];
      } else {
        this.orderby = "";
      }
      this.$refs.table.clearSelection();
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    },
    filterChange(e, name) {
      this._filter[name] = {
        type: e.filterType,
        value: e.filter
      };
      let newWhere = js_sdk_validator_uniIdUsers.filterToWhere(this._filter, db.command);
      if (Object.keys(newWhere).length) {
        this.where = newWhere;
      } else {
        this.where = "";
      }
      if (Object.keys(this._filter).length) {
        this.smsCondition = this._filter;
      } else {
        this.smsCondition = {};
      }
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    },
    loadTags() {
      db.collection("uni-id-tag").limit(500).get().then((res) => {
        res.result.data.map((item) => {
          this.$set(this.tags, item.tagid, item.name);
        });
      }).catch((err) => {
        common_vendor.index.showModal({
          title: "提示",
          content: err.message,
          showCancel: false
        });
      });
    },
    managerMultiTag() {
      const ids = this.selectedItems();
      db.collection("uni-id-users").where({
        _id: db.command.in(ids)
      }).update({
        tags: this.managerTags
      }).then(() => {
        common_vendor.index.showToast({
          title: "修改标签成功",
          duration: 2e3
        });
        this.$refs.table.clearSelection();
        this.managerTags = [];
        this.loadData();
        this.closeTagsPopup();
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "请求服务失败",
          showCancel: false
        });
      }).finally((err) => {
        common_vendor.index.hideLoading();
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_link2 = common_vendor.resolveComponent("uni-link");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_link2 + _easycom_uni_tag2 + _easycom_uni_dateformat2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_unicloud_db2 + _easycom_fix_window2 + _easycom_uni_data_checkbox2 + _easycom_uni_popup2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_link = () => "../../../uni_modules/uni-link/components/uni-link/uni-link.js";
const _easycom_uni_tag = () => "../../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_unicloud_db = () => "../../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
const _easycom_fix_window = () => "../../../components/fix-window/fix-window.js";
const _easycom_uni_data_checkbox = () => "../../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_link + _easycom_uni_tag + _easycom_uni_dateformat + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db + _easycom_fix_window + _easycom_uni_data_checkbox + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: _ctx.$t("common.placeholder.query"),
    c: $data.query,
    d: common_vendor.o(($event) => $data.query = $event.detail.value),
    e: common_vendor.t(_ctx.$t("common.button.search")),
    f: common_vendor.o((...args) => $options.search && $options.search(...args)),
    g: common_vendor.t(_ctx.$t("common.button.add")),
    h: common_vendor.o(($event) => $options.navigateTo("./add")),
    i: common_vendor.t(_ctx.$t("common.button.batchDelete")),
    j: !$data.selectedIndexs.length,
    k: common_vendor.o((...args) => $options.delTable && $options.delTable(...args)),
    l: common_vendor.t(_ctx.$t("common.button.tagManager")),
    m: !$data.selectedIndexs.length,
    n: common_vendor.o((...args) => $options.openTagsPopup && $options.openTagsPopup(...args)),
    o: common_vendor.w(({
      data,
      pagination,
      loading,
      error,
      options
    }, s0, i0) => {
      return {
        a: "c95ecd2c-4-" + i0 + "," + ("c95ecd2c-3-" + i0),
        b: "c95ecd2c-5-" + i0 + "," + ("c95ecd2c-3-" + i0),
        c: "c95ecd2c-6-" + i0 + "," + ("c95ecd2c-3-" + i0),
        d: "c95ecd2c-7-" + i0 + "," + ("c95ecd2c-3-" + i0),
        e: common_vendor.p({
          align: "center",
          ["filter-type"]: "select",
          ["filter-data"]: options.filterData.status_localdata
        }),
        f: "c95ecd2c-8-" + i0 + "," + ("c95ecd2c-3-" + i0),
        g: "c95ecd2c-9-" + i0 + "," + ("c95ecd2c-3-" + i0),
        h: "c95ecd2c-10-" + i0 + "," + ("c95ecd2c-3-" + i0),
        i: "c95ecd2c-11-" + i0 + "," + ("c95ecd2c-3-" + i0),
        j: "c95ecd2c-12-" + i0 + "," + ("c95ecd2c-3-" + i0),
        k: "c95ecd2c-13-" + i0 + "," + ("c95ecd2c-3-" + i0),
        l: "c95ecd2c-3-" + i0 + "," + ("c95ecd2c-2-" + i0),
        m: common_vendor.f(data, (item, index, i1) => {
          return common_vendor.e({
            a: common_vendor.t(item.username),
            b: "c95ecd2c-15-" + i0 + "-" + i1 + "," + ("c95ecd2c-14-" + i0 + "-" + i1),
            c: common_vendor.t(item.nickname),
            d: "c95ecd2c-16-" + i0 + "-" + i1 + "," + ("c95ecd2c-14-" + i0 + "-" + i1),
            e: common_vendor.t(item.mobile),
            f: "c95ecd2c-17-" + i0 + "-" + i1 + "," + ("c95ecd2c-14-" + i0 + "-" + i1),
            g: common_vendor.t(options.status_valuetotext[item.status]),
            h: "c95ecd2c-18-" + i0 + "-" + i1 + "," + ("c95ecd2c-14-" + i0 + "-" + i1),
            i: "c95ecd2c-20-" + i0 + "-" + i1 + "," + ("c95ecd2c-19-" + i0 + "-" + i1),
            j: common_vendor.p({
              href: "mailto:" + item.email,
              text: item.email
            }),
            k: "c95ecd2c-19-" + i0 + "-" + i1 + "," + ("c95ecd2c-14-" + i0 + "-" + i1),
            l: common_vendor.t(item.role),
            m: "c95ecd2c-21-" + i0 + "-" + i1 + "," + ("c95ecd2c-14-" + i0 + "-" + i1),
            n: common_vendor.f(item.tags, (tag, tagIndex, i2) => {
              return common_vendor.e(item.tags ? {
                a: "c95ecd2c-23-" + i0 + "-" + i1 + "-" + i2 + "," + ("c95ecd2c-22-" + i0 + "-" + i1),
                b: common_vendor.p({
                  type: "primary",
                  inverted: true,
                  size: "small",
                  text: tag
                })
              } : {}, {
                c: tagIndex
              });
            }),
            o: item.tags,
            p: "c95ecd2c-22-" + i0 + "-" + i1 + "," + ("c95ecd2c-14-" + i0 + "-" + i1),
            q: item.dcloud_appid === void 0
          }, item.dcloud_appid === void 0 ? {
            r: "c95ecd2c-25-" + i0 + "-" + i1 + "," + ("c95ecd2c-24-" + i0 + "-" + i1),
            s: common_vendor.p({
              href: $data.noAppidWhatShouldIDoLink
            })
          } : {}, {
            t: common_vendor.t(item.dcloud_appid),
            v: "c95ecd2c-24-" + i0 + "-" + i1 + "," + ("c95ecd2c-14-" + i0 + "-" + i1),
            w: "c95ecd2c-27-" + i0 + "-" + i1 + "," + ("c95ecd2c-26-" + i0 + "-" + i1),
            x: common_vendor.p({
              threshold: [0, 0],
              date: item.last_login_date
            }),
            y: "c95ecd2c-26-" + i0 + "-" + i1 + "," + ("c95ecd2c-14-" + i0 + "-" + i1),
            z: common_vendor.o(($event) => $options.navigateTo("./edit?id=" + item._id, false), index),
            A: common_vendor.o(($event) => $options.confirmDelete(item._id), index),
            B: "c95ecd2c-28-" + i0 + "-" + i1 + "," + ("c95ecd2c-14-" + i0 + "-" + i1),
            C: index,
            D: "c95ecd2c-14-" + i0 + "-" + i1 + "," + ("c95ecd2c-2-" + i0)
          });
        }),
        n: common_vendor.sr("table", "c95ecd2c-2-" + i0 + ",c95ecd2c-1"),
        o: "c95ecd2c-2-" + i0 + ",c95ecd2c-1",
        p: common_vendor.p({
          loading,
          emptyText: error.message || _ctx.$t("common.empty"),
          border: true,
          stripe: true,
          type: "selection"
        }),
        q: "c95ecd2c-29-" + i0 + ",c95ecd2c-1",
        r: common_vendor.o(($event) => pagination.current = $event),
        s: common_vendor.p({
          ["show-iconn"]: true,
          ["show-page-size"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        t: i0,
        v: s0
      };
    }, {
      name: "d",
      path: "o",
      vueId: "c95ecd2c-1"
    }),
    p: common_vendor.o(($event) => $options.filterChange($event, "username")),
    q: common_vendor.o(($event) => $options.sortChange($event, "username")),
    r: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    s: common_vendor.o(($event) => $options.filterChange($event, "nickname")),
    t: common_vendor.o(($event) => $options.sortChange($event, "nickname")),
    v: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    w: common_vendor.o(($event) => $options.filterChange($event, "mobile")),
    x: common_vendor.o(($event) => $options.sortChange($event, "mobile")),
    y: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    z: common_vendor.o(($event) => $options.filterChange($event, "status")),
    A: common_vendor.o(($event) => $options.filterChange($event, "email")),
    B: common_vendor.o(($event) => $options.sortChange($event, "email")),
    C: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    D: common_vendor.p({
      align: "center"
    }),
    E: common_vendor.o(($event) => $options.filterChange($event, "tags")),
    F: common_vendor.p({
      align: "center",
      ["filter-type"]: "select",
      ["filter-data"]: $options.tagsData
    }),
    G: common_vendor.p({
      align: "center"
    }),
    H: common_vendor.o(($event) => $options.filterChange($event, "last_login_date")),
    I: common_vendor.o(($event) => $options.sortChange($event, "last_login_date")),
    J: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    K: common_vendor.p({
      align: "center"
    }),
    L: common_vendor.p({
      align: "center"
    }),
    M: common_vendor.p({
      align: "center"
    }),
    N: common_vendor.p({
      align: "center"
    }),
    O: common_vendor.p({
      align: "center"
    }),
    P: common_vendor.p({
      align: "center"
    }),
    Q: common_vendor.p({
      align: "center"
    }),
    R: common_vendor.p({
      align: "center"
    }),
    S: common_vendor.p({
      align: "center"
    }),
    T: common_vendor.p({
      align: "center"
    }),
    U: common_vendor.t(_ctx.$t("common.button.edit")),
    V: common_vendor.t(_ctx.$t("common.button.delete")),
    W: common_vendor.p({
      align: "center"
    }),
    X: common_vendor.o($options.selectionChange),
    Y: common_vendor.o($options.onPageChanged),
    Z: common_vendor.o($options.changeSize),
    aa: common_vendor.sr("udb", "c95ecd2c-1"),
    ab: common_vendor.o($options.onqueryload),
    ac: common_vendor.p({
      collection: $data.collectionList,
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent,
      options: $data.options,
      loadtime: "manual"
    }),
    ad: common_vendor.sr("checkbox", "c95ecd2c-32,c95ecd2c-31"),
    ae: common_vendor.o(($event) => $data.managerTags = $event),
    af: common_vendor.p({
      multiple: true,
      collection: "uni-id-tag",
      field: "tagid as value, name as text",
      modelValue: $data.managerTags
    }),
    ag: common_vendor.o((...args) => $options.managerMultiTag && $options.managerMultiTag(...args)),
    ah: common_vendor.sr("tagsPopup", "c95ecd2c-31"),
    ai: common_vendor.p({
      type: "center"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
