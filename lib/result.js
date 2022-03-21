// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";
const { assert } = require("./assert.js");
const { match_enum } = require("./enum.js");

const make_ok = (value) => ({ ok: value });
const make_err = (error) => ({ err: error });
const ok = (result) => Object.keys(result).includes("ok");
const err = (result) => Object.keys(result).includes("err");
const get_ok = (result) => result.ok;
const get_err = (result) => result.err;

const make_result = (body) => {
  if (typeof body === "function") {
    try {
      return make_ok(body());
    } catch(error) {
      return make_err(error);
    }
  } else {
    return (async () => {
      try {
        return make_ok(await Promise.resolve(body));
      } catch(error) {
        return make_err(error);
      }
    })();
  }
};

const match_result = (result, ok_handler, err_handler = (err) => make_err(err)) => {
  if (ok(result)) {
    return ok_handler(get_ok(result));
  } else {
    assert.ok(err(result));
    if (typeof err_handler === "function") {
      return err_handler(get_err(result));
    } else if (typeof err_handler === "object") {
      let err = get_err(result);
      return match_enum(err, err_handler);
    } else {
      assert.fail(() => `missing case for ${result}`);
    }
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
