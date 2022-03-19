// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";

const { assert } = require("./lib/assert.js");
const { makeLogger } = require("./lib/logger.js");

module.exports.assert = assert;
module.exports.makeLogger = makeLogger;
