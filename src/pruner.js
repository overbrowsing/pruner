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
    const { imageName, cols, rows, tileWidth, tileHeight, mobileScale, imagePath, roi } = data;
    if (!cols || !rows || !tileWidth || !tileHeight || !imagePath || !imageName) return;

    const scaleFactor = isMobileView ? mobileScale || 1.2 : 1;
    const scaledTileWidth = tileWidth * scaleFactor;
    const scaledTileHeight = tileHeight * scaleFactor;
    const numTilesInViewportWidth = Math.ceil(viewportWidth / scaledTileWidth);
    const numTilesInViewportHeight = Math.ceil(viewportHeight / scaledTileHeight);
    const canvas = createCanvas(viewportWidth, viewportHeight);
    const ctx = canvas.getContext('2d');
    el.src = '';

    const srcs = Array.from({ length: cols * rows }, (_, i) => `${imagePath}${imageName} ${i + 1}.jpg`);
    const images = await Promise.all(srcs.map(loadImage));
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const roiIndex = roi - 1;
    const roiRow = Math.floor(roiIndex / cols);
    const roiCol = roiIndex % cols;
    const startRow = Math.max(0, roiRow - Math.floor(numTilesInViewportHeight / 2));
    const startCol = Math.max(0, roiCol - Math.floor(numTilesInViewportWidth / 2));
    const finalStartRow = Math.min(startRow, rows - numTilesInViewportHeight);
    const finalStartCol = Math.min(startCol, cols - numTilesInViewportWidth);

    for (let row = 0; row < numTilesInViewportHeight; row++) {
      for (let col = 0; col < numTilesInViewportWidth; col++) {
        const sourceRow = finalStartRow + row;
        const sourceCol = finalStartCol + col;
        if (sourceRow >= 0 && sourceRow < rows && sourceCol >= 0 && sourceCol < cols) {
          const imgIndex = sourceRow * cols + sourceCol;
          ctx.drawImage(images[imgIndex], col * scaledTileWidth, row * scaledTileHeight, scaledTileWidth, scaledTileHeight);
        }
      }
    }

    el.src = canvas.toDataURL('image/jpeg');
  };

  const handleResize = debounce(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    elements.forEach((el) => {
      const { mobileBreakpoint } = JSON.parse(el.getAttribute('data-pruner') || '{}');
      const isMobileView = mobileBreakpoint && viewportWidth <= mobileBreakpoint;
      processImages(el, isMobileView, viewportWidth, viewportHeight);
    });
  }, 200);

  const processOnLoad = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    elements.forEach((el) => {
      const { mobileBreakpoint } = JSON.parse(el.getAttribute('data-pruner') || '{}');
      const isMobileView = mobileBreakpoint && viewportWidth <= mobileBreakpoint;
      processImages(el, isMobileView, viewportWidth, viewportHeight);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        processOnLoad();
        observer.unobserve(entry.target);
      }
    });
  });

  elements.forEach((el) => observer.observe(el));
  window.addEventListener('resize', handleResize);
  window.addEventListener('load', processOnLoad);
}

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

window.onload = pruner;