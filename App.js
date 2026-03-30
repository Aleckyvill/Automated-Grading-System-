import React, { useState } from "react";
import Navbar from "./components/Navbar";
import GradeForm from "./components/GradeForm";
import GradeTable from "./components/GradeTable";

function App() {
  const [grades, setGrades] = useState([]);

  const addGrade = (student) => {
    setGrades([...grades, student]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <GradeForm onAddGrade={addGrade} />
        <GradeTable grades={grades} />
      </div>
    </div>
  );
}

export default App;
