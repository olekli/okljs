// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";
const { assert } = require("./assert.js");

describe("assert.ok", () => {
  test("true condition does not throw", () => {
    expect(() => assert.ok(true)).not.toThrow();
  });

  test("false condition does throw", () => {
    expect(() => assert.ok(false)).toThrow();
  });
});

describe("assert.anything", () => {
  test("null does throw", () => {
    expect(() => assert.anything(null)).toThrow();
  });

  test("undefined does throw", () => {
    expect(() => assert.anything(undefined)).toThrow();
  });

  test.each([
    0,
    [],
    {},
    "",
    "foo",
    [ "bar" ],
    { foo: "bar" }
  ])("non-null does not throw", (input) => {
    expect(() => assert.anything(input)).not.toThrow();
  });
});

describe("assert.fail", () => {
  test("does throw", () => {
    expect(() => assert.fail()).toThrow();
  });
});

describe("assert.hasProperty", () => {
  test.each([
    0,
    12,
    "",
    "foo",
    [],
    [ "bar" ]
  ])("non-object does throw", (input) => {
    expect(() => assert.hasProperty(input, "property")).toThrow();
  });

  test("missing property does throw", () => {
    let o = { some_prop: "foo" };
    expect(() => assert.hasProperty(o, "other_prop")).toThrow();
  });

  test("existing property does not throw", () => {
    let o = { some_prop: "foo" };
    expect(() => assert.hasProperty(o, "some_prop")).not.toThrow();
  });
});

describe("assert.hasPropertyType", () => {
  test.each([
    0,
    12,
    "",
    "foo",
    [],
    [ "bar" ]
  ])("non-object does throw", (input) => {
    expect(() => assert.hasPropertyType(input, "property", "string")).toThrow();
  });

  test("missing property does throw", () => {
    let o = { some_prop: "foo" };
    expect(() => assert.hasPropertyType(o, "other_prop", "string")).toThrow();
  });

  test("existing property of wrong type does throw", () => {
    let o = { some_prop: "foo" };
    expect(() => assert.hasPropertyType(o, "some_prop", "number")).toThrow();
  });

  test("existing property of correct type does not throw", () => {
    let o = { some_prop: 123 };
    expect(() => assert.hasPropertyType(o, "some_prop", "number")).not.toThrow();
  });
});
