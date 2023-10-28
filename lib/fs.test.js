// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";

const tmp = require('tmp');
const { fileExists } = require('../index.js');
const { useJestResultMatcher } = require('./result.js');

useJestResultMatcher();

it('returns err when file does not exist', () => {
  let p = tmp.tmpNameSync();
  let result = fileExists(p);
  expect(result).toBeErr();
});

it('returns ok when file exists', () => {
  let p = tmp.fileSync();
  let result = fileExists(p.name);
  expect(result).toBeOk();
  p.removeCallback();
});
