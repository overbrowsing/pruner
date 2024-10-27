function pruner() {
  const elems = [...document.querySelectorAll('[data-pruner]')], imageCache = {};
  let prevW = 0, prevH = 0;

  const loadImg = src => imageCache[src] ? Promise.resolve(imageCache[src]) : new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(imageCache[src] = img);
    img.onerror = () => rej(`Failed to load: ${src}`);
    img.src = src;
  });

  const createCanvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
  const getViewport = () => ({ w: innerWidth, h: innerHeight });
  
  const getRoi = (idx, cols, nr, nc, rows) => {
    const roiRow = Math.floor(idx / cols), roiCol = idx % cols;
    return [
      Math.min(Math.max(0, roiRow - Math.floor(nr / 2)), rows - nr),
      Math.min(Math.max(0, roiCol - Math.floor(nc / 2)), cols - nc)
    ];
  };

  const processImgs = async (el, isMobile, vw, vh) => {
    const { imageName, cols, rows, tileWidth, tileHeight, mobileScale, imagePath, roi, imageExtension = 'webp' } = JSON.parse(el.dataset.pruner);
    if (!cols || !rows || !tileWidth || !tileHeight || !imagePath || !imageName) return console.error('Missing params.');

    const sf = isMobile && mobileScale ? mobileScale : 1, sw = Math.round(tileWidth * sf), sh = Math.round(tileHeight * sf);
    const numCols = Math.min(Math.ceil(vw / sw), cols), numRows = Math.min(Math.ceil(vh / sh), rows);
    const canvas = createCanvas(numCols * sw, numRows * sh), ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    el.src = '';

    const srcs = Array.from({ length: cols * rows }, (_, i) => `${imagePath}${imageName}-${i + 1}.${imageExtension}`);
    const [startRow, startCol] = roi ? getRoi(roi - 1, cols, numRows, numCols, rows) : [
      Math.max(0, Math.floor(rows / 2) - Math.floor(numRows / 2)),
      Math.max(0, Math.floor(cols / 2) - Math.floor(numCols / 2))
    ];

    try {
      const imgs = await Promise.all(
        Array.from({ length: numRows * numCols }, (_, i) => {
          const r = startRow + Math.floor(i / numCols), c = startCol + i % numCols;
          return r < rows && c < cols ? loadImg(srcs[r * cols + c]) : Promise.resolve(null);
        })
      );
      imgs.forEach((img, i) => img && ctx.drawImage(img, (i % numCols) * sw, Math.floor(i / numCols) * sh, sw, sh));
      el.src = canvas.toDataURL('image/webp');
    } catch (e) { console.error(e); }
  };

  const handleResize = debounce(() => {
    const { w, h } = getViewport();
    if (w === prevW && h === prevH) return;
    prevW = w; prevH = h;
    elems.forEach(el => processImgs(el, w <= (JSON.parse(el.dataset.pruner).mobileBreakpoint || 0), w, h));
  }, 200);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { handleResize(); observer.unobserve(entry.target); } });
  });

  window.addEventListener('load', handleResize);
  elems.forEach(el => observer.observe(el));
  window.addEventListener('resize', handleResize);
}

const debounce = (func, wait) => {
  let timeout;
  return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func(...args), wait); };
};

window.onload = pruner;