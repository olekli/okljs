// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";
const { assert } = require("./assert.js");
const { make_result, get_ok, get_err, ok, err, match_result, is_result, make_ok, make_err, useJestResultMatcher, map_result } = require("./result.js");
const util = require("util");

useJestResultMatcher();

describe("setter and getter", () => {
  describe("ok", () => {
    test("make_ok is result", () => {
      expect(is_result(make_ok(42))).toEqual(true);
    });

    test("make_ok is ok", () => {
      expect(ok(make_ok(42))).toEqual(true);
    });

    test("make_ok of make_ok is result", () => {
      expect(is_result(make_ok(make_ok(42)))).toEqual(true);
    });

    test("make_ok of make_ok is ok", () => {
      expect(ok(make_ok(make_ok(42)))).toEqual(true);
    });

    test("get_ok of make_ok returns correct value", () => {
      expect(get_ok(make_ok(42))).toEqual(42);
    });

    test("get_ok of (make_ok of make_ok) returns correct value", () => {
      expect(get_ok(make_ok(make_ok(42)))).toEqual(42);
    });

    test("make_ok of make_err is err", () => {
      expect(err(make_ok(make_err(42)))).toEqual(true);
    });

    test("get_err of (make_ok of make_err) returns correct value", () => {
      expect(get_err(make_ok(make_err(42)))).toEqual(42);
    });
  });

  describe("err", () => {
    test("make_err is result", () => {
      expect(is_result(make_err(42))).toEqual(true);
    });

    test("make_err is err", () => {
      expect(err(make_err(42))).toEqual(true);
    });

    test("make_err of make_err is result", () => {
      expect(is_result(make_err(make_err(42)))).toEqual(true);
    });

    test("make_err of make_err is err", () => {
      expect(err(make_err(make_err(42)))).toEqual(true);
    });

    test("get_err of make_err returns correct value", () => {
      expect(get_err(make_err(42))).toEqual(42);
    });

    test("get_err of (make_err of make_err) returns correct value", () => {
      expect(get_err(make_err(make_err(42)))).toEqual(42);
    });

    test("make_err of make_ok is err", () => {
      expect(err(make_err(make_ok(42)))).toEqual(true);
    });

    test("make_err of make_ok is err", () => {
      expect(err(make_err(make_ok(42)))).toEqual(true);
    });

    test("get_err of (make_err of make_ok) returns correct value", () => {
      expect(get_err(make_err(make_ok(42)))).toEqual(42);
    });
  });
});

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

    test("assertion is not caught", () => {
      let caught = false;
      try {
        let result = make_result(() => { assert.ok(false); });
      } catch(e) {
        caught = true;
      }
      expect(caught).toBe(true);
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

    test("throwing works with util.promisify", async () => {
      let result = await make_result(
          util.promisify((n, cb) => cb(n, null))(42)
        );
      expect(ok(result)).toBe(false);
      expect(err(result)).toBe(true);
      expect(get_err(result)).toEqual(42);
    });

    test("non-throwing works with util.promisify", async () => {
      let result = await make_result(
          util.promisify((n, cb) => cb(null, n))(42)
        );
      expect(ok(result)).toBe(true);
      expect(err(result)).toBe(false);
      expect(get_ok(result)).toEqual(42);
    });

    test.each([
      42,
      null,
      undefined
    ])("value works", (value) => {
      let result = make_result(value);
      expect(ok(result)).toBe(true);
      expect(err(result)).toBe(false);
      expect(get_ok(result)).toEqual(value);
    });

    test("assertion is not caught when throwing", async () => {
      let caught = false;
      try {
        let result = await make_result(
            (async () => { assert.ok(false); })()
          );
      } catch(e) {
        caught = true;
      }
      expect(caught).toBe(true);
    });
  });
});

describe("match_result", () => {
  test("ok handler works", () => {
    let result = make_result(() => { return 42; });
    expect(get_ok(match_result(result, (value) => ({ it_was_ok: value }), (err) => { throw 123; })))
          .toEqual({ it_was_ok: 42 });
  });

  test("err handler works", () => {
    let result = make_result(() => { throw 42; });
    expect(get_err(match_result(result, (value) => { throw 123; }, (err) => ({ it_was_err: err }))))
          .toEqual({ it_was_err: 42 });
  });

  test("err enum works", () => {
    let map = {
      a: (err) => ({ it_was_err_a: err }),
      b: (err) => ({ it_was_err_b: err }),
      _: (err) => ({ it_was_err_other: err })
    };
    let result = make_result(() => { throw { a: 42 }; });
    expect(get_err(match_result(result, (value) => { throw 123; }, map)))
          .toEqual({ it_was_err_a: 42 });

    result = make_result(() => { throw { b: 42 }; });
    expect(get_err(match_result(result, (value) => { throw 123; }, map)))
          .toEqual({ it_was_err_b: 42 });

    result = make_result(() => { throw { c: 42 }; });
    expect(get_err(match_result(result, (value) => { throw 123; }, map)))
          .toEqual({ it_was_err_other: { c: 42 } });
  });

  test("default err handler works", () => {
    let result = make_result(() => { throw 42; });
    expect(get_err(match_result(result, (value) => { throw 123; })))
          .toEqual(42);
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
    expect(get_err(match_result(result, (value) => { throw 123; }, map)))
          .toEqual({ it_was_err_a: err_a });

    result = make_result(() => { throw err_b; });
    expect(get_err(match_result(result, (value) => { throw 123; }, map)))
          .toEqual({ it_was_err_b: err_b });

    result = make_result(() => { throw err_c; });
    expect(get_err(match_result(result, (value) => { throw 123; }, map)))
          .toEqual({ it_was_err_other: err_c });
  });
});

describe("custom matcher", () => {
  test("ok", () => {
    let result = make_ok();
    expect(result).toBeOk();
  });

  test("not ok", () => {
    let result = make_err();
    expect(result).not.toBeOk();
  });

  test("err", () => {
    let result = make_err();
    expect(result).toBeErr();
  });

  test("not err", () => {
    let result = make_ok();
    expect(result).not.toBeErr();
  });
});

describe("map_result", () => {
  it("returns ok when all entries are ok", () => {
    let x = [
        { a: 1, b: make_ok("a") },
        { a: 2, b: make_ok("b") },
        { a: 3, b: make_ok("c") }
      ];
    let result = map_result(x,
        (unwrap, entry) => ({ a: entry.a, b: unwrap(entry.b) })
      );
    expect(result).toBeOk();
    expect(get_ok(result)).toEqual([
        { a: 1, b: "a" },
        { a: 2, b: "b" },
        { a: 3, b: "c" }
      ]);
  });

  it("returns err when at least one entry is err", () => {
    let x = [
        { a: 1, b: make_ok("a") },
        { a: 2, b: make_err("b") },
        { a: 3, b: make_ok("c") }
      ];
    let result = map_result(x,
        (unwrap, entry) => ({ a: entry.a, b: unwrap(entry.b) })
      );
    expect(result).toBeErr();
    expect(get_err(result)).toEqual([
        { a: 1, b: "a" },
        { a: 2, b: "b" },
        { a: 3, b: "c" }
      ]);
  });
});
