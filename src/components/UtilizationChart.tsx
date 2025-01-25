import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";


export interface UtilizationData {
  timestamp: string;
  actualUtilization: number;
  predictedUtilization: number;
  
}

const UtilizationChart: React.FC<{ data: UtilizationData[] }> = ({ data }) => {
  const categories = useMemo(() => data.map((item) => item.timestamp), [data]);
  const actualData = useMemo(() => data.map((item) => item.actualUtilization), [data]);
  const predictedData = useMemo(() => data.map((item) => item.predictedUtilization), [data]);

  const series = useMemo(
    () => [
      { name: "Actual Utilization (%)", data: actualData },
      { name: "Predicted Utilization (%)", data: predictedData },
    ],
    [actualData, predictedData]
  );

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "line", // Must match one of the valid types
        height: 500,
        toolbar: { show: false },
        events:{
      
        }
      },
      stroke: { width: [3, 3], dashArray: [0, 8] },
      colors: ["#4BC0C0", "#9966FF"],
      xaxis: {
        categories,
        title: { text: "Date", style: { fontSize: "14px", fontWeight: "bold" } },
      },
      yaxis: {
        title: { text: "Utilization (%)", style: { fontSize: "14px", fontWeight: "bold" } },
        min: 0,
        max: 100,
      },
      legend: { position: "top", horizontalAlign: "center" },
      title: {
        text: "Utilization Overview",
        align: "center",
        style: { fontSize: "16px", fontWeight: "bold" },
      },
    }),
    [categories]
  );

  return (
    <div className="w-full h-[600px] w-[800px] bg-white p-6 rounded-lg shadow-lg">
      <ReactApexChart options={options} series={series} type="line" height={500} width={750} />
    </div>
  );
};

export default UtilizationChart;
