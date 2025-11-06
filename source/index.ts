import {
  createReadStream
} from 'fs';
import {
  createInterface
} from 'readline';

import Matrix from './MatrixInterface';

import {
  exists
} from './utility/file';

import {
  parseLine
} from './utility/parser';

import {
  calculateCombinedUserRelationshipCounts,
  topPairsFromCounts
} from './utility/relationship';

const FILE_PATH = 'input.csv';

// Space: O(n^2)
const map: Map<String, Set<String>> = new Map();

// Space: O(n)
const userSet: Set<String> = new Set();

// Space: O(n^2)
const partitionedPhoneNumbers: Map<String, Set<String>> = new Map();

/**
 * 
 */
const parseFile = async (): Promise<void> => {
  const fileExists = await exists(FILE_PATH);
  if (fileExists) {
    console.debug('Found File');
  } else {
    throw new Error('Could Not Find File');
  }
  try {
    const fileStream = createReadStream(FILE_PATH);
    const readLine = createInterface({
      input: fileStream
    });
    // Space: O(1)
    const startDate = new Date();
    console.log('Start Date', startDate);
    // Space: O(1)
    let numberOfRows = 0;
    let emptyLines = 0;
    // Time: O(n)
    for await (const line of readLine) {
      // Time: O(1)
      numberOfRows++;
      if (!line) {
        console.error('Empty Line');
        emptyLines++;
        continue;
      }
      const {
        phoneNumber,
        user
      } = parseLine(line);
      // Space: O(1)
      // Time: O(1)
      const partition = phoneNumber.slice(-6);
      // Space: O(n)
      // Time: O(n)
      const phoneNumberSet = partitionedPhoneNumbers.get(partition) || new Set();
      // Time: O(1)
      phoneNumberSet.add(phoneNumber);
      // Time: O(1)
      partitionedPhoneNumbers.set(partition, phoneNumberSet);
      // Time: O(1)
      userSet.add(user);
      // Space: O(n)
      // Time: O(1)
      const currentPhoneNumbers = map.get(user) || new Set<String>;
      // Time: O(1)
      currentPhoneNumbers.add(phoneNumber);
      // Time: O(1)
      map.set(user, currentPhoneNumbers);
    }
    // Space: O(1)
    const endDate = new Date();
    console.log('End Date', endDate);
    console.log(endDate.getTime() - startDate.getTime());
    console.log('Number of Rows', numberOfRows);
    console.log('Number of Empty Lines', emptyLines);
  } catch (error) {
    console.error(error);
    throw new Error('Error Parsing File');
  }
  console.log('Done');
};

(async () => {
  await parseFile();
  {
    const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log('Parsed File: Current Memory Usage', Math.round(currentMemory * 100) / 100);
  }
  // Space: O(n)
  // Time: O(n)
  const users = [...userSet];
  console.log('Number of Users', users.length);
  console.log('Calculating user relationships (sparse counts)...');
  console.log(new Date());
  // Previous approach built huge dense matrices and multiplied them.
  // New approach streams counts of shared phone numbers per user-pair without
  // materializing the adjacency matrix, dramatically reducing peak memory.
  const counts = calculateCombinedUserRelationshipCounts(map, partitionedPhoneNumbers, users);
  console.log('Finished calculating shared-contact counts');
  console.log(new Date());
  // Print a small summary to keep memory usage low while still being useful
  const top = topPairsFromCounts(counts, users, 10);
  console.log('Top 10 user pairs by shared phone numbers');
  for (const item of top) {
    console.log(`${item.user} <> ${item.otherUser}: ${item.numberOfSharedPhoneNumbers}`);
  }
  /**
   * 🚧 Create REPL
   */
})();
