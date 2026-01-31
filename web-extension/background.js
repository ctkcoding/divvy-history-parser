// background.js – handles messaging and download
const api = (typeof browser !== 'undefined') ? browser : chrome;

if (!api.scripting) {
  console.warn('scripting API not available in this environment.');
}

console.log('Background worker initialized, api:', api);

// Handle 'rip' from popup
async function onRipMessage(msg, sender) {
  if (msg.type !== "rip") return;
  try {
    const tabs = await api.tabs.query({ active: true, lastFocusedWindow: true });
    const activeTab = tabs[0];
    if (!activeTab) return;
    if (!api.scripting) {
      console.error('scripting API unavailable – cannot inject content script.');
      return;
    }
    await api.scripting.executeScript({
      target: { tabId: activeTab.id },
      files: ["content.js"]
    });
    console.log('Injected content script into tab', activeTab.id);
  } catch (e) {
    console.error('Error in onRipMessage:', e);
  }
}

// Handle 'html' from content script
function onHtmlMessage(msg, sender) {
  if (msg.type !== "html" || !msg.html) return;
  const { html } = msg;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const sanitize = str => str.replace(/[\/\*:?"<>{}|]/g, "_");
  api.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
    const title = tabs[0]?.title || "page";
    const filename = `${sanitize(title)}-${Date.now()}.html`;
    api.downloads.download({ url, filename, saveAs: false });
    console.log('Downloading file', filename);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  });
}

api.runtime.onMessage.addListener(onRipMessage);
api.runtime.onMessage.addListener(onHtmlMessage);

