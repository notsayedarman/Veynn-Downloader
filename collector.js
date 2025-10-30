async function readList(path) {
  try {
    const text = await (await fetch(chrome.runtime.getURL(path))).text();
    return text.split(/\r?\n/).map(x => x.trim().toLowerCase()).filter(Boolean);
  } catch {
    return [];
  }
}

function sanitizeName(s) {
  return s
    .replace(/[\\\/:*?"<>|_.,'!@#$%^&()\[\]{};`+=~]/g, "")
    .replace(/[\p{Emoji}\p{Extended_Pictographic}\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toTitleCase(s) {
  return s
    .split(" ")
    .map(w => w ? w[0].toUpperCase() + w.slice(1) : "")
    .join(" ");
}

function extractChapterNumber(url, title) {
  const urlNum = url.match(/\d+/g) || [];
  const titleNum = title.match(/\d+/g) || [];
  const common = urlNum.find(n => titleNum.includes(n));
  return common || "unknown";
}

async function getImageSize(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const size = parseInt(res.headers.get("content-length") || "0", 10);
    return isNaN(size) ? 0 : size;
  } catch {
    return 0;
  }
}

async function runCollector(minSize = 200 * 1024) {
  const post = msg => chrome.runtime.sendMessage({ log: msg });

  const replaceWords = await readList("config/ignore.txt");
  const url = window.location.href;
  const hostname = new URL(url).hostname.replace(/^www\./, "");

  // --- Title cleanup system ---
  let title = document.title;
  title = sanitizeName(title);

  // Split words, lowercase for comparison, remove matched words
  let parts = title.split(/\s+/).filter(Boolean);
  parts = parts.filter(p => !replaceWords.includes(p.toLowerCase()));

  // Recombine and title-case each word
  title = toTitleCase(parts.join(" "));
  // Remove hostname remnants
  title = title.replace(hostname.split(".")[0], "").trim();

  const chapter = extractChapterNumber(url, title);
  post(`Folder: ${title} / Chapter ${chapter}`);

  // --- Image collection ---
  const imgs = Array.from(document.images)
    .map(i => i.src)
    .filter(Boolean)
    .filter(src => !src.toLowerCase().endsWith(".gif"));

  post(`Found ${imgs.length} images`);

  for (let i = 0; i < imgs.length; i++) {
    const src = imgs[i];
    const size = await getImageSize(src);
    if (size < minSize) {
      post(`Ignored small image (${Math.round(size / 1024)} KB): ${src}`);
      continue;
    }

    const filename = `img_${String(i + 1).padStart(3, "0")}.jpg`;
    const path = `Veynn/${title}/chapter/${chapter}/${filename}`;

    try {
      await chrome.runtime.sendMessage({ download: { url: src, filename: path } });
      post(`Downloaded ${filename} (${Math.round(size / 1024)} KB)`);
    } catch (e) {
      post(`Failed ${src}`);
    }
  }

  post("Completed.");
  chrome.runtime.sendMessage({ done: true });
}

// auto-run when injected
runCollector();
