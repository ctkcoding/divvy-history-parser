// content.js – runs in the context of the webpage
const api = (typeof browser !== 'undefined') ? browser : chrome;
console.log('Content script injected');

(async () => {
  let html = document.documentElement.outerHTML;
  const doctype = document.doctype ? document.doctype.outerHTML + "\n" : "";
  html = doctype + html;
  try {
    console.log('Sending page HTML to background');
    await api.runtime.sendMessage({ type: "html", html });
  } catch (e) {
    console.error("Failed to send page HTML to background:", e);
  }
})();
