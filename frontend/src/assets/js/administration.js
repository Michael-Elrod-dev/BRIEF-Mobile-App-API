// Table Functionality
const renderTable = (filepath) => {
    let selection;
    
    // Retrieves json file and converts data to be usable
    fetch(filepath)
    .then(response => response.json())

    // Uses data to add entries (rows) to table
    .then(s_Data => {
        let entries = "";
        for (let t = 0; t < s_Data.length; t++) {
            entries += `<tr>
                <td scope="row">${s_Data[t].firstName}</td>
                <td>${s_Data[t].email}</td>
                <td>${s_Data[t].password}</td>
                <td>${s_Data[t].school}</td>
            </tr>`;
        }
        return entries
    })

    // Sends results to HTML file
    .then(result => {
        document.getElementById('tableEntries').innerHTML = result;
    })

    // Search Functionality
    // (searches by firstname only)
    document.getElementById('adminSearch').addEventListener('input', () => {
        let tableValues = document.getElementsByTagName('tr')
        let filter = document.getElementById('adminSearch').value.toUpperCase()

        for (let i = 1; i < tableValues.length; i++) {
            let tableName = tableValues[i]
                .innerHTML.split("</td>")[0].trim().slice(16)
            
            if (tableName.toUpperCase().indexOf(filter) > -1) {
                tableValues[i].style.display= "";
            } else {
                tableValues[i].style.display="none";
            }
        }
    })
}

// Runs both functions after page finishes loading
window.onload = () => {
    renderTable('assets/json/studentData.json')
}