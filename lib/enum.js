// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";
const { assert } = require("./assert.js");
const util = require("util");

const OTHERS_SYMBOL = "_";

const match_enum = (e, map) => {
  let enum_name;
  let enum_value;
  if (typeof e === "object") {
    assert.ok(Object.keys(e).length == 1, () => `${util.inspect(e)}`);
    enum_name = Object.keys(e)[0];
    enum_value = e[enum_name];
  } else if (typeof e === "symbol" || typeof e === "string") {
    enum_name = e;
    enum_value = e;
  } else {
    assert.fail(() => `${util.inspect(e)}`);
  }
  if (enum_name in map) {
    return map[enum_name](enum_value);
  } else if (OTHERS_SYMBOL in map) {
    return map[OTHERS_SYMBOL](e);
  } else {
    assert.fail(() => `missing case ${util.inspect(e)} in ${util.inspect(map)}`);
  }
}

module.exports.match_enum = match_enum;
