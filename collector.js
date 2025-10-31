(() => {
  if (window.__VEYNN_RUNNING) {
    chrome.runtime.sendMessage({ log: "[INFO] Already running." });
    chrome.runtime.sendMessage({ done: true });
    return;
  }
  window.__VEYNN_RUNNING = true;

  (async () => {
    const post = m => chrome.runtime.sendMessage({ log: m });

    async function readList(path) {
      try {
        const txt = await (await fetch(chrome.runtime.getURL(path))).text();
        return txt.split(/\r?\n/).map(l => l.split('#')[0].trim()).filter(Boolean);
      } catch { return []; }
    }

    const replaceWords = await readList("config/ignore.txt");
    const blacklist = await readList("config/blacklist.txt");

    function sanitizeName(s) {
      return s.replace(/[\\\/:*?<>|.,'!@#$%^&()\[\]{};`+=~]/g, "")
              .replace(/[\p{Emoji}\p{Extended_Pictographic}\u{1F000}-\u{1FFFF}]/gu, "")
              .replace(/\s+/g, " ").trim();
    }
    function toTitleCase(s) {
      return s.split(" ").map(w => w ? w[0].toUpperCase() + w.slice(1) : "").join(" ");
    }

    function extractChapterNumber(url, title) {
      const patterns = [
        /chapter[_\-\s]?(\d+(\.\d+)?)/i,
        /ch[_\-\s]?(\d+(\.\d+)?)/i,
        /capitulo[_\-\s]?(\d+(\.\d+)?)/i,
        /vol(?:ume)?[_\-\s]?(\d+)[_\-\s]chapter[_\-\s]?(\d+(\.\d+)?)/i,
        /episode[_\-\s]?(\d+(\.\d+)?)/i,
        /part[_\-\s]?(\d+(\.\d+)?)/i,
        /#(\d+(\.\d+)?)/,
        /(\d+(\.\d+)?)/
      ];
      const text = `${url} ${title}`.toLowerCase();
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          const num = match[1] || match[2] || match[3];
          if (num && parseFloat(num) >= 0.1) return num;
        }
      }
      return "unknown";
    }

    let title = sanitizeName(document.title);
    title = title.split(/\s+/).filter(w => !replaceWords.includes(w.toLowerCase()));
    title = toTitleCase(title.join(" "));
    title = title.replace(new RegExp(location.hostname.split(".")[0], "i"), "").trim();
    const chapter = extractChapterNumber(location.href, title);
    post(`Folder: ${title} / Chapter ${chapter}`);

    const imgElements = Array.from(document.images).filter(img => {
      const src = img.src || img.dataset.src || img.getAttribute("data-lazy-src") || "";
      return src && !src.toLowerCase().endsWith(".gif") && !src.toLowerCase().endsWith(".svg");
    });

    chrome.runtime.sendMessage({ total: imgElements.length });
    post(`Found ${imgElements.length} images`);

    async function imgToBlob(img) {
      return new Promise(resolve => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const draw = () => {
          try { ctx.drawImage(img, 0, 0); canvas.toBlob(b => resolve(b), "image/jpeg", 0.95); }
          catch { resolve(null); }
        };
        if (img.complete && img.naturalWidth > 0) draw();
        else { img.onload = draw; img.onerror = () => resolve(null); setTimeout(() => resolve(null), 10000); }
      });
    }

    async function urlToBlobWithFetch(src) {
      try {
        const res = await fetch(src, { credentials: "omit", referrerPolicy: "no-referrer" });
        if (!res.ok) return null;
        const blob = await res.blob();
        if (blob.type.includes("image")) return blob;
      } catch { return null; }
      return null;
    }

    function isBlacklisted(src) {
      return blacklist.some(r => src.includes(r));
    }

    let cnt = 0;
    for (let i = 0; i < imgElements.length; i++) {
      const img = imgElements[i];
      const src = img.src || img.dataset.src || img.getAttribute("data-lazy-src") || "";

      if (isBlacklisted(src)) {
        post(`[BLACKLIST] Skipped: ${src}`);
        chrome.runtime.sendMessage({ downloaded: true });
        continue;
      }

      const fn = `img_${String(i+1).padStart(3,"0")}.jpg`;
      const path = `Veynn/${title}/chapter/${chapter}/${fn}`;

      let blob = await imgToBlob(img);
      if (!blob && !src.startsWith("blob:")) {
        post(`[CORS] Fetch retry: ${src}`);
        blob = await urlToBlobWithFetch(src);
      }

      if (blob) {
        const url = URL.createObjectURL(blob);
        chrome.runtime.sendMessage({ download: { url, filename: path, size: blob.size } }, () => URL.revokeObjectURL(url));
        post(`Downloaded ${fn}`);
        cnt++;
      } else {
        post(`Failed: ${src}`);
      }
      chrome.runtime.sendMessage({ downloaded: true });
    }

    post(`Completed. ${cnt} image(s) downloaded.`);
    chrome.runtime.sendMessage({ done: true });
    window.__VEYNN_RUNNING = false;
  })();
})();