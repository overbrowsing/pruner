function pruner() {
  const elems = [...document.querySelectorAll('[data-pruner]')],
    cache = {},
    d = (fn, t) => {
      let h;
      return (...a) => {
        clearTimeout(h);
        h = setTimeout(() => fn(...a), t);
      };
    },
    l = (s) => cache[s] || (cache[s] = new Promise((r, e) => {
      const i = new Image();
      i.crossOrigin = 'ANON';
      i.onload = () => r(i);
      i.onerror = () => e(s);
      i.src = s;
    }));

  const p = async (el, vw, vh) => {
    const { name, tile, scale = "1 0", path = '', roi, imageExtension = 'webp' } = JSON.parse(el.dataset.pruner);

    if (!tile || !name) return;

    const [cols, rows] = tile.split(" ").map(Number),
      [sf, bp] = scale.split(" ").map(Number),
      m = vw <= bp,
      { width: w, height: h } = await l(`${path}${name}-1.${imageExtension}`),
      sw = Math.round(w * (m ? sf : 1)),
      sh = Math.round(h * (m ? sf : 1)),
      nc = Math.min(Math.ceil(vw / sw), cols),
      nr = Math.min(Math.ceil(vh / sh), rows),
      c = document.createElement('canvas');

    c.width = nc * sw;
    c.height = nr * sh;

    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    el.src = '';

    const cs = (v, mn, mx) => Math.max(mn, Math.min(v, mx)),
      sr = cs(
        (roi
          ? Math.floor((roi - 1) / cols) - Math.floor(nr / 2)
          : Math.floor(rows / 2) - Math.floor(nr / 2)),
        0,
        rows - nr
      ),
      sc = cs(
        (roi
          ? (roi - 1) % cols - Math.floor(nc / 2)
          : Math.floor(cols / 2) - Math.floor(nc / 2)),
        0,
        cols - nc
      );

    (await Promise.all(
      Array(nr * nc)
        .fill()
        .map((_, i) => {
          const r = sr + Math.floor(i / nc),
            c = sc + (i % nc);
          return r < rows && c < cols
            ? l(`${path}${name}-${r * cols + c + 1}.${imageExtension}`)
            : null;
        })
    )).forEach((img, i) => {
      if (img) ctx.drawImage(img, (i % nc) * sw, Math.floor(i / nc) * sh, sw, sh);
    });

    el.src = c.toDataURL('image/webp');
  };

  let pw = 0,
    ph = 0,
    r = d(() => {
      const w = innerWidth,
        h = innerHeight;

      if (w !== pw || h !== ph) {
        pw = w;
        ph = h;
        elems.forEach((e) => p(e, w, h));
      }
    }, 200);

  const obs = new IntersectionObserver((es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        r();
        obs.unobserve(e.target);
      }
    })
  );

  window.addEventListener('load', r);
  elems.forEach((el) => obs.observe(el));
  window.addEventListener('resize', r);
}

window.onload = pruner;