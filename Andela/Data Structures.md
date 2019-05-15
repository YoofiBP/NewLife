#Data Structures and Algorithms Prep

Definition
Data Structures represent ways of organising and storing data for operations to be applied on the data in the most efficient and effective manner

We are always concerned with time and space complexity when reviewing data structures.

With space complexity we look at how much space an algorithm requires in its execution. With time complexity we look at how much time an algorithm takes to complete.

To analyse complexity, we do not see to find the exact time/space value that is being used but simply view its asymptotic behaviour (how does it grow). Hence we first need to derive an expression to define time requirements and analyse how it will grow.

There are three types of asymptotic notations
* Big Theta: This notation fits the complexity within a tight bound to say: the average time for any input with remain between x and y. hence if it has a has a complexity of theta n squared it meanss the value will fall between x * n squared and y *  n squared
* Big O: This represents the worst case scenario for the time complexity of an algorithm. It will not go beyond this point
* Big Omega: This represents the best case scenario for the time complexity of an algorithm. It will no get better than this