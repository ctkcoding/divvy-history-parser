// popup.js – popup logic
const api = (typeof browser !== 'undefined') ? browser : chrome;

console.log('Popup loaded – click rip to send message');

document.getElementById("ripBtn").addEventListener("click", () => {
  api.runtime.sendMessage({ type: "rip" });
  // Close the popup after sending the message
  window.close();
});
