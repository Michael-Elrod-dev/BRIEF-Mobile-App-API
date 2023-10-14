import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["x", "Students"],
  [50, 7],
  [60, 8],
  [70, 8],
  [80, 9],
  [90, 9],
  [100, 9],
  [120, 10],
  [130, 11],
];

export const options = {
  hAxis: {
    title: "Activity",
  },
  vAxis: {
    title: "Score",
  },
  series: {
    1: { curveType: "function" },
  },
};

export function Graph4() {
  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  ) 
}
export default Graph4