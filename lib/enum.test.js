// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";
const { assert } = require("./assert.js");
const { match_enum } = require("./enum.js");

describe("match_enum with object", () => {
  let map = {
    enum1: (x) => ({ mapped1: x }),
    enum2: (x) => ({ mapped2: x }),
    enum3: (x) => ({ mapped3: x }),
    _: (x) => ({ other: x })
  };

  test("matches correctly", () => {
    let e = { enum1: 123 };
    expect(match_enum(e, map)).toEqual({ mapped1: 123 });
    e = { enum2: 234 };
    expect(match_enum(e, map)).toEqual({ mapped2: 234 });
    e = { enum3: 345 };
    expect(match_enum(e, map)).toEqual({ mapped3: 345 });
    e = { enum4: 456 };
    expect(match_enum(e, map)).toEqual({ other: { enum4: 456 } });
    e = { enum5: 567 };
    expect(match_enum(e, map)).toEqual({ other: { enum5: 567 } });
  });
});

describe("match_enum with Symbol", () => {
  let enum1 = Symbol("enum1");
  let enum2 = Symbol("enum2");
  let enum3 = Symbol("enum3");
  let enum4 = Symbol("enum4");
  let enum5 = Symbol("enum5");

  let map = {
    [enum1]: (x) => ({ mapped1: x }),
    [enum2]: (x) => ({ mapped2: x }),
    [enum3]: (x) => ({ mapped3: x }),
    _: (x) => ({ other: x })
  };

  test("matches correctly", () => {
    expect(match_enum(enum1, map)).toEqual({ mapped1: enum1 });
    expect(match_enum(enum2, map)).toEqual({ mapped2: enum2 });
    expect(match_enum(enum3, map)).toEqual({ mapped3: enum3 });
    expect(match_enum(enum4, map)).toEqual({ other: enum4 });
    expect(match_enum(enum5, map)).toEqual({ other: enum5 });
  });
});

describe("match_enum with string", () => {
  let enum1 = "enum1";
  let enum2 = "enum2";
  let enum3 = "enum3";
  let enum4 = "enum4";
  let enum5 = "enum5";

  let map = {
    [enum1]: (x) => ({ mapped1: x }),
    [enum2]: (x) => ({ mapped2: x }),
    [enum3]: (x) => ({ mapped3: x }),
    _: (x) => ({ other: x })
  };

  test("matches correctly", () => {
    expect(match_enum(enum1, map)).toEqual({ mapped1: enum1 });
    expect(match_enum(enum2, map)).toEqual({ mapped2: enum2 });
    expect(match_enum(enum3, map)).toEqual({ mapped3: enum3 });
    expect(match_enum(enum4, map)).toEqual({ other: enum4 });
    expect(match_enum(enum5, map)).toEqual({ other: enum5 });
  });
});
