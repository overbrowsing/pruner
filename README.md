# pruner.js

[![NPM version](https://img.shields.io/npm/v/prunerjs.svg)](https://www.npmjs.com/package/prunerjs)
[![npm](https://img.shields.io/npm/dt/prunerjs.svg)](https://www.npmtrends.com/prunerjs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## Overview

This JavaScript utility optimizes image handling by stitching multiple images into a single canvas. It allows developers to use background images while enhancing performance and supporting sustainable web design practices. By reducing the amount of data transferred, it significantly improves loading times.

## Install

You can include **pruner.js** in your project either by downloading the files or using a CDN.

### Download

- **Minified**: [pruner.min.js](https://unpkg.com/prunerjs@1.0.0/dist/pruner.min.js)
- **Unminified**: Available in the source repository.

### CDN

Link directly to the minified version using Unpkg:

```html
<script src="https://unpkg.com/prunerjs@1.0.0/dist/pruner.min.js"></script>
```

### Package Managers

You can also install **pruner.js** using npm:

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
  - **File**: All image formats are supported; however, we recommend using a modern image format like WebP for improved optimisation and a more sustainable web design.

### Performance Results

**Before and After Using Pruner. [Photograph by Keller, T. Unsplash.](https://unsplash.com/photos/landscape-photography-of-lake-and-mountain-73F4pKoUkM0)**

- **Original (Desktop and Mobile)**: 244 KB
- **Optimized with Pruning**: 154 KB (36.89% reduction)

*Note: Testing is ongoing to further optimize and verify the results.*

## Initialize

You can initialize **pruner.js** using vanilla JavaScript or by setting attributes in your HTML.

### With Vanilla JavaScript

```javascript
window.onload = () => {
  new Pruner('data-pruner');
};
```

### Example HTML Setup

You can use the `data-pruner` attribute to configure how the image is processed.

```html
<img id="landscape" alt="landscape photography of mountains" data-pruner='{"cols": 3, "rows": 1, "tileWidth": 500, "mobileBreakpoint": 768, "imagePath": "/assets/"}'>
```

- **Attribute**: `data-pruner`
  - `imageName`: `landscape` pixels
  - `cols`: `5` (5 columns)
  - `rows`: `5` (5 row)
  - `tileWidth`: `300` pixels
  - `tileHeight`: `200` pixels
  - `mobileBreakpoint`: `768` pixels
  - `imagePath`: `/assets/` (path to images)

### Usage

1. **Include `pruner.js`** in your HTML file:
   ```html
   <script src="path/to/pruner.js"></script>
   ```

2. **Set Up Images**:
   - Ensure images are named according to the base name set in the `id` attribute, followed by a number (e.g., `landscape 1.jpg`, `landscape 2.jpg`).
   - Add the `data-pruner` attribute to the image, specifying the number of columns, rows, tile width, mobile breakpoint, and image path.

### Mobile Optimization

On mobile devices (below the `mobileBreakpoint`), only the central tiles of the grid are loaded for improved performance. This is determined by the `mobileScale` parameter, which adjusts the scaling of the tiles based on the device’s screen size. For larger screens, the entire tiled image grid is constructed and displayed on a canvas.

## License

pruner.js is released under the MIT license. Feel free to use and modify it as needed.