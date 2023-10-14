import React from "react";
import { Chart } from "react-google-charts";
// Pie Chart for overview Page

export const data = [
  ["Task", "Completed"],
  ["Attempted", 6],
  ["Completed", 5],
  ["Not Started", 2],
];
export const options = {
  title: "Lesson Engagement",
};

export function OverviewGraph() {
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
      fontName= {"Times New Roman"}
    />
  )
}
export default OverviewGraph
