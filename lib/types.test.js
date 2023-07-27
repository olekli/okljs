'use strict'

const { register_type, make_type, match_type, assert_type } = require('./types.js');
const { assert } = require('./assert.js')

register_type('MyTestType', 'test/schema/type/MyTestType.json');
register_type('MyTestArray', 'test/schema/type/MyTestArray.json');
register_type('TreeNode', 'test/schema/type/TreeNode.json');
register_type('Base', 'test/schema/type/Base.json');
register_type('Derived1', 'test/schema/type/Derived1.json');
register_type('Derived2', 'test/schema/type/Derived2.json');

test.each([
  [ 'MyTestType', { some_value: [ 'a', 'b' ] } ],
  [ 'MyTestType', { some_value: [ 'a', 'b', 'c' ], some_other_value: 'abcd' } ],
  [ 'MyTestArray', [1, 2, 4 ] ]
])('asserting correct type succeeds', (type, obj) => {
  make_type(obj, type);
  assert_type(obj, type);
});

test.each([
  [ 'MyTestType', { some_value: [ 'a', 'b' ] } ],
  [ 'MyTestType', { some_value: [ 'a', 'b', 'c' ], some_other_value: 'abcd' } ],
  [ 'MyTestArray', [1, 2, 4 ] ]
])('matches correctly', (type, obj) => {
  make_type(obj, type);
  match_type(obj, {
      MyTestType: (test_type) => { expect(test_type.some_value.includes('a')).toBe(true); },
      MyTestString: (string) => { expect(string).toBe(obj); },
      MyTestArray: (array) => { expect(array).toEqual(obj); }
    });
});

test.each([
  [ 'TreeNode', { value: 'some string' } ],
])('matching unmatched type fails', (type, obj) => {
  make_type(obj, type);
  expect(() => match_type(obj, {
      MyTestType: (test_type) => { expect(test_type.some_value.includes('a')).toBe(true); },
      MyTestArray: (array) => { expect(array).toEqual(obj); }
    })).toThrow();
});

test('making unregistered type fails', () => {
  expect(() => make_type({ value: 'some string' }, 'UnregisteredType')).toThrow();
});

test.each([
  [ 'TreeNode', 'MyTestType', { some_value: [ 'a', 'b' ] } ],
  [ 'MyTestType', 'MyTestArray', [1, 2, 4 ] ]
])('asserting wrong type fails', (wrong_type, correct_type, obj) => {
  make_type(obj, correct_type);
  expect(() => assert_type(obj, wrong_type)).toThrow();
});

test('TreeNode', () => {
  let tree = make_type(
    {
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
    },
    'TreeNode'
  );
  assert_type(tree, 'TreeNode');
});

test('Polymorphism', () => {
  let derived1 = make_type(
    { value: 'derived1' },
    [ 'Base', 'Derived1' ]
  );
  let derived2 = make_type(
    { value: 'derived2' },
    [ 'Base', 'Derived2' ]
  );
  assert_type(derived1, 'Base');
  assert_type(derived1, 'Derived1');
  assert_type(derived2, 'Base');
  assert_type(derived2, 'Derived2');
});
