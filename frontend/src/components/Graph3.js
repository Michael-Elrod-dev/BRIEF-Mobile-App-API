import React from "react";
import { Chart } from "react-google-charts";
// Pie Chart for Assignments Page

export const data = [
  ["Task", "Completed"],
  ["Mastered", 60],
  ["Not Mastered", 50],
  ["Missing", 20],
];
export const options = {
  title: "Student Breakdown",
};

export function Graph3() {
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
export default Graph3
