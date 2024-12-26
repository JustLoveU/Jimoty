// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "userId": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "发布者",
    "defaultValue": {
      "$env": "uid"
    },
    "label": "发布者"
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
    "title": "类目",
    "label": "类目"
  },
  "category": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "类别",
    "label": "类别"
  },
  "photos": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "title": "图片",
    "label": "图片"
  },
  "point": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "title": "地理位置",
    "label": "地理位置"
  },
  "recruitAge": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "招募年龄",
    "label": "招募年龄"
  },
  "noteTitle": {
    "rules": [
      {
        "format": "string"
      },
      {
        "minLength": 1,
        "maxLength": 255
      }
    ],
    "title": "标题",
    "label": "标题"
  },
  "mainText": {
    "rules": [
      {
        "format": "string"
      },
      {
        "minLength": 1,
        "maxLength": 15000
      }
    ],
    "title": "正文",
    "label": "正文"
  },
  "companyName": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "公司名",
    "label": "公司名"
  },
  "payrollForm": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "工资形式",
    "label": "工资形式"
  },
  "salary": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "薪资",
    "label": "薪资"
  },
  "salarySupplement": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "工资补充",
    "label": "工资补充"
  },
  "traffic": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "交通",
    "label": "交通"
  },
  "workTime": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "工作时间",
    "label": "工作时间"
  },
  "workPosition": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "工作地点",
    "label": "工作地点"
  },
  "phone": {
    "rules": [
      {
        "format": "string"
      },
      {
        "pattern": "^\\+?[0-9-]{3,20}$"
      }
    ],
    "title": "电话",
    "label": "电话"
  },
  "employeeForm": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "雇佣形式",
    "label": "雇佣形式"
  },
  "sex": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "性别",
    "label": "性别"
  },
  "age": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "年龄",
    "label": "年龄"
  },
  "sterOperation": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "绝育手术",
    "label": "绝育手术"
  },
  "vaccinelnoculation": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "疫苗接种",
    "label": "疫苗接种"
  },
  "releaseReason": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "投稿理由",
    "label": "投稿理由"
  },
  "payMethod": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "支付方式",
    "defaultValue": 0,
    "label": "支付方式"
  },
  "postPrice": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "商品价格",
    "label": "商品价格"
  },
  "status": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "帖子状态",
    "defaultValue": 0,
    "label": "帖子状态"
  },
  "delete": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "逻辑删除",
    "defaultValue": 1,
    "label": "逻辑删除"
  },
  "browse": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "浏览数",
    "defaultValue": 0,
    "label": "浏览数"
  },
  "weight": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "权重",
    "defaultValue": 100,
    "label": "权重"
  },
  "collect": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "收藏数",
    "defaultValue": 0,
    "label": "收藏数"
  },
  "hightLight": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "高亮",
    "defaultValue": false,
    "label": "高亮"
  },
  "location": {
    "rules": [
      {
        "format": "object"
      }
    ],
    "title": "地理位置",
    "label": "地理位置"
  },
  "create_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  },
  "update_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
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
