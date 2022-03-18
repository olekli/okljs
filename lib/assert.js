// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";
const jsassert = require("assert");
const util = require("util");

Error.stackTraceLimit = 30;

function throwAssertion(message, f) {
  let error = new Error(`ASSERTION: ${message}`);
  Error.captureStackTrace(error, f);
  throw error;
}

const assert = {};
assert.ok = (condition, message_function = () => "") => {
  if (!condition) {
    throwAssertion(message_function(), assert.ok);
  }
}

assert.anything = (object, message_function = () => `${util.inspect(object, { depth: null })}`) => {
  if (object === null || object === undefined) {
    throwAssertion(message_function(), assert.anything);
  }
}

assert.fail = (message_function = () => "") => {
  throwAssertion(message_function(), assert.fail);
}

assert.hasProperty = (
  object,
  property,
  message_function = () => `${util.inspect(object, { depth: null })}`
) => {
  if (typeof object !== "object" || !(property in object)) {
    throwAssertion(message_function(), assert.hasProperty);
  }
}

assert.hasPropertyType = (
  object,
  property,
  type,
  message_function = () => `${util.inspect(object, { depth: null })}`
) => {
  if (typeof object !== "object" || !(property in object) || typeof object[property] !== type) {
    throwAssertion(message_function(), assert.hasPropertyType);
  }
}

module.exports.assert = assert;
