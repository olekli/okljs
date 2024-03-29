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
const unmake_result = (result) =>
  ok(result)
    ? get_ok(result)
    : get_err(result);

const unwrap_result = (result) => {
  if (ok(result)) {
    return get_ok(result);
  } else {
    throw get_err(result);
  }
};

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

const map_result = (array, callback) => {
  let is_ok = true;
  let local_unwrap = (result) => {
    return unmake_result(match_result(result,
      (ok) => ok,
      (err) => {
        is_ok = false;
        return err
      }
    ));
  }
  let result = array.map(callback.bind(null, local_unwrap));
  if (is_ok) {
    return make_ok(result);
  } else {
    return make_err(result);
  }
};

const unzip_result = (array) => {
  let result_ok = [];
  let result_err = [];
  for (let x of array) {
    if (ok(x)) {
      result_ok.push(get_ok(x));
    } else {
      result_err.push(get_err(x));
    }
  }
  if (result_err.length > 0) {
    return make_err(result_err);
  } else {
    return make_ok(result_ok);
  }
};

const useJestResultMatcher = () => {
  expect.extend({
    toBeOk: (received) => {
      let pass = ok(received);
      if (pass) {
        return {
          message: () => `expected ${util.inspect(received)} to be Err`,
          pass: true
        };
      } else {
        return {
          message: () => `expected ${util.inspect(received)} to be Ok`,
          pass: false
        };
      }
    },
    toBeErr: (received) => {
      let pass = err(received);
      if (pass) {
        return {
          message: () => `expected ${util.inspect(received)} to be Ok`,
          pass: true
        };
      } else {
        return {
          message: () => `expected ${util.inspect(received)} to be Err`,
          pass: false
        };
      }
    },
  });
};

module.exports.make_ok = make_ok;
module.exports.make_err = make_err;
module.exports.ok = ok;
module.exports.err = err;
module.exports.get_ok = get_ok;
module.exports.get_err = get_err;
module.exports.make_result = make_result;
module.exports.match_result = match_result;
module.exports.map_result = map_result;
module.exports.unwrap_result = unwrap_result;
module.exports.unzip_result = unzip_result;
module.exports.is_result = is_result;
module.exports.useJestResultMatcher = useJestResultMatcher;
