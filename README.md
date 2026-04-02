# AlgoHub
An interactive visualizer for sorting and cryptography algorithms, built with vanilla HTML, CSS, and JavaScript.

[Webpage](https://dweanmachine.github.io/AlgoHub/pages/sort-index.html)

## How to Use:
Pick from (currently) 10 algorithms to sort randomly generated values. Users can control the number of bars as well as the speed of the sorting algorithm.

## Features

- **10 sorting algorithms**: visualized in real time
- **Adjustable controls**: specify bar count and sort speed
- **Cryptography**: Additional algorithms for cryptographic functions (*coming soon*)

## Previews
<img src="assets/images/InsertionSort.gif" alt="Alt text" width="500"/>
<img src="assets/images/MergeSort.gif" alt="Alt text" width="500"/>
<img src="assets/images/BucketSort.gif" alt="Alt text" width="500"/>

### Available Algorithms:

| Algorithm      | Time (Best) | Time (Average) | Time (Worst) | Space   |
|----------------|-------------|----------------|--------------|---------|
| Bubble Sort    | O(n)        | O(n²)          | O(n²)        | O(1)    |
| Insertion Sort | O(n)        | O(n²)          | O(n²)        | O(1)    |
| Selection Sort | O(n²)       | O(n²)          | O(n²)        | O(1)    |
| Merge Sort     | O(n log n)  | O(n log n)     | O(n log n)   | O(n)    |
| Quick Sort     | O(n log n)  | O(n log n)     | O(n²)        | O(log n)|
| Heap Sort      | O(n log n)  | O(n log n)     | O(n log n)   | O(1)    |
| Radix Sort     | O(nk)       | O(nk)          | O(nk)        | O(n+k)  |
| Counting Sort  | O(n+k)      | O(n+k)         | O(n+k)       | O(k)    |
| Bucket Sort    | O(n+k)      | O(n+k)         | O(n²)        | O(n)    |
| Bogo Sort      | O(n)        | O(n·n!)        | O(∞)         | O(1)    |
