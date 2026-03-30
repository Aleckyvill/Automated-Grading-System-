import React from "react";

function GradeTable({ grades }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Grades</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Grade</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((student, index) => (
            <tr key={index}>
              <td className="border p-2">{student.name}</td>
              <td className="border p-2">{student.score}</td>
              <td className="border p-2 font-bold">{student.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GradeTable;
