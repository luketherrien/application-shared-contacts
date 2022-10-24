import Matrix from '../MatrixInterface';

import {
  createAdjacencyMatrix,
  createUserRelationshipMatrix
} from './utility';

it('Should Create an Adjacency Matrix', () => {
  const map: Map<String, Set<String>> = new Map();
  const sortedPhoneNumbers: String[] = ['1', '2', '3', '4', '5'];
  const sortedUsers: String[] = [
    'Johann Sebastian Bach',
    'Ludwig van Beethoven',
    'Wolfgang Amadeus Mozart'
  ];
  map.set('Johann Sebastian Bach', new Set(['1', '2', '3']));
  map.set('Ludwig van Beethoven', new Set(['2', '3', '4']));
  map.set('Wolfgang Amadeus Mozart', new Set(['3', '4', '5']));
  const expected: Matrix = {
    values: [
      [1, 1, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 1, 1]
    ]
  };
  const actual = createAdjacencyMatrix(map, sortedPhoneNumbers, sortedUsers);
  expect(actual).toEqual(expected);
});

it('Should Create an Adjacency Matrix with Zero Phone Numbers', () => {
  const map: Map<String, Set<String>> = new Map();
  const sortedPhoneNumbers: String[] = [];
  const sortedUsers: String[] = [
    'Johann Sebastian Bach',
    'Ludwig van Beethoven',
    'Wolfgang Amadeus Mozart'
  ];
  map.set('Johann Sebastian Bach', new Set());
  map.set('Ludwig van Beethoven', new Set());
  map.set('Wolfgang Amadeus Mozart', new Set());
  const expected: Matrix = {
    values: [
      [],
      [],
      []
    ]
  };
  const actual = createAdjacencyMatrix(map, sortedPhoneNumbers, sortedUsers);
  expect(actual).toEqual(expected);
});

it('Should Create an Adjacency Matrix with Unknown Phone Numbers', () => {
  const map: Map<String, Set<String>> = new Map();
  const sortedPhoneNumbers: String[] = ['1', '2', '3', '4', '5'];
  const sortedUsers: String[] = [
    'Johann Sebastian Bach',
    'Ludwig van Beethoven',
    'Wolfgang Amadeus Mozart'
  ];
  map.set('Johann Sebastian Bach', new Set(['1', '2', '3']));
  map.set('Ludwig van Beethoven', new Set(['2', '3', '4']));
  map.set('Wolfgang Amadeus Mozart', new Set(['6', '7', '8']));
  const expected: Matrix = {
    values: [
      [1, 1, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0]
    ]
  };
  const actual = createAdjacencyMatrix(map, sortedPhoneNumbers, sortedUsers);
  expect(actual).toEqual(expected);
});

it('Should Create a User Relationship Matrix', () => {
  const map: Map<String, Set<String>> = new Map();
  const sortedPhoneNumbers: String[] = ['1', '2', '3', '4', '5'];
  const sortedUsers: String[] = [
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
  const actual = createUserRelationshipMatrix(map, sortedPhoneNumbers, sortedUsers);
  expect(actual).toEqual(expected);
});

it('Should Create a Large User Relationship Matrix', () => {
  const map: Map<String, Set<String>> = new Map();
  const sortedPhoneNumbers: String[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const sortedUsers: String[] = [
    'Antonio Vivaldi',
    'Johann Sebastian Bach',
    'Ludwig van Beethoven',
    'Wolfgang Amadeus Mozart',
  ];
  map.set('Antonio Vivaldi', new Set(['1', '3', '5']));
  map.set('Johann Sebastian Bach', new Set(['1', '2', '3', '4', '5']));
  map.set('Ludwig van Beethoven', new Set(['2', '3', '4', '8', '9']));
  map.set('Wolfgang Amadeus Mozart', new Set(['3', '4', '5', '6', '7']));
  const expected: Matrix = {
    values: [
      [3, 3, 1, 2],
      [3, 5, 3, 3],
      [1, 3, 5, 2],
      [2, 3, 2, 5]
    ]
  };
  const actual = createUserRelationshipMatrix(map, sortedPhoneNumbers, sortedUsers);
  expect(actual).toEqual(expected);
});

it('Should Create a User Relationship Matrix with Zero Shared Numbers', () => {
  const map: Map<String, Set<String>> = new Map();
  const sortedPhoneNumbers: String[] = ['1', '2', '3', '4', '5', '6'];
  const sortedUsers: String[] = [
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
  const actual = createUserRelationshipMatrix(map, sortedPhoneNumbers, sortedUsers);
  expect(actual).toEqual(expected);
});

it('Should Not Create an User Relationship Matrix with Zero Phone Numbers', () => {
  const map: Map<String, Set<String>> = new Map();
  const sortedPhoneNumbers: String[] = [];
  const sortedUsers: String[] = [
    'Johann Sebastian Bach',
    'Ludwig van Beethoven',
    'Wolfgang Amadeus Mozart'
  ];
  map.set('Johann Sebastian Bach', new Set());
  map.set('Ludwig van Beethoven', new Set());
  map.set('Wolfgang Amadeus Mozart', new Set());
  expect(() => {
    createUserRelationshipMatrix(map, sortedPhoneNumbers, sortedUsers)
  }).toThrow();
});
