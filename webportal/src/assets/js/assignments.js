// Dropdown Bar Functionality
const renderDropdown = (filepath) => {

    // Retrieves json file and converts data to be usable
    fetch(filepath)
    .then(response => response.json())

    // Uses data to add options to dropdown
    .then(data => {
        let assignmentSearch = "<option selected>Choose...</option>";
        for (let i = 0; i < data.assignment.length; i++) {
            assignmentSearch += 
                `<option value="${i}">${data.assignment[i].name}</option>`
        }
        return assignmentSearch
    })

    // Sends results to HTML file
    .then(result => {
        document.getElementById('assignmentSelect').innerHTML = result;
    });
}

// Table Functionality
const renderTable = (filepath1, filepath2) => {
    let selection;
    
    document.getElementById("assignmentSelect").onchange = () => {
        selection = document.getElementById('assignmentSelect').selectedIndex

        // Choose... Option
        if (selection === 0) {
            document.getElementById('tableEntries').innerHTML = "";
        }

        // Other Options
        else {

            // Retrieves json file and converts data to be usable
            const promises = [];
            promises.push (
                fetch(filepath1),
                fetch(filepath2)
            )
            Promise.all(promises)
            .then(resultsArray => {
                let jsonArray = [];
                jsonArray.push (
                    resultsArray[0].json(),
                    resultsArray[1].json()
                )
                return Promise.all(jsonArray)
            })

            // Uses data to add entries (rows) to table
            .then(jsonArray => {

                let s_Data = jsonArray[0]  //StudentData.json 
                let a_Data = jsonArray[1]  //AssignmentData.json

                let entries = "";
                for (let t = 0; t < s_Data.length; t++) {
                    entries += `<tr>
                        <td scope="row">${s_Data[t].firstName}</td>
                        <td>${s_Data[t].assignmentList[selection - 1].attemptTotal}</td>
                        <td>${s_Data[t].assignmentList[selection - 1].bestScore + 
                            "/" + a_Data.assignment[selection - 1].maxPoints}</td>
                        <td>${s_Data[t].assignmentList[selection - 1].latestScore +
                            "/" + a_Data.assignment[selection - 1].maxPoints}</td>
                    </tr>`;
                }
                return entries
            })
            
            // Sends results to HTML file
            .then(result => {
                document.getElementById('tableEntries').innerHTML = result;
            })
        }
    }
}

// Runs both functions after page finishes loading
window.onload = () => {
    renderDropdown('assets/json/assignmentData.json')
    renderTable('assets/json/studentData.json', 'assets/json/assignmentData.json')
}


