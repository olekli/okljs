// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";
const { make_result, get_ok, get_err, ok, err, match_result } = require("./result.js");

describe("make_result", () => {
  describe("non-async", () => {
    test("non-throwing produces ok", () => {
      let result = make_result(() => { return 42; });
      expect(ok(result)).toBe(true);
      expect(err(result)).toBe(false);
      expect(get_ok(result)).toEqual(42);
    });

    test("throwing produces err", () => {
      let result = make_result(() => { throw 42; });
      expect(ok(result)).toBe(false);
      expect(err(result)).toBe(true);
      expect(get_err(result)).toEqual(42);
    });
  });

  describe("async", () => {
    test("resolving produces ok", async () => {
      let result = await make_result(new Promise(r => r(42)));
      expect(ok(result)).toBe(true);
      expect(err(result)).toBe(false);
      expect(get_ok(result)).toEqual(42);
    });

    test("rejecting produces err", async () => {
      let result = await make_result(new Promise((_, r) => r(42)));
      expect(ok(result)).toBe(false);
      expect(err(result)).toBe(true);
      expect(get_err(result)).toEqual(42);
    });

    test("non-throwing produces ok", async () => {
      let result = await make_result(
          (async () => { return 42; })()
        );
      expect(ok(result)).toBe(true);
      expect(err(result)).toBe(false);
      expect(get_ok(result)).toEqual(42);
    });

    test("throwing produces err", async () => {
      let result = await make_result(
          (async () => { throw 42; })()
        );
      expect(ok(result)).toBe(false);
      expect(err(result)).toBe(true);
      expect(get_err(result)).toEqual(42);
    });
  });
});

describe("match_result", () => {
  test("ok handler works", () => {
    let result = make_result(() => { return 42; });
    expect(match_result(result, (value) => ({ it_was_ok: value }), (err) => { throw 123; }))
          .toEqual({ it_was_ok: 42 });
  });

  test("err handler works", () => {
    let result = make_result(() => { throw 42; });
    expect(match_result(result, (value) => { throw 123; }, (err) => ({ it_was_err: err })))
          .toEqual({ it_was_err: 42 });
  });

  test("err enum works", () => {
    let map = {
      a: (err) => ({ it_was_err_a: err }),
      b: (err) => ({ it_was_err_b: err }),
      _: (err) => ({ it_was_err_other: err })
    };
    let result = make_result(() => { throw { a: 42 }; });
    expect(match_result(result, (value) => { throw 123; }, map))
          .toEqual({ it_was_err_a: 42 });

    result = make_result(() => { throw { b: 42 }; });
    expect(match_result(result, (value) => { throw 123; }, map))
          .toEqual({ it_was_err_b: 42 });

    result = make_result(() => { throw { c: 42 }; });
    expect(match_result(result, (value) => { throw 123; }, map))
          .toEqual({ it_was_err_other: { c: 42 } });
  });

  test("default err handler works", () => {
    let result = make_result(() => { throw 42; });
    expect(match_result(result, (value) => { throw 123; }))
          .toEqual({ err: 42 });
  });

  test("err enum works with symbol only", () => {
    let err_a = Symbol("a");
    let err_b = Symbol("b");
    let err_c = Symbol("c");

    let map = {
      [err_a]: (err) => ({ it_was_err_a: err }),
      [err_b]: (err) => ({ it_was_err_b: err }),
      _: (err) => ({ it_was_err_other: err })
    };

    let result = make_result(() => { throw err_a; });
    expect(match_result(result, (value) => { throw 123; }, map))
          .toEqual({ it_was_err_a: err_a });

    result = make_result(() => { throw err_b; });
    expect(match_result(result, (value) => { throw 123; }, map))
          .toEqual({ it_was_err_b: err_b });

    result = make_result(() => { throw err_c; });
    expect(match_result(result, (value) => { throw 123; }, map))
          .toEqual({ it_was_err_other: err_c });
  });
});
