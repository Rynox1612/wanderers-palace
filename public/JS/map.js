const map = L.map("map").setView([19.076, 72.8777], 12); // Mumbai coordinates

// Add the OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Optional: add a marker
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "marker-icon-2x.png",
//   iconUrl: "marker-icon.png",
//   shadowUrl: "marker-shadow.png",
// });

// Create your custom default icon
const defaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png", // correct path
  iconRetinaUrl: "/images/marker-icon-2x.png", // optional
  shadowUrl: "/images/marker-shadow.png", // optional
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Override Leaflet's default icon globally
L.Marker.prototype.options.icon = defaultIcon;

const marker = L.marker([19.076, 72.8777]).addTo(map);
marker.bindPopup("<b>Rupesh bhai’s spot!</b><br>Mumbai rocks.").openPopup();
