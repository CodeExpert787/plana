"use client";
import React from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = "pk.eyJ1IjoiaHlhdGxhcyIsImEiOiJjbDRzb21nc3gwNXk2M2JvNmZ6cGV2eGtiIn0.XXSaRnbx-xYpody1GSjkRw"; // Replace with your token

export default function MapPage() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Map
        initialViewState={{
          longitude:-71.30822, // Example: Bariloche
          latitude: -41.14557,
          zoom: 14,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* Example marker */}
        <Marker longitude={-71.30822} latitude={-41.14557} />
      </Map>
    </div>
  );
}