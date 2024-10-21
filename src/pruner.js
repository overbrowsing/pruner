function pruner() {
  const elements = Array.from(document.querySelectorAll('[data-pruner]'));

  const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(`Failed to load image: ${src}`);
    img.src = src;
  });

  const createCanvas = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  };

  const getViewportDimensions = () => ({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const processImages = async (el, isMobileView, viewportWidth, viewportHeight) => {
    const { imageName, cols, rows, tileWidth, tileHeight, mobileScale, imagePath, roi, imageExtension } = JSON.parse(el.getAttribute('data-pruner') || '{}');

    if (!(cols && rows && tileWidth && tileHeight && imagePath && imageName)) return console.error('Missing required data attributes.');

    const scaleFactor = (isMobileView && mobileScale) ? mobileScale : 1,
      scaledTileWidth = Math.round(tileWidth * scaleFactor),
      scaledTileHeight = Math.round(tileHeight * scaleFactor),
      numTilesInViewportWidth = Math.min(Math.ceil(viewportWidth / scaledTileWidth), cols),
      numTilesInViewportHeight = Math.min(Math.ceil(viewportHeight / scaledTileHeight), rows),
      canvas = createCanvas(numTilesInViewportWidth * scaledTileWidth, numTilesInViewportHeight * scaledTileHeight),
      ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;
    el.src = '';
    const ext = imageExtension || 'webp',
      srcs = Array.from({ length: cols * rows }, (_, i) => `${imagePath}${imageName}-${i + 1}.${ext}`);

    const [finalStartRow, finalStartCol] = (() => {
      if (roi) {
        const roiIndex = roi - 1, roiRow = Math.floor(roiIndex / cols), roiCol = roiIndex % cols;
        return [
          Math.min(Math.max(0, roiRow - Math.floor(numTilesInViewportHeight / 2)), rows - numTilesInViewportHeight),
          Math.min(Math.max(0, roiCol - Math.floor(numTilesInViewportWidth / 2)), cols - numTilesInViewportWidth)];
      }
      return [Math.max(0, Math.floor(rows / 2) - Math.floor(numTilesInViewportHeight / 2)), Math.max(0, Math.floor(cols / 2) - Math.floor(numTilesInViewportWidth / 2))];
    })();

    const imagesToLoad = [];
    for (let row = 0; row < numTilesInViewportHeight; row++) {
      for (let col = 0; col < numTilesInViewportWidth; col++) {
        const sourceRow = finalStartRow + row, sourceCol = finalStartCol + col;
        if (sourceRow < rows && sourceCol < cols) {
          imagesToLoad.push(loadImage(srcs[sourceRow * cols + sourceCol]));
        }
      }
    }

    try {
      const images = await Promise.all(imagesToLoad);
      images.forEach((img, i) => ctx.drawImage(img, (i % numTilesInViewportWidth) * scaledTileWidth, Math.floor(i / numTilesInViewportWidth) * scaledTileHeight, scaledTileWidth, scaledTileHeight));
      el.src = canvas.toDataURL('image/WEBP');
    } catch (error) {
      console.error(error);
    }
  };

  const handleResize = debounce(() => {
    const { width, height } = getViewportDimensions();
    elements.forEach(el => {
      const { mobileBreakpoint } = JSON.parse(el.getAttribute('data-pruner') || '{}');
      processImages(el, mobileBreakpoint && width <= mobileBreakpoint, width, height);
    });
  }, 200);

  const processOnLoad = () => handleResize();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { processOnLoad(); observer.unobserve(entry.target); } });
  });

  window.addEventListener('load', processOnLoad);
  elements.forEach(el => observer.observe(el));
  window.addEventListener('resize', handleResize);
}

const debounce = (func, wait) => {
  let timeout;
  return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func(...args), wait); };
};

window.onload = pruner;