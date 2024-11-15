# 🧩 Tile Maker

## Overview

Tile Maker is a Python application designed to process images for web projects that use `pruner.js`. It splits images into a grid of tiles, offering options for resizing, custom grid sizes, image formatting, and compression. Additionally, the application can export HTML snippets for easy embedding into web pages.

## How it Works

- **Processing a Single or Multiple Images**: The application allows you to process either a single image (one) or all images within a [target folder](/tools/tile-maker/target/). If you choose to process all images, the tool automatically detects all supported image formats (.png, .jpg, .jpeg, .webp) in the folder and processes them sequentially.
- **Resizing the Image (Optional)**: Before splitting the image into tiles, the tool gives you the option to resize the image to a custom width and height. This feature is optional but useful if you want to adjust the image’s resolution for optimisation or if you’re working with particularly large images that need resizing before processing.
- **Splitting the Image into Tiles**: The image is divided into a grid based on the number of columns and rows specified. The script calculates the individual tile dimensions by dividing the image’s width by the number of columns and the height by the number of rows.
- **Compression and Formatting**: Each tile is saved as an individual image in the WebP format, which addresses the [“serve images in modern formats”](https://developer.chrome.com/docs/lighthouse/performance/uses-webp-images) opportunity within the Google Lighthouse test. The tiles are saved with a compression quality setting of 80 to ensure they meet the ["efficiently encode images"](https://developer.chrome.com/docs/lighthouse/performance/uses-optimized-images) opportunity within the Google Lighthouse test.
- **HTML Snippet Generation**: If you choose to export an HTML snippet, the tool generates a HTML file with an `<img>` tag for each image processed. The tag includes the data-pruner attribute, which contains the image name, the grid dimensions (number of columns and rows). This HTML code can then be embedded in your web pages to dynamically load the tiled images using `pruner.js`.
-	**Batch Processing and Summary**: If processing multiple images, the tool provides an overall summary at the end, including the total number of tiles created for all images, the size of the tiles, and the grid dimensions used for the process.

## Requirements

- **Python 3.x**: Ensure that you have Python 3.x installed on your system. You can download it from the [official Python website](https://www.python.org/downloads/).
- **Pillow**: The Pillow library is used for image manipulation (resizing, cropping, and saving images). You can install it via pip:

  ```bash
  pip install pillow
  ```

### Folder Structure

Set up the folders as outlined below. Then place the images that you wish to process in the [target folder](/tools/tile-maker/target/). The [processed folder](/tools/tile-maker/processed/) will store the exported tiles and any generated HTML snippets, each within a subfolder named after the target image.

```bash
tile-maker/
├── target/         # Target images to be processed
├── processed/      # Exported tiles and optional HTML snippet
└── tile-maker.py   # Tile Maker
```

### Add Your Images

Place your images to be processed in the [target folder](/tools/tile-maker/target/). Ensure they are in a supported format (e.g., .png, .jpg, .jpeg, .webp).

## Initialize

1. **Run the Script**

    To use the script, simply run the Python file or execute using the command:

    ```bash
    python tools/tile-maker/tile-maker.py
    ```

2. **Follow the Prompts**

    Once executed follow the prompts (❓):

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

    The script will output:

      - Total tiles created
      - Total size of tiles (KB)
      - Number of columns and rows

## Example

The inputs below generated the tiles and HTML snippet featured in the [example setup](/README.md#example-installation):

- Image: [banks-of-the-seine.jpg](/tools/tile-maker/target/banks-of-the-seine.jpg)
- Dimensions: 2400 x 1500px
- Columns: 10, Rows: 8

### Results

The printed results from the example:

```bash
Processing complete for all images!
Total tiles created: 80
Average total size of tiles: 974.19 KB
Columns: 10, Rows: 8
```

### Tiles

The exported tiles can be be found [here](/tools/tile-maker/processed/banks-of-the-seine/).

### HTML Snippet

Below is the exported HTML snippet from the file [data-pruner.html](/tools/tile-maker/processed/banks-of-the-seine/data-pruner.html).

```html
<img data-pruner='{"name": "banks-of-the-seine", "tile": "10 8", "path": "your-path-here/"}' alt="" loading="lazy">
```

## Contributing

Contributions are welcome. Please feel free to [submit an issue](https://github.com/overbrowsing/pruner/issues) or a [pull request](https://github.com/overbrowsing/pruner/pulls).

## License

`pruner.js` is released under the [MIT](/LICENSE) license. Feel free to use and modify it as needed.