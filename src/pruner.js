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

  const processImages = async (el, isMobileView, viewportWidth, viewportHeight) => {
    const data = JSON.parse(el.getAttribute('data-pruner') || '{}');
    const { imageName, cols, rows, tileWidth, tileHeight, mobileScale, imagePath, roi, imageExtension } = data;

    if (!cols || !rows || !tileWidth || !tileHeight || !imagePath || !imageName) {
      console.error('Missing required data attributes.');
      return;
    }

    // Apply mobile scaling only if mobileScale is defined in parameters
    const scaleFactor = (isMobileView && mobileScale) ? mobileScale : 1;
    const scaledTileWidth = Math.round(tileWidth * scaleFactor);
    const scaledTileHeight = Math.round(tileHeight * scaleFactor);

    const numTilesInViewportWidth = Math.min(Math.ceil(viewportWidth / scaledTileWidth), cols);
    const numTilesInViewportHeight = Math.min(Math.ceil(viewportHeight / scaledTileHeight), rows);

    const canvas = createCanvas(numTilesInViewportWidth * scaledTileWidth, numTilesInViewportHeight * scaledTileHeight);
    const ctx = canvas.getContext('2d');

    // Disable image smoothing to reduce artifacts
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#fff'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    el.src = '';

    const ext = imageExtension || 'webp';
    const srcs = Array.from({ length: cols * rows }, (_, i) => `${imagePath}${imageName}-${i + 1}.${ext}`);

    const calculateStartIndices = () => {
      if (roi) {
        const roiIndex = roi - 1;
        const roiRow = Math.floor(roiIndex / cols);
        const roiCol = roiIndex % cols;
        const startRow = Math.max(0, roiRow - Math.floor(numTilesInViewportHeight / 2));
        const startCol = Math.max(0, roiCol - Math.floor(numTilesInViewportWidth / 2));
        return [Math.min(startRow, rows - numTilesInViewportHeight), Math.min(startCol, cols - numTilesInViewportWidth)];
      }
      return [
        Math.max(0, Math.floor(rows / 2) - Math.floor(numTilesInViewportHeight / 2)),
        Math.max(0, Math.floor(cols / 2) - Math.floor(numTilesInViewportWidth / 2))
      ];
    };

    const [finalStartRow, finalStartCol] = calculateStartIndices();

    const imagesToLoad = [];
    for (let row = 0; row < numTilesInViewportHeight; row++) {
      for (let col = 0; col < numTilesInViewportWidth; col++) {
        const sourceRow = finalStartRow + row;
        const sourceCol = finalStartCol + col;
        if (sourceRow < rows && sourceCol < cols) {
          const index = sourceRow * cols + sourceCol;
          imagesToLoad.push(loadImage(srcs[index]));
        }
      }
    }

    try {
      const images = await Promise.all(imagesToLoad);
      images.forEach((img, i) => {
        const x = Math.round((i % numTilesInViewportWidth) * scaledTileWidth);
        const y = Math.round(Math.floor(i / numTilesInViewportWidth) * scaledTileHeight);
        ctx.drawImage(img, x, y, scaledTileWidth, scaledTileHeight);
      });
      el.src = canvas.toDataURL('image/WEBP');
    } catch (error) {
      console.error(error);
    }
  };

  const handleResize = debounce(() => {
    const viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
    elements.forEach(el => {
      const { mobileBreakpoint } = JSON.parse(el.getAttribute('data-pruner') || '{}');
      processImages(el, mobileBreakpoint && viewportWidth <= mobileBreakpoint, viewportWidth, viewportHeight);
    });
  }, 200);

  const processOnLoad = () => {
    const viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
    elements.forEach(el => {
      const { mobileBreakpoint } = JSON.parse(el.getAttribute('data-pruner') || '{}');
      processImages(el, mobileBreakpoint && viewportWidth <= mobileBreakpoint, viewportWidth, viewportHeight);
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { 
      if (entry.isIntersecting) { 
        processOnLoad(); 
        observer.unobserve(entry.target); 
      } 
    });
  });

  elements.forEach(el => observer.observe(el));
  window.addEventListener('resize', handleResize);
  window.addEventListener('load', processOnLoad);
}

const debounce = (func, wait) => {
  let timeout;
  return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func(...args), wait); };
};

window.onload = pruner;