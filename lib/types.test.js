'use strict'

const { register_type, match_type, assert_type } = require('./types.js');
const { assert } = require('./assert.js')

register_type('MyTestType', 'test/schema/type/MyTestType.json');
register_type('MyTestString', 'test/schema/type/MyTestString.json');
register_type('MyTestArray', 'test/schema/type/MyTestArray.json');
register_type('TreeNode', 'test/schema/type/TreeNode.json');

test.each([
  [ 'MyTestType', { some_value: [ 'a', 'b' ] } ],
  [ 'MyTestType', { some_value: [ 'a', 'b', 'c' ], some_other_value: 'abcd' } ],
  [ 'MyTestString', 'some string' ],
  [ 'MyTestArray', [1, 2, 4 ] ]
])('asserting correct type succeeds', (type, obj) => {
  assert_type(obj, type);
  assert_type(obj, type);
  assert_type(obj, type);
});

test.each([
  [ 'MyTestType', { some_value: [ 'a', 'b' ] } ],
  [ 'MyTestType', { some_value: [ 'a', 'b', 'c' ], some_other_value: 'abcd' } ],
  [ 'MyTestString', 'some string' ],
  [ 'MyTestArray', [1, 2, 4 ] ]
])('matches correctly', (type, obj) => {
  match_type(obj, {
      MyTestType: (test_type) => { expect(test_type.some_value.includes('a')).toBe(true); },
      MyTestString: (string) => { expect(string).toBe(obj); },
      MyTestArray: (array) => { expect(array).toEqual(obj); }
    });
  match_type(obj, {
      MyTestType: (test_type) => { expect(test_type.some_value.includes('a')).toBe(true); },
      MyTestString: (string) => { expect(string).toBe(obj); },
      MyTestArray: (array) => { expect(array).toEqual(obj); }
    });
  match_type(obj, {
      MyTestType: (test_type) => { expect(test_type.some_value.includes('a')).toBe(true); },
      MyTestString: (string) => { expect(string).toBe(obj); },
      MyTestArray: (array) => { expect(array).toEqual(obj); }
    });
});

test.each([
  [ 'MyTestString', 'some string' ],
])('matching unmatched type fails', (type, obj) => {
  expect(() => match_type(obj, {
      MyTestType: (test_type) => { expect(test_type.some_value.includes('a')).toBe(true); },
      MyTestArray: (array) => { expect(array).toEqual(obj); }
    })).toThrow();
  expect(() => match_type(obj, {
      MyTestType: (test_type) => { expect(test_type.some_value.includes('a')).toBe(true); },
      MyTestArray: (array) => { expect(array).toEqual(obj); }
    })).toThrow();
  expect(() => match_type(obj, {
      MyTestType: (test_type) => { expect(test_type.some_value.includes('a')).toBe(true); },
      MyTestArray: (array) => { expect(array).toEqual(obj); }
    })).toThrow();
});

test('asserting unregistered type fails', () => {
  expect(() => assert_type('some string', 'UnregisteredType')).toThrow();
  expect(() => assert_type('some string', 'UnregisteredType')).toThrow();
  expect(() => assert_type('some string', 'UnregisteredType')).toThrow();
});

test.each([
  [ 'MyTestString', { some_value: [ 'a', 'b' ] } ],
  [ 'MyTestType', 'MyTestString', 'some string' ],
  [ 'MyTestType', 'MyTestArray', [1, 2, 4 ] ]
])('asserting wrong type fails', (type, obj) => {
  expect(() => assert_type(obj, type)).toThrow();
  expect(() => assert_type(obj, type)).toThrow();
  expect(() => assert_type(obj, type)).toThrow();
});

test('TreeNode', () => {
  let tree = {
    left: {
      left: { value: '12' },
      value: '5',
      right: { value: '13' }
    },
    value: '1',
    right: {
      left: {
        value: '4',
        right: { value: '15' }
      },
      value: '6',
      right: { value: '11' }
    }
  };
  assert_type(tree, 'TreeNode');
  assert_type(tree, 'TreeNode');
  assert_type(tree, 'TreeNode');
});
