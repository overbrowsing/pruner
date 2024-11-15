# 🖼️ Tile Calculator

## Overview

Tile Calculator is a Python application that helps users determine the optimal tile dimensions images using `pruner.js` not only at defined breakpoints but also dynamically across a variety of viewport sizes, distinguishing it from traditional responsive image methods.

## How it Works

- **Retrieving Viewport Sizes**: The script begins by retrieving the five most common viewport sizes for mobile, tablet, and desktop from from [Statcounter](https://gs.statcounter.com/screen-resolution-stats), along with some secondary sizes for added flexibility.
- **Calculating Potential Tile Sizes**: It calculates potential tile widths and heights by identifying all common divisors of the viewport dimensions. This helps determine how many tiles fit in the viewport and the overhang in both width and height.
- **Minimising Pixel Waste**: The tool tests different tile size combinations to find the one that results in the lowest average pixel waste. Pixel waste refers to the unused pixels that remain when an image does not perfectly align with the viewport.
- **Calculating Final Results**: After determining the best tile dimensions, the script calculates the average pixel waste percentage and displays the results, including the tile layout (columns and rows), tile dimensions, total number of tiles, and the average pixel waste across all tested viewport sizes.

## Requirements

- **Python 3.x**: Ensure that you have Python 3.x installed on your system. You can download it from the [official Python website](https://www.python.org/downloads/).

## Initialize

1. **Run the Script**

    To use the script, simply run the Python file or execute using the command:

    ```bash
    python tools/tile-maker/tile-calc.py
    ```

2. **Follow the Prompts**

    Once executed follow the prompts (❓):

    **❓ Enter the desired largest image width (px)**

    **❓ Enter the desired largest image height (px)**

3. **View Results**

    The script will output:

    - Image dimensions
    - Number of columns and rows
    - Total tiles
    - Tile dimensions
    - Average pixel waste

## Example

The inputs below generated the calculation for tiles featured in the [example](/README.md#example):

- Dimensions: 2400 x 1500px

### Results

The printed results from the example:

```bash
Tile calculation complete!
Image dimensions = 2400 x 1500px
Columns = 10, Rows = 8
Total tiles = 80
Tile dimensions = 240.00 x 187.50px
Average pixel waste = 20.38%
```

## Contributing

Contributions are welcome. Please feel free to [submit an issue](https://github.com/overbrowsing/pruner/issues) or a [pull request](https://github.com/overbrowsing/pruner/pulls).

## License

Tile Calculator is released under the [MIT](/LICENSE) license. Feel free to use and modify it as needed.