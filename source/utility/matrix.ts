import assert from 'assert';
import Matrix from '../MatrixInterface';

/**
 * Adds two matrices.
 * 
 * @param first the first matrix
 * @param second the second matrix
 * @returns the sum of both matrices
 */
export const add = (first: Matrix, second: Matrix): Matrix => {
  const firstRowCount = first.values.length;
  const secondRowCount = second.values.length;
  assert(firstRowCount === secondRowCount);
  const firstColumnCount = first.values[0].length;
  const secondColumnCount = second.values[0].length;
  assert(firstColumnCount === secondColumnCount);
  const values: number[][] = [];
  for (let rowIndex = 0; rowIndex < firstRowCount; rowIndex++) {
    let row = [];
    for (let columnIndex = 0; columnIndex < firstColumnCount; columnIndex++) {
      const firstValue = first.values[rowIndex][columnIndex];
      const secondValue = second.values[rowIndex][columnIndex];
      const sum = firstValue + secondValue;
      row.push(sum);
    }
    values.push(row);
  }
  const output: Matrix = {
    values
  };
  return output;
}

/**
 * Multiplies a matrix by its transpose.
 * 
 * Time Complexity: `O(n^3)` for array iterations
 * 
 * Space Complexity `O(n^2)` for matrix output
 * 
 * @param {Matrix} input the matrix to be transposed and multiplied
 * @returns the original matrix multiplied by its transpose
 */
export const multiplyByTranspose = (input: Matrix): Matrix => {
  // Time: O(n^2)
  // Space: O(n^2)
  const transposedInput = transpose(input);
  {
    const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log('Transposed: Current Memory Usage', Math.round(currentMemory * 100) / 100);
  }
  // Time: O(n^3)
  // Space: O(n^2)
  const output = multiply(input, transposedInput);
  {
    const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log('Multiplied by Transpose: Current Memory Usage', Math.round(currentMemory * 100) / 100);
  }
  return output;
};

/**
 * This function returns the transpose of a matrix.
 * A transposed matrix is created by flipping a matrix over its diagonal.
 * 
 * Time Complexity: `O(n^2)` for array iterations
 * 
 * Space Complexity `O(n^2)` for matrix output
 * 
 * @param {Matrix} input the matrix to be transposed
 * @returns {Matrix} the transpose of the specified matrix
 */
export const transpose = (input: Matrix): Matrix => {
  // Space: O(1)
  const numberOfRows = input.values.length;
  // Time: O(1)
  if (!input.values[0]) {
    // Space: O(n)
    const values: number[][] = [];
    const output: Matrix = {
      values
    };
    return output;
  }
  // Space: O(1)
  const numberOfColumns = input.values[0].length;
  // Space: O(n)
  const values: number[][] = [];
  // Time: O(n)
  for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
    // Space: O(n)
    const temporary: number[] = new Array(numberOfRows);
    // Time: O(1)
    values[columnIndex] = temporary;
  }
  /**
   * Switch the row and column indices of the specified matrix!
   */
  // Time: O(n)
  for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
    // Time: O(n)
    for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
      // Time: O(1)
      values[columnIndex][rowIndex] = input.values[rowIndex][columnIndex];
    }
  }
  const output: Matrix = {
    values
  };
  return output;
};

/**
 * Performs the dot product on the two specified matrices.
 *
 * Time Complexity: `O(n^3)` for array iterations
 * 
 * Space Complexity `O(n^2)` for matrix output
 * 
 * @param {Matrix} first the first matrix to be used in the dot product
 * @param {Matrix} second the second matrix to be used in the dot product
 * @returns {Matrix} the dot product of the two specified matrices
 */
export const multiply = (first: Matrix, second: Matrix): Matrix => {
  // Space: O(n)
  const values: number[][] = [];
  // Space: O(1)
  const numberOfRows = first.values.length;
  // Time: O(n)
  for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
    // Space: O(n)
    const temporary: number[] = [];
    // Time: O(1)
    values[rowIndex] = temporary;
    // Time: O(n)
    for (let secondColumnIndex = 0; secondColumnIndex < second.values[0].length; secondColumnIndex++) {
      let sum = 0;
      // Time: O(n)
      for (let firstColumnIndex = 0; firstColumnIndex < first.values[0].length; firstColumnIndex++) {
        // Time: O(1)
        sum += first.values[rowIndex][firstColumnIndex] * second.values[firstColumnIndex][secondColumnIndex];
      }
      // Time: O(1)
      values[rowIndex][secondColumnIndex] = sum;
    }
  }
  const output: Matrix = {
    values
  };
  return output;
};
