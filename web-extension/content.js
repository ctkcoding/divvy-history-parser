// content.js – runs in the context of the webpage
const api = window.browser || window.chrome;

(async () => {
  let html = document.documentElement.outerHTML;
  // Prepend DOCTYPE if present
  const doctype = document.doctype ? document.doctype.outerHTML + "\n" : "";
  html = doctype + html;
  try {
    api.runtime.sendMessage({ type: "html", html });
  } catch (e) {
    console.error("Failed to send page HTML to background:", e);
  }
})();
