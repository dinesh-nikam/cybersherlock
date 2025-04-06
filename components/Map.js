import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Map({ coordinates, zoom = 13 }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      console.error("Mapbox access token is missing.");
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12", // Mapbox style
      center: coordinates,
      zoom: zoom,
    });

    // Add a marker at the coordinates
    new mapboxgl.Marker().setLngLat(coordinates).addTo(map);

    // Clean up on unmount
    return () => map.remove();
  }, [coordinates, zoom]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: "400px", width: "100%" }}
      className="rounded shadow"
    />
  );
}
