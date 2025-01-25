export interface SPLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface UtilizationData {
  timestamp: string;
  actualUtilization: number;
  predictedUtilization: number;
}

export interface APIResponse {
  success: boolean;
  data: UtilizationData[];
}