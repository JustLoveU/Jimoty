"use strict";
const validator = {
  "send_user_id": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "评论者的uid",
    "defaultValue": {
      "$env": "uid"
    },
    "label": "评论者的uid"
  },
  "re_user_id": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "被评论者的uid",
    "label": "被评论者的uid"
  },
  "post_id": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "被评论的帖子",
    "label": "被评论的帖子"
  },
  "type": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      }
    ],
    "title": "评论类型",
    "label": "评论类型"
  },
  "content": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "评论内容",
    "label": "评论内容"
  },
  "read_over": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "是否已阅",
    "label": "是否已阅"
  },
  "create_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "评论发表时间",
    "defaultValue": {
      "$env": "now"
    },
    "label": "评论发表时间"
  },
  "publish_ip": {
    "rules": [
      {
        "format": "string"
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
