# 🧩 Tile Maker

## Overview

Tile Maker is a Python application designed to process images for web projects that use `pruner.js`. It splits images into a grid of tiles, offering options for resizing, custom grid sizes, image formatting, and compression. Additionally, the application can export HTML snippets for easy embedding into web pages.

## How it Works

- **Single or Batch Processing**: The application allows you to process either a single image (one) or all images within a [target folder](/tools/tile-maker/target/). If you choose to process all images, the tool automatically detects all supported image formats (.png, .jpg, .jpeg, .webp) in the folder and processes them sequentially.
- **Optional Resizing**: Before splitting the image into tiles, the tool gives you the option to resize the image to a custom width and height. This feature is optional but useful if you want to adjust the image's resolution for optimisation or if you're working with particularly large images that need resizing before processing.
- **Tile Creation**: The image is divided into a grid based on the number of columns and rows specified. The script calculates the individual tile dimensions by dividing the image's width by the number of columns and the height by the number of rows.
- **Compression and Formatting**: Each tile is saved as an individual WebP image, which reduces file size by [25% to 34% compared to JPEGs](https://developers.google.com/speed/webp/docs/webp_study#conclusion). This meets the [“serve images in modern formats”](https://developer.chrome.com/docs/lighthouse/performance/uses-webp-images) guideline in Google Lighthouse and aligns with [sustainable web design](https://github.com/Sustainable-WWW/Sustainable-Web-Practices-Wiki/blob/main/Wiki/Image/Image_Formats.md) practices. WebP is [widely supported across major browsers](https://caniuse.com/webp), unlike AVIF which is [newly available across major browsers](https://caniuse.com/avif). Tiles are compressed with a user-defined quality setting (default: 80), ensuring they also meet the ["efficiently encode images"](https://developer.chrome.com/docs/lighthouse/performance/uses-optimized-images) guideline.
- **HTML Snippet Export**: If you choose to export an HTML snippet, the tool generates a HTML file with an `<img>` tag for each image processed. The tag includes the data-pruner attribute, which contains the image name, the tile arrangement (number of columns and rows). This HTML code can then be embedded in your web pages to dynamically load the tiled images using `pruner.js`.

## Requirements

- **Python 3.x**: Ensure that you have Python 3.x installed on your system. You can download it from the [official Python website](https://python.org/downloads/).
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
        - **❓ Width**
        - **❓ Height**

      **❓ Do you want to set the compression quality? (y/n)**
      - ***No*** — Skip defining the compression quality (default is 80).
      - ***Yes*** — Enter the compression quality.
        - **❓ Enter the compression quality (0 to 80)**

      **❓ Enter the number of columns and rows to split the image into**
      - ***No*** — Skip resizing and proceed.
      - ***Yes*** — Set the number of columns and rows for the grid.
        - **❓ Number of columns**
        - **❓ Number of Rows**
        
      **❓ Do you want to export an HTML snippet? (y/n)**
      - ***Yes*** — Process images, export the HTML snippet and view results.
      - ***No*** — Process images and view results.

3.	**View Results**

    The script will output:

      - Total tiles created
      - Total size of tiles (KB)
      - Number of columns and rows

## Example

The inputs below generated the tiles and HTML snippet featured in the [example](/README.md#example):

- Image: [banks-of-the-seine.jpg](/tools/tile-maker/target/banks-of-the-seine.jpg)
- Dimensions: 1920 x 1080px
- Compression: 50
- Columns: 8, Rows: 6

```bash
Do you want to process all images or just one? (all/one): one
Enter the target image name (with extension): banks-of-the-seine.jpg
Do you want to resize the image before processing (y/n): y
Width (px): 1920
Height (px): 1080
Do you want to set the compression quality? (y/n): y
Enter the compression quality (0 to 80): 50
Number of columns: 8
Number of rows: 6
Do you want to export the HTML snippet? (y/n): y
```

### Results

The printed results from the example:

```bash
Processing banks-of-the-seine.jpg complete!
Tiles created = 48
Total size of tiles = 321.59 KB
Columns = 8, Rows = 6
Tile dimensions = 240 x 180px
```

### Tiles

The exported example tiles can be be found [here](/tools/tile-maker/processed/banks-of-the-seine/).

### HTML Snippet

Below is the exported example HTML snippet from the file [data-pruner.html](/tools/tile-maker/processed/banks-of-the-seine/data-pruner.html).

```html
<img data-pruner='{"name": "banks-of-the-seine", "tile": "8 6", "path": "your-path-here/"}' alt="" loading="lazy">
```

## Contributing

Contributions are welcome. Please feel free to [submit an issue](https://github.com/overbrowsing/pruner/issues) or a [pull request](https://github.com/overbrowsing/pruner/pulls).

## License

Tile Maker is released under the [MIT](/LICENSE) license. Feel free to use and modify it as needed.