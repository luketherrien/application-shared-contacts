import UserAndPhoneNumber from '../UserAndPhoneNumberInterface';

const DELIMITER = ',';

const DOUBLE_QUOTE = '\"';
const SINGLE_QUOTE = '\'';

/**
 * Parses a user and phone number from the given line.
 * 
 * @param {string} line the line to be parsed
 * @returns {UserAndPhoneNumber} a user and phone number
 */
export const parseLine = (line: string): UserAndPhoneNumber => {
  try {
    const array = line.split(DELIMITER);
    let phoneNumber = array[1];
    if (phoneNumber.startsWith(DOUBLE_QUOTE) && phoneNumber.endsWith(DOUBLE_QUOTE)) {
      phoneNumber = phoneNumber.replaceAll(DOUBLE_QUOTE, '');
    }
    let user = array[0];
    if (user.startsWith(DOUBLE_QUOTE) && user.endsWith(DOUBLE_QUOTE)) {
      user = user.replaceAll(DOUBLE_QUOTE, '');
    }
    return {
      phoneNumber,
      user
    };  
  } catch (error) {
    /**
     * 🚧 Figure Out Why Line Is Empty
     */
    throw (error);
  }
};
