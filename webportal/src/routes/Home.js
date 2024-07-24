import React from 'react';
import "../App.css"
import { useState, Fragment } from 'react';
import data from "../moc-data.json";
import ReadOnlyRow from "../components/ReadOnlyRow";
import EditableRow from "../components/EditableRow";

function Home() {

  const[students,setStudents]=useState(data);

  const [addFormData, setAddFormData] = useState({
    fName: "",lName: "", email: "", school: "", password: "",
  });

  const [editFormData, setEditFormData] = useState({
    fName: "",lName: "", email: "", school: "", password: "",
  });
  const [editStudentId, setEditStudentId] = useState(null);

  const handleAddFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const filedValue = event.target.value;

    const newFormData = { ...addFormData};
    newFormData[fieldName] = filedValue;

    setAddFormData(newFormData);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();

    const newStudent = {
        fName: addFormData.fName,
        lName: addFormData.lName,
        email: addFormData.email,
        school: addFormData.school,
        password: addFormData.password,
    };
    const newStudents = [...students,newStudent];
    setStudents(newStudents);
};

const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedStudent = {
      id: editStudentId,
      fName: editFormData.fName,
        lName: editFormData.lName,
        email: editFormData.email,
        school: editFormData.school,
        password: editFormData.password,
    };

    const newStudents = [...students];

    const index = students.findIndex((student) => student.id === editStudentId);

    newStudents[index] = editedStudent;

    setStudents(newStudents);
    setEditStudentId(null);
  };

  const handleEditClick = (event, student) => {
    event.preventDefault();
    setEditStudentId(student.id);

    const formValues = {
        fName: student.fName,
        lName: student.lName,
        email: student.email,
        school: student.school,
        password: student.password,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditStudentId(null);
  };

  const handleDeleteClick = (studentId) => {
    const newStudents = [...students];

    const index = students.findIndex((student) => student.id === studentId);

    newStudents.splice(index, 1);

    setStudents(newStudents);
  };

    
    return (
        <div className='home'>
            <>
            <>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Administration</title>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
    crossOrigin="anonymous"
  />
  <link rel="stylesheet" href="./assets/css/main.css" />
</>
  <main
    className="container bigger_box"
    style={{ backgroundColor:  "#FC7753" }}
  >
    {/*Content*/}
    <div className="row">
      {/*Information (Column 1)*/}
      <div className="col-md-8">
        {/*Search Bar*/}
        <div className="row card text-white bg-light m-1">
          <div className="input-group m-1">
            <div className="form-outline">
              <input
                type="search"
                id="adminSearch"
                className="form-control"
                placeholder="Search"
              />
            </div>
          </div>
        </div>
        {/* Table */}
        <div
          className="row card text-white bg-light m-1"
          style={{ minHeight: 425 }}
        >
          <table className="table table-hover">
            {/* Headers */}
            <thead className="tableHeadPrimary" style={{color: 'white', backgroundColor: "#403D58"}}>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>School</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            {/* Table Entries (Added with JavaScript) */}
            <tbody id="tableEntries" >
            {students.map((students) => (
                <Fragment>
                {editStudentId === students.id ? (
                  <EditableRow
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                  />
                ) : (
                  <ReadOnlyRow
                  student={students}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                )}
              </Fragment>  
            ))}
           </tbody>  
          </table>
        </div>
        {/* Submit Button */}
        <div className="row mx-1">
          <button type="submit" className="btn btn-primary col-3 m-1" style={{backgroundColor: "#66D7D1"}}>
            Submit
          </button>
        </div>
      </div>
      
      {/* Registration (Column 2)*/}
      <div
        className="col-4 card text-black bg-light m-1 registrationForm"
        style={{ maxWidth: 350, maxHeight: 365 }}
      >

        {/* Student/Admin Button */}
        <form onSubmit={handleAddFormSubmit}>
        <div className="row">
          <button type="reset" className="btn btn-primary col m-1" style={{backgroundColor: "#66D7D1"}}>
            New Student
          </button>
          <button type="reset" className="btn btn-primary col m-1" style={{backgroundColor: "#66D7D1"}}>
            New Admin
          </button>
        </div>
        
        {/* First Name */}
        <div className="mb-2 row">
          <label
            htmlFor="InputFirstName"
            className="form-label col align-self-end text-center"
          >
            First Name
          </label>
          <input
            type="text"
            name="fName"
            className="form-control col mx-1"
            required="required"
            id="Fname_Input"
            onChange={handleAddFormChange}
          />
        </div>
        {/* Last Name */}
        <div className="mb-2 row">
          <label
            htmlFor="InputLastName"
            className="form-label col align-self-end text-center"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lName"
            className="form-control col mx-1"
            required="required"
            id="Lname_Input"
            onChange={handleAddFormChange}
          />
        </div>
        {/* Email */}
        <div className="mb-2 row">
          <label
            htmlFor="InputEmail"
            className="form-label col align-self-end text-center"
          >
            Email
          </label>
          <input
            type="text"
            name="email"
            className="form-control col mx-1"
            required="required"
            id="Email_Input"
            onChange={handleAddFormChange}
          />
        </div>
        {/* School */}
        <div className="mb-2 row">
          <label
            htmlFor="InputSchool"
            className="form-label col align-self-end text-center"
          >
            School
          </label>
          <input
            type="text"
            name="school"
            className="form-control col mx-1"
            id="School_Input"
            onChange={handleAddFormChange}
          />
        </div>
        {/* Password */}
        <div className="mb-2 row">
          <label
            htmlFor="InputNewPassword"
            className="form-label col align-self-end text-center"
          >
            New Password
          </label>
          <input
            type="password"
            name="password"
            className="form-control col mx-1"
            required="required"
            id="Pass_Input"
            onChange={handleAddFormChange}
          />
        </div>
        {/* Confirm Password */}
        <div className="row">
          <label
            htmlFor="InputConfirmPassword"
            className="form-label col align-self-end text-center"
          >
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control col mx-1"
            required="required"
            id="CPass_Input"
          />
        </div>
        {/* Create Button */}
        <div className="row">
          <button type="submit" className="btn btn-primary col m-1" style={{backgroundColor: "#66D7D1"}} >
            Create Account
          </button>
          </div>
          </form>
        </div>
      </div>
    
  </main>
  {/* Footer */}
  <footer></footer>
  {/* Administration Page JavaScript */}
  {/* Bootstrap */}
</>
</div>
    )
}

export default Home 