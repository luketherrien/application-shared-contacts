import Matrix from '../MatrixInterface';

import {
  add
} from './matrix';

import {
  createUserRelationshipMatrix
} from './utility';

/**
 * Calculates the user relationship matrix from the given arguments.
 *
 * @param {Map<String, Set<String>>} map the map of user > phone number relationships
 * @param {Map<String, Set<String>} partitionedPhoneNumbers the set of unique phone numbers partitioned into groups
 * @param {String[]} sortedUsers the array of users (important for index lookup later)
 * @returns the user relationship matrix
 */
export const calculateCombinedUserRelationshipMatrix = (
  map: Map<String, Set<String>>,
  partitionedPhoneNumbers: Map<String, Set<String>>,
  users: String[]
): Matrix => {
  const partitionedPhoneNumbersArray = [...partitionedPhoneNumbers];
  console.log('Calculating Partition 0');
  let combinedUserRelationshipMatrix = calculateUserRelationshipMatrix(map, partitionedPhoneNumbersArray[0][1], users);
  for (let index = 1; index < partitionedPhoneNumbersArray.length; index++) {
    console.log(`Calculating Partition ${index}`);
    const userRelationshipMatrix = calculateUserRelationshipMatrix(map, partitionedPhoneNumbersArray[index][1], users);
    combinedUserRelationshipMatrix = add(combinedUserRelationshipMatrix, userRelationshipMatrix);
  }
  return combinedUserRelationshipMatrix;
};

/**
 * Calculates the user relationship matrix from the given arguments.
 *
 * @param {Map<String, Set<String>>} map the map of user > phone number relationships
 * @param {Set<String>} phoneNumberSet the set of unique phone numbers
 * @param {String[]} sortedUsers the array of users (important for index lookup later)
 * @returns the user relationship matrix
 */
export const calculateUserRelationshipMatrix = (
  map: Map<String, Set<String>>,
  phoneNumberSet: Set<String>,
  users: String[]
): Matrix => {
  // Time: O(n)
  // Space: O(n)
  const phoneNumbers = [...phoneNumberSet];
  // Time: O(n^3)
  // Space: O(n^2)
  const userRelationshipMatrix: Matrix = createUserRelationshipMatrix(map, phoneNumbers, users);
  return userRelationshipMatrix;
};
