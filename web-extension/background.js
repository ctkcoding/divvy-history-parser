// background.js – handles messaging and download
const api = (typeof browser !== 'undefined') ? browser : chrome;

if (!api.scripting) {
  console.warn('scripting API not available in this environment.');
}

console.log('Background worker initialized, api:', api);

// Existing Show Page logic
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

// Handle "html" from content script
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

// Inline content‑script functions for "showMore" and "rideOverview"

function runShowMore() {
  // selector that matches the provided button
  const selector = 'button[data-testid="DATA_TESTID_SHOW_MORE"]';
  // delay between simulated clicks
  const CLICK_DELAY_MS = 500;
  let clickCount = 0;

  async function loop() {
    while (true) {
      const btn = document.querySelector(selector);
      if (!btn) break; // button no longer present
      // if button is disabled via native disabled attribute or aria-disabled
      if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') break;

      // dispatch a real click event to emulate user interaction
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      clickCount++;
      chrome.runtime.sendMessage({ type: 'showMoreProgress', count: clickCount });

      console.log('Show More click', clickCount);
      await new Promise(r => setTimeout(r, CLICK_DELAY_MS));
    }
    chrome.runtime.sendMessage({ type: 'showMoreFinished', count: clickCount });
  }
  loop();
}

function runRideOverview() {
  const selector = 'div[data-testid="DATA_TESTID_RIDE_OVERVIEW_CARD"]';
  const cards = Array.from(document.querySelectorAll(selector));
  let clickCount = 0;
  const delay = ms => new Promise(r => setTimeout(r, ms));

  async function processCards() {
    for (const card of cards) {
      // card.click(); // optional
      clickCount++;
      chrome.runtime.sendMessage({ type: 'rideOverviewProgress', count: clickCount });
      await delay(200);
    }
    chrome.runtime.sendMessage({ type: 'rideOverviewFinished', count: clickCount });
  }
  processCards();
}

async function handleShowMore() {
  console.log('handleShowMore called');
  const tabs = await api.tabs.query({ active: true, lastFocusedWindow: true });
  const activeTab = tabs[0];
  if (!activeTab) return;
  console.log('Active tab id:', activeTab.id);
  await api.scripting.executeScript({
    target: { tabId: activeTab.id },
    func: runShowMore,
    args: []
  });
  console.log('runShowMore injected');
}

async function handleRideOverview() {
  console.log('handleRideOverview called');
  const tabs = await api.tabs.query({ active: true, lastFocusedWindow: true });
  const activeTab = tabs[0];
  if (!activeTab) return;
  console.log('Active tab id:', activeTab.id);
  await api.scripting.executeScript({
    target: { tabId: activeTab.id },
    func: runRideOverview,
    args: []
  });
  console.log('runRideOverview injected');
}

// Dispatch messages

api.runtime.onMessage.addListener((msg, sender) => {
  switch (msg.type) {
    case 'showMore':
      return handleShowMore();
    case 'rideOverview':
      return handleRideOverview();
    case 'rip':
      return onRipMessage(msg, sender);
  }
});

