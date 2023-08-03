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

const add_association = (obj, types) => {
  types_cache.set(obj, types);
  return obj;
}

const check_association = (obj, type) => {
  return (typeof obj === 'object' && types_cache.has(obj) && types_cache.get(obj).includes(type));
}

const assert_type = (obj, types_) => {
  let types = [ types_ ].flat();
  types.forEach(
    (type) =>
      assert.ok(
          check_association(obj, type),
          () => `${JSON.stringify(obj, null, 2)} is not ${type}`
        )
  );
};

const validate_type_dynamic = (obj, types_) => {
  let types = [ types_ ].flat();
  for (let type of types) {
    let validate = ajv.getSchema(type);
    assert.ok(validate, () => `missing schema ${type}`);
    if (!validate(obj)) {
      return make_err(validate.errors);
    }
  }
  return make_ok();
};

const do_static_validation = true;

const validate_type_static = (obj, types_) =>
  do_static_validation ? validate_type_dynamic(obj, types_) : make_ok();
// Eventually, implement a static type validation instead of costly dynamic.

const make_type_ = (validate, obj, types_) => {
  let types = [ types_ ].flat();
  let result = validate(obj, types);
  assert.ok(ok(result), () =>
`${JSON.stringify(obj, null, 2)}
failed validation against: ${JSON.stringify(type, null, 2)}
with errors:
${JSON.stringify(get_err(result), null, 2)}`
    );
  add_association(obj, types);
  return obj;
}

const make_type_dynamic = (obj, types_) => make_type_(validate_type_dynamic, obj, types_);
const make_type_static = (obj, types_) => make_type_(validate_type_static, obj, types_);

const match_type = (obj, map) => {
  for (let type in map) {
    if (check_association(obj, type)) {
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
module.exports.make_type_dynamic = make_type_dynamic;
module.exports.make_type_static = make_type_static;
module.exports.assert_type = assert_type;
module.exports.match_type = match_type;
