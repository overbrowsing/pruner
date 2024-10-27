# 🧩 Tile Maker

## Overview

Tile Maker is a Python application designed to process images for web projects that use `pruner.js`. It splits images into a grid of tiles, offering options for resizing, custom grid sizes, image formatting, and compression. Additionally, the application can export HTML snippets for easy embedding into web pages.

## Features

- Process a single image or multiple images in bulk.
- Option to resize the image before splitting it into tiles.
- Customisable grid size – choose how many columns and rows to split the image into.
- File names are automatically formatted, compressed, and their extensions are changed to .webp.
- HTML snippet export feature – generates HTML code to embed the tiled images in a project using `pruner.js`.
- Supports the following image formats: .png, .jpg, .jpeg, .webp.

## Requirements

- **Python 3.x**
- **Pillow**: (PIL) library for image manipulation

You can install Pillow using:

```bash
pip install pillow
```

### Folder Structure

Set up the folders as outlined below. Then place the images that you wish to process in the [target folder](/tools/tile-maker/target/). The [processed folder](/tools/tile-maker/processed/) will store the exported tiles and any generated HTML snippets, each within a subfolder named after the target image.

```bash
tile-maker/
├── target/        # Target images to be processed
├── processed/     # Exported tiles and optional HTML snippet
└── tile-maker.py  # Tile Maker application
```

### Add Images

Place your images to be processed in the [target folder](/tools/tile-maker/target/). Ensure they are in a supported format (e.g., .png, .jpg, .jpeg, .webp).

## Initialize

1. **Run the application or execute using the command:**

    ```
    python tile-maker.py
    ```

2. **Follow the Prompts (❓)**

    **❓ Do you want to process all images in the target folder or just one image? (all/one)**
    - ***all*** — Process all images inside the [target folder](/tools/tile-maker/target/).
    - ***one*** —  Enter the name of the target image (with extension, e.g. banks-of-the-seine.jpg)

    **❓ Do you want to resize the image? (y/n)**
    - ***No*** — Skip resizing and proceed.
    - ***Yes*** — Enter the overall size of the image in pixels (width and height).
      - **❓ Width**:
      - **❓ Height**:

    **❓ Enter the number of columns and rows to split the image into**
    - ***No*** — Skip resizing and proceed.
    - ***Yes*** — Set the number of columns and rows for the grid.
      - **❓ Number of columns**:
      - **❓ Number of Rows**:
    
    **❓ Do you want to export an HTML snippet? (y/n)**
    - ***Yes*** — Finish processing and export the HTML snippet.
    - ***No*** — Finish processing images.

3.	**View Results**
  - Total tiles created
  - Total size of tiles (KB)
  - Number of columns and rows
  - Tile dimensions (px)

## Example Usage

The inputs below generated the tiles and HTML snippet featured in the [example setup](/README.md#example-installation):

- Image: [banks-of-the-seine.jpg](/tools/tile-maker/target/banks-of-the-seine.jpg)
- Dimensions: 2400 x 1500px
- Columns: 9, Rows: 9

### Results

The printed results from the example setup:

```bash
Processing complete for all images!
Total tiles created: 81
Average total size of tiles: 984.50 KB
Columns: 9, Rows: 9
```

### Tiles

The exported tiles can be be found [here](/tools/tile-maker/processed/banks-of-the-seine/).

### HTML Snippet

Below is the exported HTML snippet from the file [data-pruner.html](/tools/tile-maker/processed/banks-of-the-seine/data-pruner.html).

```html
<img data-pruner='{"imageName": "banks-of-the-seine", "cols": 8, "rows": 8, "tileWidth": 312, "tileHeight": 175, "imagePath": "/your-path-goes-here"}' alt="" loading="lazy">
```