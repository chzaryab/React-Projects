import axios from 'axios';
import { SPLocation, UtilizationData } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5000';

// Generate dummy utilization data
const generateDummyUtilizationData = (days: number = 130): UtilizationData[] => {
  const data: UtilizationData[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() + i * 86400000); // Add `i` days
    const timestamp = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    data.push({
      timestamp,
      actualUtilization: 40 + Math.random() * 30, // Random between 40-70%
      predictedUtilization: 45 + Math.random() * 25, // Random between 45-70%
    });
  }

  return data;
};

// Generate dummy SP locations
const dummyLocations: SPLocation[] = [
  { id: '1', name: 'SP London Central', latitude: 51.505, longitude: -0.09 },
  { id: '2', name: 'SP Canary Wharf', latitude: 51.51, longitude: -0.1 },
  { id: '3', name: 'SP Westminster', latitude: 51.515, longitude: -0.095 },
  { id: '3', name: 'SP Westminster', latitude: 51.515, longitude: -0.099 }
];

const validateSPLocation = (location: any): location is SPLocation => {
  return (
    typeof location === 'object' &&
    typeof location.id === 'string' &&
    typeof location.name === 'string' &&
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number'
  );
};

const validateUtilizationData = (data: any): data is UtilizationData => {
  return (
    typeof data === 'object' &&
    typeof data.timestamp === 'string' &&
    typeof data.actualUtilization === 'number' &&
    typeof data.predictedUtilization === 'number'
  );
};

export const fetchSPLocations = async (): Promise<SPLocation[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sp_detail`);
    if (Array.isArray(response.data) && response.data.every(validateSPLocation)) {
      return response.data;
    }
    console.warn('Using dummy SP locations due to invalid API response format');
    return dummyLocations;
  } catch (error) {
    console.warn('Using dummy SP locations due to API error:', error);
    return dummyLocations;
  }
};

export const fetchUtilizationData = async (spIds: string): Promise<UtilizationData[]> => {
  try {
    const request_format = {
      sp_id: spIds,
    };
    const response = await axios.post(`${API_BASE_URL}/predict_utilization`, request_format);

    console.log("API Response:", response.data); // Log the response

    if (Array.isArray(response.data) && response.data.every(validateUtilizationData)) {
      return response.data;
    }
    return generateDummyUtilizationData()
    console.warn('Using dummy utilization data due to invalid API response format');
    
  } catch (error) {
    console.warn('Using dummy utilization data due to API error:', error);
    const dummy_data=generateDummyUtilizationData();
    console.log(dummy_data)
    return dummy_data;
    // return generateDummyUtilizationData();
  }

};