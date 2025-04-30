import React from "react";

function ResultsTable({ results, generatePlan }) {
  if (!results || results.length === 0) return null;

  return (
    <div>
      <h2>Cas similaires</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#ddd" }}>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Description</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Type anomalie</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Score</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Site</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Date</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Produit</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Serial Number</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item, index) => (
            <tr key={index} style={{ textAlign: "center", background: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.description}</td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.type_anomalie}</td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.similarity.toFixed(2)}</td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.site}</td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.date}</td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.produit}</td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.serial_number}</td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {index === 0 && (
                  <button onClick={() => generatePlan(item)} style={{ padding: "6px 12px", fontSize: "14px" }}>
                    Générer plan d’action
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;
