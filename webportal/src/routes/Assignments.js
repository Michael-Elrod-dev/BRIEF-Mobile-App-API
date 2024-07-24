import React from 'react';
import Graph3 from '../components/Graph3'
import Graph4 from '../components/Graph4'

//Google Charts used for data. Do more research on what is possible for 
//importing data and dynamic data. Used https://www.react-google-charts.com/examples 
//for coding all the graphs 


function Assignments() {
    return (
        <div className='assignments'>

  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Assignments</title>
  {/* Bootstrap */}
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
    crossOrigin="anonymous"
  />
  <link rel="stylesheet" href="./assets/css/main.css" />
  {/* Chart.js */}
  <main
    className="container bigger_box"
    style={{ backgroundColor: "#FC7753" }}
  >
    {/* Content */}
    <div className="row">
      {/* Information (Column 1) */}
      <div className="col-lg-6">
        {/* Search Bar */}
        <div className="row card text-white bg-light m-1" >
          <div className="input-group m-1">
            <div className="input-group-prepend">
              <label className="input-group-text" htmlFor="assignmentSelect" style={{backgroundColor: "#66D7D1"}}>
                Assignment
              </label>
            </div>
            {/* Options (Added with JavaScript) */}
            <select className="custom-select" id="assignmentSelect" style={{minWidth: '350px'}}/>
          </div>
        </div>
        {/* Table */}
        <div
          className="row card text-white bg-light m-1"
          style={{ minHeight: 425 }}
        >
          <table className="table table-hover" >
            {/* Headers */}
            <thead className="tableHeadPrimary" style={{color: 'white', backgroundColor: "#403D58"}}>
              <tr>
                <th scope="col">Student</th>
                <th scope="col">Attempts</th>
                <th scope="col">Current Best</th>
                <th scope="col">Previous Best</th>
              </tr>
            </thead>
            {/* Table Entries (Added with JavaScript) */}
            <tbody id="tableEntries" />
          </table>
        </div>
      </div>
      {/*Visualizations (Column 2)*/}
      <div className="col-lg-6">
        {/* Graph 1 (Line Graph) */}
        <div className="row card text-white bg-light m-1">
        <Graph3 />
          
        </div>
        {/* Graph 2 (Bar Graph)*/}
        <div className="row card text-white bg-light m-1">
          <Graph4 />
        </div>
      </div>
    </div>
  </main>
  {/* Footer */}
  <footer></footer>
  {/* Assignments Page JavaScript */}
  {/* Bootstrap */}
</div>
    )
}

export default Assignments