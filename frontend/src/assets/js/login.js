
//Login Functionality
const loginFunction = (filepath) => {

    document.getElementById("formSubmit").addEventListener("click", () => {

        // Clear error messages (A bit funky though)
        document.getElementById('email_Error').innerHTML = ""
        document.getElementById('pass_Error').innerHTML = ""
        document.getElementById('inputEmail').style = ""
        document.getElementById('inputPass').style = ""

        // Retrieves json file and converts data to be usable
        fetch(filepath)
        .then(response => response.json())

        // Uses data to authorize email and password
        .then(s_Data => {
            let inputEmail = document.getElementById('inputEmail').value
            let inputPass = document.getElementById('inputPass').value

            // Check for email
            if (!inputEmail) {
                document.getElementById('email_Error').innerHTML = "Email Required"
                document.getElementById('inputEmail').style = "border-color: #dc3545;"
            }

            // Check for password
            else if (!inputPass) {
                document.getElementById('pass_Error').innerHTML = "Password Required"
                document.getElementById('inputPass').style = "border-color: #dc3545;"
            }
            
            // Authorization check
            else {
                let i = 0;
                while (i < s_Data.length) {
                    if (s_Data[i].email === inputEmail) {

                        // Email and Password are correct
                        if (s_Data[i].password === inputPass) {
                            window.open("./overview.html","_self")

                        // Password incorrect
                        } else {
                            document.getElementById('pass_Error').innerHTML = "Password incorrect"
                            document.getElementById('inputPass').style = "border-color: #dc3545;"
                            document.getElementById('inputPass').value = ""
                        }
                        break;
                    }
                    i++;
                }

                // Email not found in json file (or future backend data)
                if (i === s_Data.length) {
                    document.getElementById('email_Error').innerHTML = "Email doesnt exist"
                    document.getElementById('inputEmail').style = "border-color: #dc3545;"
                }
            }
        })
    })
}

// Runs both functions after page finishes loading
window.onload = () => {
    loginFunction('assets/json/studentData.json')

    //Possibly could clear both email and password inputs here
}

/*
    Future Ideas
    - Should maybe use hashes and salts for passwords
    - Functionality of "keep me signed in" checkbox
        (Or maybe just remove it for security issues)
*/

/*
    SmithMark@aol.com           #password1
    JinkonsCarl@aol.com         #password2
    TahmsRebecca@gmail.com      #password3
    WeathersDiana@gmail.com     #password4
    HopkinsHenry@gmail.com      #password5
*/