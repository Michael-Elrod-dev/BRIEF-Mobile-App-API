import React from "react";

const ReadOnlyRow = ({ student, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td>{student.fName}</td>
      <td>{student.lName}</td>
      <td>{student.email}</td>
      <td>{student.school}</td>
      <td>{student.password}</td>
      <td>
        <button border-radius= "12px"
          type="button"
          onClick={(event) => handleEditClick(event, student)}
        >
          {/* Edit */}
        </button>
        <button type="button" border-radius= "12px" onClick={() => handleDeleteClick(student.id)}
        >
          {/* Delete */}
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;



