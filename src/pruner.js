function pruner() {
  const elems = [...document.querySelectorAll('[data-pruner]')], cache = {};
  let prevW = 0, prevH = 0;

  const debounce = (fn, d) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), d); }; };
  const loadImg = src => cache[src] || (cache[src] = new Promise((r, rej) => { const img = new Image(); img.crossOrigin = 'anon'; img.onload = () => r(img); img.onerror = () => rej(src); img.src = src; }));

  const processImgs = async (el, vw, vh) => {
    const { name, tile, scale = "1 0", path = '', roi, imageExtension = 'webp' } = JSON.parse(el.dataset.pruner);
    if (!tile || !name) return;
    const [cols, rows] = tile.split(" "), [sf, bp] = scale.split(" "), isMobile = vw <= +bp;
    try {
      const { width: w, height: h } = await loadImg(`${path}${name}-1.${imageExtension}`);
      const sw = Math.round(w * (isMobile ? +sf : 1)), sh = Math.round(h * (isMobile ? +sf : 1));
      const numCols = Math.min(Math.ceil(vw / sw), cols), numRows = Math.min(Math.ceil(vh / sh), rows);
      const c = document.createElement('canvas');
      c.width = numCols * sw; c.height = numRows * sh;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      el.src = '';
      const [startR, startC] = roi ? [Math.max(0, Math.floor((roi - 1) / cols) - Math.floor(numRows / 2)), Math.max(0, (roi - 1) % cols - Math.floor(numCols / 2))] :
        [Math.max(0, Math.floor(rows / 2) - Math.floor(numRows / 2)), Math.max(0, Math.floor(cols / 2) - Math.floor(numCols / 2))];
      const clampedStartR = Math.max(0, Math.min(startR, rows - numRows)), clampedStartC = Math.max(0, Math.min(startC, cols - numCols));
      const imgs = await Promise.all(
        Array.from({ length: numRows * numCols }, (_, i) => {
          const r = clampedStartR + Math.floor(i / numCols), c = clampedStartC + (i % numCols);
          return r < rows && c < cols ? loadImg(`${path}${name}-${r * cols + c + 1}.${imageExtension}`) : null;
        })
      );
      imgs.forEach((img, i) => img && ctx.drawImage(img, (i % numCols) * sw, Math.floor(i / numCols) * sh, sw, sh));
      el.src = c.toDataURL('image/webp');
    } catch (e) {}
  };

  const handleResize = debounce(() => { const w = innerWidth, h = innerHeight; if (w !== prevW || h !== prevH) { prevW = w; prevH = h; elems.forEach(el => processImgs(el, w, h)); } }, 200);

  const obs = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { handleResize(); obs.unobserve(entry.target); } }));
  window.addEventListener('load', handleResize);
  elems.forEach(el => obs.observe(el));
  window.addEventListener('resize', handleResize);
}

window.onload = pruner;