const logBox = document.getElementById("logs");
const startBtn = document.getElementById("start");
const toggleLogsBtn = document.getElementById("toggleLogs");
const progressContainer = document.getElementById("progressContainer");
const progressText = document.querySelector(".progress-text");
const progressBar = document.querySelector(".progress-ring .bar");
const status = document.getElementById("status");

let total = 0;
let downloaded = 0;
const circumference = 251;

function log(t) {
  const line = document.createElement("div");
  line.textContent = t;
  logBox.appendChild(line);
  logBox.scrollTop = logBox.scrollHeight;
}

function updateProgress() {
  if (total === 0) return;
  const progress = downloaded / total;
  const offset = circumference * (1 - progress);
  progressBar.setAttribute("stroke-dashoffset", offset);
  progressText.textContent = `${Math.round(progress * 100)}%`;
  status.textContent = `${downloaded} / ${total} downloaded`;
}

function showLogs() {
  status.style.display = "none";
  progressContainer.style.display = "none";
  logBox.style.display = "block";
  toggleLogsBtn.textContent = "Hide Logs";
}

function hideLogs() {
  logBox.style.display = "none";
  status.style.display = "block";
  if (total > 0) progressContainer.style.display = "block";
  toggleLogsBtn.textContent = "Show Logs";
}

function toggleLogs() {
  if (logBox.style.display === "none") showLogs();
  else hideLogs();
}

startBtn.onclick = async () => {
  if (startBtn.disabled) return;

  total = downloaded = 0;
  logBox.textContent = "";
  hideLogs();
  status.textContent = "Injecting...";
  progressContainer.style.display = "block";
  startBtn.disabled = true;
  progressBar.setAttribute("stroke-dashoffset", circumference);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["collector.js"]
    });
    log("Collector injected");
  } catch (e) {
    log(`Injection failed: ${e.message}`);
    resetUI();
  }
};

function resetUI() {
  startBtn.disabled = false;
  progressContainer.style.display = "none";
  status.textContent = "Ready for next chapter.";
  hideLogs();
}

toggleLogsBtn.onclick = toggleLogs;

chrome.runtime.onMessage.addListener((m) => {
  if (m.log) log(m.log);
  if (m.total !== undefined) {
    total = m.total;
    updateProgress();
  }
  if (m.downloaded) {
    downloaded++;
    updateProgress();
  }
  if (m.done) {
    resetUI();
  }
});