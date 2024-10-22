# ✂️ pruner.js

[![NPM version](https://img.shields.io/npm/v/prunerjs.svg)](https://www.npmjs.com/package/prunerjs)
[![npm](https://img.shields.io/npm/dt/prunerjs.svg)](https://www.npmtrends.com/prunerjs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## Overview

`pruner.js` is a responsive image polyfill using viewport-based rendering. It works by splitting images into tiles and loading only the parts of the image visible within the viewport, like assembling a jigsaw puzzle. This method reduces storage compared to the current best practice of responsive images by eliminating the need for multiple image versions defined for specific breakpoints and reduces data transfer by avoiding the download of ‘waste pixels’—parts of the image outside the visible aperture.

The utility is designed to function not only at defined breakpoints but also dynamically across varying viewport sizes, distinguishing it from traditional responsive image methods. The tile creation process begins with the [Tile Calculator](/tile-calculator/README.md) which determines the most efficient arrangement of tiles for processing images using the [Tile Maker](/tile-maker/README.md). This tool also generates a snippet of HTML for easy installation, that also uses less HTML than the [Picture-Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) (`<picture>`), resulting in a simpler and more efficient process to responsive images.

## Install

You can include `pruner.js` in your project either by downloading the files or using a CDN. While using a third-party CDN introduces an additional HTTP request, we ensured that it is hosted is using renewable energy.

### Download

- **Minified**: [Available via pruner.min.js on unpkg.](https://unpkg.com/prunerjs@1.0.7/dist/pruner.min.js)
- **Unminified**: [Available in the source repository.](/src/pruner.js)

### CDN

Link directly to the minified version using Unpkg (we recommend downloading the file to reduce HTTP requests):

```html
<script async src="https://unpkg.com/prunerjs@1.0.7/dist/pruner.min.js"></script>
```

### Package Managers

You can also install `pruner.js` using npm:

```bash
npm install pruner --save
```

## How it Works

In the `<img>` tag, instead of using the `src` attribute to link an image, we use the `data-pruner` attribute. This attribute contains parameters in JSON format for the utility to interpret, specifying how the script should display the image tiles, where to locate them, and including other useful features.

### Parameters

⭐️ Denotes which parameters are optional.

|   | Parameter          | Description             | Details                                                                                                                                                                                                                                                                                                         | [Example Installation](#example)                  |
|---|--------------------|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|
|   | `imageName`        | Image Name              | The base name of the image files.                                                                                                                                                                                                                                                                               | `banks-of-the-seine` (banks-of-the-seine-n.webp)  |
|   | `cols`             | Columns                 | The number of vertical divisions the image is split into.                                                                                                                                                                                                                                                       | `8`                                               |
|   | `rows`             | Rows                    | The number of horizontal divisions the image is split into.                                                                                                                                                                                                                                                     | `8`                                               |
|   | `tileWidth`        | Tile Width (px)         | Specifies the width of each individual tile in pixels.                                                                                                                                                                                                                                                          | `312`                                             |
|   | `tileHeight`       | Tile Height (px)        | Specifies the height of each individual tile in pixels.                                                                                                                                                                                                                                                         | `175`                                             |
| ⭐️ | `roi`              | Region of Interest      | This attribute lets you set a specific focal point within the image. The Region of Interest adjusts the image’s focus based on the chosen tile number, ensuring that off-centre subjects are prominently displayed in the viewport.                                                                             | `5` (banks-of-the-seine-5.webp)                   |
| ⭐️ | `mobileBreakpoint` | Mobile Breakpoint (px)  | pecifies the viewport width in pixels below which the `mobileScale` parameter is activated.                                                                                                                                                                                                                     | `750`                                             |
| ⭐️ | `mobileScale`      | Mobile Scale Factor (%) | When the viewport size is below the mobileBreakpoint, the script scales the image accordingly. This scaling maintains Picture-Element functionality for effective cropping and resizing. Additionally, enlarging images can improve performance by minimising the number of tiles required for smaller screens. | `1.2` (120%)                                      |
|   | `imagePath`        | Directory for Tiles     | The file path to the directory where the image tiles are stored. This parameter is essential for locating and retrieving the image files for display.                                                                                                                                                           | `tile-maker/processed/banks-of-the-seine/`        |

## How to Use

### Tiles

1. **Calculating Tiles**: The best way to create tiles is by first calcualting the optimal arrangement by using the [Tile Calculator](/tile-calculator/README.md). This tool will help you generate the best configuration for your project and will share the parameters needed for the next step.

2. **Making Tiles**: Once you have your configuration from the Tile Calculator, use the [Tile Maker](/tile-maker/README.md) to process your images and create the tiles. Tile Maker will output the tiles and an optional HTML snippet for easy installation. You can also use a free online tool such as [Split Image](https://pinetools.com/split-image).

3. **Formatting Images**: If you used the [Tile Maker](/tile-maker/README.md), you can ignore this section as the tool handles naming and formatting automatically. For manual setups, ensure that the `imageName` matches the base name for the tile images (e.g., banks-of-the-seine-1.webp, banks-of-the-seine-2.webp, etc.) and that the images are named sequentially. `pruner.js` only supports the WebP image format.

### Installation

1. **Insert the HTML Snippet**: If you used the [Tile Maker](/tile-maker/README.md), locate the exported HTML snippet in the image folder associated with the image name within the [processed folder](/tile-maker/processed/). Copy this snippet into your web project where you want to display the images.

2. **Update Parameters**: Update the image paths within the HTML snippet to point to the location of your tiles. Make sure to also configure any optional parameters (e.g.,`ROI`, `mobileBreak`, `mobileScale`) as necessary to suit your needs. 

3. **Include `pruner.js`**: To include the utility in your project. Add the either option before the closing `</html>` tag in your HTML file
    - **Option 1**: [Using locally](#download).

      ```html
      <script async src="/your-path-here/pruner.js"></script>
      ```

    - **Option 2**: [Using a CDN](#cdn).

      ```html
      <script async src="https://unpkg.com/prunerjs@1.0.7/dist/pruner.min.js"></script>
      ```

## Example Installation

Once you have completed the above steps, your `<img>` tag snippet should resemble the following. The optional attributes (`ROI`, `mobileBreak`, `mobileScale`) were added in afterwards. The original snippet can be viewed [here](/tile-maker/processed/banks-of-the-seine/data-pruner.html).

Example setup using [Banks of the Seine, Vétheuil, 1880 by Claude Monet](https://www.nga.gov/collection/art-object-page.46652.html).

```html
<img data-pruner='{"imageName": "banks-of-the-seine", "cols": 8, "rows": 8, "tileWidth": 312, "tileHeight": 175, "roi": 5, "mobileBreakpoint": 750, "mobileScale": 1.2, "imagePath": "tile-maker/processed/banks-of-the-seine/"}' alt="Banks of the Seine, Vétheuil, 1880 by Claude Monet" loading="lazy">
```

- `imageName`: `banks-of-the-seine`
- `cols`: `8` (8 columns)
- `rows`: `8` (8 rows)
- `tileWidth`: `312` (pixels)
- `tileHeight`: `175` (pixels)
- `roi`: 5 (Tile number, banks-of-the-seine-5.webp)
- `mobileBreakpoint`: `750` (pixels)
- `mobileScale`: `1.2` (120%)
- `imagePath`: `tile-maker/processed/banks-of-the-seine/` (path to images)

## Performance

This is a live project, and we are in the process of developing a methodology to evaluate the performance the utility and tools in this project.

## Pruning

The name was chosen based on the practice of pruning in horticulture, the careful trimming of plants to remove excess or dead foliage and promote healthier growth. In a similar way, Pruning away unnecessary waste pixels, ensuring only the essential parts of an image are loaded based on the viewport. Just as pruning in nature encourages a plant to thrive by focusing its energy on the most important branches, `pruner.js` optimises web performance by reducing excess data transfer, focusing on what is immediately needed to display the image effectively. A name related to nature was fitting and thematic, aligning with the principles of sustainable web design.

## Contributing

Contributions are welcome. Please feel free to submit issues or pull requests.

## License

`pruner.js` is released under the [MIT](/LICENSE) license. Feel free to use and modify it as needed.