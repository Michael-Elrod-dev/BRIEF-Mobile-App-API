import React from "react";
import { Chart } from "react-google-charts";
// Curved Line Chart for Assignments Page

export const data = [
  ["Year", "Sales", "Expenses", "Nothing"],
  ["100", 1000, 400, 300],
  ["200", 1170, 460, 800],
  ["300", 660, 1120, 900],
  ["400", 1030, 540, 200],
];

export const options = {
  title: "Student Performance",
  curveType: "function",
  legend: { position: "bottom" },
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

export default Graph4;