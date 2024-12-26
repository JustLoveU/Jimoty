// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "chatBoxId": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "消息框id",
    "label": "消息框id"
  },
  "userId": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "消息发送方",
    "label": "消息发送方"
  },
  "friendId": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "消息接收方",
    "label": "消息接收方"
  },
  "status": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "是否已读",
    "label": "是否已读"
  },
  "message": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "消息内容",
    "label": "消息内容"
  },
  "type": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "消息类型",
    "label": "消息类型"
  },
  "delete": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "是否删除",
    "label": "是否删除"
  },
  "time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "消息创建时间",
    "label": "消息创建时间"
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
