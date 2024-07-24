const renderTable = (filepath) => {
    fetch('assets/json/studentData.json')
    .then(results => results.json())
    .then(s_Data => {
        let entries = ""
        for(let t = 0; t < s_Data.length; t++){
            entries += `<tr>
                <td scope="row">${s_Data[t].firstName + " " +
                    s_Data[t].lastName}</td>
                <td>${s_Data[t].lessonsCompleted}</td>
                </tr>`;
        }
        return entries
    })
    .then(results => {
        document.getElementById('tableEntries').innerHTML = results
    })
}


window.onload = () => {
    renderTable('assets/json/studentData.json')
}