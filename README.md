# pruner.js

[![NPM version](https://img.shields.io/npm/v/prunerjs.svg)](https://www.npmjs.com/package/prunerjs)
[![npm](https://img.shields.io/npm/dt/prunerjs.svg)](https://www.npmtrends.com/prunerjs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)
[![CO₂ Shield](https://img.shields.io/badge/CO₂-A_0.17g-20AE69)](https://overbrowsing.com/projects/co2-shield)

## Overview

`pruner.js` is a responsive image Javascript utility using viewport-based rendering. It works by splitting images into tiles and loading only the parts of the image visible within the viewport, like assembling a jigsaw puzzle. This method reduces server-side footprints compared to the current best practice of responsive images by eliminating the need for multiple image versions defined for specific breakpoints and reduces data transfer by minimising pixel waste—parts of the image outside the visible aperture.

The utility is designed to function not only at defined breakpoints but also dynamically across varying viewport sizes, distinguishing it from traditional responsive image methods. The tile creation process begins with the [Tile Calculator](/tools/tile-calculator/README.md) which determines the most efficient arrangement of tiles for processing images using the [Tile Maker](/tools/tile-maker/README.md). This tool also generates a HTML snippet for easy installation, that also uses less HTML than the [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) element, and in some cases the [`srcset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset) image attribute, resulting in a simpler and more efficient process to responsive images.

The name was chosen based on the practice of [pruning in horticulture](https://en.wikipedia.org/wiki/Pruning): the practice of targetted removal of unhealthy or unwanted parts of a plant to promote healthier growth. A name related to nature was fitting and thematic, aligning with the principles of [sustainable web design](https://sustainablewebdesign.org).

## Features

- **Load Only What You See**: Servers only the parts of an image that are visible on the screen and reduces unnecessary data transfer by not loading hidden sections of images (waste pixels).
- **Save Data**: Reduces the number of images needed for responsive images saving storage server-side.
- **Better Responsive Images**: Provides dynamic viewport-based rendering of images across a range of viewports, rather than just a few predefined breakpoints like the [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) element or the [`srcset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset) image attribute.
- **Easy to Use**: The [Tile Calculator](/tools/tile-calculator/README.md) automates the calculation, while the [Tile Maker](/tools/tile-maker/README.md) handles formatting and compression of tiles, as well as the generation of a single line of HTML for easy installation.
- **Art Direction**: Allows you to set a focal point in the image and specify breakpoints for image scaling on smaller form factors.
- **Client-Side Functionality**: Operates in the browser with a small piece of Javascript to dynamically create auto-scaling images based on the viewport size.

## Install

### Download

Download the minified or unminified version of `pruner.js`:

- **Minified**: Available in the [distributable (dist) folder](/dist/pruner.min.js).
- **Unminified**: Available in the [source (src) folder](/src/pruner.js).

### CDN

Use this script element to include the minified version of `pruner.js` directly in your project:

```html
<script async src="https://unpkg.com/prunerjs@1.1.8/dist/pruner.min.js"></script>
```

### Package Managers

You can also install `pruner.js` using npm:

```bash
npm install prunerjs --save
```

## How it Works

In the `<img>` element, instead of using the `src` attribute to link an image, we use the `data-pruner` attribute. This attribute contains parameters in JSON format for the utility to interpret, specifying how the script should display the image tiles, where to locate them, and including other useful features.

### Parameters

*⭐️ Denotes which parameters are optional.*

|   | Parameter | Description         | Details                                                                                                                                                                                                                                               | [Example](#example)                              |
|---|-----------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|
|   | `name`    | Image Name          | The base name of the image files.                                                                                                                                                                                                                     | `banks-of-the-seine` (banks-of-the-seine-n.webp) |
|   | `tile`    | Tile Grid           | The number of columns and rows the image is split into.                                                                                                                                                                                               | `8 6` (8 columns and 6 rows)                     |
| ⭐️ | `roi`     | Region of Interest  | This parameter lets you set a specific focal point within the image for art direction. The region of interest adjusts the image's focus based on the chosen tile number, ensuring that off-centre subjects are prominently displayed in the viewport. | `5` (banks-of-the-seine-5.webp)                  |
| ⭐️ | `scale`   | Scale Factor        | Defines how much to enlarge the image when the viewport width is at or below the breakpoint in pixels. Formatted as "scale breakpoint" (e.g. 1.2 750).                                                                                                | `1.2 750` (120% 750w)                            |
|   | `path`    | Directory for Tiles | The file path to the directory where the image tiles are stored. This parameter is essential for locating and retrieving the image files for display.                                                                                                 | `tools/tile-maker/processed/banks-of-the-seine/` |

## How to Use

1. **Tile Calcualtor**: Use the [Tile Calculator](/tools/tile-calculator/README.md) to determine the optimal arrangement for splitting your image.

2. **Tile Maker**: Use the [Tile Maker](/tools/tile-maker/README.md) to split your image and export the necessary tiles and HTML snippet.

3. **Insert the HTML Snippet**: If you used the [Tile Maker](/tools/tile-maker/README.md), locate the exported HTML snippet in the image folder associated with the image name within the [processed folder](/tools/tile-maker/processed/). Copy this snippet into your web project where you want to display the image.

4. **Update Parameters**: Update the `path` parameter in the HTML snippet to point to the location of your tiles. Adjust optional parameters like `roi` and `scale` as needed. Don't forget to include image `alt` text as well.

5. **Include `pruner.js`**: To include the utility in your project. Add either option before the closing `</html>` tag in your HTML file
    - **Option 1**: [Download](#download).

      ```html
      <script async src="/your-path-here/pruner.min.js"></script>
      ```

    - **Option 2**: [CDN](#cdn).

      ```html
      <script async src="https://unpkg.com/prunerjs@1.1.8/dist/pruner.min.js"></script>
      ```

## Example

After completing the steps with the example image of [*Banks of the Seine, Vétheuil*, by Claude Monet](https://nga.gov/collection/art-object-page.46652.html), starting with the steps for the example in the [Tile Calculator](/tools/tile-calculator/README.md#example) documentation, followed by the steps for the example in the [Tile Maker](/tools/tile-maker/README.md#example) documentation, the tiles and HTML snippet and  will be exported to a folder within the [processed folder](/tools/tile-maker/processed/banks-of-the-seine/). The exported HTML snippet, [`data-pruner.html`](/tools/tile-maker/processed/banks-of-the-seine/data-pruner.html), will look like this:

```html
<img data-pruner='{"name": "banks-of-the-seine", "tile": "8 6", "path": "your-path-here/"}' alt="" loading="lazy">
```

The `path` and optional parameters (`roi` and `scale`), along the `alt` attribute, were then updated afterwards:

```html
<img data-pruner='{"name": "banks-of-the-seine", "tile": "8 6", "roi": 5, "scale": "1.2 750", "path": "tools/tile-maker/processed/banks-of-the-seine/"}' alt="Banks of the Seine, Vétheuil, 1880 by Claude Monet" loading="lazy">
```

*⭐️ Denotes which parameters are optional.*

|   | Parameter | Description         | Value                                            |
|---|-----------|---------------------|--------------------------------------------------|
|   | `name`    | Image Name          | `banks-of-the-seine`                             |
|   | `tile`    | Tile Grid           | `8 6` (8 columns and 6 rows)                     |
| ⭐️ | `roi`     | Region of Interest  | `5` (banks-of-the-seine-5.webp)                  |
| ⭐️ | `scale`   | Scale Factor        | `1.2 750` (120% 750w)                            |
|   | `path`    | Directory for Tiles | `tools/tile-maker/processed/banks-of-the-seine/` |

## Progressive Enhancement

Although, on average, only about [0.2% of users disable Javascript](https://gds.blog.gov.uk/2013/10/21/how-many-people-are-missing-out-on-javascript-enhancement/#:~:text=So%2C%201%20user%20in%20every%2093%20has%20JavaScript%20disabled%3F), there are instances where scripts may not be accessible e.g. network issues, affecting approximately [0.9% of users](https://gds.blog.gov.uk/2013/10/21/how-many-people-are-missing-out-on-javascript-enhancement/#:~:text=So%2C%201%20user%20in%20every%2093%20has%20JavaScript%20disabled%3F). Given that approximately [98.7% of websites utilise JavaScript](https://radixweb.com/blog/top-javascript-usage-statistics), it serves as a fundamental part of web infrastructure; if a user is not being served it, the page is likely not functioning correctly. However, some institutions require progressive enhancements for accessibility ensuring their sites work without Javascript. By leaving the `src` attribute unpopulated in the `<img>` element, we provide an option for a fallback image. While this fallback slightly undermines our goal of minimising image size used in responsve images, it still results in a smaller server-side footprint and less HTML.

## Contributing

Contributions are welcome. Please feel free to [submit an issue](https://github.com/overbrowsing/pruner/issues) or a [pull request](https://github.com/overbrowsing/pruner/pulls).

## License

`pruner.js` is released under the [MIT](/LICENSE) license. Feel free to use and modify it as needed.