import Matrix from '../MatrixInterface';
import UserRelationship from '../UserRelationshipInterface';
import UserRelationshipWithCount from '../UserRelationshipWithCountInterface';

import {
  multiplyByTranspose
} from './matrix';

/**
 * Creates a symmetrical relationship matrix based on the shared phone numbers of each user.
 * 
 * The number of rows in the matrix corresponds to the number of unique users.
 * The number of columns in the matrix also corresponds to the number of unique users.
 * 
 * Each cell in the matrix corresponds to the number of shared phone numbers between that user / user pair.
 * If the users share phone numbers, the value of that cell is the number of shared phone numbers.
 * If the users don't share any phone numbers, the value of that cell is zero.
 * 
 * The diagonal of this matrix is the number of phone numbers each user shares with itself,
 * and therefore can be ignored.
 * 
 * Time Complexity: `O(n^3)` for array iterations
 * 
 * Space Complexity: `O(n^2)` for matrix output
 * 
 * @param {Map<String, Set<String>>} map the map of user > phone number relationships
 * @param {String[]} sortedPhoneNumbers the array of sorted phone numbers
 * @param {String[]} sortedUsers the array of sorted users (important for index lookup later)
 * @returns {Matrix} a symmetrical relationship matrix based on the shared phone numbers of each user
 */
export const createUserRelationshipMatrix = (
  map: Map<String, Set<String>>,
  sortedPhoneNumbers: String[],
  sortedUsers: String[]
) => {
  // Time: O(n^3)
  // Space: O(n^2)
  const adjacencyMatrix = createAdjacencyMatrix(map, sortedPhoneNumbers, sortedUsers);
  {
    const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log('Created Adjacency Matrix: Current Memory Usage', Math.round(currentMemory * 100) / 100);
  }
  // Time: O(n^3)
  // Space: O(n^2)
  const pairRelationshipMatrix = multiplyByTranspose(adjacencyMatrix);
  return pairRelationshipMatrix;
}

/**
 * Creates an adjacency matrix based on the phone numbers of each user.
 * 
 * The number of rows in the matrix corresponds to the number of unique users.
 * The number of columns in the matrix corresponds to the number of unique phone numbers.
 * 
 * Each cell in the matrix corresponds to that user / phone number pair.
 * If the user has that phone number, the value of that cell is one.
 * If the user doesn't have that phone number, the value of that cell is zero.
 * 
 * Time Complexity: `O(n^3)` for array iterations
 * 
 * Space Complexity: `O(n^2)` for matrix output
 *
 * @param {Map<String, Set<String>>} map the map of user > phone number relationships
 * @param {number[]} sortedPhoneNumbers the array of sorted phone numbers
 * @param {String[]} sortedUsers the array of sorted users (important for index lookup later)
 * @returns {Matrix} an adjacency matrix based on the phone numbers of each user
 */
export const createAdjacencyMatrix = (
  map: Map<String, Set<String>>,
  sortedPhoneNumbers: String[],
  sortedUsers: String[]
): Matrix => {
  console.log('Users', sortedUsers.length);
  console.log('Phone Numbers', sortedPhoneNumbers.length);
  // Space: O(n*n)
  const values: number[][] = [];
  /**
   * Rows should correspond to users, so iterate over the users first.
   */
  // Time: O(n)
  for (let userIndex = 0; userIndex < sortedUsers.length; userIndex++) {
    // Space: O(1)
    const user = sortedUsers[userIndex];
    // Time: O(1)
    const userPhoneNumbers = map.get(user) || new Set();
    // Space: O(n)
    const row: number[] = [];
    // Time: O(n)
    for (let numberIndex = 0; numberIndex < sortedPhoneNumbers.length; numberIndex++) {
      // Space: O(1)
      const phoneNumber = sortedPhoneNumbers[numberIndex];
      // Time: O(n)
      const userHasPhoneNumber = userPhoneNumbers.has(phoneNumber);
      // Time: O(1)
      row.push(userHasPhoneNumber ? 1 : 0);
    }
    // Time: O(1)
    values.push(row);
  }
  const output: Matrix = {
    values
  };
  return output;
};

/**
 * Returns the user relationships with the most shared contacts.
 * 
 * @param userRelationshipMatrix the matrix of user relationship frequency
 * @param sortedUsers the array of sorted users; used for lookups
 * @returns the user relationships with the most shared contacts
 */
export const getUserRelationshipsWithMostSharedContacts = (
  userRelationshipMatrix: Matrix,
  sortedUsers: String[]
): UserRelationship[] => {
  const numberOfRows = userRelationshipMatrix.values.length;
  const numberOfColumns = userRelationshipMatrix.values[0].length;
  if (numberOfColumns !== numberOfRows) {
    throw new Error();
  }
  if (numberOfColumns !== sortedUsers.length || numberOfRows !== sortedUsers.length) {
    throw new Error();
  }
  let maximumSharedContacts = 0;
  let userRelationships = [];
  // Time: O(n)
  for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
    const row = userRelationshipMatrix.values[rowIndex];
    /**
     * We can ignore the diagonal, since we don't care about a user's relationship with itself.
     * 
     * We can also ignore anything to the left of the diagonal since the matrix is symmetrical.
     */
    const startingIndex = 1 + rowIndex;
    // Time: O(n)
    for (let columnIndex = startingIndex; columnIndex < numberOfColumns; columnIndex++) {
      const value = row[columnIndex];
      if (value > 0) {
        if (value > maximumSharedContacts) {
          maximumSharedContacts = value;
          /**
           * Reset the array since we found a higher number of shared contacts.
           */
          userRelationships = [];
          userRelationships.push({
            user: sortedUsers[rowIndex],
            otherUser: sortedUsers[columnIndex]
          });
        } else if (value === maximumSharedContacts) {
          userRelationships.push({
            user: sortedUsers[rowIndex],
            otherUser: sortedUsers[columnIndex]
          });
        }
      }
    }
  }
  return userRelationships;
};

/**
 * Returns user relationships for the specified user.
 * 
 * @param userRelationshipMatrix the matrix of user relationship frequency
 * @param sortedUsers the array of sorted users; used for lookups
 * @param userIndex the index of the user we care about
 * @returns user relationships for the specified user
 */
export const getUserRelationships = (
  userRelationshipMatrix: Matrix,
  sortedUsers: String[],
  userIndex: number
): UserRelationshipWithCount[] => {
  const numberOfRows = userRelationshipMatrix.values.length;
  const numberOfColumns = userRelationshipMatrix.values[0].length;
  if (numberOfColumns !== numberOfRows) {
    throw new Error();
  }
  if (numberOfColumns !== sortedUsers.length || numberOfRows !== sortedUsers.length) {
    throw new Error();
  }
  let userRelationships = [];
  // Time: O(n)
  const row = userRelationshipMatrix.values[userIndex];
  // Time: O(n)
  for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
    /**
     * We can ignore a user's relationship with itself.
     */
    if (columnIndex === userIndex) {
      continue;
    }
    const value = row[columnIndex];
    if (value > 0) {
      userRelationships.push({
        numberOfSharedPhoneNumbers: value,
        user: sortedUsers[userIndex],
        otherUser: sortedUsers[columnIndex]
      });
    }
  }
  userRelationships = userRelationships.sort((first, second) => second.numberOfSharedPhoneNumbers - first.numberOfSharedPhoneNumbers);
  return userRelationships;
};
