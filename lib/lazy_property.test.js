// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";
const { addLazyProperty } = require("./lazy_property.js");

test("can access property once", () => {
  let object = {};
  addLazyProperty(object, "something", () => 1234);
  expect(object.something).toBe(1234);
});

test("can access property multiple times", () => {
  let object = {};
  addLazyProperty(object, "something", () => 1234);
  expect(object.something).toBe(1234);
  expect(object.something).toBe(1234);
  expect(object.something).toBe(1234);
  expect(object.something).toBe(1234);
  expect(object.something).toBe(1234);
  expect(object.something).toBe(1234);
  expect(object.something).toBe(1234);
});
