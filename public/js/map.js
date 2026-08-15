  const map = L.map('map').setView([28.6139, 77.2090], 10);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([28. , 77.2089])
    .addTo(map)
    .bindPopup('<b>Your Listing Location</b>')
    .openPopup();
