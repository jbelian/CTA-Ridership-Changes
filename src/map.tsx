//map.tsx

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { FeatureCollection } from "geojson";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { jawgToken } from "./token.tsx";
import doc from "./data/doc.json";
import { CombinedRoutes } from "./busData.tsx";

function busLinePopup(feature: any, layer: any) {
  layer.bindPopup(`This is the ${feature.properties.Name} bus line`);
}

const Map = ({ filteredRoutes }: { filteredRoutes: CombinedRoutes[] }) => {
  const matchingRoutes = doc.features.filter((feature) =>
    filteredRoutes.some((route) => route.route === feature.properties.ROUTE)
  );

  return (
    <MapContainer className="map" center={[41.8781, -87.63]} zoom={13}>
      <TileLayer
        attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${jawgToken}`}
      />
      <GeoJSON
        data={
          {
            type: "FeatureCollection",
            features: matchingRoutes,
          } as FeatureCollection
        }
        onEachFeature={busLinePopup}
      />
    </MapContainer>
  );
};

export default Map;
