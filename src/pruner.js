function pruner() {
  const elements = Array.from(document.querySelectorAll('[data-pruner]'));

  const loadImage = src => new Promise((resolve, reject) => {
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
    const { cols, rows, tileWidth, tileHeight, imagePath, imageName, mobileScale } = data;

    if (!cols || !rows || !tileWidth || !tileHeight || !imagePath || !imageName) {
      console.error('Missing required data attributes.');
      return;
    }

    const scaleFactor = isMobileView ? mobileScale || 1.2 : 1;
    const scaledTileWidth = tileWidth * scaleFactor;
    const scaledTileHeight = tileHeight * scaleFactor;

    const numTilesInViewportWidth = Math.min(Math.ceil(viewportWidth / scaledTileWidth), cols);
    const numTilesInViewportHeight = Math.min(Math.ceil(viewportHeight / scaledTileHeight), rows);

    const canvasWidth = numTilesInViewportWidth * scaledTileWidth;
    const canvasHeight = numTilesInViewportHeight * scaledTileHeight;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    el.src = '';

    const srcs = Array.from({ length: cols * rows }, (_, i) => `${imagePath}${imageName} ${i + 1}.jpg`);

    try {
      const imagesToLoad = [];
      for (let row = 0; row < numTilesInViewportHeight; row++) {
        for (let col = 0; col < numTilesInViewportWidth; col++) {
          const index = row * cols + col;
          if (index < srcs.length) {
            imagesToLoad.push(loadImage(srcs[index]));
          }
        }
      }

      const images = await Promise.all(imagesToLoad);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      images.forEach((img, i) => {
        const x = (i % numTilesInViewportWidth) * scaledTileWidth;
        const y = Math.floor(i / numTilesInViewportWidth) * scaledTileHeight;
        ctx.drawImage(img, x, y, scaledTileWidth, scaledTileHeight);
      });

      el.src = canvas.toDataURL('image/jpeg');
    } catch (error) {
      console.error(error);
    }
  };

  const handleResize = debounce(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    elements.forEach(el => {
      const { mobileBreakpoint } = JSON.parse(el.getAttribute('data-pruner') || '{}');
      const isMobileView = mobileBreakpoint && viewportWidth <= mobileBreakpoint;
      processImages(el, isMobileView, viewportWidth, viewportHeight);
    });
  }, 200);

  const processOnLoad = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    elements.forEach(el => {
      const { mobileBreakpoint } = JSON.parse(el.getAttribute('data-pruner') || '{}');
      const isMobileView = mobileBreakpoint && viewportWidth <= mobileBreakpoint;
      processImages(el, isMobileView, viewportWidth, viewportHeight);
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
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

window.onload = pruner;