# Data Structures and Algorithms Prep

Definition
Data Structures represent ways of organising and storing data for operations to be applied on the data in the most efficient and effective manner

We are always concerned with time and space complexity when reviewing data structures.

With space complexity we look at how much space an algorithm requires in its execution. With time complexity we look at how much time an algorithm takes to complete.

To analyse complexity, we do not see to find the exact time/space value that is being used but simply view its asymptotic behaviour (how does it grow). Hence we first need to derive an expression to define time requirements and analyse how it will grow.

There are three types of asymptotic notations
* Big Theta: This notation fits the complexity within a tight bound to say: the average time for any input with remain between x and y. hence if it has a has a complexity of theta n squared it meanss the value will fall between x * n squared and y *  n squared
* Big O: This represents the worst case scenario for the time complexity of an algorithm. It will not go beyond this point
* Big Omega: This represents the best case scenario for the time complexity of an algorithm. It will no get better than this

## Space Complexity
Generally when we are computing space complexity, we focus on the data space taken by the algorithm and discard the enviromental and instructions space. Data space is the amount of space used by the variables and constants. 

To calculate space complexity, we refer to a table of the size of each type of data variable.
We calculate based on the number of variables present and use this to compute the complexity

## Time Complexity
This is the total time required by a program to run till its completion

It is commonly estimated by counting the number of elementary steps performed by any algorithm to finish execution. 

It can be 
* Constant
* Linear
* Quadratic
* Logarithmic
* Nlog(N)

# Sorting Algorithms
Arranging data in ascending or descending order.

## Bubble Sort
Compares the elements one by one and sorts them based on their values

Compare the first element with the second, if the first is greater than the second, swap. 

Known as bubble sort because with every iteration the largest element in the given array bubbles up towards the last place

Time complexity is O(n^2)
Space Complexity  is 0(1)

## Selection Sort
Find the smallest array, swap it with the element in the first position. Find the second smallest and swap it with the element in the second position

Time complexity is O(n^2)
Space Complexity is O(1)

## Insertion Sort
You start at index 1, and for each element at the index, you have to place it at the right position in reference to the sorted sub array before it. So basically you are checking where each element belongs, whether greater or smaller than the preceding array

### Characteristics
* Efficient for smaller data sets but very inefficient for large ones
* It is more efficient when a partially sorted array is provided as input
* Better than selection and bubble sort. 
* Does not change relative order of elements which are equal. Its stable in this way

You pick a key (first element), iterate over the elements to the left of the key to find a position to put it in

Time complexity is O(n^2)
Space complexity is O(1)

## Merge Sort
Divide and Conquer, divide the problem into smaller sub problems to make them easier.

Divide an unsorted array into sub arrays of one element each and repeatedly merge to produce sorted subarrays until one complete array is produced.



Time Complexity is O(n*logn)