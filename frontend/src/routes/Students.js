import React from 'react';
import Graph1 from '../components/Graph1'
import Graph2 from '../components/Graph2'


function Students() {
    return (
        <div className='students'>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Students</title>
        {/* Bootstrap */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossOrigin="anonymous" />
        <link rel="stylesheet" href="./assets/css/main.css" />
        {/* Chart.js */}
        {/* Content */}
        <main className="container bigger_box" style={{backgroundColor: "#FC7753"}}>
          <div className="row">
            {/* Information (Column 1) */}
            <div className="col-lg-6">
              {/* Dropdown Search Bar */}
              <div className="row card text-white bg-light m-1"> 
                <div className="input-group m-1">
                  <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="studentSelect" style={{backgroundColor: "#66D7D1"}}>Student</label>
                  </div>
                  {/* Options (Added with JavaScript) */}
                  <select className="custom-select" id="studentSelect" style={{minWidth: '350px'}} />
                </div>
              </div>
              {/* Table */}
              <div className="row card text-white bg-light m-1" style={{minHeight: '425px'}}>
                <table className="table table-hover">
                  {/* Headers */}
                  <thead className="tableHeadPrimary" style={{color: 'white', backgroundColor: "#403D58"}}>
                    <tr>
                      <th scope="col">Assignment</th>
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
              {/* Graph 1 (If Statments) */}
              <div className="row card bg-light m-1">
                <h4>If Statements</h4>
                <Graph1/>
              </div>
              {/* Graph 2 (Bar Graph)*/}
              <div className="row card bg-light m-1">
                <h4>Student Activity vs. Class</h4>
                <Graph2/>
              </div>
            </div>
          </div>
        </main>
        {/* Footer */}
        <footer>
        </footer>
        {/* Student Page JavaScript */}
        {/* Bootstrap */}
      </div>
    )
};

export default Students 