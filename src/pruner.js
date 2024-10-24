function pruner() {
  const elems = [...document.querySelectorAll('[data-pruner]')];

  const loadImg = src => new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = () => rej(`Failed to load: ${src}`);
    img.src = src;
  });

  const createCanvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
  const getViewport = () => ({ w: innerWidth, h: innerHeight });

  const processImgs = async (el, mobile, vw, vh) => {
    const { imageName, cols, rows, tileWidth, tileHeight, mobileScale, imagePath, roi, imageExtension } = JSON.parse(el.dataset.pruner);
    if (!(cols && rows && tileWidth && tileHeight && imagePath && imageName)) return console.error('Missing params.');

    const sf = mobile && mobileScale ? mobileScale : 1, sw = Math.round(tileWidth * sf), sh = Math.round(tileHeight * sf);
    const numCols = Math.min(Math.ceil(vw / sw), cols), numRows = Math.min(Math.ceil(vh / sh), rows);
    const canvas = createCanvas(numCols * sw, numRows * sh), ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false; el.src = '';

    const ext = imageExtension || 'webp';
    const srcs = Array.from({ length: cols * rows }, (_, i) => `${imagePath}${imageName}-${i + 1}.${ext}`);
    const [startRow, startCol] = roi ? getRoi(roi - 1, cols, numRows, numCols, rows) : getCenter(cols, rows, numRows, numCols);

    const imgsToLoad = [];
    for (let r = 0; r < numRows; r++)
      for (let c = 0; c < numCols; c++) {
        const srcR = startRow + r, srcC = startCol + c;
        if (srcR < rows && srcC < cols) imgsToLoad.push(loadImg(srcs[srcR * cols + srcC]));
      }

    try {
      const imgs = await Promise.all(imgsToLoad);
      imgs.forEach((img, i) => ctx.drawImage(img, (i % numCols) * sw, Math.floor(i / numCols) * sh, sw, sh));
      el.src = canvas.toDataURL('image/WEBP');
    } catch (error) {
      console.error(error);
    }
  };

  const getRoi = (idx, cols, nr, nc, rows) => {
    const roiRow = idx / cols | 0, roiCol = idx % cols;
    return [
      Math.min(Math.max(0, roiRow - (nr / 2 | 0)), rows - nr),
      Math.min(Math.max(0, roiCol - (nc / 2 | 0)), cols - nc)
    ];
  };

  const getCenter = (cols, rows, nr, nc) => [
    Math.max(0, (rows / 2 | 0) - (nr / 2 | 0)),
    Math.max(0, (cols / 2 | 0) - (nc / 2 | 0))
  ];

  const handleResize = debounce(() => {
    const { w, h } = getViewport();
    elems.forEach(el => {
      const { mobileBreakpoint } = JSON.parse(el.dataset.pruner);
      processImgs(el, mobileBreakpoint && w <= mobileBreakpoint, w, h);
    });
  }, 200);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { handleResize(); observer.unobserve(entry.target); } });
  });

  window.addEventListener('load', handleResize);
  elems.forEach(el => observer.observe(el));
  window.addEventListener('resize', handleResize);
}

const debounce = (f, wait) => {
  let timeout;
  return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => f(...args), wait); };
};

window.onload = pruner;