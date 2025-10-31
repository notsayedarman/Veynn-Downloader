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
- Works on manga reader sites like `mangaread.org`,`mangafire.to` etc.

---

## 🧰 Installation

1. Download all project files and extract zip file.
![Alt text](https://media.discordapp.net/attachments/1433507733323382814/1433508288649105438/Screenshot_2.png?ex=6904f221&is=6903a0a1&hm=53272b2b2c403579c19db8c7c407c0081e397c4ef7c24cfa35512ce39dd5f8d3&=&format=webp&quality=lossless&width=1231&height=693)

2. Extract project zip file.
![Alt text](https://media.discordapp.net/attachments/1433507733323382814/1433507873341575240/Screenshot_2025-10-30_224920.png?ex=6904f1be&is=6903a03e&hm=5a5ee1268f0f3f01e911776c26702fb2eef07e7c9a860d3ed26447b9927df24d&=&format=webp&quality=lossless&width=1233&height=693)

3. Open **Chrome** and go to:
   ```
   chrome://extensions/
   ```

4. Enable **Developer mode** (top right).

5. Click **Load unpacked** and select the `Veynn-Downloader-main` folder.
![Alt text](https://media.discordapp.net/attachments/1433507733323382814/1433507872054055025/Screenshot_2025-10-30_225015.png?ex=6904f1bd&is=6903a03d&hm=dcc3d5c7451d5d4bbeff75b6f1c3e8b584e91818fb47936e1d40b9a42948fe4e&=&format=webp&quality=lossless&width=1233&height=693)
![Alt text](https://media.discordapp.net/attachments/1433507733323382814/1433507872486064169/Screenshot_2025-10-30_225045.png?ex=6904f1be&is=6903a03e&hm=8549488f6ccb892416e769a89726352e32eaa4564ccefca6289ef9b9075f4a16&=&format=webp&quality=lossless&width=1233&height=693)

6. The extension icon should now appear on the Chrome Extensions.

7. Pin the extension

## USE A ADBLOCKER TO PREVENT DOWNLOADING UNWANTED IMAGES

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

---

## ⚙️ Customization

### 1. Replace Words  
Edit `config/ignore.txt` and add site names or unwanted words to remove from folder titles.  
Example:
```
mangaread
chapter
read

## 🧪 Tested On
- `mangaread.org` `colamanga`
- Any site where images are in `<img src="...">`.

---

## 🧹 Notes
- No server or API involved. All processing is local.  
- Only needs permission for active tab and downloads.  
- Automatically ignores horizontal banners, `.gif` animations.



