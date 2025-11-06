import Matrix from '../MatrixInterface';

import {
  add
} from './matrix';

import {
  createUserRelationshipMatrix
} from './utility';

/**
* Computes shared-contact counts per user pair without building dense matrices.
*
* This dramatically reduces memory because we only keep counts for pairs that
* actually share at least one phone number, and a compact diagonal array for
* self-counts.
*/
export const calculateCombinedUserRelationshipCounts = (
  map: Map<String, Set<String>>,
  partitionedPhoneNumbers: Map<String, Set<String>>,
  users: String[]
): Map<string, number> => {
  const counts = new Map<string, number>();
  const userIndexByName = new Map<String, number>();
  for (let i = 0; i < users.length; i++) userIndexByName.set(users[i], i);
  // accumulate per partition to keep the working set small
  for (const [, phoneNumberSet] of partitionedPhoneNumbers) {
    accumulateCountsForPartition(map, phoneNumberSet, users, userIndexByName, counts);
  }
  return counts;
};

/**
* Internal: accumulate counts for a single partition of phone numbers.
*/
const accumulateCountsForPartition = (
  map: Map<String, Set<String>>,
  phoneNumberSet: Set<String>,
  users: String[],
  userIndexByName: Map<String, number>,
  counts: Map<string, number>
) => {
  // Build a compact index: phoneNumber -> user indices that have it
  const phoneToUsers = new Map<String, number[]>();
  for (const user of users) {
    const idx = userIndexByName.get(user)!;
    const nums = map.get(user);
    if (!nums) continue;
    for (const num of nums) {
      if (!phoneNumberSet.has(num)) continue;
      const arr = phoneToUsers.get(num) || [];
      arr.push(idx);
      phoneToUsers.set(num, arr);
    }
  }
  // For each phone number, increment diagonal and pair counts
  for (const [, userIdxs] of phoneToUsers) {
    const k = userIdxs.length;
    if (k === 0) continue;
    // diagonal: each user shares this phone number with itself
    for (let a = 0; a < k; a++) {
      const i = userIdxs[a];
      const key = `${i},${i}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    // off-diagonal pairs
    for (let a = 0; a < k; a++) {
      for (let b = a + 1; b < k; b++) {
        const i = userIdxs[a];
        const j = userIdxs[b];
        const key = i < j ? `${i},${j}` : `${j},${i}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
  }
};

/**
* Utility: turn the sparse counts map into a top-K list for reporting.
*/
export const topPairsFromCounts = (
  counts: Map<string, number>,
  users: String[],
  k = 10
) => {
  const items: { user: String; otherUser: String; numberOfSharedPhoneNumbers: number }[] = [];
  for (const [key, value] of counts) {
    const [iStr, jStr] = key.split(',');
    const i = Number(iStr);
    const j = Number(jStr);
    if (i === j) continue; // skip diagonal for pairs listing
    items.push({ user: users[i], otherUser: users[j], numberOfSharedPhoneNumbers: value });
  }
  items.sort((a, b) => b.numberOfSharedPhoneNumbers - a.numberOfSharedPhoneNumbers);
  return items.slice(0, k);
};

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
