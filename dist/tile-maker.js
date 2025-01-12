function loadScript(src, callback) {
  var script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = callback;
  document.head.appendChild(script);
}

loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js", function () {
  console.log("JSZip library loaded successfully.");
  initialiseTileMaker();
});

function initialiseTileMaker() {
  var style = document.createElement('style');
  style.innerHTML = `
    #tile-image-container {
      position: relative;
      display: inline-block;
      width: 650px;
      margin-top: 1em
      aspect-ratio: 16 / 9
    }

    #tile-image-container img {
      max-width: 100%;
      height: auto;
      display: block
    }

    #tile-grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 650px;
      aspect-ratio: 16 / 9;
      display: grid;
      grid-template-columns: repeat(14, 1fr);
      grid-template-rows: repeat(6, 1fr);
      pointer-events: none;
      mix-blend-mode: difference
    }

    #tile-grid-overlay div {
      pointer-events: auto;
      border: 1px solid #fff
    }

    .roi {
      background-color: #fff
    }
  `;
  document.head.appendChild(style);

  document.getElementById('tile-maker').innerHTML = `
    <input type="file" id="image-upload" accept="image/*" style="display: none;">
    <button id="upload-button" class="styled-button">Upload Image</button>
    <div id="controls" style="display: none;">
      <h2>1. Select Region of Interest</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean volutpat luctus nibh.</p>
      <div id="tile-image-container">
        <img id="tile-image-preview" src="" alt="Image Preview">
        <div id="tile-grid-overlay"></div>
      </div>
      <h2>2. Export Tiles</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean volutpat luctus nibh.</p>
      <details>
        <summary>Tile Settings</summary>
        <h3>Image Name</h3>
        <input type="text" id="file-name" value="" placeholder="">
        <h3>Density</h3>
        <input type="radio" id="density-1x" name="density" value="1" checked>
        <label for="density-1x">1x</label>
        <input type="radio" id="density-2x" name="density" value="2">
        <label for="density-2x">2x</label>
        <h3>Compression</h3>
        <input type="range" id="quality" min="0" max="100" value="80">
        <label>Compression level <span id="quality-value">80</span>%</label>
      </details>
      <button id="export-button">Export</button>
      <h2>3. Copy HTML Snippet</h2>
      <p>Update the 'path' parameter in the HTML snippet to point to the location of your tiles. Don't forget to include image 'alt' text as well.</p>
      <pre id="html-snippet"></pre>
      <button id="copy-button">Copy</button>
      <h2>4. Install Pruner.js</h2>
      <p>Add Pruner.js before the closing '</html>' tag in your HTML file.</p>
      <pre id="script-snippet">&lt;script async src="https://unpkg.com/prunerjs/dist/pruner.min.js"&gt;&lt;/script&gt;</pre>
      <button id="copy-script-button">Copy</button>
      <h2>5. Start Again</h2>
      <p>To format another image press the 'reset' button.</p>
      <button id="reset-button">Reset</button>
    </div>
  `;

  setupEventListeners();
}

function setupEventListeners() {
  var elements = {
    imageUpload: document.getElementById('image-upload'),
    uploadButton: document.getElementById('upload-button'),
    controls: document.getElementById('controls'),
    exportButton: document.getElementById('export-button'),
    copyButton: document.getElementById('copy-button'),
    copyScriptButton: document.getElementById('copy-script-button'),
    resetButton: document.getElementById('reset-button'),
    densityRadios: document.getElementsByName('density'),
    qualitySlider: document.getElementById('quality'),
    qualityValue: document.getElementById('quality-value'),
    imagePreview: document.getElementById('tile-image-preview'),
    gridOverlay: document.getElementById('tile-grid-overlay'),
    htmlSnippet: document.getElementById('html-snippet'),
    scriptSnippet: document.getElementById('script-snippet'),
    fileNameInput: document.getElementById('file-name')
  };

  var selectedROI = null, originalImageName = '', loadingInterval;

  elements.uploadButton.addEventListener('click', function () { elements.imageUpload.click(); });
  elements.imageUpload.addEventListener('change', handleImageUpload);
  elements.exportButton.addEventListener('click', exportTiles);
  elements.copyButton.addEventListener('click', copyHtmlSnippet);
  elements.copyScriptButton.addEventListener('click', copyScriptSnippet);
  elements.resetButton.addEventListener('click', reset);
  elements.fileNameInput.addEventListener('input', updateHtmlSnippet);
  elements.qualitySlider.addEventListener('input', function () {
    elements.qualityValue.textContent = elements.qualitySlider.value;
    updateHtmlSnippet();
  });

  function handleImageUpload(event) {
    var file = event.target.files[0];
    if (file) {
      originalImageName = file.name.split('.')[0];
      elements.fileNameInput.placeholder = originalImageName.replace(/\s+/g, '-');
      var reader = new FileReader();
      reader.onload = function (e) {
        var img = new Image();
        img.src = e.target.result;
        img.onload = function () {
          var aspectRatio = 16 / 9;
          var imgAspectRatio = img.width / img.height;
          var cropWidth, cropHeight;

          if (imgAspectRatio > aspectRatio) {
            cropHeight = img.height;
            cropWidth = img.height * aspectRatio;
          } else {
            cropWidth = img.width;
            cropHeight = img.width / aspectRatio;
          }

          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          canvas.width = cropWidth;
          canvas.height = cropHeight;
          ctx.drawImage(img, (img.width - cropWidth) / 2, (img.height - cropHeight) / 2, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

          elements.imagePreview.src = canvas.toDataURL();
          elements.imagePreview.onload = function () {
            createGridOverlay();
            updateHtmlSnippet();
          };
          elements.uploadButton.style.display = 'none';
          elements.controls.style.display = 'block';
        };
      };
      reader.readAsDataURL(file);
    }
  }

  function createGridOverlay() {
    elements.gridOverlay.innerHTML = '';
    for (var i = 0; i < 112; i++) {
      var div = document.createElement('div');
      div.addEventListener('click', function () { selectROI(this); });
      elements.gridOverlay.appendChild(div);
    }
  }

  function selectROI(div) {
    if (selectedROI) selectedROI.classList.remove('roi');
    selectedROI = div;
    selectedROI.classList.add('roi');
    updateHtmlSnippet();
  }

  function updateHtmlSnippet() {
    var density = Array.from(elements.densityRadios).find(function (radio) { return radio.checked; }).value;
    var roiIndex = selectedROI ? Array.from(selectedROI.parentNode.children).indexOf(selectedROI) + 1 : 1;
    var fileName = elements.fileNameInput.value || originalImageName.replace(/\s+/g, '-');
    elements.htmlSnippet.textContent = `<img data-pruner='{"name": "${fileName}", "tile": "14 8", "roi": ${roiIndex}, "path": "YOUR-PATH-HERE/"}' alt="YOUR-ALT-TEXT-HERE">`;
  }

  function copyHtmlSnippet() {
    var range = document.createRange();
    range.selectNode(elements.htmlSnippet);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    elements.copyButton.textContent = 'Copied';
    setTimeout(function () {
      elements.copyButton.textContent = 'Copy';
    }, 3000);
  }

  function copyScriptSnippet() {
    var range = document.createRange();
    range.selectNode(elements.scriptSnippet);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    elements.copyScriptButton.textContent = 'Copied';
    setTimeout(function () {
      elements.copyScriptButton.textContent = 'Copy';
    }, 3000);
  }

  function exportTiles() {
    elements.exportButton.textContent = 'Exporting...';

    var dots = 0;
    loadingInterval = setInterval(function () {
      dots = (dots + 1) % 4;
      elements.exportButton.textContent = `Exporting${'.'.repeat(dots)}`;
    }, 350);

    var img = elements.imagePreview;
    var quality = parseInt(elements.qualitySlider.value, 10);
    var density = parseInt(Array.from(elements.densityRadios).find(function (radio) { return radio.checked; }).value, 10);
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 1920 * density;
    canvas.height = 1080 * density;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    var tileWidth = canvas.width / 14;
    var tileHeight = canvas.height / 6;

    var zip = new JSZip();
    var promises = [];
    for (var row = 0; row < 8; row++) {
      for (var col = 0; col < 14; col++) {
        (function (row, col) {
          var tileCanvas = document.createElement('canvas');
          var tileCtx = tileCanvas.getContext('2d');
          tileCanvas.width = tileWidth;
          tileCanvas.height = tileHeight;
          tileCtx.drawImage(canvas, col * tileWidth, row * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
          promises.push(new Promise(function (resolve) {
            tileCanvas.toBlob(function (blob) {
              zip.file(`${elements.fileNameInput.value || originalImageName.replace(/\s+/g, '-')}-${row * 14 + col + 1}.webp`, blob, { compression: 'DEFLATE', compressionOptions: { level: 9 } });
              resolve();
            }, 'image/webp', quality / 100);
          }));
        })(row, col);
      }
    }

    Promise.all(promises).then(function () {
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = `${elements.fileNameInput.value || originalImageName.replace(/\s+/g, '-')}-prunerjs.zip`;
        a.click();
        clearInterval(loadingInterval);
        elements.exportButton.textContent = 'Export';
      });
    });
  }

  function reset() {
    elements.uploadButton.style.display = 'block';
    elements.controls.style.display = 'none';
    elements.imagePreview.src = '';
    elements.gridOverlay.innerHTML = '';
    elements.htmlSnippet.textContent = '';
    selectedROI = null;
    originalImageName = '';
    elements.imageUpload.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}