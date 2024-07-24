import React from "react";
import { Chart } from "react-google-charts";
// Bar chart for Students page 

export const data = [
  ["Student Activity", "Class"],
  ["9/1", 55],
  ["9/8", 49],
  ["9/15", 44],
  ["...", 24],
];

export const options = {
  chart: {
    title: "Student Performance",
    subtitle: "Sales, Expenses, and Profit: 2014-2017",
  },
};

export function Graph2() {
  return (
    <Chart
      chartType="Bar"
      width="100%"
      height="400px"
      data={data}
      options={options}

    />
  )
}
export default Graph2
