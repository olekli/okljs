// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";

const fs = require('fs');
const { make_result } = require('./result.js');

const fileExists = (p, mode = fs.constants.R_OK) =>
  make_result(() => fs.accessSync(p, mode));

module.exports.fileExists = fileExists;
