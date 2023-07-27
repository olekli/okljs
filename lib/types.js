'use strict'

const { assert } = require('./assert.js');
const { make_ok, make_err, ok, get_err } = require('./result.js');
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const ajv = new Ajv();

const register_type = (type, type_path) => {
  let schema = JSON.parse(fs.readFileSync(type_path));
  ajv.addSchema(schema, type);
};

const types_cache = new WeakMap();

const make_type_dynamic = (obj, types) => {
  assert.ok(typeof obj === 'object');
  if (typeof types === 'string') {
    types = [types];
  }
  assert.ok(typeof types === 'object' && Array.isArray(types));
  for (let type of types) {
    let validate = ajv.getSchema(type);
    assert.ok(validate, () => `missing schema ${type}`);
    assert.ok(validate(obj), () =>
`${JSON.stringify(obj, null, 2)}
failed validation against: ${JSON.stringify(type, null, 2)}
with errors:
${JSON.stringify(validate.errors, null, 2)}`
      );
  }
  types_cache.set(obj, types);
  return obj;
};

const make_type_static = make_type_dynamic;
const make_type = make_type_static;

const check_type = (obj, type) => {
  assert.ok(
      typeof obj === 'object' && types_cache.has(obj),
      () => `Not a typed object: ${JSON.stringify(obj, null, 2)}`
    );
  return (types_cache.get(obj).includes(type));
}

const assert_type = (obj, type) => {
  assert.ok(
      check_type(obj, type),
      () =>
`${JSON.stringify(obj, null, 2)}
is not: ${type}.
It is, however: ${types_cache.get(obj)}`
    );
};

const match_type = (obj, map) => {
  for (let type in map) {
    if (check_type(obj, type)) {
      assert.ok(
          typeof map[type] === 'function',
          () => `Invalid matching: ${JSON.stringify(map, null, 2)}`
        );
      return map[type](obj);
    }
  }
  assert.fail(
      () =>
`Type not matched: ${JSON.stringify(obj, null, 2)}
Matches against: ${JSON.stringify(types_cache.get(obj), null, 2)}`
    );
};

module.exports.register_type = register_type;
module.exports.make_type = make_type;
module.exports.assert_type = assert_type;
module.exports.match_type = match_type;
