import React, { useState } from "react";

function AnomalyForm({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Décrivez l'anomalie ici..."
        rows="4"
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />
      <br />
      <button type="submit" style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}>
        Rechercher les cas similaires
      </button>
    </form>
  );
}

export default AnomalyForm;
