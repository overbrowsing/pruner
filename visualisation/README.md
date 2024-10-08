# `pruner.js` Visualisation Tool

The `pruner.js` visualisation tool is a Python application designed to optimise image tiling across different viewport sizes. It generates a graph displaying how many image tiles fit within a viewport, taking into account various variables defined in `pruner.js`. By comparing its weighted average with a simulated result from using the same size image using CSS `background-size: cover`, the tool identifies the most efficient tile configuration, ensuring optimal asset utilisation and performance across a range of viewport dimensions.

## Features

- Calculates the number of tiles that can fit in a viewport for both mobile and desktop views.
- Visualises the relationship between viewport width and the number of tiles displayed horizontally.
- Handles dynamic scaling for mobile views by applying a scaling factor.
- Highlights the mobile breakpoint on the graph in red.
- Creates a orange "Current Distribution Line" to display the weighted average of visible tiles across various viewport widths for comparison.
- Creates a green "Target Distribution Line" to represent an ideal tile distribution.

## "Target Distribution Line" Equation

The "Target Distribution Line" illustrates the optimal tile arrangement by emulating the CSS `background-size: cover` behaviour. It simulates a single background image by reconstructing its full size from the tile properties specified in the application. This green line serves as a benchmark for the most efficient distribution of image tiles across different viewport sizes.

### Aspect Ratios
![Aspect Ratio of the Image](https://latex.codecogs.com/svg.latex?{\color{white}\text{Aspect%20Ratio%20Image}%20=%20\frac{W_i}{H_i}})<br>
![Aspect Ratio of the Viewport](https://latex.codecogs.com/svg.latex?{\color{white}\text{Aspect%20Ratio%20Viewport}%20=%20\frac{W_v}{H_v}})

### Determine Scaling Factor
![Scaling Setup](https://latex.codecogs.com/svg.latex?{\color{white}\text{If%20}\frac{W_v}{H_v}%20>%20\frac{W_i}{H_i}})<br>
![Scale Factor](https://latex.codecogs.com/svg.latex?{\color{white}\text{Scale%20Factor}%20=%20\frac{W_v}{W_i}})<br>
![Scaled Height](https://latex.codecogs.com/svg.latex?{\color{white}\text{Scaled%20Height}%20=%20\frac{W_v}{\text{Aspect%20Ratio}_{\text{image}}}})

### Otherwise
![Scale Factor](https://latex.codecogs.com/svg.latex?{\color{white}\text{Scale%20Factor}%20=%20\frac{H_v}{H_i}})<br>
![Scaled Height](https://latex.codecogs.com/svg.latex?{\color{white}\text{Scaled%20Height}%20=%20H_v})

### Coverage
![Coverage](https://latex.codecogs.com/svg.latex?{\color{white}\text{Coverage}%20=%20\left(\frac{W_v}{W_i}\right)%20\times%20\left(\frac{H_v}{H_i}\right)})

### Where
![Width of the Image](https://latex.codecogs.com/svg.latex?{\color{white}W_i%20=%20\text{Width%20of%20the%20image}})<br>
![Height of the Image](https://latex.codecogs.com/svg.latex?{\color{white}H_i%20=%20\text{Height%20of%20the%20image}})<br>
![Width of the Viewport](https://latex.codecogs.com/svg.latex?{\color{white}W_v%20=%20\text{Width%20of%20the%20viewport}})<br>
![Height of the Viewport](https://latex.codecogs.com/svg.latex?{\color{white}H_v%20=%20\text{Height%20of%20the%20viewport}})<br>

## Current Distribution Line

The "Current Distribution Line" illustrates the number of tiles displayed across different viewport sizes. It allows for a comparison with the "Target Distribution Line," helping users assess how closely their layout aligns with the ideal or average distribution. This comparison aids in making adjustments to the layout to better match the target distribution.

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

1. Clone or Download the repository.
2. Run the `app.py` application to generate the graph.

### Running the Application

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

When you run the application, you should see a graph like this:

![Graph Example](./example.png)

## Customisation

You can adjust the following parameters in the application to fine-tune the visualisation:

- `viewport_widths`: Range of viewport widths (pixels), defined using `np.linspace(start, end, num_points)`. Modify `start`, `end`, and `num_points` for custom ranges and step sizes.
- `viewport_height`: Viewport height (in pixels).
- `cols`, `rows`: Maximum number of columns and rows in the tile grid.
- `tile_width`, `tile_height`: Size of each tile (in pixels).
- `mobile_scale`: Scale factor applied to tiles in mobile viewports (e.g., `1.2` = 120% scaling).
- `mobile_breakpoint`: Pixel width threshold for switching to mobile scaling.