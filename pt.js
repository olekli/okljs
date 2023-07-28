'use strict'

// const { register_type, make_type, match_type, assert_type } = require('./lib/types.js');
const { assert } = require('./lib/assert.js');

//register_type('MyTestType', 'test/schema/type/MyTestType.json');

//let obj = make_type({ some_value: [ 'a', 'b' ] }, 'MyTestType');
let obj = { some_value: [ 'a', 'b' ], _types: ['MyTestType'] };

const getTypes = (obj) => {
  return obj._types;
};

const hasTypes = (obj) => {
  return '_types' in obj;
};

const check_type = (obj, type) => {
 // assert.ok(
 //     typeof obj === 'object' && hasTypes(obj),
 //     () => `Not a typed object: ${JSON.stringify(obj, null, 2)}`
 //   );
  return (typeof obj === 'object' && hasTypes(obj) && getTypes(obj).includes(type));
}

const assert_type = (obj, type) => {
  assert.ok(
      check_type(obj, type),
      () =>
`${JSON.stringify(obj, null, 2)}
is not: ${type}.
It is, however: ${getTypes(obj)}`
    );
  return true;
};

let assert_f = () => assert_type(obj, 'MyTestType');
let check_f = () => check_type(obj, 'MyTestType');
let if_f = () => {
  if (obj._types.includes('MyTestType')) {
    return true;
  } else {
    return false;
  }
};

let run = (n, f) => {
  let t0 = process.hrtime();

  let a = true;
  for (let i = 0; i < n; i++) {
    a = a && f();
  }

  let diff = process.hrtime(t0);
  let timeInMilliseconds = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
  console.log(`Execution time: ${timeInMilliseconds} ms`);
};

//run(1000000, if_f);
run(1000000, assert_f);
//run(1000000, check_f);
