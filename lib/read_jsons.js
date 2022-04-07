// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";
const { assert } = require("./assert.js");
const util = require("util");
const fs = require("fs");
const path = require("path");

let readJsons = (input, id_property) => {
  if (Array.isArray(input)) {
    return input.reduce(
      (result, x) => ({ ...result, ...readJsons(x, id_property) }),
      {}
    );
  } else if (typeof input === "string") {
    return readJsons(
      fs.readdirSync(input).filter(
        (file) => !file.startsWith(".")
      ).map(
        (file) => JSON.parse(fs.readFileSync(path.join(input, file)))
      ),
      id_property
    );
  } else if (typeof input === "object") {
    assert.ok(id_property in input, () => `missing ${id_property} in ${util.inspect(input)}`);
    return { [input[id_property]]: input };
  }
};

module.exports.readJsons = readJsons;
