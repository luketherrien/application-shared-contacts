import Matrix from '../MatrixInterface';

import {
  add,
  multiply,
  multiplyByTranspose,
  transpose
} from './matrix';

it('Should Add Two Matrices', () => {
  const first: Matrix = {
    values: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]
  };
  const second: Matrix = {
    values: [
      [9, 8, 7],
      [6, 5, 4],
      [3, 2, 1]
    ]
  };
  const expected: Matrix = {
    values: [
      [10, 10, 10],
      [10, 10, 10],
      [10, 10, 10]
    ]
  };
  const actual = add(first, second);
  expect(actual).toEqual(expected);
});

it('Should Not Add Two Mismatched Matrices', () => {
  const first: Matrix = {
    values: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ]
  };
  const second: Matrix = {
    values: [
      [1]
    ]
  };
  expect(() => {
    add(first, second)
  }).toThrow();
});

it('Should Multiply Two Matrices', () => {
  const first: Matrix = {
    values: [
      [1, 1],
      [1, 1]
    ]
  };
  const second: Matrix = {
    values: [
      [2, 2],
      [2, 2]
    ]
  };
  const expected: Matrix = {
    values: [
      [4, 4],
      [4, 4]
    ]
  };
  const actual = multiply(first, second);
  expect(actual).toEqual(expected);
});

it('Should Multiply Two Mismatched Matrices', () => {
  const first: Matrix = {
    values: [
      [1, 1, 1]
    ]
  };
  const second: Matrix = {
    values: [
      [1],
      [1],
      [1]
    ]
  };
  const expected: Matrix = {
    values: [
      [3]
    ]
  };
  const actual = multiply(first, second);
  expect(actual).toEqual(expected);
});

it('Should Not Multiply Two Uneven Matrices', () => {
  const first: Matrix = {
    values: [
      [1, 1, 1, 1]
    ]
  };
  const second: Matrix = {
    values: [
      [1]
    ]
  };
  expect(() => {
    multiply(first, second)
  }).toThrow();
});

it('Should Multiply a Matrix By the Transpose', () => {
  const input: Matrix = {
    values: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ]
  };
  const expected: Matrix = {
    values: [
      [3, 3, 3],
      [3, 3, 3],
      [3, 3, 3]
    ]
  };
  const actual = multiplyByTranspose(input);
  expect(actual).toEqual(expected);
});

it('Should Multiply a Matrix By the Transpose', () => {
  const input: Matrix = {
    values: [
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0]
    ]
  };
  const expected: Matrix = {
    values: [
      [2, 1, 1],
      [1, 2, 1],
      [1, 1, 2]
    ]
  };
  const actual = multiplyByTranspose(input);
  expect(actual).toEqual(expected);
});

it('Should Multiply a Non-Symmetrical Matrix By the Transpose', () => {
  const input: Matrix = {
    values: [
      [0, 1, 1],
      [1, 0, 1]
    ]
  };
  const expected: Matrix = {
    values: [
      [2, 1],
      [1, 2]
    ]
  };
  const actual = multiplyByTranspose(input);
  expect(actual).toEqual(expected);
});

it('Should Transpose a Matrix', () => {
  const input: Matrix = {
    values: [
      [1, 1, 1],
      [2, 2, 2],
      [3, 3, 3]
    ]
  };
  const expected: Matrix = {
    values: [
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3]
    ]
  };
  const actual = transpose(input);
  expect(actual).toEqual(expected);
});

it('Should Transpose a Non-Symmetrical Matrix', () => {
  const input: Matrix = {
    values: [
      [1, 1, 1]
    ]
  };
  const expected: Matrix = {
    values: [
      [1],
      [1],
      [1]
    ]
  };
  const actual = transpose(input);
  expect(actual).toEqual(expected);
});

it('Should Transpose an Empty Matrix', () => {
  const input: Matrix = {
    values: [
      []
    ]
  };
  const expected: Matrix = {
    values: [
    ]
  };
  const actual = transpose(input);
  expect(actual).toEqual(expected);
});

it('Should Transpose an Empty Matrix without Columns', () => {
  const input: Matrix = {
    values: [
    ]
  };
  const expected: Matrix = {
    values: [
    ]
  };
  const actual = transpose(input);
  expect(actual).toEqual(expected);
});
