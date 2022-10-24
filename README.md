## Summary

This code is not currently working for the main `input.csv` test input.

It will work on a smaller subset of the data, but has memory issues when processing many users.

## To Do

If you search for the 🚧 emoji, you will find parts of the code that need work:

* Every once in a while, the line returned by the `readLines` API would be null
* Calculating the user relationship matrix blows the heap out of the water

## Explanation

This code works by:

* Creating a map of phone number > users key / value pairs
* Chunking up that map into _partitions_ based on the last `N` digits of the phone number
* Calculating the adjacency matrix of user > user within that partition
* Summing up all the adjacency matrices together

If I had been able to solve the memory issue, I believe that the adjacency matrix would have made the three requirements within the documentation trivial.

* Find user pairs with highest # of shared contacts - iterate over adjacency matrix, find highest count, use row / column to perform user lookup
* Find ten highest pairs for given user - iterate over row, perform same logic as previous bullet
* Add new user / phone number pair - look up other users with that phone number from map, update each combination's cell value in adjacency matrix
