"use strict";
const validator = {
  "name": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "parent_id": {
    "rules": [
      {
        "format": "string"
      }
    ]
  }
};
exports.validator = validator;
