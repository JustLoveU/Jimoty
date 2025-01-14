// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "daoUserId": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "道具所属者uid",
    "defaultValue": {
      "$env": "uid"
    },
    "label": "道具所属者uid"
  },
  "daojuType": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      }
    ],
    "title": "道具类型",
    "label": "道具类型"
  },
  "daojuNum": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "道具数量",
    "defaultValue": 0,
    "label": "道具数量"
  },
  "last_use_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "最后一次使用的时间",
    "defaultValue": {
      "$env": "now"
    },
    "label": "最后一次使用的时间"
  },
  "create_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "创建道具的时间",
    "defaultValue": {
      "$env": "now"
    },
    "label": "创建道具的时间"
  }
}

const enumConverter = {}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
