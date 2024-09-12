# `pruner.js` Visualisation Tool

This Python application generates a graph to visualise the number of image tiles that can fit in a viewport based on viewport width. The application calculates and then shows how many tiles fit in both mobile and desktop views, adjusting tile size for mobile based on a scaling factor. The `pruner.js` visualisation tool is designed to help determine the most efficient image tiling setup for your project based on the variables provided.

## Features

- Calculates the number of tiles that can fit in a viewport for both mobile and desktop views.
- Visualises the relationship between viewport width and the number of tiles displayed horizontally.
- Handles dynamic scaling for mobile views by applying a scaling factor.
- Highlights the mobile breakpoint (e.g., 768 pixels) on the graph.
- Includes a "Target Distribution" to represent an ideal tile distribution.
- Adds an "Average Distribution Line" to show the average number of tiles across viewport widths for comparison.

## Target Distribution Line

The "Target Distribution Line" represents the ideal tile arrangement. It serves as a benchmark for the optimal distribution of image tiles across various viewport size. Our goal is to utilise a comprehensive dataset to illustrate this ideal distribution, taking into account factors such as CO2e savings across different viewports.

## Current Distribution Line

The "Current Distribution Line" illustrates the actual number of tiles displayed across different viewport sizes. It allows for a comparison with the "Target Distribution Line," helping users assess how closely their layout aligns with the ideal or average distribution. This comparison aids in making adjustments to the layout to better match the target distribution.

## Installation

### Requirements

Make sure you have Python installed. You will also need the following Python libraries:
- `numpy`
- `matplotlib`

You can install these libraries using `pip`:

```bash
pip install numpy matplotlib
```

## Usage

1. **Clone or Download** the repository.
2. Run the `app.py` script to generate the graph.

### Running the Script

```bash
python app.py
```

This will generate a graph showing the number of tiles that can fit horizontally based on the viewport width. The graph will also highlight the mobile breakpoint and display both the Happy Medium Line and the Average Distribution Line.

### Code Overview

The code calculates and plots how many image tiles fit within different viewport sizes. It includes:

- **Viewport Width**: The width of the browser or screen.
- **Tile Dimensions**: Each tile has a defined width (`tile_width`) and height (`tile_height`).
- **Grid Dimensions**: The number of rows (`rows`) and columns (`cols`) in the image grid.
- **Mobile Scaling Factor**: A factor applied to reduce the size of tiles in mobile view.
- **Mobile Breakpoint**: A predefined viewport width that defines when mobile scaling should occur.

## Example Graph

When you run the script, you should see a graph like this:

![Graph Example](./example.png)

## Customisation

You can adjust the following parameters in the script:

Here’s an updated version of the README with customisation options for all parameters:

## Customisation

You can adjust the following parameters in the script to fine-tune the visualisation:

- `viewport_widths`: Range of viewport widths (pixels), defined using `np.linspace(start, end, num_points)`. Modify `start`, `end`, and `num_points` for custom ranges and step sizes.
- `viewport_height`: Viewport height (in pixels).
- `cols`, `rows`: Maximum number of columns and rows in the tile grid.
- `tile_width`, `tile_height`: Size of each tile (in pixels).
- `mobile_scale`: Scale factor applied to tiles in mobile viewports (e.g., `1.2` = 120% scaling).
- `mobile_breakpoint`: Pixel width threshold for switching to mobile scaling.