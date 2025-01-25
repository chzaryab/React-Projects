import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, DivIcon } from "leaflet";
import { Activity } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { SPLocation, UtilizationData } from "../types";
import { fetchUtilizationData } from "../services/api";
import UtilizationChart from "./UtilizationChart";
import ErrorBoundary from "./ErrorBoundary";



const MemoizedUtilizationChart = React.memo(UtilizationChart);

const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const createLabelIcon = (id: string) =>
  new DivIcon({
    className: "custom-label-icon",
    html: `<div class="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">${id}</div>`,
    iconSize: [30, 20],
    iconAnchor: [15, 10],
  });

interface Props {
  locations: SPLocation[];
}

const Map: React.FC<Props> = ({ locations = [] }) => {
  const [selectedSP, setSelectedSP] = useState<string | null>(null);
  const [utilizationData, setUtilizationData] = useState<UtilizationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortController = useMemo(() => new AbortController(), []);

  useEffect(() => {
    const loadUtilizationData = async () => {
      if (selectedSP) {
        setLoading(true);
        setError(null);
        setUtilizationData([]); // Clear previous data before fetching new data

        try {
          const data = await fetchUtilizationData(selectedSP);
          setUtilizationData(data);
        } catch (err: any) {
          if (err.name !== "AbortError") {
            setError("Failed to load utilization data.");
          }
        } finally {
          setLoading(false);
        }
      }
    };

    loadUtilizationData();

    // Cleanup previous requests
    return () => abortController.abort();
  }, [selectedSP, abortController]);

  const center = locations.length > 0
    ? [locations[0].latitude, locations[0].longitude]
    : [51.505, -0.09]; // Default to London
  const zoom = locations.length > 0 ? 13 : 2; // Default zoom level

  const labelIcons = useMemo(
    () =>
      locations.reduce((acc, location) => {
        acc[location.id] = createLabelIcon(location.id);
        return acc;
      }, {} as Record<string, DivIcon>),
    [locations]
  );

  return (
    <div className="h-screen flex flex-col">
      <style>
        {`
          .custom-label-icon {
            z-index: 1000;
          }
          .leaflet-popup-content {
            margin: 0;
            width: 850px !important;
          }
        `}
      </style>
      <MapContainer
        center={center as [number, number]}
        zoom={zoom}
        className="flex-1 z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <React.Fragment key={location.id}>
            <Marker
              position={[location.latitude, location.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedSP(location.id),
              }}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-lg text-gray-800">
                      {location.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({location.id})
                    </span>
                  </div>
                  {error ? (
                    <div className="text-center text-red-500">{error}</div>
                  ) : loading ? (
                    <div className="flex items-center justify-center h-[200px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : utilizationData.length > 0 ? (
                    <ErrorBoundary>
                    <MemoizedUtilizationChart data={utilizationData} />
                    </ErrorBoundary>
                  ) : (
                    <div className="text-center text-gray-500">
                      No utilization data available.
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
            <Marker
              position={[location.latitude, location.longitude]}
              icon={labelIcons[location.id]}
              interactive={false}
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
