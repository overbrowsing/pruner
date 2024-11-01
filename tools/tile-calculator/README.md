# 👒 Tile Calculator

## Overview

Tile Calculator is a Python application that helps users determine the optimal tile dimensions images using `pruner.js` not only at defined breakpoints but also dynamically across a variety of viewport sizes, distinguishing it from traditional responsive image methods.

It begins by retrieving the five most common viewport sizes for mobile, tablet, and desktop from [Statcounter](https://gs.statcounter.com/screen-resolution-stats), along with some secondary sizes for added flexibility. The calculator finds potential tile widths and heights by identifying all common divisors of the viewport dimensions, allowing it to determine how many tiles fit and the overhang in width and height. By testing different tile size combinations, it finds the size that produces the lowest average pixel waste, defined as the unused pixels that remain when an image does not perfectly align with the viewport.  After identifying the best tile dimensions, the application calculates the average pixel waste percentage and displays results, including the tile layout (columns and rows), tile dimensions, total number of tiles, and average pixel waste across the tested viewport sizes.


## Initialize

1. **Run the application or execute using the command:**

	```
	python tile-calc.py
	```

2. **Follow the Prompts (❓)**

	**❓ Enter the desired largest image width (px)**

	**❓ Enter the desired largest image height (px)**

3. **View Results**
- Image dimensions
- Number of columns and rows
- Total tiles
- Tile dimensions
- Average pixel waste

## Example Calculation

The inputs below generated the calculation for tiles featured in the [example setup](/README.md#example-installation):

- Dimensions: 2400 x 1500px

### Example Results

The printed results from the example setup:

```bash
Tile calculation complete!
Image dimensions = 2400 x 1500px
Columns = 10, Rows = 8
Total tiles = 80
Tile dimensions = 240.00 x 187.50px
Average pixel waste = 20.38%
```