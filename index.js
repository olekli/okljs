// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";

const { assert } = require("./lib/assert.js");
const { makeLogger } = require("./lib/logger.js");
const { make_result, match_result, ok, err, make_ok, make_err, get_ok, get_err } = require("./lib/result.js");
const { addLazyProperty } = require("./lib/lazy_property.js");
const { match_enum } = require("./lib/enum.js");
const { readJsons } = require("./lib/read_jsons.js");

module.exports.assert = assert;
module.exports.makeLogger = makeLogger;
module.exports.match_enum = match_enum;
module.exports.make_result = make_result;
module.exports.match_result = match_result;
module.exports.make_ok = make_ok;
module.exports.make_err = make_err;
module.exports.ok = ok;
module.exports.err = err;
module.exports.get_ok = get_ok;
module.exports.get_err = get_err;
module.exports.addLazyProperty = addLazyProperty;
module.exports.readJsons = readJsons;
