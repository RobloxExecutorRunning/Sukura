// === Load Pages in Iframe ===
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const src = link.getAttribute('data-src');
    if (src) {
      document.getElementById('main-frame').src = src;
    }
  });
});

// === Clock & Date ===
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const dateString = now.toDateString();

  document.getElementById('clock').textContent = `${hours}:${minutes}`;
  document.getElementById('date').textContent = dateString;
}

setInterval(updateClock, 1000);
updateClock(); // initial call

// === Battery Status ===
navigator.getBattery?.().then(battery => {
  function updateBatteryInfo() {
    const level = Math.round(battery.level * 100);
    document.getElementById('battery').textContent = `${level}%`;

    const icon = document.getElementById('battery-icon');
    icon.className = 'fa-solid';

    if (battery.charging) {
      icon.classList.add('fa-bolt');
    } else if (level > 80) {
      icon.classList.add('fa-battery-full');
    } else if (level > 60) {
      icon.classList.add('fa-battery-three-quarters');
    } else if (level > 30) {
      icon.classList.add('fa-battery-half');
    } else if (level > 10) {
      icon.classList.add('fa-battery-quarter');
    } else {
      icon.classList.add('fa-battery-empty');
    }
  }

  battery.addEventListener('chargingchange', updateBatteryInfo);
  battery.addEventListener('levelchange', updateBatteryInfo);
  updateBatteryInfo();
});
