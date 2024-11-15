# ✂️ pruner.js

[![NPM version](https://img.shields.io/npm/v/prunerjs.svg)](https://www.npmjs.com/package/prunerjs)
[![npm](https://img.shields.io/npm/dt/prunerjs.svg)](https://www.npmtrends.com/prunerjs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## Overview

`pruner.js` is a responsive image Javascript utility using viewport-based rendering. It works by splitting images into tiles and loading only the parts of the image visible within the viewport, like assembling a jigsaw puzzle. This method reduces server-side storage compared to the current best practice of responsive images by eliminating the need for multiple image versions defined for specific breakpoints and reduces data transfer by avoiding the download of pixel waste—parts of the image outside the visible aperture.

The utility is designed to function not only at defined breakpoints but also dynamically across varying viewport sizes, distinguishing it from traditional responsive image methods. The tile creation process begins with the [Tile Calculator](/tools/tile-calculator/) which determines the most efficient arrangement of tiles for processing images using the [Tile Maker](/tools/tile-maker/). This tool also generates a snippet of HTML for easy installation, that also uses less HTML than the [Picture-Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) (`<picture>`), and in some cases `srcset`, resulting in a simpler and more efficient process to responsive images.

The name was chosen based on the practice of [pruning in horticulture](https://en.wikipedia.org/wiki/Pruning): the practice of targetted removal of unhealthy or unwanted parts of a plant to promote healthier growth. Just as pruning in nature encourages a plant to thrive by focusing its energy on the most important branches, `pruner.js` optimises web performance by reducing server-side footprints and excess data transfer due to pixel waste, focusing on what is needed to display the image effectively across viewports. A name related to nature was fitting and thematic, aligning with the principles of [sustainable web design](https://sustainablewebdesign.org).

## Features

- **Load Only What You See**: Servers only the parts of an image that are visible on the screen and reduces unnecessary data transfer by not loading hidden sections of images (waste pixels).
- **Save Data**: Reduces the number of images needed for responsive images saving storage server-side.
- **Better Responsive Images**: Provides dynamic viewport-based rendering of images across a range of viewports, rather than just a few predefined breakpoints like `<picture>`.
- **Easy to Use**: The [Tile Calculator](/tools/tile-calculator/README.md) automates the calculation, while the [Tile Maker](/tools/tile-maker/) handles formatting and compression of tiles, as well as the generation of a single line of HTML for easy installation.
- **Art Direction**: Allows you to set a focal point in the image and specify breakpoints for image scaling on smaller form factors.
- **Client-Side Functionality**: Operates in the browser with a small piece of Javascript to dynamically create auto-scaling images based on the viewport size.

## Install

You can include `pruner.js` in your project either by downloading the files or using a CDN. While using a third-party CDN introduces an additional HTTP request, we have ensured that it is hosted using renewable energy.

### Download

- **Minified**: Available in the [distributable (dist) folder](/dist/pruner.min.js) and [unpkg](https://unpkg.com/prunerjs@1.1.6/dist/pruner.min.js).
- **Unminified**: Available in the [source (src) folder](/src/pruner.js) and [unpkg](https://unpkg.com/prunerjs@1.1.6/src/pruner.js).

### CDN

Link directly to the minified version using Unpkg (we recommend downloading the file to reduce HTTP requests):

```html
<script async src="https://unpkg.com/prunerjs@1.1.6/dist/pruner.min.js"></script>
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

|   | Parameter | Description         | Details                                                                                                                                                                                                                                               | [Example](#example)                              |
|---|-----------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|
|   | `name`    | Image Name          | The base name of the image files.                                                                                                                                                                                                                     | `banks-of-the-seine` (banks-of-the-seine-n.webp) |
|   | `tile`    | Tile Grid           | The number of columns and rows the image is split into.                                                                                                                                                                                               | `10 8` (10 columns and 8 rows)                   |
| ⭐️ | `roi`     | Region of Interest  | This parameter lets you set a specific focal point within the image for art direction. The region of interest adjusts the image's focus based on the chosen tile number, ensuring that off-centre subjects are prominently displayed in the viewport. | `5` (banks-of-the-seine-5.webp)                  |
| ⭐️ | `scale`   | Scale Factor        | Defines how much to enlarge the image when the viewport width is at or below the breakpoint in pixels. Formatted as "scale breakpoint" (e.g. 1.2 750).                                                                                                | `1.2 750` (120% 750w)                            |
|   | `path`    | Directory for Tiles | The file path to the directory where the image tiles are stored. This parameter is essential for locating and retrieving the image files for display.                                                                                                 | `tools/tile-maker/processed/banks-of-the-seine/` |

## How to Use

### Tiles

1. **Calculating Tiles**: The best way to create tiles is by first calcualting the optimal arrangement by using the [Tile Calculator](/tools/tile-calculator/README.md). This tool will help you generate the best configuration for your project and will share the parameters needed for the next step.

2. **Making Tiles**: Once you have your configuration from the Tile Calculator, use the [Tile Maker](/tools/tile-maker/README.md) to process your images and create the tiles. Tile Maker will output the tiles and an optional HTML snippet for easy installation.

3. **Naming Images**: If you used the [Tile Maker](/tools/tile-maker/README.md), you can ignore the next two steps and proceed to [installation](/README.md#installation) as the tool handles naming and formatting of images automatically. For manual installation and tile creation, ensure that the parameter `image` matches the base name for the tile images (e.g., banks-of-the-seine-1.webp, banks-of-the-seine-2.webp, etc.) and that the images are named sequentially.

4. **Formatting Images**: Images need to be foramtted to WebP. This helps reduce image sizes—WebP lossy versions can be [25% to 34% smaller than JPEGs](https://developers.google.com/speed/webp/docs/webp_study#conclusion). This format meets the ["serve images in modern formats"](https://developer.chrome.com/docs/lighthouse/performance/uses-webp-images) opportuntiy within the Google Lighthouse test and follows best practices for [sustainable web design](https://github.com/Sustainable-WWW/Sustainable-Web-Practices-Wiki/blob/main/Wiki/Image/Image_Formats.md). WebP is [widely supported across major browsers](https://caniuse.com/webp), unlike AVIF which is [newly available across major browsers](https://caniuse.com/avif). Don't worry! There is an option for progressive enhancement that enables developers to easily adjust a line of code in the pruner.js script to support additional image formats if they wish.

### Installation

1. **Insert the HTML Snippet**: If you used the [Tile Maker](/tools/tile-maker/README.md), locate the exported HTML snippet in the image folder associated with the image name within the [processed folder](/tools/tile-maker/processed/). Copy this snippet into your web project where you want to display the images.

2. **Update Parameters**: Update the `path` parameter in the HTML snippet to point to the location of your tiles. Ensure that you configure any optional parameters (`roi` and `scale`) as needed to suit your project. Don’t forget to include `alt` text as well!

3. **Include `pruner.js`**: To include the utility in your project. Add the either option before the closing `</html>` tag in your HTML file
    - **Option 1**: [Using locally](#download).

      ```html
      <script async src="/your-path-here/pruner.js"></script>
      ```

    - **Option 2**: [Using a CDN](#cdn).

      ```html
      <script async src="https://unpkg.com/prunerjs@1.1.6/dist/pruner.min.js"></script>
      ```

## Example

After completing the steps with the example image of [*Banks of the Seine, Vétheuil*, by Claude Monet](https://www.nga.gov/collection/art-object-page.46652.html), beginning with the steps in [Tile Calculator](/tools/tile-calculator/README.md#example) documentation and then proceeding to the steps in the [Tile Maker](/tools/tile-maker/README.md#example) documentation, the tiles and HTML snippet and  will be exported to a folder within the [processed folder](/tools/tile-maker/processed/banks-of-the-seine/). The exported HTML snippet, [`data-pruner.html`](/tools/tile-maker/processed/banks-of-the-seine/data-pruner.html), will look like this:

```html
<img data-pruner='{"name": "banks-of-the-seine", "tile": "10 8", "path": "your-path-here/"}' alt="" loading="lazy">
```

The `path` and optional parameters (`roi` and `scale`), along the `alt` attribute, were added in manually afterwards:

```html
<img data-pruner='{"name": "banks-of-the-seine", "tile": "10 8", "roi": 5, "scale": "1.2 750", "path": "tools/tile-maker/processed/banks-of-the-seine/"}' alt="Banks of the Seine, Vétheuil, 1880 by Claude Monet"  loading="lazy">
```

*⭐️ Denotes which parameters are optional.*

|   | Parameter | Description         | Value                                            |
|---|-----------|---------------------|--------------------------------------------------|
|   | `name`    | Image Name          | `banks-of-the-seine`                             |
|   | `tile`    | Tile Grid           | `10 8` (10 columns and 8 rows)                   |
| ⭐️ | `roi`     | Region of Interest  | `5` (banks-of-the-seine-5.webp)                  |
| ⭐️ | `scale`   | Scale Factor        | `1.2 750` (120% 750w)                            |
|   | `path`    | Directory for Tiles | `tools/tile-maker/processed/banks-of-the-seine/` |

## Progressive Enhancement

Although, on average, only about [0.2% of users disable Javascript](https://gds.blog.gov.uk/2013/10/21/how-many-people-are-missing-out-on-javascript-enhancement/), there are instances where scripts may not be accessible e.g. network issues, affecting approximately 0.9% of users. Given that approximately [98.7% of websites utilise JavaScript](https://radixweb.com/blog/top-javascript-usage-statistics), it serves as a fundamental part of web infrastructure; if a user is not being served it, the page is likely not functioning correctly. However, some institutions require progressive enhancements for accessibility ensuring their sites work without Javascript. By leaving the `src` attribute unpopulated in the `<img>` element, we provide an option for a fallback image. While this fallback slightly undermines our goal of minimising image size used in responsve images, it still results in a smaller server-side footprint and less HTML.

## Contributing

Contributions are welcome. Please feel free to [submit an issue](https://github.com/overbrowsing/pruner/issues) or a [pull request](https://github.com/overbrowsing/pruner/pulls).

## License

`pruner.js` is released under the [MIT](/LICENSE) license. Feel free to use and modify it as needed.