// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";
const { createLogger, format, transports } = require("winston");

const label_width = 8;

let printLevel = (level) => `[${level[0].toUpperCase()}]`;
let printLabel = (label) => label.substring(0, label_width).padEnd(label_width, " ");

let makeLogger = (label, level = "debug") => createLogger({
    defaultMeta: { label: label },
    level: level,
    format: format.combine(
      format.splat(),
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      format.printf(
        ({ message, timestamp, level, label }) =>
          `${printLevel(level)} ${timestamp} ${printLabel(label)} ${message}`
      )
    ),
    transports: [
      new transports.Console()
    ]
  });

module.exports.makeLogger = makeLogger;
