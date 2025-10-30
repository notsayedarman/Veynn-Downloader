# 🧩 Veynn Downloader (Chrome Extension)

Collects and downloads manga, manhwa, manhua, or donghua chapter images from any website.
Automatically skips small or GIF images, cleans folder names, and saves organized chapter folders.
May break on some sites depending on structure or image-loading methods.

---

## 📦 Features
- Downloads all `<img>` elements from current tab.  
- Skips `.gif` files automatically.  
- Cleans titles using `config/replace.txt`.  
- Saves files as:
  ```
  Veynn/<Title>/chapter/<Number>/img_001.jpg
  ```
- Works on manga reader sites like `mangaread.org`, etc.

---

## 🧰 Installation

1. Download all project files and extract zip file.
2. Open **Chrome** and go to:
   ```
   chrome://extensions/
   ```

3. Enable **Developer mode** (top right).

4. Click **Load unpacked** and select the `Veynn-Downloader-main` folder.

5. The extension icon should now appear on the Chrome Extensions.

6. Pin the extension

---

## 🖱️ Usage

1. Open any manga chapter page in Chrome.  
2. Click the **extension icon** → press **Start**.  
3. The popup window will display logs such as:
   ```
   Running collector... (min 200 KB)
   Found 12 images
   Downloaded img_001.jpg (341 KB)
   Completed.
   ```
4. Downloads will be saved to your browser’s default **Downloads** folder.

## USE A ADBLOCKER TO PREVENT DOWNLOADING UNWANTED IMAGES

---

## ⚙️ Customization

### 1. Replace Words  
Edit `config/replace.txt` and add site names or unwanted words to remove from folder titles.  
Example:
```
mangaread
chapter
read
```

### 2. Minimum Image Size  
In `popup.js`, change the line:
```js
const minSizeKB = parseInt(document.getElementById("minSize").value) || 200;
```
Change `200` to any KB value you prefer.

---

## 🧪 Tested On
- `mangaread.org`
- Any site where images are in `<img src="...">`.

---

## 🧹 Notes
- No server or API involved. All processing is local.  
- Only needs permission for active tab and downloads.  
- Automatically ignores horizontal banners, `.gif` animations.



