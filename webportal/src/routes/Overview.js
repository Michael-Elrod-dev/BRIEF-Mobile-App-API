import React from 'react';
import OverviewGraph from "../components/OverviewGraph"

function Overview() {
    return (
        <div className='overview'>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Overview</title>
        {/* Bootstrap */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossOrigin="anonymous" />
        <link href="assets/css/main.css" rel="stylesheet" />
        {/* Chart.js */}
        {/* load d3 v4 */}
        {/* d3 colorscales library */}
        <main className="container-fluid"> 
          {/* Insert main content of website: homepage - charts, graphs, overall student data */}
          <div className="row">
            <div className="col-md-8 card bg-light" id="overview_barchart_div">
              <h1>Student Activity</h1>
            </div>
            <div className="col-md-4 card bg-light progress_table_div">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Lessons Completed</th>
                  </tr>
                </thead>
                {/* table gets filled by JS script */}
                <tbody id="tableEntries">
                </tbody>
              </table>
            </div>
          </div>
          {/* Pie Charts and Cards */}
          <div className="row">
            {/* Build pie chart */}
            <div className="col-md-4 card bg-light">
              <h1>Lesson Engagement</h1>
              <OverviewGraph />
            </div>
            <div className="col-md-4 card bg-light" id="linechart_div">
              <h1>Student Logins</h1>
            </div>
            <div className="col-md-4 card bg-light">
              <h1>Quick Class Stats</h1>
              {/* card view, 6 cards, 2x3, nested */}
              {/* The data can be changed as needed, but will need API endpoint calls */}
              <div className="row row-cols-2 row-cols-3">
                <div className="col">
                  <div className="card" style={{width: '8rem'}}>
                    <div className="card-body">
                      <h6 className="card-title text-center">Questions Answered</h6>
                      <p className="card-text text-center">46</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card" style={{width: '8rem'}}>
                    <div className="card-body">
                      <h6 className="card-title text-center">Attempts Made</h6>
                      <p className="card-text text-center">16</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card" style={{width: '8rem'}}>
                    <div className="card-body">
                      <h6 className="card-title text-center">Lessons Completed</h6>
                      <p className="card-text text-center">8</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card" style={{width: '8rem'}}>
                    <div className="card-body">
                      <h6 className="card-title text-center"># Videos Watched</h6>
                      <p className="card-text text-center">10</p> 
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card" style={{width: '8rem'}}>
                    <div className="card-body">
                      <h6 className="card-title text-center">Badges Earned</h6>
                      <p className="card-text text-center">8</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card" style={{width: '8rem'}}>
                    <div className="card-body">
                      <h6 className="card-title text-center"># Badges Shared</h6>
                      <p className="card-text text-center">6</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* load js files implementing d3 plots */}
        {/* js file for table */}
      </div>
    )
}

export default Overview 