document.addEventListener('DOMContentLoaded', function() {
  if (!mapToken || !coordinates || !listingData) {
    console.error('Missing required data:', { mapToken, coordinates, listingData });
    return;
  }

  mapboxgl.accessToken = mapToken;
  
  const coordArray = Array.isArray(coordinates) ? coordinates : [coordinates.lng, coordinates.lat];
  
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v9",
    center: coordArray,
    zoom: 10,
  });

  const marker = new mapboxgl.Marker({color:"red"})
    .setLngLat(coordArray)
    .setPopup(
      new mapboxgl.Popup({offset: 25}).setHTML(
        `<h4>${listingData.title}</h4><p>Exact location will be provided after booking</p>`
      )
    )
    .addTo(map);
});

      
      
      
  