// background.js – handles messaging and download
const api = window.browser || window.chrome;

// Handle 'rip' from popup
async function onRipMessage(msg, sender) {
  if (msg.type !== "rip") return;
  const tabs = await api.tabs.query({ active: true, lastFocusedWindow: true });
  const activeTab = tabs[0];
  if (!activeTab) return;
  await api.scripting.executeScript({
    target: { tabId: activeTab.id },
    files: ["content.js"]
  });
}

// Handle 'html' from content script
function onHtmlMessage(msg, sender) {
  if (msg.type !== "html" || !msg.html) return;
  const { html } = msg;
  const tabId = sender.tab ? sender.tab.id : undefined;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const sanitize = str => str.replace(/[\\/:*?"<>{}|]/g, "_");
  api.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
    const title = tabs[0]?.title || "page";
    const filename = `${sanitize(title)}-${Date.now()}.html`;
    api.downloads.download({ url, filename, saveAs: false });
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  });
}

api.runtime.onMessage.addListener(onRipMessage);
api.runtime.onMessage.addListener(onHtmlMessage);

