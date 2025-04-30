import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

// Fonctions utilitaires pour extraire les stats à partir des anomalies
function computeStats(anomalies) {
  const bySite = {};
  const byProduct = {};
  const byType = {};
  const byMonth = {};

  anomalies.forEach(a => {
    const date = new Date(a.date);
    const month = date.toLocaleString("default", { month: "short" });

    bySite[a.site] = (bySite[a.site] || 0) + 1;
    byProduct[a.produit] = (byProduct[a.produit] || 0) + 1;
    byType[a.type_anomalie] = (byType[a.type_anomalie] || 0) + 1;
    byMonth[month] = (byMonth[month] || 0) + 1;
  });

  return {
    total: anomalies.length,
    bySite: Object.entries(bySite).map(([name, count]) => ({ name, count })),
    byProduct: Object.entries(byProduct).map(([name, count]) => ({ name, count })),
    byType: Object.entries(byType).map(([name, count]) => ({ name, count })),
    byMonth: Object.entries(byMonth)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([name, count]) => ({ mois: name, count }))
  };
}

function Dashboard({ anomalies }) {
  const stats = computeStats(anomalies);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* KPI Section */}
      <div style={{
        display: "flex",
        justifyContent: "space-around",
        marginBottom: "30px",
        flexWrap: "wrap"
      }}>
        <div style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          minWidth: "200px",
          margin: "10px"
        }}>
          <h2 style={{ color: "#333" }}>{stats.total}</h2>
          <p>Total Anomalies</p>
        </div>
      </div>

      {/* Graphiques */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        gap: "20px"
      }}>
        {/* Répartition par Site */}
        <div style={{ width: "45%", minWidth: "300px" }}>
          <h3 style={{ textAlign: "center" }}>Répartition par Site</h3>
          <BarChart width={400} height={250} data={stats.bySite}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={80}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Nombre d'anomalies" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Répartition par Type */}
        <div style={{ width: "45%", minWidth: "300px" }}>
          <h3 style={{ textAlign: "center" }}>Répartition par Type d’anomalie</h3>
          <PieChart width={400} height={250}>
            <Pie
              data={stats.byType}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {stats.byType.map((entry, index) => (
                <Cell key={`cell-type-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Répartition par Produit */}
        <div style={{ width: "45%", minWidth: "300px" }}>
          <h3 style={{ textAlign: "center" }}>Répartition par Produit</h3>
          <PieChart width={400} height={250}>
            <Pie
              data={stats.byProduct}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {stats.byProduct.map((entry, index) => (
                <Cell key={`cell-produit-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Évolution mensuelle */}
        <div style={{ width: "45%", minWidth: "300px" }}>
          <h3 style={{ textAlign: "center" }}>Évolution Mensuelle</h3>
          <LineChart width={400} height={250} data={stats.byMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" name="Anomalies" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;