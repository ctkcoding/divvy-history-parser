// popup.js – popup logic
const api = (typeof browser !== 'undefined') ? browser : chrome;

function updateProgress(count) {
  const bar = document.getElementById('progressBarFill');
  const text = document.getElementById('progressText');
  text.textContent = `${count} ${count === 1 ? "click" : "clicks"}`;
  const widthPercent = Math.min(100, count * 5); // 5% per click, cap at 100
  bar.style.width = widthPercent + '%';
}

// reset progress bar for a new operation
function resetProgress() {
  const bar = document.getElementById('progressBarFill');
  const text = document.getElementById('progressText');
  bar.style.background = '#4caf50';
  bar.style.width = '0%';
  text.textContent = '0 clicks';
}

document.getElementById('ripBtn').addEventListener('click', () => {
  api.runtime.sendMessage({ type: 'rip' });
  window.close();
});

document.getElementById('showMoreBtn').addEventListener('click', () => {
  resetProgress();
  api.runtime.sendMessage({ type: 'showMore' });
});

document.getElementById('rideOverviewBtn').addEventListener('click', () => {
  resetProgress();
  api.runtime.sendMessage({ type: 'rideOverview' });
});

// listen for progress updates
api.runtime.onMessage.addListener(msg => {
  if (msg.type === 'showMoreProgress' || msg.type === 'rideOverviewProgress') {
    updateProgress(msg.count);
  }
  if (msg.type === 'showMoreFinished' || msg.type === 'rideOverviewFinished') {
    // change bar color to indicate completion
    const bar = document.getElementById('progressBarFill');
    bar.style.background = '#2196f3'; // blue when finished
  }
});
