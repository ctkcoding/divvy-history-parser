const api = window.browser || window.chrome;

document.getElementById("ripBtn").addEventListener("click", () => {
  api.runtime.sendMessage({ type: "rip" });
  // Close the popup after sending the message
  window.close();
});
