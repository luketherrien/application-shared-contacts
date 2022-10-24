import Matrix from '../MatrixInterface';

import {
  calculateCombinedUserRelationshipMatrix,
  calculateUserRelationshipMatrix
} from './relationship';

it('Should Calculate a User Relationship Matrix', () => {
  const map: Map<String, Set<String>> = new Map();
  const phoneNumberSet: Set<String> = new Set(['1', '2', '3', '4', '5']);
  const users: String[] = [
    'Johann Sebastian Bach',
    'Ludwig van Beethoven',
    'Wolfgang Amadeus Mozart'
  ];
  map.set('Johann Sebastian Bach', new Set(['1', '2', '3']));
  map.set('Ludwig van Beethoven', new Set(['2', '3', '4']));
  map.set('Wolfgang Amadeus Mozart', new Set(['3', '4', '5']));
  const expected: Matrix = {
    values: [
      [3, 2, 1],
      [2, 3, 2],
      [1, 2, 3]
    ]
  };
  const actual = calculateUserRelationshipMatrix(map, phoneNumberSet, users);
  expect(actual).toEqual(expected);
});

it('Should Calculate a User Relationship Matrix', () => {
  const map: Map<String, Set<String>> = new Map();
  const phoneNumberSet: Set<String> = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
  const users: String[] = [
    'Johann Sebastian Bach',
    'Ludwig van Beethoven',
    'Wolfgang Amadeus Mozart'
  ];
  map.set('Johann Sebastian Bach', new Set(['1', '2', '3', '4', '5']));
  map.set('Ludwig van Beethoven', new Set(['4', '5', '6', '7']));
  map.set('Wolfgang Amadeus Mozart', new Set(['6', '7', '8', '9', '0']));
  const expected: Matrix = {
    values: [
      [5, 2, 0],
      [2, 4, 2],
      [0, 2, 5]
    ]
  };
  const actual = calculateUserRelationshipMatrix(map, phoneNumberSet, users);
  expect(actual).toEqual(expected);
});

it('Should Calculate a User Relationship Matrix', () => {
  const map: Map<String, Set<String>> = new Map();
  const phoneNumberSet: Set<String> = new Set(['1', '2', '3', '4', '5', '6']);
  const users: String[] = [
    'Johann Sebastian Bach',
    'Ludwig van Beethoven',
    'Wolfgang Amadeus Mozart'
  ];
  map.set('Johann Sebastian Bach', new Set(['1', '2']));
  map.set('Ludwig van Beethoven', new Set(['3', '4']));
  map.set('Wolfgang Amadeus Mozart', new Set(['5', '6']));
  const expected: Matrix = {
    values: [
      [2, 0, 0],
      [0, 2, 0],
      [0, 0, 2]
    ]
  };
  const actual = calculateUserRelationshipMatrix(map, phoneNumberSet, users);
  expect(actual).toEqual(expected);
});

it('Should Calculate a Combined User Relationship Matrix', () => {
  const map: Map<String, Set<String>> = new Map();
  const partitionedPhoneNumbers: Map<String, Set<String>> = new Map();
  partitionedPhoneNumbers.set('0', new Set(['00', '10', '20']));
  partitionedPhoneNumbers.set('1', new Set(['01', '11', '21']));
  partitionedPhoneNumbers.set('2', new Set(['02', '12', '22']));
  const users: String[] = [
    'Johann Sebastian Bach',
    'Ludwig van Beethoven',
    'Wolfgang Amadeus Mozart'
  ];
  map.set('Johann Sebastian Bach', new Set(['00', '01', '10', '11', '20', '21']));
  map.set('Ludwig van Beethoven', new Set(['00', '02', '10', '12', '20', '22']));
  map.set('Wolfgang Amadeus Mozart', new Set(['01', '02', '11', '12', '21', '22']));
  const expected: Matrix = {
    values: [
      [6, 3, 3],
      [3, 6, 3],
      [3, 3, 6]
    ]
  };
  const actual = calculateCombinedUserRelationshipMatrix(map, partitionedPhoneNumbers, users);
  expect(actual).toEqual(expected);
});

/**
 * 🔮 MAGIC 🔮
 * 
 * This is the most important test in this application.
 * 
 * If this wasn't true, we wouldn't be able to partition the phone numbers into smaller chunks.
 */
it('🔮 A Combined User Relationship Matrix Should Equal a Non-Partitioned User Relationship Matrix 🔮', () => {
  let expected;
  {
    const map: Map<String, Set<String>> = new Map();
    const phoneNumberSet: Set<String> = new Set(['00', '01', '02', '10', '11', '12', '20', '21', '22']);
    const users: String[] = [
      'Johann Sebastian Bach',
      'Ludwig van Beethoven',
      'Wolfgang Amadeus Mozart'
    ];
    map.set('Johann Sebastian Bach', new Set(['00', '01', '10', '11', '20', '21']));
    map.set('Ludwig van Beethoven', new Set(['00', '02', '10', '12', '20', '22']));
    map.set('Wolfgang Amadeus Mozart', new Set(['01', '02', '11', '12', '21', '22']));
    expected = calculateUserRelationshipMatrix(map, phoneNumberSet, users);
  }
  let actual;
  {
    const map: Map<String, Set<String>> = new Map();
    const partitionedPhoneNumbers: Map<String, Set<String>> = new Map();
    partitionedPhoneNumbers.set('0', new Set(['00', '10', '20']));
    partitionedPhoneNumbers.set('1', new Set(['01', '11', '21']));
    partitionedPhoneNumbers.set('2', new Set(['02', '12', '22']));
    const users: String[] = [
      'Johann Sebastian Bach',
      'Ludwig van Beethoven',
      'Wolfgang Amadeus Mozart'
    ];
    map.set('Johann Sebastian Bach', new Set(['00', '01', '10', '11', '20', '21']));
    map.set('Ludwig van Beethoven', new Set(['00', '02', '10', '12', '20', '22']));
    map.set('Wolfgang Amadeus Mozart', new Set(['01', '02', '11', '12', '21', '22']));
    actual = calculateCombinedUserRelationshipMatrix(map, partitionedPhoneNumbers, users);
  }
  expect(actual).toEqual(expected);
});
