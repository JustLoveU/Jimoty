"use strict";
const validator = {
  "type": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      }
    ],
    "title": "通知类型",
    "label": "通知类型"
  },
  "sendPeople": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "发送者",
    "label": "发送者"
  },
  "receive": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "接收者",
    "label": "接收者"
  },
  "message": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "消息",
    "label": "消息"
  },
  "otherMessage": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "其他消息",
    "label": "其他消息"
  },
  "status": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "消息状态",
    "defaultValue": false,
    "label": "消息状态"
  },
  "create_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  }
};
const enumConverter = {};
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