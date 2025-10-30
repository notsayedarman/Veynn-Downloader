const logBox = document.getElementById("logs");

function log(t) {
  logBox.textContent += t + "\n";
  logBox.scrollTop = logBox.scrollHeight;
}

document.getElementById("start").onclick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  log("Running collector...");

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["collector.js"]
  });
};

chrome.runtime.onMessage.addListener((m) => {
  if (m.log) log(m.log);
  if (m.done) log("Completed.");
});
