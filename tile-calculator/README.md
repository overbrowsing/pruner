# 👒 Tile Calculator

## Overview

Tile Calculator is a Python application that helps users determine the optimal tile dimensions images using **`pruner.js`** not only at defined breakpoints but also dynamically across a variety of viewport sizes, distinguishing it from traditional responsive image methods.

The calcualtor begins by gathering essential information, such as the image dimensions and important viewport breakpoints. Once this information is collected, the algorithm calculates suitable tile sizes by identifying the nearest common divisors of the breakpoint widths. This approach ensures that the tiles fit seamlessly within the viewport, avoiding gaps or excessive pixel waste—defined as the unused pixels that remain when an image does not perfectly align with the viewport. The algorithm focuses on minimising this pixel waste while maintaining a balanced number of tiles, evaluating the trade-off between using fewer larger tiles—which may lead to more pixel waste—and smaller tiles that fit better but increase HTTP requests. This careful consideration enables the algorithm to select the optimal tile configuration, enhancing layout efficiency and overall performance.

## Features

- Calculate the optimal tile sizes based upon all the nearest common divisors for specified breakpoints and across a range of viewport widths.
- Assess pixel waste for different tile sizes and viewport configurations.
- Option to save pixel waste data to a CSV file for further analysis.
- Option to view visual representation of tile distribution and pixel waste through graphs.

## Requirements

- **Python 3.x**
- **NumPy**
- **Matplotlib**

You can install the required libraries using pip:

```bash
pip install numpy matplotlib
```

## Initialize

1. **Run the application or execute using the command:**

	```
	python tile-calc.py
	```

2. **Follow the Prompts (❓)**

	**❓ Enter the desired largest image width (px)**

	**❓ Enter the desired largest image height (px)**

	**❓Do you want to manually set breakpoints? (y/n)**
	  - ***No*** — Use common breakpoints (750, 1536, 1860, 2560) and proceed.
    - ***Yes*** — **❓ Enter breakpoints separated by spaces**

3. **View Results**
- Breakpoints
- Number of columns and rows
- Tile Dimensions
- Tiles visible at each breakpoint
- Pixel Waste Results

4. **Export Data**
- You will be prompted to export pixel waste data to a CSV file. Choose ‘y’ to save the data to the [results folder](/tile-calculator/results).

5. **Graphical Output**
-	Optionally, you can view a graph showing the distribution of tiles and the associated pixel waste. Choose ‘y’ when prompted.

## Example Calculation

The inputs below generated the calculation for tiles featured in the [example setup](/README.md#example-html-setup):

- Dimensions: 2400 x 1500px
- Breakpoints: Default (750, 1536, 1860, 2560)

### Example Results

The printed results from the example setup:

```bash
Tile Calculator Results
Breakpoints: [750, 1536, 1860, 2560] (px)
Columns = 10, Rows = 10
Tile Dimensions = 250 x 140px
--- Tiles Visible at 750px = 3 (W) 10 (H)
--- Tiles Visible at 1536px = 7 (W) 10 (H)
--- Tiles Visible at 1860px = 8 (W) 10 (H)
--- Tiles Visible at 2560px = 11 (W) 10 (H)

Pixel Waste Results
Average pixel waste across viewports for the tested tile dimensions.
250 x 140px = 86.44px wasted
256 x 140px = 115.00px wasted
320 x 140px = 147.00px wasted
310 x 140px = 164.78px wasted
372 x 140px = 171.67px wasted
375 x 140px = 183.67px wasted
384 x 140px = 200.33px wasted
465 x 140px = 207.83px wasted
512 x 140px = 243.00px wasted
620 x 140px = 302.56px wasted
640 x 140px = 307.00px wasted
750 x 140px = 308.67px wasted
768 x 140px = 371.00px wasted
930 x 140px = 543.67px wasted
1280 x 140px = 555.89px wasted
1536 x 140px = 755.00px wasted
1860 x 140px = 1060.33px wasted
2560 x 140px = 1124.78px wasted
```

### Example Visualisation

![Graph Example](/tile-calculator/assets/example-graph.png)