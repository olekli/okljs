// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";
const { readJsons } = require("./read_jsons.js");
const tmp = require("tmp");
const fs = require("fs");
const path = require("path");

tmp.setGracefulCleanup();

test("can read object", () => {
  let o = { name: "obj", value: 123 };
  let result = readJsons(o, "name");
  expect(result).toEqual({ obj: { name: "obj", value: 123 } });
});

test("can read array of objects", () => {
  let a = [ { name: "obj", value: 123 }, { name: "other obj", str: "foo" } ];
  let result = readJsons(a, "name");
  expect(result).toEqual({
    obj: { name: "obj", value: 123 },
    "other obj": { name: "other obj", str: "foo" }
  });
});

test("can read dir of json files", () => {
  let tmp_dir = tmp.dirSync();
  let a = [ { name: "obj", value: 123 }, { name: "other obj", str: "foo" } ];
  a.forEach(
    (o, i) =>
      fs.writeFileSync(
        path.join(tmp_dir.name, String(i) + ".json"), JSON.stringify(o, null, 2)
      )
  );

  let result = readJsons(tmp_dir.name, "name");
  expect(result).toEqual({
    obj: { name: "obj", value: 123 },
    "other obj": { name: "other obj", str: "foo" }
  });
});
