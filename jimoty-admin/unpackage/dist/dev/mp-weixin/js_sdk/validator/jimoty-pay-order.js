"use strict";
const validator = {
  "user_id": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "用户ID",
    "defaultValue": {
      "$env": "uid"
    },
    "label": "用户ID"
  },
  "total_fee": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "订单总金额",
    "label": "订单总金额"
  },
  "custom": {
    "rules": [
      {
        "format": "object"
      }
    ],
    "title": "自定义数据",
    "label": "自定义数据"
  },
  "order_no": {
    "rules": [
      {
        "format": "string"
      },
      {
        "minLength": 20,
        "maxLength": 28
      }
    ],
    "title": "业务系统订单号",
    "label": "业务系统订单号"
  },
  "type": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "订单类型",
    "label": "订单类型"
  },
  "status": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "已关闭",
            "value": -1
          },
          {
            "text": "未支付",
            "value": 0
          },
          {
            "text": "已支付",
            "value": 1
          },
          {
            "text": "已部分退款",
            "value": 2
          },
          {
            "text": "已全额退款",
            "value": 3
          }
        ]
      }
    ],
    "title": "订单状态",
    "defaultValue": 0,
    "label": "订单状态"
  },
  "create_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "创建时间",
    "label": "创建时间"
  },
  "pay_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "支付时间",
    "label": "支付时间"
  }
};
const enumConverter = {
  "status_valuetotext": {
    "0": "未支付",
    "1": "已支付",
    "2": "已部分退款",
    "3": "已全额退款",
    "-1": "已关闭"
  }
};
function filterToWhere(filter, command) {
  let where = {};
  for (let field in filter) {
    let { type, value } = filter[field];
    switch (type) {
      case "search":
        if (typeof value === "string" && value.length) {
          where[field] = new RegExp(value);
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = [];
          for (let s of value) {
            selectValue.push(command.eq(s));
          }
          where[field] = command.or(selectValue);
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0];
          let lt = value[1];
          where[field] = command.and([command.gte(gt), command.lte(lt)]);
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value;
          let startDate = new Date(s);
          let endDate = new Date(e);
          where[field] = command.and([command.gte(startDate), command.lte(endDate)]);
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value;
          where[field] = command.and([command.gte(startDate), command.lte(endDate)]);
        }
        break;
    }
  }
  return where;
}
exports.enumConverter = enumConverter;
exports.filterToWhere = filterToWhere;
exports.validator = validator;
