import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import Map from "./components/Map";
import { fetchSPLocations } from "./services/api";
import { SPLocation } from "./types";

const LoadingIndicator: React.FC = () => (
  <div className="text-center">
    <MapPin className="w-12 h-12 animate-bounce mx-auto text-blue-500" />
    <p className="mt-4 text-gray-600 font-medium">Loading locations...</p>
  </div>
);

const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="text-center bg-white p-8 rounded-lg shadow-lg">
    <div className="text-red-500 mb-4">
      <MapPin className="w-12 h-12 mx-auto" />
    </div>
    <p className="text-gray-800 font-medium mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Retry
    </button>
  </div>
);

const App: React.FC = () => {
  const [locations, setLocations] = useState<SPLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocations = async () => {
    try {
      const data = await fetchSPLocations();
      setLocations(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load SP locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState message={error} onRetry={loadLocations} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Map locations={locations} />
    </div>
  );
};

export default App;
