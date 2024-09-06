# pruner.js

[![NPM version](https://img.shields.io/npm/v/prunerjs.svg)](https://www.npmjs.com/package/prunerjs)
[![npm](https://img.shields.io/npm/dt/prunerjs.svg)](https://www.npmtrends.com/prunerjs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## Overview

**pruner.js** is a JavaScript utility that enhances image handling by stitching multiple images into a single canvas. It works by dividing large images into smaller tiles and only loading the necessary tiles based on the viewport size. This approach not only reduces the total amount of data transferred but also improves performance by ensuring that only visible parts of the image are processed. By minimising data transfer and leveraging efficient image management, **pruner.js** accelerates loading times and supports sustainable web design practices.

## Install

You can include **`pruner.js`** in your project either by downloading the files or using a CDN.

### Download

- **Minified**: [pruner.min.js](https://unpkg.com/prunerjs@1.0.3/dist/pruner.min.js)
- **Unminified**: Available in the source repository.

### CDN

Link directly to the minified version using Unpkg (we recommend downloading the file to reduce HTTP requests):

```html
<script async src="https://unpkg.com/prunerjs@1.0.3/dist/pruner.min.js"></script>
```

### Package Managers

You can also install **`pruner.js`** using npm:

```bash
npm install pruner --save
```

## How It Works

### Image and Attribute Requirements

1. **Attribute (`data-pruner`)**
  - **Purpose**: This attribute holds the configuration for each image element in JSON format.
  - **Parameters**:
    - `imageName`: The base name of the images used in conjunction with the image (string).
    - `cols`: Number of columns (integer).
    - `rows`: Number of rows (integer).
    - `tileWidth`: Width of each tile in pixels (integer).
    - `tileHeight`: Height of each tile in pixels (integer).
    - `mobileBreakpoint`: The screen width in pixels below which the mobile image is loaded (integer).
    - `mobileScale`: Scale factor for mobile view (optional, numeric).
    - `imagePath`: Path to the directory where images are stored (string).

2. **Images**
  - **Name**: Ensure that `imageName` matches the base name used for the pruner tile images. For instance, if `imageName` is `landscape`, the images should be named `landscape 1.webp`, `landscape 2.webp`, and so on.
  - **File**: All image formats are supported; however, using a modern image format like WebP is recommended for further optimisation.
  - **Making Tiles**: For processing images into tiles, consider using an online tool such as [Split Image](https://pinetools.com/split-image).

## Initialize

You can initialize **`pruner.js`** using vanilla JavaScript or by setting attributes in your HTML.

### With Vanilla JavaScript

```javascript
window.onload = () => {
  new Pruner('data-pruner');
};
```

### Example HTML Setup

You can use the `data-pruner` attribute to configure how the image is processed.

```html
<img data-pruner='{"imageName": "landscape", "cols": 5, "rows": 5, "tileWidth": 300, "tileHeight": 200, "mobileBreakpoint": 768, "mobileScale":1.4, "imagePath": "assets/"}' alt="Landscape photography of mountains in New Zealand by Tobias Keller" loading="lazy">
```

- **Attribute**: `data-pruner`
  - `imageName`: `landscape`
  - `cols`: `5` (5 columns)
  - `rows`: `5` (5 rows)
  - `tileWidth`: `300` pixels
  - `tileHeight`: `200` pixels
  - `mobileBreakpoint`: `768` pixels
  - `mobileScale`: `1.4` 140%
  - `imagePath`: `/assets/` (path to images)

### Usage

1. **Include `pruner.js`** in your HTML file:
   ```html
   <script src="path/to/pruner.js"></script>
   ```

2. **Set Up Images**:
   - Ensure that `imageName` matches the base name used for the pruner tile images. For instance, if `imageName` is `landscape`, the images should be named `landscape 1.webp`, `landscape 2.webp`, and so on.
   - Add the `data-pruner` attributes to the image, specifying the name of the image, the number of columns, rows, tile width, tile height, mobile breakpoint, mobile scale factor, and image path.

### Mobile Optimization

On mobile devices (below the `mobileBreakpoint`), only the central tiles of the grid are loaded for improved performance. This is determined by the `mobileScale` parameter, which adjusts the scaling of the tiles based on the device’s screen size. For larger screens, the entire tiled image grid is constructed and displayed on a canvas.

## Results

### Methodology

To assess the performance gains from using `pruner.js` compared to loading two images for desktop and mobile, tests were conducted using the [Example HTML Setup](#example-html-setup). The example image (1500 x 1000px) was divided into a 5x5 grid, with each tile sized at 300 x 200px. All image assets are available in the [`/assets`](/assets) folder. The original image was sourced from [T. Keller on Unsplash](https://unsplash.com/photos/landscape-photography-of-lake-and-mountain-73F4pKoUkM0).

#### Example HTML Setup Test

The experiment compared two image-loading approaches:
- **Using `pruner.js`**: Loading 25 smaller tiles (300 x 200px).
- **Using Full Images**: Loading two images for desktop and mobile (1500 x 1000px and 1000 x 800px, respectively).

Additional considerations were taken into account to ensure accurate and consistent testing results:
- Google Chrome DevTools were used to standardise viewport sizes, ensuring consistency across all tests.
- The viewport height was set to 750px as an approximation for a 'banner' image.
- The number of visible tiles is dependent on viewport size and by device.
- Data savings vary based on the complexity and detail within the image tiles. Less detailed or compressed tiles result in more significant optimisation.
- JPEGs were used for this test, though a modern format like WebP is recommended for further optimisation.
- Estimated CO₂e emissions were generated using the [EcoPing 'Convert Bytes to CO2 grams' calculator](https://ecoping.earth/tools/convert-bytes-to-co2-grams/), with the Device Country and Data Centre set to the United States. These are just an approximation, but you can refer to the [Sustainable Web Design Model](https://sustainablewebdesign.org/estimating-digital-emissions/) on which the calculator's results are based.

#### Objectives

1. Measure the number of visible tiles when using `pruner.js` across different viewport sizes (mobile, medium desktop, large desktop).
2. Compare the total data transferred before and after implementing `pruner.js` for each viewport size.
3. Evaluate total size reductions between the conventional approach of using separate images for different viewport sizes and the tile-based approach with `pruner.js`, including the size of the minified script itself.
4. Estimate CO₂ emissions before and after optimisation.

### Performance Comparison: Before and After Using `pruner.js`

|                              | 📱 650px                | 💻 1100px                | 🖥️ 1680px               | 📁 All Files            |
|------------------------------|-------------------------|-------------------------|-------------------------|-------------------------|
| **Before**                   | 50 KB                   | 194 KB                  | 194 KB                  | 244 KB (2 Images)       |
| **CO₂e Before (g)**          | 0.013 g                 | 0.053 g                 | 0.053 g                 | 0.067 g                 |
| ✂️                            |                         |                         |                         |                         |
| **Tiles Shown**              | 6                       | 16                      | 20                      | 25                      |
| **After + `pruner.js` 2 KB** | 26 KB                   | 83 KB                   | 105 KB                  | 156 KB                  |
| **CO₂e After (g)**           | 0.007 g                 | 0.022 g                 | 0.029 g                 | 0.043 g                 |
| **% Saved**                  | **46%**                 | **57.1%%**              | **45.4%**               | **36.1%**               |

*Ongoing testing is being conducted to expand the sample size and further verify the results.*

## License

`pruner.js` is released under the MIT license. Feel free to use and modify it as needed.