'use strict'

const { assert } = require('./assert.js');
const { make_ok, make_err, ok, get_err } = require('./result.js');
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const ajv = new Ajv();

const type_path = path.join(__dirname, 'schema', 'type');

const register_type = (type, schema_path) => {
  let schema = JSON.parse(fs.readFileSync(schema_path));
  ajv.addSchema(schema, type);
};

const types_cache = new WeakMap();

const check_type = (obj, type) => {
  if (typeof obj === 'object') {
    if (!types_cache.has(obj)) {
      types_cache.set(obj, {});
    }
    let this_cache = types_cache.get(obj);
    if (!(type in this_cache))
    {
      let validate = ajv.getSchema(type);
      assert.ok(validate, () => `missing schema ${type}`);
      this_cache[type] = validate(obj);
      if (!this_cache[type]) {
        return make_err(validate.errors);
      }
    }
    if (this_cache[type]) {
      return make_ok();
    }
  } else {
    let validate = ajv.getSchema(type);
    if (validate(obj)) {
      return make_ok();
    } else {
      return make_err(validate.errors);
    }
  }
  return make_err();
}

const assert_type = (obj, type) => {
  let result = check_type(obj, type);
  assert.ok(
      ok(result),
      () =>
`${JSON.stringify(obj, null, 2)}
failed validation against: ${JSON.stringify(type, null, 2)}
with errors:
${JSON.stringify(get_err(result), null, 2)}`
    );
};

const match_type = (obj, map) => {
  for (let key in map) {
    if (ok(check_type(obj, key))) {
      assert.ok(
          typeof map[key] === 'function',
          () => `Invalid matching: ${JSON.stringify(map, null, 2)}`
        );
      return map[key](obj);
    }
  }
  assert.fail(
      () =>
`Type not matched: ${JSON.stringify(obj, null, 2)}
Matches against: ${JSON.stringify(types_cache.get(obj), null, 2)}`
    );
};

module.exports.register_type = register_type;
module.exports.assert_type = assert_type;
module.exports.match_type = match_type;
