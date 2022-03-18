// Copyright 2022 Ole Kliemann
// SPDX-License-Identifier: Apache-2.0

"use strict";

function lazy_property_impl(object, property, producer) {
  let data = producer();

  Object.defineProperty(
      object,
      property,
      {
        value: data,
        writable: false,
        configurable: false,
        enumerable: false
      }
    );

  return data;
}

function addLazyProperty(object, property, producer) {
  Object.defineProperty(
    object,
    property,
    {
      get: lazy_property_impl.bind(null, object, property, producer),
      configurable: true
    }
  );
}

module.exports.addLazyProperty = addLazyProperty;
