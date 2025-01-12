function imagePruner() {
  let elements = [...document.querySelectorAll("[data-pruner]")],
      imageCache = {},
      loadImage = src => imageCache[src] || (imageCache[src] = new Promise((resolve, reject) => {
        let img = new Image;
        img.crossOrigin = "ANON";
        img.onload = () => resolve(img);
        img.onerror = () => reject(src);
        img.src = src;
      }));

  const calculateScaleFactor = (tileWidth, tileHeight, columns, rows) => {
    const calculatedWidth = tileWidth * columns;
    const calculatedHeight = tileHeight * rows;
    return calculatedWidth > 1920 || calculatedHeight > 1080 ? 0.5 : 1;
  };

  const processImage = async (element, viewportWidth, viewportHeight) => {
    let { name, tile, scale = "1 0", path = "", roi, imageExtension = "webp" } = JSON.parse(element.dataset.pruner);
    if (!tile || !name) return;

    let [columns, rows] = tile.split(" ").map(Number),
        [scaleX, scaleY] = scale.split(" ").map(Number),
        isScaleEnabled = viewportWidth <= scaleY,
        imagePath = `${path}${name}-1.${imageExtension}`,
        { width, height } = await loadImage(imagePath),
        tileWidth = Math.round(width * (isScaleEnabled ? scaleX : 1)),
        tileHeight = Math.round(height * (isScaleEnabled ? scaleX : 1)),
        scaleFactor = calculateScaleFactor(tileWidth, tileHeight, columns, rows),
        scaledWidth = Math.round(tileWidth * scaleFactor),
        scaledHeight = Math.round(tileHeight * scaleFactor),
        tilesX = Math.min(Math.ceil(viewportWidth / scaledWidth), columns),
        tilesY = Math.min(Math.ceil(viewportHeight / scaledHeight), rows);

    let canvas = document.createElement("canvas");
    canvas.width = tilesX * scaledWidth;
    canvas.height = tilesY * scaledHeight;
    let ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    element.src = "";

    let clamp = (value, min, max) => Math.max(min, Math.min(value, max)),
        startX = clamp(roi ? Math.floor((roi - 1) / columns) - Math.floor(tilesY / 2) : Math.floor(rows / 2) - Math.floor(tilesY / 2), 0, rows - tilesY),
        startY = clamp(roi ? (roi - 1) % columns - Math.floor(tilesX / 2) : Math.floor(columns / 2) - Math.floor(tilesX / 2), 0, columns - tilesX);

    (await Promise.all(Array(tilesY * tilesX).fill().map((_, index) => {
      let x = startX + Math.floor(index / tilesX),
          y = startY + index % tilesX;
      return x < rows && y < columns ? loadImage(`${path}${name}-${x * columns + y + 1}.${imageExtension}`) : null;
    }))).forEach((image, index) => {
      if (image) {
        ctx.drawImage(image, index % tilesX * scaledWidth, Math.floor(index / tilesX) * scaledHeight, scaledWidth, scaledHeight);
      }
    });

    element.src = canvas.toDataURL("image/webp");
  };

  let resizeTimeout, prevWidth = 0, prevHeight = 0, handleResize = () => {
    let width = innerWidth, height = innerHeight;
    if (width !== prevWidth || height !== prevHeight) {
      prevWidth = width;
      prevHeight = height;
      elements.forEach(element => processImage(element, width, height));
    }
  };

  const debouncedResize = (...args) => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => handleResize(...args), 200);
  };

  let intersectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      debouncedResize();
      intersectionObserver.unobserve(entry.target);
    }
  }));

  window.addEventListener("load", debouncedResize);
  elements.forEach(element => intersectionObserver.observe(element));
  window.addEventListener("resize", debouncedResize);
}

window.onload = imagePruner;