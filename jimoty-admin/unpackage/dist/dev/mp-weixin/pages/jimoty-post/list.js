"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_validator_jimotyPost = require("../../js_sdk/validator/jimoty-post.js");
const db = common_vendor.Vs.database();
const dbOrderBy = "";
const dbSearchFields = [];
const pageSize = 20;
const pageCurrent = 1;
const orderByMapping = {
  "ascending": "asc",
  "descending": "desc"
};
const _sfc_main = {
  data() {
    return {
      collectionList: "jimoty-post",
      query: "",
      where: "",
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      options: {
        pageSize,
        pageCurrent,
        filterData: {},
        ...js_sdk_validator_jimotyPost.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "jimoty-post.xls",
        "type": "xls",
        "fields": {
          "发布者": "userId",
          "类目": "type",
          "类别": "category",
          "图片": "photos",
          "地理位置": "location",
          "招募年龄": "recruitAge",
          "标题": "noteTitle",
          "正文": "mainText",
          "公司名": "companyName",
          "工资形式": "payrollForm",
          "薪资": "salary",
          "工资补充": "salarySupplement",
          "交通": "traffic",
          "工作时间": "workTime",
          "工作地点": "workPosition",
          "电话": "phone",
          "雇佣形式": "employeeForm",
          "性别": "sex",
          "年龄": "age",
          "绝育手术": "sterOperation",
          "疫苗接种": "vaccinelnoculation",
          "投稿理由": "releaseReason",
          "支付方式": "payMethod",
          "商品价格": "postPrice",
          "帖子状态": "status",
          "逻辑删除": "delete",
          "浏览数": "browse",
          "权重": "weight",
          "收藏数": "collect",
          "高亮": "hightLight",
          "create_date": "create_date",
          "update_date": "update_date"
        }
      },
      exportExcelData: []
    };
  },
  onLoad() {
    this._filter = {};
  },
  onReady() {
    this.$refs.udb.loadData();
  },
  methods: {
    onqueryload(data) {
      this.exportExcelData = data;
    },
    getWhere() {
      const query = this.query.trim();
      if (!query) {
        return "";
      }
      const queryRe = new RegExp(query, "i");
      return dbSearchFields.map((name) => queryRe + ".test(" + name + ")").join(" || ");
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
            this.loadData(clear);
          }
        }
      });
    },
    // 多选处理
    selectedItems() {
      var dataList = this.$refs.udb.dataList;
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
      let newWhere = js_sdk_validator_jimotyPost.filterToWhere(this._filter, db.command);
      if (Object.keys(newWhere).length) {
        this.where = newWhere;
      } else {
        this.where = "";
      }
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    }
  }
};
if (!Array) {
  const _easycom_download_excel2 = common_vendor.resolveComponent("download-excel");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  (_easycom_download_excel2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_dateformat2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_unicloud_db2)();
}
const _easycom_download_excel = () => "../../components/download-excel/download-excel.js";
const _easycom_uni_th = () => "../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_unicloud_db = () => "../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
if (!Math) {
  (_easycom_download_excel + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_dateformat + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: $data.query,
    c: common_vendor.o(($event) => $data.query = $event.detail.value),
    d: common_vendor.o((...args) => $options.search && $options.search(...args)),
    e: common_vendor.o(($event) => $options.navigateTo("./add")),
    f: !$data.selectedIndexs.length,
    g: common_vendor.o((...args) => $options.delTable && $options.delTable(...args)),
    h: common_vendor.p({
      fields: $data.exportExcel.fields,
      data: $data.exportExcelData,
      type: $data.exportExcel.type,
      name: $data.exportExcel.filename
    }),
    i: common_vendor.w(({
      data,
      pagination,
      loading,
      error,
      options
    }, s0, i0) => {
      return {
        a: "5d15abee-4-" + i0 + "," + ("5d15abee-3-" + i0),
        b: "5d15abee-5-" + i0 + "," + ("5d15abee-3-" + i0),
        c: "5d15abee-6-" + i0 + "," + ("5d15abee-3-" + i0),
        d: "5d15abee-7-" + i0 + "," + ("5d15abee-3-" + i0),
        e: "5d15abee-8-" + i0 + "," + ("5d15abee-3-" + i0),
        f: "5d15abee-9-" + i0 + "," + ("5d15abee-3-" + i0),
        g: "5d15abee-10-" + i0 + "," + ("5d15abee-3-" + i0),
        h: "5d15abee-11-" + i0 + "," + ("5d15abee-3-" + i0),
        i: "5d15abee-12-" + i0 + "," + ("5d15abee-3-" + i0),
        j: "5d15abee-13-" + i0 + "," + ("5d15abee-3-" + i0),
        k: "5d15abee-14-" + i0 + "," + ("5d15abee-3-" + i0),
        l: "5d15abee-15-" + i0 + "," + ("5d15abee-3-" + i0),
        m: "5d15abee-16-" + i0 + "," + ("5d15abee-3-" + i0),
        n: "5d15abee-17-" + i0 + "," + ("5d15abee-3-" + i0),
        o: "5d15abee-18-" + i0 + "," + ("5d15abee-3-" + i0),
        p: "5d15abee-19-" + i0 + "," + ("5d15abee-3-" + i0),
        q: "5d15abee-20-" + i0 + "," + ("5d15abee-3-" + i0),
        r: "5d15abee-21-" + i0 + "," + ("5d15abee-3-" + i0),
        s: "5d15abee-22-" + i0 + "," + ("5d15abee-3-" + i0),
        t: "5d15abee-23-" + i0 + "," + ("5d15abee-3-" + i0),
        v: "5d15abee-24-" + i0 + "," + ("5d15abee-3-" + i0),
        w: "5d15abee-25-" + i0 + "," + ("5d15abee-3-" + i0),
        x: "5d15abee-26-" + i0 + "," + ("5d15abee-3-" + i0),
        y: "5d15abee-27-" + i0 + "," + ("5d15abee-3-" + i0),
        z: "5d15abee-28-" + i0 + "," + ("5d15abee-3-" + i0),
        A: "5d15abee-29-" + i0 + "," + ("5d15abee-3-" + i0),
        B: "5d15abee-30-" + i0 + "," + ("5d15abee-3-" + i0),
        C: "5d15abee-31-" + i0 + "," + ("5d15abee-3-" + i0),
        D: "5d15abee-32-" + i0 + "," + ("5d15abee-3-" + i0),
        E: "5d15abee-33-" + i0 + "," + ("5d15abee-3-" + i0),
        F: "5d15abee-34-" + i0 + "," + ("5d15abee-3-" + i0),
        G: "5d15abee-35-" + i0 + "," + ("5d15abee-3-" + i0),
        H: "5d15abee-36-" + i0 + "," + ("5d15abee-3-" + i0),
        I: "5d15abee-37-" + i0 + "," + ("5d15abee-3-" + i0),
        J: "5d15abee-3-" + i0 + "," + ("5d15abee-2-" + i0),
        K: common_vendor.f(data, (item, index, i1) => {
          return {
            a: common_vendor.t(item.userId),
            b: "5d15abee-39-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            c: common_vendor.t(item.type),
            d: "5d15abee-40-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            e: common_vendor.t(item.category),
            f: "5d15abee-41-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            g: common_vendor.t(item.photos),
            h: "5d15abee-42-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            i: common_vendor.t(item.point),
            j: "5d15abee-43-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            k: common_vendor.t(item.recruitAge),
            l: "5d15abee-44-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            m: common_vendor.t(item.noteTitle),
            n: "5d15abee-45-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            o: common_vendor.t(item.mainText),
            p: "5d15abee-46-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            q: common_vendor.t(item.companyName),
            r: "5d15abee-47-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            s: common_vendor.t(item.payrollForm),
            t: "5d15abee-48-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            v: common_vendor.t(item.salary),
            w: "5d15abee-49-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            x: common_vendor.t(item.salarySupplement),
            y: "5d15abee-50-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            z: common_vendor.t(item.traffic),
            A: "5d15abee-51-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            B: common_vendor.t(item.workTime),
            C: "5d15abee-52-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            D: common_vendor.t(item.workPosition),
            E: "5d15abee-53-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            F: common_vendor.t(item.phone),
            G: "5d15abee-54-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            H: common_vendor.t(item.employeeForm),
            I: "5d15abee-55-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            J: common_vendor.t(item.sex),
            K: "5d15abee-56-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            L: common_vendor.t(item.age),
            M: "5d15abee-57-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            N: common_vendor.t(item.sterOperation),
            O: "5d15abee-58-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            P: common_vendor.t(item.vaccinelnoculation),
            Q: "5d15abee-59-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            R: common_vendor.t(item.releaseReason),
            S: "5d15abee-60-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            T: common_vendor.t(item.payMethod),
            U: "5d15abee-61-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            V: common_vendor.t(item.postPrice),
            W: "5d15abee-62-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            X: common_vendor.t(item.status),
            Y: "5d15abee-63-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            Z: common_vendor.t(item.delete == true ? "✅" : "❌"),
            aa: "5d15abee-64-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            ab: common_vendor.t(item.browse),
            ac: "5d15abee-65-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            ad: common_vendor.t(item.weight),
            ae: "5d15abee-66-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            af: common_vendor.t(item.collect),
            ag: "5d15abee-67-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            ah: common_vendor.t(item.hightLight == true ? "✅" : "❌"),
            ai: "5d15abee-68-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            aj: common_vendor.t(item.location),
            ak: "5d15abee-69-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            al: "5d15abee-71-" + i0 + "-" + i1 + "," + ("5d15abee-70-" + i0 + "-" + i1),
            am: common_vendor.p({
              threshold: [0, 0],
              date: item.create_date
            }),
            an: "5d15abee-70-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            ao: "5d15abee-73-" + i0 + "-" + i1 + "," + ("5d15abee-72-" + i0 + "-" + i1),
            ap: common_vendor.p({
              threshold: [0, 0],
              date: item.update_date
            }),
            aq: "5d15abee-72-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            ar: common_vendor.o(($event) => $options.navigateTo("./edit?id=" + item._id, false), index),
            as: common_vendor.o(($event) => $options.confirmDelete(item._id), index),
            at: "5d15abee-74-" + i0 + "-" + i1 + "," + ("5d15abee-38-" + i0 + "-" + i1),
            av: index,
            aw: "5d15abee-38-" + i0 + "-" + i1 + "," + ("5d15abee-2-" + i0)
          };
        }),
        L: common_vendor.sr("table", "5d15abee-2-" + i0 + ",5d15abee-1"),
        M: "5d15abee-2-" + i0 + ",5d15abee-1",
        N: common_vendor.p({
          loading,
          emptyText: error.message || "没有更多数据",
          border: true,
          stripe: true,
          type: "selection"
        }),
        O: "5d15abee-75-" + i0 + ",5d15abee-1",
        P: common_vendor.o(($event) => pagination.current = $event),
        Q: common_vendor.p({
          ["show-icon"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        R: i0,
        S: s0
      };
    }, {
      name: "d",
      path: "i",
      vueId: "5d15abee-1"
    }),
    j: common_vendor.o(($event) => $options.sortChange($event, "userId")),
    k: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    l: common_vendor.o(($event) => $options.filterChange($event, "type")),
    m: common_vendor.o(($event) => $options.sortChange($event, "type")),
    n: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    o: common_vendor.o(($event) => $options.sortChange($event, "category")),
    p: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    q: common_vendor.o(($event) => $options.sortChange($event, "photos")),
    r: common_vendor.p({
      align: "center"
    }),
    s: common_vendor.o(($event) => $options.sortChange($event, "point")),
    t: common_vendor.p({
      align: "center",
      sortable: true
    }),
    v: common_vendor.o(($event) => $options.filterChange($event, "recruitAge")),
    w: common_vendor.o(($event) => $options.sortChange($event, "recruitAge")),
    x: common_vendor.p({
      align: "center"
    }),
    y: common_vendor.o(($event) => $options.filterChange($event, "noteTitle")),
    z: common_vendor.o(($event) => $options.sortChange($event, "noteTitle")),
    A: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    B: common_vendor.o(($event) => $options.filterChange($event, "mainText")),
    C: common_vendor.o(($event) => $options.sortChange($event, "mainText")),
    D: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    E: common_vendor.o(($event) => $options.filterChange($event, "companyName")),
    F: common_vendor.o(($event) => $options.sortChange($event, "companyName")),
    G: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    H: common_vendor.o(($event) => $options.filterChange($event, "payrollForm")),
    I: common_vendor.o(($event) => $options.sortChange($event, "payrollForm")),
    J: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    K: common_vendor.o(($event) => $options.filterChange($event, "salary")),
    L: common_vendor.o(($event) => $options.sortChange($event, "salary")),
    M: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    N: common_vendor.o(($event) => $options.filterChange($event, "salarySupplement")),
    O: common_vendor.o(($event) => $options.sortChange($event, "salarySupplement")),
    P: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    Q: common_vendor.o(($event) => $options.filterChange($event, "traffic")),
    R: common_vendor.o(($event) => $options.sortChange($event, "traffic")),
    S: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    T: common_vendor.o(($event) => $options.filterChange($event, "workTime")),
    U: common_vendor.o(($event) => $options.sortChange($event, "workTime")),
    V: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    W: common_vendor.o(($event) => $options.filterChange($event, "workPosition")),
    X: common_vendor.o(($event) => $options.sortChange($event, "workPosition")),
    Y: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    Z: common_vendor.o(($event) => $options.filterChange($event, "phone")),
    aa: common_vendor.o(($event) => $options.sortChange($event, "phone")),
    ab: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    ac: common_vendor.o(($event) => $options.filterChange($event, "employeeForm")),
    ad: common_vendor.o(($event) => $options.sortChange($event, "employeeForm")),
    ae: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    af: common_vendor.o(($event) => $options.filterChange($event, "sex")),
    ag: common_vendor.o(($event) => $options.sortChange($event, "sex")),
    ah: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    ai: common_vendor.o(($event) => $options.filterChange($event, "age")),
    aj: common_vendor.o(($event) => $options.sortChange($event, "age")),
    ak: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    al: common_vendor.o(($event) => $options.filterChange($event, "sterOperation")),
    am: common_vendor.o(($event) => $options.sortChange($event, "sterOperation")),
    an: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    ao: common_vendor.o(($event) => $options.filterChange($event, "vaccinelnoculation")),
    ap: common_vendor.o(($event) => $options.sortChange($event, "vaccinelnoculation")),
    aq: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    ar: common_vendor.o(($event) => $options.filterChange($event, "releaseReason")),
    as: common_vendor.o(($event) => $options.sortChange($event, "releaseReason")),
    at: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    av: common_vendor.o(($event) => $options.filterChange($event, "payMethod")),
    aw: common_vendor.o(($event) => $options.sortChange($event, "payMethod")),
    ax: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    ay: common_vendor.o(($event) => $options.filterChange($event, "postPrice")),
    az: common_vendor.o(($event) => $options.sortChange($event, "postPrice")),
    aA: common_vendor.p({
      align: "center",
      ["filter-type"]: "search"
    }),
    aB: common_vendor.o(($event) => $options.filterChange($event, "status")),
    aC: common_vendor.o(($event) => $options.sortChange($event, "status")),
    aD: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    aE: common_vendor.o(($event) => $options.filterChange($event, "delete")),
    aF: common_vendor.o(($event) => $options.sortChange($event, "delete")),
    aG: common_vendor.p({
      align: "center"
    }),
    aH: common_vendor.o(($event) => $options.filterChange($event, "browse")),
    aI: common_vendor.o(($event) => $options.sortChange($event, "browse")),
    aJ: common_vendor.p({
      align: "center",
      ["filter-type"]: "range",
      sortable: true
    }),
    aK: common_vendor.o(($event) => $options.filterChange($event, "weight")),
    aL: common_vendor.o(($event) => $options.sortChange($event, "weight")),
    aM: common_vendor.p({
      align: "center",
      ["filter-type"]: "range",
      sortable: true
    }),
    aN: common_vendor.o(($event) => $options.filterChange($event, "collect")),
    aO: common_vendor.o(($event) => $options.sortChange($event, "collect")),
    aP: common_vendor.p({
      align: "center",
      ["filter-type"]: "range",
      sortable: true
    }),
    aQ: common_vendor.o(($event) => $options.sortChange($event, "hightLight")),
    aR: common_vendor.p({
      align: "center"
    }),
    aS: common_vendor.o(($event) => $options.sortChange($event, "location")),
    aT: common_vendor.p({
      align: "center"
    }),
    aU: common_vendor.o(($event) => $options.filterChange($event, "create_date")),
    aV: common_vendor.o(($event) => $options.sortChange($event, "create_date")),
    aW: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    aX: common_vendor.o(($event) => $options.filterChange($event, "update_date")),
    aY: common_vendor.o(($event) => $options.sortChange($event, "update_date")),
    aZ: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    ba: common_vendor.p({
      align: "center"
    }),
    bb: common_vendor.p({
      align: "center"
    }),
    bc: common_vendor.p({
      align: "center"
    }),
    bd: common_vendor.p({
      align: "center"
    }),
    be: common_vendor.p({
      align: "center"
    }),
    bf: common_vendor.p({
      align: "center"
    }),
    bg: common_vendor.p({
      align: "center"
    }),
    bh: common_vendor.p({
      align: "center"
    }),
    bi: common_vendor.p({
      align: "center"
    }),
    bj: common_vendor.p({
      align: "center"
    }),
    bk: common_vendor.p({
      align: "center"
    }),
    bl: common_vendor.p({
      align: "center"
    }),
    bm: common_vendor.p({
      align: "center"
    }),
    bn: common_vendor.p({
      align: "center"
    }),
    bo: common_vendor.p({
      align: "center"
    }),
    bp: common_vendor.p({
      align: "center"
    }),
    bq: common_vendor.p({
      align: "center"
    }),
    br: common_vendor.p({
      align: "center"
    }),
    bs: common_vendor.p({
      align: "center"
    }),
    bt: common_vendor.p({
      align: "center"
    }),
    bv: common_vendor.p({
      align: "center"
    }),
    bw: common_vendor.p({
      align: "center"
    }),
    bx: common_vendor.p({
      align: "center"
    }),
    by: common_vendor.p({
      align: "center"
    }),
    bz: common_vendor.p({
      align: "center"
    }),
    bA: common_vendor.p({
      align: "center"
    }),
    bB: common_vendor.p({
      align: "center"
    }),
    bC: common_vendor.p({
      align: "center"
    }),
    bD: common_vendor.p({
      align: "center"
    }),
    bE: common_vendor.p({
      align: "center"
    }),
    bF: common_vendor.p({
      align: "center"
    }),
    bG: common_vendor.p({
      align: "center"
    }),
    bH: common_vendor.p({
      align: "center"
    }),
    bI: common_vendor.p({
      align: "center"
    }),
    bJ: common_vendor.p({
      align: "center"
    }),
    bK: common_vendor.o($options.selectionChange),
    bL: common_vendor.o($options.onPageChanged),
    bM: common_vendor.sr("udb", "5d15abee-1"),
    bN: common_vendor.o($options.onqueryload),
    bO: common_vendor.p({
      collection: $data.collectionList,
      field: "userId,type,category,photos,point,recruitAge,noteTitle,mainText,companyName,payrollForm,salary,salarySupplement,traffic,workTime,workPosition,phone,employeeForm,sex,age,sterOperation,vaccinelnoculation,releaseReason,payMethod,postPrice,status,delete,browse,weight,collect,hightLight,location,location,create_date,update_date",
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent,
      options: $data.options,
      loadtime: "manual"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
