"use client";

import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from "react-leaflet";

type Zone = {
  name: string;
  zone: string;
  apiZone: string;
  lag: number;
  r: number;
};

type Props = {
  locations: Zone[];
  selected: number;
  layer: string;
  onSelect: (index: number) => void;
};

const coordinates: [number, number][] = [
  [26.65, 87.28], // Eastern Terai
  [27.15, 85.55], // Eastern mid-hills
  [27.7172, 85.324], // Kathmandu Valley
  [28.55, 84.05], // Annapurna region
  [27.95, 82.55], // Western Siwalik
  [28.55, 80.65], // Far-western lowlands
];

const lagColors = ["#e2efd9", "#c7e2ba", "#a4d19d", "#78b982", "#4e9a70", "#2d7858", "#18543e"];

function markerColor(zone: Zone, layer: string) {
  if (layer === "correlation") {
    if (zone.r >= 0.73) return "#176b45";
    if (zone.r >= 0.68) return "#4e9a70";
    if (zone.r >= 0.63) return "#86b98a";
    return "#c7dcb8";
  }
  return lagColors[Math.min(6, Math.max(0, zone.lag))];
}

export default function NepalTopoMap({ locations, selected, layer, onSelect }: Props) {
  return (
    <div className="topo-map-shell">
      <MapContainer
        center={[28.25, 84.2]}
        zoom={6}
        minZoom={5}
        maxZoom={12}
        maxBounds={[[25.4, 78.5], [31.5, 89.7]]}
        maxBoundsViscosity={0.7}
        scrollWheelZoom
        className="nepal-leaflet-map"
      >
        <TileLayer
          attribution='Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · Terrain style © <a href="https://opentopomap.org">OpenTopoMap</a>'
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          maxZoom={17}
        />
        {locations.map((zone, index) => (
          <CircleMarker
            key={zone.name}
            center={coordinates[index]}
            radius={selected === index ? 10 : 7}
            pathOptions={{
              color: selected === index ? "#102f22" : "#ffffff",
              weight: selected === index ? 3 : 2,
              fillColor: markerColor(zone, layer),
              fillOpacity: 0.94,
            }}
            eventHandlers={{ click: () => onSelect(index) }}
          >
            <Tooltip direction="top" offset={[0, -7]}>
              <strong>{zone.name}</strong>
            </Tooltip>
            <Popup>
              <strong>{zone.name}</strong>
              <br />
              {zone.zone}, Nepal
              <br />
              {layer === "lag" ? `Illustrative response lag: ${zone.lag} month(s)` : `Illustrative correlation: r = ${zone.r.toFixed(2)}`}
              <br />
              <span>Prototype values — not yet a satellite-derived raster.</span>
              <br />
              <button type="button" onClick={() => onSelect(index)}>View zone details</button>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="topo-map-label">NEPAL · HIMALAYAN TERRAIN</div>
      <div className="topo-map-disclaimer">Topographic basemap · zone markers are illustrative, not pixel-level results</div>
    </div>
  );
}
