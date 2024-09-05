class Pruner {
  constructor(selector) {
    this.elements = document.querySelectorAll(`[${selector}]`);
    this.init();
  }

  init() {
    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize();  // Initial load
  }

  handleResize() {
    this.elements.forEach(el => {
      const params = this.getParams(el);
      if (!params) return;

      const { cols, rows, tileWidth, mobileBreakpoint, imagePath } = params;
      const srcs = this.generateImageSources(el.id, cols * rows);
      const isMobileView = window.innerWidth <= mobileBreakpoint;
      if (isMobileView) {
        this.loadMiddleImage(el, srcs, imagePath);
      } else {
        this.loadTiledImages(el, srcs, cols, rows, tileWidth, imagePath);
      }
    });
  }

  getParams(el) {
    try {
      return JSON.parse(el.getAttribute('data-pruner'));
    } catch (error) {
      console.error('Invalid data-pruner JSON format:', error);
      return null;
    }
  }

  generateImageSources(baseName, count) {
    return Array.from({ length: count }, (_, i) => `${baseName} ${i + 1}.jpg`);
  }

  loadMiddleImage(el, srcs, imagePath) {
    const middleImg = new Image();
    middleImg.onerror = () => this.loadFallbackImage(el); // Fallback in case of CORS error
    middleImg.onload = () => el.src = middleImg.src;
    middleImg.src = imagePath + srcs[Math.floor(srcs.length / 2)];
  }

  loadTiledImages(el, srcs, cols, rows, tileWidth, imagePath) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let maxHeight = 0;
    let loadedCount = 0;
    const images = [];

    canvas.width = cols * tileWidth;

    srcs.forEach((src, i) => {
      const img = new Image();
      img.onerror = () => this.loadFallbackImage(el); 
      img.onload = () => {
        images[i] = img;
        maxHeight = Math.max(maxHeight, img.height);
        if (++loadedCount === srcs.length) {
          canvas.height = rows * maxHeight;
          images.forEach((img, j) => {
            ctx.drawImage(img, (j % cols) * tileWidth, Math.floor(j / cols) * maxHeight, tileWidth, maxHeight);
          });

          try {
            el.src = canvas.toDataURL();  
          } catch (error) {
            console.error("Canvas tainted, unable to convert to data URL. Falling back to single image.");
            this.loadFallbackImage(el); // Fallback to the middle image if CORS issue
          }
        }
      };
      img.src = imagePath + src;
    });
  }

  loadFallbackImage(el) {
    // Set a real fallback image path
    const fallbackImg = new Image();

    // TODO FIX
    fallbackImg.src = 'https://overbrowsing.com/pruner/assets/before/landscape-desktop.jpg';  
    fallbackImg.onload = () => el.src = fallbackImg.src;
    fallbackImg.onerror = () => console.error("Failed to load fallback image.");
  }
}

window.onload = () => {
  new Pruner('data-pruner');
};
