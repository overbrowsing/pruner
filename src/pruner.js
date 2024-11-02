function pruner() {
  const elems = [...document.querySelectorAll('[data-pruner]')], cache = {}, debounce = (f, t) => (...a) => { clearTimeout(f.t); f.t = setTimeout(() => f(...a), t); };
  let prevW = 0, prevH = 0;

  const loadImg = src => cache[src] || (cache[src] = new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = () => rej(`Error loading: ${src}`);
    img.src = src;
  }));

  const processImgs = async (el, vw, vh) => {
    const { name, cols, roi, scale, path, imageExtension = 'webp' } = JSON.parse(el.dataset.pruner);
    if (!cols || !path || !name) return;
    const [sf, bp] = scale.split(" "), isMobile = vw <= +bp;

    try {
      const { width: w, height: h } = await loadImg(`${path}${name}-1.${imageExtension}`);
      const sw = Math.round(w * (isMobile ? +sf : 1)), sh = Math.round(h * (isMobile ? +sf : 1));
      const numCols = Math.min(Math.ceil(vw / sw), cols), numRows = Math.ceil(vh / sh);
      const c = Object.assign(document.createElement('canvas'), { width: numCols * sw, height: numRows * sh }), ctx = c.getContext('2d');
      el.src = '';

      const sR = roi ? Math.max(0, Math.floor((roi - 1) / cols) - Math.floor(numRows / 2)) : Math.floor(numRows / 2);
      const sC = roi ? Math.max(0, (roi - 1) % cols - Math.floor(numCols / 2)) : Math.floor(cols / 2) - Math.floor(numCols / 2);

      (await Promise.all(
        Array.from({ length: numRows * numCols }, (_, i) => {
          const r = sR + Math.floor(i / numCols), c = sC + (i % numCols);
          return r < numRows && c < cols ? loadImg(`${path}${name}-${r * cols + c + 1}.${imageExtension}`) : null;
        })
      )).forEach((img, i) => img && ctx.drawImage(img, (i % numCols) * sw, Math.floor(i / numCols) * sh, sw, sh));

      el.src = c.toDataURL('image/webp');
    } catch (e) { console.error(e); }
  };

  const handleResize = debounce(() => {
    const w = innerWidth, h = innerHeight;
    if (w === prevW && h === prevH) return;
    prevW = w; prevH = h;
    elems.forEach(el => processImgs(el, w, h));
  }, 200);

  const obs = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) { handleResize(); obs.unobserve(x.target); } }));
  window.addEventListener('load', handleResize);
  elems.forEach(el => obs.observe(el));
  window.addEventListener('resize', handleResize);
}

window.onload = pruner;