
// === Page load logic for iframe and loading bar ===

const iframe = document.getElementById('main-frame');
const loadingBar = document.getElementById('loading-bar');

// Show loading bar when iframe starts loading
iframe.addEventListener('loadstart', () => {
  loadingBar.style.width = '0%';
  loadingBar.style.display = 'block';
});

// Animate loading bar while iframe is loading
iframe.addEventListener('load', () => {
  loadingBar.style.width = '100%';
  setTimeout(() => {
    loadingBar.style.display = 'none';
    loadingBar.style.width = '0%';
  }, 500);
});

// Optional fallback for browsers that don't support loadstart
document.addEventListener('DOMContentLoaded', () => {
  loadingBar.style.width = '100%';
  setTimeout(() => {
    loadingBar.style.display = 'none';
    loadingBar.style.width = '0%';
  }, 500);
});
