chrome.runtime.onMessage.addListener((msg) => {
  if (msg.download) {
    chrome.downloads.download({
      url: msg.download.url,
      filename: msg.download.filename,
      conflictAction: "uniquify"
    });
  }
});
