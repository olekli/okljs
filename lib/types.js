'use strict'

const { assert } = require('./assert.js');
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const yaml = require('js-yaml');
const ajv = new Ajv();

const type_path = path.join(__dirname, 'schema', 'type');

const register_type = (type, schema_path) => {
  let schema = {};
  if (path.extname(schema_path) === '.yaml') {
    schema = yaml.load(fs.readFileSync(schema_path));
  } else {
    schema = JSON.parse(fs.readFileSync(schema_path));
  }
  ajv.addSchema(schema, type);
};

const assert_type = (obj, type) => {
  let validate = ajv.getSchema(type);
  assert.ok(validate, () => `missing schema ${type}`);
  assert.ok(
      validate(obj),
      () =>
`${JSON.stringify(obj, null, 2)}
failed validation against: ${JSON.stringify(type, null, 2)}
with errors:
${JSON.stringify(validate.errors, null, 2)}`
    );
};

const match_type = (obj, map) => {
  for (let key in map) {
    let validate = ajv.getSchema(key);
    assert.ok(validate, () => `missing schema ${type}`);
    if (validate(obj)) {
      assert.ok(
          typeof map[key] === 'function',
          () => `Invalid matching: ${JSON.stringify(map, null, 2)}`
        );
      return map[key](obj);
    }
  }
  assert.fail(
      () => `Type not matched: ${JSON.stringify(obj, null, 2)}`
    );
};

module.exports.register_type = register_type;
module.exports.assert_type = assert_type;
module.exports.match_type = match_type;
