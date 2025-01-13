# Pruner.js

[![NPM version](https://img.shields.io/npm/v/prunerjs.svg)](https://www.npmjs.com/package/prunerjs)
[![npm](https://img.shields.io/npm/dt/prunerjs.svg)](https://www.npmtrends.com/prunerjs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)
[![CO₂ Shield](https://img.shields.io/badge/CO₂-A_0.10g-20AE69)](https://overbrowsing.com/projects/co2-shield)

## Overview

Inspired by the practice in horticulture—the targeted removal of unhealthy or unwanted parts of a plant to promote healthier growth—pruning addresses the challenges of HTML5.1 responsive images, which rely on multiple versions for specific viewports but often result in errors, complex markup, and what we term pixel waste—image data extending beyond the visible aperture—by adapting to different viewport sizes.

Pruning uses a tile-based approach, where a base image is divided into smaller sections (tiles) that are dynamically assembled, like a jigsaw puzzle, based on the viewport size. This responsive image delivery method leverages viewport-based rendering (VBR) to load only the portions of image data to cover the visible aperture, ensuring efficient resource use. By calculating and serving tiled images optimised for a range of [common viewport sizes](https://gs.statcounter.com/screen-resolution-stats), pruning eliminates the reliance on predefined breakpoints, offering a more adaptable solution for responsive image delivery.

## Features

- **Load Only What You See**: Delivers only visible portions of an image, reducing excess image data (waste pixels).
- **Save Data**: Reduces the total server-side footprint required for HTML5.1 responsive images.
- **Better Responsive Images**: Dynamically adjusts images across various screen resolutions, surpassing HTML5.1's method with fixed breakpoints.
- **Easy to Use**: The [Tile Maker](https://overbrowsing.com/projects/pruner) web application simplifies tile formatting, compression, and HTML snippet generation.
- **Art Direction**: Define a focal point and custom scaling breakpoints for smaller devices.
- **Screen Density**: Automatically adjusts for 1x and 2x screen densities.
- **Client-Side Processing**: Operates directly in the browser to generate responsive images based on viewport size.

## Install

### Download

Download the minified or unminified version of Pruner.js:

- **Minified**: Available in the [distributable (dist) folder](/dist/pruner.min.js).
- **Unminified**: Available in the [source (src) folder](/src/pruner.js).

### CDN

Use this script element to include the minified version of Pruner.js directly in your project:

```html
<script async src="https://unpkg.com/prunerjs/dist/pruner.min.js"></script>
```

### Package Managers

You can also install Pruner.js using npm:

```bash
npm install prunerjs
```

Or using yarn:

```bash
yarn add prunerjs
```

## How it Works

Instead of the `src` attribute within the `<img>` tag, the `data-pruner` attribute is used. This attribute contains JSON-formatted parameters that are interpreted by Pruner.js to assemble the tiles, determine their positioning, and enable additional customisation. The table below outlines all the names of the parameters within the `data-pruner` attribute in JSON format, their description, requirement and their functions.

### Parameters

*⭐️ Denotes which parameters are optional.*

|   | Parameter | Description         | Details                                                                                                                                                                      | [Demo](#demo)                                    |
|---|-----------|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|
|   | `name`    | Image Name          | The base name of the tiles.                                                                                                                                                  | `banks-of-the-seine` (banks-of-the-seine-n.webp) |
|   | `tile`    | Tile Grid           | The number of columns and rows the image is split into.                                                                                                                      | `14 6` (14 columns and 6 rows)                   |
| ⭐️ | `roi`     | Region of Interest  | The region of interest adjusts the image's focus based on the chosen tile number, ensuring that off-centred subjects are prominently displayed in the viewport.              | `5` (banks-of-the-seine-5.webp)                  |
| ⭐️ | `scale`   | Scale Factor        | The scale parameter defines how much to enlarge the image when the viewport width is at or below the breakpoint in pixels. Formatted as [scale] [breakpoint] (e.g. 1.2 750). | `1.2 750` (120% 750w)                            |
|   | `path`    | Directory for Tiles | The file path to the directory where the tiles are saved. This parameter is required for locating and retrieving the image files for display.                                | `assets/media/banks-of-the-seine/`               |

## How to Use

1. **Tile Maker**: Use the [Tile Maker](https://overbrowsing.com/projects/pruner) web application to generate the tiles and HTML snippet.

2. **Update HTML Snippet**: Update the `path` parameter in the HTML snippet to point to your tiles, along with optional parameters like `roi` and `scale`. Remember to update the image `alt` text as well.

3. **Include Pruner.js**: To include the utility in your project. Add either option before the closing `</html>` tag in your HTML file.
    - **Option 1**: [Download](https://overbrowsing.com/projects/pruner).

      ```html
      <script async src="/YOUR-PATH-HERE/pruner.min.js"></script>
      ```

    - **Option 2**: [CDN](#cdn).

      ```html
      <script async src="https://unpkg.com/prunerjs/dist/pruner.min.js"></script>
      ```

## Demo

[**→ Open Demo**](https://overbrowsing.com/pruner)

The painting [*Banks of the Seine, Vétheuil*, by Claude Monet](https://www.nga.gov/collection/art-object-page.46652.html) was processed using the [Tile Maker](https://overbrowsing.com/projects/pruner) web application, which calculated that the image should be split into an 14x6 grid. Each tile measuring 137x180px, resulting in a total of 84 tiles and an average pixel waste of 12.47% across [common screen resolutions](https://gs.statcounter.com/screen-resolution-stats). The generated HTML `<img>` tag snippet for this image is as follows:

```html
<img data-pruner='{"name": "banks-of-the-seine", "tile": "14 6", "roi": 5, "path": "YOUR-PATH-HERE/"}' alt="YOUR-ALT-TEXT-HERE">
```

The `path` and the optional `scale` parameter, along with the `alt` attribute, were then updated afterwards.

```html
<img data-pruner='{"name": "banks-of-the-seine", "tile": "14 6", "roi": 5, "scale": "1.2 750", "path": "assets/media/banks-of-the-seine/"}' alt="Banks of the Seine, Vétheuil, 1880 by Claude Monet">
```

*⭐️ Denotes which parameters are optional.*

|   | Parameter | Description         | Value                              |
|---|-----------|---------------------|------------------------------------|
|   | `name`    | Image Name          | `banks-of-the-seine`               |
|   | `tile`    | Tile Grid           | `14 6` (14 columns and 6 rows)     |
| ⭐️ | `roi`     | Region of Interest  | `5` (banks-of-the-seine-5.webp)    |
| ⭐️ | `scale`   | Scale Factor        | `1.2 750` (120% 750w)              |
|   | `path`    | Directory for Tiles | `assets/media/banks-of-the-seine/` |

## Research

We are preparing a research paper evaluating Pruner.js against HTML5.1 responsive image techniques. The results will be added to this README once published.

## Contributing

Contributions are welcome. Please feel free to [submit an issue](https://github.com/overbrowsing/pruner/issues) or a [pull request](https://github.com/overbrowsing/pruner/pulls).

## License

Pruner.js is released under the [MIT](/LICENSE) license. Feel free to use and modify it as needed.