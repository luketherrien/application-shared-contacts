import {
  access
} from 'fs/promises';

/**
 * 🚧 Test
 * 
 * Returns whether or not the file at the specified file path exists.
 *
 * @param filePath the path of the file
 * @returns whether or not the file at the specified file path exists
 */
export const exists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};
