function pruner() {
  const elems = [...document.querySelectorAll('[data-pruner]')], cache = {}, debounce = (f, t) => (...a) => { clearTimeout(f.t); f.t = setTimeout(() => f(...a), t); };
  let prevW = 0, prevH = 0;

  const loadImg = src => cache[src] || (cache[src] = new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = () => rej(`Failed to load: ${src}`);
    img.src = src;
  }));

  const processImgs = async (el, isMobile, vw, vh) => {
    const { imageName, cols, rows, mobileScale, imagePath, roi, imageExtension = 'webp' } = JSON.parse(el.dataset.pruner);
    if (!cols || !rows || !imagePath || !imageName) return console.error('Missing params.');

    try {
      const sampleImg = await loadImg(`${imagePath}${imageName}-1.${imageExtension}`);
      const tileW = sampleImg.width, tileH = sampleImg.height, sf = isMobile && mobileScale ? mobileScale : 1;
      const sw = Math.round(tileW * sf), sh = Math.round(tileH * sf);
      const numCols = Math.min(Math.ceil(vw / sw), cols), numRows = Math.min(Math.ceil(vh / sh), rows);
      const canvas = Object.assign(document.createElement('canvas'), { width: numCols * sw, height: numRows * sh }), ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      el.src = '';

      const startR = roi ? Math.max(0, Math.floor((roi - 1) / cols) - Math.floor(numRows / 2)) : Math.max(0, Math.floor(rows / 2) - Math.floor(numRows / 2));
      const startC = roi ? Math.max(0, (roi - 1) % cols - Math.floor(numCols / 2)) : Math.max(0, Math.floor(cols / 2) - Math.floor(numCols / 2));

      const imgs = await Promise.all(
        Array.from({ length: numRows * numCols }, (_, i) => {
          const r = startR + Math.floor(i / numCols), c = startC + (i % numCols);
          return r < rows && c < cols ? loadImg(`${imagePath}${imageName}-${r * cols + c + 1}.${imageExtension}`) : Promise.resolve(null);
        })
      );

      imgs.forEach((img, i) => img && ctx.drawImage(img, (i % numCols) * sw, Math.floor(i / numCols) * sh, sw, sh));
      el.src = canvas.toDataURL('image/webp');
    } catch (e) { console.error(e); }
  };

  const handleResize = debounce(() => {
    const w = innerWidth, h = innerHeight;
    if (w === prevW && h === prevH) return;
    prevW = w; prevH = h;
    elems.forEach(el => processImgs(el, w <= (JSON.parse(el.dataset.pruner).mobileBreakpoint || 0), w, h));
  }, 200);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { handleResize(); observer.unobserve(e.target); } });
  });

  window.addEventListener('load', handleResize);
  elems.forEach(el => observer.observe(el));
  window.addEventListener('resize', handleResize);
}

window.onload = pruner;