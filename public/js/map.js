const mapElement = document.getElementById("map");

const coordinates = JSON.parse(mapElement.dataset.coordinates);
const title = mapElement.dataset.title;

const longitude = coordinates[0];
const latitude = coordinates[1];


// Custom marker
const customIcon = L.icon({
  iconUrl: "/images/marker.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});


// Create map
const map = L.map("map").setView([latitude, longitude], 13);


// Light map style
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }
).addTo(map);


const popupContent = `
  <div class="custom-popup">
    <h5>${title}</h5>

    <p>
      <i class="fa-solid fa-circle-info"></i>
      Exact location will be provided after booking.
    </p>
  </div>
`;


L.marker([latitude, longitude], {
  icon: customIcon
})
  .addTo(map)
  .bindPopup(popupContent, {
    maxWidth: 280,
    minWidth: 240,
    closeButton: true
  })
  .openPopup();