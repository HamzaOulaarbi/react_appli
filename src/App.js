import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import AnomalyForm from "./components/AnomalyForm";
import ResultsTable from "./components/ResultsTable";
import Dashboard from "./components/Dashboard";

function App() {
  const [results, setResults] = useState([]);
  const [planAction, setPlanAction] = useState("");
  const [activeTab, setActiveTab] = useState("anomalies");
  const [allAnomalies, setAllAnomalies] = useState([]);

  // Charger les 5 anomalies similaires
  const fetchSimilarCases = async (text) => {
    try {
      const response = await fetch("http://localhost:5000/analyze?_=" + new Date().getTime(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setResults(data.similar_cases);
      setPlanAction(""); // Réinitialiser le plan d'action
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Générer un plan d'action
  const generatePlan = async (anomaly) => {
    try {
      const response = await fetch("http://localhost:5000/generate_plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anomaly }),
      });
      const data = await response.json();
      setPlanAction(data.plan_action);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Charger toutes les anomalies quand on clique sur l'onglet dashboard
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (activeTab === "dashboard" && !hasFetched) {
      fetchAllAnomalies();
      setHasFetched(true);
    }
  }, [activeTab, hasFetched]);

  const fetchAllAnomalies = async () => {
    try {
      const response = await fetch("http://localhost:5000/all_anomalies");
      const data = await response.json();
      setAllAnomalies(data.all_anomalies);
    } catch (error) {
      console.error("Erreur lors du chargement des anomalies :", error);
    }
  };

  return (
    <div className="container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "anomalies" && (
        <>
          <h1>Analyse des anomalies</h1>
          <AnomalyForm onSubmit={fetchSimilarCases} />
          <ResultsTable results={results} generatePlan={generatePlan} />
          {planAction && (
            <div style={{ marginTop: "20px", padding: "15px", background: "#e0ffe0", borderRadius: "5px" }}>
              <h3>Plan d'action pour la meilleure anomalie :</h3>
              <p>{planAction}</p>
            </div>
          )}
        </>
      )}
      {activeTab === "dashboard" && (
        <>
          <h1>Dashboard des anomalies</h1>
          {allAnomalies.length > 0 ? (
            <Dashboard anomalies={allAnomalies} />
          ) : (
            <p>Chargement des anomalies...</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;