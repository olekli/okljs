// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";
const { assert, AssertionError } = require("./assert.js");
const { match_enum } = require("./enum.js");
const util = require("util");

const ok_key = Symbol("ok");
const err_key = Symbol("err");

const ok = (result) => typeof(result) === "object" && result && ok_key in result;
const err = (result) => typeof(result) === "object" && result && err_key in result;
const is_result = (result) => ok(result) || err(result);
const get_ok = (result) => {
  assert.ok(ok(result));
  return result[ok_key];
};
const get_err = (result) => {
  assert.ok(err(result));
  return result[err_key];
};
const make_ok = (value) =>
  is_result(value)
    ? value
    : { [ok_key]: value };
const make_err = (error) =>
  is_result(error)
    ? ok(error)
      ? make_err(get_ok(error))
      : error
    : { [err_key]: error };

const make_ok_trans = (value) =>
  is_result(value)
    ? value
    : { [ok_key]: value };
const make_err_trans = (error) =>
  is_result(error)
    ? error
    : { [err_key]: error };

const is_promise = (x) => x?.then && typeof x.then === "function";

const make_result = (body, def = make_ok) => {
  if (typeof body === "function") {
    try {
      return make_ok(body());
    } catch(error) {
      if (error instanceof AssertionError) {
        throw error;
      } else {
        return make_err(error);
      }
    }
  } else if (is_result(body)) {
    return body;
  } else if (is_promise(body)) {
    return (async () => {
      try {
        return make_ok(await Promise.resolve(body));
      } catch(error) {
        if (error instanceof AssertionError) {
          throw error;
        } else {
          return make_err(error);
        }
      }
    })();
  } else {
    return def(body);
  }
};

const match_result = (result, ok_handler, err_handler = (err) => make_err(err)) => {
  if (ok(result)) {
    return make_result(ok_handler(get_ok(result)));
  } else if (err(result)) {
    assert.ok(err(result));
    let ret;
    if (typeof err_handler === "function") {
      ret = err_handler(get_err(result));
    } else if (typeof err_handler === "object") {
      let err = get_err(result);
      ret = match_enum(err, err_handler);
    } else {
      assert.fail(() => `missing case for ${result}`);
    }
    return make_result(ret, make_err);
  } else {
    return make_result(ok_handler(result));
  }
}

module.exports.make_ok = make_ok;
module.exports.make_err = make_err;
module.exports.ok = ok;
module.exports.err = err;
module.exports.get_ok = get_ok;
module.exports.get_err = get_err;
module.exports.make_result = make_result;
module.exports.match_result = match_result;
module.exports.is_result = is_result;
